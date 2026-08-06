import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { RequireAuth } from './components/RequireAuth';
import { SmoothScroll } from './components/SmoothScroll';
import { ScrollProgressMascot } from './components/ScrollProgressMascot';
import { BurgerCursor } from './components/BurgerCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { PageTransition } from './components/PageTransition';

import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Loyalty } from './pages/Loyalty';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminLoyalty } from './pages/admin/AdminLoyalty';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function App() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <LoadingScreen />
      {!isAdmin && <BurgerCursor />}
      <SmoothScroll>
        <ScrollToTop />
        {!isAdmin && <ScrollProgressMascot />}
        
        {isAdmin ? (
          <Routes location={location}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="loyalty" element={<AdminLoyalty />} />
            </Route>
          </Routes>
        ) : (
          <div className="flex flex-col min-h-screen bg-cream text-dark font-body">
            <Navbar />

            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <PageTransition key={location.pathname}>
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
                </PageTransition>
              </AnimatePresence>
            </main>

            <Footer />
          </div>
        )}
      </SmoothScroll>
    </AuthProvider>
  );
}

export default App;
