import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';

// Modals
import AddClientModal from './components/modals/AddClientModal';
import AddServiceModal from './components/modals/AddServiceModal';
import AuthModal from './components/modals/AuthModal';
import AddIssueTokenModal from './components/modals/AddIssueTokenModal';
import PrepareBasModal from './components/modals/PrepareBasModal';
import PayslipModal from './components/modals/PayslipModal';
import CreatePayRunModal from './components/modals/CreatePayRunModal';
import GlobalSearchModal from './components/modals/GlobalSearchModal';

// Pages
import QuickViewPage from './pages/QuickViewPage';
import BasPage from './pages/BasPage';
import PayslipsPage from './pages/PayslipsPage';
import SuperannuationPage from './pages/SuperannuationPage';
import ClientsPage from './pages/ClientsPage';
import ClientProfilePage from './pages/ClientProfilePage';
import CustomServicePage from './pages/CustomServicePage';

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { toast } = useApp();

  return (
    <div className="min-h-screen bg-surface font-body-md text-on-surface antialiased flex flex-col">
      {/* Sidebar Rail */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Layout Area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Sticky Global Top Header */}
        <Header setMobileOpen={setMobileOpen} />

        {/* Content Body */}
        <main className="relative pt-16 bg-surface min-h-[calc(100vh-4rem)] w-full px-4 lg:px-gutter-desktop">
          <Routes>
            <Route path="/" element={<QuickViewPage />} />
            <Route path="/quick-view" element={<QuickViewPage />} />
            <Route path="/services/bas" element={<BasPage />} />
            <Route path="/services/payslips" element={<PayslipsPage />} />
            <Route path="/services/superannuation" element={<SuperannuationPage />} />
            <Route path="/services/:serviceId" element={<CustomServicePage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/clients/:clientId" element={<ClientProfilePage />} />
            <Route path="/client-profile" element={<ClientProfilePage />} />
            <Route path="*" element={<Navigate to="/quick-view" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AddClientModal />
      <AddServiceModal />
      <AuthModal />
      <AddIssueTokenModal />
      <PrepareBasModal />
      <PayslipModal />
      <CreatePayRunModal />
      <GlobalSearchModal />

      {/* Toast Notification Pill */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl text-white shadow-2xl animate-bounce-short border ${
            toast.type === 'error'
              ? 'bg-error border-error-container'
              : 'bg-slate-900 border-outline-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="font-label-md text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
