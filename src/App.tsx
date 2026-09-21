import React, { useEffect } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WhatsAppAnnouncementBar } from './components/WhatsAppAnnouncementBar';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';
import { HomePage } from './components/HomePage';
import { ShopPage } from './components/ShopPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { CheckoutPage } from './components/CheckoutPage';
import { OrderSuccessPage } from './components/OrderSuccessPage';
import { UserAccountPage } from './components/UserAccountPage';
import { AdminDashboard } from './components/AdminDashboard';
import { ReturnPolicyPage } from './components/ReturnPolicyPage';
import { Register } from './pages/Register';
import { Login } from './pages/Login';

const MainContent: React.FC = () => {
  const { currentView } = useStore();

  // Scroll to top whenever the view changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentView]);

  return (
    <main className="flex-1">
      {currentView === 'home' && <HomePage />}
      {currentView === 'shop' && <ShopPage />}
      {currentView === 'product' && <ProductDetailPage />}
      {currentView === 'cart' && <CartPage />}
      {currentView === 'checkout' && <CheckoutPage />}
      {currentView === 'order-success' && <OrderSuccessPage />}
      {currentView === 'account' && <UserAccountPage />}
      {currentView === 'return-policy' && <ReturnPolicyPage />}
      {currentView === 'register' && <Register />}
      {currentView === 'login' && <Login />}
    </main>
  );
};

const AppContent: React.FC = () => {
  const { currentView } = useStore();

  // Dedicated admin portal view: isolated from customer storefront
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen flex flex-col bg-neutral-100/60 text-neutral-900 font-sans antialiased selection:bg-neutral-950 selection:text-white">
        <main className="flex-1">
          <AdminDashboard />
        </main>
      </div>
    );
  }

  // Customer-facing store layout: all admin buttons and links hidden
  return (
    <div className="min-h-screen flex flex-col bg-neutral-50/50 text-neutral-900 font-sans antialiased selection:bg-neutral-950 selection:text-white">
      <WhatsAppAnnouncementBar />
      <Header />
      <MainContent />
      <Footer />
      <WhatsAppFloatingButton />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
