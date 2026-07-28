import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { MENU_ITEMS } from '../data/menu';
import { DashboardTabs } from '../components/DashboardTabs';
import { MenuItemCard } from '../components/MenuItemCard';
import { 
  Award, Star, Sparkles, ShoppingBag, Heart, CheckCircle2, 
  RotateCcw, Plus, ExternalLink, QrCode, ArrowRight, UserCheck 
} from 'lucide-react';

export function Dashboard() {
  const { currentUser, updateLoyaltyPoints, toggleFavourite, isDemoAccount } = useAuth();
  const [activeTab, setActiveTab] = useState('loyalty');
  const [justUnlocked, setJustUnlocked] = useState(false);
  const [reorderedId, setReorderedId] = useState(null);

  const points = currentUser?.loyaltyPoints || 0;
  const isUnlocked = points >= 9;

  // Trigger celebration confetti when reaching 9/9 points
  const handleAddStamp = () => {
    if (points < 9) {
      const nextPoints = points + 1;
      updateLoyaltyPoints(nextPoints);
      if (nextPoints >= 9) {
        fireConfetti();
        setJustUnlocked(true);
      }
    }
  };

  const handleResetStamps = () => {
    updateLoyaltyPoints(0);
    setJustUnlocked(false);
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

  // Filter favourited items
  const favouritedItems = MENU_ITEMS.filter((item) =>
    currentUser?.favourites?.includes(item.id)
  );

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
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-dark font-heading font-extrabold text-xs uppercase tracking-wider shadow-sm">
                <Sparkles className="w-3.5 h-3.5 fill-dark" />
                <span>Loyalty Club Dashboard</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-5xl tracking-tight text-cream">
                WELCOME BACK, {currentUser?.name?.toUpperCase() || 'FOODIE'}!
              </h1>
              <p className="text-cream/90 text-sm sm:text-base font-medium max-w-xl">
                Track your digital stamps, reorder past favorites, and unlock your 10th FREE burger.
              </p>
            </div>

            {/* Quick Stats Pill */}
            <div className="bg-primary-dark/60 p-4 rounded-3xl border border-cream/20 flex items-center gap-4 shrink-0 shadow-inner">
              <div className="text-center px-2">
                <div className="font-heading font-black text-3xl text-accent leading-none">
                  {points}<span className="text-sm font-bold text-cream">/9</span>
                </div>
                <div className="text-[10px] uppercase font-bold text-cream/80 mt-1">
                  Stamps Collected
                </div>
              </div>
              <div className="h-10 w-0.5 bg-cream/20" />
              <div className="text-center px-2">
                <div className="font-heading font-black text-3xl text-cream leading-none">
                  {currentUser?.orders?.length || 0}
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
          favouritesCount={favouritedItems.length}
          ordersCount={currentUser?.orders?.length || 0}
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
                    <span>🎉 10th BURGER UNLOCKED!</span>
                  </div>
                  <h2 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                    YOUR NEXT BURGER IS 100% FREE!
                  </h2>
                  <p className="text-dark/80 font-medium text-sm max-w-md mx-auto">
                    Show your digital dashboard to the server at EM's Burgers Chembur Camp to claim your free burger reward.
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
              <div className="bg-cream-light border-4 border-primary/20 rounded-4xl p-6 sm:p-10 shadow-xl space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-primary/20">
                  <div>
                    <h2 className="font-heading font-black text-3xl text-primary">
                      Personal Digital Stamp Card
                    </h2>
                    <p className="text-dark/80 text-sm font-medium">
                      {isUnlocked
                        ? "Congratulations! You've completed 9 stamps."
                        : `Collect ${9 - points} more stamps to claim your 10th free burger!`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleAddStamp}
                      disabled={isUnlocked}
                      className={`px-5 py-2.5 rounded-full font-heading font-extrabold text-xs uppercase tracking-wider shadow-md transition-all ${
                        isUnlocked
                          ? 'bg-dark/20 text-dark/40 cursor-not-allowed'
                          : 'bg-primary hover:bg-primary-hover text-cream active:scale-95'
                      }`}
                    >
                      + Simulate Scan (+1 Stamp)
                    </button>
                    <button
                      onClick={handleResetStamps}
                      aria-label="Reset stamps"
                      className="p-2.5 rounded-full bg-cream border border-primary/20 text-primary hover:bg-primary/10 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 10 Circular Punch Slots Grid */}
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4">
                  {Array.from({ length: 10 }).map((_, index) => {
                    const isFilled = index < points;
                    const is10thSlot = index === 9;

                    return (
                      <motion.div
                        key={index}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: index * 0.04, type: 'spring', stiffness: 300 }}
                        className={`relative aspect-square rounded-full flex items-center justify-center font-heading font-extrabold text-lg sm:text-xl transition-all shadow-md ${
                          is10thSlot
                            ? isUnlocked
                              ? 'bg-accent text-dark border-4 border-dark ring-4 ring-accent/50 animate-pulse-glow'
                              : 'bg-accent/20 border-4 border-dashed border-accent text-dark'
                            : isFilled
                            ? 'bg-primary text-cream border-2 border-primary-dark shadow-inner'
                            : 'bg-cream border-2 border-dashed border-primary/30 text-primary/40'
                        }`}
                      >
                        {is10thSlot ? (
                          <div className="flex flex-col items-center justify-center">
                            <Star className={`w-6 h-6 ${isUnlocked ? 'fill-dark text-dark' : 'text-accent fill-accent'}`} />
                            <span className="text-[8px] font-black uppercase text-dark">FREE</span>
                          </div>
                        ) : isFilled ? (
                          <CheckCircle2 className="w-5 h-5 text-accent stroke-[3]" />
                        ) : (
                          <span>{index + 1}</span>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-dark/80 font-medium">
                    <QrCode className="w-4 h-4 text-primary shrink-0" />
                    <span>Scan your table QR code at EM's Burgers Chembur Camp to automatically add stamps!</span>
                  </div>
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
              {currentUser?.orders && currentUser.orders.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {currentUser.orders.map((order, idx) => (
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
                            Order #{order.id}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-heading font-bold uppercase">
                            ✓ {order.status}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-dark/60">
                          Ordered on {order.date}
                        </div>

                        <div className="space-y-1.5 pt-2 border-t border-primary/10">
                          {order.items.map((item, i) => (
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
                          <div className="font-heading font-black text-xl text-primary">₹{order.total}</div>
                        </div>

                        <button
                          onClick={() => handleReorder(order.id)}
                          className="px-4 py-2 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-bold text-xs shadow-sm active:scale-95 transition-all flex items-center gap-1.5"
                        >
                          {reorderedId === order.id ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                              <span>Added!</span>
                            </>
                          ) : (
                            <>
                              <RotateCcw className="w-3.5 h-3.5" />
                              <span>Reorder Dish</span>
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
                  <h3 className="font-heading font-bold text-2xl text-dark">No Previous Orders Yet</h3>
                  <p className="text-dark/60 text-sm max-w-xs mx-auto">
                    Your past order receipts will automatically appear here once you place orders at EM's Burgers.
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: MY FAVOURITES */}
          {activeTab === 'favourites' && (
            <motion.div
              key="favourites"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
            >
              {favouritedItems.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favouritedItems.map((item) => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center bg-cream-light rounded-4xl border-2 border-dashed border-primary/20 space-y-4">
                  <Heart className="w-12 h-12 text-primary/40 mx-auto" />
                  <h3 className="font-heading font-bold text-2xl text-dark">No Favourites Saved Yet</h3>
                  <p className="text-dark/60 text-sm max-w-xs mx-auto">
                    Tap the heart icon on any burger or side in our menu to save your personal favorites!
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
