import React, { useState, useEffect, useRef } from 'react';
import { db, isFirebaseConfigured } from '../../config/firebase';
import { collection, onSnapshot, updateDoc, doc, getDocs, addDoc, deleteDoc } from 'firebase/firestore';
import { useMenu } from '../../context/MenuContext';
import { 
  Clock, ChefHat, CheckCircle2, Bell, ChevronDown, ChevronUp, MessageSquare, 
  MapPin, Receipt, Volume2, VolumeX, RefreshCw, XCircle, Check, Plus, Edit2, 
  Trash2, X, ShoppingBag, DollarSign, User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const statusConfig = {
  pending:   { label: 'Pending Review', icon: Clock,        color: 'bg-amber-100 text-amber-800 border-amber-300',    dot: 'bg-amber-500' },
  preparing: { label: 'Preparing',      icon: ChefHat,      color: 'bg-blue-100 text-blue-800 border-blue-300',       dot: 'bg-blue-500' },
  ready:     { label: 'Ready for Table',icon: Bell,         color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
  delivered: { label: 'Delivered',      icon: CheckCircle2, color: 'bg-gray-100 text-gray-600 border-gray-300',       dot: 'bg-gray-400' },
  rejected:  { label: 'Rejected',       icon: XCircle,      color: 'bg-red-100 text-red-800 border-red-300',          dot: 'bg-red-500' }
};

function getTime(val) {
  if (!val) return 0;
  if (typeof val.toMillis === 'function') return val.toMillis();
  if (typeof val.toDate === 'function') return val.toDate().getTime();
  if (val.seconds) return val.seconds * 1000;
  if (val._seconds) return val._seconds * 1000;
  if (typeof val === 'number') return val;
  const parsed = new Date(val).getTime();
  return isNaN(parsed) ? 0 : parsed;
}

function getTodayStartMillis() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}

export function AdminOrders() {
  const { items: menuItems } = useMenu();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const prevOrderCountRef = useRef(0);
  const audioRef = useRef(null);

  // CRUD Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Form states for creating/editing order
  const [orderFormData, setOrderFormData] = useState({
    user_name: '',
    user_email: '',
    order_type: 'table',
    table_id: '1',
    status: 'pending',
    custom_request: '',
    items: []
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Sound notification
  useEffect(() => {
    audioRef.current = {
      play: () => {
        if (!soundEnabled) return;
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.frequency.value = 800;
          gain.gain.value = 0.3;
          osc.start();
          osc.stop(ctx.currentTime + 0.2);
          setTimeout(() => {
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.frequency.value = 1000;
            gain2.gain.value = 0.3;
            osc2.start();
            osc2.stop(ctx.currentTime + 0.2);
          }, 250);
        } catch (e) {
          console.warn('Audio notification failed:', e);
        }
      }
    };
  }, [soundEnabled]);

  const mergeAndSetOrders = (fsOrders = []) => {
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
    } catch (e) {}

    const orderMap = new Map();
    localOrders.forEach(o => {
      const key = o.id || o.order_token;
      if (key) orderMap.set(key, o);
    });

    fsOrders.forEach(o => {
      const key = o.id || o.order_token;
      if (key) {
        const existing = orderMap.get(key) || {};
        orderMap.set(key, { ...existing, ...o });
      }
    });

    const merged = Array.from(orderMap.values());
    const sorted = merged.sort((a, b) => getTime(b.created_at) - getTime(a.created_at));

    if (prevOrderCountRef.current > 0) {
      const newPending = sorted.filter(o => (o.status || 'pending') === 'pending').length;
      const oldPending = orders.filter(o => (o.status || 'pending') === 'pending').length;
      if (newPending > oldPending && audioRef.current) {
        audioRef.current.play();
      }
    }
    prevOrderCountRef.current = sorted.length;
    setOrders(sorted);
    setLoading(false);
  };

  const fetchOrders = async () => {
    if (!isFirebaseConfigured) {
      mergeAndSetOrders([]);
      return;
    }

    try {
      const snap = await getDocs(collection(db, 'orders'));
      const fsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      mergeAndSetOrders(fsData);
    } catch (err) {
      console.warn('Firestore fetch orders warning:', err);
      mergeAndSetOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    mergeAndSetOrders([]);

    const handleLocalUpdate = () => fetchOrders();
    window.addEventListener('ems_orders_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    if (!isFirebaseConfigured) {
      setLoading(false);
      return () => {
        window.removeEventListener('ems_orders_updated', handleLocalUpdate);
        window.removeEventListener('storage', handleLocalUpdate);
      };
    }

    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(collection(db, 'orders'), (snapshot) => {
        const fsOrders = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        mergeAndSetOrders(fsOrders);
      }, (error) => {
        console.warn('Firestore orders snapshot error:', error);
        fetchOrders();
      });
    } catch (e) {
      console.warn('Firestore onSnapshot setup error:', e);
      fetchOrders();
    }

    return () => {
      window.removeEventListener('ems_orders_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchOrders();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  // ── QUICK STATUS TRANSITION ──
  const handleStatusChange = async (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    if (isFirebaseConfigured) {
      try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, { 
          status: newStatus, 
          updated_at: new Date().toISOString() 
        });
      } catch (err) {
        console.error('Firestore status update error:', err);
      }
    }

    try {
      const local = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
      const updated = local.map(o => o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o);
      localStorage.setItem('ems_all_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('ems_orders_updated'));
    } catch (e) {}

    showToast(`Order updated to ${statusConfig[newStatus]?.label || newStatus}!`);
  };

  // ── CREATE MANUAL ORDER ──
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (orderFormData.items.length === 0) {
      alert('Please add at least 1 item to the order.');
      return;
    }

    try {
      const token = `#EM-${Math.floor(1000 + Math.random() * 9000)}`;
      const subtotal = orderFormData.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      const newOrder = {
        order_token: token,
        order_type: orderFormData.order_type,
        table_id: orderFormData.order_type === 'table' ? String(orderFormData.table_id) : null,
        user_name: orderFormData.user_name.trim() || 'Walk-in Guest',
        user_email: orderFormData.user_email.trim() || '',
        user_id: 'walkin_guest',
        items: orderFormData.items,
        custom_request: orderFormData.custom_request || '',
        subtotal: subtotal,
        tax: tax,
        total_amount: total,
        status: orderFormData.status || 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let finalId = `order_${Date.now()}`;
      if (isFirebaseConfigured) {
        const docRef = await addDoc(collection(db, 'orders'), newOrder);
        finalId = docRef.id;
      }

      try {
        const local = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
        localStorage.setItem('ems_all_orders', JSON.stringify([{ id: finalId, ...newOrder }, ...local]));
        window.dispatchEvent(new Event('ems_orders_updated'));
      } catch (e) {}

      setIsCreateModalOpen(false);
      showToast(`Order ${token} created successfully!`);
    } catch (err) {
      console.error('Error creating order:', err);
      alert('Failed to create order: ' + err.message);
    }
  };

  // ── UPDATE ORDER DETAILS ──
  const handleUpdateOrderDetails = async (e) => {
    e.preventDefault();
    if (!editingOrder) return;

    try {
      const subtotal = orderFormData.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const tax = Math.round(subtotal * 0.05);
      const total = subtotal + tax;

      const updated = {
        order_type: orderFormData.order_type,
        table_id: orderFormData.order_type === 'table' ? String(orderFormData.table_id) : null,
        user_name: orderFormData.user_name.trim() || editingOrder.user_name,
        user_email: orderFormData.user_email.trim() || editingOrder.user_email,
        status: orderFormData.status,
        custom_request: orderFormData.custom_request,
        items: orderFormData.items,
        subtotal: subtotal,
        tax: tax,
        total_amount: total,
        updated_at: new Date().toISOString()
      };

      if (isFirebaseConfigured && editingOrder.id) {
        await updateDoc(doc(db, 'orders', editingOrder.id), updated);
      }

      try {
        const local = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
        const updatedLocal = local.map(o => o.id === editingOrder.id ? { ...o, ...updated } : o);
        localStorage.setItem('ems_all_orders', JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event('ems_orders_updated'));
      } catch (e) {}

      setEditingOrder(null);
      showToast(`Order ${editingOrder.order_token || editingOrder.id} updated!`);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Failed to update order: ' + err.message);
    }
  };

  // ── DELETE ORDER ──
  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      if (isFirebaseConfigured && orderToDelete.id) {
        await deleteDoc(doc(db, 'orders', orderToDelete.id));
      }

      try {
        const local = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
        const filtered = local.filter(o => o.id !== orderToDelete.id && o.order_token !== orderToDelete.order_token);
        localStorage.setItem('ems_all_orders', JSON.stringify(filtered));
        window.dispatchEvent(new Event('ems_orders_updated'));
      } catch (e) {}

      showToast(`Order ${orderToDelete.order_token || orderToDelete.id} deleted.`);
      setOrderToDelete(null);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order: ' + err.message);
    }
  };

  const addItemToForm = (item) => {
    const existing = orderFormData.items.find(i => i.id === item.id);
    if (existing) {
      setOrderFormData({
        ...orderFormData,
        items: orderFormData.items.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)
      });
    } else {
      setOrderFormData({
        ...orderFormData,
        items: [...orderFormData.items, { id: item.id, name: item.name, price: item.price, quantity: 1, isVeg: item.isVeg }]
      });
    }
  };

  const removeItemFromForm = (itemId) => {
    setOrderFormData({
      ...orderFormData,
      items: orderFormData.items.filter(i => i.id !== itemId)
    });
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setOrderFormData({
      user_name: order.user_name || '',
      user_email: order.user_email || '',
      order_type: order.order_type || 'table',
      table_id: order.table_id || '1',
      status: order.status || 'pending',
      custom_request: order.custom_request || '',
      items: order.items || []
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const ms = getTime(timestamp);
    if (!ms) return 'Just now';
    return new Date(ms).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const ms = getTime(timestamp);
    if (!ms) return '';
    return new Date(ms).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const todayStart = getTodayStartMillis();
  const visibleOrders = showTodayOnly 
    ? orders.filter(o => getTime(o.created_at) >= todayStart)
    : orders;

  const filteredOrders = filterStatus === 'all'
    ? visibleOrders
    : visibleOrders.filter(o => (o.status || 'pending') === filterStatus);

  const statusCounts = orders.reduce((acc, order) => {
    const s = order.status || 'pending';
    acc[s] = (acc[s] || 0) + 1;
    acc.all = (acc.all || 0) + 1;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-primary animate-spin mx-auto" />
          <p className="font-heading font-bold text-dark/60">Loading live orders...</p>
        </div>
      </div>
    );
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
          <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Live Orders Queue</h2>
          <p className="text-dark/60 mt-1">Manage, approve, edit, or create table and reception orders.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Create Manual Order */}
          <button
            onClick={() => {
              setOrderFormData({
                user_name: '',
                user_email: '',
                order_type: 'table',
                table_id: '1',
                status: 'pending',
                custom_request: '',
                items: []
              });
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus size={16} />
            <span>Create Order</span>
          </button>

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold bg-white text-dark border border-dark/10 hover:bg-dark/5 transition-colors shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-primary' : 'text-dark/60'}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm ${
              soundEnabled ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-gray-500 border border-dark/10'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <div className="flex items-center bg-white p-1 rounded-xl border border-dark/10 shadow-sm">
            <button
              onClick={() => setShowTodayOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !showTodayOnly ? 'bg-primary text-cream shadow-sm' : 'text-dark/60 hover:text-dark'
              }`}
            >
              All ({orders.length})
            </button>
            <button
              onClick={() => setShowTodayOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showTodayOnly ? 'bg-primary text-cream shadow-sm' : 'text-dark/60 hover:text-dark'
              }`}
            >
              Today ({orders.filter(o => getTime(o.created_at) >= todayStart).length})
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', 'pending', 'preparing', 'ready', 'delivered', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
              filterStatus === status 
                ? 'bg-dark text-cream shadow-md' 
                : 'bg-white text-dark/70 border border-dark/10 hover:border-dark/20'
            }`}
          >
            {status !== 'all' && (
              <span className={`w-2 h-2 rounded-full ${statusConfig[status]?.dot}`} />
            )}
            {status === 'all' ? 'All Orders' : statusConfig[status]?.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              filterStatus === status ? 'bg-cream/20 text-cream' : 'bg-dark/5 text-dark/50'
            }`}>
              {statusCounts[status] || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-dark/40 border border-dark/5">
            <p className="text-lg font-medium">No {filterStatus !== 'all' ? statusConfig[filterStatus]?.label.toLowerCase() : ''} orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = order.status || 'pending';
            const StatusIcon = statusConfig[status]?.icon || Clock;
            const isExpanded = expandedOrder === order.id;

            return (
              <motion.div
                key={order.id}
                layout
                className={`bg-white rounded-3xl border-2 overflow-hidden transition-all shadow-sm ${
                  status === 'pending' 
                    ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md shadow-amber-50' 
                    : status === 'preparing'
                    ? 'border-blue-300'
                    : status === 'ready'
                    ? 'border-emerald-300'
                    : 'border-dark/10'
                }`}
              >
                {/* Main Order Card Header */}
                <div
                  className="p-5 cursor-pointer hover:bg-black/[0.01] transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Left: Token, Table Badge & Status */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                      <span className="font-heading font-black text-primary text-xl tracking-tight">
                        {order.order_token || `#${order.id.slice(0, 8)}`}
                      </span>

                      {/* Prominent Table or Reception Badge */}
                      {order.order_type === 'table' && order.table_id ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600 text-white font-heading font-black text-xs shadow-sm">
                          <MapPin size={12} />
                          Table {order.table_id}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white font-heading font-black text-xs shadow-sm">
                          <Receipt size={12} />
                          Reception
                        </span>
                      )}

                      {/* Status Tag */}
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusConfig[status]?.color}`}>
                        <StatusIcon size={12} />
                        {statusConfig[status]?.label}
                      </span>

                      {/* 10-Min Pending Expiration Warning for Kitchen */}
                      {status === 'pending' && (
                        <span className="inline-flex items-center gap-1 bg-amber-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-bold shadow-sm animate-pulse">
                          <Clock size={11} />
                          10m Auto-Timeout
                        </span>
                      )}
                    </div>

                    {/* Right: Primary Action Buttons */}
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                      {status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-md active:scale-95 transition-all"
                          >
                            <Check size={14} />
                            <span>Confirm & Accept</span>
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Reject order ${order.order_token}?`)) {
                                handleStatusChange(order.id, 'rejected');
                              }
                            }}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 font-heading font-bold text-xs active:scale-95 transition-all"
                          >
                            <XCircle size={14} />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {status === 'preparing' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'ready')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-heading font-bold text-xs shadow-md active:scale-95 transition-all"
                        >
                          <Bell size={14} />
                          <span>Mark Ready</span>
                        </button>
                      )}

                      {status === 'ready' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'delivered')}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-heading font-bold text-xs shadow-md active:scale-95 transition-all"
                        >
                          <CheckCircle2 size={14} />
                          <span>Mark Delivered</span>
                        </button>
                      )}

                      {/* Edit Order */}
                      <button
                        onClick={() => openEditModal(order)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                        title="Edit Order"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Delete Order */}
                      <button
                        onClick={() => setOrderToDelete(order)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={16} />
                      </button>

                      <div className="p-1 text-dark/40">
                        {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                  </div>

                  {/* Quick Preview Line */}
                  <div className="mt-3 flex flex-wrap items-center justify-between text-xs text-dark/70 pt-3 border-t border-dark/5 gap-2">
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-dark">
                        {order.user_name || 'Customer'} {order.user_email ? `(${order.user_email})` : ''}
                      </span>
                      <span>{(order.items || []).length} items</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-heading font-black text-sm text-primary">₹{order.total_amount || 0}</span>
                      <span className="text-dark/40">{formatTime(order.created_at)} ({formatDate(order.created_at)})</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Details Panel */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-cream-light/60 border-t border-dark/10 p-5 space-y-4"
                    >
                      {/* Items Breakdown */}
                      <div className="space-y-2">
                        <h4 className="font-heading font-bold text-xs uppercase text-dark/60 tracking-wider">Ordered Items</h4>
                        <div className="bg-white rounded-2xl p-4 border border-dark/5 space-y-2">
                          {(order.items || []).map((item, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm">
                              <div>
                                <span className="font-bold text-dark">{item.quantity || 1}x {item.name}</span>
                                {item.addons?.length > 0 && (
                                  <span className="block text-xs text-dark/50">+ {item.addons.map(a => a.name).join(', ')}</span>
                                )}
                              </div>
                              <span className="font-bold text-dark">
                                ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * (item.quantity || 1)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Custom Request */}
                      {order.custom_request && (
                        <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                          <strong>Customer Instructions:</strong> "{order.custom_request}"
                        </div>
                      )}

                      {/* Price Summary */}
                      <div className="flex justify-between items-center text-sm font-bold pt-2 border-t border-dark/10">
                        <span className="text-dark/60">Subtotal: ₹{order.subtotal || 0} | Tax (5%): ₹{order.tax || 0}</span>
                        <span className="font-heading font-black text-xl text-primary">Final Total: ₹{order.total_amount || 0}</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>

      {/* ── CREATE ORDER MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-dark/10 flex justify-between items-center shrink-0">
              <h3 className="font-heading font-black text-xl text-dark">Create Manual Order</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 text-dark/40 hover:text-dark rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateOrder} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Order Type</label>
                  <select
                    value={orderFormData.order_type}
                    onChange={(e) => setOrderFormData({ ...orderFormData, order_type: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="table">Table Dine-In</option>
                    <option value="reception">Reception / Takeaway</option>
                  </select>
                </div>

                {orderFormData.order_type === 'table' && (
                  <div>
                    <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Table Number</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={orderFormData.table_id}
                      onChange={(e) => setOrderFormData({ ...orderFormData, table_id: e.target.value })}
                      className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    value={orderFormData.user_name}
                    onChange={(e) => setOrderFormData({ ...orderFormData, user_name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Email (Optional)</label>
                  <input
                    type="email"
                    placeholder="e.g. customer@gmail.com"
                    value={orderFormData.user_email}
                    onChange={(e) => setOrderFormData({ ...orderFormData, user_email: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Add Items From Menu */}
              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Add Items from Menu</label>
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {menuItems.slice(0, 10).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => addItemToForm(item)}
                      className="px-3 py-1.5 bg-cream-light hover:bg-cream border border-dark/15 rounded-xl text-xs font-bold text-dark whitespace-nowrap shrink-0 transition-colors"
                    >
                      + {item.name} (₹{item.price})
                    </button>
                  ))}
                </div>

                {/* Selected Items */}
                <div className="bg-cream-light p-3 rounded-2xl border border-dark/10 space-y-2">
                  <span className="text-xs font-bold text-dark/60 uppercase">Selected Items ({orderFormData.items.length})</span>
                  {orderFormData.items.length === 0 ? (
                    <p className="text-xs text-dark/40 italic">No items selected yet. Click above to add items.</p>
                  ) : (
                    orderFormData.items.map((i) => (
                      <div key={i.id} className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-dark/5 text-sm">
                        <span className="font-bold text-dark">{i.quantity}x {i.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-primary">₹{i.price * i.quantity}</span>
                          <button
                            type="button"
                            onClick={() => removeItemFromForm(i.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Special Instructions</label>
                <textarea
                  rows="2"
                  placeholder="e.g. Extra spicy, no onions"
                  value={orderFormData.custom_request}
                  onChange={(e) => setOrderFormData({ ...orderFormData, custom_request: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-dark/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-dark/15 text-dark font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-sm shadow-md"
                >
                  Place Manual Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── EDIT ORDER MODAL ── */}
      {editingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-dark/10 flex justify-between items-center shrink-0">
              <h3 className="font-heading font-black text-xl text-dark">Edit Order ({editingOrder.order_token})</h3>
              <button onClick={() => setEditingOrder(null)} className="p-2 text-dark/40 hover:text-dark rounded-full">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderDetails} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Status</label>
                  <select
                    value={orderFormData.status}
                    onChange={(e) => setOrderFormData({ ...orderFormData, status: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-bold text-sm focus:outline-none focus:border-primary capitalize"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready for Table</option>
                    <option value="delivered">Delivered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Order Type</label>
                  <select
                    value={orderFormData.order_type}
                    onChange={(e) => setOrderFormData({ ...orderFormData, order_type: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="table">Table Dine-In</option>
                    <option value="reception">Reception / Takeaway</option>
                  </select>
                </div>
              </div>

              {orderFormData.order_type === 'table' && (
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Table Number</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={orderFormData.table_id}
                    onChange={(e) => setOrderFormData({ ...orderFormData, table_id: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary font-mono"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={orderFormData.user_name}
                    onChange={(e) => setOrderFormData({ ...orderFormData, user_name: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Customer Email</label>
                  <input
                    type="email"
                    value={orderFormData.user_email}
                    onChange={(e) => setOrderFormData({ ...orderFormData, user_email: e.target.value })}
                    className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-dark/70 uppercase mb-1">Special Request</label>
                <textarea
                  rows="2"
                  value={orderFormData.custom_request}
                  onChange={(e) => setOrderFormData({ ...orderFormData, custom_request: e.target.value })}
                  className="w-full px-3 py-2 bg-cream-light border border-dark/15 rounded-xl font-medium text-sm focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-3 border-t border-dark/10 flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingOrder(null)}
                  className="px-4 py-2 rounded-xl border border-dark/15 text-dark font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-dark text-cream font-heading font-bold text-sm shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── DELETE ORDER CONFIRMATION MODAL ── */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-heading font-black text-xl text-red-600">Delete Order?</h3>
            <p className="text-sm text-dark/70">
              Are you sure you want to permanently delete order <strong>{orderToDelete.order_token || orderToDelete.id}</strong>?
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-xl border border-dark/15 text-dark font-bold text-sm hover:bg-dark/5"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteOrder}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-heading font-bold text-sm shadow-md"
              >
                Delete Order
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
