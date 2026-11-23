import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function WorkflowsPage() {
  const navigate = useNavigate();
  const { workflowJobs, moveJobStage, setActiveModal, setSelectedClientId, showToast } = useApp();

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'table' | 'deadlines'
  const [filterForm, setFilterForm] = useState('all');
  const [filterPartner, setFilterPartner] = useState('all');
  const [search, setSearch] = useState('');

  const columns = [
    { id: 'document_gathering', label: '1. Document Ingestion', color: 'border-slate-300' },
    { id: 'workpaper_prep', label: '2. Workpaper & Tie-Out', color: 'border-blue-300' },
    { id: 'partner_review', label: '3. Partner Review', color: 'border-amber-300' },
    { id: 'client_signature', label: '4. Form 8879 Signature', color: 'border-indigo-300' },
    { id: 'irs_accepted', label: '5. IRS Accepted & Filed', color: 'border-emerald-300' },
  ];

  const stageOrder = ['document_gathering', 'workpaper_prep', 'partner_review', 'client_signature', 'irs_accepted'];

  const filteredJobs = workflowJobs.filter((job) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        job.clientName.toLowerCase().includes(q) ||
        job.formType.toLowerCase().includes(q) ||
        job.id.toLowerCase().includes(q) ||
        job.leadPartner.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filterForm !== 'all' && job.formType !== filterForm) return false;
    if (filterPartner !== 'all' && !job.leadPartner.includes(filterPartner)) return false;
    return true;
  });

  const handleAdvance = (job) => {
    const currentIndex = stageOrder.indexOf(job.stage);
    if (currentIndex < stageOrder.length - 1) {
      const nextStage = stageOrder[currentIndex + 1];
      moveJobStage(job.id, nextStage);
    } else {
      showToast(`Job ${job.id} is already in the final IRS Accepted stage.`);
    }
  };

  const handleInspectClient = (job) => {
    if (job.clientId) {
      setSelectedClientId(job.clientId);
      navigate('/client-360');
    }
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Command & Control Ribbon */}
      <header className="py-space-md flex flex-col gap-space-md">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-space-md">
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-space-xs text-secondary font-label-sm text-label-sm uppercase tracking-wider mb-0.5">
              <span>LedgerPoint Workflow OS</span>
              <span>/</span>
              <span className="text-primary font-semibold">Q1-Q2 Compliance Cycle</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-caption text-caption font-semibold ml-space-xs">
                Batch Active
              </span>
            </div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Tax Compliance Pipeline — Spring 2024 Filings
            </h1>
          </div>

          {/* Action Group & View Switchers */}
          <div className="flex flex-wrap items-center gap-space-sm">
            {/* View Switcher Tabs */}
            <div className="flex p-0.5 rounded-lg bg-surface-container-high shadow-inner border border-outline-variant/30">
              <button
                onClick={() => setViewMode('kanban')}
                className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition ${
                  viewMode === 'kanban'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                    : 'text-secondary hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px] text-primary">view_kanban</span>
                <span>Kanban Board</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition ${
                  viewMode === 'table'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                    : 'text-secondary hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">table_rows</span>
                <span>Table View</span>
              </button>
              <button
                onClick={() => setViewMode('deadlines')}
                className={`flex items-center gap-1.5 px-space-md py-1.5 rounded-lg font-label-md text-label-md transition ${
                  viewMode === 'deadlines'
                    ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                    : 'text-secondary hover:text-on-surface'
                }`}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                <span>Deadlines</span>
              </button>
            </div>

            <button
              onClick={() => setActiveModal('newJob')}
              className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add_task</span>
              <span>New Tax Return / Job</span>
            </button>
          </div>
        </div>

        {/* Filter Multi-Bar */}
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-wrap items-center justify-between gap-space-md border border-outline-variant/30">
          <div className="flex flex-wrap items-center gap-space-sm flex-1 min-w-0">
            {/* Search Field */}
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-space-sm top-1/2 -translate-y-1/2 text-[17px] text-outline">
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter returns, client, or EIN..."
                className="w-full h-8 pl-8 pr-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none border border-outline-variant/30"
              />
            </div>

            {/* Filing Type Dropdown */}
            <select
              value={filterForm}
              onChange={(e) => setFilterForm(e.target.value)}
              className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
            >
              <option value="all">All Return Types</option>
              <option value="Form 1065">Form 1065 (Partnership)</option>
              <option value="Form 1120-S">Form 1120-S (S-Corp)</option>
              <option value="Form 1120">Form 1120 (C-Corp)</option>
              <option value="Form 1040">Form 1040 (Individual)</option>
            </select>

            {/* Reviewer Partner Dropdown */}
            <select
              value={filterPartner}
              onChange={(e) => setFilterPartner(e.target.value)}
              className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
            >
              <option value="all">All Reviewers</option>
              <option value="Manoj">Manoj Khanal, CA</option>
              <option value="Ashmita">Ashmita</option>
              <option value="Sobina">Sobina</option>
              <option value="Deepika">Deepika</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs font-label-sm text-secondary">
            <span>Showing <strong>{filteredJobs.length}</strong> active workflow engagements</span>
          </div>
        </div>
      </header>

      {/* Kanban Board View */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-space-md mt-space-md items-start">
          {columns.map((col) => {
            const jobsInCol = filteredJobs.filter((j) => j.stage === col.id);
            return (
              <div
                key={col.id}
                className="flex flex-col bg-surface-container-low/60 rounded-xl p-space-sm border border-outline-variant/30 min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-space-xs py-space-xs mb-space-sm border-b border-outline-variant/20">
                  <div className="flex items-center gap-1.5">
                    <span className="font-label-md text-label-md font-bold text-on-surface">
                      {col.label}
                    </span>
                  </div>
                  <span className="w-5 h-5 rounded-full bg-surface-container text-primary font-bold text-xs flex items-center justify-center">
                    {jobsInCol.length}
                  </span>
                </div>

                {/* Cards List */}
                <div className="space-y-space-sm flex-1">
                  {jobsInCol.map((job) => (
                    <article
                      key={job.id}
                      className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm hover:shadow-md transition-shadow border border-outline-variant/30 flex flex-col gap-space-xs group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="px-2 py-0.5 rounded font-label-sm text-xs font-semibold bg-surface-container text-on-surface-variant">
                          {job.formType}
                        </span>
                        <span className="font-caption text-xs text-secondary flex items-center gap-0.5">
                          <span className="material-symbols-outlined text-[13px]">event</span>
                          {job.dueDate}
                        </span>
                      </div>

                      <div onClick={() => handleInspectClient(job)} className="cursor-pointer">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold group-hover:text-primary transition leading-snug">
                          {job.clientName}
                        </h3>
                        <p className="font-caption text-caption text-secondary">
                          {job.id} • {job.notes}
                        </p>
                      </div>

                      <div className="p-space-xs rounded bg-surface-container-low text-on-surface font-caption text-caption flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        <span className="font-medium truncate">{job.statusBadge}</span>
                      </div>

                      <div className="flex flex-col gap-1 pt-1">
                        <div className="flex items-center justify-between text-secondary font-caption text-caption">
                          <span>Progress</span>
                          <span className="font-semibold text-on-surface">{job.progress}%</span>
                        </div>
                        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              job.progress === 100 ? 'bg-emerald-600' : 'bg-primary'
                            }`}
                            style={{ width: `${job.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Card Footer: Partner & Advance Button */}
                      <div className="pt-2 flex items-center justify-between border-t border-outline-variant/15 mt-1">
                        <div className="flex items-center gap-1.5">
                          <div className="w-6 h-6 rounded-full bg-primary-fixed text-on-primary-fixed flex items-center justify-center font-bold text-xs">
                            {job.leadInitials}
                          </div>
                          <span className="font-caption text-xs text-secondary truncate max-w-[80px]">
                            {job.leadPartner.split(',')[0]}
                          </span>
                        </div>

                        {col.id !== 'irs_accepted' && (
                          <button
                            onClick={() => handleAdvance(job)}
                            className="h-6 px-2 bg-surface-container hover:bg-primary hover:text-on-primary text-secondary rounded text-[11px] font-semibold transition flex items-center gap-0.5"
                            title="Move to next stage"
                          >
                            <span>Advance</span>
                            <span className="material-symbols-outlined text-[13px]">chevron_right</span>
                          </button>
                        )}
                        {col.id === 'irs_accepted' && (
                          <span className="text-emerald-700 text-xs font-bold flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">done_all</span> Accepted
                          </span>
                        )}
                      </div>
                    </article>
                  ))}

                  {jobsInCol.length === 0 && (
                    <div className="h-32 border-2 border-dashed border-outline-variant/40 rounded-xl flex items-center justify-center text-caption text-outline">
                      No jobs in this phase
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table View Mode */}
      {viewMode === 'table' && (
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 mt-space-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase">
                  <th className="py-3 px-4 font-semibold">Job ID</th>
                  <th className="py-3 px-4 font-semibold">Client Entity</th>
                  <th className="py-3 px-4 font-semibold">Form Type</th>
                  <th className="py-3 px-4 font-semibold">Current Pipeline Stage</th>
                  <th className="py-3 px-4 font-semibold">Due Date</th>
                  <th className="py-3 px-4 font-semibold">Lead Reviewer</th>
                  <th className="py-3 px-4 font-semibold">Progress</th>
                  <th className="py-3 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-container-low/50 transition">
                    <td className="py-3.5 px-4 font-mono text-body-sm font-bold text-primary">
                      {job.id}
                    </td>
                    <td className="py-3.5 px-4 font-label-md text-label-md font-bold text-on-surface">
                      {job.clientName}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded font-label-sm text-xs font-semibold bg-surface-container text-on-surface-variant">
                        {job.formType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-body-sm text-body-sm capitalize">
                      {job.stage.replace('_', ' ')}
                    </td>
                    <td className="py-3.5 px-4 font-body-sm text-body-sm text-secondary">
                      {job.dueDate}
                    </td>
                    <td className="py-3.5 px-4 font-body-sm text-body-sm text-on-surface">
                      {job.leadPartner}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-surface-container h-1.5 rounded-full overflow-hidden">
                          <div className="bg-primary h-full rounded-full" style={{ width: `${job.progress}%` }} />
                        </div>
                        <span className="text-xs font-mono">{job.progress}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleAdvance(job)}
                        className="h-7 px-2.5 bg-surface-container hover:bg-primary hover:text-on-primary rounded font-label-sm text-xs transition"
                      >
                        Advance
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Deadlines View Mode */}
      {viewMode === 'deadlines' && (
        <div className="p-space-xl bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 mt-space-md">
          <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold mb-space-md">
            Critical Deadlines Schedule
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
            <div className="p-space-lg rounded-xl bg-rose-50/60 border border-rose-200">
              <span className="px-2 py-0.5 rounded bg-error text-on-error font-bold text-xs uppercase">
                14 Days Remaining
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">
                April 15, 2024
              </h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Federal Form 1120-S &amp; Form 1065 statutory filing deadline and initial extension cut-off.
              </p>
              <div className="mt-4 pt-3 border-t border-rose-200 font-label-sm text-xs font-semibold text-error">
                6 returns require transmission
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-amber-50/60 border border-amber-200">
              <span className="px-2 py-0.5 rounded bg-amber-600 text-white font-bold text-xs uppercase">
                44 Days Remaining
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">
                May 15, 2024
              </h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Form 990 Exempt Organization returns and fiscal non-profit statements.
              </p>
              <div className="mt-4 pt-3 border-t border-amber-200 font-label-sm text-xs font-semibold text-amber-700">
                1 return in queue
              </div>
            </div>

            <div className="p-space-lg rounded-xl bg-indigo-50/60 border border-indigo-200">
              <span className="px-2 py-0.5 rounded bg-primary text-white font-bold text-xs uppercase">
                77 Days Remaining
              </span>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mt-2">
                June 17, 2024
              </h3>
              <p className="font-body-sm text-body-sm text-secondary mt-1">
                Q2 2024 Corporate Estimated Tax installment payments.
              </p>
              <div className="mt-4 pt-3 border-t border-indigo-200 font-label-sm text-xs font-semibold text-primary">
                14 vouchers scheduled
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
