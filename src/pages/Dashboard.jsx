import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { DashboardTabs } from '../components/DashboardTabs';
import { CardFace } from '../components/LoyaltyPunchCard';
import { 
  Award, Star, Sparkles, ShoppingBag, Heart, CheckCircle2, 
  RotateCcw, Plus, ExternalLink, QrCode, ArrowRight, UserCheck 
} from 'lucide-react';

export function Dashboard() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('loyalty');
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [reorderedId, setReorderedId] = useState(null);

  const points = currentUser?.stamps || 0;
  const isUnlocked = points >= 10; 

  const [burgerJustPunched, setBurgerJustPunched] = useState(null);

  useEffect(() => {
    if (points >= 10) {
      setJustUnlocked(true);
    }
  }, [points]);

  useEffect(() => {
    if (currentUser?.id) {
      fetchUserOrders();
    }
  }, [currentUser]);

  const fetchUserOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('user_id', '==', currentUser.id),
        orderBy('created_at', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const fireConfetti = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#D9412A', '#F9E9C7', '#F2B705', '#2B1810']
    });
  };

  const handleReorder = (orderId) => {
    setReorderedId(orderId);
    setTimeout(() => setReorderedId(null), 2000);
  };

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
                <span>Loyalty Club Dashboard</span>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-cream">
                  WELCOME BACK, {currentUser?.name?.toUpperCase() || 'FOODIE'}!
                </h1>
                {(currentUser?.numeric_id || currentUser?.hash_id) && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-dark text-accent border-2 border-accent/20 shadow-inner w-fit mt-2 sm:mt-0">
                    <span className="text-sm font-bold text-cream/70 uppercase tracking-widest">ID:</span>
                    <span className="font-mono font-black text-3xl sm:text-4xl">#{currentUser.numeric_id || currentUser.hash_id?.replace('#', '')}</span>
                  </div>
                )}
              </div>
              
              <p className="text-cream/90 text-sm sm:text-base font-medium max-w-xl">
                Track your digital stamps, reorder past favorites, and unlock your FREE burger.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-primary-dark/60 p-4 rounded-3xl border border-cream/20 flex items-center gap-4 shrink-0 shadow-inner">
              <div className="text-center px-2">
                <div className="font-heading font-black text-3xl text-accent leading-none">
                  {points}<span className="text-sm font-bold text-cream">/10</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-cream/80 mt-1">
                  Stamps Collected
                </div>
              </div>
              <div className="h-10 w-0.5 bg-cream/20" />
              <div className="text-center px-2">
                <div className="font-heading font-black text-3xl text-cream leading-none">
                  {orders.length}
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
          ordersCount={orders.length}
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
                    <span>🎉 REWARD UNLOCKED!</span>
                  </div>
                  <h2 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                    YOUR NEXT REWARD IS 100% FREE!
                  </h2>
                  <p className="text-dark/80 font-medium text-sm max-w-md mx-auto">
                    Show your digital dashboard to the server at EM's Burgers Chembur Camp to claim your reward.
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
                  <CardFace
                    type="burger"
                    count={points}
                    setCount={() => {}} 
                    justPunched={burgerJustPunched}
                    setJustPunched={setBurgerJustPunched}
                    onFlip={() => {}}
                    mode="dashboard"
                    onSimulateScan={() => {}}
                    onReset={() => {}}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: PREVIOUS ORDERS */}
          {activeTab === 'orders' && (
            <motion.div
              key="orders"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {loadingOrders ? (
                 <div className="py-16 text-center text-dark/50">Loading orders...</div>
              ) : orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {orders.map((order, idx) => (
                    <motion.div
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.08 }}
                      className="bg-cream-light p-6 rounded-3xl border-2 border-primary/15 shadow-md flex flex-col justify-between space-y-4 hover:border-primary/40 transition-colors"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-extrabold text-sm text-primary">
                            Order #{order.id.slice(0, 8)}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-heading font-bold uppercase">
                            ✓ {order.status}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-dark/60">
                          Ordered on {new Date(order.created_at).toLocaleDateString()}
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-primary/10">
                          {order.items && order.items.map((item, i) => (
                            <div key={i} className="flex items-center justify-between text-xs font-medium">
                              <span className="text-dark">{item.qty}x {item.name}</span>
                              <span className="text-dark/70 font-bold">₹{item.price * item.qty}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-primary/10 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] uppercase font-bold text-dark/50">Total Amount</div>
                          <div className="font-heading font-black text-xl text-primary">₹{order.total_amount}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-cream-light rounded-4xl border-2 border-dashed border-primary/20 space-y-4">
                  <ShoppingBag className="w-12 h-12 text-primary/40 mx-auto" />
                  <h3 className="font-heading font-bold text-2xl text-dark">No Previous Orders Yet</h3>
                  <p className="text-dark/60 text-sm max-w-xs mx-auto">
                    Your past order receipts will automatically appear here once you place orders at EM's Burgers.
                  </p>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>

      </div>
    </div>
  );
}
