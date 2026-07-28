import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Flame, Droplets, Heart } from 'lucide-react';

export function InteractiveHeroFood() {
  const [isPouringCheese, setIsPouringCheese] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-150, 150], [15, -15]);
  const rotateY = useTransform(mouseX, [-150, 150], [-15, 15]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const handleCheesePour = () => {
    setIsPouringCheese(true);
    setTimeout(() => setIsPouringCheese(false), 2200);
  };

  return (
    <div className="relative flex flex-col items-center justify-center">
      
      {/* Interactive 3D Tilt Food Card */}
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="relative w-full max-w-md lg:max-w-none aspect-[4/5] rounded-4xl border-4 border-cream shadow-2xl bg-primary-dark overflow-hidden group cursor-pointer"
      >
        {/* Burger Image */}
        <motion.img
          src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=80"
          alt="EM's Signature UFO Burger"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ transform: 'translateZ(20px)' }}
        />

        {/* Molten Cheese Pour Animation Overlay */}
        <AnimatePresence>
          {isPouringCheese && (
            <motion.div
              initial={{ y: '-100%', opacity: 0 }}
              animate={{ y: '0%', opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.77, 0, 0.175, 1] }}
              className="absolute inset-0 z-30 bg-gradient-to-b from-accent/90 via-accent/80 to-transparent pointer-events-none flex flex-col items-center justify-start pt-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-dark text-accent font-heading font-black text-xs uppercase shadow-2xl animate-bounce">
                <Droplets className="w-4 h-4 fill-accent" />
                <span>🧀 MOLTEN CHEDDAR OVERLOAD! 🧀</span>
              </div>
              
              {/* Dripping SVG Cheese Wave */}
              <svg className="w-full h-32 text-accent mt-4" viewBox="0 0 1440 320" fill="currentColor">
                <path d="M0,160C120,200,240,120,360,180C480,240,600,200,720,160C840,120,960,160,1080,200C1200,240,1320,160,1440,180L1440,0L0,0Z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Ingredient Badges (Pop out on hover in 3D space) */}
        <AnimatePresence>
          {isHovered && (
            <>
              {/* Badge 1: Fresh Buns */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: -30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: -30 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                className="absolute top-6 left-6 z-20 px-3 py-1.5 rounded-full bg-cream text-primary font-heading font-black text-xs shadow-xl flex items-center gap-1.5"
                style={{ transform: 'translateZ(50px)' }}
              >
                <Flame className="w-3.5 h-3.5 fill-primary" />
                <span>In-House Baked Bun</span>
              </motion.div>

              {/* Badge 2: Molten Cheese */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5, x: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.5, x: 30 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.05 }}
                className="absolute top-20 right-6 z-20 px-3 py-1.5 rounded-full bg-accent text-dark font-heading font-black text-xs shadow-xl flex items-center gap-1.5"
                style={{ transform: 'translateZ(60px)' }}
              >
                <Droplets className="w-3.5 h-3.5 fill-dark" />
                <span>Molten Cheddar</span>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Bottom Card Title Overlay */}
        <div
          className="absolute bottom-6 left-6 right-6 z-20 p-4 rounded-3xl bg-dark/85 backdrop-blur-md border border-cream/20 text-cream flex items-center justify-between shadow-2xl"
          style={{ transform: 'translateZ(40px)' }}
        >
          <div>
            <div className="text-[10px] uppercase font-black text-accent flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 fill-accent" />
              <span>Interactive 3D Showcase</span>
            </div>
            <div className="font-heading font-extrabold text-xl">The UFO Saucer Burger</div>
          </div>
          <span className="font-heading font-black text-2xl text-accent">₹249</span>
        </div>

      </motion.div>

      {/* Interactive Micro-CTA Button below image */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={handleCheesePour}
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent hover:bg-accent-hover text-dark font-heading font-extrabold text-xs shadow-xl cursor-pointer"
      >
        <Droplets className="w-4 h-4 fill-dark" />
        <span>Tap To Pour Cheese! 🧀</span>
      </motion.button>

    </div>
  );
}
