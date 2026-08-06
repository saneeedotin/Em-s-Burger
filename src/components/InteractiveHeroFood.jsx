import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, useSpring } from 'framer-motion';
import { Sparkles, Flame, Droplets, Heart } from 'lucide-react';

export function InteractiveHeroFood() {
  const [isHovered, setIsHovered] = useState(false);

  // 3D Tilt Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(smoothMouseY, [-150, 150], [15, -15]);
  const rotateY = useTransform(smoothMouseX, [-150, 150], [-15, 15]);

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
          src="/assets/707874746_17892310242525648_7625750555171060675_n.jpg"
          alt="EM's Burgers Built to Hit"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          style={{ transform: 'translateZ(20px)' }}
        />

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


      </motion.div>

    </div>
  );
}
