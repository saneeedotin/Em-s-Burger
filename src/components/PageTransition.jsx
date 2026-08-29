import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PageTransition = ({ children }) => {
  const [showCurtains, setShowCurtains] = useState(true);

  // Hard safety timeout: Ensure curtains are completely unmounted after 900ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtains(false);
    }, 900);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full min-h-full">
      {/* 
        This is the actual page content. 
        Smooth, rock-solid, hardware-accelerated fade-and-rise.
      */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>

      {/* --- TRANSIENT CURTAIN WIPES (Auto-unmounts after entry) --- */}
      <AnimatePresence>
        {showCurtains && (
          <>
            {/* Red Curtain */}
            <motion.div
              className="fixed inset-0 z-30 flex flex-col pointer-events-none bg-primary overflow-visible"
              initial={{ y: '0%' }}
              animate={{ y: '160%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.15 }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[12vh] -translate-y-[99%] text-primary fill-current">
                <path d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
              </svg>
            </motion.div>

            {/* Orange Curtain */}
            <motion.div
              className="fixed inset-0 z-40 flex flex-col pointer-events-none overflow-visible"
              style={{ backgroundColor: '#F3732A' }}
              initial={{ y: '0%' }}
              animate={{ y: '160%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0.08 }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[12vh] -translate-y-[99%] fill-current text-[#F3732A]">
                <path d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
              </svg>
            </motion.div>

            {/* Yellow Curtain with Craving Text */}
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-accent overflow-visible"
              initial={{ y: '0%' }}
              animate={{ y: '160%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.85, 0, 0.15, 1], delay: 0 }}
            >
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[12vh] -translate-y-[99%] text-accent fill-current">
                <path d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
              </svg>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
                <h2 className="font-heading font-black text-5xl md:text-8xl text-primary tracking-tighter uppercase drop-shadow-md">
                  Craving...
                </h2>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
