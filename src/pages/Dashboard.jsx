import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { DashboardTabs } from '../components/DashboardTabs';
import { CardFace } from '../components/LoyaltyPunchCard';
import { 
  Award, Star, Sparkles, ShoppingBag, Heart, CheckCircle2, 
  RotateCcw, Plus, ExternalLink, QrCode, ArrowRight, UserCheck,
  Clock, ChefHat, Bell, XCircle, MapPin, Loader2
} from 'lucide-react';

const orderStatusConfig = {
  pending:   { label: 'Order Processing', subtitle: 'Waiting for kitchen confirmation', icon: Loader2,      color: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500' },
  preparing: { label: 'Being Prepared',   subtitle: 'Cooking fresh in kitchen',       icon: ChefHat,      color: 'bg-blue-100 text-blue-800 border-blue-300',    dot: 'bg-blue-500' },
  ready:     { label: 'Order Ready',      subtitle: 'Served to table / Ready',        icon: Bell,         color: 'bg-emerald-100 text-emerald-800 border-emerald-300', dot: 'bg-emerald-500' },
  delivered: { label: 'Delivered',        subtitle: 'Completed',                     icon: CheckCircle2, color: 'bg-gray-100 text-gray-700 border-gray-300',    dot: 'bg-gray-400' },
  rejected:  { label: 'Not Accepted',     subtitle: 'Order could not be accepted',    icon: XCircle,      color: 'bg-red-100 text-red-800 border-red-300',       dot: 'bg-red-500' }
};

export function Dashboard() {
  const { currentUser } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('loyalty');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [reorderedId, setReorderedId] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const points = currentUser?.stamps || 0;
  const beveragePoints = currentUser?.beverageStamps || 0;
  const isUnlocked = points >= 10; 

  const [burgerJustPunched, setBurgerJustPunched] = useState(null);
  const [beverageJustPunched, setBeverageJustPunched] = useState(null);

  const getTimestamp = (val) => {
    if (!val) return 0;
    if (typeof val.toMillis === 'function') return val.toMillis();
    if (typeof val.toDate === 'function') return val.toDate().getTime();
    if (typeof val === 'number') return val;
    const parsed = new Date(val).getTime();
    return isNaN(parsed) ? 0 : parsed;
  };

  // Real-time listener for user orders from Firestore
  useEffect(() => {
    if (!currentUser?.id || !isFirebaseConfigured) {
      setLoadingOrders(false);
      return;
    }

    let unsubscribe = () => {};
    try {
      // Listen to orders matching either user_id or user_email
      const q = query(
        collection(db, 'orders'),
        where('user_id', '==', currentUser.id)
      );

      unsubscribe = onSnapshot(q, (snapshot) => {
        const userOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        userOrders.sort((a, b) => getTimestamp(b.created_at) - getTimestamp(a.created_at));
        setOrders(userOrders);
        setLoadingOrders(false);
      }, (error) => {
        console.warn('Firestore user orders subscription warning:', error);
        setLoadingOrders(false);
      });
    } catch (e) {
      console.warn('Firestore user listener setup warning:', e);
      setLoadingOrders(false);
    }

    return () => unsubscribe();
  }, [currentUser]);

  const fireConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D9412A', '#F9E9C7', '#F2B705', '#2B1810']
    });
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        isVeg: item.isVeg,
        image: item.image || '/logoo.svg',
      }, item.quantity || 1, item.addons || []);
    });
    setReorderedId(order.id);
    setTimeout(() => {
      setReorderedId(null);
      navigate('/checkout');
    }, 1000);
  };

  const formatOrderDate = (timestamp) => {
    if (!timestamp) return 'Just now';
    const ms = getTimestamp(timestamp);
    if (!ms) return 'Just now';
    const date = new Date(ms);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ' at ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Divide orders into Active vs Completed vs Rejected
  const activeOrders = orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status || 'pending'));
  const completedOrders = orders.filter(o => o.status === 'delivered');
  const rejectedOrders = orders.filter(o => o.status === 'rejected');

  const formattedEmCode = `EM${String(currentUser?.numeric_id || 1000).padStart(4, '0').slice(-4)}`;

  return (
    <div className="py-12 bg-cream text-dark min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* User Welcome Banner */}
        <div className="bg-primary text-cream rounded-4xl p-6 sm:p-10 border-4 border-accent shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-72 h-72 bg-accent/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-dark font-heading font-extrabold text-xs uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-dark" />
                <span>Loyalty Club Member</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-cream">
                  WELCOME, {currentUser?.name?.toUpperCase() || 'FOODIE'}!
                </h1>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-dark text-accent border-2 border-accent/20 shadow-inner w-fit mt-2 sm:mt-0">
                  <span className="text-xs font-bold text-cream/70 uppercase tracking-widest">EMCODE:</span>
                  <span className="font-mono font-black text-2xl sm:text-3xl tracking-wider">{formattedEmCode}</span>
                </div>
              </div>
              
              <p className="text-cream/90 text-sm sm:text-base font-medium max-w-xl">
                Track your loyalty rewards, monitor live table orders, and reorder past favorites with 1 tap.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-primary-dark/60 p-4 rounded-3xl border border-cream/20 flex items-center gap-4 shrink-0 shadow-inner">
              <div className="text-center px-2">
                <div className="font-heading font-black text-3xl text-accent leading-none">
                  {points}<span className="text-sm font-bold text-cream">/10</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-cream/80 mt-1">
                  Burger Stamps
                </div>
              </div>
              <div className="h-10 w-0.5 bg-cream/20" />
              <div className="text-center px-2">
                <div className="font-heading font-black text-3xl text-cream leading-none">
                  {completedOrders.length}
                </div>
                <div className="text-[10px] uppercase font-bold text-cream/80 mt-1">
                  Past Orders
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation Tabs */}
        <DashboardTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          ordersCount={activeOrders.length + completedOrders.length}
        />

        {/* Tab Content Panels */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: MY LOYALTY POINTS */}
          {activeTab === 'loyalty' && (
            <motion.div
              key="loyalty"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* Reward Unlocked Banner */}
              {isUnlocked && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-accent text-dark p-6 sm:p-8 rounded-4xl border-4 border-dark shadow-2xl text-center space-y-3 relative overflow-hidden"
                >
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dark text-accent font-heading font-extrabold text-xs uppercase tracking-wider animate-bounce">
                    <Star className="w-4 h-4 fill-accent" />
                    <span>🎉 10 STAMPS COMPLETED!</span>
                  </div>
                  <h2 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                    YOUR NEXT BURGER IS FREE!
                  </h2>
                  <p className="text-dark/80 font-medium text-sm max-w-md mx-auto">
                    Show your EMCODE <strong>{formattedEmCode}</strong> to the server to redeem your complimentary reward.
                  </p>
                  <button
                    onClick={fireConfetti}
                    className="px-6 py-3 rounded-full bg-primary text-cream font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform"
                  >
                    Celebrate Again! 🎊
                  </button>
                </motion.div>
              )}

              {/* Punch Card Container */}
              <div className="relative w-full" style={{ perspective: '2000px' }}>
                <div className="relative w-full max-w-2xl mx-auto">
                  <motion.div
                    initial={false}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.8, type: 'spring', stiffness: 200, damping: 25 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-full"
                  >
                    {/* Front Face: Burgers */}
                    <div style={{ backfaceVisibility: 'hidden' }} className="w-full">
                      <CardFace
                        type="burger"
                        count={points}
                        setCount={() => {}} 
                        justPunched={burgerJustPunched}
                        setJustPunched={setBurgerJustPunched}
                        onFlip={() => setIsFlipped(true)}
                        mode="dashboard"
                        onSimulateScan={() => {}}
                        onReset={() => {}}
                      />
                    </div>

                    {/* Back Face: Beverages */}
                    <div
                      style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <CardFace
                        type="beverage"
                        count={beveragePoints}
                        setCount={() => {}} 
                        justPunched={beverageJustPunched}
                        setJustPunched={setBeverageJustPunched}
                        onFlip={() => setIsFlipped(false)}
                        mode="dashboard"
                        onSimulateScan={() => {}}
                        onReset={() => {}}
                      />
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: ORDERS (ACTIVE TRACKER & PAST RECEIPTS) */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* 1. ACTIVE ORDERS SECTION */}
              {activeOrders.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping" />
                    <h3 className="font-heading font-black text-2xl text-dark tracking-tight">
                      Active Orders ({activeOrders.length})
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {activeOrders.map((order) => {
                      const status = order.status || 'pending';
                      const statusInfo = orderStatusConfig[status] || orderStatusConfig.pending;
                      const StatusIcon = statusInfo.icon;

                      return (
                        <div
                          key={order.id}
                          className="bg-white p-6 rounded-3xl border-2 border-primary/20 shadow-lg space-y-4 relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-heading font-black text-2xl text-primary block">
                                {order.order_token || `#${order.id.slice(0, 8)}`}
                              </span>
                              {order.order_type === 'table' && order.table_id && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-dark/70 mt-0.5">
                                  <MapPin size={12} className="text-primary" />
                                  Dine-In • Table {order.table_id}
                                </span>
                              )}
                            </div>

                            <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border text-xs font-heading font-black uppercase ${statusInfo.color}`}>
                              <StatusIcon className={`w-3.5 h-3.5 ${status === 'pending' ? 'animate-spin' : ''}`} />
                              {statusInfo.label}
                            </span>
                          </div>

                          <p className="text-xs text-dark/60 font-medium">
                            {statusInfo.subtitle}
                          </p>

                          {/* Items List */}
                          <div className="space-y-1.5 pt-3 border-t border-dark/5 text-sm">
                            {(order.items || []).map((item, i) => (
                              <div key={i} className="flex justify-between items-start">
                                <div>
                                  <span className="font-bold text-dark">{item.quantity || 1}x {item.name}</span>
                                  {item.addons?.length > 0 && (
                                    <span className="block text-[11px] text-dark/50">+ {item.addons.map(a => a.name).join(', ')}</span>
                                  )}
                                </div>
                                <span className="font-bold text-dark">
                                  ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * (item.quantity || 1)}
                                </span>
                              </div>
                            ))}
                          </div>

                          {order.custom_request && (
                            <div className="p-2.5 bg-amber-50 rounded-xl text-xs text-amber-900 border border-amber-200">
                              <strong>Special Request:</strong> {order.custom_request}
                            </div>
                          )}

                          <div className="pt-3 border-t border-dark/5 flex justify-between items-center">
                            <span className="text-xs font-bold text-dark/50 uppercase">Total Amount</span>
                            <span className="font-heading font-black text-2xl text-primary">₹{order.total_amount}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. REJECTED ORDERS (IF ANY) */}
              {rejectedOrders.length > 0 && (
                <div className="space-y-4">
                  <h3 className="font-heading font-black text-xl text-red-600 tracking-tight">
                    Not Accepted Orders
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {rejectedOrders.map((order) => (
                      <div key={order.id} className="bg-red-50 p-5 rounded-3xl border border-red-200 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-heading font-black text-lg text-red-700">{order.order_token}</span>
                          <span className="bg-red-200 text-red-800 text-xs font-bold px-3 py-1 rounded-full uppercase">Rejected</span>
                        </div>
                        <p className="text-xs text-red-700">The restaurant could not accept this order at this time. Please check with reception.</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. PREVIOUS COMPLETED ORDERS */}
              <div className="space-y-4">
                <h3 className="font-heading font-black text-2xl text-dark tracking-tight">
                  Previous Completed Orders
                </h3>

                {loadingOrders ? (
                   <div className="py-16 text-center text-dark/50 font-bold">Loading order receipts...</div>
                ) : completedOrders.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {completedOrders.map((order, idx) => (
                      <motion.div
                        key={order.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-cream-light p-6 rounded-3xl border-2 border-primary/15 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-heading font-extrabold text-sm text-primary">
                              {order.order_token || `Order #${order.id.slice(0, 8)}`}
                            </span>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-heading font-bold uppercase bg-gray-100 text-gray-700 border border-gray-300">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Delivered
                            </span>
                          </div>

                          <div className="text-xs font-semibold text-dark/60">
                            {formatOrderDate(order.created_at)}
                          </div>

                          <div className="space-y-1.5 pt-2 border-t border-primary/10">
                            {(order.items || []).map((item, i) => (
                              <div key={i} className="flex items-center justify-between text-xs font-medium">
                                <span className="text-dark">{item.quantity || 1}x {item.name}</span>
                                <span className="text-dark/70 font-bold">₹{item.price * (item.quantity || 1)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-primary/10 flex items-center justify-between">
                          <div>
                            <div className="text-[10px] uppercase font-bold text-dark/50">Total Paid</div>
                            <div className="font-heading font-black text-xl text-primary">₹{order.total_amount}</div>
                          </div>
                          
                          <button
                            onClick={() => handleReorder(order)}
                            disabled={reorderedId === order.id}
                            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-heading font-bold text-xs shadow-sm transition-all active:scale-95 ${
                              reorderedId === order.id
                                ? 'bg-emerald-500 text-white'
                                : 'bg-primary text-cream hover:bg-primary-dark'
                            }`}
                          >
                            {reorderedId === order.id ? (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Added!
                              </>
                            ) : (
                              <>
                                <RotateCcw className="w-3.5 h-3.5" />
                                Reorder
                              </>
                            )}
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="py-16 text-center bg-cream-light rounded-4xl border-2 border-dashed border-primary/20 space-y-4">
                    <ShoppingBag className="w-12 h-12 text-primary/40 mx-auto" />
                    <h4 className="font-heading font-bold text-2xl text-dark">No Completed Orders Yet</h4>
                    <p className="text-dark/60 text-sm max-w-xs mx-auto">
                      Completed table and reception orders will automatically appear here with 1-tap reordering.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
