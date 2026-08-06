import React, { useState } from 'react';
import { motion } from 'framer-motion';

export function BouncyButton({
  children,
  onClick,
  variant = 'primary',
  size = 'normal',
  className = '',
  disabled = false,
  type = 'button',
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const variants = {
    primary: 'bg-primary hover:bg-primary-hover text-cream shadow-lg hover:shadow-primary/40',
    accent: 'bg-accent hover:bg-accent-hover text-dark shadow-lg hover:shadow-accent/40 font-extrabold',
    cream: 'bg-cream hover:bg-white text-primary shadow-md hover:shadow-cream/50',
    dark: 'bg-dark hover:bg-dark-muted text-cream shadow-md',
    outline: 'bg-transparent border-2 border-cream/30 hover:border-cream text-cream hover:bg-cream/10',
  };

  const sizes = {
    small: 'px-4 py-2 text-xs font-bold rounded-full',
    normal: 'px-6 py-3 text-sm sm:text-base font-extrabold rounded-full',
    large: 'px-8 py-4 text-base sm:text-lg font-black rounded-full',
  };

  const handleClick = (e) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { id: Date.now(), x, y };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);

    if (onClick) onClick(e);
  };

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      whileHover={disabled ? {} : { scale: 1.05 }}
      whileTap={disabled ? {} : { scale: 0.94 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={`btn-micro relative inline-flex items-center justify-center gap-2 font-heading tracking-wide uppercase transition-colors overflow-hidden focus:outline-none ${
        variants[variant] || variants.primary
      } ${sizes[size] || sizes.normal} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      {...props}
    >
      {/* Shiny Light Sweep Glint Effect */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />

      {/* Ripple particles */}
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{ left: r.x, top: r.y }}
          className="absolute w-8 h-8 -ml-4 -mt-4 bg-white/40 rounded-full pointer-events-none"
        />
      ))}

      <span className="transition-blur relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}
