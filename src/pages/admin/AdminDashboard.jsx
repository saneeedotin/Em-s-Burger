import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { Search, Hash, User, Mail, Award, ShoppingBag, Coffee, Star, Sparkles, Flame, Utensils } from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const q = query(collection(db, 'profiles'), orderBy('created_at', 'desc'));
      const querySnapshot = await getDocs(q);
      const profilesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
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

  const filteredUsers = users.filter(user => {
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
          Find customers instantly using their 4-digit hash code, name, or email to view details or manage loyalty.
        </p>
      </div>

      <div className="relative group">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search className="h-8 w-8 text-primary/50 group-focus-within:text-primary transition-colors" />
        </div>
        <input
          type="text"
          className="w-full bg-white border-2 border-dark/10 text-dark rounded-3xl py-6 pl-20 pr-8 text-2xl font-heading font-bold shadow-sm focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all outline-none placeholder:text-dark/20"
          placeholder="Enter 4-digit hash #, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
        />
        <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
          <Hash className="h-6 w-6 text-dark/20" />
        </div>
      </div>

      {searchTerm && (
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
                              #{user.numeric_id || user.hash_id?.replace('#', '')}
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

                      <Link 
                        to="/admin/users" 
                        className="px-5 py-2.5 bg-white border-2 border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl font-heading font-bold transition-colors h-11 flex items-center mt-5"
                      >
                        View User
                      </Link>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {!searchTerm && (
        <div className="pt-12 text-center opacity-40">
          <Hash className="w-16 h-16 mx-auto mb-4" />
          <p className="font-heading font-bold text-xl">Start typing to search the database</p>
        </div>
      )}
    </div>
  );
}
