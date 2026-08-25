import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export function HeroVisual() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // 3D Parallax Motion Values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 300, damping: 30 });

  // Subtle shifts for different layers
  const xBack = useTransform(smoothMouseX, [-150, 150], [10, -10]);
  const yBack = useTransform(smoothMouseY, [-150, 150], [10, -10]);

  const xMid = useTransform(smoothMouseX, [-150, 150], [-8, 8]);
  const yMid = useTransform(smoothMouseY, [-150, 150], [-8, 8]);

  const xFront = useTransform(smoothMouseX, [-150, 150], [-20, 20]);
  const yFront = useTransform(smoothMouseY, [-150, 150], [-20, 20]);

  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    if (isTouchDevice) return;
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      className="relative flex flex-col items-center justify-end lg:justify-center w-full h-full min-h-[500px] z-10"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* 1. Background Typography (MELT DOWN) */}
      <motion.div 
        style={{ x: isTouchDevice ? 0 : xBack, y: isTouchDevice ? 0 : yBack }}
        className="absolute top-[5%] right-[-5%] lg:right-[5%] z-0 flex flex-col items-center justify-center select-none pointer-events-none opacity-40 mix-blend-color-burn"
      >
        <h2 
          className="font-heading font-black leading-[0.8] text-center"
          style={{ 
            fontSize: 'clamp(140px, 22vw, 320px)',
            color: '#8B180A',
            WebkitTextStroke: '2px #7A1206',
          }}
        >
          MELT<br />DOWN
        </h2>
      </motion.div>

      {/* 2. 3D Cylinder Stage */}
      <div className="absolute bottom-[-10%] lg:bottom-[-15%] lg:right-[10%] z-10 w-[95%] max-w-[700px] pointer-events-none">
        <div className="relative w-full h-[250px] lg:h-[350px]">
          {/* Top face of cylinder */}
          <div className="absolute top-0 left-0 w-full h-[120px] lg:h-[180px] bg-[#D42B14] rounded-[50%] shadow-[inset_0_-10px_30px_rgba(0,0,0,0.1)] z-10 border border-[#E53820]/30" />
          {/* Body of cylinder */}
          <div className="absolute top-[60px] lg:top-[90px] left-0 w-full h-full bg-gradient-to-b from-[#B0220F] to-[#801205] z-0" />
          {/* Bottom curve matching cylinder base */}
          <div className="absolute bottom-[-60px] lg:bottom-[-90px] left-0 w-full h-[120px] lg:h-[180px] bg-[#801205] rounded-[50%] z-0" />
          {/* Burger drop shadow on stage */}
          <div className="absolute top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[50%] bg-[#801205]/60 rounded-[50%] blur-[20px] z-10" />
        </div>
      </div>

      {/* 3. The Burger Image */}
      <motion.div 
        style={{ x: isTouchDevice ? 0 : xMid, y: isTouchDevice ? 0 : yMid }}
        className="relative z-20 pointer-events-none hero-burger flex items-center justify-center w-[120%] sm:w-[100%] lg:w-[110%] max-w-[750px] lg:translate-x-12 translate-y-8 lg:translate-y-16"
      >
        <img 
          src="/assets/Meltdown_transparent.png" 
          alt="The Meltdown Burger" 
          className="w-full h-auto object-contain drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 40px 50px rgba(43, 24, 16, 0.4))'
          }}
        />
      </motion.div>

      {/* 4. Foreground Decorative Elements */}
      <motion.div 
        style={{ x: isTouchDevice ? 0 : xFront, y: isTouchDevice ? 0 : yFront }}
        className="absolute inset-0 z-30 pointer-events-none hidden sm:block"
      >
        {/* Floating Badge 1 - Melt Mode On (Starburst) */}
        <div className="absolute top-[10%] lg:top-[20%] left-[5%] lg:left-[10%] pointer-events-auto transform -rotate-6 hover:rotate-0 transition-transform duration-300">
          <svg className="w-[120px] h-[120px] absolute inset-0 -z-10 animate-spin-slow opacity-90" viewBox="0 0 100 100" fill="none" stroke="#F2B705" strokeWidth="2" strokeDasharray="6 4">
            <path d="M50 5 L55 35 L85 20 L65 45 L95 65 L65 70 L75 95 L50 75 L25 95 L35 70 L5 65 L35 45 L15 20 L45 35 Z" fill="rgba(242, 183, 5, 0.05)" />
          </svg>
          <div className="w-[120px] h-[120px] flex flex-col items-center justify-center text-center">
            <span className="font-heading font-black text-cream text-[14px] leading-tight mt-1 uppercase tracking-wider">Melt<br/>Mode<br/>On</span>
          </div>
          {/* Hand drawn arrow pointing to burger */}
          <svg className="absolute -bottom-8 -right-8 w-12 h-12 text-cream transform rotate-[120deg]" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 5 Q 20 15 35 35 M 20 35 L 35 35 L 35 20" />
          </svg>
        </div>

        {/* Floating Badge 2 - Made Fresh Daily (Circle) */}
        <div className="absolute bottom-[20%] lg:bottom-[30%] right-[2%] lg:right-[5%] w-[100px] h-[100px] rounded-full border border-cream border-dashed text-cream flex flex-col items-center justify-center font-heading text-center transform rotate-12 hover:-rotate-12 transition-transform cursor-pointer pointer-events-auto bg-[#D42B14]/20 backdrop-blur-sm">
          <span className="text-[9px] uppercase tracking-widest leading-[1] opacity-90">Made</span>
          <div className="text-2xl my-0.5">🍔</div>
          <span className="text-[9px] uppercase tracking-widest leading-[1] opacity-90">Daily</span>
        </div>
        
        {/* Floating Badge 3 - Stacked With Goodness (Box) */}
        <div className="absolute bottom-[-5%] lg:bottom-[5%] right-[5%] lg:right-[15%] border-2 border-cream/60 rounded-xl px-4 py-2 text-cream font-heading font-black text-xs uppercase tracking-widest transform -rotate-12 hover:rotate-0 transition-transform pointer-events-auto bg-[#D42B14]/40 backdrop-blur-sm shadow-xl flex flex-col gap-1">
          <div className="flex justify-between items-center w-full gap-4">
            <span>Stacked</span>
            <span className="text-xl">🍔</span>
          </div>
          <span>With</span>
          <span>Goodness</span>
        </div>

      </motion.div>
    </div>
  );
}
