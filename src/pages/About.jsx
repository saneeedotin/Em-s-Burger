import React, { useState, useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Sparkles, ChefHat, Flame, History, X, Info, Pin, ArrowRight, Quote, Instagram, Star, ExternalLink } from 'lucide-react';
import { CoverflowCarousel } from '../components/ui/coverflow-carousel';
import BounceCards from '../components/BounceCards';
import LogoLoop from '../components/LogoLoop';

const GoogleGIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

const GOOGLE_MAPS_URL = "https://www.google.com/maps/search/?api=1&query=Em%E2%80%99s+Burger+-+Burgers+built+to+hit,+Shop+no,+20+road,+Wadavli,+Borla,+koliwada,+Chembur,+Mumbai,+Maharashtra+400074";

const GOOGLE_REVIEWS = [
  {
    id: 'g-1',
    author_name: "Pradeep Khandelwal",
    stars: 5,
    time: "2 weeks ago",
    text: "Nice juicy burgers. Chicken BBQ slider and Mushroom Truffle Burgers were especially nice. Sweet potato fries were also good, very nice packaging and cute branding.",
    colorClass: 'bg-cream-light',
    textClass: 'text-dark',
    pinClass: 'bg-primary',
    rotateClass: '-rotate-2'
  },
  {
    id: 'g-2',
    author_name: "Tanmay Sharma",
    stars: 5,
    time: "a month ago",
    text: "Great place, great aesthetic and even great burgers. If you want a quick burger bite for less money, defo order the sliders.",
    colorClass: 'bg-accent',
    textClass: 'text-dark',
    pinClass: 'bg-primary-dark',
    rotateClass: 'rotate-2'
  },
  {
    id: 'g-3',
    author_name: "Sneha Ramakrishnan",
    stars: 5,
    time: "3 weeks ago",
    text: "Tried the truffle mushroom burger, cheese fondue fries, jalapeño cheese poppers here and it exceeded my expectations. So fresh and tasty! My friends also tried chicken burgers, which they really liked. Also great music and vibe in the cafe 😊",
    colorClass: 'bg-primary',
    textClass: 'text-cream',
    pinClass: 'bg-accent',
    rotateClass: '-rotate-1'
  },
  {
    id: 'g-4',
    author_name: "Aarav Mehta",
    stars: 5,
    time: "1 month ago",
    text: "The pull-me-up cheese burger is a showstopper. Fresh house buns, crispy battered fries, and top-tier smash patties right in Chembur Camp. 10/10 recommended!",
    colorClass: 'bg-cream',
    textClass: 'text-dark',
    pinClass: 'bg-primary',
    rotateClass: 'rotate-3'
  }
];

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

  const handlePinReviewClick = () => {
    if (currentUser) {
      setShowReviewModal(true);
    } else {
      navigate('/login');
    }
  };

  const submitReview = async () => {
    if (!newReviewText.trim() || !currentUser) return;
    setIsSubmitting(true);

    const newReview = {
      user_id: currentUser.id,
      author_name: currentUser.name || "Customer",
      text: newReviewText,
    };

    try {
      const reviewToInsert = {
        ...newReview,
        created_at: serverTimestamp()
      };
      const docRef = await addDoc(collection(db, 'reviews'), reviewToInsert);
      
      // We don't have the exact server timestamp back immediately, but we can optimistically add it
      const insertedReview = { ...reviewToInsert, id: docRef.id, created_at: new Date().toISOString() };
      
      setReviews([applyRandomStyle(insertedReview), ...reviews]);
      setNewReviewText('');
      setShowReviewModal(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to post review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: 0.1,
      });

      // Card 1 (Red Hero) slides down from top on load
      tl.fromTo(
        '.anim-card-1',
        { y: -80, opacity: 0 },
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
      ).add(() => {
        // Continuous floating animation after initial entrance
        gsap.to('.anim-floating-img', {
          y: -15,
          duration: 2.5,
          yoyo: true,
          repeat: -1,
          ease: 'sine.inOut',
          stagger: 0.4
        });
      });

      // --- SCROLL TRIGGERS FOR SUBSEQUENT SECTIONS ---

      // Card 2 (Dark Narrative section)
      gsap.fromTo(
        '.anim-card-2',
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-card-2', start: 'top 85%' }
        }
      );

      gsap.fromTo(
        '.anim-card-2-content',
        { y: 40, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2,
          scrollTrigger: { trigger: '.anim-card-2', start: 'top 85%' }
        }
      );

      // Card 3 (Yellow Favourite Picks section)
      gsap.fromTo(
        '.anim-card-3',
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-card-3', start: 'top 85%' }
        }
      );

      gsap.fromTo(
        '.anim-pick-card', // note: this class needs to be on the LogoLoop items if not already
        { y: 40, opacity: 0, scale: 0.95 },
        { 
          y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.2)', stagger: 0.1,
          scrollTrigger: { trigger: '.anim-card-3', start: 'top 75%' }
        }
      );

      // Card 4 (Corkboard Reviews)
      gsap.fromTo(
        '.anim-card-4',
        { y: 100, opacity: 0 },
        { 
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: '.anim-card-4', start: 'top 85%' }
        }
      );

      gsap.fromTo(
        '.anim-sticky-note',
        { y: 60, opacity: 0, rotation: () => Math.random() * 20 - 10, scale: 0.8 },
        { 
          y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.5)', stagger: 0.1,
          scrollTrigger: { trigger: '.anim-card-4', start: 'top 75%' }
        }
      );
      
      ScrollTrigger.refresh();
    },
    { scope: storyContainerRef }
  );

  const driftItems = useMemo(() => {
    return [
      { image: '/assets/Pull me up.png', title: 'Pull me up' },
      { image: '/assets/Destroyed Fries.png', title: 'Destroyed Fries' },
      { image: '/assets/THECHA BURGER.png', title: 'Thecha Burger' },
      ...favoritePicks.map(p => ({ image: p.img, title: p.name }))
    ];
  }, []);

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

          {/* Bento Grid Graphics on Right */}
          <div className="lg:col-span-5 relative h-[300px] md:h-[400px] w-full">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full w-full">
              {/* Main Burger - Left Tall */}
              <div className="anim-floating-img col-span-1 row-span-2 rounded-[2rem] overflow-hidden border-4 border-cream shadow-2xl hover:scale-[1.02] transition-transform duration-300">
                <img src="/assets/Pull me up.png" alt="Chef craft" className="w-full h-full object-cover" />
              </div>
              {/* Top Right Fries */}
              <div className="anim-floating-img col-span-1 row-span-1 rounded-[2rem] overflow-hidden border-4 border-cream shadow-xl hover:scale-[1.02] transition-transform duration-300">
                <img src="/assets/Destroyed Fries.png" alt="Sides craft" className="w-full h-full object-cover" />
              </div>
              {/* Bottom Right Thecha */}
              <div className="anim-floating-img col-span-1 row-span-1 rounded-[2rem] overflow-hidden border-4 border-cream shadow-lg hover:scale-[1.02] transition-transform duration-300 bg-accent/20">
                <img src="/assets/THECHA BURGER.png" alt="Spicy craft" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: Overlapping Story & Narrative (Deep Dark Brown Background) */}
      <section className="anim-card-2 relative bg-dark text-cream pt-24 pb-28 px-4 sm:px-6 lg:px-8 -mt-12 rounded-[60px] md:rounded-[100px] z-20 shadow-xl">
        <div className="anim-card-2-content max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Carousel Component */}
          <div className="lg:col-span-5 relative h-[380px] w-full mt-4 md:mt-0">
            <CoverflowCarousel slides={[
              { src: "/assets/Meltdown .png", alt: "Meltdown", title: "Meltdown", subtitle: "Burgers built to hit" },
              { src: "/assets/Mac and Cheese.png", alt: "Mac & Cheese", title: "Mac & Cheese", subtitle: "Deep fried perfection" },
              { src: "/assets/The classic cheeseburger.png", alt: "Classic Burger", title: "Classic Cheese", subtitle: "Simple & perfect" }
            ]} />
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

      {/* SECTION 3: Selection Panel's Favourite Picks (LogoLoop Marquee Layout) */}
      <section className="anim-card-3 relative bg-accent text-dark pt-24 pb-28 -mt-12 rounded-t-[60px] md:rounded-t-[100px] z-30 shadow-2xl overflow-hidden">
        
        {/* Decorative Background Typography */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none opacity-[0.06] overflow-hidden select-none">
          <div className="whitespace-nowrap font-heading font-black text-[12vw] sm:text-[10vw] leading-[0.8] tracking-tighter -ml-20 transform -rotate-3">
            FAVOURITE PICKS FAVOURITE PICKS FAVOURITE PICKS
          </div>
          <div className="whitespace-nowrap font-heading font-black text-[12vw] sm:text-[10vw] leading-[0.8] tracking-tighter ml-20 transform -rotate-3 mt-8 text-dark">
            SIGNATURES SIGNATURES SIGNATURES SIGNATURES
          </div>
          <div className="whitespace-nowrap font-heading font-black text-[12vw] sm:text-[10vw] leading-[0.8] tracking-tighter -ml-32 transform -rotate-3 mt-8">
            CHEF'S CHOICE CHEF'S CHOICE CHEF'S CHOICE
          </div>
        </div>

        <div className="relative max-w-full mx-auto space-y-16 z-10">
          
          <div className="text-center space-y-3 px-4">
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

          <div className="w-full overflow-hidden py-4">
            <LogoLoop
              logos={favoritePicks}
              speed={50}
              direction="left"
              logoHeight={260}
              gap={32}
              hoverSpeed={10}
              fadeOut={true}
              fadeOutColor="#eebc2f" /* Match bg-accent */
              ariaLabel="Favourite Picks Loop"
              renderItem={(pick) => (
                <div 
                  className="anim-pick-card bg-cream/40 backdrop-blur-md rounded-3xl p-3 cursor-pointer hover:bg-cream/60 transition-all border-2 border-dark/5 shadow-[0_8px_30px_rgb(0,0,0,0.12)] group flex flex-col justify-between"
                  style={{ width: '280px', height: '340px' }}
                  onClick={() => setSelectedDish(pick)}
                >
                  <div className="overflow-hidden rounded-2xl mb-4 h-[250px] relative">
                    <img src={pick.img} alt={pick.name} className="w-full h-full object-cover shadow-inner transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-dark/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay pointer-events-none"></div>
                  </div>
                  <h3 className="text-dark font-heading font-bold text-center text-xl mb-2 leading-tight drop-shadow-sm">{pick.name}</h3>
                </div>
              )}
            />
          </div>

          <div className="text-center pt-4 px-4 relative z-20">
            <Link
              to="/menu"
              className="inline-flex items-center gap-2 bg-dark hover:bg-dark/90 text-cream font-heading font-bold text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>Explore The Full Menu</span>
            </Link>
          </div>

        </div>
      </section>

      {/* SECTION 4: Corkboard Google Reviews */}
      <section className="anim-card-4 relative bg-dark text-cream pt-28 pb-36 px-4 sm:px-6 lg:px-8 -mt-12 rounded-t-[60px] md:rounded-t-[100px] z-40 shadow-2xl overflow-hidden border-t-8 border-cream/5">
        {/* Corkboard texture pattern (simple CSS repeating linear gradient) */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.3) 2px, transparent 2px)', backgroundSize: '16px 16px' }} />
        
        <div className="relative max-w-7xl mx-auto space-y-16 z-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-cream font-heading font-extrabold text-xs uppercase tracking-wider">
              <GoogleGIcon className="w-4 h-4" />
              <span>Verified Google Reviews • ⭐ 4.9 Rating</span>
            </div>

            <h2 className="font-heading font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-primary drop-shadow-md">
              What Chembur Says On Google
            </h2>

            <p className="text-cream/80 max-w-xl mx-auto font-medium text-sm sm:text-base">
              Real reviews from real foodies who visited our Chembur outlet.
            </p>

            <div className="pt-4 flex justify-center gap-4">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 bg-cream text-dark hover:bg-cream-light font-heading font-black text-xs sm:text-sm uppercase tracking-wide px-7 py-3.5 rounded-full shadow-lg transition-all hover:-translate-y-1 active:scale-95"
              >
                <GoogleGIcon className="w-4 h-4" />
                <span>View All On Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sticky Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 pb-12 px-2 md:px-0">
            {GOOGLE_REVIEWS.map((review) => (
              <div 
                key={review.id}
                className={`anim-sticky-note relative ${review.colorClass} p-6 pb-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform ${review.rotateClass} hover:rotate-0 hover:-translate-y-2 group cursor-default`}
              >
                {/* Pushpin */}
                <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 ${review.pinClass} rounded-full shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.3),_2px_4px_6px_rgba(0,0,0,0.4)] z-10`} />
                <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-3 ${review.pinClass}/50 -z-10 blur-sm`} />
                
                {/* Top Google Badge & Stars */}
                <div className="flex items-center justify-between mb-4 border-b border-dark/10 pb-2">
                  <div className="flex gap-0.5">
                    {Array.from({ length: review.stars }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-heading font-bold opacity-70">
                    <GoogleGIcon className="w-3 h-3" />
                    <span>Google Review</span>
                  </div>
                </div>

                <div className={`font-serif text-base sm:text-lg leading-relaxed ${review.textClass} mb-6 italic opacity-90 group-hover:opacity-100 transition-opacity`}>
                  "{review.text}"
                </div>

                <div className={`font-heading font-bold text-sm ${review.textClass}/90 text-right border-t border-dark/10 pt-3`}>
                  — {review.author_name}
                  <span className="block text-[10px] font-normal opacity-60 font-sans">{review.time}</span>
                </div>

                {/* Tape corner effect */}
                <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/5" style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}></div>
              </div>
            ))}
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
