import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Phone, ChevronRight, Check, PhoneCall } from 'lucide-react';

export function SlideToCall({ phoneNumber = '+919820098200', displayPhone = '+91 98200 98200', label = "Slide to Call" }) {
  const [isCalled, setIsCalled] = useState(false);
  const trackRef = useRef(null);
  const [maxDrag, setMaxDrag] = useState(180);

  const x = useMotionValue(0);

  // Measure track width dynamically on mount and resize
  useEffect(() => {
    const updateMaxDrag = () => {
      if (trackRef.current) {
        const trackWidth = trackRef.current.offsetWidth;
        const handleWidth = 48; // 3rem (w-12 = 48px)
        const padding = 8; // 4px padding on each side
        setMaxDrag(Math.max(60, trackWidth - handleWidth - padding));
      }
    };

    updateMaxDrag();
    window.addEventListener('resize', updateMaxDrag);
    return () => window.removeEventListener('resize', updateMaxDrag);
  }, []);

  const textOpacity = useTransform(x, [0, maxDrag * 0.6], [1, 0.1]);
  const fillWidth = useTransform(x, [0, maxDrag], [48, maxDrag + 48]);

  const handleDragEnd = (event, info) => {
    if (info.offset.x >= maxDrag * 0.7) {
      // Trigger call
      setIsCalled(true);
      if (typeof window !== 'undefined') {
        if (navigator.vibrate) navigator.vibrate(50);
        window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
      }
      setTimeout(() => {
        setIsCalled(false);
        x.set(0);
      }, 3500);
    } else {
      x.set(0);
    }
  };

  const handleDirectClick = () => {
    setIsCalled(true);
    if (typeof window !== 'undefined') {
      window.location.href = `tel:${phoneNumber.replace(/\s+/g, '')}`;
    }
    setTimeout(() => setIsCalled(false), 3000);
  };

  return (
    <div className="w-full select-none">
      <div 
        ref={trackRef}
        className="relative h-14 bg-dark/10 border-2 border-dark/15 rounded-full p-1 flex items-center overflow-hidden shadow-inner group"
      >
        {/* Dynamic Drag Progress Fill */}
        <motion.div 
          style={{ width: fillWidth }}
          className="absolute left-0 top-0 bottom-0 bg-primary/20 rounded-full pointer-events-none"
        />

        {/* Shimmering Slide Text */}
        <motion.div 
          style={{ opacity: isCalled ? 0 : textOpacity }}
          className="absolute inset-0 flex items-center justify-center pointer-events-none text-xs sm:text-sm font-heading font-black text-dark/70 tracking-wider uppercase pl-8 pr-4"
        >
          <span className="flex items-center gap-1 animate-pulse">
            {label}
            <ChevronRight className="w-4 h-4 text-primary animate-bounce inline" />
            <ChevronRight className="w-4 h-4 text-primary -ml-2.5 opacity-70" />
            <ChevronRight className="w-4 h-4 text-primary -ml-2.5 opacity-40" />
          </span>
        </motion.div>

        {/* Active Calling State Overlay */}
        {isCalled && (
          <div className="absolute inset-0 bg-emerald-600 text-white flex items-center justify-center font-heading font-black text-xs sm:text-sm tracking-wider uppercase gap-2 z-20 animate-fadeIn">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Connecting Call...</span>
          </div>
        )}

        {/* Draggable Slider Knob */}
        <motion.div
          drag={!isCalled ? "x" : false}
          dragConstraints={{ left: 0, right: maxDrag }}
          dragElastic={0.08}
          dragSnapToOrigin={!isCalled}
          onDragEnd={handleDragEnd}
          style={{ x }}
          whileTap={{ scale: 1.05 }}
          className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover text-cream flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg z-10 shrink-0 border-2 border-accent"
          title="Drag to call directly"
        >
          {isCalled ? (
            <Check className="w-5 h-5 text-accent" />
          ) : (
            <Phone className="w-5 h-5 text-accent animate-pulse" />
          )}
        </motion.div>
      </div>

      {/* Desktop Fallback Subtitle / Click to Call Hint */}
      <div className="flex justify-between items-center px-2 mt-1.5 text-[11px] font-bold text-dark/50">
        <span>Slide icon right to call</span>
        <button 
          onClick={handleDirectClick}
          className="text-primary hover:underline font-extrabold uppercase text-[10px]"
        >
          Or Click to Call
        </button>
      </div>
    </div>
  );
}
