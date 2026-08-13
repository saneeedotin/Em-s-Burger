import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';
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
      const [catRes, itemsRes] = await Promise.all([
        supabase.from('menu_categories').select('*'),
        supabase.from('menu_items').select('*')
      ]);

      if (catRes.error) throw catRes.error;
      if (itemsRes.error) throw itemsRes.error;

      if (catRes.data && catRes.data.length > 0 && itemsRes.data && itemsRes.data.length > 0) {
        setCategories(catRes.data);
        setItems(itemsRes.data);
      } else {
        // Fallback to local data if database is empty or not yet configured
        setCategories(MENU_CATEGORIES);
        setItems(MENU_ITEMS);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
      // Fallback to local data on error (e.g. invalid anon key, unconfigured DB)
      setCategories(MENU_CATEGORIES);
      setItems(MENU_ITEMS);
    } finally {
      setLoading(false);
    }
  };

  // CRUD for items
  const addItem = async (item) => {
    try {
      const { data, error } = await supabase.from('menu_items').insert([item]).select();
      if (error) throw error;
      if (data) setItems((prev) => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item: ' + error.message);
    }
  };

  const updateItem = async (id, updatedItem) => {
    try {
      const { data, error } = await supabase.from('menu_items').update(updatedItem).eq('id', id).select();
      if (error) throw error;
      if (data) setItems((prev) => prev.map((item) => (item.id === id ? data[0] : item)));
    } catch (error) {
      console.error('Error updating item:', error);
      alert('Failed to update item: ' + error.message);
    }
  };

  const deleteItem = async (id) => {
    try {
      const { error } = await supabase.from('menu_items').delete().eq('id', id);
      if (error) throw error;
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item: ' + error.message);
    }
  };

  // CRUD for categories
  const addCategory = async (category) => {
    try {
      const { data, error } = await supabase.from('menu_categories').insert([category]).select();
      if (error) throw error;
      if (data) setCategories((prev) => [...prev, data[0]]);
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Failed to add category: ' + error.message);
    }
  };

  const updateCategory = async (id, updatedCategory) => {
    try {
      const { data, error } = await supabase.from('menu_categories').update(updatedCategory).eq('id', id).select();
      if (error) throw error;
      if (data) setCategories((prev) => prev.map((cat) => (cat.id === id ? data[0] : cat)));
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category: ' + error.message);
    }
  };

  const deleteCategory = async (id) => {
    try {
      const { error } = await supabase.from('menu_categories').delete().eq('id', id);
      if (error) throw error;
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
