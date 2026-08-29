import React from 'react';
import { Link } from 'react-router-dom';

export function Logo({ size = 'normal', variant = 'default', showChembur = true, className = '' }) {
  const sizes = {
    small: 'h-10 sm:h-11',
    normal: 'h-14 sm:h-15',
    large: 'h-18 sm:h-20',
  };

  const heightClass = sizes[size] || sizes.normal;

  const textColor = variant === 'red'
    ? 'text-primary'
    : variant === 'dark'
    ? 'text-dark'
    : 'text-cream';

  const logoSrc = variant === 'red' ? '/logoo-red.svg' : '/logoo.svg';

  return (
    <Link to="/" className={`inline-flex items-center gap-3 group focus:outline-none ${className}`}>
      {/* Transparent Vector Mark */}
      <div className={`relative ${heightClass} aspect-square flex items-center justify-center group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-300`}>
        <img
          src={logoSrc}
          alt="EM's Burgers Icon"
          className="w-full h-full object-contain filter drop-shadow-sm"
        />
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col text-left">
        <span className={`font-heading font-black tracking-tight leading-none ${textColor} text-2xl sm:text-3xl group-hover:text-accent transition-colors`}>
          EM’S
        </span>
        <span className={`font-heading font-extrabold tracking-widest uppercase opacity-90 text-[10px] sm:text-xs ${textColor} pt-0.5`}>
          {showChembur ? 'BURGERS • CHEMBUR' : 'BURGERS'}
        </span>
      </div>
    </Link>
  );
}
