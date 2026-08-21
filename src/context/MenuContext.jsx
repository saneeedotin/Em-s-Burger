import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from 'firebase/firestore';
import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    setLoading(true);
    try {
      const catSnapshot = await getDocs(collection(db, 'menu_categories'));
      const itemsSnapshot = await getDocs(collection(db, 'menu_items'));
      
      const fetchedCats = catSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const fetchedItems = itemsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (fetchedCats.length > 0 && fetchedItems.length > 0) {
        setCategories(fetchedCats);
        setItems(fetchedItems);
      } else {
        // Fallback to local data if database is empty or not yet configured
        setCategories(MENU_CATEGORIES);
        setItems(MENU_ITEMS);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
      // Fallback to local data on error
      setCategories(MENU_CATEGORIES);
      setItems(MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  // CRUD for items
  const addItem = async (item) => {
    try {
      // Use the id provided if available, otherwise let Firestore generate one
      let docRef;
      if (item.id) {
        docRef = doc(db, 'menu_items', item.id);
        await setDoc(docRef, item);
      } else {
        docRef = await addDoc(collection(db, 'menu_items'), item);
      }
      setItems((prev) => [...prev, { ...item, id: docRef.id || item.id }]);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item: ' + error.message);
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const itemRef = doc(db, 'menu_items', id);
      await updateDoc(itemRef, updatedItem);
      setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)));
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item: ' + error.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'menu_items', id));
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item: ' + error.message);
    }
  };

  // CRUD for categories
  const addCategory = async (category) => {
    try {
      let docRef;
      if (category.id) {
        docRef = doc(db, 'menu_categories', category.id);
        await setDoc(docRef, category);
      } else {
        docRef = await addDoc(collection(db, 'menu_categories'), category);
      }
      setCategories((prev) => [...prev, { ...category, id: docRef.id || category.id }]);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category: ' + error.message);
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      const catRef = doc(db, 'menu_categories', id);
      await updateDoc(catRef, updatedCategory);
      setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...updatedCategory } : cat)));
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category: ' + error.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'menu_categories', id));
      setCategories((prev) => prev.filter((cat) => cat.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category: ' + error.message);
    }
  };

  const value = {
    categories,
    items,
    loading,
    addItem,
    updateItem,
    deleteItem,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshMenu: fetchMenuData
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
