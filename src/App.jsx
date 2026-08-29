import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './context/AuthContext';
import { VegModeProvider } from './context/VegModeContext';
import { CartProvider } from './context/CartContext';
import { MenuProvider } from './context/MenuContext';
import { ActiveOrderProvider } from './context/ActiveOrderContext';
import { RequireAuth } from './components/RequireAuth';
import { RequireAdmin } from './components/RequireAdmin';
import { SmoothScroll } from './components/SmoothScroll';
import { BurgerCursor } from './components/BurgerCursor';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LoadingScreen } from './components/LoadingScreen';
import { PageTransition } from './components/PageTransition';
import { FloatingCart } from './components/FloatingCart';
import { LiveOrderNavbarPill } from './components/LiveOrderNavbarPill';

import { Home } from './pages/Home';
import { Menu } from './pages/Menu';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Loyalty } from './pages/Loyalty';
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { GalleryPage } from './pages/GalleryPage';
import { TableQR } from './pages/TableQR';
import { Checkout } from './pages/Checkout';
import { WhileYouWait } from './pages/WhileYouWait';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { NotFound } from './pages/NotFound';

import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminOrders } from './pages/admin/AdminOrders';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminLoyalty } from './pages/admin/AdminLoyalty';
import { AdminMenu } from './pages/admin/AdminMenu';
import { AdminQRGenerator } from './pages/admin/AdminQRGenerator';
import { AdminReviews } from './pages/admin/AdminReviews';

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
      <MenuProvider>
        <VegModeProvider>
          <CartProvider>
            <ActiveOrderProvider>
              <LoadingScreen />
              {!isAdmin && <BurgerCursor />}
              <SmoothScroll>
                <ScrollToTop />
                
                {isAdmin ? (
                  <Routes location={location}>
                    <Route path="/admin" element={
                      <RequireAdmin>
                        <AdminLayout />
                      </RequireAdmin>
                    }>
                      <Route index element={<AdminDashboard />} />
                      <Route path="orders" element={<AdminOrders />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="loyalty" element={<AdminLoyalty />} />
                      <Route path="menu" element={<AdminMenu />} />
                      <Route path="qr" element={<AdminQRGenerator />} />
                      <Route path="reviews" element={<AdminReviews />} />
                    </Route>
                  </Routes>
                ) : (
                  <div className="flex flex-col min-h-screen bg-cream doodles-red text-dark font-body">
                    <Navbar />

                    <main className="flex-grow">
                      <AnimatePresence mode="wait">
                        <PageTransition key={location.pathname}>
                          <Routes location={location}>
                            <Route path="/" element={<Home />} />
                            <Route path="/menu" element={<Menu />} />
                            <Route path="/table/:id" element={<TableQR />} />
                            <Route path="/gallery" element={<GalleryPage />} />
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
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/while-you-wait" element={<WhileYouWait />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="*" element={<NotFound />} />
                          </Routes>
                        </PageTransition>
                      </AnimatePresence>
                    </main>

                    <LiveOrderNavbarPill />
                    <FloatingCart />
                    <Footer />
                  </div>
                )}
              </SmoothScroll>
            </ActiveOrderProvider>
          </CartProvider>
        </VegModeProvider>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
