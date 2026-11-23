import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function BillingWIPPage() {
  const { wipEntries, invoices, setActiveModal, showToast } = useApp();
  const [filterWipAging, setFilterWipAging] = useState('all');

  const totalWip = wipEntries.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredWip = wipEntries.filter((w) => {
    if (filterWipAging !== 'all' && !w.aging.includes(filterWipAging)) return false;
    return true;
  });

  const handleBillNow = (wip) => {
    showToast(`Converted WIP entry "${wip.engagement}" ($${wip.amount.toLocaleString()}) to draft invoice.`);
  };

  const handleBatchInvoices = () => {
    showToast(`Generated batch draft invoices for ${filteredWip.length} unbilled WIP records.`);
  };

  const handleDownloadInvoice = (inv) => {
    showToast(`Downloading PDF for invoice ${inv.id}...`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md py-space-lg mb-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-caption text-caption uppercase tracking-wider text-secondary font-bold">
              Fiduciary Ledger &amp; Practice Operations
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface font-label-sm text-label-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live Sync Active
            </span>
          </div>
          <div className="flex flex-wrap items-baseline gap-space-md">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Billing &amp; Practice Financials
            </h1>
            <div className="flex items-center gap-1.5 px-space-sm py-1 rounded bg-surface-container-low text-secondary font-body-sm text-body-sm border border-outline-variant/30">
              <span className="material-symbols-outlined text-[16px]">calendar_today</span>
              <span>Period: April 2024 (Closing in 6 Days)</span>
            </div>
          </div>
        </div>

        {/* Global Financial Action Buttons */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            onClick={() => showToast('Opening Stripe & ACH Payment Gateway Portal...')}
            className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md uppercase tracking-wider shadow-sm flex items-center gap-space-xs transition-colors border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">tune</span>
            <span>Payment Gateway</span>
          </button>
          <button
            onClick={() => setActiveModal('logTime')}
            className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md uppercase tracking-wider shadow-sm flex items-center gap-space-xs transition-colors border border-outline-variant/30"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">more_time</span>
            <span>+ Log Time / WIP Entry</span>
          </button>
          <button
            onClick={handleBatchInvoices}
            className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md uppercase tracking-wider shadow-sm flex items-center gap-space-xs transition-colors"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">receipt</span>
            <span>Create Batch Invoices</span>
          </button>
        </div>
      </div>

      {/* Practice Financial KPI Matrix (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
        {/* KPI 1: WIP */}
        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-secondary font-semibold">
                Unbilled Inventory
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
                Total WIP Balance
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">hourglass_top</span>
            </div>
          </div>
          <div className="my-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-on-surface tracking-tight font-bold tabular-nums">
                ${totalWip.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </span>
              <span className="font-caption text-caption text-secondary">USD</span>
            </div>
            <div className="flex items-center gap-1.5 text-primary font-body-sm text-body-sm mt-1">
              <span className="material-symbols-outlined text-[16px]">timelapse</span>
              <span>1,140.0 billable hours logged</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '78%' }} />
          </div>
        </div>

        {/* KPI 2: Realization Rate */}
        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-secondary font-semibold">
                Billed Realization
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
                Practice Realization
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-emerald-700">
              <span className="material-symbols-outlined text-[20px]">trending_up</span>
            </div>
          </div>
          <div className="my-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-on-surface tracking-tight font-bold">
                94.2%
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-body-sm text-body-sm mt-1">
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
              <span>+2.1% above 92.0% firm target</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '94.2%' }} />
          </div>
        </div>

        {/* KPI 3: Retainers Collected */}
        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-secondary font-semibold">
                Recurring Retainers
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
                Retainers Collected
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
            </div>
          </div>
          <div className="my-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-on-surface tracking-tight font-bold tabular-nums">
                $340,000
              </span>
              <span className="font-caption text-caption text-secondary">/ $360k Target</span>
            </div>
            <div className="flex items-center gap-1.5 text-secondary font-body-sm text-body-sm mt-1">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>94.4% collected via Auto-ACH</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: '94.4%' }} />
          </div>
        </div>

        {/* KPI 4: Overdue Receivables */}
        <div className="p-space-lg bg-surface-container-lowest rounded-xl shadow-sm flex flex-col justify-between border border-outline-variant/30">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <span className="font-caption text-caption uppercase tracking-wider text-secondary font-semibold">
                Accounts Receivable
              </span>
              <span className="font-label-md text-label-md text-on-surface font-semibold mt-0.5">
                Overdue Receivables
              </span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-error">
              <span className="material-symbols-outlined text-[20px]">notification_important</span>
            </div>
          </div>
          <div className="my-space-md">
            <div className="flex items-baseline gap-space-xs">
              <span className="font-display text-display text-error tracking-tight font-bold tabular-nums">
                $32,180
              </span>
              <span className="font-caption text-caption text-secondary">4 entities</span>
            </div>
            <div className="flex items-center gap-1.5 text-error font-body-sm text-body-sm mt-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span>
              <span>Avg DSO: 22 Days (Healthy)</span>
            </div>
          </div>
          <div className="w-full bg-surface-container h-1 rounded-full overflow-hidden">
            <div className="bg-error h-full rounded-full" style={{ width: '22%' }} />
          </div>
        </div>
      </div>

      {/* 2-Column Workspaces */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left Column (2 Cols wide): WIP Ledger & Invoices Table */}
        <div className="lg:col-span-2 space-y-space-lg">
          {/* Work in Progress (WIP) Ledger */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">hourglass_bottom</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Work in Progress (WIP) Inventory
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={filterWipAging}
                  onChange={(e) => setFilterWipAging(e.target.value)}
                  className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
                >
                  <option value="all">All Aging Buckets</option>
                  <option value="Current">Current (&lt; 30d)</option>
                  <option value="31-60d">31-60 Days</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase">
                    <th className="pb-3 font-semibold">Client Entity</th>
                    <th className="pb-3 font-semibold">Engagement Scope</th>
                    <th className="pb-3 font-semibold">Staff</th>
                    <th className="pb-3 font-semibold">Hours</th>
                    <th className="pb-3 font-semibold">WIP Value</th>
                    <th className="pb-3 font-semibold">Aging</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredWip.map((wip) => (
                    <tr key={wip.id} className="hover:bg-surface-container-low/50 transition">
                      <td className="py-3 font-label-md text-label-md font-bold text-on-surface">
                        {wip.clientName}
                      </td>
                      <td className="py-3 font-body-sm text-body-sm text-secondary">
                        {wip.engagement}
                      </td>
                      <td className="py-3 font-body-sm text-body-sm text-on-surface">
                        {wip.staff}
                      </td>
                      <td className="py-3 font-mono text-body-sm font-semibold tabular-nums text-on-surface">
                        {wip.hours}h
                      </td>
                      <td className="py-3 font-mono text-body-sm font-bold tabular-nums text-primary">
                        ${wip.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-surface-container text-secondary">
                          {wip.aging}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleBillNow(wip)}
                          className="h-7 px-2.5 bg-primary hover:bg-primary-container text-on-primary rounded font-label-sm text-xs transition"
                        >
                          Bill Now
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Invoices & Receivables */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">receipt_long</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Active Invoices &amp; Receivables
                </h2>
              </div>
              <span className="font-caption text-caption text-secondary uppercase font-semibold">
                April 2024 Ledger
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase">
                    <th className="pb-3 font-semibold">Invoice #</th>
                    <th className="pb-3 font-semibold">Client Entity</th>
                    <th className="pb-3 font-semibold">Date</th>
                    <th className="pb-3 font-semibold">Amount</th>
                    <th className="pb-3 font-semibold">Billing Type</th>
                    <th className="pb-3 font-semibold">Status</th>
                    <th className="pb-3 font-semibold text-right">Invoice PDF</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-surface-container-low/50 transition">
                      <td className="py-3 font-mono text-body-sm font-bold text-primary">
                        {inv.id}
                      </td>
                      <td className="py-3 font-label-md text-label-md font-semibold text-on-surface">
                        {inv.client}
                      </td>
                      <td className="py-3 font-body-sm text-body-sm text-secondary">
                        {inv.date}
                      </td>
                      <td className="py-3 font-mono text-body-sm font-bold tabular-nums text-on-surface">
                        ${inv.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 font-body-sm text-body-sm text-secondary">
                        {inv.type}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${inv.statusBadge}`}>
                          {inv.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDownloadInvoice(inv)}
                          className="h-7 px-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-xs transition inline-flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">download</span>
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Recurring Retainer Schedule & Logged Today Summary */}
        <div className="space-y-space-lg">
          {/* Retainer & Recurring Schedule */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">autorenew</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Retainer Auto-Debits
                </h2>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-space-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                <div>
                  <p className="font-label-sm font-bold text-on-surface">Vanguard Logistics</p>
                  <p className="font-caption text-secondary">ACH Scheduled May 01</p>
                </div>
                <span className="font-mono font-bold text-primary">$4,000/mo</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                <div>
                  <p className="font-label-sm font-bold text-on-surface">Alta Vista Capital</p>
                  <p className="font-caption text-secondary">ACH Scheduled May 01</p>
                </div>
                <span className="font-mono font-bold text-primary">$4,500/mo</span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20">
                <div>
                  <p className="font-label-sm font-bold text-on-surface">Summit Ridge SPV</p>
                  <p className="font-caption text-secondary">ACH Scheduled May 01</p>
                </div>
                <span className="font-mono font-bold text-primary">$5,416/mo</span>
              </div>
            </div>
          </div>

          {/* Partner Logged Today Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-xs">
              <span className="font-caption text-caption text-secondary uppercase font-bold">
                Logged Today (Manoj Khanal)
              </span>
              <span className="font-mono text-sm font-bold text-primary">6.8 / 8.0 Target</span>
            </div>
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-space-md">
              <div className="bg-primary h-full rounded-full" style={{ width: '85%' }} />
            </div>

            <div className="space-y-space-xs">
              <div className="p-space-xs rounded bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                    Summit Ridge SPV Review
                  </span>
                  <span className="font-caption text-caption text-secondary">
                    09:15 - 11:45 AM • Partner Review
                  </span>
                </div>
                <span className="font-mono text-body-sm font-bold text-primary">2.5 hrs</span>
              </div>

              <div className="p-space-xs rounded bg-surface-container-low flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="font-label-sm text-label-sm font-semibold text-on-surface">
                    Vanguard Nexus Research
                  </span>
                  <span className="font-caption text-caption text-secondary">
                    01:00 - 05:18 PM • Corporate Tax
                  </span>
                </div>
                <span className="font-mono text-body-sm font-bold text-primary">4.3 hrs</span>
              </div>
            </div>

            <button
              onClick={() => setActiveModal('logTime')}
              className="w-full mt-space-md py-2 bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-xs rounded-lg transition font-bold"
            >
              + Log Additional Time
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
