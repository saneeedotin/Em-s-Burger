import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect, 
  getRedirectResult, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, runTransaction } from 'firebase/firestore';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: 'admin@emsburgers.com',
  password: 'adminpassword123'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const generateNextUserId = async () => {
    let numericId = 1000;
    try {
      await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'metadata', 'user_counter');
        const counterDoc = await transaction.get(counterRef);
        if (!counterDoc.exists()) {
          numericId = 1001;
          transaction.set(counterRef, { count: 1001 });
        } else {
          numericId = counterDoc.data().count + 1;
          transaction.update(counterRef, { count: numericId });
        }
      });
    } catch (e) {
      console.error('Failed to generate numeric ID:', e);
      numericId = Math.floor(100000 + Math.random() * 900000);
    }
    return numericId;
  };

  useEffect(() => {
    // Handle redirect result from Google sign-in (if popup was blocked)
    getRedirectResult(auth).catch(console.error);

    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await fetchProfile(user.uid, user.email, user.displayName);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchProfile = async (userId, email, displayName) => {
    try {
      const userDocRef = doc(db, 'profiles', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        if (data.isBanned) {
          await signOut(auth);
          setCurrentUser(null);
          throw new Error('BANNED_USER');
        }
        
        if (!data.numeric_id && !data.hash_id) {
          // Retroactively generate an ID for older test accounts
          const numericId = await generateNextUserId();
          await setDoc(userDocRef, { numeric_id: numericId }, { merge: true });
          data.numeric_id = numericId;
        }
        setCurrentUser({ id: userId, ...data });
      } else {
        // Fallback: If profile doesn't exist (e.g. they just signed in with Google), create it
        const numericId = await generateNextUserId();

        const newProfile = {
          email: email,
          name: displayName || email.split('@')[0],
          numeric_id: numericId,
          role: 'user',
          stamps: 1, // Start with 1 welcome stamp!
          favourites: [],
          created_at: new Date().toISOString()
        };
        await setDoc(userDocRef, newProfile);
        setCurrentUser({ id: userId, ...newProfile });
      }
    } catch (error) {
      console.error('Error fetching/creating profile:', error);
      // Even if Firestore fails, set user so they aren't completely blocked
      setCurrentUser({ id: userId, email, role: 'user', name: displayName || email.split('@')[0] });
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Hardcoded admin check
      if (email.toLowerCase() === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        setCurrentUser({ id: 'admin', email: ADMIN_CREDENTIALS.email, role: 'admin', name: 'Admin' });
        return { success: true, isAdmin: true };
      }

      // Hardcoded demo user check
      if (email.toLowerCase() === 'demo@emsburgers.com') {
        setCurrentUser({ id: 'demo-user', email: 'demo@emsburgers.com', role: 'user', name: 'Demo User', stamps: 5 });
        return { success: true, isAdmin: false };
      }

      await signInWithEmailAndPassword(auth, email, password);
      // fetchProfile is triggered by onAuthStateChanged, but let's check it explicitly here to catch the throw
      const user = auth.currentUser;
      if (user) {
        await fetchProfile(user.uid, user.email, user.displayName);
      }
      return { success: true, isAdmin: false };
    } catch (error) {
      let message = error.message;
      if (error.message === 'BANNED_USER') {
        message = 'Your account has been permanently suspended.';
      } else if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = 'Invalid email or password.';
      }
      return { success: false, message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await fetchProfile(result.user.uid, result.user.email, result.user.displayName);
      }
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.message === 'BANNED_USER') {
        return { success: false, message: 'Your account has been permanently suspended.' };
      }
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google sign-in was closed before completing.' };
      }
      if (error.code === 'auth/popup-blocked') {
        return { success: false, message: 'Popup blocked by browser. Please allow popups for this site.' };
      }
      return { success: false, message: error.message || 'Google sign-in failed.' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // 1. Sign up user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Generate sequential Numeric ID
      const numericId = await generateNextUserId();

      // 3. Create profile in Firestore
      await setDoc(doc(db, 'profiles', user.uid), {
        email: email,
        name: name,
        numeric_id: numericId,
        role: 'user',
        stamps: 1, // Start with 1 welcome stamp!
        favourites: [],
        created_at: new Date().toISOString()
      });
      
      return { success: true };
    } catch (error) {
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    if (currentUser?.role === 'admin' || currentUser?.id === 'demo-user') {
      setCurrentUser(null);
    } else {
      await signOut(auth);
    }
  };

  const toggleFavourite = async (itemId) => {
    if (!currentUser || currentUser.id === 'admin' || currentUser.id === 'demo-user') return;
    
    try {
      const currentFavs = currentUser.favourites || [];
      const newFavs = currentFavs.includes(itemId)
        ? currentFavs.filter(id => id !== itemId)
        : [...currentFavs, itemId];

      // Optimistic update
      setCurrentUser({ ...currentUser, favourites: newFavs });

      // Update in Firestore
      await setDoc(doc(db, 'profiles', currentUser.id), { favourites: newFavs }, { merge: true });
    } catch (error) {
      console.error("Error toggling favourite:", error);
    }
  };

  const resetPassword = async (emailToReset) => {
    try {
      const normalizedEmail = emailToReset.trim().toLowerCase();
      await sendPasswordResetEmail(auth, normalizedEmail);
      return { success: true };
    } catch (error) {
      console.error('Password reset error:', error);
      let message = error.message;
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email address. Please check and try again.';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        message = 'Too many attempts. Please wait a moment and try again.';
      }
      return { success: false, message };
    }
  };

  const isDemoAccount = currentUser?.email === 'demo@emsburgers.com';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        loginWithGoogle,
        signup,
        logout,
        resetPassword,
        toggleFavourite,
        isDemoAccount,
      }}
    >
      {!loading && children}
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
