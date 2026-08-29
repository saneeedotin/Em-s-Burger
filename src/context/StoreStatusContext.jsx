import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '../config/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

const StoreStatusContext = createContext();

const DEFAULT_STORE_STATUS = {
  isOpen: true,
  customMessage: 'Grill is Sizzling! Walk-ins & Table Orders Welcome',
  openingHours: '12:00 PM – 11:00 PM Daily',
  lastUpdated: new Date().toISOString()
};

export function StoreStatusProvider({ children }) {
  const [storeStatus, setStoreStatus] = useState(() => {
    try {
      const cached = localStorage.getItem('ems_store_status');
      return cached ? JSON.parse(cached) : DEFAULT_STORE_STATUS;
    } catch (e) {
      return DEFAULT_STORE_STATUS;
    }
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const cached = localStorage.getItem('ems_store_status');
        if (cached) setStoreStatus(JSON.parse(cached));
      } catch (e) {}
    };

    window.addEventListener('ems_store_status_changed', handleStorageChange);
    window.addEventListener('storage', handleStorageChange);

    if (!isFirebaseConfigured) {
      setLoading(false);
      return () => {
        window.removeEventListener('ems_store_status_changed', handleStorageChange);
        window.removeEventListener('storage', handleStorageChange);
      };
    }

    const statusDocRef = doc(db, 'metadata', 'store_status');

    // Subscribe to real-time store status changes
    const unsubscribe = onSnapshot(
      statusDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = { ...DEFAULT_STORE_STATUS, ...docSnap.data() };
          setStoreStatus(data);
          try {
            localStorage.setItem('ems_store_status', JSON.stringify(data));
          } catch (e) {}
        } else {
          // Initialize if document does not exist yet
          setDoc(statusDocRef, DEFAULT_STORE_STATUS, { merge: true }).catch(console.warn);
        }
        setLoading(false);
      },
      (err) => {
        console.warn('[StoreStatusContext] Snapshot error:', err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      window.removeEventListener('ems_store_status_changed', handleStorageChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Admin mutation function to update status
  const updateStoreStatus = async (newIsOpen, newMessage = '') => {
    const updated = {
      ...storeStatus,
      isOpen: Boolean(newIsOpen),
      customMessage: newMessage || (newIsOpen ? 'Grill is Sizzling! Walk-ins & Table Orders Welcome' : 'Kitchen Closed • Reopening Tomorrow at 12:00 PM'),
      lastUpdated: new Date().toISOString()
    };

    setStoreStatus(updated);

    try {
      localStorage.setItem('ems_store_status', JSON.stringify(updated));
      window.dispatchEvent(new Event('ems_store_status_changed'));
    } catch (e) {}

    if (isFirebaseConfigured) {
      try {
        const statusDocRef = doc(db, 'metadata', 'store_status');
        await setDoc(statusDocRef, updated, { merge: true });
        return { success: true };
      } catch (error) {
        console.error('[StoreStatusContext] Failed to update Firestore:', error);
        return { success: false, error: error.message };
      }
    }

    return { success: true };
  };

  const toggleStoreStatus = async () => {
    return await updateStoreStatus(!storeStatus.isOpen, storeStatus.customMessage);
  };

  return (
    <StoreStatusContext.Provider
      value={{
        storeStatus,
        isOpen: storeStatus.isOpen,
        customMessage: storeStatus.customMessage,
        openingHours: storeStatus.openingHours,
        loading,
        updateStoreStatus,
        toggleStoreStatus
      }}
    >
      {children}
    </StoreStatusContext.Provider>
  );
}

export function useStoreStatus() {
  const context = useContext(StoreStatusContext);
  if (!context) {
    throw new Error('useStoreStatus must be used within a StoreStatusProvider');
  }
  return context;
}
