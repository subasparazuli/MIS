import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ClientProfilePage() {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const {
    clients,
    selectedClientId,
    setSelectedClientId,
    basRecords,
    payslipTracking,
    updatePayslipTrackingField,
    notProcessedItems,
    deadlineApproachingTasks,
    issueTokens,
    resolveIssueToken,
    setActiveModal,
    setSelectedBas,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'bas' | 'payroll' | 'tokens'

  // Resolve target client
  const activeId = clientId || selectedClientId;
  const client = clients.find((c) => c.id === activeId) || clients[0];

  // Specific data slices for this client
  const clientBas = basRecords.filter((b) => b.clientId === client.id);
  const clientTrackingRows = payslipTracking.filter(
    (pt) => pt.clientId === client.id || (pt.company && client.name && pt.company.toLowerCase() === client.name.toLowerCase())
  );
  const clientNotProcessed = notProcessedItems.filter((np) => np.clientId === client.id && np.status !== 'Processed');
  const clientDeadlines = deadlineApproachingTasks.filter((dl) => dl.clientId === client.id && !dl.completed);
  const clientTokens = issueTokens.filter((tk) => tk.clientId === client.id);

  const clientTotalFlags = clientNotProcessed.length + clientDeadlines.length + clientTokens.filter(t => t.status !== 'Resolved').length;

  const handleOpenBas = (bas) => {
    setSelectedBas(bas);
    setActiveModal('prepareBas');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Breadcrumb & Client Quick Switcher */}
      <div className="py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/20 mb-space-md">
        <div className="flex items-center gap-space-xs text-secondary text-xs">
          <button
            type="button"
            onClick={() => navigate('/clients')}
            className="hover:text-primary transition flex items-center gap-1 font-semibold"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Clients Directory
          </button>
          <span>/</span>
          <span className="text-on-surface font-bold">{client.name}</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-secondary font-semibold">Switch Client:</span>
          <select
            value={client.id}
            onChange={(e) => {
              setSelectedClientId(e.target.value);
              navigate(`/clients/${e.target.value}`);
            }}
            className="h-8 px-2.5 bg-surface-container rounded-lg text-xs font-semibold text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.software || 'Quickbook'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client Profile Hero Card */}
      <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs mb-space-lg relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-lg">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary text-on-primary flex items-center justify-center font-bold text-xl shadow-md shrink-0">
              <span className="material-symbols-outlined text-[32px]">corporate_fare</span>
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="font-headline-lg text-xl sm:text-2xl font-bold text-on-surface tracking-tight">
                  {client.name}
                </h1>
                <span
                  className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    client.software === 'Xero'
                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  }`}
                >
                  {client.software || 'Quickbook'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-surface-container text-secondary">
                  {client.entityType}
                </span>
                {clientTotalFlags > 0 ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    {clientTotalFlags} Active Flags
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Compliant &amp; Active
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-secondary">
                <span className="font-mono font-bold text-on-surface">ABN: {client.abn}</span>
                {client.contactEmail && (
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="material-symbols-outlined text-[14px]">mail</span>
                    {client.contactEmail}
                  </span>
                )}
                {client.contactCc && (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-secondary">
                    <span className="material-symbols-outlined text-[14px]">forward_to_inbox</span>
                    CC: {client.contactCc}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  Payrun: {client.payrollFrequency || 'Fortnightly'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setSelectedBas(null);
                setActiveModal('prepareBas');
              }}
              className="h-8 px-3 rounded-lg bg-primary text-on-primary text-xs font-bold flex items-center gap-1 hover:bg-primary-container transition shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">receipt_long</span>
              <span>Prepare BAS</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/services/payslips')}
              className="h-8 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 border border-outline-variant/30 transition shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">payments</span>
              <span>Payslip Master Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal('addIssueToken')}
              className="h-8 px-3 rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-bold flex items-center gap-1 transition shadow-2xs"
            >
              <span className="material-symbols-outlined text-[16px]">report_problem</span>
              <span>Raise Token</span>
            </button>
          </div>
        </div>

        {/* Subscribed Active Services Chips */}
        <div className="pt-3 mt-3 border-t border-outline-variant/20 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-secondary font-semibold mr-1">Active Practice Services:</span>
            {(client.activeServices || ['bas', 'payslip']).map((svc) => (
              <span
                key={svc}
                className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20 flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {svc === 'bas' ? 'receipt_long' : 'payments'}
                </span>
                {svc === 'bas'
                  ? 'Business Activity Statement (BAS)'
                  : 'Payslip & Wage Management'}
              </span>
            ))}
          </div>

          <span className="text-[11px] text-secondary font-medium">
            Accounting Software: <strong className="text-on-surface">{client.software || 'Quickbook'}</strong>
          </span>
        </div>
      </div>

      {/* Client Flag Signs Warning Banner if flags exist */}
      {clientTotalFlags > 0 && (
        <div className="p-space-md rounded-xl bg-amber-50 border border-amber-300 shadow-xs mb-space-lg flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px] text-amber-600">warning</span>
              <span>Flag Signs Requiring Action for {client.name}</span>
            </div>
            <span className="text-xs font-bold text-amber-800">
              {clientTotalFlags} Flagged Items
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
            {clientNotProcessed.map((np) => (
              <div key={np.id} className="p-2 rounded bg-white border border-amber-200">
                <span className="font-bold text-on-surface block">{np.title}</span>
                <span className="text-secondary text-[11px]">{np.stage} • Due {np.dueDate}</span>
              </div>
            ))}

            {clientDeadlines.map((dl) => (
              <div key={dl.id} className="p-2 rounded bg-white border border-orange-200">
                <span className="font-bold text-orange-900 block">{dl.title}</span>
                <span className="text-orange-700 font-semibold text-[11px]">{dl.countdown} ({dl.deadlineDate})</span>
              </div>
            ))}

            {clientTokens.filter(t => t.status !== 'Resolved').map((tk) => (
              <div key={tk.id} className="p-2 rounded bg-white border border-red-200">
                <span className="font-bold text-error block">{tk.id}: {tk.title}</span>
                <span className="text-secondary text-[11px] line-clamp-1">{tk.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Profile Detail Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 mb-space-md overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>Entity &amp; Practice Details</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('payroll')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'payroll'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">payments</span>
          <span>Payslip &amp; Wage Tracking ({clientTrackingRows.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bas')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'bas'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">receipt_long</span>
          <span>BAS Lodgements ({clientBas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('tokens')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'tokens'
              ? 'bg-error text-on-error shadow-xs'
              : 'bg-surface-container text-secondary hover:text-on-surface'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">report_problem</span>
          <span>Issue Tokens ({clientTokens.length})</span>
        </button>
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col gap-3">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">gavel</span>
              Australian Statutory &amp; Software Profile
            </h3>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-secondary block">Accounting Software:</span>
                <span className="font-bold text-on-surface text-sm text-primary">{client.software || 'Quickbook'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-secondary block">Payroll Cycle:</span>
                <span className="font-bold text-on-surface">{client.payrollFrequency || 'Fortnightly'}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-secondary block">GST Accounting Basis:</span>
                <span className="font-bold text-on-surface">{client.gstBasis || 'Accruals'} Method</span>
              </div>
              <div className="p-2.5 rounded-lg bg-surface-container-low">
                <span className="text-secondary block">BAS Lodgement Cycle:</span>
                <span className="font-bold text-on-surface">{client.lodgementCycle || 'Quarterly'}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-surface-container-low text-xs">
              <span className="text-secondary block font-semibold mb-0.5">Special Engagement Notes:</span>
              <p className="text-on-surface">{client.notes || 'Fixed until said'}</p>
            </div>
          </div>

          <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col gap-3">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-primary">contacts</span>
              Primary Contact &amp; Email Dispatch
            </h3>

            <div className="flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-secondary">Primary Email:</span>
                <span className="font-mono font-semibold text-primary">
                  {client.contactEmail || 'Not recorded'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-secondary">CC Email:</span>
                <span className="font-mono font-semibold text-secondary">
                  {client.contactCc || 'None'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-secondary">Registered Location:</span>
                <span className="font-semibold text-on-surface">
                  {client.city || 'Adelaide'}, {client.state || 'SA'} {client.postcode || '5000'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-surface-container-low">
                <span className="text-secondary">Lead Partner:</span>
                <span className="font-semibold text-on-surface">{client.leadPartner || 'Manoj Khanal, CA'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PAYROLL TRACKING TAB */}
      {activeTab === 'payroll' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-outline-variant/20 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-xs uppercase tracking-wider text-secondary">
                Payslip Tracking Entries for {client.name}
              </h3>
              <span className="text-[11px] text-secondary">Synced with master payslip tracking sheet</span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/services/payslips')}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">open_in_new</span>
              Open Master Sheet
            </button>
          </div>

          {clientTrackingRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                    <th className="py-2.5 px-3">Software</th>
                    <th className="py-2.5 px-3">Updates / Instructions</th>
                    <th className="py-2.5 px-3">Payrun Period</th>
                    <th className="py-2.5 px-3">Super Status</th>
                    <th className="py-2.5 px-3">Payslip Status</th>
                    <th className="py-2.5 px-3">Notes</th>
                    <th className="py-2.5 px-3">Processed</th>
                    <th className="py-2.5 px-3">Email &amp; CC</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {clientTrackingRows.map((r) => (
                    <tr key={r.id} className="hover:bg-surface-container-low/50">
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          r.software === 'Xero' ? 'bg-sky-50 text-sky-800 border-sky-300' : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        }`}>
                          {r.software}
                        </span>
                      </td>
                      <td className="py-3 px-3 max-w-[200px]">
                        <input
                          type="text"
                          value={r.updates || ''}
                          onChange={(e) => updatePayslipTrackingField(r.id, 'updates', e.target.value)}
                          placeholder="Add updates..."
                          className="w-full text-xs bg-transparent border-b border-outline-variant/30 focus:border-primary focus:outline-none py-0.5"
                        />
                      </td>
                      <td className="py-3 px-3 font-medium text-on-surface">{r.payrunPeriod}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.superStatus === 'Submitted' ? 'bg-emerald-100 text-emerald-800' : r.superStatus ? 'bg-amber-100 text-amber-900' : 'bg-surface-container text-secondary'
                        }`}>
                          {r.superStatus || 'Not submitted'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          r.payslipStatus === 'Payslip sent' ? 'bg-emerald-100 text-emerald-800' : r.payslipStatus ? 'bg-rose-100 text-rose-800' : 'bg-surface-container text-secondary'
                        }`}>
                          {r.payslipStatus || 'Pending'}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-secondary">{r.notes}</td>
                      <td className="py-3 px-3 font-semibold text-primary">{r.processed}</td>
                      <td className="py-3 px-3 font-mono text-[11px] text-secondary">
                        <div>{r.email || '-'}</div>
                        {r.cc && <div className="text-[10px] text-outline">CC: {r.cc}</div>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-secondary">
              No payslip tracking entries found for this specific entity.
            </div>
          )}
        </div>
      )}

      {/* 3. BAS TAB */}
      {activeTab === 'bas' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="p-3 border-b border-outline-variant/20 flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-secondary">
              BAS Lodgements for {client.name}
            </h3>
            <button
              type="button"
              onClick={() => {
                setSelectedBas(null);
                setActiveModal('prepareBas');
              }}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              Draft New BAS
            </button>
          </div>

          {clientBas.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                    <th className="py-2.5 px-3">Period</th>
                    <th className="py-2.5 px-3 text-right">1A GST on Sales</th>
                    <th className="py-2.5 px-3 text-right">1B GST on Purchases</th>
                    <th className="py-2.5 px-3 text-right">W2 PAYG-W</th>
                    <th className="py-2.5 px-3 text-right">Total Payable</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15">
                  {clientBas.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-container-low/50">
                      <td className="py-3 px-3 font-semibold text-on-surface">{b.period}</td>
                      <td className="py-3 px-3 text-right">${b.label1A_gstOnSales.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right text-emerald-700">${b.label1B_gstOnPurchases.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right">${b.labelW2_paygWithheld.toLocaleString()}</td>
                      <td className="py-3 px-3 text-right font-bold text-on-surface">${b.totalPayable.toLocaleString()}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-on-surface">
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenBas(b)}
                          className="h-7 px-2.5 rounded bg-primary text-on-primary text-[11px] font-semibold"
                        >
                          View Calc
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-secondary">
              No BAS records on file for this client. Click "Prepare BAS" to draft one.
            </div>
          )}
        </div>
      )}

      {/* 4. ISSUE TOKENS TAB */}
      {activeTab === 'tokens' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-secondary">
              Issue Tokens Logged for {client.name}
            </h3>
            <button
              type="button"
              onClick={() => setActiveModal('addIssueToken')}
              className="text-xs text-error font-bold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              Log Issue Token
            </button>
          </div>

          {clientTokens.length > 0 ? (
            clientTokens.map((tk) => (
              <div
                key={tk.id}
                className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                      {tk.id}
                    </span>
                    <span className="font-bold text-xs text-on-surface">{tk.title}</span>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    tk.status === 'Resolved' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {tk.status}
                  </span>
                </div>
                <p className="text-xs text-secondary">{tk.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                  <span className="text-[11px] text-secondary">Reported: {tk.reportedDate}</span>
                  {tk.status !== 'Resolved' && (
                    <button
                      type="button"
                      onClick={() => resolveIssueToken(tk.id)}
                      className="h-7 px-2.5 rounded bg-error text-on-error font-semibold text-[11px]"
                    >
                      Resolve Token
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-xs text-secondary bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              Zero open issue tokens for this client!
            </div>
          )}
        </div>
      )}
    </div>
  );
}
