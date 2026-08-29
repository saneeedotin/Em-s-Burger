import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export function ItemModal({ item, isOpen, onClose }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [selectedAddons, setSelectedAddons] = useState([]);

  // Reset state when a new item is selected or modal opens
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setSelectedAddons([]);
      setAddedAnimation(false);
    }
  }, [isOpen, item]);

  // Standard burger addons
  const burgerCategories = ['classic', 'signatures', 'ufo', 'croissant', 'pull-me-up', 'avocado', 'sliders'];
  const addons = burgerCategories.includes(item?.category) ? [
    { id: 'a1', name: 'Extra Cheese Slice', price: 30 },
    { id: 'a2', name: 'Pickled Jalapenos', price: 20 },
    { id: 'a3', name: 'Crispy Bacon Strips', price: 60 }
  ] : [];

  if (!item) return null;

  const toggleAddon = (addon) => {
    setSelectedAddons(prev => {
      const exists = prev.find(a => a.id === addon.id);
      if (exists) return prev.filter(a => a.id !== addon.id);
      return [...prev, addon];
    });
  };

  const handleAddToCart = () => {
    if (quantity <= 0) return;

    addToCart(item, quantity, selectedAddons);
    setAddedAnimation(true);
    
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 700);
  };

  const addonTotal = selectedAddons.reduce((sum, a) => sum + a.price, 0);
  const total = (item.price + addonTotal) * quantity;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full sm:max-w-md bg-cream rounded-t-3xl sm:rounded-3xl pointer-events-auto flex flex-col max-h-[90vh] overflow-hidden shadow-2xl border border-primary/20"
            >
              {/* Image Header */}
              <div className="relative h-64 shrink-0 bg-primary/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-8 h-8 bg-dark/50 hover:bg-dark/80 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Badges */}
                {item.badge && (
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-accent text-dark font-heading font-extrabold text-xs shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 fill-dark" />
                    <span>{item.badge}</span>
                  </div>
                )}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="font-heading font-black text-2xl sm:text-3xl text-dark leading-tight">
                      {item.name}
                    </h2>
                    <span className="font-heading font-black text-xl text-primary shrink-0 ml-4">
                      ₹{item.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-dark/50 mb-3">
                    {item.isVeg ? (
                      <span className="flex items-center gap-1 text-emerald-700">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                        Vegetarian
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-primary">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Non-Veg
                      </span>
                    )}
                  </div>
                  <p className="text-dark/70 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Addons Section */}
                {addons.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-primary/10">
                    <h3 className="font-heading font-bold text-sm uppercase text-dark/60 tracking-wider">
                      Add-ons & Customizations
                    </h3>
                    <div className="space-y-2">
                      {addons.map(addon => {
                        const isSelected = selectedAddons.some(a => a.id === addon.id);
                        return (
                          <div
                            key={addon.id}
                            onClick={() => toggleAddon(addon)}
                            className={`flex items-center justify-between p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                              isSelected ? 'border-primary bg-primary/5' : 'border-dark/10 hover:border-dark/20'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                                isSelected ? 'bg-primary border-primary' : 'border-dark/30'
                              }`}>
                                {isSelected && <X className="w-3.5 h-3.5 text-white" style={{ transform: 'rotate(45deg)' }} />}
                              </div>
                              <span className="font-medium text-sm text-dark">{addon.name}</span>
                            </div>
                            <span className="font-heading font-bold text-sm text-dark/70">+₹{addon.price}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Footer */}
              <div className="p-4 sm:p-5 bg-white border-t border-primary/10 shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center bg-cream rounded-full border border-dark/10 p-1">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-dark/70 hover:bg-dark/5 rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-heading font-black text-lg">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center text-dark/70 hover:bg-dark/5 rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-heading font-bold text-base shadow-lg transition-all active:scale-95 ${
                      addedAnimation ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-primary text-cream hover:bg-primary-dark shadow-primary/30'
                    }`}
                  >
                    {addedAnimation ? (
                      <>Added to Cart!</>
                    ) : (
                      <>
                        <ShoppingBag className="w-5 h-5" />
                        Add • ₹{total}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
