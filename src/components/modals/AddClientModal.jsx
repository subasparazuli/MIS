import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddClientModal() {
  const { activeModal, setActiveModal, addClient } = useApp();

  const [formData, setFormData] = useState({
    name: '',
    ein: '',
    entityType: 'S-Corp',
    state: 'DE',
    city: '',
    industry: '',
    leadPartner: 'Elena Vance, CPA',
    retainerTier: 'Tier 2 ($36k/yr)',
    annualRetainer: 36000,
  });

  if (activeModal !== 'addClient') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;
    addClient(formData);
    setActiveModal(null);
    setFormData({
      name: '',
      ein: '',
      entityType: 'S-Corp',
      state: 'DE',
      city: '',
      industry: '',
      leadPartner: 'Elena Vance, CPA',
      retainerTier: 'Tier 2 ($36k/yr)',
      annualRetainer: 36000,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-lg w-full p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">business_center</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Add New Client Entity
            </h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Legal Business Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Logistics Group, Inc."
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Employer ID Number (EIN)
              </label>
              <input
                type="text"
                placeholder="XX-XXXXXXX"
                value={formData.ein}
                onChange={(e) => setFormData({ ...formData, ein: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Entity Structure
              </label>
              <select
                value={formData.entityType}
                onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="S-Corp">S-Corporation (1120-S)</option>
                <option value="Partnership">Partnership / LP (1065)</option>
                <option value="C-Corp">C-Corporation (1120)</option>
                <option value="LLC">Single-Member LLC</option>
                <option value="Individual">Individual High-Net-Worth (1040)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Domicile State / HQ City
              </label>
              <input
                type="text"
                placeholder="Wilmington, DE"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Industry Sector
              </label>
              <input
                type="text"
                placeholder="Logistics, Tech, Healthcare..."
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Assigned Lead Partner
              </label>
              <select
                value={formData.leadPartner}
                onChange={(e) => setFormData({ ...formData, leadPartner: e.target.value })}
                className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Elena Vance, CPA">Elena Vance, CPA (Managing)</option>
                <option value="Marcus Reed">Marcus Reed (Tax Partner)</option>
                <option value="Sarah Jenkins">Sarah Jenkins (Audit Lead)</option>
                <option value="David Miller">David Miller (Senior Associate)</option>
              </select>
            </div>

            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Retainer Tier / Annual Value
              </label>
              <select
                value={formData.retainerTier}
                onChange={(e) => {
                  const val = e.target.value;
                  const amt = val.includes('65k') ? 65000 : val.includes('48k') ? 48000 : val.includes('36k') ? 36000 : 18000;
                  setFormData({ ...formData, retainerTier: val, annualRetainer: amt });
                }}
                className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Tier 1 ($65k/yr)">Tier 1 — Enterprise ($65,000/yr)</option>
                <option value="Tier 1 ($48k/yr)">Tier 1 — Corporate ($48,000/yr)</option>
                <option value="Tier 2 ($36k/yr)">Tier 2 — Standard ($36,000/yr)</option>
                <option value="Tier 3 ($18k/yr)">Tier 3 — Emerging ($18,000/yr)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-space-sm mt-space-md pt-space-xs border-t border-outline-variant/20">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="h-9 px-space-md rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-space-md rounded-lg bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md uppercase tracking-wider transition shadow-sm"
            >
              Save &amp; Ingest Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
