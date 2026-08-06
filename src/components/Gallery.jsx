import React from 'react';

export function Gallery() {
  const galleryImages = [
    "/assets/734472269_18077777912674347_7065558441735710182_n.jpg", // Storefront
    "/assets/753231495_17901115944525648_6127737266352346250_n.jpg"  // Thecha promo
  ];

  return (
    <section className="py-24 bg-accent text-dark border-t border-primary/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="font-heading font-black text-4xl sm:text-5xl mb-12 text-center text-primary tracking-tight">
          BEYOND THE BURGERS
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center justify-center max-w-4xl mx-auto">
          {galleryImages.map((src, idx) => (
            <div 
              key={idx} 
              className="group aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border-4 border-primary/10 bg-primary-dark relative"
            >
              <img
                src={src}
                alt={`Em's Gallery ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
