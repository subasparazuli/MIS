import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { availableServiceIcons } from '../../data/mockData';

export default function AddServiceModal() {
  const { activeModal, setActiveModal, addServiceType } = useApp();

  const [name, setName] = useState('');
  const [shortName, setShortName] = useState('');
  const [category, setCategory] = useState('Tax & Advisory');
  const [frequency, setFrequency] = useState('Quarterly');
  const [icon, setIcon] = useState('corporate_fare');
  const [description, setDescription] = useState('');

  if (activeModal !== 'addService') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    addServiceType({
      name: name.trim(),
      shortName: shortName.trim() || name.trim(),
      category,
      frequency,
      icon,
      description: description.trim() || `Comprehensive ${name.trim()} engagement and compliance workflow.`
    });

    setName('');
    setShortName('');
    setDescription('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_circle</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface">Add New Service Type</h2>
              <span className="text-[11px] text-secondary">Expands practice offerings in sidebar</span>
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-3 overflow-y-auto">
          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. ASIC & Company Secretarial, FBT Compliance, Bookkeeping"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Short Label
              </label>
              <input
                type="text"
                value={shortName}
                onChange={(e) => setShortName(e.target.value)}
                placeholder="e.g. ASIC Compliance"
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Tax & Advisory">Tax &amp; Advisory</option>
                <option value="Corporate Governance">Corporate Governance</option>
                <option value="Bookkeeping & Ledger">Bookkeeping &amp; Ledger</option>
                <option value="Compliance & Audit">Compliance &amp; Audit</option>
                <option value="Specialized Consulting">Specialized Consulting</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Billing / Lodgement Cycle
              </label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Quarterly">Quarterly</option>
                <option value="Monthly">Monthly</option>
                <option value="Annual">Annual</option>
                <option value="Ad-Hoc / On-Demand">Ad-Hoc / On-Demand</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-on-surface block mb-1">
                Choose Icon
              </label>
              <div className="flex items-center gap-1.5 h-9 overflow-x-auto p-1 bg-surface-container-low rounded-lg border border-outline-variant/30">
                {availableServiceIcons.map((item) => (
                  <button
                    key={item.icon}
                    type="button"
                    title={item.label}
                    onClick={() => setIcon(item.icon)}
                    className={`p-1 rounded hover:bg-surface-container transition shrink-0 ${
                      icon === item.icon ? 'bg-primary text-on-primary' : 'text-secondary'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-on-surface block mb-1">
              Description &amp; Scope of Service
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Outline statutory requirements, deliverables, and filing expectations..."
              className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="p-2.5 rounded-lg bg-surface-container-low text-xs text-secondary flex items-start gap-2">
            <span className="material-symbols-outlined text-[16px] text-primary shrink-0 mt-0.5">info</span>
            <span>
              This service will appear under the <strong>Services</strong> section in the sidebar with a direct page route.
            </span>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="h-8 px-3 rounded-lg text-xs font-semibold text-secondary hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-8 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs transition"
            >
              Add Service to Sidebar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
