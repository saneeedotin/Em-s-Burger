import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const MAX_ITEM_QTY = 20;

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem('ems_cart');
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      if (Array.isArray(parsed)) {
        return parsed.filter(item => item !== null && typeof item === 'object' && item.id);
      }
      return [];
    } catch (e) {
      console.error("Failed to parse cart from local storage:", e);
      return [];
    }
  });
  const [customRequest, setCustomRequest] = useState(() => {
    return localStorage.getItem('ems_cart_request') || '';
  });

  useEffect(() => {
    localStorage.setItem('ems_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('ems_cart_request', customRequest);
  }, [customRequest]);

  const addToCart = (item, quantity = 1, addons = []) => {
    setCart(prev => {
      // Create a unique key for the item + addons combination
      const addonsKey = addons.map(a => a.id).sort().join(',');
      const cartItemId = `${item.id}-${addonsKey}`;

      const existing = prev.find(c => c.cartItemId === cartItemId);
      if (existing) {
        const newQty = Math.min(MAX_ITEM_QTY, existing.quantity + quantity);
        return prev.map(c => 
          c.cartItemId === cartItemId 
            ? { ...c, quantity: newQty }
            : c
        );
      }
      
      const clampedQty = Math.min(MAX_ITEM_QTY, Math.max(1, quantity));
      return [...prev, { ...item, cartItemId, quantity: clampedQty, addons }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => {
      return prev.reduce((acc, c) => {
        if (c.cartItemId === cartItemId) {
          const newQty = c.quantity + delta;
          // If quantity drops to 0 or below, remove the item
          if (newQty <= 0) {
            return acc; // skip this item (removes it)
          }
          // Clamp to max
          acc.push({ ...c, quantity: Math.min(MAX_ITEM_QTY, newQty) });
        } else {
          acc.push(c);
        }
        return acc;
      }, []);
    });
  };

  const clearCart = () => {
    setCart([]);
    setCustomRequest('');
  };

  const getCartItemCount = (itemId) => {
    return cart
      .filter(c => c.id === itemId)
      .reduce((sum, c) => sum + c.quantity, 0);
  };

  const cartTotal = cart.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const addonsTotal = (item.addons || []).reduce((sum, a) => sum + a.price, 0) * item.quantity;
    return total + itemTotal + addonsTotal;
  }, 0);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      customRequest,
      setCustomRequest,
      cartTotal,
      cartItemCount,
      getCartItemCount,
      MAX_ITEM_QTY
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
