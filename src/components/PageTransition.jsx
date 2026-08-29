import React from 'react';
import { motion } from 'framer-motion';

const curtainVariants = {
  initial: { y: '0%', display: 'flex', visibility: 'visible' },
  animate: { 
    y: '160%', 
    transitionEnd: { display: 'none', visibility: 'hidden' } 
  },
  // Only the yellow curtain will slide back up to cover the screen on exit
  exit: { 
    y: '160%', 
    transitionEnd: { display: 'none', visibility: 'hidden' } 
  }, 
  exitCover: { 
    y: '0%', 
    display: 'flex', 
    visibility: 'visible' 
  }
};

const transitionConfig = { duration: 0.85, ease: [0.85, 0, 0.15, 1] };

export const PageTransition = ({ children }) => {
  return (
    <>
      {/* 
        This is the actual page content. We don't animate its exit heavily 
        because the curtains will cover it. We just add a slight fade/slide for polish.
      */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.35 } }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
      >
        {children}
      </motion.div>

      {/* --- CURTAINS --- */}
      {/* Red Curtain (Bottom layer of the transition) */}
      <motion.div
        className="fixed inset-0 z-30 flex flex-col pointer-events-none bg-primary overflow-visible"
        variants={curtainVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...transitionConfig, delay: 0.2 }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[15vh] -translate-y-[99%] text-primary fill-current">
          <path d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
        </svg>
      </motion.div>

      {/* Orange Curtain (Middle layer) */}
      <motion.div
        className="fixed inset-0 z-40 flex flex-col pointer-events-none overflow-visible"
        style={{ backgroundColor: '#F3732A' }}
        variants={curtainVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ ...transitionConfig, delay: 0.1 }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[15vh] -translate-y-[99%] fill-current text-[#F3732A]">
          <path d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
        </svg>
      </motion.div>

      {/* Yellow Curtain (Top layer with text) */}
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none bg-accent overflow-visible"
        variants={curtainVariants}
        initial="initial"
        animate="animate"
        exit="exitCover" // Slides UP to cover the old page on exit
        transition={{ ...transitionConfig, delay: 0 }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[15vh] -translate-y-[99%] text-accent fill-current">
          <path d="M 0 100 L 0 0 Q 50 100 100 0 L 100 100 Z" />
        </svg>
        
        {/* Craving Text Container (moves with the yellow curtain) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center">
          <h2 className="font-heading font-black text-6xl md:text-8xl text-primary tracking-tighter uppercase drop-shadow-md">
            Craving...
          </h2>
        </div>
      </motion.div>
    </>
  );
};
