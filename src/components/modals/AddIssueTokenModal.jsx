import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddIssueTokenModal() {
  const { activeModal, setActiveModal, addIssueToken, clients, services } = useApp();

  const [clientId, setClientId] = useState('CL-101');
  const [serviceId, setServiceId] = useState('bas');
  const [title, setTitle] = useState('');
  const [severity, setSeverity] = useState('Warning'); // 'Critical' | 'Warning' | 'Info'
  const [category, setCategory] = useState('Reconciliation Variance');
  const [affectedParty, setAffectedParty] = useState('');
  const [description, setDescription] = useState('');
  const [resolutionAction, setResolutionAction] = useState('');

  if (activeModal !== 'addIssueToken') return null;

  const targetClient = clients.find((c) => c.id === clientId) || clients[0];
  const targetService = services.find((s) => s.id === serviceId) || services[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    addIssueToken({
      title: title.trim(),
      clientId: targetClient.id,
      clientName: targetClient.name,
      serviceId: targetService.id,
      serviceName: targetService.name,
      severity,
      category,
      affectedParty: affectedParty.trim() || targetClient.name,
      description: description.trim(),
      resolutionAction: resolutionAction.trim() || 'Review ledger documentation and adjust entry in practice ledger.'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-error/10 text-error flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">add_alert</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface">Raise New Compliance Issue Token</h2>
              <span className="text-[11px] text-secondary">Logged directly into Quick View Flag Signs</span>
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-3 overflow-y-auto text-xs">
          <div>
            <label className="font-bold text-on-surface block mb-1">Issue Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Bank feed variance on GST account, TFN mismatch error"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">Client Entity</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Affected Service</label>
              <select
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold focus:outline-none"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">Severity Level</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface focus:outline-none"
              >
                <option value="Critical">Critical (Immediate lodgement halt)</option>
                <option value="Warning">Warning (Discrepancy / review)</option>
                <option value="Info">Info (Audit trail note)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Affected Account / Employee</label>
              <input
                type="text"
                value={affectedParty}
                onChange={(e) => setAffectedParty(e.target.value)}
                placeholder="e.g. Employee #42, AMEX Feed #4190"
                className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-on-surface block mb-1">Issue Description &amp; Findings *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the discrepancy, source documentation, or error code returned by ATO / Super clearing house..."
              className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="font-bold text-on-surface block mb-1">Recommended Remediation Action</label>
            <input
              type="text"
              value={resolutionAction}
              onChange={(e) => setResolutionAction(e.target.value)}
              placeholder="e.g. Contact client for valid ABN or re-code expense to GST-Free"
              className="w-full h-9 px-3 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
            />
          </div>

          {/* Action Buttons */}
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
              className="h-9 px-4 rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-bold shadow-2xs transition"
            >
              Log Issue Token to Quick View
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
