import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Sparkles, CheckCircle2, RotateCcw, Info, QrCode } from 'lucide-react';
import { BouncyButton } from './BouncyButton';

export function LoyaltyPunchCard({ initialCount = 3 }) {
  const [count, setCount] = useState(initialCount);
  const [justPunched, setJustPunched] = useState(null);

  const handleSlotClick = (index) => {
    if (index + 1 === count) {
      setCount(count - 1);
    } else {
      setCount(index + 1);
      setJustPunched(index);
      setTimeout(() => setJustPunched(null), 700);
    }
  };

  const resetDemo = () => {
    setCount(3);
  };

  return (
    <div className="bg-cream border-4 border-primary rounded-4xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden">
      
      {/* Stamp Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-dashed border-primary/20">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent text-dark font-heading font-extrabold text-xs tracking-wider uppercase mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 fill-dark" />
            <span>Digital Stamp Card</span>
          </div>
          <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-primary tracking-tight">
            EM's Burger Club
          </h2>
          <p className="text-dark/80 text-sm font-medium">
            Buy 9 burgers, your 10th burger is <span className="font-extrabold text-primary underline">100% FREE!</span>
          </p>
        </div>

        {/* Counter Badge */}
        <motion.div
          animate={{ rotate: [1, -2, 2, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          className="bg-primary text-cream px-5 py-3 rounded-3xl text-center shadow-lg transform hover:scale-105 transition-transform"
        >
          <div className="font-heading font-black text-3xl leading-none text-accent">
            {count} <span className="text-sm font-bold text-cream">/ 10</span>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-cream/90 font-bold">
            {count >= 10 ? '🎉 REWARD UNLOCKED!' : `${10 - count} MORE TO FREE BURGER`}
          </span>
        </motion.div>
      </div>

      {/* Slots Grid (10 Circular Slots) */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 my-6">
        {Array.from({ length: 10 }).map((_, index) => {
          const isFilled = index < count;
          const is10thSlot = index === 9;
          const isPunchedNow = justPunched === index;

          return (
            <motion.button
              key={index}
              onClick={() => handleSlotClick(index)}
              whileHover={{ scale: 1.15, rotate: is10thSlot ? 10 : -6 }}
              whileTap={{ scale: 0.85 }}
              animate={
                isPunchedNow
                  ? { scale: [1, 1.4, 0.85, 1.1, 1], rotate: [0, -12, 12, 0] }
                  : { scale: 1 }
              }
              transition={{ duration: 0.5, type: 'spring', stiffness: 400 }}
              className={`relative aspect-square rounded-full flex items-center justify-center font-heading font-extrabold text-lg sm:text-xl transition-all shadow-md focus:outline-none cursor-pointer ${
                is10thSlot
                  ? isFilled
                    ? 'bg-accent text-dark border-4 border-dark ring-4 ring-accent/50 animate-pulse-glow'
                    : 'bg-accent/20 border-4 border-dashed border-accent text-dark hover:bg-accent/40'
                  : isFilled
                  ? 'bg-primary text-cream border-2 border-primary-dark shadow-inner'
                  : 'bg-cream-light border-2 border-dashed border-primary/40 text-primary/40 hover:border-primary'
              }`}
            >
              {/* Slot Number or Stamp Icon */}
              {is10thSlot ? (
                <div className="flex flex-col items-center justify-center">
                  <Star className={`w-6 h-6 ${isFilled ? 'fill-dark text-dark animate-spin-slow' : 'text-accent fill-accent'}`} />
                  <span className="text-[8px] font-black uppercase tracking-tighter text-dark">FREE</span>
                </div>
              ) : isFilled ? (
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="flex items-center justify-center"
                >
                  <div className="relative flex flex-col items-center">
                    <span className="text-xs font-black leading-none">{index + 1}</span>
                    <CheckCircle2 className="w-4 h-4 text-accent stroke-[3] mt-0.5" />
                  </div>
                </motion.div>
              ) : (
                <span>{index + 1}</span>
              )}

              {/* Ink Ring Burst Animation */}
              {isPunchedNow && (
                <motion.span
                  initial={{ opacity: 1, scale: 0.5 }}
                  animate={{ opacity: 0, scale: 2.2 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0 rounded-full border-4 border-accent pointer-events-none"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Demo Helper Message & Controls */}
      <div className="mt-8 pt-4 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-dark/70 bg-primary/5 px-4 py-2 rounded-2xl">
          <Info className="w-4 h-4 text-primary shrink-0" />
          <span>
            <strong>Interactive Mockup Demo:</strong> Tap any circle above to simulate adding a burger stamp!
          </span>
        </div>

        <button
          onClick={resetDemo}
          className="flex items-center gap-1.5 text-primary hover:text-primary-hover font-heading font-bold text-xs underline focus:outline-none shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Demo (3/10)</span>
        </button>
      </div>

      {/* QR Instructions Box */}
      <div className="mt-6 p-4 rounded-3xl bg-primary text-cream flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cream text-primary rounded-2xl shrink-0 shadow-sm">
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-cream">How it works in-store</h4>
            <p className="text-xs text-cream/90">
              Scan the QR code at your dining table in Chembur to auto-add stamps every time you enjoy a burger.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
