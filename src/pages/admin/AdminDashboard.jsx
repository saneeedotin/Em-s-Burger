import React, { useState, useEffect, useRef } from 'react';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { collection, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { 
  Search, User, Award, ShieldAlert, Ban, Check, X, 
  ShoppingBag, Mail, Phone, Calendar, ArrowRight, Hash, Sparkles, Plus, Minus, Flame, Moon, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoreStatus } from '../../context/StoreStatusContext';

const CupSodaIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 8 1.75 12.28A2 2 0 0 0 9.73 22h4.54a2 2 0 0 0 1.98-1.72L18 8"/>
    <path d="M5 8h14"/>
    <path d="M7 15h10"/>
    <path d="m9 8 1-6"/>
    <path d="m15 8-1-6"/>
  </svg>
);

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [liveCarts, setLiveCarts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'banned'
  const [toastMessage, setToastMessage] = useState('');

  const { isOpen, customMessage, updateStoreStatus, toggleStoreStatus } = useStoreStatus();
  const [storeMsgInput, setStoreMsgInput] = useState(customMessage || '');

  useEffect(() => {
    setStoreMsgInput(customMessage || '');
  }, [customMessage]);

  const latestFsProfilesRef = useRef([]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

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

    // 1. Real-time Customer Profiles listener
    const unsubscribeUsers = onSnapshot(collection(db, 'profiles'), (snapshot) => {
      const profilesData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      latestFsProfilesRef.current = profilesData;
      mergeAndSetUsers(profilesData);
    }, (error) => {
      console.warn('Firestore profiles onSnapshot warning:', error);
    });

    // 2. Real-time Live Carts listener
    const unsubscribeCarts = onSnapshot(collection(db, 'live_carts'), (snapshot) => {
      const cartsData = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      cartsData.sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
      setLiveCarts(cartsData);
    }, (error) => {
      console.warn('Live carts onSnapshot error:', error);
    });

    return () => {
      window.removeEventListener('ems_users_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubscribeUsers();
      unsubscribeCarts();
    };
  }, []);

  // Update Burger Stamps (0-10)
  const adminUpdateBurgerStamps = async (userId, newStamps) => {
    const clamped = Math.max(0, Math.min(10, newStamps));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, stamps: clamped } : u));
    latestFsProfilesRef.current = latestFsProfilesRef.current.map(u => u.id === userId ? { ...u, stamps: clamped } : u);

    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => ({ ...prev, stamps: clamped }));
    }

    if (isFirebaseConfigured && userId) {
      try {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, { stamps: clamped });
      } catch (err) {
        console.error('Failed to update burger stamps in Firestore:', err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
      const updated = local.map(u => u.id === userId ? { ...u, stamps: clamped } : u);
      localStorage.setItem('ems_user_profiles', JSON.stringify(updated));
    } catch (e) {}

    showToast(`Burger stamps updated to ${clamped}/10!`);
  };

  // Update Beverage Stamps (0-10)
  const adminUpdateBeverageStamps = async (userId, newStamps) => {
    const clamped = Math.max(0, Math.min(10, newStamps));
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, beverageStamps: clamped } : u));
    latestFsProfilesRef.current = latestFsProfilesRef.current.map(u => u.id === userId ? { ...u, beverageStamps: clamped } : u);

    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(prev => ({ ...prev, beverageStamps: clamped }));
    }

    if (isFirebaseConfigured && userId) {
      try {
        const userRef = doc(db, 'profiles', userId);
        await updateDoc(userRef, { beverageStamps: clamped });
      } catch (err) {
        console.error('Failed to update beverage stamps in Firestore:', err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
      const updated = local.map(u => u.id === userId ? { ...u, beverageStamps: clamped } : u);
      localStorage.setItem('ems_user_profiles', JSON.stringify(updated));
    } catch (e) {}

    showToast(`Beverage stamps updated to ${clamped}/10!`);
  };

  const toggleBanUser = async (userId, currentStatus) => {
    if (window.confirm(`Are you sure you want to ${currentStatus ? 'unban' : 'ban'} this customer?`)) {
      try {
        if (isFirebaseConfigured && userId) {
          const userRef = doc(db, 'profiles', userId);
          await updateDoc(userRef, { isBanned: !currentStatus });
        }
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !currentStatus } : u));
        showToast(currentStatus ? 'Customer account unbanned.' : 'Customer account banned.');
      } catch (error) {
        console.error('Error toggling ban status:', error);
        alert('Failed to update ban status: ' + error.message);
      }
    }
  };

  // Universal flexible search (matches EM1001, 1001, #EM-1001, Name, Email)
  const filteredUsers = users.filter(user => {
    if (filterMode === 'banned' && !user.isBanned) return false;
    if (!searchTerm) return filterMode === 'banned';

    const rawTerm = searchTerm.toLowerCase().trim();
    const cleanDigits = rawTerm.replace(/\D/g, ''); // Extract just numbers (e.g. 1001)

    const userName = (user.name || '').toLowerCase();
    const userEmail = (user.email || '').toLowerCase();
    const userNumId = String(user.numeric_id || '');
    const formattedEmCode = `em${userNumId.padStart(4, '0')}`; // e.g. em1001

    return (
      userName.includes(rawTerm) ||
      userEmail.includes(rawTerm) ||
      (cleanDigits && userNumId.includes(cleanDigits)) ||
      formattedEmCode.includes(rawTerm.replace(/[^a-z0-9]/g, ''))
    );
  });

  if (loading) {
    return <div className="pt-20 text-center text-dark/50 font-bold">Loading live customer database...</div>;
  }

  return (
    <div className="relative max-w-5xl mx-auto space-y-8 pt-6 px-4 z-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-xl font-heading font-bold text-sm flex items-center gap-2 animate-fadeIn">
          <Check className="w-5 h-5" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 🏪 Kitchen & Store Availability Control */}
      <div className={`p-6 sm:p-7 rounded-3xl border-2 shadow-sm transition-all ${
        isOpen 
          ? 'bg-emerald-500/5 border-emerald-500/30' 
          : 'bg-red-500/5 border-red-500/30'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                {isOpen && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
              </span>
              <h3 className="font-heading font-black text-xl text-dark uppercase tracking-tight">
                Store Status: {isOpen ? '🟢 Currently OPEN' : '🔴 Currently CLOSED'}
              </h3>
            </div>
            <p className="text-xs text-dark/70 font-medium">
              Controls the live "Store Open / Store Closed" indicator on the Homepage and Navbar across all customers.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                await toggleStoreStatus();
                showToast(isOpen ? 'Store marked as CLOSED.' : 'Store marked as OPEN.');
              }}
              className={`px-6 py-3 rounded-2xl font-heading font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95 flex items-center gap-2 ${
                isOpen
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isOpen ? (
                <>
                  <Moon className="w-4 h-4" />
                  <span>Switch to Store Closed</span>
                </>
              ) : (
                <>
                  <Flame className="w-4 h-4" />
                  <span>Switch to Store Open</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Custom Status Announcement Input */}
        <div className="mt-5 pt-4 border-t border-dark/10 flex flex-col sm:flex-row gap-3 items-center">
          <div className="flex-1 w-full">
            <label className="block text-[11px] font-extrabold uppercase tracking-wider text-dark/60 mb-1">
              Live Announcement / Hours Note:
            </label>
            <input
              type="text"
              value={storeMsgInput}
              onChange={(e) => setStoreMsgInput(e.target.value)}
              placeholder="e.g. Grill is Sizzling! Walk-ins & Table Orders Welcome"
              className="w-full px-4 py-2.5 rounded-xl border border-dark/15 bg-white text-xs font-medium text-dark focus:outline-none focus:border-primary"
            />
          </div>
          <button
            onClick={async () => {
              await updateStoreStatus(isOpen, storeMsgInput);
              showToast('Live announcement message updated!');
            }}
            className="w-full sm:w-auto mt-auto py-2.5 px-5 rounded-xl bg-dark hover:bg-black text-cream font-heading font-black text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            Save Message
          </button>
        </div>
      </div>

      {/* Live Active Carts Monitor */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-accent/20 rounded-2xl text-accent">
            <ShoppingBag size={20} className="stroke-[2.5]" />
          </div>
          <div>
            <h3 className="font-heading font-black text-xl text-dark">Live Active Carts</h3>
            <p className="text-xs text-dark/60">Customers currently building orders right now.</p>
          </div>
        </div>

        {liveCarts.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-dark/40 font-medium border border-dark/5 shadow-sm">
            No active customer carts right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveCarts.map((cart) => (
              <div key={cart.id} className="bg-white rounded-3xl p-5 border border-dark/10 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-sm text-dark block">{cart.userName || cart.userEmail?.split('@')[0]}</span>
                    <span className="text-xs text-dark/50">{cart.userEmail}</span>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-black px-2.5 py-1 rounded-full">
                    ₹{cart.cartTotal || 0}
                  </span>
                </div>
                
                <div className="space-y-1 pt-2 border-t border-dark/5 text-xs text-dark/70 max-h-24 overflow-y-auto">
                  {(cart.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span>{item.quantity}x {item.name}</span>
                      <span className="font-medium text-dark">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Universal Customer Search Section */}
      <div className="space-y-6 pt-4 border-t border-dark/10">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="font-heading font-black text-4xl text-dark tracking-tight">
            Universal Customer Search
          </h2>
          <p className="text-dark/60 text-sm">
            Find customers instantly by typing their <strong>EMCODE</strong> (e.g. EM1001 or 1001), name, or email.
          </p>
        </div>

        {/* Big Search Input */}
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-primary w-6 h-6" />
          <input
            type="text"
            placeholder="Type EMCODE (e.g. 1001, EM1001), name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-16 pr-14 py-4 bg-white rounded-3xl border-2 border-primary/20 focus:border-primary focus:outline-none shadow-xl text-lg font-medium text-dark transition-all placeholder:text-dark/30"
          />
          {searchTerm ? (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-6 top-1/2 -translate-y-1/2 text-dark/30 hover:text-dark p-1"
            >
              <X size={20} />
            </button>
          ) : (
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-dark/20 font-mono text-xl">#</span>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex justify-center gap-2">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${
              filterMode === 'all' 
                ? 'bg-dark text-white shadow-sm' 
                : 'bg-white text-dark/60 hover:bg-cream-light border border-dark/10'
            }`}
          >
            All Customers ({users.length})
          </button>
          <button
            onClick={() => setFilterMode('banned')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors flex items-center gap-1 ${
              filterMode === 'banned' 
                ? 'bg-red-600 text-white shadow-sm' 
                : 'bg-white text-red-600 hover:bg-red-50 border border-red-200'
            }`}
          >
            <Ban size={12} />
            Banned Users ({users.filter(u => u.isBanned).length})
          </button>
        </div>
      </div>

      {/* Search Results List */}
      {(searchTerm || filterMode === 'banned') && (
        <div className="space-y-4">
          <div className="flex justify-between items-center px-2">
            <span className="text-xs font-bold text-dark/50 uppercase tracking-wider">
              Results ({filteredUsers.length})
            </span>
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-dark/5 shadow-sm">
              <p className="text-dark/50 text-lg font-medium">No customers found matching "{searchTerm}"</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredUsers.map(user => {
                const name = user.name || user.email?.split('@')[0] || 'Customer';
                const burgerStamps = user.stamps || 0;
                const beverageStamps = user.beverageStamps || 0;
                const formattedEmCode = `EM${String(user.numeric_id || 1000).padStart(4, '0').slice(-4)}`;

                return (
                  <div key={user.id} className="bg-white rounded-3xl p-6 border border-dark/10 shadow-sm hover:shadow-md transition-shadow flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    
                    {/* Left: Customer Avatar & Info */}
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-2xl shrink-0">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-xl text-dark">{name}</h4>
                          <span className="inline-flex items-center gap-0.5 bg-dark text-cream px-2.5 py-0.5 rounded-lg font-mono text-xs font-bold">
                            <Hash size={12} />
                            {formattedEmCode}
                          </span>
                          {user.isBanned && (
                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">
                              Banned
                            </span>
                          )}
                        </div>
                        <p className="text-dark/60 flex items-center gap-1.5 text-xs mt-1">
                          <Mail size={13} />
                          {user.email}
                        </p>
                      </div>
                    </div>

                    {/* Right: Dual Stamp Modifier Controllers + View Button */}
                    <div className="flex flex-wrap items-center gap-4">
                      
                      {/* 1. Burger Stamps (- [x/10] +) */}
                      <div className="bg-accent/15 px-3.5 py-2 rounded-2xl border border-accent/25 flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-dark">
                          <img src="/logoo.svg" alt="Burger" className="w-4 h-4 object-contain" />
                          <span>Burger:</span>
                        </div>
                        <button
                          onClick={() => adminUpdateBurgerStamps(user.id, burgerStamps - 1)}
                          disabled={burgerStamps <= 0}
                          className="w-7 h-7 bg-white rounded-lg border border-dark/15 flex items-center justify-center text-dark hover:bg-cream disabled:opacity-40 font-black text-xs transition-colors shadow-sm"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-mono font-black text-sm text-primary px-1">
                          {burgerStamps}/10
                        </span>
                        <button
                          onClick={() => adminUpdateBurgerStamps(user.id, burgerStamps + 1)}
                          disabled={burgerStamps >= 10}
                          className="w-7 h-7 bg-accent text-dark rounded-lg flex items-center justify-center hover:bg-accent-hover disabled:opacity-40 font-black text-xs transition-colors shadow-sm"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* 2. Beverage Stamps (- [x/10] +) */}
                      <div className="bg-blue-50 px-3.5 py-2 rounded-2xl border border-blue-200 flex items-center gap-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                          <CupSodaIcon className="w-4 h-4 text-blue-600" />
                          <span>Drinks:</span>
                        </div>
                        <button
                          onClick={() => adminUpdateBeverageStamps(user.id, beverageStamps - 1)}
                          disabled={beverageStamps <= 0}
                          className="w-7 h-7 bg-white rounded-lg border border-blue-200 flex items-center justify-center text-dark hover:bg-blue-100 disabled:opacity-40 font-black text-xs transition-colors shadow-sm"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-mono font-black text-sm text-blue-700 px-1">
                          {beverageStamps}/10
                        </span>
                        <button
                          onClick={() => adminUpdateBeverageStamps(user.id, beverageStamps + 1)}
                          disabled={beverageStamps >= 10}
                          className="w-7 h-7 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 font-black text-xs transition-colors shadow-sm"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      {/* View Profile Button */}
                      <button 
                        onClick={() => setSelectedUser(user)}
                        className="px-4 py-2 bg-white border-2 border-primary/20 text-primary hover:bg-primary hover:text-white rounded-xl font-heading font-bold text-xs transition-all shadow-sm"
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
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 relative">
            <button 
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-2 text-dark/40 hover:text-dark hover:bg-dark/5 rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="p-7 space-y-6">
              
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-heading font-black text-3xl shrink-0">
                  {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-dark">{selectedUser.name || 'Customer'}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center gap-1 bg-dark text-cream px-2 py-0.5 rounded-md font-mono text-xs font-bold">
                      <Hash size={10} />
                      EM{String(selectedUser.numeric_id || 1000).padStart(4, '0').slice(-4)}
                    </span>
                    {selectedUser.isBanned && (
                       <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px] font-black uppercase">Banned</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Dual Loyalty Stamp Controllers */}
              <div className="space-y-3 pt-4 border-t border-dark/10">
                <span className="text-xs font-bold text-dark/50 uppercase tracking-wider block">Modify Loyalty Rewards</span>

                {/* 1. Burger Stamps */}
                <div className="bg-accent/10 rounded-2xl p-4 border border-accent/25 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-dark font-heading font-black">
                      <img src="/logoo.svg" alt="Burger" className="w-4 h-4 object-contain" />
                      Burger Club Stamps
                    </span>
                    <span className="font-mono font-black text-sm text-primary">{selectedUser.stamps || 0}/10</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adminUpdateBurgerStamps(selectedUser.id, (selectedUser.stamps || 0) - 1)}
                      disabled={(selectedUser.stamps || 0) <= 0}
                      className="w-8 h-8 rounded-lg bg-white border border-dark/15 flex items-center justify-center text-dark hover:bg-cream font-black disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="flex-1 h-3 bg-dark/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-300"
                        style={{ width: `${((selectedUser.stamps || 0) / 10) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={() => adminUpdateBurgerStamps(selectedUser.id, (selectedUser.stamps || 0) + 1)}
                      disabled={(selectedUser.stamps || 0) >= 10}
                      className="w-8 h-8 rounded-lg bg-accent text-dark flex items-center justify-center hover:bg-accent-hover font-black disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                {/* 2. Beverage Stamps */}
                <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200 space-y-2">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="flex items-center gap-1.5 text-blue-900 font-heading font-black">
                      <CupSodaIcon className="w-4 h-4 text-blue-600" />
                      Beverage Club Stamps
                    </span>
                    <span className="font-mono font-black text-sm text-blue-700">{selectedUser.beverageStamps || 0}/10</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => adminUpdateBeverageStamps(selectedUser.id, (selectedUser.beverageStamps || 0) - 1)}
                      disabled={(selectedUser.beverageStamps || 0) <= 0}
                      className="w-8 h-8 rounded-lg bg-white border border-blue-200 flex items-center justify-center text-dark hover:bg-blue-100 font-black disabled:opacity-40"
                    >
                      <Minus size={14} />
                    </button>
                    <div className="flex-1 h-3 bg-blue-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${((selectedUser.beverageStamps || 0) / 10) * 100}%` }}
                      />
                    </div>
                    <button
                      onClick={() => adminUpdateBeverageStamps(selectedUser.id, (selectedUser.beverageStamps || 0) + 1)}
                      disabled={(selectedUser.beverageStamps || 0) >= 10}
                      className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 font-black disabled:opacity-40"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

              </div>

              {/* Account Details */}
              <div className="space-y-2 pt-2 border-t border-dark/10 text-xs">
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Email</span>
                  <span className="font-medium text-dark">{selectedUser.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Role</span>
                  <span className="font-bold capitalize">{selectedUser.role || 'User'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark/50 font-bold">Registered</span>
                  <span className="font-medium text-dark">
                    {selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Active'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 bg-cream-light border-t border-dark/10 flex justify-between items-center">
              <button
                onClick={() => {
                  toggleBanUser(selectedUser.id, selectedUser.isBanned);
                  setSelectedUser(prev => ({ ...prev, isBanned: !prev.isBanned }));
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs transition-all ${
                  selectedUser.isBanned 
                    ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' 
                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                <Ban size={14} />
                {selectedUser.isBanned ? 'Unban' : 'Ban'}
              </button>
              
              <button 
                onClick={() => setSelectedUser(null)}
                className="px-5 py-2 bg-dark text-white rounded-xl font-bold text-xs hover:bg-dark/90 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {(!searchTerm && filterMode !== 'banned') && (
        <div className="pt-12 text-center opacity-40">
          <Hash className="w-16 h-16 mx-auto mb-4" />
          <p className="font-heading font-bold text-xl">Type an EMCODE, name, or email above to search</p>
        </div>
      )}
    </div>
  );
}
