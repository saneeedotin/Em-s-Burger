import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Search, Hash, User, Mail, Award, ShoppingBag, Coffee, Star, Sparkles, Flame, Utensils, X, Ban } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterMode, setFilterMode] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'profiles'));
      const profilesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort users locally by numeric_id (newest first) to avoid missing profiles without created_at
      profilesData.sort((a, b) => {
        if (a.numeric_id && b.numeric_id) {
          return b.numeric_id - a.numeric_id;
        }
        return 0;
      });

      setUsers(profilesData);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const adminUpdateUserLoyalty = async (userId, newStamps) => {
    try {
      const userRef = doc(db, 'profiles', userId);
      await updateDoc(userRef, { stamps: newStamps });
      
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, stamps: newStamps } : u));
    } catch (err) {
      console.error('Failed to update stamps', err);
      alert('Failed to update stamps');
    }
  };

  const toggleBanUser = async (userId, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this user?`)) {
      try {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, {
          isBanned: !currentStatus
        });
        
        // Update both the main users list and the currently selected user in the modal
        setUsers(users.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
        if (selectedUser && selectedUser.id === userId) {
          setSelectedUser({ ...selectedUser, isBanned: !currentStatus });
        }
      } catch (error) {
        console.error('Error toggling ban status:', error);
        alert('Failed to update ban status.');
      }
    }
  };

  const filteredUsers = users.filter(user => {
    // If filterMode is banned, exclude non-banned users
    if (filterMode === 'banned' && !user.isBanned) return false;

    if (!searchTerm) return filterMode === 'banned'; // Show all banned if no search term

    const term = searchTerm.toLowerCase();
    return (
      (user.name && user.name.toLowerCase().includes(term)) ||
      (user.email && user.email.toLowerCase().includes(term)) ||
      (user.numeric_id && user.numeric_id.toString().includes(term)) ||
      (user.hash_id && user.hash_id.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return <div className="pt-20 text-center text-dark/50">Loading customer database...</div>;
  }

  return (
    <div className="relative max-w-4xl mx-auto space-y-8 pt-10 px-4 z-10">
      
      {/* Background Doodles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1] opacity-[0.03]">
        <Star className="absolute top-[10%] left-[10%] w-24 h-24 rotate-12" />
        <Coffee className="absolute top-[20%] right-[15%] w-32 h-32 -rotate-12" />
        <Flame className="absolute bottom-[20%] left-[20%] w-40 h-40 rotate-6" />
        <Utensils className="absolute bottom-[10%] right-[10%] w-28 h-28 -rotate-12" />
        <Sparkles className="absolute top-[40%] left-[30%] w-16 h-16 rotate-45" />
        <Hash className="absolute top-[50%] right-[25%] w-20 h-20 -rotate-6" />
      </div>
      
      <div className="text-center space-y-4">
        <h2 className="text-4xl md:text-5xl font-heading font-black text-dark tracking-tight">Customer Search</h2>
        <p className="text-dark/60 text-lg max-w-xl mx-auto">
          Find customers instantly using their EMCODE, name, or email to view details or manage loyalty.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-8 w-8 text-primary/50 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          className="w-full bg-white border-2 border-dark/10 text-dark rounded-3xl py-6 pl-20 pr-8 text-2xl font-heading font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none placeholder:text-dark/20"
          placeholder="Enter EMCODE, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
          <Hash className="h-6 w-6 text-dark/20" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${
            filterMode === 'all' ? 'bg-dark text-white' : 'bg-white border-2 border-dark/10 text-dark/60 hover:text-dark hover:border-dark/20'
          }`}
        >
          All Customers
        </button>
        <button
          onClick={() => setFilterMode('banned')}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-colors flex items-center gap-1 ${
            filterMode === 'banned' ? 'bg-red-600 text-white' : 'bg-white border-2 border-dark/10 text-dark/60 hover:text-red-600 hover:border-red-200'
          }`}
        >
          <Ban size={14} />
          Banned Users
        </button>
      </div>

      {(searchTerm || filterMode === 'banned') && (
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-dark/60 text-lg px-2">Results ({filteredUsers.length})</h3>
          
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dark/5 shadow-sm">
              <p className="text-dark/50 text-lg">No customers found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map(user => {
                const name = user.name || user.email.split('@')[0];
                return (
                  <div key={user.id} className="bg-white rounded-3xl p-6 border border-dark/5 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-2xl">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-xl text-dark">{name}</h4>
                          {(user.numeric_id || user.hash_id) && (
                            <span className="inline-flex items-center gap-1 bg-dark text-cream px-2 py-0.5 rounded-lg font-mono text-sm font-bold">
                              <Hash size={12} />
                              EM{user.numeric_id || user.hash_id?.replace('#', '')}
                            </span>
                          )}
                        </div>
                        <p className="text-dark/60 flex items-center gap-1.5 text-sm mt-1">
                          <Mail size={14} />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center">
                        <span className="text-dark/50 text-[10px] font-bold uppercase tracking-wider mb-2">Total Stamps</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono font-bold text-dark bg-cream px-3 py-1.5 rounded-lg text-lg border border-dark/5">{user.stamps || 0}/10</span>
                          <button 
                            onClick={() => adminUpdateUserLoyalty(user.id, (user.stamps || 0) + 1)}
                            disabled={(user.stamps || 0) >= 10}
                            className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50 shadow-sm"
                            title="Add Stamp"
                          >
                            <img src="/logoo.svg" alt="Burger" className="w-5 h-5 object-contain brightness-0 invert" />
                          </button>
                        </div>
                      </div>

                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="px-5 py-2.5 bg-white border-2 border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl font-heading font-bold transition-colors h-11 flex items-center mt-5"
                      >
                        View User
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* User Info Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 text-dark/40 hover:text-dark hover:bg-dark/5 rounded-full transition-colors"
            >
              <X size={24} />
            </button>
            <div className="p-8 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-3xl">
                  {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark">{selectedUser.name || 'Unknown'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    {(selectedUser.numeric_id || selectedUser.hash_id) && (
                      <span className="inline-flex items-center gap-1 bg-dark text-cream px-2 py-0.5 rounded-md font-mono text-xs font-bold">
                        <Hash size={10} />
                        EM{selectedUser.numeric_id || selectedUser.hash_id?.replace('#', '')}
                      </span>
                    )}
                    {selectedUser.isBanned && (
                       <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase flex items-center gap-1">Banned</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-dark/10">
                <div>
                  <label className="text-xs font-bold text-dark/40 uppercase tracking-wider block mb-1">Email</label>
                  <div className="text-dark font-medium flex items-center gap-2">
                    <Mail size={16} className="text-dark/40" />
                    {selectedUser.email}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-dark/40 uppercase tracking-wider block mb-1">Loyalty Stamps</label>
                  <div className="text-dark font-bold flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    {selectedUser.stamps || 0} / 10
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-dark/40 uppercase tracking-wider block mb-1">Role</label>
                    <div className="text-dark font-medium capitalize">
                      {selectedUser.role || 'User'}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-dark/40 uppercase tracking-wider block mb-1">Created At</label>
                    <div className="text-dark font-medium text-sm">
                      {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-cream/30 border-t border-dark/5 flex justify-between items-center">
              <button
                onClick={() => toggleBanUser(selectedUser.id, selectedUser.isBanned)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
                  selectedUser.isBanned 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Ban size={18} />
                {selectedUser.isBanned ? 'Unban User' : 'Ban User'}
              </button>
              
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-6 py-2.5 bg-dark text-white rounded-xl font-bold hover:bg-dark/90 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {(!searchTerm && filterMode !== 'banned') && (
        <div className="pt-12 text-center opacity-40">
          <Hash className="w-16 h-16 mx-auto mb-4" />
          <p className="font-heading font-bold text-xl">Start typing to search the database</p>
        </div>
      )}
    </div>
  );
}
