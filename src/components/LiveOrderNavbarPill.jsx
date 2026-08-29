import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useActiveOrder } from '../context/ActiveOrderContext';
import { ChefHat, Bell, Clock, Sparkles, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';

export function LiveOrderNavbarPill() {
  const { activeOrder, timeLeft, deliveryCelebration, isOrderOwner } = useActiveOrder();
  const navigate = useNavigate();
  const location = useLocation();

  if (deliveryCelebration) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50 }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-emerald-600 text-white px-6 py-4 rounded-3xl shadow-2xl border-2 border-white/20 flex items-center gap-3"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center animate-bounce">
          <CheckCircle2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h4 className="font-heading font-black text-lg">Order Delivered! 🎉</h4>
          <p className="text-xs text-white/80">Thank you for dining with EM's Burgers! Taking you home...</p>
        </div>
      </motion.div>
    );
  }

  // Only show if the active order actually belongs to this customer/session
  if (!isOrderOwner || !activeOrder || activeOrder.status === 'delivered' || activeOrder.status === 'rejected') {
    return null;
  }

  const status = activeOrder.status || 'pending';
  const isPending = status === 'pending';
  const isPreparing = status === 'preparing';
  const isReady = status === 'ready';

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  const handleClick = () => {
    if (location.pathname !== '/while-you-wait') {
      navigate('/while-you-wait');
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        onClick={handleClick}
        className={`fixed bottom-6 right-6 sm:bottom-auto sm:top-24 sm:right-8 z-40 cursor-pointer group shadow-2xl rounded-full p-1.5 pl-3 border-2 transition-all active:scale-95 ${
          isPending 
            ? 'bg-amber-500 text-white border-amber-300 shadow-amber-500/30' 
            : isPreparing 
            ? 'bg-blue-600 text-white border-blue-400 shadow-blue-600/30' 
            : 'bg-emerald-600 text-white border-emerald-400 shadow-emerald-600/30'
        }`}
      >
        <div className="flex items-center gap-2.5 pr-2">
          {/* Animated Icon & Dot */}
          <div className="relative">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping absolute top-0 right-0" />
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              {isPending && <Clock className="w-4 h-4 text-white animate-spin" />}
              {isPreparing && <ChefHat className="w-4 h-4 text-white animate-bounce" />}
              {isReady && <Bell className="w-4 h-4 text-white animate-pulse" />}
            </div>
          </div>

          {/* Text Info */}
          <div className="text-left">
            <div className="flex items-center gap-1.5 font-heading font-black text-xs uppercase tracking-wider">
              <span>{activeOrder.order_token || 'Live Order'}</span>
              {activeOrder.order_type === 'table' && activeOrder.table_id && (
                <span className="bg-black/20 px-1.5 py-0.2 rounded text-[10px]">
                  T{activeOrder.table_id}
                </span>
              )}
            </div>
            
            <div className="text-[11px] font-bold text-white/90 flex items-center gap-1">
              {isPending && (
                <span>Awaiting Kitchen ({minutes}:{seconds})</span>
              )}
              {isPreparing && (
                <span>Preparing in Kitchen 👨‍🍳</span>
              )}
              {isReady && (
                <span>Food is Ready! 🍔</span>
              )}
            </div>
          </div>

          <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center ml-1 group-hover:translate-x-0.5 transition-transform">
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
