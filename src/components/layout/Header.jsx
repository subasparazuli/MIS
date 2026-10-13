import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function Header({ setMobileOpen }) {
  const { setActiveModal, period, setPeriod, alerts, globalSearch, setGlobalSearch } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);

  const periods = ["FY 2024", "Q2 2024", "Q1 2024", "FY 2023"];

  return (
    <header className="fixed top-0 left-0 lg:left-64 right-0 h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-40 flex items-center justify-between px-gutter-desktop transition-all">
      {/* Left Search and Mobile Toggle */}
      <div className="flex items-center gap-space-md flex-1 max-w-xl">
        <button
          className="lg:hidden p-1.5 text-secondary hover:text-on-surface rounded-lg hover:bg-surface-container"
          onClick={() => setMobileOpen(true)}
        >
          <span className="material-symbols-outlined text-[24px]">menu</span>
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
            placeholder="Search clients, EIN, returns, or invoices... Cmd+K"
            className="w-full h-9 pl-9 pr- space-lg bg-surface-container-lowest rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-1 focus:ring-primary shadow-[0_1px_2px_rgba(15,23,42,0.05)] border border-outline-variant/30"
          />
          <kbd className="hidden sm:inline-block absolute right-2.5 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-secondary bg-surface-container rounded border border-outline-variant/40">
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-space-md">
        {/* New Client / Engagement Button */}
        <button
          type="button"
          onClick={() => setActiveModal('addClient')}
          className="hidden sm:flex h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md uppercase tracking-wider items-center gap-space-xs shadow-[0_1px_2px_rgba(0,0,0,0.05)] transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>New Client / Engagement</span>
        </button>

        <div className="hidden sm:block h-6 w-[1px] bg-outline-variant/40 mx-space-xs" />

        {/* Period Selector Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowPeriodMenu(!showPeriodMenu);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="flex items-center gap-space-xs bg-surface-container-lowest hover:bg-surface-container-low px-space-sm py-1 rounded-lg shadow-[0_1px_2px_rgba(15,23,42,0.05)] border border-outline-variant/30 transition-colors"
          >
            <span className="font-caption text-caption text-secondary uppercase font-semibold">Period:</span>
            <span className="font-label-sm text-label-sm font-semibold text-on-surface">{period}</span>
            <span className="material-symbols-outlined text-[16px] text-secondary">expand_more</span>
          </button>

          {showPeriodMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-surface-container-lowest rounded-xl shadow-lg border border-outline-variant/40 py-1 z-50">
              {periods.map(p => (
                <button
                  key={p}
                  onClick={() => {
                    setPeriod(p);
                    setShowPeriodMenu(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 font-label-sm text-label-sm hover:bg-surface-container-high transition ${
                    period === p ? 'text-primary font-bold bg-surface-container-low' : 'text-on-surface'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon & Popover */}
        <div className="relative flex items-center">
          <button
            aria-label="Notifications"
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
              setShowPeriodMenu(false);
            }}
            className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
          </button>
          <span className="absolute top-1 right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-error text-on-error font-caption text-[10px] font-bold leading-none pointer-events-none">
            3
          </span>

          {showNotifications && (
            <div className="absolute right-0 top-11 w-80 sm:w-96 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50">
              <div className="px-space-md py-2 border-b border-outline-variant/30 flex items-center justify-between">
                <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">Notifications</span>
                <span className="font-caption text-caption px-2 py-0.5 rounded bg-error-container text-error font-bold">
                  3 Critical Action Items
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-outline-variant/20">
                {alerts.map(alert => (
                  <div key={alert.id} className="p-space-md hover:bg-surface-container-low transition flex gap-3">
                    <span className={`material-symbols-outlined text-[20px] ${
                      alert.severity === 'critical' ? 'text-error' : alert.severity === 'warning' ? 'text-amber-600' : 'text-primary'
                    }`}>
                      {alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'warning' : 'info'}
                    </span>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm font-semibold text-on-surface truncate">
                        {alert.title}
                      </span>
                      <span className="font-caption text-caption text-secondary line-clamp-2">
                        {alert.desc}
                      </span>
                      <span className="font-caption text-[11px] text-outline mt-1">{alert.time} • {alert.client}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-2 border-t border-outline-variant/30 text-center">
                <button
                  onClick={() => setShowNotifications(false)}
                  className="font-label-sm text-primary hover:underline"
                >
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="hidden sm:block h-6 w-[1px] bg-outline-variant/40 mx-space-xs" />

        {/* User Profile Info & Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
              setShowPeriodMenu(false);
            }}
            className="flex items-center gap-space-sm pl-space-xs rounded-lg hover:bg-surface-container-high/50 p-1 transition"
          >
            <img
              alt="Elena Vance profile"
              className="w-8 h-8 rounded-full object-cover ring-1 ring-outline-variant/30"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDM-9xcIPNgyot7olyfq9LPtH8qDEgbqi-eTkNvImZ7jgB4rGBVatMIoVqWFdU_fB4X6Lv4wrRf99Fld5IrzwFaT3WPyXXCSoYQke0aVWFi6AZBpTn5rr0jAEz-3EMXe_NtcBm_55m7474JTsImAwfRKr96sFpB8L64sJIhFzZ4zZT5YpAUJfRTb0_q4dl-XXc502pW8vYn4FC6jvwq9tI29I5wkmvUaI8TPzkh2779bctme6X08GB6IQ"
            />
            <div className="hidden lg:flex flex-col text-left leading-tight">
              <span className="font-label-md text-label-md font-semibold text-on-surface truncate">
                Elena Vance, CPA
              </span>
              <span className="font-caption text-caption text-primary font-semibold uppercase tracking-wider truncate">
                Managing Partner
              </span>
            </div>
            <span className="material-symbols-outlined text-[18px] text-secondary">expand_more</span>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/40 py-2 z-50">
              <div className="px-4 py-2 border-b border-outline-variant/30">
                <p className="font-label-md text-label-md font-bold text-on-surface">Elena Vance, CPA</p>
                <p className="font-caption text-caption text-secondary">elena.vance@ledgerpoint.com</p>
              </div>
              <a href="#profile" className="flex items-center gap-2 px-4 py-2 font-body-sm text-on-surface hover:bg-surface-container-high transition">
                <span className="material-symbols-outlined text-[18px] text-secondary">badge</span>
                Partner Credentials
              </a>
              <a href="#settings" className="flex items-center gap-2 px-4 py-2 font-body-sm text-on-surface hover:bg-surface-container-high transition">
                <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
                Firm Preferences
              </a>
              <div className="border-t border-outline-variant/30 my-1" />
              <button
                onClick={() => setShowProfileMenu(false)}
                className="w-full text-left flex items-center gap-2 px-4 py-2 font-body-sm text-error hover:bg-error-container/20 transition"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
