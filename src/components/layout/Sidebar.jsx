import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    currentUser,
    switchRole,
    setActiveModal,
    flagCounts,
    totalFlagCount,
    services,
    clients,
    sidebarVisible,
    toggleSidebar
  } = useApp();

  const [servicesExpanded, setServicesExpanded] = useState(true);
  const [quickViewExpanded, setQuickViewExpanded] = useState(false);

  const isCurrent = (path) => {
    if (path === '/quick-view') {
      return location.pathname === '/' || location.pathname === '/quick-view';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isQuickViewTab = (tab) => {
    return (
      (location.pathname === '/' || location.pathname === '/quick-view') &&
      location.search.includes(`tab=${tab}`)
    );
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
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-lowest border-r border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-all duration-300 ${mobileOpen ? 'translate-x-0' : sidebarVisible ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Scrollable Upper Area */}
        <div className="flex flex-col flex-1 min-h-0 overflow-y-auto">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-outline-variant/20 bg-surface-container-low shrink-0">
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
            {/* 1. QUICK VIEW (FLAG SIGNS) */}
            {/* ============================================================ */}
            <div className="pt-2">
              <div className="flex items-center justify-between px-space-md py-1">
                <button
                  type="button"
                  onClick={() => handleNavClick('/quick-view')}
                  className="flex items-center gap-2 text-left group flex-1"
                >
                  <span
                    className={`material-symbols-outlined text-[18px] transition-colors ${isCurrent('/quick-view') ? 'text-primary font-bold' : 'text-secondary group-hover:text-primary'
                      }`}
                  >
                    speed
                  </span>
                  <span
                    className={`text-xs font-bold uppercase tracking-wider transition-colors ${isCurrent('/quick-view') ? 'text-primary' : 'text-secondary group-hover:text-on-surface'
                      }`}
                  >
                    Quick View
                  </span>
                </button>

                <div className="flex items-center gap-1">
                  {totalFlagCount > 0 && (
                    <span
                      title={`${totalFlagCount} active flag signs require attention`}
                      className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-error-container text-error leading-none"
                    >
                      {totalFlagCount} Flags
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => setQuickViewExpanded(!quickViewExpanded)}
                    className="p-1 text-outline hover:text-on-surface rounded"
                    aria-label="Toggle Quick View sub-items"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {quickViewExpanded ? 'expand_less' : 'expand_more'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Flag Signs Sub-Items */}
              {quickViewExpanded && (
                <div className="flex flex-col gap-1 mt-1 pl-space-sm pr-space-xs">
                  {/* Flag Sign 1: Not Processed */}
                  <NavLink
                    to="/quick-view?tab=not_processed"
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) => {
                      const active = isActive && isQuickViewTab('not_processed');
                      return `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200 shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                        }`;
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shrink-0" />
                      <span className="truncate">Not Processed</span>
                    </div>
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                      {flagCounts.notProcessed}
                    </span>
                  </NavLink>

                  {/* Flag Sign 2: Deadline Approaching Tasks */}
                  <NavLink
                    to="/quick-view?tab=deadlines"
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) => {
                      const active = isActive && isQuickViewTab('deadlines');
                      return `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active
                        ? 'bg-orange-50 text-orange-900 font-semibold border border-orange-200 shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                        }`;
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[15px] text-orange-500 shrink-0">
                        schedule
                      </span>
                      <span className="truncate">Deadline Approaching</span>
                    </div>
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
                      {flagCounts.deadlineApproaching}
                    </span>
                  </NavLink>

                  {/* Flag Sign 3: Issue Tokens Not Resolved */}
                  <NavLink
                    to="/quick-view?tab=tokens"
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={({ isActive }) => {
                      const active = isActive && isQuickViewTab('tokens');
                      return `flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${active
                        ? 'bg-red-50 text-red-900 font-semibold border border-red-200 shadow-xs'
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                        }`;
                    }}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="material-symbols-outlined text-[15px] text-error shrink-0">
                        report_problem
                      </span>
                      <span className="truncate">Issue Tokens</span>
                    </div>
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-error-container text-error border border-error/20">
                      {flagCounts.unresolvedTokens} open
                    </span>
                  </NavLink>
                </div>
              )}
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
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
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
                      ? 'bg-primary text-on-primary font-semibold shadow-xs'
                      : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                    }`
                  }
                >
                  <div className="flex items-center gap-space-sm truncate">
                    <span className="material-symbols-outlined text-[18px]">payments</span>
                    <span className="truncate">Payslip / Wage Management</span>
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
                    ? 'bg-primary text-on-primary font-semibold shadow-xs'
                    : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
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

            {/* Quick Role Switcher Button */}
            <div className="flex items-center justify-between pt-1 border-t border-outline-variant/20 text-[11px]">
              <span className="text-secondary font-medium">Active Mode:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => switchRole('Admin')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${currentUser.role === 'Admin'
                    ? 'bg-primary text-on-primary shadow-2xs'
                    : 'text-secondary hover:text-on-surface'
                    }`}
                >
                  Admin
                </button>
                <span className="text-outline-variant">|</span>
                <button
                  type="button"
                  onClick={() => switchRole('User')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${currentUser.role === 'User'
                    ? 'bg-secondary text-on-secondary shadow-2xs'
                    : 'text-secondary hover:text-on-surface'
                    }`}
                >
                  User
                </button>
              </div>
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
