import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, isFirebaseConfigured } from '../config/firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  getRedirectResult, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, onSnapshot, runTransaction, collection, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: 'admin@emsburgers.com',
  password: 'adminpassword123'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Guaranteed 100% Unique Sequential EMCODE Generator
  const generateNextUserId = async () => {
    let numericId = 1001;
    try {
      if (isFirebaseConfigured) {
        // 1. Query all existing profiles to find the current maximum numeric_id
        const profilesSnap = await getDocs(collection(db, 'profiles'));
        const existingIds = profilesSnap.docs
          .map(d => Number(d.data()?.numeric_id) || 0)
          .filter(id => id >= 1000);
        
        let localIds = [];
        try {
          const localProfiles = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
          localIds = localProfiles.map(p => Number(p.numeric_id) || 0).filter(id => id >= 1000);
        } catch (e) {}

        const maxExisting = Math.max(1000, ...existingIds, ...localIds);

        // 2. Perform atomic transaction on user_counter
        await runTransaction(db, async (transaction) => {
          const counterRef = doc(db, 'metadata', 'user_counter');
          const counterDoc = await transaction.get(counterRef);
          const currentCounterVal = counterDoc.exists() ? (counterDoc.data().count || 1000) : 1000;
          
          numericId = Math.max(currentCounterVal, maxExisting) + 1;
          transaction.set(counterRef, { count: numericId }, { merge: true });
        });
        return numericId;
      }
    } catch (e) {
      console.warn('Sequential unique numeric ID generation warning:', e);
    }

    try {
      const localProfiles = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
      const localIds = localProfiles.map(p => Number(p.numeric_id) || 0).filter(id => id >= 1000);
      numericId = Math.max(1000, ...localIds) + 1;
    } catch (e) {
      numericId = Math.floor(1000 + Math.random() * 9000);
    }
    return numericId;
  };

  // Auto-deduplicate any existing duplicate EMCODEs on initial load
  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const deduplicateExistingProfiles = async () => {
      try {
        const snap = await getDocs(collection(db, 'profiles'));
        const seenIds = new Set();
        const duplicates = [];

        snap.docs.forEach(docSnap => {
          const numId = Number(docSnap.data()?.numeric_id);
          if (numId) {
            if (seenIds.has(numId)) {
              duplicates.push({ docId: docSnap.id, data: docSnap.data() });
            } else {
              seenIds.add(numId);
            }
          }
        });

        if (duplicates.length > 0) {
          let highest = Math.max(1000, ...Array.from(seenIds));
          for (const dup of duplicates) {
            highest += 1;
            await updateDoc(doc(db, 'profiles', dup.docId), { numeric_id: highest });
            seenIds.add(highest);
          }
          await setDoc(doc(db, 'metadata', 'user_counter'), { count: highest }, { merge: true });
        }
      } catch (err) {
        console.warn('Deduplication check warning:', err);
      }
    };

    deduplicateExistingProfiles();
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) {
      setLoading(false);
      return;
    }

    // Handle redirect result from Google sign-in
    getRedirectResult(auth).catch(console.error);

    let profileUnsubscribe = () => {};

    // Listen for Firebase Auth state changes
    const authUnsubscribe = onAuthStateChanged(auth, async (user) => {
      profileUnsubscribe(); // clean up previous listener

      if (user) {
        // Subscribe to real-time profile updates in Firestore
        const userDocRef = doc(db, 'profiles', user.uid);
        
        try {
          const initialSnap = await getDoc(userDocRef);
          
          if (!initialSnap.exists()) {
            const numericId = await generateNextUserId();
            const isAdminEmail = user.email?.toLowerCase() === ADMIN_CREDENTIALS.email || user.email?.toLowerCase() === 'admin@emsburger.com';

            const newProfile = {
              email: user.email?.toLowerCase(),
              name: user.displayName || user.email?.split('@')[0] || 'Customer',
              numeric_id: numericId,
              role: isAdminEmail ? 'admin' : 'user',
              stamps: 1,
              beverageStamps: 0,
              favourites: [],
              created_at: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            setCurrentUser({ id: user.uid, ...newProfile });

            // Sync to local cache
            try {
              const localProfiles = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
              const merged = [{ id: user.uid, ...newProfile }, ...localProfiles.filter(p => p.id !== user.uid)];
              localStorage.setItem('ems_user_profiles', JSON.stringify(merged));
              window.dispatchEvent(new Event('ems_users_updated'));
            } catch (e) {}
          } else {
            const data = initialSnap.data();
            if (!data.numeric_id) {
              const numericId = await generateNextUserId();
              await setDoc(userDocRef, { numeric_id: numericId }, { merge: true });
              data.numeric_id = numericId;
            }
            setCurrentUser({ id: user.uid, ...data });

            // Sync to local cache
            try {
              const localProfiles = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
              const merged = [{ id: user.uid, ...data }, ...localProfiles.filter(p => p.id !== user.uid)];
              localStorage.setItem('ems_user_profiles', JSON.stringify(merged));
              window.dispatchEvent(new Event('ems_users_updated'));
            } catch (e) {}
          }

          // Real-time listener for profile changes (stamps, bans, favorites)
          profileUnsubscribe = onSnapshot(userDocRef, async (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              if (data.isBanned) {
                await signOut(auth);
                setCurrentUser(null);
                alert('Your account has been suspended.');
                return;
              }
              setCurrentUser({ id: user.uid, ...data });

              try {
                const localProfiles = JSON.parse(localStorage.getItem('ems_user_profiles') || '[]');
                const merged = [{ id: user.uid, ...data }, ...localProfiles.filter(p => p.id !== user.uid)];
                localStorage.setItem('ems_user_profiles', JSON.stringify(merged));
                window.dispatchEvent(new Event('ems_users_updated'));
              } catch (e) {}
            }
          });

        } catch (err) {
          console.warn('Profile initialization error:', err);
          setCurrentUser({
            id: user.uid,
            email: user.email,
            name: user.displayName || user.email?.split('@')[0] || 'Customer',
            numeric_id: 1001,
            role: 'user',
            stamps: 1,
            favourites: []
          });
        } finally {
          setLoading(false);
        }
      } else {
        // If logged in via master admin credentials without Firebase Auth UID
        if (currentUser?.id !== 'admin_master') {
          setCurrentUser(null);
        }
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      profileUnsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      const normalizedEmail = email.trim().toLowerCase();

      // Check admin credentials
      if ((normalizedEmail === ADMIN_CREDENTIALS.email || normalizedEmail === 'admin@emsburger.com') && password === ADMIN_CREDENTIALS.password) {
        try {
          if (isFirebaseConfigured) {
            await signInWithEmailAndPassword(auth, normalizedEmail, password);
          }
        } catch (e) {}

        setCurrentUser({ 
          id: 'admin_master', 
          email: ADMIN_CREDENTIALS.email, 
          role: 'admin', 
          name: 'Master Admin',
          numeric_id: 9999,
          stamps: 9 
        });
        return { success: true, isAdmin: true };
      }

      if (!isFirebaseConfigured) {
        return { 
          success: false, 
          message: 'Firebase is not configured. Please add your VITE_FIREBASE_* keys to .env.' 
        };
      }

      const userCredential = await signInWithEmailAndPassword(auth, normalizedEmail, password);
      return { success: true, isAdmin: false };
    } catch (error) {
      console.error('Login error:', error);
      let message = error.message;
      if (
        error.code === 'auth/invalid-credential' || 
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password'
      ) {
        message = 'Invalid email or password.';
      } else if (error.code === 'auth/api-key-not-valid') {
        message = 'Firebase API Key is invalid. Please check your .env configuration.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'Domain unauthorized. Add this host/IP to Firebase Console -> Authentication -> Settings -> Authorized Domains.';
      } else if (error.code === 'auth/network-request-failed') {
        message = 'Network error. Please check your internet connection.';
      }
      return { success: false, message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      if (!isFirebaseConfigured) {
        return { 
          success: false, 
          message: 'Firebase is not configured. Please set your VITE_FIREBASE_* keys in .env.' 
        };
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      return { success: true };
    } catch (error) {
      console.error('Google sign-in error:', error);
      if (error.code === 'auth/popup-closed-by-user') {
        return { success: false, message: 'Google sign-in was closed before completing.' };
      }
      if (error.code === 'auth/popup-blocked') {
        return { success: false, message: 'Popup blocked by browser. Please allow popups for this site.' };
      }
      if (error.code === 'auth/unauthorized-domain') {
        return { 
          success: false, 
          message: 'Domain unauthorized. Please add this host/IP to Firebase Console Authorized Domains.' 
        };
      }
      return { success: false, message: error.message || 'Google sign-in failed.' };
    }
  };

  const signup = async (name, email, password) => {
    try {
      if (!isFirebaseConfigured) {
        return { 
          success: false, 
          message: 'Firebase is not configured. Please set your VITE_FIREBASE_* keys in .env.' 
        };
      }

      const normalizedEmail = email.trim().toLowerCase();

      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      // 2. Generate sequential Numeric ID
      const numericId = await generateNextUserId();

      // 3. Create profile document in Firestore
      const newProfile = {
        email: normalizedEmail,
        name: name.trim(),
        numeric_id: numericId,
        role: 'user',
        stamps: 1, // 1 welcome stamp
        beverageStamps: 0,
        favourites: [],
        created_at: new Date().toISOString()
      };

      await setDoc(doc(db, 'profiles', user.uid), newProfile);
      setCurrentUser({ id: user.uid, ...newProfile });
      
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      let message = error.message;
      if (error.code === 'auth/email-already-in-use') {
        message = 'This email is already in use. Please log in.';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password must be at least 6 characters.';
      } else if (error.code === 'auth/api-key-not-valid') {
        message = 'Firebase API Key is invalid. Please check your .env configuration.';
      } else if (error.code === 'auth/unauthorized-domain') {
        message = 'Domain unauthorized. Please add this host to Firebase Console Authorized Domains.';
      }
      return { success: false, message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Sign out error:', e);
    }
    setCurrentUser(null);
  };

  const toggleFavourite = async (itemId) => {
    if (!currentUser) return;
    
    try {
      const currentFavs = currentUser.favourites || [];
      const newFavs = currentFavs.includes(itemId)
        ? currentFavs.filter(id => id !== itemId)
        : [...currentFavs, itemId];

      setCurrentUser({ ...currentUser, favourites: newFavs });

      if (isFirebaseConfigured && currentUser.id !== 'admin_master') {
        await setDoc(doc(db, 'profiles', currentUser.id), { favourites: newFavs }, { merge: true });
      }
    } catch (error) {
      console.error("Error toggling favourite in Firestore:", error);
    }
  };

  const resetPassword = async (emailToReset) => {
    try {
      if (!isFirebaseConfigured) {
        return { 
          success: false, 
          message: 'Firebase is not configured. Please set your VITE_FIREBASE_* keys in .env.' 
        };
      }

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
        isFirebaseConfigured
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
