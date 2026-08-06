import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function MenuItemCard({ item, onSelect }) {
  const { id, name, isVeg, description, price, image, badge, isSignature } = item;
  const { currentUser, toggleFavourite } = useAuth();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group relative bg-primary text-cream rounded-3xl p-4 sm:p-5 border-2 ${
        isSignature ? 'border-primary-dark/40 shadow-xl' : 'border-primary-dark/20 shadow-md'
      } flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:border-primary-dark/60`}
    >
      <div>
        {/* Image Container with Badges */}
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-4">
          <img
            src={image}
            alt={name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Sample Image Overlay Label */}
          <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-dark/70 text-cream text-[10px] font-bold tracking-wider backdrop-blur-xs">
            Sample Image
          </div>

          {/* Badge (Bestseller / Chef's Pick / Spicy) */}
          {badge && (
            <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-accent text-dark font-heading font-extrabold text-xs shadow-md flex items-center gap-1 z-10">
              <Sparkles className="w-3 h-3 fill-dark" />
              <span>{badge}</span>
            </div>
          )}

          {/* Veg / Non-Veg Icon */}
          <div className="absolute top-3 left-3 bg-white/90 p-1.5 rounded-lg shadow-sm backdrop-blur-xs z-10">
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
                  onClick={() => navigate('/login')}
                  className="px-4 py-1.5 rounded-full bg-accent text-dark font-heading font-extrabold text-xs shadow-md"
                >
                  Log In Now
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-cream leading-tight group-hover:text-accent transition-colors">
              {name}
            </h3>
            <span className="font-heading font-black text-xl text-dark shrink-0 bg-accent px-3 py-1 rounded-xl">
              ₹{price}
            </span>
          </div>

          <p className="text-cream/80 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="mt-5 pt-3 border-t border-cream/20 flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cream/50">
          {isVeg ? '100% Vegetarian' : 'Chef Special'}
        </span>

        <button
          onClick={() => onSelect && onSelect(item)}
          className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent-hover text-dark font-heading font-bold text-xs px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all active:scale-95"
        >
          <span>Order</span>
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
        </button>
      </div>
    </motion.div>
  );
}
