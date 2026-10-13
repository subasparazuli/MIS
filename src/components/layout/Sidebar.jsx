import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: 'dashboard' },
    { path: '/clients', label: 'Clients', icon: 'business_center' },
    { path: '/client-360', label: 'Client 360', icon: 'domain_verification' },
    { path: '/workflows', label: 'Workflows', icon: 'view_kanban' },
    { path: '/billing-and-wip', label: 'Billing & WIP', icon: 'receipt_long' },
  ];

  const secondaryNav = [
    { path: '#documents', label: 'Firm Documents', icon: 'folder_shared' },
    { path: '#settings', label: 'Settings', icon: 'settings' },
  ];

  const isCurrent = (path) => {
    if (path === '/') return location.pathname === '/' || location.pathname === '/overview';
    return location.pathname.startsWith(path);
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
        className={`fixed left-0 top-0 h-full w-64 bg-surface-container-low shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50 flex flex-col justify-between transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo Brand Header */}
          <div className="h-16 px-space-lg flex items-center justify-between bg-surface-container-low border-b border-outline-variant/20">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-on-primary font-bold shadow-sm">
                <span className="material-symbols-outlined text-[20px]">account_balance</span>
              </div>
              <div className="flex flex-col min-w-0 leading-tight">
                <span className="font-headline-sm text-headline-sm text-on-surface tracking-tight truncate font-bold">
                  LedgerPoint
                </span>
                <span className="font-caption text-caption text-secondary uppercase tracking-wider truncate">
                  CPA &amp; Advisory
                </span>
              </div>
            </div>
            <button
              className="lg:hidden p-1 text-secondary hover:text-on-surface"
              onClick={() => setMobileOpen(false)}
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>

          <div className="px-space-md py-space-sm">
            <div className="h-[1px] w-full bg-outline-variant/30" />
          </div>

          {/* Primary Navigation */}
          <nav className="flex flex-col gap-space-xs px-space-sm py-space-xs">
            {navItems.map((item) => {
              const active = isCurrent(item.path);
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-space-sm px-space-md py-space-sm rounded-lg transition-colors ${
                    active
                      ? 'bg-primary-container text-on-primary font-semibold shadow-[0_1px_2px_rgba(0,0,0,0.05)]'
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="font-label-md text-label-md">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="px-space-md py-space-sm">
            <div className="h-[1px] w-full bg-outline-variant/30" />
          </div>

          {/* Tax Season Progress Widget */}
          <div className="px-space-md py-space-xs">
            <div className="p-space-md bg-surface-container-lowest rounded-xl shadow-[0_1px_2px_rgba(15,23,42,0.05)]">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-sm text-label-sm font-semibold uppercase text-secondary tracking-wider">
                  Tax Season 2024
                </span>
                <span className="font-metric-md text-metric-md text-primary font-bold">84%</span>
              </div>
              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-space-xs">
                <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '84%' }} />
              </div>
              <div className="flex items-center justify-between text-secondary">
                <span className="font-caption text-caption">Filed &amp; Accepted</span>
                <span className="font-caption text-caption font-semibold text-on-surface">16d to Deadline</span>
              </div>
            </div>
          </div>

          {/* Secondary Navigation */}
          <nav className="flex flex-col gap-space-xs px-space-sm py-space-xs">
            {secondaryNav.map((item) => (
              <a
                key={item.label}
                href={item.path}
                className="flex items-center gap-space-sm px-space-md py-space-sm rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="font-label-md text-label-md">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        {/* Bottom IRS Live Status Card */}
        <div className="p-space-md bg-surface-container-low border-t border-outline-variant/20">
          <div className="p-space-sm rounded-lg bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-[18px] text-primary">verified_user</span>
              <div className="flex flex-col min-w-0">
                <span className="font-caption text-caption text-on-surface font-semibold truncate">
                  IRS e-File Status
                </span>
                <span className="font-caption text-caption text-secondary">Connected &amp; Active</span>
              </div>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
        </div>
      </aside>
    </>
  );
}
