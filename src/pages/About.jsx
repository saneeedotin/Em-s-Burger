import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Sparkles, ShieldCheck, Flame, Coffee, Smile } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export function About() {
  const storyContainerRef = useRef(null);
  const galleryRef = useRef(null);

  const ambienceImages = [
    {
      url: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      caption: "Cozy Dining Ambience & Warm Lighting",
      tag: "Vibe Check"
    },
    {
      url: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
      caption: "Fresh In-House Buns Baked Daily",
      tag: "Craft Quality"
    },
    {
      url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      caption: "Chembur Camp Hangout Spot for Friends",
      tag: "Community"
    },
    {
      url: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=800&q=80",
      caption: "Loaded UFO Burgers & Cold Shakes",
      tag: "Signature Food"
    }
  ];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Story line-by-line reveal
      gsap.from('.story-reveal', {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: storyContainerRef.current,
          start: 'top 80%',
        },
      });

      // Gallery stagger entrance
      gsap.from(galleryRef.current.children, {
        scale: 0.9,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 85%',
        },
      });
    },
    { scope: storyContainerRef }
  );

  return (
    <div ref={storyContainerRef} className="py-16 bg-cream text-dark space-y-20">
      
      {/* 1. Header Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
          <Heart className="w-4 h-4 fill-primary" />
          <span>Our Story & Vibe</span>
        </div>

        <h1 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl text-dark tracking-tight">
          MORE THAN A BURGER JOINT.
          <br />
          <span className="text-primary underline decoration-accent">CHEMBUR’S FAVORITE HANGOUT.</span>
        </h1>

        <p className="text-dark/80 text-base sm:text-lg font-medium max-w-2xl mx-auto">
          Born in Chembur Camp, EM's Burgers was built for foodies who love bold flavors, cozy warm lights, and good times with friends.
        </p>
      </div>

      {/* 2. Story Narrative Block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-light rounded-4xl p-8 sm:p-12 border-4 border-primary/15 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <h2 className="story-reveal font-heading font-black text-3xl sm:text-4xl text-primary">
              CLASSY, WELCOMING, AND A LITTLE CHEEKY.
            </h2>

            <p className="story-reveal text-dark/80 text-base leading-relaxed font-medium">
              When we opened EM's Burgers in Acharya Udyog Complex, Chembur, we noticed most burger places were either sterile international fast-food chains or ultra-fancy high-end restaurants. We wanted something different: a warm, energetic neighborhood burger cafe where everyone feels welcome.
            </p>

            <p className="story-reveal text-dark/80 text-base leading-relaxed font-medium">
              From our press-sealed UFO saucer burgers to our interactive Pull-Me-Up cheese cascades, every dish is crafted with personality. We bake our own fresh buns, grind spiced patties in-house, and maintain strict separate prep lines for vegetarian and non-vegetarian offerings.
            </p>

            <div className="story-reveal grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded-2xl bg-primary text-cream text-center space-y-1 shadow-md">
                <Flame className="w-6 h-6 text-accent mx-auto" />
                <div className="font-heading font-bold text-sm">Fresh Baked</div>
                <div className="text-[10px] text-cream/80">In-house buns daily</div>
              </div>

              <div className="p-4 rounded-2xl bg-accent text-dark text-center space-y-1 shadow-md">
                <ShieldCheck className="w-6 h-6 text-dark mx-auto" />
                <div className="font-heading font-bold text-sm">Pure Prep</div>
                <div className="text-[10px] text-dark/80">Separate veg/non-veg</div>
              </div>

              <div className="p-4 rounded-2xl bg-primary-dark text-cream text-center space-y-1 shadow-md col-span-2 sm:col-span-1">
                <Smile className="w-6 h-6 text-accent mx-auto" />
                <div className="font-heading font-bold text-sm">Cute Aesthetics</div>
                <div className="text-[10px] text-cream/80">Instagram-ready vibe</div>
              </div>
            </div>
          </div>

          {/* Hero Feature Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden border-4 border-primary shadow-2xl bg-primary-dark">
              <img
                src="https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80"
                alt="EM's Burgers Kitchen Craft"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-4 left-4 right-4 p-3 rounded-2xl bg-dark/80 backdrop-blur-xs text-cream text-xs text-center font-bold">
                Sample Image • EM's Craft Kitchen
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Ambience Gallery with Ken-Burns Motion */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent text-dark font-heading font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Cafe Ambience</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-4xl text-dark">
            FEEL THE CHEMBUR VIBE
          </h2>
          <p className="text-dark/70 text-sm font-medium">
            Bright string lights, cozy seating, and warm hospitality waiting for you.
          </p>
        </div>

        {/* Gallery Grid */}
        <div ref={galleryRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ambienceImages.map((img, idx) => (
            <div
              key={idx}
              className="group relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-primary/20 shadow-lg bg-primary-dark cursor-pointer"
            >
              {/* Ken-Burns Subtle Image Zoom on hover/rest */}
              <img
                src={img.url}
                alt={img.caption}
                loading="lazy"
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

              <div className="absolute bottom-4 left-4 right-4 text-cream space-y-1">
                <span className="px-2.5 py-0.5 rounded-full bg-accent text-dark font-heading font-extrabold text-[10px] uppercase">
                  {img.tag}
                </span>
                <p className="font-heading font-bold text-base leading-snug text-cream">
                  {img.caption}
                </p>
                <div className="text-[10px] text-cream/60">Sample Image</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
