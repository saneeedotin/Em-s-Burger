import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, MapPin, Heart, Star } from 'lucide-react';
import { StoreStatusBadge } from './StoreStatusBadge';

gsap.registerPlugin(ScrollTrigger);

// Burger images for hover cycle (stop-motion)
const BURGER_IMAGES = [
  '/assets/Meltdown_transparent.png',
  '/assets/708468998_17892310314525648_8171975173938103261_n_transparent.png',
  '/assets/708877450_17892310341525648_1301759277739848721_n_transparent.png',
  '/assets/709135090_17892310296525648_3515263033773386689_n_transparent.png',
  '/assets/707763630_17892310278525648_2934076488276589577_n_transparent.png',
  '/assets/707838302_17892310305525648_7641931861532538183_n_transparent.png',
];

// Navbar is h-20 = 80px
const NAVBAR_HEIGHT = 80;

export function Hero() {
  const containerRef = useRef(null);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [isHoveringBurger, setIsHoveringBurger] = useState(false);
  const [burgerIndex, setBurgerIndex] = useState(0);

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  // Stop-motion hover effect
  useEffect(() => {
    if (!isHoveringBurger) { setBurgerIndex(0); return; }
    const interval = setInterval(() => {
      setBurgerIndex(prev => (prev + 1) % BURGER_IMAGES.length);
    }, 380);
    return () => clearInterval(interval);
  }, [isHoveringBurger]);

  // Entry animations
  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.timeline({ defaults: { ease: 'power4.out' } })
      .from('.h-badge',     { y: 16, opacity: 0, duration: 0.7, delay: 0.15 })
      .from('.h-line',      { y: 48, opacity: 0, rotateX: -12, stagger: 0.14, duration: 1, transformOrigin: '0% 50%' }, '-=0.5')
      .from('.h-desc',      { y: 20, opacity: 0, duration: 0.7 }, '-=0.55')
      .from('.h-cta > *',   { y: 16, opacity: 0, stagger: 0.1, duration: 0.6 }, '-=0.5');
  }, { scope: containerRef });

  // Subtle parallax on mouse move
  const handleMouseMove = (e) => {
    if (isTouchDevice) return;
    const xPos = (e.clientX / window.innerWidth  - 0.5) * 2;
    const yPos = (e.clientY / window.innerHeight - 0.5) * 2;
    gsap.to('.h-parallax-slow', { x: xPos *  8, y: yPos *  8, duration: 1.2, ease: 'power2.out' });
    gsap.to('.h-parallax-fast', { x: xPos * -6, y: yPos * -6, duration: 1.2, ease: 'power2.out' });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative bg-primary overflow-hidden"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)`, minHeight: '680px', maxHeight: '100vh' }}
    >
      {/* ── SVG Grunge Filter for distressed heading text ── */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="grunge-text">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" seed="2" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" result="displaced" />
            <feComposite in="displaced" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
      </svg>

      {/* ── Background food doodle pattern (dark maroon on red) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500' viewBox='0 0 500 500'%3E%3Cg fill='none' stroke='%237A1206' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cg transform='translate(40,30) scale(3.2) rotate(-10)'%3E%3Cpath d='M3 12h18'/%3E%3Cpath d='M4 17h16a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2z'/%3E%3Cpath d='M4 12c0 -4.4 3.6 -8 8 -8s8 3.6 8 8'/%3E%3Cpath d='M10 7l-1 1'/%3E%3Cpath d='M14 7l1 1'/%3E%3Cpath d='M12 5v1'/%3E%3C/g%3E%3Cg transform='translate(300,50) scale(3.2) rotate(15)'%3E%3Cpath d='M6 8h12l-1.5 12c-.1 1.1-1 2-2.1 2H9.6c-1.1 0-2-.9-2.1-2L6 8z'/%3E%3Cpath d='M5 5h14'/%3E%3Cpath d='M14 5V2h-2L11 5'/%3E%3C/g%3E%3Cg transform='translate(50,300) scale(3.2) rotate(-15)'%3E%3Cpath d='M12 14l-1 1'/%3E%3Cpath d='M13.75 18.25l-1.25 1.42'/%3E%3Cpath d='M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12'/%3E%3Cpath d='M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z'/%3E%3C/g%3E%3Cg transform='translate(340,310) scale(3.2) rotate(10)'%3E%3Ccircle cx='12' cy='13' r='8'/%3E%3Cpath d='M12 5c-1-2-3-3-5-3 0 2 1 4 3 5 1 .5 2 1 2 1s1-.5 2-1c2-1 3-3 3-5-2 0-4 1-5 3z'/%3E%3C/g%3E%3Cg transform='translate(180,180) scale(3.2) rotate(5)'%3E%3Cpath d='M21 16V8c0-1-1-2-2-2H9L3 13v3c0 1 1 2 2 2h14c1 0 2-1 2-2z'/%3E%3Cpath d='M3 13h18'/%3E%3Ccircle cx='8' cy='10' r='1'/%3E%3Ccircle cx='15' cy='11' r='1.5'/%3E%3Ccircle cx='11' cy='15' r='1'/%3E%3C/g%3E%3Cg transform='translate(420,180) scale(3.2) rotate(-20)'%3E%3Cpath d='M19 14H5a2 2 0 0 1-2-2 7 7 0 0 1 14 0 2 2 0 0 1-2 2z'/%3E%3Cpath d='M9 7l1 2'/%3E%3Cpath d='M15 7l-1 2'/%3E%3C/g%3E%3Cg transform='translate(160,400) scale(3.2) rotate(8)'%3E%3Cpath d='M3 12h18'/%3E%3Cpath d='M4 17h16a2 2 0 0 1 -2 2H6a2 2 0 0 1 -2 -2z'/%3E%3Cpath d='M4 12c0 -4.4 3.6 -8 8 -8s8 3.6 8 8'/%3E%3Cpath d='M10 7l-1 1'/%3E%3Cpath d='M14 7l1 1'/%3E%3Cpath d='M12 5v1'/%3E%3C/g%3E%3Cg transform='translate(400,430) scale(3.2) rotate(-12)'%3E%3Cpath d='M6 8h12l-1.5 12c-.1 1.1-1 2-2.1 2H9.6c-1.1 0-2-.9-2.1-2L6 8z'/%3E%3Cpath d='M5 5h14'/%3E%3Cpath d='M14 5V2h-2L11 5'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '500px 500px',
          opacity: 0.10,
        }}
      />

      {/* ── Subtle warm radial glow (right side) ─────────────────── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 80% at 72% 55%, rgba(242,120,5,0.12) 0%, transparent 70%)' }}
      />

      {/* ═══════════════════════════════════════════════════════════
          LEFT COLUMN — Headline & copy
          Absolutely positioned, never touches artwork
      ════════════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 hidden lg:flex flex-col justify-center pointer-events-none select-none
                      px-6 sm:px-10 lg:px-16 xl:px-20
                      pt-8 lg:pt-0
                      w-full lg:w-[52%]">

        {/* Badge & Live Store Status */}
        <div className="h-badge mb-5 pointer-events-auto flex items-center flex-wrap gap-2.5 w-max">
          <StoreStatusBadge className="bg-cream/90 text-dark border-cream shadow-lg" />
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cream/35 text-cream font-heading font-bold text-[11px] sm:text-xs uppercase tracking-[0.12em] backdrop-blur-sm">
            <Heart className="w-3 h-3 fill-accent text-accent flex-shrink-0" />
            Chembur Camp, Mumbai
          </span>
        </div>

        {/* Headline */}
        <h1
          className="font-heading font-black uppercase text-cream flex flex-col mb-5 lg:mb-6"
          style={{ fontSize: 'clamp(64px, 8vw, 128px)', lineHeight: 0.87, letterSpacing: '-0.01em', filter: 'url(#grunge-text)' }}
        >
          <span className="h-line block">Burgers</span>
          <span className="h-line block">Built To</span>
          <span className="h-line block text-accent relative w-max mt-1">
            Hit.
            <svg
              className="absolute -bottom-2 left-0 w-[110%] h-4 text-accent"
              preserveAspectRatio="none"
              viewBox="0 0 110 16"
              fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round"
            >
              <path d="M2 12 Q28 4 55 10 T108 8" />
            </svg>
          </span>
        </h1>

        {/* Description */}
        <p className="h-desc text-cream/90 font-medium leading-snug max-w-[26rem] mb-7 lg:mb-8"
           style={{ fontSize: 'clamp(15px, 1.2vw, 18px)' }}>
          Stack'd UFO saucers, pull-me-up cheese cascades, and hand-cut destroyed fries.
          Fresh in-house buns prepared daily.
        </p>

        {/* CTAs — desktop */}
        <div className="h-cta hidden lg:flex items-center gap-5 mb-8 pointer-events-auto">
          <Link to="/menu">
            <button className="flex items-center gap-2.5 bg-accent hover:bg-accent-hover text-dark font-heading font-black text-sm uppercase tracking-wide px-7 py-3.5 rounded-full shadow-[0_6px_18px_rgba(242,183,5,0.35)] transition-all duration-300 hover:scale-[1.03]">
              Explore Full Menu
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/locations">
            <button className="flex items-center gap-2 bg-transparent border border-cream/35 hover:border-cream text-cream font-heading font-black text-sm uppercase tracking-wide px-7 py-3.5 rounded-full transition-all duration-300 hover:bg-cream/5">
              <MapPin className="w-4 h-4" />
              Locate Em's
            </button>
          </Link>
        </div>

      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT ARTWORK — Absolutely positioned poster composition
          z-layered from back to front:
            1. MELT DOWN type
            2. Burger (with hover swap)
            3. Melt Mode callout
      ════════════════════════════════════════════════════════════ */}
      <div className="absolute top-0 right-0 h-full w-[55%] lg:w-[52%] pointer-events-none hidden lg:block">
        {/* ── 1. MELT DOWN background typography ── */}
        <div
          className="h-parallax-slow absolute top-[6%] right-[8%] select-none pointer-events-none opacity-40 mix-blend-color-burn"
          style={{ zIndex: 0 }}
        >
          <h2
            className="font-heading font-black leading-[0.8] text-right"
            style={{
              fontSize: 'clamp(120px, 14vw, 210px)',
              color: '#8B180A',
              WebkitTextStroke: '2px #7A1206',
            }}
          >
            MELT<br />DOWN
          </h2>
        </div>
        {/* ── 2. THE BURGER ───────────────────────────────────────── */}
        {/* Preload all images silently */}
        <div className="hidden">
          {BURGER_IMAGES.map(s => <img key={s} src={s} alt="" />)}
        </div>

        <div
          className="h-burger h-parallax-fast absolute pointer-events-auto"
          onMouseEnter={() => setIsHoveringBurger(true)}
          onMouseLeave={() => setIsHoveringBurger(false)}
          style={{
            bottom: '10%',
            left: '46%',
            transform: 'translateX(-50%)',
            width: 'min(560px, 78%)',
            zIndex: 2,
          }}
        >
          {/* Subtle contact shadow */}
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-[50%]"
            style={{
              width: '60%',
              height: '20px',
              background: 'radial-gradient(ellipse, rgba(20,0,0,0.55) 0%, transparent 70%)',
              filter: 'blur(8px)',
              zIndex: 0,
            }}
          />
          <div className="relative w-full" style={{ height: 'min(480px, 65vh)', zIndex: 1 }}>
            <img
              src={BURGER_IMAGES[burgerIndex]}
              alt="The Meltdown Burger"
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-[120ms]"
              style={{ transform: burgerIndex === 0 ? 'scale(1)' : 'scale(1.85) translateY(-6%)' }}
            />
          </div>
        </div>

        {/* ── 3. MELT MODE callout (upper-left of burger) ─────────── */}
        <div
          className="h-callout absolute"
          style={{ top: '18%', left: '2%', zIndex: 3 }}
        >
          {/* Jagged starburst */}
          <div className="relative w-[100px] h-[100px] flex items-center justify-center -rotate-[14deg] hover:rotate-0 transition-transform duration-300 cursor-default">
            <svg
              className="absolute inset-0 w-full h-full text-cream drop-shadow"
              viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"
            >
              <path d="M50 4 L61 26 L86 14 L74 36 L96 50 L74 64 L86 86 L61 74 L50 96 L39 74 L14 86 L26 64 L4 50 L26 36 L14 14 L39 26 Z" />
            </svg>
            <span className="relative z-10 font-heading font-black text-cream text-[13px] leading-tight uppercase tracking-wide text-center">
              Melt<br />Mode<br />On
            </span>
          </div>
          {/* Hand-drawn arrow toward burger */}
          <svg
            className="absolute text-cream/70"
            style={{ top: '82%', left: '74%', width: '36px', height: '36px' }}
            viewBox="0 0 56 56" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          >
            <path d="M 4 6 Q 38 18 44 50" />
            <path d="M 28 44 L 44 50 L 38 34" />
          </svg>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          MOBILE LAYOUT — stacked, no absolute positioning
      ════════════════════════════════════════════════════════════ */}
      <div className="lg:hidden flex flex-col justify-between h-full p-6 overflow-y-auto">
        {/* Badge & Live Store Status */}
        <div className="mb-3 flex items-center flex-wrap gap-2">
          <StoreStatusBadge className="bg-cream text-dark border-cream shadow-md scale-95 origin-left" />
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cream/35 text-cream font-heading font-bold text-[10px] uppercase tracking-[0.12em]">
            <Heart className="w-2.5 h-2.5 fill-accent text-accent" />
            Chembur, Mumbai
          </span>
        </div>
        {/* Headline */}
        <h1 className="font-heading font-black uppercase text-cream flex flex-col mb-3"
            style={{ fontSize: 'clamp(52px, 14vw, 80px)', lineHeight: 0.88, filter: 'url(#grunge-text)' }}>
          <span>Burgers</span>
          <span>Built To</span>
          <span className="text-accent relative w-max">
            Hit.
            <svg className="absolute -bottom-1 left-0 w-full h-3 text-accent" preserveAspectRatio="none" viewBox="0 0 100 12" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round">
              <path d="M2 9 Q25 3 50 7 T98 6" />
            </svg>
          </span>
        </h1>
        {/* Burger */}
        <div className="relative flex-shrink-0 flex items-center justify-center py-2 overflow-visible"
             style={{ height: 'clamp(250px, 60vw, 350px)' }}
             onClick={() => setBurgerIndex(prev => (prev + 1) % BURGER_IMAGES.length)}>
          <img 
            src={BURGER_IMAGES[burgerIndex]} 
            alt="The Meltdown Burger" 
            className="w-full h-full max-w-[380px] object-contain transition-opacity duration-[120ms]" 
            style={{ transform: burgerIndex === 0 ? 'scale(1)' : 'scale(1.85) translateY(-6%)' }}
          />
        </div>
        {/* Description */}
        <p className="text-cream/90 font-medium text-sm leading-snug mb-4">
          Stack'd UFO saucers, pull-me-up cheese cascades, and hand-cut destroyed fries. Fresh in-house buns prepared daily.
        </p>
        {/* CTAs */}
        <div className="flex flex-col gap-3">
          <Link to="/menu">
            <button className="w-full flex items-center justify-center gap-2 bg-accent text-dark font-heading font-black text-sm uppercase tracking-wide py-3.5 rounded-full shadow-[0_6px_18px_rgba(242,183,5,0.3)]">
              Explore Full Menu <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/locations">
            <button className="w-full flex items-center justify-center gap-2 border border-cream/30 text-cream font-heading font-black text-sm uppercase tracking-wide py-3.5 rounded-full">
              <MapPin className="w-4 h-4" /> Locate Em's
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}
