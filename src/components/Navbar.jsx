import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, User, LogOut, LayoutDashboard, Heart, Sparkles, ChevronDown, Leaf } from 'lucide-react';
import { Logo } from './Logo';
import { useAuth } from '../context/AuthContext';
import { useVegMode } from '../context/VegModeContext';
import FlowingMenu from './FlowingMenu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuth();
  const { isVegOnly, toggleVegMode } = useVegMode();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    ...(!currentUser ? [{ name: 'Loyalty Club', path: '/loyalty', badge: '10th Free' }] : []),
  ];

  const handleLogout = () => {
    setUserDropdownOpen(false);
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-primary doodles-cream">
      <div className="relative z-50 bg-primary doodles-cream max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Logo variant="default" size="normal" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2 bg-primary-dark/30 p-1.5 rounded-full border border-cream/10 backdrop-blur-sm">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full font-heading font-semibold text-sm lg:text-base transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-primary bg-cream shadow-sm scale-[1.02]' 
                    : 'text-cream hover:bg-cream/15 hover:text-white'
                }`}
              >
                {link.name}
                {link.badge && (
                  <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-full transition-colors ${
                    isActive ? 'bg-primary text-cream' : 'bg-accent text-dark'
                  }`}>
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Desktop Auth & Order Buttons */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Veg Mode Toggle */}
          <button
            onClick={toggleVegMode}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-heading font-bold text-xs transition-colors border-2 ${
              isVegOnly 
                ? 'bg-emerald-500 text-white border-emerald-500 shadow-md shadow-emerald-500/20' 
                : 'bg-cream/10 text-cream border-cream/20 hover:bg-cream/20 hover:border-cream/30'
            }`}
            title="Toggle Pure Veg Mode"
          >
            <Leaf className={`w-3.5 h-3.5 ${isVegOnly ? 'fill-white' : ''}`} />
            <span>Pure Veg</span>
          </button>
          
          {/* User State */}
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 bg-cream text-primary font-heading font-bold px-4 py-2 rounded-full shadow-md hover:bg-accent hover:text-dark transition-all focus:outline-none"
              >
                <div className="w-6 h-6 rounded-full bg-primary text-cream flex items-center justify-center text-xs font-black">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-sm max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {userDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2, ease: 'back.out(1.5)' }}
                    className="absolute right-0 mt-2 w-56 bg-cream rounded-3xl p-3 border-2 border-primary/20 shadow-2xl z-50 text-dark space-y-1"
                  >
                    <div className="px-3 py-2 border-b border-primary/10 mb-1">
                      <div className="font-heading font-extrabold text-sm text-primary truncate">{currentUser.name}</div>
                      <div className="text-[11px] text-dark/70 truncate">{currentUser.email}</div>
                      <div className="mt-1.5 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent text-dark text-[10px] font-black uppercase">
                        <Sparkles className="w-3 h-3 fill-dark" />
                        <span>{currentUser.loyaltyPoints}/9 Stamps Collected</span>
                      </div>
                    </div>

                    <NavLink
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-primary/10 font-heading font-bold text-sm text-dark transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span>My Dashboard</span>
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-2xl hover:bg-red-100 text-primary font-heading font-bold text-sm transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-primary" />
                      <span>Log Out</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <NavLink
              to="/login"
              className="inline-flex items-center gap-1.5 bg-cream/15 hover:bg-cream hover:text-primary text-cream font-heading font-bold text-sm px-4 py-2 rounded-full border border-cream/20 transition-all"
            >
              <User className="w-4 h-4" />
              <span>Log In</span>
            </NavLink>
          )}

          {/* Order Online Button */}
          <a
            href="https://www.zomato.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center gap-2 bg-accent hover:bg-accent-hover text-dark font-heading font-bold px-4 py-2.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 text-sm"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>Order Online</span>
          </a>

        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
          className="md:hidden p-2.5 rounded-2xl bg-cream/10 text-cream hover:bg-cream/20 transition-colors focus:outline-none"
        >
          {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 bg-primary doodles-cream flex flex-col md:hidden pt-24 pb-8 overflow-y-auto"
          >
            <div className="flex-grow flex flex-col justify-center px-4">
              <FlowingMenu 
                items={navLinks.map(link => ({
                  link: link.path,
                  text: link.name,
                  image: "/assets/Meltdown .png"
                }))}
                speed={15}
                textColor="#F4E9D8"
                bgColor="#D9381E"
                marqueeBgColor="#F4E9D8"
                marqueeTextColor="#D9381E"
                borderColor="#F4E9D8"
                onItemClick={(item) => {
                  setIsOpen(false);
                  navigate(item.link);
                }}
              />
            </div>

            <div className="px-6 mt-8 flex flex-col gap-4">
              {/* User Bar in Mobile Menu */}
              {currentUser ? (
                <div className="p-4 rounded-3xl bg-cream/10 border border-cream/20 text-cream flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cream text-primary font-heading font-black text-base flex items-center justify-center">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-heading font-extrabold text-base text-cream">{currentUser.name}</div>
                      <div className="text-xs text-cream/70 font-bold">{currentUser.loyaltyPoints}/9 Loyalty Stamps</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/dashboard');
                    }}
                    className="px-3 py-1.5 rounded-full bg-cream text-primary font-heading font-bold text-xs"
                  >
                    Dashboard
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pb-2">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }}
                    className="py-3 text-center rounded-2xl bg-cream text-primary font-heading font-bold text-sm shadow-sm"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/signup');
                    }}
                    className="py-3 text-center rounded-2xl bg-dark text-cream font-heading font-bold text-sm shadow-sm"
                  >
                    Sign Up
                  </button>
                </div>
              )}

              {/* Mobile Veg Mode Toggle */}
              <button
                onClick={toggleVegMode}
                className={`w-full flex items-center justify-center gap-2 py-3.5 px-5 rounded-2xl font-heading font-bold text-sm transition-all shadow-sm ${
                  isVegOnly
                    ? 'bg-emerald-500 text-white shadow-emerald-500/30'
                    : 'bg-cream/10 text-cream hover:bg-cream/20 border border-cream/20'
                }`}
              >
                <Leaf className={`w-4 h-4 ${isVegOnly ? 'fill-white' : ''}`} />
                <span>{isVegOnly ? 'Pure Veg Mode Active' : 'Enable Pure Veg Mode'}</span>
              </button>

              {currentUser && (
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-cream/10 text-cream hover:bg-red-500/20 font-heading font-bold text-sm transition-colors border border-transparent hover:border-red-500/30"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              )}

              <div className="pt-2">
                <a
                  href="https://www.zomato.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 bg-dark text-cream font-heading font-bold py-3.5 px-6 rounded-2xl shadow-lg hover:bg-black transition-all"
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>Order on Zomato / Swiggy</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
