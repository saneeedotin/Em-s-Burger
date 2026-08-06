import React, { useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, ChefHat, CheckCircle2, Truck } from 'lucide-react';

export function AdminOrders() {
  const { users, adminUpdateOrderStatus } = useAuth();

  // Extract all orders from all users and flatten them into a single list
  const allOrders = useMemo(() => {
    let orders = [];
    users.forEach(user => {
      user.orders.forEach(order => {
        orders.push({
          ...order,
          user: { id: user.id, name: user.name, email: user.email }
        });
      });
    });
    // Sort by most recent
    return orders.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [users]);

  const statusConfig = {
    pending: { label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    preparing: { label: 'Preparing', icon: ChefHat, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    out_for_delivery: { label: 'Out for Delivery', icon: Truck, color: 'bg-orange-100 text-orange-800 border-orange-200' },
    delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-green-100 text-green-800 border-green-200' }
  };

  const handleStatusChange = (userId, orderId, newStatus) => {
    adminUpdateOrderStatus(userId, orderId, newStatus);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Active Orders</h2>
        <p className="text-dark/60 mt-1">Manage kitchen queue and delivery statuses.</p>
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
              {allOrders.map((order) => {
                const StatusIcon = statusConfig[order.status || 'pending']?.icon || Clock;
                return (
                  <tr key={order.id} className="border-b border-dark/5 hover:bg-black/[0.02] transition-colors">
                    <td className="p-4">
                      <span className="font-mono text-sm font-semibold text-dark">{order.id}</span>
                      <div className="text-xs text-dark/50 mt-1">{order.date}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-dark">{order.user.name}</div>
                      <div className="text-xs text-dark/60">{order.user.email}</div>
                    </td>
                    <td className="p-4 max-w-xs">
                      <div className="text-sm text-dark/80 space-y-1">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between gap-4">
                            <span className="truncate">{item.qty}x {item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-dark">
                      ₹{order.total}
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
                        onChange={(e) => handleStatusChange(order.user.id, order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="preparing">Preparing</option>
                        <option value="out_for_delivery">Out for Delivery</option>
                        <option value="delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
              {allOrders.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-dark/50">
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
