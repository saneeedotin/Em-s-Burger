import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

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
        return prev.map(c => 
          c.cartItemId === cartItemId 
            ? { ...c, quantity: c.quantity + quantity }
            : c
        );
      }
      
      return [...prev, { ...item, cartItemId, quantity, addons }];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart(prev => prev.filter(c => c.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId, delta) => {
    setCart(prev => prev.map(c => {
      if (c.cartItemId === cartItemId) {
        const newQty = Math.max(1, c.quantity + delta);
        return { ...c, quantity: newQty };
      }
      return c;
    }));
  };

  const clearCart = () => {
    setCart([]);
    setCustomRequest('');
  };

  const cartTotal = cart.reduce((total, item) => {
    const itemTotal = item.price * item.quantity;
    const addonsTotal = (item.addons || []).reduce((sum, a) => sum + a.price, 0) * item.quantity;
    return total + itemTotal + addonsTotal;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      customRequest,
      setCustomRequest,
      cartTotal
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
