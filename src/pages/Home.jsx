import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Hero } from '../components/Hero';
import { SignaturePicksStrip } from '../components/SignaturePicksStrip';
import { LoyaltyBanner } from '../components/LoyaltyBanner';
import { Heart, Sparkles, Utensils, Star, ShieldCheck, MapPin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const storyRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from(storyRef.current.children, {
        y: 40,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 80%',
        },
      });
    },
    { scope: storyRef }
  );

  return (
    <div className="space-y-0">
      {/* 1. Hero Showcase */}
      <Hero />

      {/* 2. Signature Picks Strip */}
      <SignaturePicksStrip />

      {/* 3. Loyalty Banner Teaser */}
      <LoyaltyBanner />

      {/* 4. Brand Vibe & Story Block */}
      <section className="py-20 bg-cream text-dark border-t border-b border-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Story Image Grid */}
            <div className="lg:col-span-6 relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border-2 border-primary/20 bg-primary-dark">
                    <img
                      src="https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80"
                      alt="Pull Me Up Cheese Burger"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-4 rounded-3xl bg-accent text-dark font-heading font-extrabold text-sm shadow-md">
                    🔥 Fresh In-House Buns Daily
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="p-4 rounded-3xl bg-primary text-cream font-heading font-bold text-sm shadow-md">
                    ✨ Dedicated Veg Prep Kitchen
                  </div>
                  <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-lg border-2 border-primary/20 bg-primary-dark">
                    <img
                      src="https://images.unsplash.com/photo-1576107232684-1279f3908594?auto=format&fit=crop&w=600&q=80"
                      alt="Destroyed Fries"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Story Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-primary" />
                <span>The EM's Philosophy</span>
              </div>

              <h2 className="font-heading font-black text-4xl sm:text-5xl text-dark tracking-tight leading-tight">
                CHEMBUR’S COOL, VIBRANT & CUTE BURGER JOINT
              </h2>

              <p className="text-dark/80 text-base sm:text-lg font-medium leading-relaxed">
                We started EM's Burgers with one simple rule: no sterile fast-food clip-art, no generic frozen patties, and no boring burgers. Located right in Chembur Camp, we smash real meat and fresh veggies onto our signature house-baked buns with bold sauces and molten cheese.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-cream-light border border-primary/15 shadow-sm space-y-1">
                  <div className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-accent" />
                    <span>Saucer UFO Burgers</span>
                  </div>
                  <p className="text-xs text-dark/70">
                    Press-sealed edges that lock in juicy flavor so every bite drips with goodness.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-cream-light border border-primary/15 shadow-sm space-y-1">
                  <div className="font-heading font-bold text-lg text-primary flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-accent" />
                    <span>Pure Veg & Non-Veg</span>
                  </div>
                  <p className="text-xs text-dark/70">
                    Separate grills and friers ensuring authentic taste for everyone.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-cream font-heading font-bold text-base px-6 py-3.5 rounded-full shadow-md transition-all active:scale-95"
                >
                  <span>Read Our Cafe Story</span>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Customer Buzz Showcase */}
      <section className="py-16 bg-primary text-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider shadow-md">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span>Loved By Chembur Camp</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl text-cream max-w-2xl mx-auto">
            "FINALLY, A BURGER PLACE THAT FEELS LIKE A REAL HANGOUT SPOT."
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-6 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-3">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent" />
                ))}
              </div>
              <p className="text-sm text-cream/90 italic">
                "The Pull Me Up burger is insane! The cheese cascade is totally worth the hype. Perfect spot to chill with friends."
              </p>
              <div className="font-heading font-bold text-xs text-accent">— Rohan S., Chembur Resident</div>
            </div>

            <div className="p-6 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-3">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent" />
                ))}
              </div>
              <p className="text-sm text-cream/90 italic">
                "Super cute decor and awesome vibes! Also love the QR loyalty stamp program — already 5 stamps in!"
              </p>
              <div className="font-heading font-bold text-xs text-accent">— Ananya K., Regular Guest</div>
            </div>

            <div className="p-6 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-3">
              <div className="flex gap-1 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-accent" />
                ))}
              </div>
              <p className="text-sm text-cream/90 italic">
                "Destroyed fries + cold coffee combo is unmatched. Way better quality than fast food chains."
              </p>
              <div className="font-heading font-bold text-xs text-accent">— Dev M., Local Office Goer</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
