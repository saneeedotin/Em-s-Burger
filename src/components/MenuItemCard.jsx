import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Heart, Minus, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export function MenuItemCard({ item, onSelect, viewMode = 'grid' }) {
  const { id, name, isVeg, description, price, image, badge, isSignature, zomatoLink } = item;
  const { currentUser, toggleFavourite } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [quantity, setQuantity] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const isFavourited = currentUser?.favourites?.includes(id);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (!currentUser) {
      setShowLoginPrompt(true);
      setTimeout(() => setShowLoginPrompt(false), 2500);
      return;
    }
    toggleFavourite(id);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (quantity === 0) return; // Prevent adding 0 items
    addToCart(item, quantity);
    setAddedAnimation(true);
    setQuantity(0); // Reset after adding
    setTimeout(() => setAddedAnimation(false), 1000);
  };

  const incrementQty = (e) => {
    e.stopPropagation();
    setQuantity(q => q + 1);
  };

  const decrementQty = (e) => {
    e.stopPropagation();
    setQuantity(q => Math.max(0, q - 1));
  };

  return (
    <motion.div
      layout
      onClick={() => onSelect && onSelect(item)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group relative cursor-pointer bg-primary text-cream rounded-xl sm:rounded-3xl p-2 sm:p-5 border-2 ${
        isSignature ? 'border-primary-dark/40 shadow-xl' : 'border-primary-dark/20 shadow-md'
      } flex ${viewMode === 'list' ? 'flex-row items-center gap-4 sm:gap-6' : 'flex-col justify-between'} transition-all duration-300 hover:shadow-2xl hover:border-primary-dark/60`}
    >
      <div className={viewMode === 'list' ? 'flex-1 flex gap-4 sm:gap-6' : 'flex flex-col h-full'}>
        {/* Image Container with Badges */}
        <div className={`relative rounded-xl sm:rounded-2xl overflow-hidden shrink-0 ${viewMode === 'list' ? 'w-24 h-24 md:w-32 md:h-32 aspect-square' : 'aspect-square sm:aspect-[4/5] mb-2 sm:mb-4'}`}>
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badge (Bestseller / Chef's Pick / Spicy) */}
          {badge && (
            <div className="absolute top-1 right-1 sm:top-3 sm:right-3 px-1.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-accent text-dark font-heading font-extrabold text-[8px] sm:text-xs shadow-md flex items-center gap-1 z-10">
              <Sparkles className="hidden sm:block w-3 h-3 fill-dark" />
              <span>{badge}</span>
            </div>
          )}

          {/* Veg / Non-Veg Icon */}
          <div className="absolute top-1 left-1 sm:top-3 sm:left-3 bg-white/90 p-1 sm:p-1.5 rounded-md sm:rounded-lg shadow-sm backdrop-blur-xs z-10">
            {isVeg ? (
              <div className="w-4 h-4 border-2 border-emerald-600 flex items-center justify-center p-0.5">
                <div className="w-2 h-2 rounded-full bg-emerald-600" />
              </div>
            ) : (
              <div className="w-4 h-4 border-2 border-primary flex items-center justify-center p-0.5">
                <div className="w-2 h-2 rounded-full bg-primary" />
              </div>
            )}
          </div>

          {/* Heart Favourite Button */}
          <button
            onClick={handleHeartClick}
            aria-label="Add to favourites"
            className="absolute bottom-3 right-3 z-20 w-9 h-9 rounded-full bg-white/90 shadow-md backdrop-blur-xs flex items-center justify-center transition-transform active:scale-75 hover:scale-110 focus:outline-none"
          >
            <motion.div
              animate={isFavourited ? { scale: [1, 1.3, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Heart
                className={`w-5 h-5 transition-colors ${
                  isFavourited
                    ? 'text-primary fill-primary'
                    : 'text-dark/40 hover:text-primary'
                }`}
              />
            </motion.div>
          </button>

          {/* Login Prompt Popover */}
          <AnimatePresence>
            {showLoginPrompt && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute inset-0 z-30 bg-dark/90 text-cream p-4 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 backdrop-blur-xs"
              >
                <Heart className="w-8 h-8 text-accent fill-accent animate-bounce" />
                <p className="text-xs font-heading font-bold">Log in to save your favourites!</p>
                <button
                  onClick={(e) => { e.stopPropagation(); navigate('/login'); }}
                  className="px-4 py-1.5 rounded-full bg-accent text-dark font-heading font-extrabold text-xs shadow-md"
                >
                  Log In Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title & Description */}
        <div className={`space-y-1 sm:space-y-2 flex flex-col flex-1 ${viewMode === 'list' ? 'justify-center' : ''}`}>
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-2">
            <h3 className="font-heading font-bold text-sm sm:text-2xl text-cream leading-tight group-hover:text-accent transition-colors line-clamp-2">
              {name}
            </h3>
            <span className="font-heading font-black text-sm sm:text-xl text-dark shrink-0 bg-accent px-2 py-0.5 sm:px-3 sm:py-1 rounded-md sm:rounded-xl self-start">
              ₹{price}
            </span>
          </div>

          <p className="hidden sm:block text-cream/80 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Card Footer Action: Add to Cart */}
      <div className={`${viewMode === 'list' ? 'flex flex-col justify-center gap-2 shrink-0 border-l border-cream/20 pl-3 sm:pl-6 ml-auto' : 'mt-3 sm:mt-5 pt-3 sm:pt-4 border-t border-cream/20 flex flex-col gap-3'}`}>
        <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
          <div className="flex items-center bg-primary-dark/30 rounded-full border border-cream/10 p-1">
            <button
              onClick={decrementQty}
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-cream hover:bg-cream/10 rounded-full transition-colors"
            >
              <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
            <span className="w-6 sm:w-8 text-center font-heading font-bold text-sm sm:text-base">
              {quantity}
            </span>
            <button
              onClick={incrementQty}
              className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center text-cream hover:bg-cream/10 rounded-full transition-colors"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
          
          <button
            onClick={handleAddToCart}
            className={`flex items-center justify-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-heading font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 ${
              addedAnimation ? 'bg-emerald-500 text-white' : 'bg-cream text-dark hover:bg-accent'
            }`}
          >
            {addedAnimation ? (
              <>Added!</>
            ) : (
              <>
                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                Add
              </>
            )}
          </button>
        </div>

        {zomatoLink && (
          <a
            href={zomatoLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center justify-center w-full bg-[#E23744] hover:bg-[#Cb202d] text-white font-heading font-bold text-[10px] sm:text-xs px-2 py-1.5 rounded-full shadow-sm hover:shadow-md transition-all"
          >
            Order on Zomato
          </a>
        )}
      </div>
    </motion.div>
  );
}
