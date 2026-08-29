import React, { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Search, Plus, Minus, Coffee, Hash, Trash2, Award, Check, Sparkles } from 'lucide-react';

const CupSodaIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 8 1.75 12.28A2 2 0 0 0 9.73 22h4.54a2 2 0 0 0 1.98-1.72L18 8"/>
    <path d="M5 8h14"/>
    <path d="M7 15h10"/>
    <path d="m9 8 1-6"/>
    <path d="m15 8-1-6"/>
  </svg>
);

export function AdminLoyalty() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

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

    const unsubscribe = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const profilesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      latestFsProfilesRef.current = profilesData;
      mergeAndSetUsers(profilesData);
    }, (err) => {
      console.warn('Admin loyalty onSnapshot warning:', err);
    });

    return () => {
      window.removeEventListener('ems_users_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubscribe();
    };
  }, []);

  // Update Burger Stamps (0-10)
  const adminUpdateBurgerStamps = async (userId, newStamps) => {
    const clamped = Math.max(0, Math.min(10, newStamps));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, stamps: clamped } : u));
    latestFsProfilesRef.current = latestFsProfilesRef.current.map(u => u.id === userId ? { ...u, stamps: clamped } : u);

    if (isFirebaseConfigured && userId) {
      try {
        await updateDoc(doc(db, 'profiles', userId), { stamps: clamped });
      } catch (err) {
        console.error('Failed to update burger stamps in Firestore:', err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
      const updated = local.map(u => u.id === userId ? { ...u, stamps: clamped } : u);
      localStorage.setItem('ems_user_profiles', JSON.stringify(updated));
    } catch (e) {}

    showToast(`Burger stamps updated to ${clamped}/10`);
  };

  // Update Beverage Stamps (0-10)
  const adminUpdateBeverageStamps = async (userId, newStamps) => {
    const clamped = Math.max(0, Math.min(10, newStamps));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, beverageStamps: clamped } : u));
    latestFsProfilesRef.current = latestFsProfilesRef.current.map(u => u.id === userId ? { ...u, beverageStamps: clamped } : u);

    if (isFirebaseConfigured && userId) {
      try {
        await updateDoc(doc(db, 'profiles', userId), { beverageStamps: clamped });
      } catch (err) {
        console.error('Failed to update beverage stamps in Firestore:', err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
      const updated = local.map(u => u.id === userId ? { ...u, beverageStamps: clamped } : u);
      localStorage.setItem('ems_user_profiles', JSON.stringify(updated));
    } catch (e) {}

    showToast(`Beverage stamps updated to ${clamped}/10`);
  };

  // Delete Customer
  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id && u.email !== userToDelete.email));

      if (isFirebaseConfigured && userToDelete.id) {
        await deleteDoc(doc(db, 'profiles', userToDelete.id));
      }

      try {
        const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
        const filtered = local.filter(u => u.id !== userToDelete.id && u.email !== userToDelete.email);
        localStorage.setItem('ems_user_profiles', JSON.stringify(filtered));
        window.dispatchEvent(new Event('ems_users_updated'));
      } catch (err) {}

      showToast(`Customer "${userToDelete.name || userToDelete.email}" deleted.`);
      setUserToDelete(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('Failed to delete customer: ' + err.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const cleanDigits = term.replace(/\D/g, '');

    const name = (user.name || '').toLowerCase();
    const email = (user.email || '').toLowerCase();
    const numId = String(user.numeric_id || '');
    const emCode = `em${numId.padStart(4, '0')}`;

    return (
      name.includes(term) ||
      email.includes(term) ||
      (cleanDigits && numId.includes(cleanDigits)) ||
      emCode.includes(term.replace(/[^a-z0-9]/g, ''))
    );
  });

  if (loading) {
    return <div className="pt-20 text-center text-dark/50 font-bold">Loading loyalty club records...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-heading font-bold text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Loyalty Stamp Override</h2>
          <p className="text-dark/60 mt-1">Manage Burger Club (10th Free) and Beverage Club (10th Free) stamps.</p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark/40" size={18} />
          <input 
            type="text" 
            placeholder="Search EMCODE, customer, email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-dark/15 rounded-xl text-sm font-medium focus:outline-none focus:border-primary shadow-sm"
          />
        </div>
      </div>

      {/* Customer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => {
          const name = user.name || user.email.split('@')[0];
          const burgerStamps = user.stamps || 0;
          const beverageStamps = user.beverageStamps || 0;
          const formattedEmCode = `EM${String(user.numeric_id || 1000).padStart(4, '0').slice(-4)}`;

          return (
            <div key={user.id} className="bg-white rounded-3xl p-6 border border-dark/10 shadow-sm flex flex-col justify-between gap-6 hover:shadow-md transition-shadow">
              
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-lg text-dark">{name}</h3>
                    <span className="inline-flex items-center gap-0.5 bg-dark text-cream px-2 py-0.5 rounded-md font-mono text-xs font-bold">
                      <Hash size={10} />
                      {formattedEmCode}
                    </span>
                  </div>
                  <p className="text-xs text-dark/60 mt-0.5">{user.email}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold font-heading text-lg">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <button
                    onClick={() => setUserToDelete(user)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    title="Delete Customer Profile"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Two-Part Punch Card Section */}
              <div className="space-y-4">
                
                {/* 1. Burger Club Stamps (0-10) */}
                <div className="bg-accent/10 rounded-2xl p-4 border border-accent/25">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2 text-dark font-heading font-black text-sm">
                      <img src="/logoo.svg" alt="Burger" className="w-4 h-4 object-contain" />
                      <span>Burger Club Stamps</span>
                    </div>
                    <span className="font-mono font-black text-sm text-primary">{burgerStamps} / 10</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => adminUpdateBurgerStamps(user.id, burgerStamps - 1)}
                      disabled={burgerStamps <= 0}
                      className="w-8 h-8 rounded-lg bg-white border border-dark/15 flex items-center justify-center text-dark hover:bg-cream disabled:opacity-40 transition-colors shadow-sm font-black"
                    >
                      <Minus size={14} />
                    </button>
                    
                    <div className="flex-1 h-3 bg-dark/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300" 
                        style={{ width: `${(burgerStamps / 10) * 100}%` }}
                      />
                    </div>

                    <button 
                      onClick={() => adminUpdateBurgerStamps(user.id, burgerStamps + 1)}
                      disabled={burgerStamps >= 10}
                      className="w-8 h-8 rounded-lg bg-accent text-dark font-black flex items-center justify-center hover:bg-accent-hover disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {burgerStamps >= 10 && (
                    <div className="mt-2 text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>🎉 Free Burger Reward Unlocked!</span>
                    </div>
                  )}
                </div>

                {/* 2. Beverage Club Stamps (0-10) */}
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2 text-blue-900 font-heading font-black text-sm">
                      <CupSodaIcon className="w-4 h-4 text-blue-600" />
                      <span>Beverage Club Stamps</span>
                    </div>
                    <span className="font-mono font-black text-sm text-blue-700">{beverageStamps} / 10</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => adminUpdateBeverageStamps(user.id, beverageStamps - 1)}
                      disabled={beverageStamps <= 0}
                      className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-dark hover:bg-blue-100 disabled:opacity-40 transition-colors shadow-sm font-black"
                    >
                      <Minus size={14} />
                    </button>
                    
                    <div className="flex-1 h-3 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300" 
                        style={{ width: `${(beverageStamps / 10) * 100}%` }}
                      />
                    </div>

                    <button 
                      onClick={() => adminUpdateBeverageStamps(user.id, beverageStamps + 1)}
                      disabled={beverageStamps >= 10}
                      className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 transition-colors shadow-sm"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {beverageStamps >= 10 && (
                    <div className="mt-2 text-[11px] font-bold text-blue-800 flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>🥤 Free Drink/Shake Unlocked!</span>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="col-span-full py-16 text-center text-dark/40 font-medium bg-white rounded-3xl border border-dark/10">
            No customer accounts found matching "{searchTerm}".
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-heading font-black text-xl text-red-600">Delete Customer?</h3>
            <p className="text-sm text-dark/70">
              Are you sure you want to delete <strong>{userToDelete.name || userToDelete.email}</strong> from the database?
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
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
