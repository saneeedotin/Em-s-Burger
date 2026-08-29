import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Receipt, CheckCircle2, ChevronRight, User, Utensils, 
  AlertTriangle, Loader2, XCircle, Sparkles, ChefHat, Timer, Clock
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useActiveOrder } from '../context/ActiveOrderContext';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, addDoc, doc, onSnapshot, runTransaction } from 'firebase/firestore';

// Generate sequential order token like #EM-1001
async function generateOrderToken() {
  let token = 1000;
  try {
    if (isFirebaseConfigured) {
      await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'metadata', 'order_counter');
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
          token = 1001;
          transaction.set(counterRef, { count: 1001 });
        } else {
          token = (counterDoc.data().count || 1000) + 1;
          transaction.update(counterRef, { count: token });
        }
      });
      return `#EM-${token}`;
    }
  } catch (e) {
    console.warn('Sequential token generation warning:', e);
  }
  token = Math.floor(1000 + Math.random() * 9000);
  return `#EM-${token}`;
}

export function Checkout() {
  const navigate = useNavigate();
  const { cart, cartTotal, clearCart, customRequest } = useCart();
  const { currentUser } = useAuth();
  const { registerActiveOrder, activeOrder, timeLeft } = useActiveOrder();
  
  // Retrieve table from storage
  const [tableId, setTableId] = useState(() => {
    return localStorage.getItem('ems_table') || sessionStorage.getItem('ems_table') || '';
  });

  const [orderType, setOrderType] = useState(tableId ? 'table' : 'reception'); // 'reception' | 'table'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState(null);
  const [orderToken, setOrderToken] = useState('');
  const [placedOrderData, setPlacedOrderData] = useState(null);
  const [liveOrderStatus, setLiveOrderStatus] = useState('pending'); // 'pending' | 'preparing' | 'ready' | 'delivered' | 'rejected'
  const [submitError, setSubmitError] = useState(null);

  const taxes = Math.round(cartTotal * 0.05);
  const total = cartTotal + taxes;

  // Real-time Firestore order listener
  useEffect(() => {
    if (!placedOrderId || !isFirebaseConfigured) return;

    let unsubscribe = () => {};
    try {
      unsubscribe = onSnapshot(doc(db, 'orders', placedOrderId), (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const currentStatus = data.status || 'pending';
          setLiveOrderStatus(currentStatus);

          // 1. AUTO-TRANSITION TO WAITING GAME ON CONFIRMATION
          if (currentStatus === 'preparing') {
            setTimeout(() => {
              navigate('/while-you-wait');
            }, 800);
          }

          // 2. AUTO-TRANSITION TO HOMEPAGE ON DELIVERED
          if (currentStatus === 'delivered') {
            setTimeout(() => {
              navigate('/');
            }, 1800);
          }
        }
      }, (error) => {
        console.warn('Live order status subscription error:', error);
      });
    } catch (e) {
      console.warn('Firestore snapshot error:', e);
    }

    return () => unsubscribe();
  }, [placedOrderId, navigate]);

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
    // 1. Require user to be logged in
    if (!currentUser) {
      navigate('/login?redirect=/checkout');
      return;
    }
    
    // 2. For table orders, require a valid table number
    if (orderType === 'table' && !tableId) {
      setSubmitError('Please enter or scan your table number to proceed.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const token = await generateOrderToken();

      // Sanitize cart items for storage
      const sanitizedItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        isVeg: Boolean(item.isVeg),
        description: item.description || '',
        addons: (item.addons || []).map(a => ({ name: a.name, price: a.price }))
      }));

      const finalSubtotal = cartTotal;
      const finalTax = taxes;
      const finalTotal = total;

      const newOrder = {
        user_id: currentUser.id,
        user_name: currentUser.name || 'Customer',
        user_email: currentUser.email || '',
        numeric_id: currentUser.numeric_id || null,
        order_type: orderType,
        table_id: orderType === 'table' ? String(tableId) : null,
        order_token: token,
        items: sanitizedItems,
        custom_request: customRequest || '',
        subtotal: finalSubtotal,
        tax: finalTax,
        total_amount: finalTotal,
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      let finalId = `order_${Date.now()}`;

      if (isFirebaseConfigured) {
        try {
          const docRef = await addDoc(collection(db, 'orders'), newOrder);
          finalId = docRef.id;
        } catch (fsErr) {
          console.warn('Firestore write warning (using fallback):', fsErr);
        }
      }

      const fullOrder = { id: finalId, ...newOrder };

      // Register with active order global tracking
      registerActiveOrder(fullOrder);

      // Local storage persistence & instant broadcast
      try {
        const existingLocal = JSON.parse(localStorage.getItem('ems_all_orders') || '[]');
        const updatedLocal = [fullOrder, ...existingLocal.filter(o => o.id !== finalId)];
        localStorage.setItem('ems_all_orders', JSON.stringify(updatedLocal));
        window.dispatchEvent(new Event('ems_orders_updated'));
      } catch (e) {}

      setPlacedOrderId(finalId);
      setOrderToken(token);
      setPlacedOrderData(fullOrder);
      setLiveOrderStatus('pending');
      setOrderComplete(true);
      clearCart();
    } catch (error) {
      console.error('Error placing order:', error);
      setSubmitError('Failed to place order. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  // ── Live Order Processing & Confirmation Screen (Table Order) ──
  if (orderComplete && orderType === 'table') {
    return (
      <div className="min-h-[85vh] bg-cream pt-20 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-cream-light rounded-4xl p-6 sm:p-8 border-4 border-primary/20 shadow-2xl space-y-6"
        >
          {/* Status Header */}
          {liveOrderStatus === 'pending' && (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto relative">
                <div className="absolute inset-0 bg-amber-200 animate-ping opacity-30 rounded-full"></div>
                <ChefHat className="w-10 h-10 text-amber-600 animate-pulse" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-heading font-black uppercase">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Awaiting Kitchen Confirmation ({minutes}:{seconds})</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                Waiting for Confirmation
              </h1>
              <p className="text-xs sm:text-sm text-dark/70 max-w-md mx-auto">
                Your order for <strong className="text-primary font-bold">Table {tableId}</strong> has been sent to the kitchen admin. You'll be automatically taken to the wait games once confirmed!
              </p>
            </div>
          )}

          {liveOrderStatus === 'preparing' && (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ChefHat className="w-10 h-10 text-blue-600 animate-bounce" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-heading font-black uppercase">
                <span>Confirmed & Preparing</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                Order Accepted! 🔥
              </h1>
              <p className="text-xs sm:text-sm text-dark/70 max-w-md mx-auto">
                The kitchen is now preparing your burgers for <strong className="text-primary font-bold">Table {tableId}</strong>! Taking you to the wait room...
              </p>
            </div>
          )}

          {liveOrderStatus === 'ready' && (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-heading font-black uppercase">
                <span>Order Ready</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                Food is Ready! 🍔
              </h1>
              <p className="text-xs sm:text-sm text-dark/70 max-w-md mx-auto">
                Your order is being served right to Table {tableId}. Enjoy your meal!
              </p>
            </div>
          )}

          {liveOrderStatus === 'delivered' && (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                Delivered! 🎉
              </h1>
              <p className="text-xs sm:text-sm text-dark/70 max-w-md mx-auto">
                Thank you for dining with EM's Burgers! Taking you back home...
              </p>
            </div>
          )}

          {liveOrderStatus === 'rejected' && (
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-heading font-black uppercase">
                <span>Not Accepted</span>
              </div>
              <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
                Order Rejected
              </h1>
              <p className="text-xs sm:text-sm text-dark/70 max-w-md mx-auto">
                The restaurant could not accept this order at this time. Please check with reception.
              </p>
            </div>
          )}

          {/* Order Details Card */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-primary/15 shadow-sm space-y-4">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-dark/5 pb-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-dark/50 tracking-wider">Order Token</span>
                <div className="font-heading font-black text-2xl text-primary">{orderToken}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-dark/50 tracking-wider">Table</span>
                <div className="inline-flex items-center gap-1 bg-primary text-cream px-3 py-1 rounded-full font-heading font-black text-sm ml-auto">
                  <MapPin className="w-3.5 h-3.5" />
                  Table {tableId}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="text-xs text-dark/70 flex items-center justify-between">
              <span>Customer: <strong className="text-dark">{currentUser?.name}</strong></span>
              <span>{currentUser?.email}</span>
            </div>

            {/* Items List */}
            <div className="space-y-2 pt-2 border-t border-dark/5 max-h-48 overflow-y-auto">
              {(placedOrderData?.items || []).map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm">
                  <div>
                    <span className="font-bold text-dark">{item.quantity}x {item.name}</span>
                    {item.addons?.length > 0 && (
                      <div className="text-xs text-dark/60">
                        + {item.addons.map(a => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-dark">
                    ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {placedOrderData?.custom_request && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                <span className="font-bold text-amber-800 uppercase tracking-wider block mb-0.5">Special Request:</span>
                <span className="text-amber-900">{placedOrderData.custom_request}</span>
              </div>
            )}

            {/* Totals */}
            <div className="pt-3 border-t border-dark/5 flex justify-between items-center">
              <span className="font-heading font-bold text-dark text-base">Total Amount</span>
              <span className="font-heading font-black text-2xl text-primary">₹{placedOrderData?.total_amount || 0}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => navigate('/while-you-wait')}
              className="flex-1 py-3.5 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Play Minigame While Waiting</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="py-3.5 px-6 rounded-full bg-cream border-2 border-dark/10 hover:bg-dark/5 text-dark font-heading font-bold text-sm transition-colors text-center"
            >
              Browse Website
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Reception: Order Screen ──
  if (orderComplete && orderType === 'reception') {
    const finalDisplayAmount = placedOrderData?.total_amount || 0;
    const finalItemCount = placedOrderData?.items?.length || 0;

    return (
      <div className="min-h-[85vh] bg-cream pt-20 pb-12 px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-cream-light rounded-4xl p-6 sm:p-8 border-4 border-primary/20 shadow-2xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
            <Receipt className="w-10 h-10 text-amber-600" />
          </div>
          
          <h1 className="font-heading font-black text-3xl text-dark">
            Show at Reception
          </h1>
          <div className="font-heading font-black text-5xl text-primary my-2 tracking-tight">
            {orderToken}
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-heading font-bold">
            <Clock className="w-3.5 h-3.5 animate-spin text-amber-600" />
            <span>Awaiting Cashier Review ({minutes}:{seconds})</span>
          </div>

          <p className="text-xs sm:text-sm text-dark/70 max-w-xs mx-auto">
            Please show this token number to the reception cashier to complete payment.
          </p>

          <div className="bg-white p-5 rounded-3xl shadow-sm border border-dark/10 text-left space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-dark/5">
              <span className="font-bold text-dark/60 text-sm">Total Amount</span>
              <span className="font-heading font-black text-2xl text-primary">₹{finalDisplayAmount}</span>
            </div>
            <div className="text-xs text-dark/60 space-y-1">
              <div>Customer: <strong className="text-dark">{currentUser?.name}</strong></div>
              <div>Items: <strong className="text-dark">{finalItemCount} items</strong></div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={() => navigate('/while-you-wait')}
              className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-bold text-sm shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Play Minigame While Waiting</span>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full py-3 rounded-full bg-cream border-2 border-dark/10 hover:bg-dark/5 text-dark font-heading font-bold text-sm transition-colors"
            >
              Return to Home
            </button>
          </div>
        </motion.div>
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
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Left: Order Options */}
        <div className="space-y-6">
          <div className="bg-cream-light p-6 rounded-3xl border border-dark/10 shadow-sm space-y-4">
            <h2 className="font-heading font-black text-xl text-dark">Order Type</h2>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setOrderType('table')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 font-heading font-bold text-sm transition-all ${
                  orderType === 'table'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-dark/10 bg-white text-dark/70 hover:border-dark/20'
                }`}
              >
                <Utensils className="w-6 h-6" />
                <span>Dine In (Table)</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('reception')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 font-heading font-bold text-sm transition-all ${
                  orderType === 'reception'
                    ? 'border-primary bg-primary/10 text-primary shadow-sm'
                    : 'border-dark/10 bg-white text-dark/70 hover:border-dark/20'
                }`}
              >
                <Receipt className="w-6 h-6" />
                <span>Reception (Cash)</span>
              </button>
            </div>

            {/* Table Number Input if Table Order */}
            {orderType === 'table' && (
              <div className="pt-2">
                <label className="block text-xs font-bold text-dark/60 uppercase tracking-wider mb-1">
                  Table Number
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-dark/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="number"
                    min="1"
                    max="50"
                    placeholder="Enter Table # (e.g. 3)"
                    value={tableId}
                    onChange={(e) => setTableId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-dark/15 rounded-xl font-heading font-bold text-sm text-dark focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Customer Info Card */}
          <div className="bg-cream-light p-6 rounded-3xl border border-dark/10 shadow-sm space-y-3">
            <h2 className="font-heading font-black text-xl text-dark">Customer Info</h2>
            {currentUser ? (
              <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-dark/5">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-dark">{currentUser.name}</div>
                  <div className="text-xs text-dark/60">{currentUser.email}</div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-dark/60">
                You will be prompted to log in or sign up when placing the order.
              </p>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-cream-light p-6 rounded-3xl border border-dark/10 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="font-heading font-black text-xl text-dark mb-4">Order Summary</h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm border-b border-dark/5 pb-2">
                  <div>
                    <span className="font-bold text-dark">{item.quantity}x {item.name}</span>
                    {item.addons?.length > 0 && (
                      <div className="text-xs text-dark/60">
                        + {item.addons.map(a => a.name).join(', ')}
                      </div>
                    )}
                  </div>
                  <span className="font-bold text-dark">
                    ₹{(item.price + (item.addons?.reduce((s, a) => s + a.price, 0) || 0)) * item.quantity}
                  </span>
                </div>
              ))}
            </div>

            {customRequest && (
              <div className="mt-4 p-3 bg-white rounded-2xl border border-dark/5 text-xs text-dark/70">
                <span className="font-bold block text-dark">Special Request:</span>
                "{customRequest}"
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-dark/10 space-y-2 text-sm">
              <div className="flex justify-between text-dark/70">
                <span>Subtotal</span>
                <span>₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-dark/70">
                <span>Taxes & GST (5%)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="flex justify-between text-lg font-heading font-black text-dark pt-2 border-t border-dark/5">
                <span>Total</span>
                <span className="text-primary text-2xl">₹{total}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            className="w-full mt-6 py-4 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-bold text-base shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Order...</span>
              </>
            ) : (
              <span>Place Order • ₹{total}</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
