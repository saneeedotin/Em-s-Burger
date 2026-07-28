import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, Sparkles, Star, ArrowRight, Gift } from 'lucide-react';

export function LoyaltyBanner() {
  return (
    <section className="py-16 bg-cream relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-4xl bg-primary text-cream p-8 sm:p-12 md:p-14 shadow-2xl border-4 border-accent overflow-hidden">
          
          {/* Background Decorative Graphic */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-72 h-72 bg-primary-hover rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-4 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-dark font-heading font-extrabold text-xs uppercase tracking-wider shadow-md animate-pulse-glow">
                <Gift className="w-4 h-4" />
                <span>Chembur Customer Loyalty Club</span>
              </div>

              <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight text-cream">
                BUY 9 BURGERS, <span className="text-accent underline decoration-cream/40">GET THE 10TH FREE!</span>
              </h2>

              <p className="text-cream/90 text-base sm:text-lg font-medium max-w-2xl">
                No app downloads required. Simply scan the table QR code at EM's Burgers Chembur to collect digital stamps every time you visit.
              </p>
            </div>

            {/* Right Action & Badge */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-end gap-4">
              
              {/* Mini Stamp Card Visual Teaser */}
              <div className="flex items-center gap-2 bg-primary-dark/60 p-3 rounded-2xl border border-cream/20 shadow-inner">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                      i < 3 ? 'bg-cream text-primary' : i === 4 ? 'bg-accent text-dark' : 'border border-dashed border-cream/40 text-cream/40'
                    }`}
                  >
                    {i === 4 ? <Star className="w-4 h-4 fill-dark" /> : i + 1}
                  </div>
                ))}
                <span className="text-xs font-bold text-accent pl-1">... 10th Free!</span>
              </div>

              <Link
                to="/loyalty"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-accent hover:bg-accent-hover text-dark font-heading font-extrabold text-lg px-8 py-4 rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95"
              >
                <QrCode className="w-5 h-5" />
                <span>Try Loyalty Punch Card</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
