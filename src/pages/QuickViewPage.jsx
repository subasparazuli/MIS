import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function QuickViewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTab = searchParams.get('tab') || 'overview';

  const {
    notProcessedItems,
    markItemProcessed,
    deadlineApproachingTasks,
    completeDeadlineTask,
    issueTokens,
    resolveIssueToken,
    setActiveModal,
    setSelectedClientId,
    flagCounts,
    totalFlagCount,
    currentUser,
    showToast
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('all');

  const setTab = (tab) => {
    setSearchParams({ tab });
  };

  const handleInspectClient = (clientId) => {
    if (clientId) {
      setSelectedClientId(clientId);
      navigate(`/clients/${clientId}`);
    }
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Banner: Quick View / Flag Signs Header */}
      <div className="py-space-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20 mb-space-md">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-error animate-ping" />
            <span>Practice Management Center • Flag Signs Monitoring</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-1 flex items-center gap-2.5">
            Quick View Flag Signs
            {totalFlagCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-error border border-error/20">
                {totalFlagCount} Action Required
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                All Cleared
              </span>
            )}
          </h1>
          <p className="font-body-md text-sm text-secondary mt-0.5">
            Real-time monitoring of unprocessed workflows, approaching statutory deadlines, and active compliance issue tokens.
          </p>
        </div>

        {/* Global Action Cluster */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('addIssueToken')}
            className="h-9 px-3.5 bg-error hover:bg-error/90 text-on-error rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">add_alert</span>
            <span>Raise Issue Token</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Syncing status with ATO portals & bank feeds...')}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">sync</span>
            <span>Sync Feeds</span>
          </button>
        </div>
      </div>

      {/* Flag Signs Top Metrics Pill Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md mb-space-lg">
        {/* Metric 1: Not Processed */}
        <div
          onClick={() => setTab('not_processed')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer ${
            activeTab === 'not_processed'
              ? 'bg-amber-50/80 border-amber-300 shadow-md ring-2 ring-amber-400/40'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-amber-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              Not Processed
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {flagCounts.notProcessed} Items
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface font-headline-lg">
            {flagCounts.notProcessed} Tasks Awaiting
          </div>
          <p className="text-xs text-secondary mt-1">
            Unworked BAS drafts, pending pay runs, and unverified super fund allocations.
          </p>
        </div>

        {/* Metric 2: Deadline Approaching */}
        <div
          onClick={() => setTab('deadlines')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer ${
            activeTab === 'deadlines'
              ? 'bg-orange-50/80 border-orange-300 shadow-md ring-2 ring-orange-400/40'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-orange-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-orange-600">schedule</span>
              Deadline Approaching
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-900 border border-orange-200">
              {flagCounts.deadlineApproaching} Critical
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface font-headline-lg">
            {flagCounts.deadlineApproaching} Due within 7 Days
          </div>
          <p className="text-xs text-secondary mt-1">
            ATO statutory lodgement dates and Superannuation Guarantee quarterly cutoffs.
          </p>
        </div>

        {/* Metric 3: Issue Tokens Unresolved */}
        <div
          onClick={() => setTab('tokens')}
          className={`p-space-md rounded-xl border transition-all cursor-pointer ${
            activeTab === 'tokens'
              ? 'bg-red-50/80 border-red-300 shadow-md ring-2 ring-red-400/40'
              : 'bg-surface-container-lowest border-outline-variant/30 hover:border-red-300 hover:shadow-xs'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-error">report_problem</span>
              Issue Tokens
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-error-container text-error border border-error/30">
              {flagCounts.unresolvedTokens} Open
            </span>
          </div>
          <div className="text-2xl font-bold text-on-surface font-headline-lg">
            {flagCounts.unresolvedTokens} Unresolved Tokens
          </div>
          <p className="text-xs text-secondary mt-1">
            STP TFN errors, clearing house USI rejections, and bank reconciliation variances.
          </p>
        </div>
      </div>

      {/* Navigation Tabs for Flag Signs */}
      <div className="flex items-center gap-2 border-b border-outline-variant/30 pb-2 mb-space-md overflow-x-auto">
        <button
          type="button"
          onClick={() => setTab('overview')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-outline-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">dashboard</span>
          <span>All Flag Signs Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('not_processed')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'not_processed'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-outline-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">pending_actions</span>
          <span>1. Not Processed ({flagCounts.notProcessed})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('deadlines')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'deadlines'
              ? 'bg-orange-600 text-white shadow-xs'
              : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-outline-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">alarm</span>
          <span>2. Deadline Approaching ({flagCounts.deadlineApproaching})</span>
        </button>

        <button
          type="button"
          onClick={() => setTab('tokens')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
            activeTab === 'tokens'
              ? 'bg-error text-on-error shadow-xs'
              : 'bg-surface-container-lowest text-secondary hover:text-on-surface border border-outline-variant/30'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>3. Issue Tokens Unresolved ({flagCounts.unresolvedTokens})</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SECTION 1: NOT PROCESSED ITEMS */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'not_processed') && (
        <div className="mb-space-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
              <h2 className="text-base font-bold text-on-surface">
                1. Not Processed Items ({notProcessedItems.filter((i) => i.status !== 'Processed').length} Active)
              </h2>
            </div>
            <span className="text-xs text-secondary">
              Requires initial extraction, reconciliation, or preparation
            </span>
          </div>

          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                    <th className="py-2.5 px-3">Item / Service</th>
                    <th className="py-2.5 px-3">Client Entity</th>
                    <th className="py-2.5 px-3">Stage / State</th>
                    <th className="py-2.5 px-3">Due Date</th>
                    <th className="py-2.5 px-3">Priority</th>
                    <th className="py-2.5 px-3">Assigned Staff</th>
                    <th className="py-2.5 px-3 text-right">Quick Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/15 font-normal">
                  {notProcessedItems.map((item) => {
                    const isProcessed = item.status === 'Processed';
                    return (
                      <tr
                        key={item.id}
                        className={`hover:bg-surface-container-low/50 transition ${
                          isProcessed ? 'opacity-50 bg-slate-50' : ''
                        }`}
                      >
                        <td className="py-3 px-3">
                          <div className="flex flex-col">
                            <span className="font-semibold text-on-surface">{item.title}</span>
                            <span className="text-[11px] text-secondary flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px] text-primary">
                                {item.serviceId === 'bas'
                                  ? 'receipt_long'
                                  : item.serviceId === 'payslip'
                                  ? 'payments'
                                  : 'savings'}
                              </span>
                              {item.serviceName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <button
                            type="button"
                            onClick={() => handleInspectClient(item.clientId)}
                            className="font-medium text-primary hover:underline text-left"
                          >
                            {item.clientName}
                          </button>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold ${
                              isProcessed
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-900 border border-amber-200'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            {item.stage}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span className="font-medium text-on-surface">{item.dueDate}</span>
                          <span className="text-[11px] text-secondary block">
                            {item.daysRemaining} days left
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              item.priority === 'Urgent'
                                ? 'bg-red-100 text-red-800'
                                : item.priority === 'High'
                                ? 'bg-orange-100 text-orange-800'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {item.priority}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-secondary">{item.assignedTo}</td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isProcessed ? (
                              <button
                                type="button"
                                onClick={() => markItemProcessed(item.id)}
                                className="h-7 px-2.5 rounded bg-primary text-on-primary hover:bg-primary-container text-[11px] font-semibold flex items-center gap-1 transition"
                              >
                                <span className="material-symbols-outlined text-[14px]">done</span>
                                <span>Process Now</span>
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                                Processed
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
      )}

      {/* ========================================================================= */}
      {/* SECTION 2: DEADLINE APPROACHING TASKS */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'deadlines') && (
        <div className="mb-space-xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-orange-600 text-[20px]">alarm</span>
              <h2 className="text-base font-bold text-on-surface">
                2. Deadline Approaching Tasks ({deadlineApproachingTasks.filter((t) => !t.completed).length} Due Soon)
              </h2>
            </div>
            <span className="text-xs text-secondary">
              Statutory lodgements with penalties for late submission
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
            {deadlineApproachingTasks.map((task) => {
              const isCompleted = task.completed;
              return (
                <div
                  key={task.id}
                  className={`p-space-md rounded-xl border transition-all ${
                    isCompleted
                      ? 'bg-slate-50 border-outline-variant/20 opacity-60'
                      : 'bg-surface-container-lowest border-orange-200 shadow-xs hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-orange-700 uppercase tracking-wider flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">event</span>
                        {task.statutoryBody}
                      </span>
                      <h3 className="font-semibold text-sm text-on-surface mt-0.5">{task.title}</h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : task.priority === 'Critical'
                          ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                          : 'bg-orange-100 text-orange-900 border border-orange-300'
                      }`}
                    >
                      {task.countdown}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-secondary mb-3">
                    <div className="flex items-center justify-between">
                      <span>Client Entity:</span>
                      <button
                        type="button"
                        onClick={() => handleInspectClient(task.clientId)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {task.clientName}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Statutory Due Date:</span>
                      <span className="font-bold text-on-surface">{task.deadlineDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Compliance Risk:</span>
                      <span className="text-error font-medium">{task.risk}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                    <span className="text-secondary">Assigned: {task.assignedTo}</span>
                    {!isCompleted ? (
                      <button
                        type="button"
                        onClick={() => completeDeadlineTask(task.id)}
                        className="h-7 px-3 rounded bg-orange-600 hover:bg-orange-700 text-white font-semibold flex items-center gap-1 transition"
                      >
                        <span className="material-symbols-outlined text-[14px]">done_all</span>
                        <span>Complete Task</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION 3: ISSUE TOKENS NOT RESOLVED */}
      {/* ========================================================================= */}
      {(activeTab === 'overview' || activeTab === 'tokens') && (
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-error text-[20px]">report_problem</span>
              <h2 className="text-base font-bold text-on-surface">
                3. Issue Tokens Not Resolved ({issueTokens.filter((t) => t.status !== 'Resolved').length} Active Discrepancies)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveModal('addIssueToken')}
              className="text-xs text-error font-bold hover:underline flex items-center gap-1 self-start sm:self-auto"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              Log New Issue Token
            </button>
          </div>

          <div className="flex flex-col gap-space-sm">
            {issueTokens.map((token) => {
              const isResolved = token.status === 'Resolved';
              return (
                <div
                  key={token.id}
                  className={`p-space-md rounded-xl border transition-all ${
                    isResolved
                      ? 'bg-slate-50 border-outline-variant/20 opacity-60'
                      : token.severity === 'Critical'
                      ? 'bg-red-50/50 border-red-200 shadow-xs'
                      : 'bg-surface-container-lowest border-outline-variant/30 shadow-xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface border border-outline-variant/30">
                        {token.id}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          token.severity === 'Critical'
                            ? 'bg-error text-on-error'
                            : token.severity === 'Warning'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {token.severity}
                      </span>
                      <span className="text-xs font-bold text-on-surface">{token.title}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-secondary">Reported: {token.reportedDate}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-900 border border-red-200'
                        }`}
                      >
                        {token.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs py-1.5 mb-2 bg-surface-container-low/60 p-2.5 rounded-lg border border-outline-variant/20">
                    <div>
                      <span className="text-secondary block">Client:</span>
                      <button
                        type="button"
                        onClick={() => handleInspectClient(token.clientId)}
                        className="font-semibold text-primary hover:underline"
                      >
                        {token.clientName}
                      </button>
                    </div>
                    <div>
                      <span className="text-secondary block">Category:</span>
                      <span className="font-medium text-on-surface">{token.category}</span>
                    </div>
                    <div>
                      <span className="text-secondary block">Affected Record:</span>
                      <span className="font-medium text-on-surface">{token.affectedParty}</span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant mb-2 leading-relaxed">
                    <strong className="text-on-surface">Issue Details:</strong> {token.description}
                  </p>

                  <div className="p-2 rounded bg-amber-50 border border-amber-200/80 text-xs text-amber-900 mb-3">
                    <strong className="font-semibold">Recommended Remediation:</strong> {token.resolutionAction}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20 text-xs">
                    <span className="text-[11px] text-secondary">
                      Service: {token.serviceName}
                    </span>

                    {!isResolved ? (
                      <button
                        type="button"
                        onClick={() => resolveIssueToken(token.id)}
                        className="h-7 px-3 rounded bg-error hover:bg-error/90 text-on-error font-semibold flex items-center gap-1 transition"
                      >
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Resolve Token</span>
                      </button>
                    ) : (
                      <span className="text-emerald-700 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Resolved
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
