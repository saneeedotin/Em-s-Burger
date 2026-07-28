import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, Sparkles, QrCode, ShoppingBag, Flame } from 'lucide-react';
import { InteractiveHeroFood } from './InteractiveHeroFood';
import { BouncyButton } from './BouncyButton';

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Hero Title scale & bounce entrance
      gsap.from(titleRef.current.children, {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'back.out(2)',
        delay: 0.1,
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-primary text-cream pt-12 pb-20 md:py-24 overflow-hidden border-b-8 border-accent"
    >
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-hover/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-accent/15 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div ref={titleRef} className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Highlight Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg">
              <Flame className="w-4 h-4 text-primary fill-primary" />
              <span>Chembur Camp's Favorite Burger Spot</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-cream">
              SERIOUSLY <span className="text-accent underline decoration-cream/30">JUICY</span> BURGERS.
              <br />
              NO FAST-FOOD CLIP-ART.
            </h1>

            {/* Tagline / Subheading */}
            <p className="text-cream/90 text-lg sm:text-xl font-medium max-w-2xl leading-relaxed mx-auto lg:mx-0">
              Stack'd UFO saucers, pull-me-up cheese cascades, and hand-cut destroyed fries. Fresh in-house buns prepared daily in Chembur, Mumbai.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link to="/menu">
                <BouncyButton variant="accent" size="large">
                  <span>Explore Full Menu</span>
                  <ArrowRight className="w-5 h-5" />
                </BouncyButton>
              </Link>

              <Link to="/loyalty">
                <BouncyButton variant="outline" size="large">
                  <QrCode className="w-5 h-5" />
                  <span>Loyalty Punch Card</span>
                  <span className="bg-accent text-dark text-xs px-2 py-0.5 rounded-full font-black">
                    10th Free
                  </span>
                </BouncyButton>
              </Link>
            </div>

            {/* Quick Stats / Highlights */}
            <div className="pt-8 border-t border-cream/20 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
              <div>
                <div className="font-heading font-black text-2xl lg:text-3xl text-accent">100%</div>
                <div className="text-xs font-semibold text-cream/80 uppercase">Fresh In-House Buns</div>
              </div>
              <div>
                <div className="font-heading font-black text-2xl lg:text-3xl text-accent">9+1</div>
                <div className="text-xs font-semibold text-cream/80 uppercase">Buy 9 Get 1 Free</div>
              </div>
              <div>
                <div className="font-heading font-black text-2xl lg:text-3xl text-accent">4.8★</div>
                <div className="text-xs font-semibold text-cream/80 uppercase">Chembur Foodies</div>
              </div>
            </div>

          </div>

          {/* Right Hero Image Showcase with 3D Interactive Tilt & Cheese Pour */}
          <div className="lg:col-span-5 relative flex justify-center">
            <InteractiveHeroFood />
          </div>

        </div>
      </div>
    </section>
  );
}
