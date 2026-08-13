import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { User, ShoppingBag, Award, Heart } from 'lucide-react';

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // In a real production app, counting orders per user should be a view or aggregate query.
      // For this migration, we will fetch profiles and then a summary of orders if possible,
      // but to keep it simple we'll just fetch profiles and fetch all orders to aggregate locally.
      
      const [profilesRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('user_id, id')
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (ordersRes.error) throw ordersRes.error;

      // Aggregate orders by user
      const orderCounts = (ordersRes.data || []).reduce((acc, order) => {
        acc[order.user_id] = (acc[order.user_id] || 0) + 1;
        return acc;
      }, {});

      const formattedUsers = (profilesRes.data || []).map(profile => ({
        id: profile.id,
        name: profile.name || profile.email.split('@')[0],
        email: profile.email,
        stamps: profile.stamps || 0,
        orderCount: orderCounts[profile.id] || 0,
        favourites: [] // Mock for now until a real favourites system is built
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-dark/60">Loading customers...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Customer Database</h2>
        <p className="text-dark/60 mt-1">View registered users and their engagement metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-2xl border border-dark/5 shadow-sm">
          <div className="text-dark/50 text-sm font-semibold mb-2">Total Customers</div>
          <div className="text-3xl font-black text-dark">{users.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 border-b border-dark/5">
                <th className="p-4 font-semibold text-dark/80">Customer</th>
                <th className="p-4 font-semibold text-dark/80 text-center">Total Orders</th>
                <th className="p-4 font-semibold text-dark/80 text-center">Loyalty Stamps</th>
                <th className="p-4 font-semibold text-dark/80">Favourites</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-dark/5 hover:bg-black/[0.02] transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-dark">{user.name}</div>
                        <div className="text-xs text-dark/60">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-dark/5 text-dark font-medium text-sm">
                      <ShoppingBag size={14} />
                      {user.orderCount}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-accent/20 text-accent font-bold text-xs">
                        <Award size={14} />
                        {user.stamps}/10 Stamps
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.favourites?.map((fav, i) => (
                        <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-xs font-medium border border-primary/10">
                          <Heart size={10} className="fill-current" />
                          {fav.replace(/-/g, ' ')}
                        </span>
                      ))}
                      {(!user.favourites || user.favourites.length === 0) && (
                        <span className="text-xs text-dark/40">No favourites</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
