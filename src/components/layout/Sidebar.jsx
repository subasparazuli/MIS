import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    setActiveModal,
    services,
    clients,
    sidebarVisible,
    toggleSidebar
  } = useApp();

  const [servicesExpanded, setServicesExpanded] = useState(true);

  const isCurrent = (path) => {
    if (path === '/quick-view' || path === '/team-communications') {
      return (
        location.pathname === '/' ||
        location.pathname === '/quick-view' ||
        location.pathname === '/team-communications'
      );
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleNavClick = (path) => {
    navigate(path);
    if (setMobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-on-surface/40 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low border-r border-outline-variant z-50 flex flex-col justify-between transition-all duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } ${sidebarVisible ? 'lg:translate-x-0' : 'lg:-translate-x-full'}`}
      >
        {/* Scrollable Upper Area */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between border-b border-outline-variant/60 bg-surface-container-low shrink-0">
            <div
              onClick={() => handleNavClick('/quick-view')}
              className="flex items-center gap-space-sm cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-headline-sm text-[15px] text-on-surface tracking-tight truncate font-bold flex items-center gap-1">
                  LedgerPoint
                  <span className="text-[10px] uppercase font-bold px-1 py-0.2 bg-primary/10 text-primary rounded">
                    MIS
                  </span>
                </span>
                <span className="font-caption text-[11px] text-secondary tracking-wider truncate">
                  Tax &amp; Practice Manager
                </span>
              </div>
            </div>

            {/* Show / Hide Sidebar Toggle Icon Button */}
            <button
              type="button"
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setMobileOpen(false);
                } else {
                  toggleSidebar();
                }
              }}
              className="p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface-container transition flex items-center justify-center"
              aria-label="Hide Sidebar"
              title="Hide Sidebar"
            >
              <span className="material-symbols-outlined text-[20px]">menu_open</span>
            </button>
          </div>

          <div className="px-space-xs py-space-xs flex flex-col gap-space-xs">
            {/* ============================================================ */}
            {/* 1. TEAM COMMUNICATIONS */}
            {/* ============================================================ */}
            <div className="pt-2 px-space-sm">
              <button
                type="button"
                onClick={() => handleNavClick('/team-communications')}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${
                  isCurrent('/team-communications')
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container text-xs font-medium'
                }`}
              >
                <span
                  className={`material-symbols-outlined text-[18px] ${
                    isCurrent('/team-communications') ? 'text-on-surface' : 'text-secondary'
                  }`}
                >
                  forum
                </span>
                <span className="text-xs truncate">
                  Team Communications
                </span>
              </button>
            </div>

            <div className="px-space-md py-1">
              <div className="h-[1px] w-full bg-outline-variant/30" />
            </div>

            {/* ============================================================ */}
            {/* 2. SERVICES SECTION */}
            {/* ============================================================ */}
            <div>
              <div className="flex items-center justify-between px-space-md py-1">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    grid_view
                  </span>
                  Services
                </span>

                {/* Add More services with plus icon */}
                <button
                  type="button"
                  onClick={() => setActiveModal('addService')}
                  title="Add More Services"
                  className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/10 text-primary hover:bg-primary hover:text-on-primary transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </button>
              </div>

              {/* Service Navigation Items */}
              <nav className="flex flex-col gap-0.5 mt-1 px-space-xs">
                {/* 1. Business Activity Statement (BAS) */}
                <NavLink
                  to="/services/bas"
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-space-md py-2 rounded-lg text-xs transition-colors ${isActive
                      ? 'bg-surface-container-high text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`
                  }
                >
                  <div className="flex items-center gap-space-sm truncate">
                    <span className="material-symbols-outlined text-[18px]">receipt_long</span>
                    <span className="truncate">Business Activity Statement (BAS)</span>
                  </div>
                </NavLink>

                {/* 2. Payslip / Wage Management */}
                <NavLink
                  to="/services/payslips"
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-space-md py-2 rounded-lg text-xs transition-colors ${isActive
                      ? 'bg-surface-container-high text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`
                  }
                >
                  <div className="flex items-center gap-space-sm truncate">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span className="truncate">Payslip / Wage Management</span>
                  </div>
                </NavLink>

                {/* 3. DASP Client */}
                <NavLink
                  to="/services/dasp"
                  onClick={() => setMobileOpen && setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-space-md py-2 rounded-lg text-xs transition-colors ${isActive
                      ? 'bg-surface-container-high text-on-surface font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`
                  }
                >
                  <div className="flex items-center gap-space-sm truncate">
                    <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
                    <span className="truncate">DASP Client</span>
                  </div>
                </NavLink>

                {/* Dynamic custom service types added with plus icon */}
                {services
                  .filter((s) => !s.isDefault)
                  .map((service) => (
                    <NavLink
                      key={service.id}
                      to={service.path}
                      onClick={() => setMobileOpen && setMobileOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center justify-between px-space-md py-2 rounded-lg text-xs transition-colors ${isActive
                          ? 'bg-primary text-on-primary font-semibold shadow-xs'
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                        }`
                      }
                    >
                      <div className="flex items-center gap-space-sm truncate">
                        <span className="material-symbols-outlined text-[18px]">{service.icon}</span>
                        <span className="truncate">{service.name}</span>
                      </div>
                      <span className="text-[10px] px-1 py-0.2 rounded bg-surface-container text-secondary">
                        Custom
                      </span>
                    </NavLink>
                  ))}

                {/* Quick Add More Services Link */}
                <button
                  type="button"
                  onClick={() => setActiveModal('addService')}
                  className="flex items-center gap-2 px-space-md py-1.5 mt-1 rounded-lg text-xs text-primary hover:bg-primary-fixed/20 transition-colors font-medium border border-dashed border-primary/30"
                >
                  <span className="material-symbols-outlined text-[16px]">add_circle</span>
                  <span>Add More Services</span>
                </button>
              </nav>
            </div>

            <div className="px-space-md py-1">
              <div className="h-[1px] w-full bg-outline-variant/30" />
            </div>

            {/* ============================================================ */}
            {/* 3. CLIENTS SECTION */}
            {/* ============================================================ */}
            <div className="px-space-xs">
              <div className="px-space-md py-1 flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    business_center
                  </span>
                  Clients Directory
                </span>
                <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-surface-container rounded-full text-secondary">
                  {clients.length}
                </span>
              </div>

              <NavLink
                to="/clients"
                onClick={() => setMobileOpen && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center justify-between px-space-md py-2 rounded-lg text-xs transition-colors ${isActive
                    ? 'bg-surface-container-high text-on-surface font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                  }`
                }
              >
                <div className="flex items-center gap-space-sm">
                  <span className="material-symbols-outlined text-[18px]">domain</span>
                  <span className="font-medium">All Clients</span>
                </div>
                <span className="text-[11px] opacity-80">View List &rarr;</span>
              </NavLink>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 4. LOGIN / SIGNUP (ADMIN / USER) AT THE BOTTOM */}
        {/* ============================================================ */}
        <div className="p-space-sm border-t border-outline-variant/20 bg-surface-container-low shrink-0 flex flex-col gap-2">
          {/* Active Account Identity Card */}
          <div className="p-2.5 rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${currentUser.role === 'Admin'
                    ? 'bg-primary text-on-primary'
                    : 'bg-secondary text-on-secondary'
                    }`}
                >
                  {currentUser.avatar || 'US'}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-on-surface truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-secondary truncate leading-tight">
                    {currentUser.email}
                  </span>
                </div>
              </div>

              {/* Role Badge: Admin vs User */}
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0 ${currentUser.role === 'Admin'
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-surface-container text-secondary border border-outline-variant/30'
                  }`}
              >
                {currentUser.role}
              </span>
            </div>
          </div>

          {/* Login / Signup Modal Trigger Button */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveModal('auth')}
              className="flex-1 h-8 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px] text-primary">
                lock_person
              </span>
              <span>Login / Signup</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
