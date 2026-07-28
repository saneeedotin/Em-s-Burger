import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { SmoothScroll } from './components/SmoothScroll';
import { ScrollProgressMascot } from './components/ScrollProgressMascot';
import { BurgerCursor } from './components/BurgerCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Loyalty } from './pages/Loyalty';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <BurgerCursor />
      <SmoothScroll>
        <ScrollToTop />
        <ScrollProgressMascot />
        <div className="flex flex-col min-h-screen bg-cream text-dark font-body">
          <Navbar />

          <main className="flex-grow">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.35, ease: [0.25, 1, 0.5, 1] }}
              >
                <Routes location={location}>
                  <Route path="/" element={<Home />} />
                  <Route path="/menu" element={<Menu />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/loyalty" element={<Loyalty />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route
                    path="/dashboard"
                    element={
                      <RequireAuth>
                        <Dashboard />
                      </RequireAuth>
                    }
                  />
                </Routes>
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer />
        </div>
      </SmoothScroll>
    </AuthProvider>
  );
}

export default App;
