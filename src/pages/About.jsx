import React, { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { Heart, Sparkles, ChefHat, Flame, History, X, Info } from 'lucide-react';

export function About() {
  const storyContainerRef = useRef(null);
  const [selectedDish, setSelectedDish] = useState(null);

  const favoritePicks = [
    {
      id: 'pull-me-up',
      name: 'Pull Me Up',
      img: '/assets/Pull me up.png',
      badge: 'Legendary',
      desc: 'Our signature burger with cheese pouring over it, turning comfort food into an interactive experience.',
      story: 'Designed to be visual and indulgent. We wanted to make a burger that was not just eaten, but experienced. The hot, flowing cheese cascade became a sensory experience in itself.'
    },
    {
      id: 'destroyed-fries',
      name: 'Destroyed Fries',
      img: '/assets/Destroyed Fries.png',
      badge: 'Best-Seller',
      desc: 'Comfort food with an indulgent EM\'s twist, loaded to the brim and packed with flavor.',
      story: 'We take classic golden fries and "destroy" them with our secret spices, layered cheese, and signature house-made sauces.'
    },
    {
      id: 'mac-cheese',
      name: 'Mac & Cheese',
      img: '/assets/Mac and Cheese.png',
      badge: 'Must-Try',
      desc: 'Creamy, rich macaroni and cheese, battered and deep-fried to golden-crisp perfection.',
      story: 'Why just serve mac & cheese when you can fry it? Crispy on the outside, molten and velvety on the inside.'
    },
    {
      id: 'thecha',
      name: 'Thecha Burger',
      img: '/assets/THECHA BURGER.png',
      badge: 'Fusion',
      desc: 'Our local fusion creation, packing a spicy traditional green-chilli kick into a modern burger.',
      story: 'A tribute to local flavors. We crafted a custom spicy traditional Thecha sauce that pairs beautifully with our fresh, juicy patties.'
    },
    {
      id: 'classic-cheese',
      name: 'Classic Cheese',
      img: '/assets/The classic cheeseburger.png',
      badge: 'Classic',
      desc: 'Our smashed chicken patty with classic cheese, showing that simplicity is the ultimate sophistication.',
      story: 'Our absolute best-seller. We perfected the smash technique for our chicken patties to lock in moisture and flavor.'
    },
    {
      id: 'meltdown',
      name: 'Melt Down',
      img: '/assets/Meltdown .png',
      badge: 'Heavy',
      desc: 'A massive burger that lives up to its name with layers of molten cheese and rich flavors.',
      story: 'Built for the hungry. A layered masterpiece designed to push the boundaries of what a burger can be, continuing to live up to its name.'
    }
  ];

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1,
      });

      // Card 1 (Red Hero) slides down from top
      tl.fromTo(
        '.anim-card-1',
        { y: -140, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75 }
      );

      // Hero elements inside Card 1
      tl.fromTo(
        '.anim-hero-text',
        { y: 35, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, stagger: 0.08 },
        '-=0.45'
      );

      tl.fromTo(
        '.anim-floating-img',
        { scale: 0.7, opacity: 0, rotate: -10 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.7, ease: 'back.out(1.4)', stagger: 0.1 },
        '-=0.35'
      );

      // Card 2 (Dark Narrative section) slides down from above over Card 1
      tl.fromTo(
        '.anim-card-2',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-card-2-content',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6 },
        '-=0.35'
      );

      // Card 3 (Yellow Favourite Picks section) slides down from above over Card 2
      tl.fromTo(
        '.anim-card-3',
        { y: -160, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.75, ease: 'power3.out' },
        '-=0.35'
      );

      tl.fromTo(
        '.anim-pick-card',
        { y: 35, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.2)', stagger: 0.08 },
        '-=0.35'
      );
    },
    { scope: storyContainerRef }
  );

  return (
    <div ref={storyContainerRef} className="bg-cream min-h-screen text-dark relative font-sans overflow-x-hidden">
      
      {/* SECTION 1: Wavy Hero Banner (Terracotta Red Background) */}
      <section className="anim-card-1 relative bg-primary text-cream pt-20 pb-28 px-4 sm:px-6 lg:px-8 rounded-b-[60px] md:rounded-b-[100px] z-10 shadow-lg">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="anim-hero-text inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream/15 text-cream font-heading font-extrabold text-xs uppercase tracking-wider">
              <Heart className="w-3.5 h-3.5 fill-cream" />
              <span>Who We Are</span>
            </div>
            
            <h1 className="anim-hero-text font-heading font-black text-5xl sm:text-6xl lg:text-7xl leading-none tracking-tight">
              About us
            </h1>

            <p className="anim-hero-text font-heading font-bold text-2xl sm:text-3xl text-accent leading-snug">
              The official guide to Chembur’s ultimate burger spot.
            </p>

            <p className="anim-hero-text text-cream/90 text-lg leading-relaxed max-w-xl">
              Every neighbourhood deserves that one place that feels like its own. For Chembur, that place is EM’s.
            </p>
          </div>

          {/* Floating Character / Food Graphics on Right */}
          <div className="lg:col-span-5 relative flex justify-center items-center h-[300px]">
            <div className="anim-floating-img absolute w-48 h-48 rounded-full overflow-hidden border-4 border-cream shadow-2xl z-20 left-10 transform -rotate-12 hover:scale-105 transition-transform">
              <img src="/assets/Pull me up.png" alt="Chef craft" className="w-full h-full object-cover" />
            </div>
            <div className="anim-floating-img absolute w-36 h-36 rounded-full overflow-hidden border-4 border-cream shadow-xl z-10 right-10 top-5 transform rotate-12 hover:scale-105 transition-transform">
              <img src="/assets/Destroyed Fries.png" alt="Sides craft" className="w-full h-full object-cover" />
            </div>
            <div className="anim-floating-img absolute w-28 h-28 rounded-full overflow-hidden border-4 border-cream shadow-lg z-0 bottom-5 right-20 transform -rotate-6 hover:scale-105 transition-transform">
              <img src="/assets/THECHA BURGER.png" alt="Spicy craft" className="w-full h-full object-cover" />
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Overlapping Story & Narrative (Deep Dark Brown Background) */}
      <section className="anim-card-2 relative bg-dark text-cream pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-[60px] md:rounded-[100px] z-20 shadow-xl">
        <div className="anim-card-2-content max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Overlapping Cluster of Oval/Circular Images */}
          <div className="lg:col-span-5 relative h-[380px] flex items-center justify-center">
            {/* Main Center Oval Image */}
            <div className="absolute w-[220px] h-[300px] rounded-[110px] overflow-hidden border-4 border-cream shadow-2xl z-10 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img src="/assets/Meltdown .png" alt="Burgers Built to Hit" className="w-full h-full object-cover" />
            </div>
            {/* Top Left Circle */}
            <div className="absolute w-36 h-36 rounded-full overflow-hidden border-4 border-cream shadow-xl top-4 left-6 z-20 hover:scale-105 transition-transform">
              <img src="/assets/Mac and Cheese.png" alt="Deep Fried Mac" className="w-full h-full object-cover" />
            </div>
            {/* Bottom Right Circle */}
            <div className="absolute w-40 h-40 rounded-full overflow-hidden border-4 border-cream shadow-xl bottom-4 right-6 z-20 hover:scale-105 transition-transform">
              <img src="/assets/The classic cheeseburger.png" alt="Classic burger" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Right Side: Narrative Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl leading-tight">
              Let the EM's vibe guide you around Chembur's food scene
            </h2>

            <div className="space-y-4 text-cream/90 text-base sm:text-lg font-medium">
              <p>
                Founded on <strong>18th October 2025</strong>, EM’s was created with a simple thought — Chemburkars deserved really good burgers, served their way, in a space they could call their own.
              </p>
              <p>
                Founded by <strong>Mr. Manav Talwar</strong>, who comes from a family with a longstanding legacy in hospitality, EM’s brings together his experience and a passion for creating food that is exciting, indulgent and memorable.
              </p>
              <p>
                From the very beginning, EM’s has been about doing burgers differently. Our signature Pull Me Up Burger, with cheese pouring over it, became an experience in itself, while favourites like our Destroyed Fries and Deep-Fried Mac & Cheese gave comfort food an indulgent EM’s twist. We were also among the early cafés to bring the UFO Burger to the scene.
              </p>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap gap-3 pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                <Flame className="w-4 h-4 text-accent" />
                <span>Founded Oct 18, 2025</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-cream text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
                <ChefHat className="w-4 h-4 text-accent" />
                <span>Talwar Legacy</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 3: Selection Panel's Favourite Picks (Mustard Yellow Background) */}
      <section className="anim-card-3 relative bg-accent text-dark pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-t-[60px] md:rounded-t-[100px] z-30 shadow-2xl">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-dark/10 text-dark font-heading font-extrabold text-xs uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Favourite Picks
            </span>
            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight">
              Our selection panel's favourite picks
            </h2>
            <p className="text-dark/80 max-w-xl mx-auto font-medium text-sm sm:text-base">
              Click on any pick below to reveal the behind-the-scenes story and chef's inspiration.
            </p>
          </div>

          {/* Horizontal Row of Rounded Cards (Matches leoff-paris.com/en/about) */}
          <div className="flex overflow-x-auto pb-8 pt-4 gap-6 scrollbar-thin scrollbar-thumb-dark/20 scrollbar-track-transparent px-2 snap-x">
            {favoritePicks.map((pick) => (
              <div
                key={pick.id}
                onClick={() => setSelectedDish(pick)}
                className="anim-pick-card flex-none w-[220px] sm:w-[250px] snap-center cursor-pointer group text-center space-y-4"
              >
                {/* Circular image container */}
                <div className="aspect-square w-full rounded-full overflow-hidden border-4 border-dark/95 shadow-xl bg-cream-light transform group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300 relative">
                  <img
                    src={pick.img}
                    alt={pick.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-2 py-0.5 rounded-full bg-primary text-cream font-heading font-extrabold text-[9px] uppercase shadow-md">
                      {pick.badge}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-dark group-hover:text-primary transition-colors">
                    {pick.name}
                  </h3>
                  <div className="inline-flex items-center gap-1 text-[10px] uppercase font-heading font-extrabold text-dark/60 mt-1">
                    <Info className="w-3 h-3" />
                    <span>View Story</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-dark hover:bg-dark/90 text-cream font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>Explore The Full Menu</span>
            </Link>
          </div>

        </div>
      </section>

      {/* 4. Dish Detail Modal */}
      {selectedDish && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setSelectedDish(null)}
        >
          <div 
            className="bg-cream-light border-4 border-dark rounded-4xl max-w-2xl w-full overflow-hidden shadow-2xl relative animate-scaleUp text-dark"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedDish(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-dark/10 hover:bg-dark/20 text-dark transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="aspect-square md:aspect-auto md:h-full relative bg-cream-light border-b-4 md:border-b-0 md:border-r-4 border-dark">
                <img
                  src={selectedDish.img}
                  alt={selectedDish.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-8 space-y-4 flex flex-col justify-center text-left">
                <span className="inline-block px-3 py-1 rounded-full bg-primary text-cream font-heading font-extrabold text-[10px] uppercase tracking-wider self-start">
                  {selectedDish.badge}
                </span>

                <h3 className="font-heading font-black text-3xl text-dark leading-tight">
                  {selectedDish.name}
                </h3>

                <p className="text-sm font-medium text-dark/70 leading-relaxed">
                  {selectedDish.desc}
                </p>

                <div className="pt-4 border-t border-dark/10 space-y-2">
                  <div className="font-heading font-black text-xs uppercase tracking-wider text-primary">
                    Behind The Recipe:
                  </div>
                  <p className="text-sm italic text-dark/90 leading-relaxed font-serif">
                    "{selectedDish.story}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
