import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../config/supabase';

const AuthContext = createContext();

const ADMIN_CREDENTIALS = {
  email: 'admin@emsburgers.com',
  password: 'adminpassword123'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setCurrentUser(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
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

      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      return { success: true, isAdmin: false };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const signup = async (name, email, password) => {
    try {
      // 1. Sign up user in Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });
      if (authError) throw authError;

      if (authData.user) {
        // 2. Generate Hash ID
        const hashId = '#' + Math.floor(1000 + Math.random() * 9000).toString();

        // 3. Create profile in public.profiles
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              email: email,
              hash_id: hashId,
              role: 'user',
              stamps: 1 // Start with 1 welcome stamp!
            }
          ]);
        
        if (profileError) throw profileError;
      }
      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    if (currentUser?.role === 'admin') {
      setCurrentUser(null);
    } else {
      await supabase.auth.signOut();
    }
  };

  // Profile update functions - these should call Supabase in a real app
  const toggleFavourite = async (itemId) => {
    // Requires a favourites table or array in profiles. (Placeholder for now)
    return false;
  };

  const isDemoAccount = currentUser?.email === 'demo@emsburgers.com';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        signup,
        logout,
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

