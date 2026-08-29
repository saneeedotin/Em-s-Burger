import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { db, isFirebaseConfigured } from '../config/firebase';
import { doc, onSnapshot, updateDoc, deleteDoc } from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const ActiveOrderContext = createContext();

const PENDING_TIMEOUT_MS = 10 * 60 * 1000; // 10 minutes in milliseconds

export function ActiveOrderProvider({ children }) {
  const { currentUser } = useAuth();
  const { restoreCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeOrder, setActiveOrder] = useState(() => {
    try {
      const saved = localStorage.getItem('ems_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [deliveryCelebration, setDeliveryCelebration] = useState(false);
  const timeoutHandledRef = useRef(false);

  // Clean up order if user logs out
  useEffect(() => {
    if (!currentUser && activeOrder?.user_id && activeOrder.user_id !== 'guest') {
      clearActiveOrder();
    }
  }, [currentUser]);

  // Determine if active order strictly belongs to current user / active table session
  const sessionPlacedOrderId = typeof window !== 'undefined' ? sessionStorage.getItem('ems_placed_order_id') : null;
  const currentTableId = typeof window !== 'undefined' ? (sessionStorage.getItem('ems_table') || localStorage.getItem('ems_table')) : null;

  const isOrderOwner = Boolean(
    activeOrder &&
    ['pending', 'preparing', 'ready'].includes(activeOrder.status) &&
    (
      (currentUser && (activeOrder.user_id === currentUser.id || activeOrder.user_email?.toLowerCase() === currentUser.email?.toLowerCase())) ||
      (!currentUser && activeOrder.id === sessionPlacedOrderId) ||
      (!currentUser && currentTableId && activeOrder.table_id === String(currentTableId))
    )
  );

  // Sync to local storage
  useEffect(() => {
    if (activeOrder) {
      localStorage.setItem('ems_active_order', JSON.stringify(activeOrder));
    } else {
      localStorage.removeItem('ems_active_order');
    }
  }, [activeOrder]);

  // Set active order helper
  const registerActiveOrder = (order) => {
    setActiveOrder(order);
    if (typeof window !== 'undefined' && order?.id) {
      sessionStorage.setItem('ems_placed_order_id', order.id);
    }
    timeoutHandledRef.current = false;
  };

  const clearActiveOrder = () => {
    setActiveOrder(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('ems_placed_order_id');
      localStorage.removeItem('ems_active_order');
    }
  };

  // Real-time Firestore sync on active order
  useEffect(() => {
    if (!activeOrder?.id) return;

    let unsubscribe = () => {};

    if (isFirebaseConfigured) {
      try {
        const orderRef = doc(db, 'orders', activeOrder.id);
        unsubscribe = onSnapshot(orderRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.data();
            const newStatus = data.status || 'pending';

            setActiveOrder(prev => {
              if (!prev) return null;
              
              // 1. AUTO-TRANSITION TO WAITING PAGE ON CONFIRMATION
              if (prev.status === 'pending' && newStatus === 'preparing') {
                if (location.pathname === '/checkout') {
                  navigate('/while-you-wait');
                }
              }

              // 2. AUTO-TRANSITION TO HOME ON DELIVERED
              if (prev.status !== 'delivered' && newStatus === 'delivered') {
                setDeliveryCelebration(true);
                setTimeout(() => {
                  setDeliveryCelebration(false);
                  clearActiveOrder();
                  navigate('/');
                }, 2000);
              }

              return { ...prev, ...data, id: snapshot.id };
            });
          }
        }, (err) => console.warn('Active order onSnapshot warning:', err));
      } catch (e) {
        console.warn('Active order listener setup warning:', e);
      }
    }

    return () => unsubscribe();
  }, [activeOrder?.id, location.pathname, navigate]);

  // 10-Minute Timeout Countdown on Pending Orders
  useEffect(() => {
    if (!activeOrder || activeOrder.status !== 'pending') {
      return;
    }

    const orderTime = new Date(activeOrder.created_at || Date.now()).getTime();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - orderTime;
      const remaining = Math.max(0, Math.floor((PENDING_TIMEOUT_MS - elapsed) / 1000));
      setTimeLeft(remaining);

      // Handle 10-minute timeout
      if (remaining <= 0 && !timeoutHandledRef.current) {
        timeoutHandledRef.current = true;
        clearInterval(interval);

        // 1. Remove from active orders in Firestore
        if (isFirebaseConfigured && activeOrder.id) {
          try {
            deleteDoc(doc(db, 'orders', activeOrder.id));
          } catch (e) {}
        }

        // 2. Save to local timed out orders
        try {
          const timedOut = JSON.parse(localStorage.getItem('ems_timed_out_orders') || '[]');
          timedOut.push({ ...activeOrder, timed_out_at: new Date().toISOString() });
          localStorage.setItem('ems_timed_out_orders', JSON.stringify(timedOut));
        } catch (e) {}

        // 3. Restore customer cart with all items & description
        if (activeOrder.items && activeOrder.items.length > 0) {
          restoreCart(activeOrder.items, activeOrder.custom_request);
        }

        // 4. Clear active order and alert customer
        clearActiveOrder();
        alert('Your order was not confirmed by the kitchen within 10 minutes. Your cart has been restored so you can re-order or modify.');
        navigate('/menu');
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [activeOrder, restoreCart, navigate]);

  return (
    <ActiveOrderContext.Provider value={{
      activeOrder,
      registerActiveOrder,
      clearActiveOrder,
      timeLeft,
      deliveryCelebration,
      isOrderOwner
    }}>
      {children}
    </ActiveOrderContext.Provider>
  );
}

export function useActiveOrder() {
  const context = useContext(ActiveOrderContext);
  if (!context) {
    throw new Error('useActiveOrder must be used within an ActiveOrderProvider');
  }
  return context;
}
