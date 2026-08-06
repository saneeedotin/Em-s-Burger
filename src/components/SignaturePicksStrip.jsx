import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { MENU_ITEMS } from '../data/menu';
import { MenuItemCard } from './MenuItemCard';
import { WaveDivider } from './WaveDivider';

gsap.registerPlugin(ScrollTrigger);

export function SignaturePicksStrip() {
  const sectionRef = useRef(null);
  const cardsGridRef = useRef(null);

  const signatureItems = MENU_ITEMS.filter((item) => item.isSignature).slice(0, 4);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      gsap.from(cardsGridRef.current.children, {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="py-20 bg-cream text-dark relative overflow-hidden">
      <WaveDivider fillClass="fill-primary" position="top" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
              <Flame className="w-4 h-4 fill-primary" />
              <span>Taste The Favorites</span>
            </div>
            <h2 className="font-heading font-black text-4xl sm:text-5xl text-dark tracking-tight">
              EM'S SIGNATURE PICKS
            </h2>
            <p className="text-dark/75 text-base sm:text-lg max-w-xl font-medium">
              Handcrafted in Chembur with zero shortcuts. The dishes everyone is talking about on Instagram.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-heading font-extrabold text-primary hover:text-primary-hover text-lg group self-start md:self-end"
          >
            <span>View All Menu Items</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Cards Grid */}
        <div ref={cardsGridRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {signatureItems.map((item) => (
            <MenuItemCard key={item.id} item={item} />
          ))}
        </div>

      </div>
    </section>
  );
}
