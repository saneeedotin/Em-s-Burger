import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Utensils, MapPin, ArrowLeft, Sparkles, ChefHat } from 'lucide-react';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] pt-24 pb-16 px-4 flex items-center justify-center relative overflow-hidden">
      
      {/* Background Decorative Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-accent/10 rounded-full blur-2xl pointer-events-none" />

      <div className="max-w-md w-full text-center relative z-10 space-y-6">
        
        {/* Animated 404 Hero Visual */}
        <div className="relative inline-block">
          <motion.div
            animate={{ 
              rotate: [-6, 6, -6],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-28 h-28 sm:w-32 sm:h-32 mx-auto rounded-3xl bg-accent/20 border-4 border-accent flex items-center justify-center shadow-xl relative"
          >
            <img 
              src="/logoo.svg" 
              alt="EM'S Burger" 
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-md" 
            />
            <span className="absolute -top-3 -right-3 bg-primary text-cream font-mono font-black text-xs px-2.5 py-1 rounded-full shadow-md animate-bounce">
              404
            </span>
          </motion.div>
        </div>

        {/* Text Content */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1 text-primary text-xs font-black uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            <span>Page Not Found</span>
          </div>
          <h1 className="font-heading font-black text-4xl sm:text-5xl text-dark tracking-tight">
            Whoops! This Page Got Eaten.
          </h1>
          <p className="text-dark/70 text-sm sm:text-base leading-relaxed max-w-xs mx-auto">
            The burger you're looking for might have melted away, or this URL never existed in our kitchen.
          </p>
        </div>

        {/* Quick Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            onClick={() => navigate('/menu')}
            className="p-4 rounded-2xl bg-primary hover:bg-primary-hover text-cream font-heading font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Utensils className="w-4 h-4 text-accent" />
            <span>Explore Menu</span>
          </button>

          <button
            onClick={() => navigate('/')}
            className="p-4 rounded-2xl bg-white hover:bg-cream-light border-2 border-dark/10 text-dark font-heading font-black text-xs uppercase tracking-wider shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Home className="w-4 h-4 text-primary" />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="pt-2">
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-dark/60 hover:text-primary transition-colors"
          >
            <MapPin size={13} />
            <span>Visit us in Chembur Camp, Mumbai</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
