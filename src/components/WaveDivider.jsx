import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function WaveDivider({ fillClass = 'fill-cream', position = 'bottom', className = '' }) {
  const containerRef = useRef(null);
  const svgRef = useRef(null);

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.fromTo(svgRef.current, 
      { xPercent: position === 'top' ? -15 : 15 },
      {
        xPercent: position === 'top' ? 15 : -15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1, // Add scrub smoothing
        }
      }
    );
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef}
      className={`absolute left-0 right-0 w-full overflow-hidden leading-[0] z-20 pointer-events-none ${
        position === 'top' ? 'top-0 -mt-[1px]' : 'bottom-0 rotate-180 -mb-[1px]'
      } ${className}`}
    >
      <svg
        ref={svgRef}
        className="relative block w-[150%] h-[40px] sm:h-[60px] md:h-[90px] lg:h-[120px] -ml-[25%]"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
      >
        <path
          d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
          className={fillClass}
        />
      </svg>
    </div>
  );
}
