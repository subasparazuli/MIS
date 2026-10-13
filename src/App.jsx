import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AddClientModal from './components/modals/AddClientModal';
import LogTimeModal from './components/modals/LogTimeModal';
import NewJobModal from './components/modals/NewJobModal';
import GlobalSearchModal from './components/modals/GlobalSearchModal';

import OverviewPage from './pages/OverviewPage';
import ClientsPage from './pages/ClientsPage';
import Client360Page from './pages/Client360Page';
import WorkflowsPage from './pages/WorkflowsPage';
import BillingWIPPage from './pages/BillingWIPPage';

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
            <Route path="/" element={<OverviewPage />} />
            <Route path="/overview" element={<OverviewPage />} />
            <Route path="/clients" element={<ClientsPage />} />
            <Route path="/client-360" element={<Client360Page />} />
            <Route path="/workflows" element={<WorkflowsPage />} />
            <Route path="/billing-and-wip" element={<BillingWIPPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <AddClientModal />
      <LogTimeModal />
      <NewJobModal />
      <GlobalSearchModal />

      {/* Toast Notification Pill */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-on-surface text-surface shadow-2xl animate-bounce-short border border-outline-variant/30">
          <span className="material-symbols-outlined text-[18px] text-primary-fixed">check_circle</span>
          <span className="font-label-md text-xs font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
