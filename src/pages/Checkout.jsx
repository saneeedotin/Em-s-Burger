import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Receipt, CheckCircle2, ChevronRight, User, Utensils } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, doc, onSnapshot } from 'firebase/firestore';

export function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  
  const [orderType, setOrderType] = useState('reception'); // 'reception' | 'table'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);

  // Retrieve table from session storage if they scanned a QR code
  const tableId = sessionStorage.getItem('ems_table');

  const taxes = Math.round(cartTotal * 0.05);
  const total = cartTotal + taxes;

  if (cart.length === 0 && !orderComplete) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
        <h2 className="font-heading font-black text-3xl text-dark mb-4">Your cart is empty!</h2>
        <button 
          onClick={() => navigate('/menu')}
          className="px-6 py-3 bg-primary text-cream rounded-full font-bold shadow-lg"
        >
          Return to Menu
        </button>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    setIsSubmitting(true);

    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        user_id: currentUser.id,
        total_amount: total,
        status: 'pending',
        items: cart,
        created_at: new Date().toISOString()
      });
      
      setPlacedOrderId(docRef.id);
      setOrderComplete(true);

      // Wait for success animation then navigate (only if table order, reception waits for validation)
      if (orderType === 'table') {
        setTimeout(() => {
          clearCart();
          navigate('/while-you-wait');
        }, 2500);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (orderComplete && orderType === 'reception' && placedOrderId) {
      // Listen for status changes on the placed order
      const unsubscribe = onSnapshot(doc(db, 'orders', placedOrderId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.status !== 'pending') {
            setIsValidated(true);
            setTimeout(() => {
              clearCart();
              navigate('/while-you-wait');
            }, 3000);
          }
        }
      });

      return () => unsubscribe();
    }
  }, [orderComplete, orderType, placedOrderId, navigate, clearCart]);

  if (orderComplete && orderType === 'reception') {
    return (
      <div className="min-h-[80vh] bg-cream flex flex-col items-center justify-center p-6 text-center">
        <AnimatePresence mode="wait">
          {!isValidated ? (
            <motion.div
              key="waiting"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-amber-200 animate-ping opacity-20"></div>
                <Receipt className="w-12 h-12 text-amber-600" />
              </div>
              <h1 className="font-heading font-black text-4xl text-dark mb-4">Show this screen</h1>
              <p className="text-dark/70 max-w-md mb-8">
                Please show this screen to the cashier. Waiting for reception to confirm your order...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="validated"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-12 h-12 text-emerald-600" />
              </div>
              <h1 className="font-heading font-black text-4xl text-dark mb-4">Order Confirmed!</h1>
              <p className="text-dark/70 max-w-md mb-8">
                Your order has been validated by reception. It's now being prepared!
              </p>
              <button 
                onClick={() => navigate('/while-you-wait')}
                className="mb-8 px-6 py-3 bg-primary text-cream rounded-xl font-bold hover:bg-primary-dark transition-colors shadow-lg"
              >
                Play a game while you wait! 🎮
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={`bg-white p-6 rounded-3xl shadow-sm border w-full max-w-sm text-left transition-colors duration-500 ${isValidated ? 'border-emerald-500 ring-4 ring-emerald-500/20' : 'border-primary/10'}`}>
          <div className="flex justify-between items-center mb-4 pb-4 border-b border-dark/5">
            <span className="font-bold text-dark/60">Order Total</span>
            <span className="font-heading font-black text-2xl text-primary">₹{total}</span>
          </div>
          {cart.map(item => (
            <div key={item.cartItemId} className="flex justify-between items-center py-2">
              <span className="font-medium text-dark">{item.quantity}x {item.name}</span>
              <span className="font-bold text-dark">₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>
        <button 
          onClick={() => {
            clearCart();
            navigate('/');
          }}
          className="mt-8 text-primary font-bold hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  if (orderComplete && orderType === 'table') {
     return (
      <div className="min-h-[80vh] bg-cream flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="w-12 h-12 text-emerald-600" />
        </motion.div>
        <h1 className="font-heading font-black text-4xl text-dark mb-2">Order Sent!</h1>
        <p className="text-dark/70 max-w-md mb-8">
          The kitchen has received your order for Table {tableId || '...'}. Sit back and relax!
        </p>
      </div>
     );
  }

  return (
    <div className="pt-24 pb-12 px-4 max-w-4xl mx-auto min-h-screen">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-dark/60 hover:text-dark font-medium mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Options */}
        <div className="space-y-6">
          <h2 className="font-heading font-bold text-2xl text-dark">How are you ordering?</h2>
          
          <div className="space-y-4">
            {/* Table Order Option */}
            <label className={`block relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              orderType === 'table' ? 'border-primary bg-primary/5 shadow-md' : 'border-dark/10 hover:border-dark/20 bg-white'
            }`}>
              <input 
                type="radio" 
                name="orderType" 
                value="table"
                checked={orderType === 'table'}
                onChange={(e) => setOrderType(e.target.value)}
                className="absolute opacity-0"
              />
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  orderType === 'table' ? 'bg-primary text-cream' : 'bg-dark/5 text-dark/60'
                }`}>
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-dark mb-1">Order to Table</h3>
                  <p className="text-sm text-dark/70 leading-relaxed mb-3">
                    We'll bring the food straight to you. Requires you to be seated at a table.
                  </p>
                  
                  {orderType === 'table' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      {tableId ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified at Table {tableId}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold">
                          Please scan a table QR code first
                        </div>
                      )}

                      {!currentUser && (
                        <div className="mt-3 inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold">
                          <User className="w-3.5 h-3.5" />
                          Login required to place table orders
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </label>

            {/* Reception Order Option */}
            <label className={`block relative p-6 rounded-3xl border-2 cursor-pointer transition-all ${
              orderType === 'reception' ? 'border-primary bg-primary/5 shadow-md' : 'border-dark/10 hover:border-dark/20 bg-white'
            }`}>
              <input 
                type="radio" 
                name="orderType" 
                value="reception"
                checked={orderType === 'reception'}
                onChange={(e) => setOrderType(e.target.value)}
                className="absolute opacity-0"
              />
              <div className="flex gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  orderType === 'reception' ? 'bg-primary text-cream' : 'bg-dark/5 text-dark/60'
                }`}>
                  <Receipt className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg text-dark mb-1">Order at Reception</h3>
                  <p className="text-sm text-dark/70 leading-relaxed">
                    Show your order screen to the cashier to pay and get a token number. No login required.
                  </p>
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 sm:p-8 rounded-4xl shadow-xl border border-primary/10 h-fit">
          <h2 className="font-heading font-black text-2xl text-dark mb-6 flex items-center gap-2">
            <Utensils className="w-6 h-6 text-primary" />
            Summary
          </h2>
          
          <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
            {cart.map(item => (
              <div key={item.cartItemId} className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <span className="font-bold text-dark">{item.quantity}x {item.name}</span>
                  {item.addons?.length > 0 && (
                    <div className="text-xs text-dark/60 mt-0.5">
                      + {item.addons.map(a => a.name).join(', ')}
                    </div>
                  )}
                </div>
                <span className="font-bold text-dark shrink-0">
                  ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-6 border-t border-dark/10">
            <div className="flex justify-between text-dark/60 font-medium">
              <span>Subtotal</span>
              <span>₹{cartTotal}</span>
            </div>
            <div className="flex justify-between text-dark/60 font-medium">
              <span>Taxes (5%)</span>
              <span>₹{taxes}</span>
            </div>
            <div className="pt-3 flex justify-between items-end">
              <span className="font-heading font-bold text-lg text-dark">Total</span>
              <span className="font-heading font-black text-3xl text-primary">₹{total}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting || (orderType === 'table' && !tableId)}
            className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-primary text-cream rounded-2xl font-heading font-bold text-lg shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }}>
                <CheckCircle2 className="w-6 h-6" />
              </motion.div>
            ) : orderType === 'table' && !currentUser ? (
              'Log in to Order'
            ) : orderType === 'table' ? (
              'Send to Kitchen'
            ) : (
              'Generate Order Screen'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
