import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Sparkles, ArrowRight, Flame } from 'lucide-react';
import { useMenu } from '../context/MenuContext';
import { WaveDivider } from './WaveDivider';
import FlowingMenu from './FlowingMenu';
import { CoverflowCarousel } from './ui/coverflow-carousel';

gsap.registerPlugin(ScrollTrigger);

export function SignaturePicksStrip() {
  const sectionRef = useRef(null);
  const { items: MENU_ITEMS } = useMenu();

  const signatureItems = MENU_ITEMS.filter((item) => item.isSignature).slice(0, 6);

  const slides = signatureItems.map((item) => ({
    src: item.image,
    alt: item.name,
    title: item.name,
    subtitle: item.description,
    meta: [
      { label: "Price", value: `₹${item.price}` },
      ...(item.badge ? [{ label: "Highlight", value: item.badge }] : [])
    ]
  }));

  const flowingItems = signatureItems.map((item) => ({
    link: '#',
    text: item.name,
    image: item.image
  }));

  return (
    <section ref={sectionRef} className="py-20 bg-cream text-dark relative overflow-hidden">
      <WaveDivider fillClass="fill-primary" position="top" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col items-center text-center gap-6 mb-16 mt-20">
          <div className="space-y-6 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-sm uppercase tracking-wider">
              <Flame className="w-5 h-5 fill-primary" />
              <span>Taste The Favorites</span>
            </div>
            <h2 className="font-heading font-black text-5xl sm:text-7xl text-dark tracking-tight">
              EM'S SIGNATURE PICKS
            </h2>
            <p className="text-dark/75 text-lg sm:text-2xl max-w-2xl font-medium mx-auto">
              Handcrafted in Chembur with zero shortcuts. The dishes everyone is talking about on Instagram.
            </p>
          </div>

          <Link
            to="/menu"
            className="inline-flex items-center gap-2 font-heading font-extrabold text-primary hover:text-primary-hover text-xl sm:text-2xl group mt-4"
          >
            <span>View All Menu Items</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Carousel Component */}
        <div className="mt-8">
          <CoverflowCarousel 
            slides={slides} 
            showCaption 
            showNavigation 
            showPagination 
            className="py-12"
            cardWidth="clamp(200px, 30vw, 300px)"
          />
        </div>

        {/* Flowing Menu Component (Desktop Only) */}
        <div className="hidden md:block mt-12 rounded-[40px] overflow-hidden shadow-2xl border-4 border-primary/20" style={{ height: '500px', position: 'relative' }}>
          <FlowingMenu 
            items={flowingItems}
            speed={15}
            bgColor="#FEF7EB"
            textColor="#DB3927"
            marqueeBgColor="#DB3927"
            marqueeTextColor="#FEF7EB"
            borderColor="rgba(219, 57, 39, 0.2)"
          />
        </div>

        {/* Mobile Replacement List */}
        <div className="md:hidden mt-10 rounded-[32px] overflow-hidden shadow-2xl border-2 border-[#DB3927]/20 bg-[#FEF7EB] flex flex-col">
          {flowingItems.map((item, idx) => (
            <div 
              key={idx}
              className="px-6 py-5 border-b border-[#DB3927]/10 last:border-b-0 flex items-center justify-between active:bg-[#DB3927]/5 transition-colors cursor-pointer"
            >
              <span className="font-heading font-black text-2xl text-[#DB3927] uppercase leading-tight pr-4">
                {item.text}
              </span>
              <ArrowRight className="w-6 h-6 text-[#DB3927] shrink-0 opacity-40" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
