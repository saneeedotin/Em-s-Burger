import React, { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useVegMode } from '../context/VegModeContext';
import DriftWall from '../components/DriftWall';

const GALLERY_PINS = [
  {
    id: 'pin-menu-1',
    title: "EM's Physical Menu Card — Front",
    image: '/assets/menu.jpeg',
    isVeg: false
  },
  {
    id: 'pin-menu-2',
    title: "EM's Physical Menu Card — Back",
    image: '/assets/menu 2.jpeg',
    isVeg: false
  },
  {
    id: 'pin-pmu-1',
    title: 'Pull Me Up Molten Cheese Cascade',
    image: '/assets/Pull me up.png',
    isVeg: false
  },
  {
    id: 'pin-sb-1',
    title: 'Double Stack Burger',
    image: '/assets/Double Stack.png',
    isVeg: false
  },
  {
    id: 'pin-df-1',
    title: 'Destroyed Fries in Action',
    image: '/assets/Destroyed Fries.png',
    isVeg: true
  },
  {
    id: 'pin-mac-1',
    title: 'Deep Fried Mac & Cheese Block',
    image: '/assets/Mac and Cheese.png',
    isVeg: true
  },
  {
    id: 'pin-store-1',
    title: 'EM\'s Burgers Storefront at Night',
    image: '/assets/734472269_18077777912674347_7065558441735710182_n.jpg',
    isVeg: true
  },
  {
    id: 'pin-thecha-1',
    title: 'Spicy Thecha Burger Promotion',
    image: '/assets/753231495_17901115944525648_6127737266352346250_n.jpg',
    isVeg: true
  },
  {
    id: 'pin-cb-1',
    title: 'The Classic Cheeseburger',
    image: '/assets/The classic cheeseburger.png',
    isVeg: false
  },
  {
    id: 'pin-melt-1',
    title: 'The Meltdown Burger',
    image: '/assets/Meltdown .png',
    isVeg: false
  },
  {
    id: 'pin-croissant-1',
    title: 'Croissant Takeover',
    image: '/assets/Croissant Takeover .png',
    isVeg: false
  },
  {
    id: 'pin-tenders-1',
    title: 'Crispy Chicken Tenders',
    image: '/assets/Chicken tenders.png',
    isVeg: false
  },
  {
    id: 'pin-truffle-1',
    title: 'Truffle Mushroom Burger',
    image: '/assets/Truffle Mushroom .png',
    isVeg: true
  },
  {
    id: 'pin-veggie-1',
    title: 'Veggie Avocado Burger',
    image: '/assets/Veggie Avacado.png',
    isVeg: true
  }
];

export function GalleryPage() {
  const containerRef = useRef(null);
  const { isVegOnly } = useVegMode();

  const filteredPins = GALLERY_PINS.filter((pin) => {
    return isVegOnly ? pin.isVeg === true : true;
  });

  const driftItems = filteredPins.map(pin => ({
    image: pin.image,
    title: pin.title,
    href: undefined
  }));

  useGSAP(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    
    const tl = gsap.timeline({ delay: 0.2 }); // delay slightly to let page transition finish
    
    tl.from('.gallery-title > *', {
      y: 30,
      opacity: 0,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from('.gallery-wall', {
      opacity: 0,
      duration: 1.2,
      ease: 'power2.inOut'
    }, '-=0.4');
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="bg-dark min-h-[90vh] text-cream relative overflow-hidden flex flex-col">
      {/* Title Overlay */}
      <div className="relative z-10 pt-10 pb-4 px-4 pointer-events-none bg-gradient-to-b from-dark via-dark/80 to-transparent">
        <div className="gallery-title max-w-7xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/20 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4 fill-primary" />
            <span>EM's Aesthetic Gallery</span>
          </div>

          <h1 className="font-heading font-black text-5xl sm:text-6xl lg:text-7xl text-cream tracking-tight leading-[1.05] drop-shadow-xl">
            THE VIBE WALL
          </h1>
        </div>
      </div>

      {/* DriftWall Gallery */}
      <div className="gallery-wall flex-grow w-full relative min-h-[600px] -mt-12 mb-24">
        <div className="absolute inset-0">
          <DriftWall
            items={driftItems}
            columns={5}
            tileWidth={260}
            tileHeight={180}
            gap={24}
            tilt={16}
            turn={-14}
            perspective={1200}
            depth={120}
            speed={42}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={64}
            fade={0.6}
            dim={0.55}
            overlayColor="#0B0704"
          />
        </div>
      </div>
    </div>
  );
}
