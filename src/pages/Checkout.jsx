import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Receipt, CheckCircle2, ChevronRight, User, Utensils, AlertTriangle, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { collection, addDoc, doc, onSnapshot, runTransaction, serverTimestamp } from 'firebase/firestore';

// Generate sequential order token like #EM-1001
async function generateOrderToken() {
  let token = 1000;
  try {
    await runTransaction(db, async (transaction) => {
      const counterRef = doc(db, 'metadata', 'order_counter');
      const counterDoc = await transaction.get(counterRef);
      if (!counterDoc.exists()) {
        token = 1001;
        transaction.set(counterRef, { count: 1001 });
      } else {
        token = counterDoc.data().count + 1;
        transaction.update(counterRef, { count: token });
      }
    });
  } catch (e) {
    console.error('Failed to generate order token:', e);
    // Fallback: random 4-digit token
    token = Math.floor(1000 + Math.random() * 9000);
  }
  return `#EM-${token}`;
}

export function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, customRequest } = useCart();
  const { currentUser } = useAuth();
  
  const [orderType, setOrderType] = useState('reception'); // 'reception' | 'table'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [orderToken, setOrderToken] = useState('');
  const [submitError, setSubmitError] = useState(null);

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
    // For table orders, require login
    if (orderType === 'table' && !currentUser) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    // For table orders, require tableId
    if (orderType === 'table' && !tableId) {
      setSubmitError('Please scan a table QR code first.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Generate order token
      const token = await generateOrderToken();

      // Sanitize cart items for storage
      const sanitizedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: item.isVeg || false,
        addons: (item.addons || []).map(a => ({ name: a.name, price: a.price }))
      }));

      const localId = `order_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
      const orderDoc = {
        id: localId,
        user_id: currentUser?.id || 'guest',
        user_name: currentUser?.name || 'Walk-in Guest',
        user_email: currentUser?.email || '',
        order_type: orderType,
        table_id: orderType === 'table' ? tableId : null,
        order_token: token,
        items: sanitizedItems,
        custom_request: customRequest || '',
        subtotal: cartTotal,
        tax: taxes,
        total_amount: total,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // 1. Immediately save to localStorage for instant offline & demo-mode reliability
      try {
        const stored = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
        const updated = [orderDoc, ...stored.filter(o => o.order_token !== token)];
        localStorage.setItem('ems_all_orders', JSON.stringify(updated));
        window.dispatchEvent(new Event('ems_orders_updated'));
      } catch (err) {
        console.warn('LocalStorage save warning:', err);
      }

      let finalOrderId = localId;

      // 2. Save to Firestore
      try {
        const docRef = await addDoc(collection(db, 'orders'), orderDoc);
        if (docRef?.id) {
          finalOrderId = docRef.id;
          // Update local copy with Firestore doc ID
          const stored = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
          const updated = stored.map(o => o.id === localId ? { ...o, id: docRef.id, firestore_id: docRef.id } : o);
          localStorage.setItem('ems_all_orders', JSON.stringify(updated));
          window.dispatchEvent(new Event('ems_orders_updated'));
        }
      } catch (firestoreErr) {
        console.warn('Firestore write warning (falling back to local storage):', firestoreErr);
      }
      
      setPlacedOrderId(finalOrderId);
      setOrderToken(token);
      setOrderComplete(true);

      // For table orders, auto-navigate after delay
      if (orderType === 'table') {
        setTimeout(() => {
          clearCart();
          navigate('/while-you-wait');
        }, 2500);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      setSubmitError('Failed to place order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    if (orderComplete && orderType === 'reception' && placedOrderId) {
      // 1. Check local storage changes
      const checkLocalValidation = () => {
        try {
          const stored = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
          const found = stored.find(o => o.id === placedOrderId || o.order_token === orderToken);
          if (found && found.status && found.status !== 'pending') {
            setIsValidated(true);
            setTimeout(() => {
              clearCart();
              navigate('/while-you-wait');
            }, 3000);
          }
        } catch (e) {}
      };

      window.addEventListener('ems_orders_updated', checkLocalValidation);
      window.addEventListener('storage', checkLocalValidation);

      // 2. Listen for status changes on the placed order in Firestore
      let unsubscribe = () => {};
      try {
        unsubscribe = onSnapshot(doc(db, 'orders', placedOrderId), (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            if (data.status && data.status !== 'pending') {
              setIsValidated(true);
              setTimeout(() => {
                clearCart();
                navigate('/while-you-wait');
              }, 3000);
            }
          }
        }, () => {});
      } catch (e) {}

      return () => {
        window.removeEventListener('ems_orders_updated', checkLocalValidation);
        window.removeEventListener('storage', checkLocalValidation);
        unsubscribe();
      };
    }
  }, [orderComplete, orderType, placedOrderId, orderToken, navigate, clearCart]);

  // ── Reception: Waiting / Validated screen ──
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
              <h1 className="font-heading font-black text-4xl text-dark mb-2">Show this screen</h1>
              <div className="font-heading font-black text-6xl text-primary my-4">{orderToken}</div>
              <p className="text-dark/70 max-w-md mb-8">
                Please show this screen to the cashier. Waiting for reception to confirm your order...
              </p>
              <div className="flex items-center gap-2 text-dark/50 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for confirmation...
              </div>
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
              <div className="font-heading font-black text-3xl text-primary mb-4">{orderToken}</div>
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
          {customRequest && (
            <div className="mt-4 pt-4 border-t border-dark/5">
              <span className="text-xs font-bold text-dark/50 uppercase">Special Request</span>
              <p className="text-sm text-dark/70 mt-1">{customRequest}</p>
            </div>
          )}
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

  // ── Table: Success screen ──
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
        <div className="font-heading font-black text-3xl text-primary my-4">{orderToken}</div>
        <p className="text-dark/70 max-w-md mb-8">
          The kitchen has received your order for Table {tableId || '...'}. Sit back and relax!
        </p>
      </div>
     );
  }

  // ── Main Checkout Form ──
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

      {/* Error Toast */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{submitError}</p>
            <button onClick={() => setSubmitError(null)} className="ml-auto text-red-400 hover:text-red-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                      {tableId ? (
                        <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Verified at Table {tableId}
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Please scan a table QR code first
                        </div>
                      )}

                      {!currentUser && (
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-bold">
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
                    Show your order screen to the cashier to pay and get your order token.
                  </p>
                </div>
              </div>
            </label>
          </div>

          {/* Custom Request (shown if present) */}
          {customRequest && (
            <div className="bg-white p-4 rounded-2xl border border-dark/10">
              <span className="text-xs font-bold text-dark/50 uppercase">Special Request</span>
              <p className="text-sm text-dark/70 mt-1">{customRequest}</p>
            </div>
          )}
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
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing Order...
              </>
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
