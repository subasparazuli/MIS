import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Client360Page() {
  const navigate = useNavigate();
  const { clients, selectedClient, setSelectedClientId, setActiveModal, showToast } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'returns', label: 'Returns & Workflows' },
    { id: 'invoices', label: 'Invoices & Retainers' },
    { id: 'documents', label: 'Documents & Vault' },
    { id: 'communications', label: 'Communications' },
    { id: 'activity', label: 'Audit Trail' },
  ];

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Client Switcher & Navigation Breadcrumb */}
      <div className="py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-outline-variant/20 mb-space-md">
        <div className="flex items-center gap-space-xs text-secondary font-label-sm">
          <button onClick={() => navigate('/clients')} className="hover:text-primary transition flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Client Directory
          </button>
          <span>/</span>
          <span className="text-on-surface font-semibold">{selectedClient.name}</span>
        </div>

        <div className="flex items-center gap-space-sm">
          <span className="font-caption text-caption uppercase text-secondary font-semibold">Switch Client:</span>
          <select
            value={selectedClient.id}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.id})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client Profile Hero Card */}
      <section className="w-full bg-surface-container-lowest rounded-xl shadow-sm p-space-xl mb-space-lg relative overflow-hidden border border-outline-variant/30">
        <div className="absolute -right-24 -top-24 w-96 h-96 rounded-full bg-primary/5 pointer-events-none blur-3xl" />
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-space-lg relative z-10">
          <div className="flex items-start gap-space-lg">
            <div className="relative w-16 h-16 rounded-xl bg-surface-container flex items-center justify-center text-primary shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[34px]">corporate_fare</span>
              <span
                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-container text-on-primary text-[12px] shadow-sm"
                title="Verified Corporate Entity"
              >
                <span className="material-symbols-outlined text-[13px]">verified</span>
              </span>
            </div>
            <div className="flex flex-col min-w-0">
              <div className="flex flex-wrap items-center gap-space-sm mb-space-xs">
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold tracking-tight">
                  {selectedClient.name}
                </h1>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-secondary font-label-sm text-label-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {selectedClient.entityType}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm">
                  EIN: {selectedClient.ein}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-1 gap-x-space-md text-secondary font-body-sm text-body-sm">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">business</span>
                  {selectedClient.industry}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  {selectedClient.city}, {selectedClient.state}
                </span>
                <span className="text-outline-variant">•</span>
                <span className="flex items-center gap-1 text-primary font-medium">
                  <span className="material-symbols-outlined text-[16px]">folder_special</span>
                  Client ID: #{selectedClient.id}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Cluster */}
          <div className="flex flex-wrap items-center gap-space-xs self-start lg:self-center">
            <button
              onClick={() => showToast('Opening Secure Document Upload Vault...')}
              className="h-9 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-space-xs shadow-sm transition-all border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">upload_file</span>
              <span>Upload Document</span>
            </button>
            <button
              onClick={() => showToast('Meeting logger opened.')}
              className="h-9 px-space-md bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-label-md text-label-md flex items-center gap-space-xs shadow-sm transition-all border border-outline-variant/30"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-secondary">phone_in_talk</span>
              <span>Log Meeting</span>
            </button>
            <button
              onClick={() => setActiveModal('logTime')}
              className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs shadow-sm transition-all"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">more_time</span>
              <span>+ Log Time</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <div className="flex border-b border-outline-variant/30 mt-space-lg -mb-space-xl overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-space-lg py-3 font-label-md text-label-md whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary font-bold'
                  : 'border-transparent text-secondary hover:text-on-surface hover:border-outline-variant'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-space-lg">
          {/* 4 Financial Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <span className="font-caption text-caption uppercase text-secondary font-semibold">
                Annual Retainer
              </span>
              <p className="font-metric-lg text-metric-lg font-bold text-on-surface mt-1">
                ${(selectedClient.annualRetainer || 0).toLocaleString()}
              </p>
              <span className="font-caption text-caption text-emerald-700 font-semibold">
                Active • Monthly recurring
              </span>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <span className="font-caption text-caption uppercase text-secondary font-semibold">
                Unbilled WIP Balance
              </span>
              <p className="font-metric-lg text-metric-lg font-bold text-primary mt-1">
                ${(selectedClient.wipBalance || 0).toLocaleString()}
              </p>
              <span className="font-caption text-caption text-secondary">
                Ready for batch milestone billing
              </span>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <span className="font-caption text-caption uppercase text-secondary font-semibold">
                Historical Realization
              </span>
              <p className="font-metric-lg text-metric-lg font-bold text-emerald-700 mt-1">
                {selectedClient.realizationRate}%
              </p>
              <span className="font-caption text-caption text-secondary">
                +2.4% above firm baseline
              </span>
            </div>

            <div className="p-space-lg rounded-xl bg-surface-container-lowest shadow-sm border border-outline-variant/30">
              <span className="font-caption text-caption uppercase text-secondary font-semibold">
                Outstanding AR Balance
              </span>
              <p className="font-metric-lg text-metric-lg font-bold text-on-surface mt-1">
                ${(selectedClient.arBalance || 0).toLocaleString()}
              </p>
              <span className="font-caption text-caption text-emerald-700 font-semibold">
                Current • Net 30 Terms
              </span>
            </div>
          </div>

          {/* 2-Column Details Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
            {/* Left 2 Cols: Active Workflows & Subsidiaries */}
            <div className="lg:col-span-2 space-y-space-lg">
              {/* Active Engagements Pipeline */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">view_kanban</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Active Compliance &amp; Advisory Pipelines
                    </h2>
                  </div>
                  <button
                    onClick={() => navigate('/workflows')}
                    className="text-xs font-label-sm text-primary hover:underline flex items-center gap-0.5"
                  >
                    View All Workflows
                    <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                  </button>
                </div>

                <div className="space-y-space-sm">
                  <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs shrink-0">
                        1120S
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          FY23 Form 1120-S &amp; Multi-State Apportionment
                        </span>
                        <span className="font-caption text-caption text-secondary">
                          State returns: DE-1100S, PA-20S, NJ-CBT • Lead: Manoj Khanal
                        </span>
                        <div className="w-48 bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
                          <div className="bg-primary h-full rounded-full" style={{ width: '75%' }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-sm self-end md:self-center">
                      <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-label-sm text-xs font-semibold">
                        Tie-Out Prep (75%)
                      </span>
                      <button
                        onClick={() => navigate('/workflows')}
                        className="h-8 px-3 bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded font-label-sm text-xs border border-outline-variant/30"
                      >
                        Inspect Job
                      </button>
                    </div>
                  </div>

                  <div className="p-space-md rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
                    <div className="flex items-start gap-space-sm">
                      <div className="w-9 h-9 rounded-lg bg-surface-container text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        EST
                      </div>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          Q1 2024 Estimated Federal &amp; State Tax Calculation
                        </span>
                        <span className="font-caption text-caption text-secondary">
                          Voucher Form 1120-W • Partner Review Complete
                        </span>
                        <div className="w-48 bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
                          <div className="bg-emerald-600 h-full rounded-full" style={{ width: '90%' }} />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-space-sm self-end md:self-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-label-sm text-xs font-semibold">
                        Ready to Transmit
                      </span>
                      <button
                        onClick={() => showToast('Transmitted payment voucher to client portal.')}
                        className="h-8 px-3 bg-primary hover:bg-primary-container text-on-primary rounded font-label-sm text-xs"
                      >
                        Transmit
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Corporate Structure & Associated Entities */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">account_tree</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Corporate Structure &amp; Subsidiary Entities
                    </h2>
                  </div>
                  <span className="font-caption text-caption uppercase text-secondary font-semibold">
                    Consolidated Entity Tree
                  </span>
                </div>

                <div className="space-y-space-sm">
                  {selectedClient.associatedEntities && selectedClient.associatedEntities.length > 0 ? (
                    selectedClient.associatedEntities.map((sub, idx) => (
                      <div
                        key={idx}
                        className="p-space-sm px-space-md rounded-lg bg-surface-container-low flex items-center justify-between border border-outline-variant/20"
                      >
                        <div className="flex items-center gap-space-sm">
                          <span className="material-symbols-outlined text-[18px] text-primary">hub</span>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md font-semibold text-on-surface">
                              {sub.name}
                            </span>
                            <span className="font-caption text-caption text-secondary">
                              EIN: {sub.ein} • {sub.role}
                            </span>
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold">
                          {sub.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-secondary text-sm p-4 text-center">
                      No subsidiary entities registered for this record.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column: Key Contacts & Firm Engagement Team */}
            <div className="space-y-space-lg">
              {/* Primary Client Contacts */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">contacts</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Primary Client Contacts
                    </h2>
                  </div>
                  <button
                    onClick={() => showToast('Opening Add Contact modal...')}
                    className="text-xs text-primary font-semibold hover:underline"
                  >
                    + Add
                  </button>
                </div>

                <div className="space-y-space-sm">
                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/20">
                    <div className="w-9 h-9 rounded-full bg-surface-container text-primary font-bold flex items-center justify-center text-xs shrink-0">
                      AM
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">
                        Alan Morris
                      </span>
                      <span className="font-caption text-caption text-secondary">Corporate Controller</span>
                      <span className="font-caption text-caption text-primary mt-1">
                        +1 (302) 555-0192 • ext. 118
                      </span>
                      <span className="font-caption text-caption text-secondary">
                        amorris@vanguardlogistics.com
                      </span>
                    </div>
                  </div>

                  <div className="p-space-sm rounded-lg bg-surface-container-low flex items-start gap-space-sm border border-outline-variant/20">
                    <div className="w-9 h-9 rounded-full bg-surface-container text-primary font-bold flex items-center justify-center text-xs shrink-0">
                      AS
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-md text-label-md font-semibold text-on-surface">
                        Ashmita
                      </span>
                      <span className="font-caption text-caption text-secondary">VP of Finance / CFO</span>
                      <span className="font-caption text-caption text-primary mt-1">
                        +1 (302) 555-0190
                      </span>
                      <span className="font-caption text-caption text-secondary">
                        ashmita@vanguardlogistics.com
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Firm Engagement Team */}
              <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
                <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-[20px] text-primary">group</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                      Firm Engagement Team
                    </h2>
                  </div>
                  <span className="font-caption text-caption uppercase text-secondary font-semibold">
                    Pod Delta
                  </span>
                </div>

                <div className="space-y-space-md">
                  {selectedClient.team ? (
                    selectedClient.team.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-space-sm">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${member.color}`}
                          >
                            {member.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md font-semibold text-on-surface">
                              {member.name}
                            </span>
                            <span className="font-caption text-caption text-secondary">{member.role}</span>
                          </div>
                        </div>
                        <span className="font-caption text-caption text-primary font-mono font-medium">
                          {member.hours}
                        </span>
                      </div>
                    ))
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alternate tab placeholder */}
      {activeTab !== 'overview' && (
        <div className="p-space-2xl bg-surface-container-lowest rounded-xl shadow-sm text-center border border-outline-variant/30">
          <span className="material-symbols-outlined text-[36px] text-primary mb-2">folder_open</span>
          <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
            {tabs.find(t => t.id === activeTab)?.label}
          </h3>
          <p className="font-body-sm text-body-sm text-secondary mt-1 max-w-md mx-auto">
            Live records and secure client ledger data synchronized from LedgerPoint OS. All documents and attachments encrypted in compliance with SOC-2 &amp; IRS 4557 standards.
          </p>
        </div>
      )}
    </div>
  );
}
