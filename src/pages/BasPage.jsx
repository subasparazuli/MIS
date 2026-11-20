import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function BasPage() {
  const navigate = useNavigate();
  const {
    basRecords,
    setSelectedBas,
    lodgeBasWithAto,
    setActiveModal,
    setSelectedClientId,
    currentUser,
    showToast
  } = useApp();

  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  // Summary Metrics across all BAS records
  const totalSales = basRecords.reduce((acc, b) => acc + (b.g1_totalSales || 0), 0);
  const totalGstSales1A = basRecords.reduce((acc, b) => acc + (b.label1A_gstOnSales || 0), 0);
  const totalGstPurchases1B = basRecords.reduce((acc, b) => acc + (b.label1B_gstOnPurchases || 0), 0);
  const netGstPayableTotal = basRecords.reduce((acc, b) => acc + (b.netGstPayable || 0), 0);
  const totalPaygWithheldW2 = basRecords.reduce((acc, b) => acc + (b.labelW2_paygWithheld || 0), 0);

  const filteredRecords = basRecords.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        b.clientName.toLowerCase().includes(q) ||
        b.abn.includes(q) ||
        b.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (periodFilter !== 'all' && !b.quarter.includes(periodFilter)) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    return true;
  });

  const handleOpenCalculation = (bas) => {
    setSelectedBas(bas);
    setActiveModal('prepareBas');
  };

  const handleInspectClient = (clientId) => {
    setSelectedClientId(clientId);
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Header */}
      <div className="py-space-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20 mb-space-md">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-[16px] text-primary">account_balance</span>
            <span>Australian Taxation Office (ATO) Compliance Hub</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-1 flex items-center gap-2">
            Business Activity Statement (BAS)
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              ATO SBR v3
            </span>
          </h1>
          <p className="font-body-md text-sm text-secondary mt-0.5">
            Quarterly and monthly GST (1A &amp; 1B), PAYG Withholding (W2), and Direct Tax Agent lodgements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSelectedBas(null);
              setActiveModal('prepareBas');
            }}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">post_add</span>
            <span>Prepare New BAS</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Exporting BAS lodgement register to ATO SBR XML/JSON...')}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
            <span>Export Register</span>
          </button>
        </div>
      </div>

      {/* ATO Aggregate Labels Metric Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-space-sm mb-space-lg">
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">G1 Total Sales</span>
          <span className="text-xl font-bold text-on-surface font-headline-lg">
            ${totalSales.toLocaleString()}
          </span>
          <span className="text-[10px] text-secondary">Subject to GST check</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">1A GST on Sales</span>
          <span className="text-xl font-bold text-primary font-headline-lg">
            ${totalGstSales1A.toLocaleString()}
          </span>
          <span className="text-[10px] text-primary">Gross Tax Collected</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">1B GST on Purchases</span>
          <span className="text-xl font-bold text-emerald-700 font-headline-lg">
            ${totalGstPurchases1B.toLocaleString()}
          </span>
          <span className="text-[10px] text-emerald-600">Input Tax Credits</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Net GST Payable</span>
          <span className="text-xl font-bold text-orange-700 font-headline-lg">
            ${netGstPayableTotal.toLocaleString()}
          </span>
          <span className="text-[10px] text-orange-700 font-semibold">1A minus 1B</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-bold text-secondary uppercase block">W2 PAYG Withholding</span>
          <span className="text-xl font-bold text-on-surface font-headline-lg">
            ${totalPaygWithheldW2.toLocaleString()}
          </span>
          <span className="text-[10px] text-secondary">Salaries &amp; wages tax</span>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs mb-space-md">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client entity, ABN, or BAS ID..."
            className="w-full text-xs bg-transparent focus:outline-none placeholder:text-outline text-on-surface"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Periods</option>
            <option value="Q3">Q3 FY24 (Jan - Mar)</option>
            <option value="Mar">March 2024 (Monthly)</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="Draft">Draft</option>
            <option value="Ready for Review">Ready for Review</option>
            <option value="Awaiting Client Signature">Awaiting Signature</option>
            <option value="Lodged">Lodged to ATO</option>
          </select>
        </div>
      </div>

      {/* BAS Statements Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                <th className="py-2.5 px-3">Entity &amp; ABN</th>
                <th className="py-2.5 px-3">BAS Period</th>
                <th className="py-2.5 px-3 text-right">1A (GST Sales)</th>
                <th className="py-2.5 px-3 text-right">1B (GST Paid)</th>
                <th className="py-2.5 px-3 text-right">W2 (PAYG-W)</th>
                <th className="py-2.5 px-3 text-right">Total Payable</th>
                <th className="py-2.5 px-3">Due Date</th>
                <th className="py-2.5 px-3">Lodgement Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 font-normal">
              {filteredRecords.map((bas) => {
                const isLodged = bas.status === 'Lodged';
                return (
                  <tr key={bas.id} className="hover:bg-surface-container-low/50 transition">
                    <td className="py-3 px-3">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleInspectClient(bas.clientId)}
                          className="font-semibold text-primary hover:underline text-left text-xs"
                        >
                          {bas.clientName}
                        </button>
                        <span className="text-[11px] text-secondary font-mono">ABN: {bas.abn}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-medium text-on-surface">{bas.period}</span>
                      <span className="text-[11px] text-secondary block">{bas.method} Accounting</span>
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-on-surface">
                      ${bas.label1A_gstOnSales.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-emerald-700">
                      ${bas.label1B_gstOnPurchases.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right font-medium text-on-surface">
                      ${bas.labelW2_paygWithheld.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-bold text-on-surface text-sm">
                        ${bas.totalPayable.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span className="text-secondary">{bas.dueDate}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${
                          isLodged
                            ? 'bg-emerald-100 text-emerald-800'
                            : bas.status === 'Ready for Review'
                            ? 'bg-blue-100 text-blue-800'
                            : bas.status === 'Awaiting Client Signature'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {isLodged && <span className="material-symbols-outlined text-[13px]">verified</span>}
                        {bas.status}
                      </span>
                      {bas.atoReceiptId && (
                        <span className="text-[10px] text-secondary font-mono block mt-0.5 truncate max-w-[140px]">
                          {bas.atoReceiptId}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenCalculation(bas)}
                          className="h-7 px-2.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition border border-outline-variant/30"
                          title="View detailed calculation sheet"
                        >
                          View Calc
                        </button>

                        {!isLodged ? (
                          <button
                            type="button"
                            onClick={() => lodgeBasWithAto(bas.id)}
                            className="h-7 px-2.5 rounded bg-primary hover:bg-primary-container text-on-primary text-[11px] font-bold flex items-center gap-1 transition shadow-2xs"
                            title={
                              currentUser.role === 'Admin'
                                ? 'Authorize & Lodge BAS to ATO'
                                : 'Admin approval required to lodge'
                            }
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                            <span>Lodge to ATO</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 text-[11px] font-bold px-2 py-1">
                            Lodged
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
