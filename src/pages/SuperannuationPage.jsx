import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function SuperannuationPage() {
  const navigate = useNavigate();
  const {
    superBatches,
    superAllocations,
    authorizeSuperBatch,
    submitSuperBatch,
    setSelectedClientId,
    currentUser,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'allocations'
  const [search, setSearch] = useState('');

  const totalSuperPayable = superBatches.reduce((acc, b) => acc + (b.totalAmount || 0), 0);
  const totalEmployeesCovered = superAllocations.length;

  const filteredAllocations = superAllocations.filter((sa) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        sa.employeeName.toLowerCase().includes(q) ||
        sa.clientName.toLowerCase().includes(q) ||
        sa.superFundName.toLowerCase().includes(q) ||
        sa.usi.toLowerCase().includes(q)
      );
    }
    return true;
  });

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
            <span className="material-symbols-outlined text-[16px] text-primary">savings</span>
            <span>Superannuation Guarantee (SG) &amp; Clearing House Gateway</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-1 flex items-center gap-2">
            Superannuation Compliance
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              SG Rate: 11.5%
            </span>
          </h1>
          <p className="font-body-md text-sm text-secondary mt-0.5">
            Quarterly Super Guarantee contributions, APRA regulated fund validation, and Small Business Superannuation Clearing House (SBSCH) batch execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => showToast('Opening SuperStream Clearing House Export wizard...')}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
            <span>Dispatch SuperStream Batch</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Checking APRA Fund USI registry for validity across all employee nominations...')}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">verified_user</span>
            <span>Validate All USIs</span>
          </button>
        </div>
      </div>

      {/* Aggregate Superannuation Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm mb-space-lg">
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Total SG Contributions</span>
          <span className="text-xl font-bold text-on-surface font-headline-lg">
            ${totalSuperPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-secondary">Across all active client entities</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Statutory Due Date</span>
          <span className="text-xl font-bold text-orange-700 font-headline-lg">
            28 April 2024
          </span>
          <span className="text-[10px] text-orange-700 font-semibold">4 days to cutoff (Quarter 3)</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Clearing House Batches</span>
          <span className="text-xl font-bold text-primary font-headline-lg">
            {superBatches.length} Batches
          </span>
          <span className="text-[10px] text-primary">SBSCH &amp; Beam integrated</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Compliance Risk</span>
          <span className="text-xl font-bold text-error font-headline-lg">
            1 USI Error Flagged
          </span>
          <span className="text-[10px] text-error font-semibold">TKN-1049 (Hostplus invalid USI)</span>
        </div>
      </div>

      {/* Tab Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs mb-space-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('batches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'batches'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-secondary hover:text-on-surface bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">folder_special</span>
            <span>Clearing House Batches ({superBatches.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('allocations')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'allocations'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-secondary hover:text-on-surface bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">groups</span>
            <span>Employee Fund Allocations ({superAllocations.length})</span>
          </button>
        </div>

        <div className="flex flex-1 sm:max-w-xs items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, fund, USI, or client..."
            className="w-full text-xs bg-transparent focus:outline-none placeholder:text-outline text-on-surface"
          />
        </div>
      </div>

      {/* TAB 1: CLEARING HOUSE BATCHES */}
      {activeTab === 'batches' && (
        <div className="flex flex-col gap-space-md">
          {superBatches.map((batch) => {
            const isAuthorized = batch.status === 'Processing' || batch.status === 'Reconciled';
            const isReconciled = batch.status === 'Reconciled';
            return (
              <div
                key={batch.id}
                className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col gap-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                      {batch.id}
                    </span>
                    <h3 className="font-bold text-sm text-on-surface">{batch.batchName}</h3>
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      isReconciled
                        ? 'bg-emerald-100 text-emerald-800'
                        : batch.status === 'Processing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}
                  >
                    {batch.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-space-sm text-xs">
                  <div>
                    <span className="text-secondary block">Clearing House Gateway:</span>
                    <span className="font-semibold text-on-surface">{batch.clearingHouse}</span>
                  </div>
                  <div>
                    <span className="text-secondary block">Statutory Cutoff:</span>
                    <span className="font-bold text-orange-700">{batch.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-secondary block">Employees &amp; Entities:</span>
                    <span className="font-semibold text-on-surface">
                      {batch.employeesCount} staff across {batch.clientsCoveredCount} clients
                    </span>
                  </div>
                  <div>
                    <span className="text-secondary block">Total Contribution Amount:</span>
                    <span className="text-base font-bold text-on-surface">
                      ${batch.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-secondary bg-surface-container-low/60 p-2 rounded-lg">
                  <strong className="text-on-surface">Notes:</strong> {batch.notes}
                </p>

                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-secondary">
                    {batch.authorizedBy ? `Authorized by: ${batch.authorizedBy}` : 'Awaiting Tax Agent (Admin) Sign-off'}
                  </span>

                  <div className="flex items-center gap-2">
                    {!isAuthorized ? (
                      <button
                        type="button"
                        onClick={() => authorizeSuperBatch(batch.id)}
                        className="h-7 px-3 rounded bg-primary hover:bg-primary-container text-on-primary font-bold flex items-center gap-1 transition shadow-2xs"
                        title={
                          currentUser.role === 'Admin'
                            ? 'Authorize Super Batch'
                            : 'Admin authorization required'
                        }
                      >
                        <span className="material-symbols-outlined text-[14px]">lock_open</span>
                        <span>Authorize Batch</span>
                      </button>
                    ) : !isReconciled ? (
                      <button
                        type="button"
                        onClick={() => submitSuperBatch(batch.id)}
                        className="h-7 px-3 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1 transition shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-[14px]">check</span>
                        <span>Confirm Reconciled</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">verified</span>
                        Reconciled &amp; Disbursed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: EMPLOYEE FUND ALLOCATIONS */}
      {activeTab === 'allocations' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                  <th className="py-2.5 px-3">Employee</th>
                  <th className="py-2.5 px-3">Client Employer</th>
                  <th className="py-2.5 px-3">Nominated Super Fund</th>
                  <th className="py-2.5 px-3">APRA USI Code</th>
                  <th className="py-2.5 px-3">Member Number</th>
                  <th className="py-2.5 px-3 text-right">Q3 SG Contribution</th>
                  <th className="py-2.5 px-3">APRA Validation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 font-normal">
                {filteredAllocations.map((sa) => {
                  const isCompliant = sa.complianceStatus === 'Compliant';
                  return (
                    <tr key={sa.id} className="hover:bg-surface-container-low/50 transition">
                      <td className="py-3 px-3 font-bold text-on-surface">{sa.employeeName}</td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleInspectClient(sa.clientId)}
                          className="font-medium text-primary hover:underline text-left"
                        >
                          {sa.clientName}
                        </button>
                      </td>
                      <td className="py-3 px-3 font-semibold text-on-surface">{sa.superFundName}</td>
                      <td className="py-3 px-3 font-mono text-secondary">{sa.usi}</td>
                      <td className="py-3 px-3 font-mono text-secondary">{sa.memberNo}</td>
                      <td className="py-3 px-3 text-right font-bold text-emerald-700">
                        ${sa.q3Contribution.toFixed(2)}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCompliant
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-900 border border-red-300'
                          }`}
                        >
                          {isCompliant ? (
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                          ) : (
                            <span className="material-symbols-outlined text-[13px]">warning</span>
                          )}
                          {sa.complianceStatus}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
