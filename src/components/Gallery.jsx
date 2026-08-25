import React from 'react';
import CircularGallery from './CircularGallery';

export function Gallery() {
  const galleryItems = [
    { image: '/emsvibe.webp', text: 'The Vibe' },
    { image: '/emsvibe1.webp', text: 'Aesthetics' },
    { image: '/emsfood.webp', text: 'The Grub' },
    { image: '/emsloyalty.webp', text: 'Loyalty' },
    { image: '/emsmagzinges.webp', text: 'Features' },
    { image: '/ems entrance.webp', text: 'Welcome' }
  ];

  return (
    <section className="py-24 bg-accent text-dark border-t border-primary/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <h2 className="font-heading font-black text-4xl sm:text-5xl text-center text-primary tracking-tight">
          BEYOND THE BURGERS
        </h2>
      </div>
        
      <div className="w-full relative h-[450px] md:h-[600px]">
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.02}
          fontUrl="https://fonts.googleapis.com/css2?family=Outfit:wght@700&display=swap"
          font="bold 30px Outfit"
        />
      </div>
    </section>
  );
}
