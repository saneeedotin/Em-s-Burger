import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, isFirebaseConfigured } from '../config/firebase';
import { collection, onSnapshot, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  // Available categories excluding the meta 'all' category for editing
  const selectableCategories = MENU_CATEGORIES.filter(c => c.id !== 'all');

  const [categories, setCategories] = useState(MENU_CATEGORIES);

  // Helper to load custom items merged with static MENU_ITEMS
  const getInitialItems = () => {
    try {
      const stored = localStorage.getItem('ems_menu_custom_items');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const itemMap = new Map();
          MENU_ITEMS.forEach(i => itemMap.set(i.id, i));
          parsed.forEach(i => itemMap.set(i.id, { ...itemMap.get(i.id), ...i }));
          return Array.from(itemMap.values());
        }
      }
    } catch (e) {
      console.warn('Local storage menu read warning:', e);
    }
    return MENU_ITEMS;
  };

  const [items, setItems] = useState(getInitialItems);
  const [loading, setLoading] = useState(false);

  // Sync to local storage
  const persistLocally = useCallback((newItems) => {
    try {
      localStorage.setItem('ems_menu_custom_items', JSON.stringify(newItems));
    } catch (e) {
      console.warn('Local storage quota warning:', e);
    }
  }, []);

  // Listen to cross-tab and local updates
  useEffect(() => {
    const handleLocalUpdate = () => {
      setItems(getInitialItems());
    };

    window.addEventListener('storage', handleLocalUpdate);
    window.addEventListener('ems_menu_updated', handleLocalUpdate);

    return () => {
      window.removeEventListener('storage', handleLocalUpdate);
      window.removeEventListener('ems_menu_updated', handleLocalUpdate);
    };
  }, []);

  // Real-time Firestore sync
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let unsubscribeCats = () => {};
    let unsubscribeItems = () => {};

    try {
      unsubscribeCats = onSnapshot(collection(db, 'menu_categories'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedCats = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (fetchedCats.length > 0) {
            setCategories(fetchedCats);
          }
        }
      }, (err) => console.warn('Firestore categories listener warning:', err));

      unsubscribeItems = onSnapshot(collection(db, 'menu_items'), (snapshot) => {
        if (!snapshot.empty) {
          const fetchedItems = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
          if (fetchedItems.length > 0) {
            setItems(prev => {
              const itemMap = new Map();
              // First seed all default items
              MENU_ITEMS.forEach(i => itemMap.set(i.id, i));
              // Merge existing state
              prev.forEach(i => itemMap.set(i.id, { ...itemMap.get(i.id), ...i }));
              // Merge all real-time updates from Firestore
              fetchedItems.forEach(i => itemMap.set(i.id, { ...itemMap.get(i.id), ...i }));
              const merged = Array.from(itemMap.values());
              persistLocally(merged);
              return merged;
            });
          }
        }
      }, (err) => console.warn('Firestore items listener warning:', err));
    } catch (error) {
      console.warn('Error establishing menu real-time listeners:', error);
    }

    return () => {
      unsubscribeCats();
      unsubscribeItems();
    };
  }, [persistLocally]);

  // CRUD for items
  const addItem = async (item) => {
    const finalItem = {
      ...item,
      id: item.id || `item_${Date.now()}`
    };

    setItems((prev) => {
      const updated = [finalItem, ...prev.filter(i => i.id !== finalItem.id)];
      persistLocally(updated);
      return updated;
    });

    window.dispatchEvent(new Event('ems_menu_updated'));

    if (isFirebaseConfigured) {
      try {
        const itemRef = doc(db, 'menu_items', finalItem.id);
        await setDoc(itemRef, finalItem, { merge: true });
      } catch (error) {
        console.warn('Firestore add item error (saved locally):', error);
      }
    }
  };

  const updateItem = async (id, updatedItem) => {
    const merged = { ...updatedItem, id };

    setItems((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, ...merged } : item));
      persistLocally(updated);
      return updated;
    });

    window.dispatchEvent(new Event('ems_menu_updated'));

    if (isFirebaseConfigured) {
      try {
        const itemRef = doc(db, 'menu_items', id);
        await setDoc(itemRef, merged, { merge: true });
      } catch (error) {
        console.warn('Firestore update item error (saved locally):', error);
      }
    }
  };

  const deleteItem = async (id) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      persistLocally(updated);
      return updated;
    });

    window.dispatchEvent(new Event('ems_menu_updated'));

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'menu_items', id));
      } catch (error) {
        console.warn('Firestore delete item error (removed locally):', error);
      }
    }
  };

  // CRUD for categories
  const addCategory = async (category) => {
    const finalCat = {
      ...category,
      id: category.id || `cat_${Date.now()}`
    };

    setCategories((prev) => [...prev, finalCat]);

    if (isFirebaseConfigured) {
      try {
        const catRef = doc(db, 'menu_categories', finalCat.id);
        await setDoc(catRef, finalCat, { merge: true });
      } catch (error) {
        console.warn('Firestore add category error:', error);
      }
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    const merged = { ...updatedCategory, id };
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...merged } : cat)));

    if (isFirebaseConfigured) {
      try {
        const catRef = doc(db, 'menu_categories', id);
        await setDoc(catRef, merged, { merge: true });
      } catch (error) {
        console.warn('Firestore update category error:', error);
      }
    }
  };

  const deleteCategory = async (id) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));

    if (isFirebaseConfigured) {
      try {
        await deleteDoc(doc(db, 'menu_categories', id));
      } catch (error) {
        console.warn('Firestore delete category error:', error);
      }
    }
  };

  const value = {
    categories,
    selectableCategories,
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory
  };

  return (
    <MenuContext.Provider value={value}>
      {children}
    </MenuContext.Provider>
  );
}

export function useMenu() {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
}
