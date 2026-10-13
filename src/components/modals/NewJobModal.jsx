import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function NewJobModal() {
  const { activeModal, setActiveModal, clients, addWorkflowJob } = useApp();

  const [clientName, setClientName] = useState(clients[0]?.name || "Vanguard Logistics Group, Inc.");
  const [formType, setFormType] = useState("Form 1120-S");
  const [leadPartner, setLeadPartner] = useState("Elena Vance, CPA");
  const [dueDate, setDueDate] = useState("Apr 15, 2024");
  const [notes, setNotes] = useState("");

  if (activeModal !== 'newJob') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const initials = leadPartner.includes("Elena") ? "EV" : leadPartner.includes("Marcus") ? "MR" : leadPartner.includes("Sarah") ? "SJ" : "DM";
    addWorkflowJob({
      clientName,
      formType,
      leadPartner,
      leadInitials: initials,
      dueDate,
      notes
    });
    setActiveModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-md w-full p-space-lg flex flex-col gap-space-md border border-outline-variant/30">
        <div className="flex items-center justify-between border-b border-outline-variant/20 pb-space-xs">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-primary text-[24px]">add_task</span>
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">New Tax Return / Job</h3>
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
              Client Entity
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

          <div className="grid grid-cols-2 gap-space-sm">
            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Filing Form
              </label>
              <select
                value={formType}
                onChange={(e) => setFormType(e.target.value)}
                className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Form 1120-S">Form 1120-S (S-Corp)</option>
                <option value="Form 1065">Form 1065 (Partnership)</option>
                <option value="Form 1120">Form 1120 (C-Corp)</option>
                <option value="Form 1040">Form 1040 (HNW Individual)</option>
                <option value="Form 990">Form 990 (Non-Profit)</option>
              </select>
            </div>

            <div>
              <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
                Filing Deadline
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 bg-surface-container-low rounded-lg px-3 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Lead Reviewer / Partner
            </label>
            <select
              value={leadPartner}
              onChange={(e) => setLeadPartner(e.target.value)}
              className="w-full h-9 bg-surface-container-low rounded-lg px-2 font-body-sm text-on-surface border border-outline-variant/30 focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="Elena Vance, CPA">Elena Vance, CPA</option>
              <option value="Marcus Reed">Marcus Reed</option>
              <option value="Sarah Jenkins">Sarah Jenkins</option>
              <option value="David Miller">David Miller</option>
            </select>
          </div>

          <div>
            <label className="block font-caption text-caption uppercase text-secondary font-bold mb-1">
              Engagement Scope &amp; Notes
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Schedule K-1 synthesis for 12 partners, state apportionment..."
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
              Initialize Job in Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
