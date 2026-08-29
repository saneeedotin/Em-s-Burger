import React from 'react';
import { useStoreStatus } from '../context/StoreStatusContext';
import { Flame, Moon, Clock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export function StoreStatusBadge({ size = "md", showDetails = true, className = "" }) {
  const { isOpen, customMessage, openingHours } = useStoreStatus();

  if (size === "sm") {
    return (
      <div 
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-heading font-extrabold tracking-wider uppercase border transition-all ${
          isOpen 
            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-700 dark:text-emerald-400 shadow-sm' 
            : 'bg-red-500/15 border-red-500/30 text-red-700 dark:text-red-400'
        } ${className}`}
        title={customMessage}
      >
        <span className="relative flex h-2 w-2">
          {isOpen && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpen ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
        </span>
        <span>{isOpen ? 'Store Open' : 'Store Closed'}</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full backdrop-blur-md border shadow-md select-none transition-all ${
        isOpen 
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-800' 
          : 'bg-red-500/10 border-red-500/30 text-red-800'
      } ${className}`}
    >
      {/* Animated Status Dot */}
      <span className="relative flex h-2.5 w-2.5 shrink-0">
        {isOpen && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        )}
        <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOpen ? 'bg-emerald-600' : 'bg-red-600'}`}></span>
      </span>

      {/* Main Status Text */}
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-heading font-black tracking-wider uppercase">
        {isOpen ? (
          <>
            <Flame className="w-3.5 h-3.5 text-emerald-600 fill-emerald-600 animate-bounce" />
            <span>Store Open</span>
          </>
        ) : (
          <>
            <Moon className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>Store Closed</span>
          </>
        )}
      </div>

      {/* Opening Hours Divider & Detail */}
      {showDetails && (
        <div className="hidden sm:inline-flex items-center gap-1.5 pl-2 border-l border-dark/15 text-[11px] font-bold text-dark/70">
          <Clock className="w-3 h-3 text-dark/50" />
          <span>{isOpen ? openingHours : 'Opens 12:00 PM'}</span>
        </div>
      )}
    </motion.div>
  );
}
