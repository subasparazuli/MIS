import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function LogTimeModal() {
  const { activeModal, setActiveModal, clients, addWipEntry } = useApp();

  const [clientName, setClientName] = useState(clients[0]?.name || "Vanguard Logistics Group, Inc.");
  const [engagement, setEngagement] = useState("FY23 Apportionment & Corporate Advisory");
  const [staff, setStaff] = useState("Elena Vance, CPA");
  const [hours, setHours] = useState(1.75);
  const [date, setDate] = useState("2024-04-24");
  const [notes, setNotes] = useState("");

  if (activeModal !== 'logTime') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    addWipEntry({
      clientName,
      engagement,
      staff,
      hours,
      date,
      notes
    });
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">more_time</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Log Billable Time</h3>
          </div>
          <button
            onClick={() => setActiveModal(null)}
            className="w-8 h-8 rounded-lg hover:bg-surface-container flex items-center justify-center text-secondary"
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-secondary">
          Instantly record unbilled advisory or compliance time to increase practice realization.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-sm">
          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Client &amp; Engagement
            </label>
            <select
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {clients.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Service Activity
            </label>
            <input
              type="text"
              value={engagement}
              onChange={(e) => setEngagement(e.target.value)}
              className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Time (Hours)
              </label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-mono text-right font-bold text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Staff / Partner
            </label>
            <select
              value={staff}
              onChange={(e) => setStaff(e.target.value)}
              className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Elena Vance, CPA">Elena Vance, CPA (Billing Rate: $450/hr)</option>
              <option value="Marcus Reed">Marcus Reed (Billing Rate: $425/hr)</option>
              <option value="David Miller">David Miller (Billing Rate: $275/hr)</option>
              <option value="Rachel Kim">Rachel Kim (Billing Rate: $195/hr)</option>
            </select>
          </div>

          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Audit Notes
            </label>
            <textarea
              rows={3}
              placeholder="Detail the work performed for client audit trail..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-surface-container-low rounded-lg p-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-space-sm mt-space-xs pt-space-xs border-t border-outline-variant/20">
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
              Save &amp; Accumulate WIP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
