import React, { useState, useEffect } from 'react';
import { supabase } from '../../config/supabase';
import { Clock, ChefHat, CheckCircle2, Truck } from 'lucide-react';

export function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, payload => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          user:profiles (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-accent/20 text-dark border-accent/40' },
    preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-dark/10 text-dark border-dark/20' },
    out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'bg-accent/40 text-dark border-accent' },
    delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-primary/10 text-primary border-primary/20' }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);
        
      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Failed to update status');
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return <div className="p-8 text-center text-dark/60">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Active Orders</h2>
          <p className="text-dark/60 mt-1">Manage kitchen queue and delivery statuses.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-dark/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 border-b border-dark/5">
                <th className="p-4 font-semibold text-dark/80">Order ID</th>
                <th className="p-4 font-semibold text-dark/80">Customer</th>
                <th className="p-4 font-semibold text-dark/80">Items</th>
                <th className="p-4 font-semibold text-dark/80">Total</th>
                <th className="p-4 font-semibold text-dark/80">Status</th>
                <th className="p-4 font-semibold text-dark/80">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-dark/60">No orders yet.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const StatusIcon = statusConfig[order.status || 'pending']?.icon || Clock;
                  return (
                    <tr key={order.id} className="border-b border-dark/5 hover:bg-black/[0.02] transition-colors">
                      <td className="p-4">
                        <span className="font-mono text-sm font-semibold text-dark">{order.id.split('-')[0]}</span>
                        <div className="text-xs text-dark/50 mt-1">{formatTime(order.created_at)}</div>
                      </td>
                      <td className="p-4">
                        <div className="font-medium text-dark">{order.user?.name || 'Unknown User'}</div>
                        <div className="text-xs text-dark/60">{order.user?.email || ''}</div>
                      </td>
                      <td className="p-4 max-w-xs">
                        <div className="text-sm text-dark/80 space-y-1">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex justify-between gap-4">
                              <span className="truncate">{item.quantity}x {item.name}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-dark">
                        ₹{order.total_amount}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${statusConfig[order.status || 'pending']?.color}`}>
                          <StatusIcon size={14} />
                          {statusConfig[order.status || 'pending']?.label}
                        </div>
                      </td>
                      <td className="p-4">
                        <select
                          className="bg-cream border border-dark/10 text-dark text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2"
                          value={order.status || 'pending'}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="preparing">Preparing</option>
                          <option value="out_for_delivery">Out for Delivery</option>
                          <option value="delivered">Delivered</option>
                        </select>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
