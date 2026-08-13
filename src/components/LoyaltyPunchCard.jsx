import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Star, Sparkles, CheckCircle2, RotateCcw, Info, QrCode, RefreshCw, Coffee, Utensils } from 'lucide-react';
import { BouncyButton } from './BouncyButton';

const BurgerIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2.5 12a10 10 0 0 1 19 0"/>
    <path d="M2.5 12h19"/>
    <path d="M4 16h16"/>
    <path d="M6 16v1a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-1"/>
  </svg>
);

const CupSodaIcon = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m6 8 1.75 12.28A2 2 0 0 0 9.73 22h4.54a2 2 0 0 0 1.98-1.72L18 8"/>
    <path d="M5 8h14"/>
    <path d="M7 15h10"/>
    <path d="m9 8 1-6"/>
    <path d="m15 8-1-6"/>
  </svg>
);

export const CardFace = ({ type, count, setCount, justPunched, setJustPunched, onFlip, mode = 'demo', onSimulateScan, onReset }) => {
  const isBurger = type === 'burger';
  const themeAccent = isBurger ? 'bg-accent' : 'bg-primary-hover';
  const textAccent = isBurger ? 'text-accent' : 'text-primary-hover';
  const fillAccent = isBurger ? 'fill-accent' : 'fill-primary-hover';
  
  const handleSlotClick = (index) => {
    if (mode === 'dashboard') return;
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
    <div className={`bg-cream border-4 ${isBurger ? 'border-primary' : 'border-dark'} rounded-4xl p-6 sm:p-8 md:p-10 shadow-2xl relative overflow-hidden flex flex-col h-full`}>
      {/* Stamp Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-6 border-b-2 border-dashed border-primary/20">
        
        <div>
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${themeAccent} ${isBurger ? 'text-dark' : 'text-cream'} font-heading font-extrabold text-xs tracking-wider uppercase mb-2 shadow-sm`}>
            <Sparkles className={`w-3.5 h-3.5 ${isBurger ? 'fill-dark' : 'fill-cream'}`} />
            <span>Digital Stamp Card</span>
          </div>
          <h2 className={`font-heading font-extrabold text-3xl sm:text-4xl ${isBurger ? 'text-primary' : 'text-dark'} tracking-tight`}>
            {isBurger ? "EM's Burger Club" : "EM's Beverage Club"}
          </h2>
          <p className="text-dark/80 text-sm font-medium">
            Buy 9 {isBurger ? 'burgers' : 'beverages'}, your 10th is <span className={`font-extrabold ${isBurger ? 'text-primary' : 'text-dark'} underline`}>100% FREE!</span>
          </p>
        </div>

        {/* Top Right Group (Icon + Counter Badge) */}
        <div className="flex items-center gap-4 shrink-0 self-start sm:self-auto">
          {/* Icon */}
          <div className={`hidden sm:flex p-3 rounded-full ${isBurger ? 'bg-primary/10' : 'bg-dark/10'}`}>
            {isBurger ? <BurgerIcon className={`w-8 h-8 text-primary`} /> : <CupSodaIcon className={`w-8 h-8 text-dark`} />}
          </div>

          {/* Counter Badge */}
          <motion.div
            animate={{ rotate: [1, -2, 2, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className={`${isBurger ? 'bg-primary text-cream' : 'bg-dark text-cream'} px-5 py-3 rounded-3xl text-center shadow-lg transform hover:scale-105 transition-transform`}
          >
            <div className={`font-heading font-black text-3xl leading-none ${textAccent}`}>
              {count} <span className="text-sm font-bold text-cream">/ 10</span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-cream/90 font-bold">
              {count >= 10 ? '🎉 REWARD UNLOCKED!' : `${10 - count} MORE TO FREE`}
            </span>
          </motion.div>
        </div>
      </div>

      {/* Slots Grid (10 Circular Slots) */}
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-3 sm:gap-4 my-6 flex-grow">
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
                    ? `${themeAccent} ${isBurger ? 'text-dark border-dark ring-accent/50' : 'text-cream border-cream ring-primary-hover/50'} border-4 ring-4 animate-pulse-glow`
                    : `bg-cream border-4 border-dashed ${isBurger ? 'border-accent text-dark hover:bg-accent/40' : 'border-primary-hover text-dark hover:bg-primary-hover/40'}`
                  : isFilled
                  ? `${isBurger ? 'bg-primary border-primary-dark text-cream' : 'bg-dark border-gray-800 text-cream'} border-2 shadow-inner`
                  : `bg-cream-light border-2 border-dashed ${isBurger ? 'border-primary/40 text-primary/40 hover:border-primary' : 'border-dark/40 text-dark/40 hover:border-dark'}`
              }`}
            >
              {/* Slot Number or Stamp Icon */}
              {is10thSlot ? (
                <div className="flex flex-col items-center justify-center">
                  <Star className={`w-6 h-6 ${isFilled ? (isBurger ? 'fill-dark text-dark' : 'fill-cream text-cream') + ' animate-spin-slow' : textAccent + ' ' + fillAccent}`} />
                  <span className={`text-[8px] font-black uppercase tracking-tighter ${isFilled && !isBurger ? 'text-cream' : 'text-dark'}`}>FREE</span>
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
                    <CheckCircle2 className={`w-4 h-4 ${textAccent} stroke-[3] mt-0.5`} />
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
                  className={`absolute inset-0 rounded-full border-4 ${isBurger ? 'border-accent' : 'border-primary-hover'} pointer-events-none`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer Controls */}
      <div className="mt-8 pt-4 border-t border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        {mode === 'demo' ? (
          <>
            <div className={`flex items-center gap-2 ${isBurger ? 'text-dark/70 bg-primary/5' : 'text-dark/70 bg-dark/5'} px-4 py-2 rounded-2xl`}>
              <Info className={`w-4 h-4 ${isBurger ? 'text-primary' : 'text-dark'} shrink-0`} />
              <span>
                <strong>Demo:</strong> Tap any circle above to add a stamp!
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={resetDemo}
                className={`flex items-center gap-1.5 ${isBurger ? 'text-primary hover:text-primary-hover' : 'text-dark hover:text-gray-700'} font-heading font-bold text-xs underline focus:outline-none shrink-0`}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Demo</span>
              </button>
              <button
                onClick={onFlip}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isBurger ? 'bg-primary text-cream hover:bg-primary-hover' : 'bg-dark text-cream hover:bg-gray-800'} font-heading font-bold text-xs focus:outline-none shrink-0 transition-colors shadow-sm`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>View {isBurger ? 'Beverages' : 'Burgers'}</span>
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-end w-full">
            <button
              onClick={onFlip}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${isBurger ? 'bg-primary text-cream hover:bg-primary-hover' : 'bg-dark text-cream hover:bg-gray-800'} font-heading font-bold text-xs focus:outline-none shrink-0 transition-colors shadow-sm`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>View {isBurger ? 'Beverages' : 'Burgers'}</span>
            </button>
          </div>
        )}
      </div>

      {/* QR Instructions Box */}
      <div className={`mt-6 p-4 rounded-3xl ${isBurger ? 'bg-primary text-cream' : 'bg-dark text-cream'} flex items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-3 bg-cream ${isBurger ? 'text-primary' : 'text-dark'} rounded-2xl shrink-0 shadow-sm`}>
            <QrCode className="w-8 h-8" />
          </div>
          <div>
            <h4 className="font-heading font-bold text-base text-cream">How it works in-store</h4>
            <p className="text-xs text-cream/90">
              Scan the QR code at your dining table to auto-add stamps every time you enjoy a {isBurger ? 'burger' : 'beverage'}.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export function LoyaltyPunchCard({ initialCount = 3, initialBeverageCount = 2 }) {
  const [burgerCount, setBurgerCount] = useState(initialCount);
  const [beverageCount, setBeverageCount] = useState(initialBeverageCount);
  
  // Sync state if props update (e.g. real-time sync from admin)
  React.useEffect(() => {
    setBurgerCount(initialCount);
  }, [initialCount]);

  React.useEffect(() => {
    setBeverageCount(initialBeverageCount);
  }, [initialBeverageCount]);
  const [burgerJustPunched, setBurgerJustPunched] = useState(null);
  const [beverageJustPunched, setBeverageJustPunched] = useState(null);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="relative w-full" style={{ perspective: '2000px' }}>
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
            count={burgerCount}
            setCount={setBurgerCount}
            justPunched={burgerJustPunched}
            setJustPunched={setBurgerJustPunched}
            onFlip={() => setIsFlipped(true)}
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
            count={beverageCount}
            setCount={setBeverageCount}
            justPunched={beverageJustPunched}
            setJustPunched={setBeverageJustPunched}
            onFlip={() => setIsFlipped(false)}
          />
        </div>
      </motion.div>
    </div>
  );
}
