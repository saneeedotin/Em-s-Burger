import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Search, Plus, Minus, Coffee } from 'lucide-react';

export function AdminLoyalty() {
  const { users, adminUpdateUserLoyalty } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Loyalty Override</h2>
        <p className="text-dark/60 mt-1">Manually assign stamps for walk-in customers or system corrections.</p>
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-dark/5">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark/40" size={20} />
          <input 
            type="text" 
            placeholder="Search customer by name or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-cream/50 border-none focus:ring-2 focus:ring-primary text-dark"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-3xl p-6 border border-dark/5 shadow-sm flex flex-col gap-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-lg text-dark">{user.name}</h3>
                <p className="text-sm text-dark/50">{user.email}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center text-primary font-bold font-heading text-xl">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="space-y-4">
              {/* Burger Points */}
              <div className="bg-accent/10 rounded-2xl p-4 border border-accent/20">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-accent font-bold">
                    <img src="/logoo.svg" alt="Burger" className="w-5 h-5 object-contain" />
                    Burger Stamps
                  </div>
                  <span className="font-mono font-bold text-dark">{user.loyaltyPoints} / 9</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => adminUpdateUserLoyalty(user.id, user.loyaltyPoints - 1, 'burger')}
                    disabled={user.loyaltyPoints <= 0}
                    className="w-10 h-10 rounded-xl bg-white border border-dark/10 flex items-center justify-center text-dark hover:bg-cream disabled:opacity-50 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 h-3 bg-dark/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-accent transition-all" 
                      style={{ width: `${(user.loyaltyPoints / 9) * 100}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => adminUpdateUserLoyalty(user.id, user.loyaltyPoints + 1, 'burger')}
                    disabled={user.loyaltyPoints >= 9}
                    className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center hover:bg-accent-hover disabled:opacity-50 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {/* Beverage Points */}
              <div className="bg-[#F3732A]/10 rounded-2xl p-4 border border-[#F3732A]/20">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2 text-[#F3732A] font-bold">
                    <Coffee size={18} />
                    Beverage Stamps
                  </div>
                  <span className="font-mono font-bold text-dark">{user.beveragePoints} / 9</span>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => adminUpdateUserLoyalty(user.id, user.beveragePoints - 1, 'beverage')}
                    disabled={user.beveragePoints <= 0}
                    className="w-10 h-10 rounded-xl bg-white border border-dark/10 flex items-center justify-center text-dark hover:bg-cream disabled:opacity-50 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <div className="flex-1 h-3 bg-dark/5 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#F3732A] transition-all" 
                      style={{ width: `${(user.beveragePoints / 9) * 100}%` }}
                    />
                  </div>
                  <button 
                    onClick={() => adminUpdateUserLoyalty(user.id, user.beveragePoints + 1, 'beverage')}
                    disabled={user.beveragePoints >= 9}
                    className="w-10 h-10 rounded-xl bg-[#F3732A] text-white flex items-center justify-center hover:brightness-95 disabled:opacity-50 transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredUsers.length === 0 && (
          <div className="col-span-full py-12 text-center text-dark/50">
            No customers found matching "{searchTerm}"
          </div>
        )}
      </div>
    </div>
  );
}
