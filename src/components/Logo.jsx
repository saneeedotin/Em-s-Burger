import React from 'react';
import { Link } from 'react-router-dom';

export function Logo({ size = 'normal', className = '' }) {
  const sizes = {
    small: 'h-11',
    normal: 'h-14 sm:h-15',
    large: 'h-18 sm:h-20',
  };

  const heightClass = sizes[size] || sizes.normal;

  return (
    <Link to="/" className={`inline-flex items-center gap-3.5 group focus:outline-none ${className}`}>
      {/* Transparent Vector Mark logoo.svg - 20% Larger */}
      <div className={`relative ${heightClass} aspect-square flex items-center justify-center group-hover:scale-110 group-hover:rotate-[-3deg] transition-all duration-300`}>
        <img
          src="/logoo.svg"
          alt="EM's Burgers Icon"
          className="w-full h-full object-contain filter drop-shadow-md"
        />
      </div>

      {/* Brand Wordmark - 20% Larger */}
      <div className="flex flex-col">
        <span className="font-heading font-black tracking-tight leading-none text-cream text-3xl sm:text-4xl group-hover:text-accent transition-colors">
          EM’S
        </span>
        <span className="font-heading font-extrabold tracking-widest uppercase opacity-90 text-xs sm:text-[13px] text-cream pt-0.5">
          BURGERS • CHEMBUR
        </span>
      </div>
    </Link>
  );
}
