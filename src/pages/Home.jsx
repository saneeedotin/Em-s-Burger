import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion, useScroll, useSpring } from 'framer-motion';
import { Hero } from '../components/Hero';
import { SignaturePicksStrip } from '../components/SignaturePicksStrip';
import { LoyaltyBanner } from '../components/LoyaltyBanner';
import { WaveDivider } from '../components/WaveDivider';
import { TakeAwaySection } from '../components/TakeAwaySection';
import { Gallery } from '../components/Gallery';
import { Heart, Sparkles, Utensils, Star, ShieldCheck, MapPin } from 'lucide-react';
import { useVegMode } from '../context/VegModeContext';

gsap.registerPlugin(ScrollTrigger);

export function Home() {
  const { isVegOnly } = useVegMode();
  const storyRef = useRef(null);
  const containerRef = useRef(null);
  
  // Continuous scroll path
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const pathLength = useSpring(scrollYProgress, { stiffness: 400, damping: 90 });

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Text stagger reveal
      gsap.from('.story-text > *', {
        y: 40,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.story-text',
          start: 'top 80%',
        },
      });

      // Image clip-path reveal with parallax
      const images = gsap.utils.toArray('.story-img-container');
      images.forEach((container) => {
        const img = container.querySelector('img');
        
        // Clip-path reveal for container
        gsap.fromTo(container,
          { clipPath: 'inset(0 0 100% 0)' },
          {
            clipPath: 'inset(0 0 0 0)',
            duration: 1.2,
            ease: 'power4.inOut',
            scrollTrigger: {
              trigger: container,
              start: 'top 85%',
            }
          }
        );

        // Subtle Parallax for the image inside
        gsap.fromTo(img,
          { y: -30, scale: 1.1 },
          {
            y: 30,
            scale: 1.1,
            ease: 'none',
            scrollTrigger: {
              trigger: container,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true,
            }
          }
        );
      });
    },
    { scope: storyRef }
  );

  return (
    <div ref={containerRef} className="relative space-y-0 overflow-hidden">
      
      {/* Continuous Scroll SVG Line */}
      <div className="absolute inset-0 pointer-events-none z-0 flex justify-center opacity-30">
        <svg 
          className="w-full max-w-[1200px] h-full text-accent" 
          viewBox="0 0 100 1000" 
          preserveAspectRatio="none"
        >
          <motion.path
            d="M50,0 Q90,100 50,200 T50,400 T50,600 T50,800 T50,1000"
            fill="none"
            strokeWidth="0.5"
            stroke="currentColor"
            strokeLinecap="round"
            style={{ pathLength }}
          />
        </svg>
      </div>

      <div className="relative z-10">
        {/* 1. Hero Showcase */}
        <Hero />

        {/* 2. Signature Picks Strip */}
        <SignaturePicksStrip />

        {/* 3. Loyalty Banner Teaser */}
        <LoyaltyBanner />

        {/* 4. Brand Vibe & Story Block */}
        <section className="py-24 bg-cream text-dark border-t border-primary/10 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={storyRef} className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
              
              {/* Story Image Grid */}
              <div className="lg:col-span-6 relative">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="story-img-container aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-cream bg-primary-dark">
                      <img
                        src={isVegOnly ? "/assets/Pull me up.png" : "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80"}
                        alt={isVegOnly ? "Veg Pull Me Up Cheese Burger" : "Pull Me Up Cheese Burger"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4 rounded-3xl bg-accent text-dark font-heading font-extrabold text-sm shadow-md text-center">
                      🔥 Fresh In-House Buns Daily
                    </div>
                  </div>

                  <div className="space-y-6 pt-12">
                    <div className="p-4 rounded-3xl bg-primary text-cream font-heading font-bold text-sm shadow-md text-center">
                      ✨ Dedicated Veg Prep Kitchen
                    </div>
                    <div className="story-img-container aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-cream bg-primary-dark">
                      <img
                        src={isVegOnly ? "/assets/Truffle Fries.png" : "/assets/708155000_17892310275525648_6367245464321747317_n.jpg"}
                        alt={isVegOnly ? "Truffle Fries" : "Destroyed Fries"}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Story Text */}
              <div className="story-text lg:col-span-6 space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                  <Heart className="w-4 h-4 fill-primary" />
                  <span>The EM's Philosophy</span>
                </div>

                <h2 className="font-heading font-black text-5xl sm:text-6xl text-dark tracking-tight leading-[1.1]">
                  CHEMBUR’S COOL, VIBRANT & CUTE BURGER JOINT
                </h2>

                <p className="text-dark/80 text-lg sm:text-xl font-medium leading-relaxed max-w-xl">
                  We started EM's Burgers with one simple rule: no sterile fast-food clip-art, no generic frozen patties, and no boring burgers. Located right in Chembur Camp, we smash real meat and fresh veggies onto our signature house-baked buns with bold sauces and molten cheese.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                  <div className="p-5 rounded-3xl bg-cream-light border border-primary/15 shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="font-heading font-bold text-xl text-primary flex items-center gap-2">
                      <Utensils className="w-5 h-5 text-accent" />
                      <span>Saucer UFO Burgers</span>
                    </div>
                    <p className="text-sm text-dark/70 leading-relaxed">
                      Press-sealed edges that lock in juicy flavor so every bite drips with goodness.
                    </p>
                  </div>

                  <div className="p-5 rounded-3xl bg-cream-light border border-primary/15 shadow-sm space-y-2 hover:shadow-md transition-shadow">
                    <div className="font-heading font-bold text-xl text-primary flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-accent" />
                      <span>Pure Veg & Non-Veg</span>
                    </div>
                    <p className="text-sm text-dark/70 leading-relaxed">
                      Separate grills and friers ensuring authentic taste for everyone.
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <Link
                    to="/about"
                    className="btn-micro inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-cream font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg"
                  >
                    <span className="transition-blur">Read Our Cafe Story</span>
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Take Away Plane Animation Section */}
        <TakeAwaySection />

        {/* Brand Gallery Showcase */}
        <Gallery />

        {/* 5. Customer Buzz Showcase */}
        <section className="pt-32 pb-24 bg-primary text-cream relative overflow-hidden mt-[-1px]">
          <WaveDivider fillClass="fill-accent" position="top" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12 relative z-30">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider shadow-lg">
              <Star className="w-4 h-4 text-accent fill-accent" />
              <span>Loved By Chembur Camp</span>
            </div>

            <h2 className="font-heading font-black text-4xl sm:text-5xl text-cream max-w-3xl mx-auto leading-tight">
              "FINALLY, A BURGER PLACE THAT FEELS LIKE A REAL HANGOUT SPOT."
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              <div className="p-8 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-4 hover:bg-primary-dark transition-colors">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent" />
                  ))}
                </div>
                <p className="text-base text-cream/90 italic leading-relaxed">
                  "The Pull Me Up burger is insane! The cheese cascade is totally worth the hype. Perfect spot to chill with friends."
                </p>
                <div className="font-heading font-bold text-sm text-accent pt-2">— Rohan S., Chembur Resident</div>
              </div>

              <div className="p-8 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-4 hover:bg-primary-dark transition-colors">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent" />
                  ))}
                </div>
                <p className="text-base text-cream/90 italic leading-relaxed">
                  "Super cute decor and awesome vibes! Also love the QR loyalty stamp program — already 5 stamps in!"
                </p>
                <div className="font-heading font-bold text-sm text-accent pt-2">— Ananya K., Regular Guest</div>
              </div>

              <div className="p-8 rounded-3xl bg-primary-dark/50 border border-cream/15 space-y-4 hover:bg-primary-dark transition-colors">
                <div className="flex gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent" />
                  ))}
                </div>
                <p className="text-base text-cream/90 italic leading-relaxed">
                  "Destroyed fries + cold coffee combo is unmatched. Way better quality than fast food chains."
                </p>
                <div className="font-heading font-bold text-sm text-accent pt-2">— Dev M., Local Office Goer</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
