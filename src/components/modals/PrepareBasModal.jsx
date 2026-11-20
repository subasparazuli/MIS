import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export default function PrepareBasModal() {
  const { activeModal, setActiveModal, selectedBas, addBasRecord, lodgeBasWithAto, clients, currentUser } = useApp();

  const [clientId, setClientId] = useState('CL-101');
  const [period, setPeriod] = useState('Quarter 3 (Jan - Mar 2024)');
  const [quarter, setQuarter] = useState('Q3 FY24');
  const [method, setMethod] = useState('Accruals');
  const [dueDate, setDueDate] = useState('2024-04-28');

  // ATO Labels
  const [g1, setG1] = useState(480000);
  const [g2, setG2] = useState(0);
  const [g3, setG3] = useState(10000);
  const [g10, setG10] = useState(15000);
  const [g11, setG11] = useState(210000);
  const [w1, setW1] = useState(150000);
  const [w2, setW2] = useState(34000);
  const [t1, setT1] = useState(12000);
  const [fuelTax, setFuelTax] = useState(0);

  // Auto populate if selectedBas is provided
  useEffect(() => {
    if (selectedBas) {
      setClientId(selectedBas.clientId);
      setPeriod(selectedBas.period);
      setQuarter(selectedBas.quarter);
      setMethod(selectedBas.method);
      setDueDate(selectedBas.dueDate);
      setG1(selectedBas.g1_totalSales || 0);
      setG2(selectedBas.g2_exportSales || 0);
      setG3(selectedBas.g3_otherGstFree || 0);
      setG10(selectedBas.g10_capitalPurchases || 0);
      setG11(selectedBas.g11_nonCapitalPurchases || 0);
      setW1(selectedBas.labelW1_grossWages || 0);
      setW2(selectedBas.labelW2_paygWithheld || 0);
      setT1(selectedBas.labelT1_paygInstalment || 0);
      setFuelTax(selectedBas.label7D_fuelTaxCredit || 0);
    }
  }, [selectedBas]);

  if (activeModal !== 'prepareBas') return null;

  // Real-time ATO math formulas
  const taxableSales = Math.max(0, g1 - g2 - g3);
  const label1A = Math.round(taxableSales / 11);
  const totalCreditablePurchases = g10 + g11;
  const label1B = Math.round(totalCreditablePurchases / 11);
  const netGst = label1A - label1B;
  const totalPayable = netGst + w2 + t1 - fuelTax;

  const targetClient = clients.find((c) => c.id === clientId) || clients[0];

  const handleSaveDraft = (e) => {
    e.preventDefault();
    addBasRecord({
      clientId: targetClient.id,
      clientName: targetClient.name,
      abn: targetClient.abn,
      period,
      quarter,
      method,
      dueDate,
      g1_totalSales: g1,
      g2_exportSales: g2,
      g3_otherGstFree: g3,
      g10_capitalPurchases: g10,
      g11_nonCapitalPurchases: g11,
      label1A_gstOnSales: label1A,
      label1B_gstOnPurchases: label1B,
      netGstPayable: netGst,
      labelW1_grossWages: w1,
      labelW2_paygWithheld: w2,
      labelT1_paygInstalment: t1,
      label7D_fuelTaxCredit: fuelTax,
      totalPayable,
      status: "Ready for Review"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">calculate</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface">
                {selectedBas ? `BAS Calculation Sheet (${selectedBas.period})` : 'Prepare New Business Activity Statement (BAS)'}
              </h2>
              <span className="text-[11px] text-secondary">ATO Standard Business Reporting (SBR) Form</span>
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
        <form onSubmit={handleSaveDraft} className="p-space-lg flex flex-col gap-4 overflow-y-auto text-xs">
          {/* Entity & Period Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-surface-container-low border border-outline-variant/20">
            <div>
              <label className="font-bold text-on-surface block mb-1">Client Entity</label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={!!selectedBas}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs font-semibold focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-secondary font-mono block mt-0.5">ABN: {targetClient?.abn}</span>
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">BAS Quarter / Period</label>
              <input
                type="text"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs focus:outline-none"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Accounting Method</label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-xs focus:outline-none"
              >
                <option value="Accruals">Accruals (Non-Cash)</option>
                <option value="Cash">Cash Basis</option>
              </select>
            </div>
          </div>

          {/* Section A: Goods and Services Tax (GST) Calculation */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
              <span className="font-bold text-xs uppercase tracking-wider text-primary">
                1. Goods and Services Tax (GST) Labels
              </span>
              <span className="text-[11px] text-secondary">Division 11 &amp; 195-1 ITAA 1997</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  G1 Total Sales ($)
                </label>
                <input
                  type="number"
                  value={g1}
                  onChange={(e) => setG1(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  G2 Export Sales ($)
                </label>
                <input
                  type="number"
                  value={g2}
                  onChange={(e) => setG2(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  G3 Other GST-Free ($)
                </label>
                <input
                  type="number"
                  value={g3}
                  onChange={(e) => setG3(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  G10 Capital Purchases ($)
                </label>
                <input
                  type="number"
                  value={g10}
                  onChange={(e) => setG10(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  G11 Non-Capital Purchases ($)
                </label>
                <input
                  type="number"
                  value={g11}
                  onChange={(e) => setG11(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>
            </div>

            {/* Calculated GST 1A & 1B Display */}
            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase block">1A GST on Sales</span>
                <span className="text-base font-bold text-primary font-mono">${label1A.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase block">1B GST on Purchases</span>
                <span className="text-base font-bold text-emerald-700 font-mono">${label1B.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-secondary uppercase block">Net GST Payable (1A - 1B)</span>
                <span className="text-base font-bold text-orange-700 font-mono">${netGst.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Section B: PAYG Withholding & Income Tax Instalments */}
          <div className="flex flex-col gap-2">
            <span className="font-bold text-xs uppercase tracking-wider text-primary pb-1 border-b border-outline-variant/20">
              2. PAYG Tax Withholding &amp; Instalments
            </span>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  W1 Total Salary/Wages ($)
                </label>
                <input
                  type="number"
                  value={w1}
                  onChange={(e) => setW1(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  W2 Amount Withheld ($)
                </label>
                <input
                  type="number"
                  value={w2}
                  onChange={(e) => setW2(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-secondary block">
                  T1 PAYG Instalment ($)
                </label>
                <input
                  type="number"
                  value={t1}
                  onChange={(e) => setT1(Number(e.target.value))}
                  className="w-full h-8 px-2 rounded bg-surface-container-low border border-outline-variant/30 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Net Settlement Ribbon */}
          <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                Total Settlement Payable to ATO
              </span>
              <span className="text-[10px] text-slate-400">
                Net GST + PAYG Withholding + PAYG Instalment
              </span>
            </div>
            <div className="text-2xl font-bold font-headline-lg font-mono">
              ${totalPayable.toLocaleString()}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between">
            <span className="text-[11px] text-secondary">
              Prepared by: {currentUser.name} ({currentUser.role})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="h-8 px-3 rounded-lg text-xs font-semibold text-secondary"
              >
                Close
              </button>

              <button
                type="submit"
                className="h-8 px-4 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-bold border border-outline-variant/30"
              >
                Save Draft Sheet
              </button>

              {selectedBas && selectedBas.status !== 'Lodged' && (
                <button
                  type="button"
                  onClick={() => {
                    lodgeBasWithAto(selectedBas.id);
                    setActiveModal(null);
                  }}
                  className="h-8 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs transition"
                >
                  Lodge Directly to ATO
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
