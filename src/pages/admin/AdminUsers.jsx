import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { collection, onSnapshot, doc, updateDoc, setDoc, deleteDoc, getDocs, query, where } from 'firebase/firestore';
import { 
  User, ShoppingBag, Award, Heart, Ban, ShieldAlert, Search, Hash, 
  Check, Plus, Edit2, Trash2, X, Mail, Shield, Calendar, Eye, Sparkles
} from 'lucide-react';

const CupSodaIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 8 1.75 12.28A2 2 0 0 0 9.73 22h4.54a2 2 0 0 0 1.98-1.72L18 8"/>
    <path d="M5 8h14"/>
    <path d="M7 15h10"/>
    <path d="m9 8 1-6"/>
    <path d="m15 8-1-6"/>
  </svg>
);

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [viewingUser, setViewingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    numeric_id: '',
    stamps: 1,
    beverageStamps: 0,
    role: 'user',
    isBanned: false
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const latestFsProfilesRef = React.useRef([]);

  const mergeAndSetUsers = (fsProfiles = []) => {
    let localProfiles = [];
    try {
      localProfiles = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
    } catch (e) {}

    const profileMap = new Map();
    localProfiles.forEach(p => {
      if (p.id || p.email) profileMap.set(p.id || p.email, p);
    });

    const targetFs = fsProfiles.length > 0 ? fsProfiles : latestFsProfilesRef.current;
    targetFs.forEach(p => {
      if (p.id || p.email) {
        const existing = profileMap.get(p.id || p.email) || {};
        profileMap.set(p.id || p.email, { ...existing, ...p });
      }
    });

    const merged = Array.from(profileMap.values());
    merged.sort((a, b) => (Number(b.numeric_id) || 0) - (Number(a.numeric_id) || 0));
    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => {
    mergeAndSetUsers([]);

    const handleLocalUpdate = () => mergeAndSetUsers(latestFsProfilesRef.current);
    window.addEventListener('ems_users_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    if (!isFirebaseConfigured) {
      setLoading(false);
      return () => {
        window.removeEventListener('ems_users_updated', handleLocalUpdate);
        window.removeEventListener('storage', handleLocalUpdate);
      };
    }

    // 1. Real-time profiles listener
    const unsubscribeProfiles = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const profilesData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      latestFsProfilesRef.current = profilesData;
      mergeAndSetUsers(profilesData);
    }, (error) => {
      console.warn('Firestore profiles onSnapshot warning:', error);
    });

    // 2. Real-time orders listener to aggregate order counts
    const unsubscribeOrders = onSnapshot(collection(db, 'orders'), (snapshot) => {
      const ordersData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setOrders(ordersData);
    }, (error) => {
      console.warn('Firestore orders onSnapshot error:', error);
    });

    return () => {
      window.removeEventListener('ems_users_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubscribeProfiles();
      unsubscribeOrders();
    };
  }, []);

  // ── CREATE USER (With Unique EMCODE Verification) ──
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      alert('Please enter a name and email.');
      return;
    }

    try {
      // Find highest existing numeric_id to guarantee absolute uniqueness
      const existingIds = users.map(u => Number(u.numeric_id) || 0);
      let assignedId = Number(formData.numeric_id);

      if (!assignedId || existingIds.includes(assignedId)) {
        assignedId = Math.max(1000, ...existingIds) + 1;
      }

      const docId = `user_${Date.now()}`;
      
      const newProfile = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        numeric_id: assignedId,
        stamps: Math.min(10, Math.max(0, Number(formData.stamps) || 0)),
        beverageStamps: Math.min(10, Math.max(0, Number(formData.beverageStamps) || 0)),
        role: formData.role || 'user',
        isBanned: false,
        favourites: [],
        created_at: new Date().toISOString()
      };

      setUsers(prev => [newProfile, ...prev]);

      if (isFirebaseConfigured) {
        await setDoc(doc(db, 'profiles', docId), newProfile);
      }

      // Local storage cache update
      try {
        const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
        localStorage.setItem('ems_user_profiles', JSON.stringify([{ id: docId, ...newProfile }, ...local]));
        window.dispatchEvent(new Event('ems_users_updated'));
      } catch (err) {}

      setIsAddModalOpen(false);
      setFormData({ name: '', email: '', numeric_id: '', stamps: 1, beverageStamps: 0, role: 'user', isBanned: false });
      showToast(`Customer "${newProfile.name}" created (EM${assignedId})!`);
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Failed to create customer: ' + err.message);
    }
  };

  // ── UPDATE USER ──
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const updatedFields = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        numeric_id: Number(formData.numeric_id) || editingUser.numeric_id,
        stamps: Math.min(10, Math.max(0, Number(formData.stamps) || 0)),
        beverageStamps: Math.min(10, Math.max(0, Number(formData.beverageStamps) || 0)),
        role: formData.role || 'user',
        isBanned: Boolean(formData.isBanned)
      };

      setUsers(prev => prev.map(u => (u.id === editingUser.id || u.email === editingUser.email) ? { ...u, ...updatedFields } : u));

      if (isFirebaseConfigured && editingUser.id) {
        await updateDoc(doc(db, 'profiles', editingUser.id), updatedFields);
      }

      // Local storage cache update
      try {
        const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
        const updated = local.map(u => u.id === editingUser.id ? { ...u, ...updatedFields } : u);
        localStorage.setItem('ems_user_profiles', JSON.stringify(updated));
        window.dispatchEvent(new Event('ems_users_updated'));
      } catch (err) {}

      setEditingUser(null);
      showToast(`Customer "${updatedFields.name}" updated!`);
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Failed to update customer: ' + err.message);
    }
  };

  // ── DELETE USER (Everywhere from Firestore + Local Cache) ──
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      const targetId = userToDelete.id;
      const targetEmail = userToDelete.email?.toLowerCase();
      const targetNumericId = userToDelete.numeric_id;

      // 1. Optimistically remove from state
      setUsers(prev => prev.filter(u => u.id !== targetId && u.email !== targetEmail));

      // 2. Delete primary document and any ghost duplicates in Firestore
      if (isFirebaseConfigured) {
        if (targetId) {
          try {
            await deleteDoc(doc(db, 'profiles', targetId));
          } catch (e) {}
        }

        // Clean up any duplicate profile documents with same email
        if (targetEmail) {
          try {
            const qSnap = await getDocs(query(collection(db, 'profiles'), where('email', '==', targetEmail)));
            for (const d of qSnap.docs) {
              await deleteDoc(doc(db, 'profiles', d.id));
            }
          } catch (e) {}
        }
      }

      // 3. Local storage purge
      try {
        const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
        const filtered = local.filter(u => u.id !== targetId && u.email?.toLowerCase() !== targetEmail);
        localStorage.setItem('ems_user_profiles', JSON.stringify(filtered));
        window.dispatchEvent(new Event('ems_users_updated'));
      } catch (err) {}

      showToast(`Customer "${userToDelete.name || targetEmail}" deleted everywhere.`);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete customer: ' + err.message);
    }
  };

  // ── TOGGLE BAN ──
  const toggleBanUser = async (userId, currentStatus) => {
    try {
      if (isFirebaseConfigured) {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, { isBanned: !currentStatus });
      }

      try {
        const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
        const updated = local.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u);
        localStorage.setItem('ems_user_profiles', JSON.stringify(updated));
        window.dispatchEvent(new Event('ems_users_updated'));
      } catch (e) {}

      showToast(currentStatus ? 'Customer unbanned.' : 'Customer banned.');
    } catch (error) {
      console.error('Error toggling ban status:', error);
      alert('Failed to update ban status: ' + error.message);
    }
  };

  // Aggregate orders by user ID and user email
  const orderCounts = orders.reduce((acc, order) => {
    if (order.user_id) {
      acc[order.user_id] = (acc[order.user_id] || 0) + 1;
    }
    if (order.user_email) {
      acc[order.user_email] = (acc[order.user_email] || 0) + 1;
    }
    return acc;
  }, {});

  // Flexible search filtering
  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    const rawTerm = searchTerm.toLowerCase().trim();
    const cleanDigits = rawTerm.replace(/\D/g, '');

    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const numId = String(user.numeric_id || '');
    const emCode = `em${numId.padStart(4, '0')}`;

    return (
      name.includes(rawTerm) ||
      email.includes(rawTerm) ||
      (cleanDigits && numId.includes(cleanDigits)) ||
      emCode.includes(rawTerm.replace(/[^a-z0-9]/g, ''))
    );
  });

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      numeric_id: user.numeric_id || '',
      stamps: user.stamps || 0,
      beverageStamps: user.beverageStamps || 0,
      role: user.role || 'user',
      isBanned: Boolean(user.isBanned)
    });
  };

  if (loading) {
    return <div className="p-8 text-center text-dark/60 font-bold">Loading customer database...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-heading font-bold text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Customer Database</h2>
          <p className="text-dark/60 mt-1">Manage accounts, Burger & Beverage loyalty stamps, and permissions.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-72">
            <Search className="w-4 h-4 text-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search EMCODE, name, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-dark/15 rounded-xl text-sm font-medium focus:outline-none focus:border-primary shadow-sm"
            />
          </div>

          {/* Add Customer Button */}
          <button
            onClick={() => {
              const maxExisting = Math.max(1000, ...users.map(u => Number(u.numeric_id) || 0));
              setFormData({
                name: '',
                email: '',
                numeric_id: String(maxExisting + 1),
                stamps: 1,
                beverageStamps: 0,
                role: 'user',
                isBanned: false
              });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-sm rounded-xl shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus size={16} />
            <span>Add Customer</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-dark/10 shadow-sm">
          <div className="text-dark/50 text-xs font-bold uppercase tracking-wider mb-1">Total Registered Customers</div>
          <div className="text-4xl font-heading font-black text-primary">{users.length}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-dark/10 shadow-sm">
          <div className="text-dark/50 text-xs font-bold uppercase tracking-wider mb-1">Total Lifetime Orders</div>
          <div className="text-4xl font-heading font-black text-dark">{orders.length}</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-dark/10 shadow-sm">
          <div className="text-dark/50 text-xs font-bold uppercase tracking-wider mb-1">Active Loyalty Members</div>
          <div className="text-4xl font-heading font-black text-emerald-600">
            {users.filter(u => (u.stamps || 0) > 0 || (u.beverageStamps || 0) > 0).length}
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-dark/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream-light border-b border-dark/10 text-xs uppercase font-heading font-black text-dark/70 tracking-wider">
                <th className="p-4">Customer & EMCODE</th>
                <th className="p-4 text-center">Total Orders</th>
                <th className="p-4 text-center">Burger Stamps</th>
                <th className="p-4 text-center">Beverage Stamps</th>
                <th className="p-4">Role & Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark/5 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-dark/40 font-medium">
                    No customers found matching "{searchTerm}".
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const name = user.name || user.email?.split('@')[0] || 'Customer';
                  const formattedEmCode = `EM${String(user.numeric_id || 1000).padStart(4, '0').slice(-4)}`;
                  const userOrders = orderCounts[user.id] || orderCounts[user.email] || 0;

                  return (
                    <tr key={user.id} className="hover:bg-black/[0.01] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-lg shrink-0">
                            {name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-bold ${user.isBanned ? 'text-red-600 line-through' : 'text-dark'}`}>
                                {name}
                              </span>
                              <span className="inline-flex items-center gap-0.5 bg-dark text-cream px-2 py-0.5 rounded-md font-mono text-xs font-bold">
                                <Hash size={10} />
                                {formattedEmCode}
                              </span>
                              {user.isBanned && (
                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                                  Banned
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-dark/60 mt-0.5">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-dark/5 font-bold text-dark text-xs">
                          <ShoppingBag size={12} />
                          {userOrders} orders
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/15 text-dark font-heading font-bold text-xs">
                          <img src="/logoo.svg" alt="Burger" className="w-3.5 h-3.5 object-contain" />
                          <span>{user.stamps || 0}/10</span>
                        </span>
                      </td>

                      <td className="p-4 text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 font-heading font-bold text-xs">
                          <CupSodaIcon className="w-3.5 h-3.5 text-blue-600" />
                          <span>{user.beverageStamps || 0}/10</span>
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role || 'User'}
                        </span>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View Customer */}
                          <button
                            onClick={() => setViewingUser(user)}
                            className="p-2 text-dark/60 hover:text-dark hover:bg-dark/5 rounded-lg transition-colors"
                            title="View Customer Profile"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Edit Customer */}
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Customer Details"
                          >
                            <Edit2 size={16} />
                          </button>

                          {/* Ban / Unban */}
                          <button
                            onClick={() => toggleBanUser(user.id, user.isBanned)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.isBanned 
                                ? 'text-emerald-700 hover:bg-emerald-50' 
                                : 'text-amber-600 hover:bg-amber-50'
                            }`}
                            title={user.isBanned ? 'Unban Customer' : 'Ban Customer'}
                          >
                            <Ban size={16} />
                          </button>

                          {/* Delete Customer */}
                          <button
                            onClick={() => setUserToDelete(user)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Customer Everywhere"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── CREATE USER MODAL ── */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-dark/10 flex justify-between items-center">
              <h3 className="font-heading font-black text-xl text-dark">Add New Customer</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-dark/40 hover:text-dark rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. rahul@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">EMCODE (Auto Unique)</label>
                <input
                  type="number"
                  value={formData.numeric_id}
                  onChange={(e) => setFormData({ ...formData, numeric_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Burger Stamps (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.stamps}
                    onChange={(e) => setFormData({ ...formData, stamps: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Beverage Stamps (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.beverageStamps}
                    onChange={(e) => setFormData({ ...formData, beverageStamps: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Account Role</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                >
                  <option value="user">Customer (User)</option>
                  <option value="admin">Administrator (Admin)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-dark/10">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-dark/15 text-dark font-bold text-sm hover:bg-dark/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-sm shadow-md"
                >
                  Create Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT USER MODAL ── */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-dark/10 flex justify-between items-center">
              <h3 className="font-heading font-black text-xl text-dark">Edit Customer Details</h3>
              <button onClick={() => setEditingUser(null)} className="p-2 text-dark/40 hover:text-dark rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">EMCODE (Numeric)</label>
                <input
                  type="number"
                  value={formData.numeric_id}
                  onChange={(e) => setFormData({ ...formData, numeric_id: e.target.value })}
                  className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Burger Stamps (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.stamps}
                    onChange={(e) => setFormData({ ...formData, stamps: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Beverage Stamps (0-10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={formData.beverageStamps}
                    onChange={(e) => setFormData({ ...formData, beverageStamps: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="user">Customer (User)</option>
                    <option value="admin">Administrator (Admin)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Account Status</label>
                  <select
                    value={formData.isBanned ? 'banned' : 'active'}
                    onChange={(e) => setFormData({ ...formData, isBanned: e.target.value === 'banned' })}
                    className="w-full px-4 py-2.5 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="active">Active (Normal)</option>
                    <option value="banned">Banned (Suspended)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-dark/10">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-5 py-2.5 rounded-xl border border-dark/15 text-dark font-bold text-sm hover:bg-dark/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-sm shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── VIEW USER DETAILS MODAL ── */}
      {viewingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-dark/10 flex justify-between items-center">
              <h3 className="font-heading font-black text-xl text-dark">Customer Profile</h3>
              <button onClick={() => setViewingUser(null)} className="p-2 text-dark/40 hover:text-dark rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-3xl">
                  {(viewingUser.name || viewingUser.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-dark">{viewingUser.name || 'Customer'}</h4>
                  <span className="inline-flex items-center gap-1 bg-dark text-cream px-2 py-0.5 rounded-md font-mono text-xs font-bold mt-1">
                    <Hash size={10} />
                    EM{String(viewingUser.numeric_id || 1000).padStart(4, '0').slice(-4)}
                  </span>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-dark/10 text-sm">
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Email</span>
                  <span className="font-medium text-dark">{viewingUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Burger Stamps</span>
                  <span className="font-bold text-primary">{viewingUser.stamps || 0} / 10 Stamps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Beverage Stamps</span>
                  <span className="font-bold text-blue-700">{viewingUser.beverageStamps || 0} / 10 Stamps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Lifetime Orders</span>
                  <span className="font-bold text-dark">{orderCounts[viewingUser.id] || orderCounts[viewingUser.email] || 0} orders</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Role</span>
                  <span className="font-bold capitalize">{viewingUser.role || 'User'}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-cream-light border-t border-dark/10 flex justify-end gap-2">
              <button
                onClick={() => {
                  const u = viewingUser;
                  setViewingUser(null);
                  openEditModal(u);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-heading font-bold text-xs shadow-sm"
              >
                Edit Customer
              </button>
              <button
                onClick={() => setViewingUser(null)}
                className="px-4 py-2 bg-dark text-white rounded-xl font-heading font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DELETE CONFIRMATION MODAL ── */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-heading font-black text-xl text-red-600">Delete Customer?</h3>
            <p className="text-sm text-dark/70">
              Are you sure you want to permanently delete <strong>{userToDelete.name || userToDelete.email}</strong>? This will remove the customer from all admin views and databases.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2 rounded-xl border border-dark/15 text-dark font-bold text-sm hover:bg-dark/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-sm shadow-md"
              >
                Delete Everywhere
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
