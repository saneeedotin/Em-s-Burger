import React, { useState, useEffect, useRef } from 'react';
import { db } from '../../config/firebase';
import { collection, getDocs, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { Clock, ChefHat, CheckCircle2, Bell, ChevronDown, ChevronUp, MessageSquare, MapPin, Receipt, Volume2, VolumeX, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_FLOW = ['pending', 'preparing', 'ready', 'delivered'];

const statusConfig = {
  pending:   { label: 'Pending',   icon: Clock,        color: 'bg-amber-100 text-amber-800 border-amber-300',    dot: 'bg-amber-500' },
  preparing: { label: 'Preparing', icon: ChefHat,      color: 'bg-blue-100 text-blue-800 border-blue-300',       dot: 'bg-blue-500' },
  ready:     { label: 'Ready',     icon: Bell,         color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
  delivered: { label: 'Delivered', icon: CheckCircle2, color: 'bg-gray-100 text-gray-600 border-gray-300',       dot: 'bg-gray-400' }
};

// Helper to extract numeric timestamp from any format (Timestamp, Date, ISO string, seconds, number)
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  const prevOrderCountRef = useRef(0);
  const audioRef = useRef(null);

  // Create audio element for notifications
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

  const mergeAndSetOrders = (fsOrders) => {
    let localOrders = [];
    try {
      localOrders = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
    } catch (e) {}

    const orderMap = new Map();

    // 1. Add local orders
    localOrders.forEach(o => {
      const key = o.order_token || o.id;
      if (key) orderMap.set(key, o);
    });

    // 2. Overlay Firestore orders
    fsOrders.forEach(o => {
      const key = o.order_token || o.id;
      if (key) {
        const existing = orderMap.get(key) || {};
        orderMap.set(key, { ...existing, ...o });
      }
    });

    const merged = Array.from(orderMap.values());
    merged.sort((a, b) => getTime(b.created_at) - getTime(a.created_at));

    if (prevOrderCountRef.current > 0) {
      const newPending = merged.filter(o => (o.status || 'pending') === 'pending').length;
      const oldPending = orders.filter(o => (o.status || 'pending') === 'pending').length;
      if (newPending > oldPending && audioRef.current) {
        audioRef.current.play();
      }
    }
    prevOrderCountRef.current = merged.length;
    setOrders(merged);
    setLoading(false);
  };

  const fetchDirectFromFirestore = async () => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const fsData = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      mergeAndSetOrders(fsData);
    } catch (err) {
      console.warn('Direct Firestore getDocs warning:', err);
      mergeAndSetOrders([]);
    }
  };

  useEffect(() => {
    // Initial fetch from Firestore and local storage immediately
    fetchDirectFromFirestore();

    // Listen for local updates
    const handleLocalUpdate = () => {
      let currentFs = orders.filter(o => !o.id?.startsWith('order_'));
      mergeAndSetOrders(currentFs);
    };
    window.addEventListener('ems_orders_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    // Real-time Firestore subscription
    let unsubscribe = () => {};
    try {
      const q = collection(db, 'orders');
      unsubscribe = onSnapshot(q, (snapshot) => {
        const fsOrders = snapshot.docs.map(document => ({
          id: document.id,
          ...document.data()
        }));
        mergeAndSetOrders(fsOrders);
      }, (error) => {
        console.warn('Firestore onSnapshot warning:', error);
        fetchDirectFromFirestore();
      });
    } catch (e) {
      console.warn('Firestore listener error:', e);
    }

    return () => {
      window.removeEventListener('ems_orders_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchDirectFromFirestore();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    // 1. Update in local storage
    try {
      const stored = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
      const updated = stored.map(o => 
        (o.id === orderId || o.firestore_id === orderId || o.order_token === orderId) 
          ? { ...o, status: newStatus, updated_at: new Date().toISOString() } 
          : o
      );
      localStorage.setItem('ems_all_orders', JSON.stringify(updated));
      window.dispatchEvent(new Event('ems_orders_updated'));
    } catch (e) {}

    // Optimistically update state
    setOrders(prev => prev.map(o => (o.id === orderId || o.firestore_id === orderId) ? { ...o, status: newStatus } : o));

    // 2. Update in Firestore
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      });
    } catch (err) {
      console.warn('Firestore status update warning:', err);
    }
  };

  const getNextStatus = (currentStatus) => {
    const idx = STATUS_FLOW.indexOf(currentStatus);
    if (idx < STATUS_FLOW.length - 1) return STATUS_FLOW[idx + 1];
    return null;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const ms = getTime(timestamp);
    if (!ms) return 'Just now';
    const date = new Date(ms);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const ms = getTime(timestamp);
    if (!ms) return '';
    const date = new Date(ms);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const todayStart = getTodayStartMillis();
  const visibleOrders = showTodayOnly 
    ? orders.filter(o => getTime(o.created_at) >= todayStart)
    : orders;

  const filteredOrders = filterStatus === 'all' 
    ? visibleOrders 
    : visibleOrders.filter(o => (o.status || 'pending') === filterStatus);

  const statusCounts = {
    all: visibleOrders.length,
    pending: visibleOrders.filter(o => (o.status || 'pending') === 'pending').length,
    preparing: visibleOrders.filter(o => o.status === 'preparing').length,
    ready: visibleOrders.filter(o => o.status === 'ready').length,
    delivered: visibleOrders.filter(o => o.status === 'delivered').length,
  };

  if (loading) {
    return <div className="p-8 text-center text-dark/60">Loading orders...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-3xl font-heading font-black text-dark tracking-tight">Orders</h2>
          <p className="text-dark/60 mt-1">Manage kitchen queue and order statuses.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
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
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>

          {/* Segmented View Toggle */}
          <div className="flex items-center bg-white p-1 rounded-xl border border-dark/10 shadow-sm">
            <button
              onClick={() => setShowTodayOnly(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !showTodayOnly ? 'bg-primary text-cream shadow-sm' : 'text-dark/60 hover:text-dark'
              }`}
            >
              All Time ({orders.length})
            </button>
            <button
              onClick={() => setShowTodayOnly(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                showTodayOnly ? 'bg-primary text-cream shadow-sm' : 'text-dark/60 hover:text-dark'
              }`}
            >
              Today Only ({orders.filter(o => getTime(o.created_at) >= todayStart).length})
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {['all', ...STATUS_FLOW].map(status => (
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
            {status === 'all' ? 'All' : statusConfig[status]?.label}
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
              filterStatus === status ? 'bg-cream/20 text-cream' : 'bg-dark/5 text-dark/50'
            }`}>
              {statusCounts[status]}
            </span>
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center text-dark/40 border border-dark/5">
            <p className="text-lg font-medium">No {filterStatus !== 'all' ? statusConfig[filterStatus]?.label.toLowerCase() : ''} orders.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = order.status || 'pending';
            const StatusIcon = statusConfig[status]?.icon || Clock;
            const isExpanded = expandedOrder === order.id;
            const nextStatus = getNextStatus(status);

            return (
              <motion.div
                key={order.id}
                layout
                className={`bg-white rounded-2xl border overflow-hidden transition-shadow ${
                  status === 'pending' ? 'border-amber-300 shadow-md shadow-amber-100' : 'border-dark/5 shadow-sm'
                }`}
              >
                {/* Order Row */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-black/[0.01] transition-colors"
                  onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                >
                  {/* Status Dot */}
                  <div className={`w-3 h-3 rounded-full shrink-0 ${statusConfig[status]?.dot}`} />

                  {/* Order Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-heading font-black text-primary text-sm">
                        {order.order_token || order.id.slice(0, 8)}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wider ${statusConfig[status]?.color}`}>
                        <StatusIcon size={10} />
                        {statusConfig[status]?.label}
                      </span>
                      {order.order_type === 'table' && order.table_id && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold">
                          <MapPin size={10} />
                          Table {order.table_id}
                        </span>
                      )}
                      {order.order_type === 'reception' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-bold">
                          <Receipt size={10} />
                          Reception
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-dark/50">
                      <span className="font-medium">{order.user_name || 'Unknown'}</span>
                      <span>•</span>
                      <span>{formatTime(order.created_at)}</span>
                      {!showToday && <><span>•</span><span>{formatDate(order.created_at)}</span></>}
                      <span>•</span>
                      <span className="font-bold text-dark/70">{(order.items || []).reduce((s, i) => s + (i.quantity || 1), 0)} items</span>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="font-heading font-black text-lg text-dark shrink-0">
                    ₹{order.total_amount}
                  </div>

                  {/* Quick Action */}
                  {nextStatus && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStatusChange(order.id, nextStatus);
                      }}
                      className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                        status === 'pending'
                          ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-sm'
                          : status === 'preparing'
                          ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                          : 'bg-dark/10 text-dark hover:bg-dark/20'
                      }`}
                    >
                      {status === 'pending' && 'Accept'}
                      {status === 'preparing' && 'Mark Ready'}
                      {status === 'ready' && 'Delivered'}
                    </button>
                  )}

                  {/* Expand Arrow */}
                  <div className="shrink-0 text-dark/30">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-2 border-t border-dark/5 space-y-4">
                        {/* Items */}
                        <div>
                          <h4 className="text-xs font-bold text-dark/40 uppercase tracking-wider mb-2">Items</h4>
                          <div className="space-y-2">
                            {(order.items || []).map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start">
                                <div className="flex items-start gap-2">
                                  <div className={`w-3 h-3 mt-1 border-2 rounded-sm shrink-0 ${item.isVeg ? 'border-emerald-600' : 'border-red-600'}`}>
                                    <div className={`w-1 h-1 m-auto mt-0.5 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-red-600'}`} />
                                  </div>
                                  <div>
                                    <span className="font-medium text-dark text-sm">{item.quantity}x {item.name}</span>
                                    {item.addons?.length > 0 && (
                                      <div className="text-xs text-dark/50 mt-0.5">
                                        + {item.addons.map(a => a.name).join(', ')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <span className="font-bold text-dark text-sm shrink-0">
                                  ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Special Request */}
                        {order.custom_request && (
                          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 mb-1">
                              <MessageSquare size={12} />
                              Special Request
                            </div>
                            <p className="text-sm text-amber-800">{order.custom_request}</p>
                          </div>
                        )}

                        {/* Customer & Order Details */}
                        <div className="flex flex-wrap gap-4 text-xs text-dark/60">
                          <div>
                            <span className="font-bold text-dark/40 uppercase">Customer</span>
                            <p className="font-medium text-dark mt-0.5">{order.user_name || 'Unknown'}</p>
                            {order.user_email && <p className="text-dark/50">{order.user_email}</p>}
                          </div>
                          <div>
                            <span className="font-bold text-dark/40 uppercase">Subtotal</span>
                            <p className="font-medium text-dark mt-0.5">₹{order.subtotal || (order.total_amount ? Math.round(order.total_amount / 1.05) : '—')}</p>
                          </div>
                          <div>
                            <span className="font-bold text-dark/40 uppercase">Tax</span>
                            <p className="font-medium text-dark mt-0.5">₹{order.tax || '—'}</p>
                          </div>
                          <div>
                            <span className="font-bold text-dark/40 uppercase">Total</span>
                            <p className="font-heading font-black text-primary mt-0.5">₹{order.total_amount}</p>
                          </div>
                        </div>

                        {/* Status Override */}
                        <div className="flex items-center gap-2 pt-2 border-t border-dark/5">
                          <span className="text-xs font-bold text-dark/40">Override:</span>
                          {STATUS_FLOW.map(s => (
                            <button
                              key={s}
                              onClick={() => handleStatusChange(order.id, s)}
                              disabled={status === s}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors ${
                                status === s 
                                  ? 'bg-dark text-cream' 
                                  : 'bg-dark/5 text-dark/60 hover:bg-dark/10'
                              }`}
                            >
                              {statusConfig[s]?.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
