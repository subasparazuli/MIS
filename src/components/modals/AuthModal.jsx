import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AuthModal() {
  const { activeModal, setActiveModal, login, signup, currentUser, switchRole, logout } = useApp();

  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [selectedRole, setSelectedRole] = useState('Admin'); // 'Admin' | 'User'

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('elena.vance@apexledger.com.au');
  const [password, setPassword] = useState('••••••••');
  const [title, setTitle] = useState('');
  const [phone, setPhone] = useState('');

  if (activeModal !== 'auth') return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    login(email, selectedRole);
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    signup({
      name: name.trim(),
      email: email.trim(),
      role: selectedRole,
      title: title.trim() || (selectedRole === 'Admin' ? 'Partner / Tax Agent' : 'Staff Accountant'),
      phone: phone.trim()
    });
  };

  const handleQuickLogin = (presetEmail, role) => {
    setEmail(presetEmail);
    setSelectedRole(role);
    login(presetEmail, role);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface">Practice Access &amp; Authentication</h2>
              <span className="text-[11px] text-secondary">Admin &amp; Staff User Roles</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Current Active Status Pill */}
        <div className="p-3 bg-surface-container-low/70 border-b border-outline-variant/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-secondary font-medium">Currently active as:</span>
            <span className="font-bold text-on-surface">{currentUser.name}</span>
          </div>
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
              currentUser.role === 'Admin'
                ? 'bg-primary text-on-primary'
                : 'bg-secondary text-on-secondary'
            }`}
          >
            {currentUser.role} Mode
          </span>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-outline-variant/20 bg-surface-container-low">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
              mode === 'login'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
              mode === 'signup'
                ? 'border-primary text-primary bg-surface-container-lowest'
                : 'border-transparent text-secondary hover:text-on-surface'
            }`}
          >
            Sign Up New Account
          </button>
        </div>

        {/* Content Body */}
        <div className="p-space-lg flex flex-col gap-3">
          {/* Quick Demo Credentials */}
          <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <span className="text-[10px] uppercase font-bold text-secondary block mb-1.5">
              One-Click Quick Login Presets:
            </span>
            <div className="flex flex-col gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('elena.vance@apexledger.com.au', 'Admin')}
                className="w-full text-left p-2 rounded-lg bg-surface-container-lowest hover:bg-primary/10 border border-outline-variant/20 transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-on-surface block">Elena Vance, CA</span>
                  <span className="text-[11px] text-secondary">Managing Director &amp; Registered Tax Agent</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary text-on-primary">
                  ADMIN
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('liam.cooper@apexledger.com.au', 'User')}
                className="w-full text-left p-2 rounded-lg bg-surface-container-lowest hover:bg-secondary/10 border border-outline-variant/20 transition flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-on-surface block">Liam Cooper</span>
                  <span className="text-[11px] text-secondary">Senior Staff Accountant &amp; Payroll Associate</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-secondary text-on-secondary">
                  USER
                </span>
              </button>
            </div>
          </div>

          {/* Role Selection Toggle */}
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1.5">
              Select Role Identity:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('Admin')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                  selectedRole === 'Admin'
                    ? 'border-primary bg-primary/5 text-primary shadow-2xs ring-1 ring-primary'
                    : 'border-outline-variant/30 text-secondary hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">Admin Role</span>
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                </div>
                <span className="text-[10px] leading-tight text-secondary">
                  Full ATO lodgement sign-off &amp; super batch authorization.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('User')}
                className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-0.5 ${
                  selectedRole === 'User'
                    ? 'border-secondary bg-secondary/5 text-secondary shadow-2xs ring-1 ring-secondary'
                    : 'border-outline-variant/30 text-secondary hover:border-outline'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs">User Role</span>
                  <span className="material-symbols-outlined text-[16px]">person</span>
                </div>
                <span className="text-[10px] leading-tight text-secondary">
                  Standard staff view for preparation &amp; drafting.
                </span>
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {mode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2.5 pt-1">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@apexledger.com.au"
                  className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-secondary hover:text-error transition"
                >
                  Logout Session
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs transition"
                >
                  Login as {selectedRole}
                </button>
              </div>
            </form>
          ) : (
            /* SIGNUP FORM */
            <form onSubmit={handleSignupSubmit} className="flex flex-col gap-2.5 pt-1">
              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Kim, CPA"
                  className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-on-surface block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rachel.kim@apexledger.com.au"
                  className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Job Title / Position
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Tax Associate"
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-on-surface block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+61 2 9200 ..."
                    className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="h-8 px-3 rounded-lg text-xs font-semibold text-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs transition"
                >
                  Create {selectedRole} Account
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
