import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function CreatePayRunModal() {
  const { activeModal, setActiveModal, createPayRun, clients } = useApp();

  const [clientId, setClientId] = useState('CL-101');
  const [payPeriod, setPayPeriod] = useState('22 Apr 2024 – 28 Apr 2024');
  const [frequency, setFrequency] = useState('Fortnightly');
  const [payDate, setPayDate] = useState('2024-04-29');
  const [employeesCount, setEmployeesCount] = useState(18);
  const [totalGrossWages, setTotalGrossWages] = useState(52000);
  const [totalPaygWithheld, setTotalPaygWithheld] = useState(13500);

  if (activeModal !== 'createPayRun') return null;

  const targetClient = clients.find((c) => c.id === clientId) || clients[0];
  const gross = parseFloat(totalGrossWages) || 0;
  const payg = parseFloat(totalPaygWithheld) || 0;
  const superGuarantee = Math.round(gross * 0.115 * 100) / 100; // 11.5%
  const netPay = Math.max(0, gross - payg);

  const handleSubmit = (e) => {
    e.preventDefault();
    createPayRun({
      clientId: targetClient.id,
      clientName: targetClient.name,
      payPeriod,
      frequency,
      payDate,
      employeesCount: parseInt(employeesCount, 10) || 1,
      totalGrossWages: gross,
      totalPaygWithheld: payg,
      totalSuperGuarantee: superGuarantee,
      totalNetPay: netPay
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface">Initiate New Pay Run (STP Phase 2)</h2>
              <span className="text-[11px] text-secondary">Fair Work &amp; ATO STP event staging</span>
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
            <label className="font-bold text-on-surface block mb-1">Employer Client Entity</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.abn})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">Pay Period Description</label>
              <input
                type="text"
                required
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Pay Cycle Frequency</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold focus:outline-none"
              >
                <option value="Weekly">Weekly</option>
                <option value="Fortnightly">Fortnightly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">EFT Payment Date</label>
              <input
                type="date"
                required
                value={payDate}
                onChange={(e) => setPayDate(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Number of Employees</label>
              <input
                type="number"
                min="1"
                required
                value={employeesCount}
                onChange={(e) => setEmployeesCount(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">Total Gross Earnings ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={totalGrossWages}
                onChange={(e) => setTotalGrossWages(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-on-surface focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">PAYG Tax Withheld ($)</label>
              <input
                type="number"
                step="0.01"
                required
                value={totalPaygWithheld}
                onChange={(e) => setTotalPaygWithheld(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-bold text-error focus:outline-none"
              />
            </div>
          </div>

          {/* Automatic Calculation Preview */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-secondary">Super Guarantee Accrual (11.5%):</span>
              <span className="font-bold text-emerald-700 font-mono">${superGuarantee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-outline-variant/20">
              <span className="text-secondary font-semibold">Net Employee Disbursement:</span>
              <span className="font-bold text-on-surface text-sm font-mono">${netPay.toFixed(2)}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-end gap-2">
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
              Create Pay Run &amp; Draft Slips
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
