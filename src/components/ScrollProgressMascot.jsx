import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, QrCode, ShoppingBag, X, Award, Utensils } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function ScrollProgressMascot() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 30 });

  const { currentUser } = useAuth();

  return (
    <>
      {/* Top Cheese Drip Scroll Progress Bar */}
      <motion.div
        style={{ scaleX }}
        className="fixed top-0 left-0 right-0 h-1.5 bg-accent origin-left z-[100] shadow-md"
      />

      {/* Floating Bottom-Right Burger Mascot Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="mb-4 w-72 bg-cream rounded-3xl p-5 border-4 border-primary shadow-2xl space-y-3 text-dark relative origin-bottom-right"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-3 right-3 p-1 rounded-full text-dark/60 hover:text-dark"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-accent text-dark font-heading font-black text-sm flex items-center justify-center">
                  🍔
                </div>
                <div>
                  <div className="font-heading font-extrabold text-sm text-primary">EM's Express</div>
                  <div className="text-[10px] text-dark/70 font-semibold">Chembur Camp, Mumbai</div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 space-y-1">
                <div className="text-xs font-bold text-primary flex items-center justify-between">
                  <span>Loyalty Status</span>
                  <span className="text-accent font-black bg-dark px-2 py-0.5 rounded-full text-[10px]">
                    {currentUser ? `${currentUser.loyaltyPoints}/9` : '3/9 Demo'}
                  </span>
                </div>
                <p className="text-[11px] text-dark/80">
                  {currentUser
                    ? `You have ${9 - currentUser.loyaltyPoints} stamps left to claim your 10th FREE burger!`
                    : 'Buy 9 burgers, get the 10th 100% FREE!'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/loyalty"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-primary text-cream font-heading font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Card</span>
                </Link>
                <Link
                  to="/menu"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-3 rounded-xl bg-accent text-dark font-heading font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Menu</span>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot Trigger Pill */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: [0, -6, 6, 0] }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="relative group bg-primary text-cream p-4 rounded-full shadow-2xl border-4 border-accent flex items-center justify-center cursor-pointer focus:outline-none"
        >
          <span className="text-2xl select-none animate-bounce-subtle">🍔</span>
          
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-accent"></span>
          </span>
        </motion.button>
      </div>
    </>
  );
}
