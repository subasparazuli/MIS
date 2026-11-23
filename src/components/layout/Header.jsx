import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function Header({ setMobileOpen }) {
  const navigate = useNavigate();
  const {
    currentUser,
    switchRole,
    setActiveModal,
    flagCounts,
    totalFlagCount,
    issueTokens,
    notProcessedItems,
    globalSearch,
    setGlobalSearch,
    period,
    setPeriod,
    sidebarVisible,
    toggleSidebar
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const periods = [
    "Q3 FY24 (Jan - Mar)",
    "Q2 FY24 (Oct - Dec)",
    "Q1 FY24 (Jul - Sep)",
    "FY 2024 YTD"
  ];

  return (
    <header className={`fixed top-0 ${sidebarVisible ? 'lg:left-64' : 'lg:left-0'} left-0 right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-desktop transition-all duration-300`}>
      {/* Left Search and Sidebar Toggle */}
      <div className="flex items-center gap-space-sm sm:gap-space-md flex-1 max-w-xl">
        <button
          type="button"
          onClick={() => {
            if (window.innerWidth < 1024) {
              setMobileOpen(true);
            } else {
              toggleSidebar();
            }
          }}
          className="p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface-container transition flex items-center justify-center shrink-0"
          aria-label="Toggle Sidebar"
          title={sidebarVisible ? "Hide Sidebar" : "Show Sidebar"}
        >
          <span className="material-symbols-outlined text-[22px]">
            {sidebarVisible ? 'menu_open' : 'menu'}
          </span>
        </button>

        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-space-md top-1/2 -translate-y-1/2 text-[18px] text-outline pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            onFocus={() => setActiveModal('globalSearch')}
            placeholder="Search clients, ABN, BAS, payslips, or issue tokens... ⌘K"
            className="w-full h-9 pl-9 pr-space-lg bg-surface-container-lowest rounded-lg font-body-sm text-xs text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-xs border border-outline-variant/30"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-secondary bg-surface-container rounded border border-outline-variant/40">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-space-md">
        {/* Quick View Flags Shortcut Pill */}
        <button
          type="button"
          onClick={() => navigate('/quick-view')}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-error-container text-error text-xs font-bold border border-error/20 hover:opacity-90 transition"
        >
          <span className="w-2 h-2 rounded-full bg-error animate-ping" />
          <span>{totalFlagCount} Flag Signs</span>
        </button>

        {/* New Client Button */}
        <button
          type="button"
          onClick={() => setActiveModal('addClient')}
          className="hidden md:flex h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider items-center gap-1.5 shadow-2xs transition"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Client</span>
        </button>

        <div className="hidden sm:block h-6 w-[1px] bg-outline-variant/40 mx-space-xs" />

        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPeriodMenu(!showPeriodMenu);
              setShowNotifications(false);
              setShowRoleMenu(false);
            }}
            className="flex items-center gap-1 bg-surface-container-lowest hover:bg-surface-container-low px-2 sm:px-space-sm py-1 rounded-lg shadow-xs border border-outline-variant/30 transition text-xs"
          >
            <span className="hidden sm:inline font-caption text-secondary uppercase font-semibold">Period:</span>
            <span className="font-semibold text-on-surface truncate max-w-[120px]">{period}</span>
            <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
          </button>

          {showPeriodMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-1 z-50">
              {periods.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriodMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs hover:bg-surface-container transition ${
                    period === p ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover (populated with Flag Signs) */}
        <div className="relative flex items-center">
          <button
            aria-label="Flag Signs Notifications"
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowRoleMenu(false);
              setShowPeriodMenu(false);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition relative"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {totalFlagCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-error text-on-error font-caption text-[10px] font-bold leading-none">
                {totalFlagCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/40 py-2 z-50">
              <div className="px-space-md py-2 border-b border-outline-variant/30 flex items-center justify-between">
                <span className="font-bold text-xs text-on-surface">Active Flag Signs</span>
                <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-error-container text-error">
                  {totalFlagCount} Action Items
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/15 text-xs">
                {issueTokens.filter(t => t.status !== 'Resolved').map((token) => (
                  <div
                    key={token.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/quick-view?tab=tokens');
                    }}
                    className="p-3 hover:bg-surface-container-low transition cursor-pointer flex gap-2.5"
                  >
                    <span className="material-symbols-outlined text-error text-[18px] shrink-0 mt-0.5">
                      report_problem
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-on-surface truncate">{token.title}</span>
                      <span className="text-secondary text-[11px] line-clamp-1">{token.description}</span>
                      <span className="text-outline text-[10px] mt-1">{token.clientName} • {token.id}</span>
                    </div>
                  </div>
                ))}

                {notProcessedItems.filter(i => i.status !== 'Processed').map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setShowNotifications(false);
                      navigate('/quick-view?tab=not_processed');
                    }}
                    className="p-3 hover:bg-surface-container-low transition cursor-pointer flex gap-2.5"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-on-surface truncate">{item.title}</span>
                      <span className="text-secondary text-[11px]">{item.stage}</span>
                      <span className="text-outline text-[10px] mt-1">{item.clientName} • Due {item.dueDate}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-outline-variant/30 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/quick-view');
                  }}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Go to Quick View Flag Signs &rarr;
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Identity / Role Pill */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifications(false);
              setShowPeriodMenu(false);
            }}
            className="flex items-center gap-2 p-1 pl-2 bg-surface-container-low hover:bg-surface-container rounded-xl border border-outline-variant/30 transition"
          >
            <div className="flex flex-col text-right leading-tight hidden lg:flex">
              <span className="text-xs font-bold text-on-surface truncate">{currentUser.name}</span>
              <span className="text-[10px] text-secondary font-semibold uppercase">{currentUser.role}</span>
            </div>
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-on-primary ${
                currentUser.role === 'Admin' ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              {currentUser.avatar || 'US'}
            </div>
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-outline-variant/20">
                <span className="font-bold text-on-surface block">{currentUser.name}</span>
                <span className="text-[11px] text-secondary">{currentUser.email}</span>
              </div>

              <div className="px-3 py-2 flex items-center justify-between border-b border-outline-variant/20">
                <span className="text-secondary font-medium">Switch Role:</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      switchRole('Admin');
                      setShowRoleMenu(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentUser.role === 'Admin' ? 'bg-primary text-on-primary' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      switchRole('User');
                      setShowRoleMenu(false);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      currentUser.role === 'User' ? 'bg-secondary text-on-secondary' : 'bg-surface-container text-secondary'
                    }`}
                  >
                    User
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowRoleMenu(false);
                  setActiveModal('auth');
                }}
                className="w-full text-left px-3 py-2 text-primary font-semibold hover:bg-surface-container transition flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">manage_accounts</span>
                <span>Open Login / Signup</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
