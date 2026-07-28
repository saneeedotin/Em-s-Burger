import React from 'react';
import { LoyaltyPunchCard } from '../components/LoyaltyPunchCard';
import { QrCode, Sparkles, Gift, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

export function Loyalty() {
  return (
    <div className="py-16 bg-cream text-dark">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent text-dark font-heading font-extrabold text-xs uppercase tracking-wider shadow-md animate-pulse-glow">
            <Gift className="w-4 h-4" />
            <span>QR Table Loyalty Experience</span>
          </div>

          <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark tracking-tight">
            EM'S BURGER CLUB PUNCH CARD
          </h1>

          <p className="text-dark/80 text-base sm:text-lg font-medium max-w-xl mx-auto">
            This is the static demo view customers see when scanning the table QR code at EM's Burgers Chembur.
          </p>
        </div>

        {/* Interactive Punch Card Component */}
        <LoyaltyPunchCard initialCount={3} />

        {/* How It Works Steps */}
        <div className="bg-cream-light rounded-4xl p-8 border-2 border-primary/15 shadow-md space-y-6">
          <h3 className="font-heading font-bold text-2xl text-primary text-center">
            How The QR Loyalty Program Works
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2 p-4 rounded-2xl bg-cream border border-primary/10">
              <div className="w-10 h-10 rounded-full bg-primary text-cream font-heading font-black text-lg flex items-center justify-center mx-auto">
                1
              </div>
              <h4 className="font-heading font-bold text-base text-dark">Scan Table QR</h4>
              <p className="text-xs text-dark/70">
                Scan the QR code on your dining table or counter receipt using your smartphone camera.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-cream border border-primary/10">
              <div className="w-10 h-10 rounded-full bg-primary text-cream font-heading font-black text-lg flex items-center justify-center mx-auto">
                2
              </div>
              <h4 className="font-heading font-bold text-base text-dark">Order Any Burger</h4>
              <p className="text-xs text-dark/70">
                Every burger ordered automatically adds a digital stamp to your mobile punch card.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-cream border border-primary/10">
              <div className="w-10 h-10 rounded-full bg-accent text-dark font-heading font-black text-lg flex items-center justify-center mx-auto">
                3
              </div>
              <h4 className="font-heading font-bold text-base text-dark">Enjoy 10th FREE!</h4>
              <p className="text-xs text-dark/70">
                Upon collecting 9 stamps, your 10th burger is unlocked 100% free on your next visit!
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
