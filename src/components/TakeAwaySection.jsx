import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { Plane } from 'lucide-react';
import { WaveDivider } from './WaveDivider';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function TakeAwaySection() {
  const sectionRef = useRef(null);
  const planeRef = useRef(null);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

      // Animate the plane along the SVG path
      gsap.to(planeRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 60%',
          end: 'bottom -80%', // Extend into next section
          scrub: 1,
        },
        motionPath: {
          path: '#flight-path',
          align: '#flight-path',
          alignOrigin: [0.5, 0.5],
          autoRotate: 90, // rotate 90 degrees offset because our plane icon might face up/right
        },
        ease: 'none',
      });

      // Pop-in animations for the polaroids (removed as photos are removed)
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative z-20 w-full bg-accent text-cream py-32 min-h-[150vh]">
      <WaveDivider fillClass="fill-cream" position="top" />
      
      {/* Background SVG Dashed Path & Plane - Extended */}
      <div className="absolute top-0 left-0 w-full h-[220%] pointer-events-none z-0 overflow-visible">
        <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 2500" preserveAspectRatio="xMidYMin slice">
          <path
            id="flight-path"
            d="M 900,-50 C 900,100 1100,300 700,500 C 200,750 50,1000 250,1250 C 450,1500 950,1600 800,1900 C 650,2200 150,2200 250,2600"
            fill="none"
            stroke="rgba(217, 65, 42, 0.3)" /* primary color with opacity */
            strokeWidth="5"
            strokeDasharray="20 20"
            strokeLinecap="round"
          />
          
          {/* Plane inside SVG coordinate space for perfect alignment */}
          <g ref={planeRef}>
            <g transform="translate(-32, -32) rotate(-45, 32, 32)">
              <Plane width="64" height="64" className="text-primary fill-cream" strokeWidth="1.5" style={{ filter: 'drop-shadow(0 10px 8px rgb(0 0 0 / 0.04)) drop-shadow(0 4px 3px rgb(0 0 0 / 0.1))' }} />
            </g>
          </g>
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-cream text-accent font-heading font-extrabold text-sm uppercase tracking-wider shadow-sm">
            Take Away
          </div>
          
          <h2 className="font-heading font-black text-6xl sm:text-7xl lg:text-[8rem] text-cream leading-[0.9] tracking-tight uppercase drop-shadow-md">
            Quality That<br />Travels With You
          </h2>
          
          <p className="text-dark text-lg sm:text-xl font-medium max-w-md pt-4 leading-relaxed">
            Freshly packed smash burgers, ready to go wherever you crave. From our flat-top to any corner of the globe, we ensure every layer stays hot and juicy.
          </p>
        </div>
      </div>
    </section>
  );
}
