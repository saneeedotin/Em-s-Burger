import React from 'react';
import { useStoreStatus } from '../context/StoreStatusContext';

export function StoreStatusBadge({ className = "", showHours = true }) {
  const { isOpen, openingHours } = useStoreStatus();

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cream/30 bg-black/15 backdrop-blur-md text-cream font-heading font-bold text-[11px] sm:text-xs uppercase tracking-[0.08em] shadow-sm select-none transition-all ${className}`}
    >
      {/* Subtle glowing status dot */}
      <span className="relative flex h-2 w-2 shrink-0">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-emerald-400' : 'bg-red-400'}`}></span>
      </span>

      <span className="font-extrabold">
        {isOpen ? 'Open Now' : 'Closed'}
      </span>

      {showHours && (
        <>
          <span className="opacity-30">•</span>
          <span className="opacity-80 font-medium normal-case">
            {isOpen ? '12 PM – 11 PM' : 'Opens 12 PM'}
          </span>
        </>
      )}
    </div>
  );
}
