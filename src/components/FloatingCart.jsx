import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, Plus, Minus, ArrowRight, Trash2, MessageSquare, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

export function FloatingCart() {
  const { cart, removeFromCart, updateQuantity, cartTotal, clearCart, customRequest, setCustomRequest, cartItemCount, MAX_ITEM_QTY } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  if (cart.length === 0 && !isOpen) return null;

  const handleCheckout = () => {
    setIsOpen(false);
    navigate('/checkout');
  };

  const taxes = Math.round(cartTotal * 0.05);
  const total = cartTotal + taxes;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && cart.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 bg-accent text-dark p-4 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          >
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <div className="absolute -top-2 -right-2 bg-primary text-cream w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold">
                {cartItemCount}
              </div>
            </div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-dark/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-cream z-50 shadow-2xl flex flex-col border-l-2 border-primary/20"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-primary/10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-accent/20 rounded-lg text-accent">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h2 className="font-heading font-black text-2xl text-dark">Your Order</h2>
                </div>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-dark/5 transition-colors"
                  >
                    <X className="w-6 h-6 text-dark" />
                  </button>
                </div>
              </div>

              {/* Cart Items or Empty State */}
              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                    <Utensils className="w-10 h-10 text-primary/40" />
                  </div>
                  <h3 className="font-heading font-bold text-xl text-dark/70">Your cart is empty</h3>
                  <p className="text-dark/50 text-sm max-w-xs">Add some delicious burgers from our menu!</p>
                  <Link
                    to="/menu"
                    onClick={() => setIsOpen(false)}
                    className="px-6 py-3 bg-primary text-cream rounded-full font-heading font-bold text-sm shadow-lg hover:bg-primary-dark transition-colors"
                  >
                    Browse Menu
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.map(item => (
                      <div key={item.cartItemId} className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-primary/5 relative">
                        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
                        
                        <div className="flex-1 flex flex-col">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-heading font-bold text-dark leading-tight">{item.name}</h3>
                            <button onClick={() => removeFromCart(item.cartItemId)} className="text-dark/40 hover:text-red-500 transition-colors p-1 -mr-2 -mt-2">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {item.addons?.length > 0 && (
                            <div className="text-xs text-dark/60 mb-2 leading-relaxed">
                              + {item.addons.map(a => a.name).join(', ')}
                            </div>
                          )}

                          <div className="mt-auto flex items-center justify-between">
                            <div className="font-heading font-black text-primary">
                              ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                            </div>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-cream rounded-full border border-dark/10 p-1">
                              <button
                                onClick={() => updateQuantity(item.cartItemId, -1)}
                                className="w-6 h-6 flex items-center justify-center text-dark hover:bg-dark/5 rounded-full transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-6 text-center font-heading font-bold text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.cartItemId, 1)}
                                disabled={item.quantity >= MAX_ITEM_QTY}
                                className="w-6 h-6 flex items-center justify-center text-dark hover:bg-dark/5 rounded-full transition-colors disabled:opacity-30"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Special Request */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-primary/5">
                      <label className="flex items-center gap-2 text-sm font-bold text-dark/70 mb-2">
                        <MessageSquare className="w-4 h-4" />
                        Special Requests
                      </label>
                      <textarea
                        value={customRequest}
                        onChange={(e) => setCustomRequest(e.target.value)}
                        placeholder="Any allergies, extra sauce, no onions..."
                        rows={2}
                        maxLength={300}
                        className="w-full text-sm text-dark bg-cream border border-dark/10 rounded-xl p-3 resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 placeholder:text-dark/30"
                      />
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 bg-white border-t border-primary/10 space-y-4">
                    <div className="flex justify-between items-center text-dark/60 font-medium">
                      <span>Subtotal</span>
                      <span className="font-heading text-dark font-bold">₹{cartTotal}</span>
                    </div>
                    <div className="flex justify-between items-center text-dark/60 font-medium">
                      <span>Taxes (5%)</span>
                      <span className="font-heading text-dark font-bold">₹{taxes}</span>
                    </div>
                    <div className="h-px bg-primary/10 w-full" />
                    <div className="flex justify-between items-center">
                      <span className="font-heading font-bold text-lg text-dark">Total</span>
                      <span className="font-heading font-black text-2xl text-primary">₹{total}</span>
                    </div>
                    
                    <button
                      onClick={handleCheckout}
                      className="w-full flex items-center justify-center gap-2 py-4 bg-primary text-cream rounded-2xl font-heading font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 group"
                    >
                      Checkout
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
