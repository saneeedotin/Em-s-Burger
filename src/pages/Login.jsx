import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

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

