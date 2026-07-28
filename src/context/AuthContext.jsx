import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const DEMO_USER = {
  id: "u_demo_001",
  name: "Aditi Rao",
  email: "demo@emsburgers.com",
  password: "demo1234",
  loyaltyPoints: 6,
  favourites: ["ufo-burger", "destroyed-fries", "mango-boba-shake"],
  orders: [
    {
      id: "o_1042",
      date: "2026-07-18",
      items: [
        { name: "UFO Burger", qty: 1, price: 249 },
        { name: "Destroyed Fries", qty: 1, price: 179 },
        { name: "Classic Cold Coffee", qty: 1, price: 129 }
      ],
      total: 557,
      status: "delivered"
    },
    {
      id: "o_1038",
      date: "2026-07-12",
      items: [
        { name: "Pull Me Up Burger", qty: 1, price: 299 },
        { name: "Mac & Cheese Bites", qty: 1, price: 169 }
      ],
      total: 468,
      status: "delivered"
    },
    {
      id: "o_1025",
      date: "2026-07-05",
      items: [
        { name: "EM's Double Smash", qty: 1, price: 279 },
        { name: "Sparkling Hibiscus Lemonade", qty: 1, price: 119 }
      ],
      total: 398,
      status: "delivered"
    },
    {
      id: "o_1011",
      date: "2026-06-28",
      items: [
        { name: "Veggie Avocado Smash", qty: 1, price: 219 },
        { name: "Mango Passion Boba", qty: 1, price: 169 }
      ],
      total: 388,
      status: "delivered"
    }
  ]
};

export function AuthProvider({ children }) {
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ems_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [DEMO_USER];
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const savedSession = localStorage.getItem('ems_current_user');
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to null so user can explicitly test login or click "Demo Login"
    return null;
  });

  // Sync users list to localStorage
  useEffect(() => {
    localStorage.setItem('ems_users', JSON.stringify(users));
  }, [users]);

  // Sync currentUser session to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ems_current_user', JSON.stringify(currentUser));
      // Also update in users array
      setUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === currentUser.id ? currentUser : u))
      );
    } else {
      localStorage.removeItem('ems_current_user');
    }
  }, [currentUser]);

  const login = (email, password) => {
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (found) {
      setCurrentUser(found);
      return { success: true };
    }

    // Special fallback for demo account if users array was cleared
    if (email.toLowerCase() === 'demo@emsburgers.com' && password === 'demo1234') {
      setCurrentUser(DEMO_USER);
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password. Try demo@emsburgers.com / demo1234' };
  };

  const loginAsDemo = () => {
    setCurrentUser(DEMO_USER);
    return { success: true };
  };

  const signup = (name, email, password) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = {
      id: `u_${Date.now()}`,
      name,
      email,
      password,
      loyaltyPoints: 1, // Start with 1 welcome stamp!
      favourites: [],
      orders: []
    };

    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const toggleFavourite = (itemId) => {
    if (!currentUser) return false;

    const exists = currentUser.favourites.includes(itemId);
    const updatedFavourites = exists
      ? currentUser.favourites.filter((id) => id !== itemId)
      : [...currentUser.favourites, itemId];

    setCurrentUser({
      ...currentUser,
      favourites: updatedFavourites
    });

    return !exists; // returns true if added, false if removed
  };

  const updateLoyaltyPoints = (newPoints) => {
    if (!currentUser) return;
    const clampedPoints = Math.min(9, Math.max(0, newPoints));
    setCurrentUser({
      ...currentUser,
      loyaltyPoints: clampedPoints
    });
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        loginAsDemo,
        signup,
        logout,
        toggleFavourite,
        updateLoyaltyPoints,
        isDemoAccount: currentUser?.email === 'demo@emsburgers.com'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
