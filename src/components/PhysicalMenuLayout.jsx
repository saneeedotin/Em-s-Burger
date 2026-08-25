import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MENU_ITEMS } from '../data/menu';

export function PhysicalMenuLayout({ isVegOnly, onSelect }) {
  const [isFlipped, setIsFlipped] = useState(false);

  // Group items by category
  const getItems = (categories) => {
    return MENU_ITEMS.filter(item => 
      categories.includes(item.category) && 
      (isVegOnly ? item.isVeg === true : true)
    );
  };

  const frontCategories = ['classic', 'signatures', 'ufo', 'croissant', 'avocado'];
  const backCategories = ['pull-me-up', 'sliders', 'sides', 'cold-drinks', 'hot-drinks'];

  const frontItems = getItems(frontCategories);
  const backItems = getItems(backCategories);

  // Render a single category section for the physical menu
  const renderCategorySection = (title, categoryId, items) => {
    const categoryItems = items.filter(i => i.category === categoryId);
    if (categoryItems.length === 0) return null;

    return (
      <div className="mb-8 break-inside-avoid">
        <h3 className="font-heading font-black text-2xl text-accent mb-4 uppercase tracking-wide border-b-2 border-accent/30 pb-2">
          {title}
        </h3>
        <div className="space-y-4">
          {categoryItems.map(item => (
            <div 
              key={item.id} 
              onClick={() => onSelect && onSelect(item)}
              className="flex justify-between items-start gap-4 cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors -mx-2"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-extrabold text-base text-cream">{item.name}</h4>
                  {item.isVeg ? (
                    <div className="w-3 h-3 border border-emerald-600 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                    </div>
                  ) : (
                    <div className="w-3 h-3 border border-red-600 flex items-center justify-center shrink-0">
                      <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                    </div>
                  )}
                  {item.badge && (
                    <span className="px-1.5 py-0.5 rounded bg-accent/20 text-accent text-[9px] font-bold uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}
                </div>
                <p className="text-cream/70 text-xs mt-1 leading-snug">{item.description}</p>
              </div>
              <div className="font-heading font-bold text-accent whitespace-nowrap">
                ₹{item.price}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center max-w-5xl mx-auto w-full py-8 perspective-[2000px]">
      
      {/* Flip Toggle Button */}
      <button 
        onClick={() => setIsFlipped(!isFlipped)}
        className="mb-8 px-6 py-3 rounded-full bg-dark text-cream font-heading font-bold uppercase tracking-widest text-sm shadow-xl border-2 border-accent/50 hover:bg-accent hover:text-dark transition-all flex items-center gap-3 z-10"
      >
        <span className="material-symbols-outlined text-lg">Flip Menu Card</span>
        <span className="text-xs opacity-70">({isFlipped ? 'Back Side' : 'Front Side'})</span>
      </button>

      {/* 3D Flipping Card Container */}
      <div className="relative w-full max-w-4xl preserve-3d" style={{ perspective: "2000px" }}>
        <motion.div
          animate={{ rotateY: isFlipped ? 180 : 0 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 50, damping: 15 }}
          className="relative w-full preserve-3d shadow-2xl"
          style={{ transformStyle: 'preserve-3d', minHeight: '800px' }}
        >
          
          {/* FRONT SIDE */}
          <div 
            className="absolute inset-0 w-full backface-hidden bg-zinc-900 rounded-2xl border-4 border-zinc-800 p-8 sm:p-12 overflow-y-auto shadow-2xl flex flex-col scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none"></div>
            
            <div className="text-center mb-10 relative z-10">
              <h1 className="font-heading font-black text-5xl md:text-6xl text-cream tracking-tighter">
                EM'S BURGERS
              </h1>
              <p className="text-accent font-bold uppercase tracking-[0.3em] mt-2 text-sm">Chembur Camp</p>
            </div>

            <div className="columns-1 md:columns-2 gap-12 relative z-10 flex-1">
              {renderCategorySection('Classic Burgers', 'classic', frontItems)}
              {renderCategorySection('Signature Burgers', 'signatures', frontItems)}
              {renderCategorySection('Avocado Burgers', 'avocado', frontItems)}
              {renderCategorySection('UFO Burgers', 'ufo', frontItems)}
              {renderCategorySection('Croissant Takeover', 'croissant', frontItems)}
            </div>
            
            <div className="mt-8 text-center text-cream/40 text-xs font-bold uppercase tracking-widest">
              Please Turn Over for Pull Me Up, Sliders & Beverages
            </div>
          </div>

          {/* BACK SIDE */}
          <div 
            className="absolute inset-0 w-full backface-hidden bg-zinc-900 rounded-2xl border-4 border-zinc-800 p-8 sm:p-12 overflow-y-auto shadow-2xl flex flex-col scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
          >
            {/* Background Texture Overlay */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/black-paper.png')] pointer-events-none"></div>

            <div className="text-center mb-10 relative z-10">
              <h1 className="font-heading font-black text-4xl text-cream tracking-tighter">
                EM'S SPECIALS & SIDES
              </h1>
              <p className="text-accent font-bold uppercase tracking-[0.3em] mt-2 text-sm">The Good Stuff</p>
            </div>

            <div className="columns-1 md:columns-2 gap-12 relative z-10 flex-1">
              {renderCategorySection('Pull Me Up Fondue', 'pull-me-up', backItems)}
              {renderCategorySection('Slider Buckets', 'sliders', backItems)}
              {renderCategorySection('Fries & Sides', 'sides', backItems)}
              {renderCategorySection('Cold Beverages', 'cold-drinks', backItems)}
              {renderCategorySection('Hot Beverages', 'hot-drinks', backItems)}
            </div>

            <div className="mt-8 text-center text-cream/40 text-xs font-bold uppercase tracking-widest">
              All prices are inclusive of taxes. Ask for our secret sauce.
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
