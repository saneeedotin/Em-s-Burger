import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { auth } from '../config/firebase';
import { GoogleAuthProvider, signInWithRedirect } from 'firebase/auth';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login, loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  // Auto-redirect if user is already logged in (e.g. after Google popup)
  useEffect(() => {
    if (currentUser && currentUser.role !== 'admin') {
      setSuccess(true);
      setTimeout(() => navigate(from, { replace: true }), 600);
    } else if (currentUser && currentUser.role === 'admin') {
      setSuccess(true);
      setTimeout(() => navigate('/admin', { replace: true }), 600);
    }
  }, [currentUser, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password.');
      triggerShake();
      return;
    }

    const res = await login(email, password);
    if (res.success) {
      setSuccess(true);
      if (res.isAdmin) {
        setTimeout(() => navigate('/admin', { replace: true }), 600);
      } else {
        setTimeout(() => navigate(from, { replace: true }), 600);
      }
    } else {
      setError(res.message);
      triggerShake();
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const res = await loginWithGoogle();
      if (res.success) {
        setSuccess(true);
        if (res.isAdmin) {
          setTimeout(() => navigate('/admin', { replace: true }), 600);
        } else {
          setTimeout(() => navigate(from, { replace: true }), 600);
        }
      } else if (res.message && res.message.includes('popup-blocked')) {
        // Popup was blocked — use redirect instead
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      } else {
        setError(res.message);
        triggerShake();
      }
    } catch (err) {
      // If anything goes wrong, try redirect as last resort
      try {
        const provider = new GoogleAuthProvider();
        await signInWithRedirect(auth, provider);
      } catch (redirectErr) {
        setError(redirectErr.message);
        triggerShake();
      }
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div className="py-16 bg-cream min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={
          shake
            ? { x: [-10, 10, -8, 8, -4, 4, 0], opacity: 1, scale: 1, y: 0 }
            : { opacity: 1, scale: 1, y: 0 }
        }
        transition={shake ? { duration: 0.4 } : { duration: 0.5, ease: 'back.out(1.5)' }}
        className="w-full max-w-md bg-cream-light rounded-4xl p-8 sm:p-10 border-4 border-primary/20 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-heading font-extrabold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 fill-primary" />
            <span>Welcome Back</span>
          </div>
          <h1 className="font-heading font-black text-3xl sm:text-4xl text-dark">
            LOG IN TO EM'S
          </h1>
          <p className="text-dark/70 text-xs font-medium">
            Access your loyalty punch card, orders & favourite burgers.
          </p>
        </div>

        {/* Success Overlay */}
        {success ? (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="py-10 text-center space-y-3"
          >
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="font-heading font-black text-2xl text-dark">Welcome back!</h3>
            <p className="text-xs text-dark/70">Redirecting you...</p>
          </motion.div>
        ) : (
          <>
            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-2xl bg-red-100 border border-primary/30 text-primary text-xs font-bold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Google Sign In */}
            <button
              onClick={handleGoogleLogin}
              className="w-full py-3.5 rounded-full bg-white text-dark font-heading font-extrabold text-sm border-2 border-dark/10 shadow-sm hover:bg-dark/5 hover:border-dark/20 transition-all flex items-center justify-center gap-3 active:scale-95"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                <path d="M1 1h22v22H1z" fill="none"/>
              </svg>
              Sign In with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-primary/10"></div>
              <span className="text-xs font-bold font-heading uppercase text-dark/40 tracking-widest">Or</span>
              <div className="flex-1 h-px bg-primary/10"></div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold font-heading uppercase tracking-wider text-dark/70">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream border-2 border-primary/20 text-dark font-medium text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold font-heading uppercase tracking-wider text-dark/70">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-dark/40 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-cream border-2 border-primary/20 text-dark font-medium text-sm focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/15 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-primary hover:bg-primary-hover text-cream font-heading font-extrabold text-base shadow-lg hover:shadow-xl transition-all active:scale-95"
              >
                Log In
              </button>
            </form>

            {/* Footer Sign up prompt */}
            <div className="text-center pt-2 border-t border-primary/10 text-xs font-medium text-dark/70">
              Don't have an account yet?{' '}
              <Link to="/signup" className="text-primary font-heading font-bold hover:underline">
                Create Account
              </Link>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}

