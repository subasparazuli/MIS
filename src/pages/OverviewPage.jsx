import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { partnerWorkloads, criticalAlerts, auditActivities } from '../data/mockData';

export default function OverviewPage() {
  const navigate = useNavigate();
  const { setActiveModal, setSelectedClientId, showToast } = useApp();
  const [timeRange, setTimeRange] = useState('quarter');

  const handleExport = () => {
    showToast('Exporting Executive Operations Report (PDF/Excel)...');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Sub-header Notification Banner & Operational Status */}
      <div className="py-space-md flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div>
          <div className="flex items-center gap-space-xs text-secondary font-label-sm uppercase tracking-wider">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Operational Readiness • Fiscal Q2 2024</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">
            Good morning, Elena. Tax deadline in <span className="text-primary font-bold">14 days</span>.
          </h1>
          <p className="font-body-md text-body-md text-secondary">
            All partner queues synchronized. Priority attention recommended on 7 unconfirmed Schedule K-1 schedules.
          </p>
        </div>

        {/* Actions & Timeline Selector */}
        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <div className="flex items-center bg-surface-container-low p-1 rounded-lg shadow-sm border border-outline-variant/30">
            <button
              onClick={() => setTimeRange('quarter')}
              className={`px-space-md py-1 rounded font-label-sm transition ${
                timeRange === 'quarter'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              Current Quarter
            </button>
            <button
              onClick={() => setTimeRange('ytd')}
              className={`px-space-md py-1 rounded font-label-sm transition ${
                timeRange === 'ytd'
                  ? 'bg-surface-container-lowest text-on-surface shadow-sm font-semibold'
                  : 'text-secondary hover:text-on-surface'
              }`}
            >
              FY 2024 YTD
            </button>
          </div>
          <button
            onClick={handleExport}
            className="h-9 px-space-md bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md rounded-lg flex items-center gap-space-xs shadow-sm transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">download</span>
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* Top Metric KPI Row (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md mb-space-xl">
        {/* 1. Active Engagements */}
        <div
          onClick={() => navigate('/clients')}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between relative overflow-hidden group hover:shadow-md transition cursor-pointer border border-outline-variant/30"
        >
          <div className="flex items-start justify-between mb-space-sm">
            <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">Active Engagements</span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm flex items-center gap-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">trending_up</span> 12% YoY
            </span>
          </div>
          <div className="flex items-baseline gap-space-sm mb-space-sm">
            <span className="font-display text-display text-on-surface font-bold tracking-tight">142</span>
            <span className="font-body-sm text-body-sm text-secondary">total engagements</span>
          </div>
          <div className="space-y-space-xs pt-space-xs">
            <div className="flex h-1.5 w-full rounded-full overflow-hidden bg-surface-container gap-0.5">
              <div className="bg-primary h-full" style={{ width: '69%' }} title="Tax: 98" />
              <div className="bg-surface-tint h-full" style={{ width: '22%' }} title="Advisory: 31" />
              <div className="bg-secondary h-full" style={{ width: '9%' }} title="Audit: 13" />
            </div>
            <div className="flex items-center justify-between font-caption text-caption text-secondary pt-1">
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />98 Tax</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-surface-tint inline-block" />31 Advisory</span>
              <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />13 Audit</span>
            </div>
          </div>
        </div>

        {/* 2. Billed YTD & WIP */}
        <div
          onClick={() => navigate('/billing-and-wip')}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer border border-outline-variant/30"
        >
          <div className="flex items-start justify-between mb-space-sm">
            <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">Billed YTD &amp; WIP</span>
            <span className="px-space-xs py-0.5 rounded bg-emerald-50 text-emerald-700 font-label-sm flex items-center gap-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">attach_money</span> On Track
            </span>
          </div>
          <div className="flex items-baseline gap-space-sm mb-space-sm">
            <span className="font-display text-display text-on-surface font-bold tracking-tight">$1.48M</span>
            <span className="font-body-sm text-body-sm text-secondary">billed YTD</span>
          </div>
          <div className="pt-space-xs flex items-center justify-between text-secondary border-t border-outline-variant/20">
            <span className="font-body-sm text-body-sm">Unbilled WIP Inventory:</span>
            <span className="font-metric-md text-metric-md text-primary font-bold tabular-nums">$218,450</span>
          </div>
        </div>

        {/* 3. Realization Rate */}
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition border border-outline-variant/30">
          <div className="flex items-start justify-between mb-space-sm">
            <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">Realization Rate</span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm flex items-center gap-0.5 font-bold">
              <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +2.1%
            </span>
          </div>
          <div className="flex items-baseline gap-space-sm mb-space-sm">
            <span className="font-display text-display text-on-surface font-bold tracking-tight">94.2%</span>
            <span className="font-body-sm text-body-sm text-secondary">firm target: 92.0%</span>
          </div>
          <div className="space-y-space-xs pt-space-xs">
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: '94.2%' }} />
            </div>
            <div className="flex items-center justify-between font-caption text-caption text-secondary pt-1">
              <span>Standard: $425/hr</span>
              <span className="text-emerald-700 font-semibold">+1.8% Effective</span>
            </div>
          </div>
        </div>

        {/* 4. Pipeline Throughput */}
        <div
          onClick={() => navigate('/workflows')}
          className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between hover:shadow-md transition cursor-pointer border border-outline-variant/30"
        >
          <div className="flex items-start justify-between mb-space-sm">
            <span className="font-label-sm text-secondary uppercase tracking-wider font-semibold">Pipeline Throughput</span>
            <span className="px-space-xs py-0.5 rounded bg-surface-container-high text-primary font-label-sm flex items-center gap-0.5 font-bold">
              84% Filed
            </span>
          </div>
          <div className="flex items-baseline gap-space-sm mb-space-sm">
            <span className="font-display text-display text-on-surface font-bold tracking-tight">188 <span className="text-secondary text-2xl font-normal">/ 248</span></span>
          </div>
          <div className="space-y-space-xs pt-space-xs">
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '84%' }} />
            </div>
            <div className="flex items-center justify-between font-caption text-caption text-secondary pt-1">
              <span>36 in Partner Review</span>
              <span className="text-error font-semibold">24 Urgent Prep</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-lg">
        {/* Left Column (2 Cols wide): Partner Workloads & Bottleneck Alerts */}
        <div className="lg:col-span-2 space-y-space-lg">
          {/* Partner Workload Matrix */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">groups</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Partner Workload &amp; Capacity Matrix
                </h2>
              </div>
              <span className="font-caption text-caption uppercase text-secondary font-semibold">
                April 2024 Utilization
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase">
                    <th className="pb-3 font-semibold">Partner</th>
                    <th className="pb-3 font-semibold">Engagements</th>
                    <th className="pb-3 font-semibold">Capacity</th>
                    <th className="pb-3 font-semibold">Billable YTD</th>
                    <th className="pb-3 font-semibold">WIP Managed</th>
                    <th className="pb-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {partnerWorkloads.map((pw) => (
                    <tr key={pw.name} className="hover:bg-surface-container-low/50 transition">
                      <td className="py-3">
                        <div className="flex items-center gap-space-sm">
                          {pw.avatar ? (
                            <img src={pw.avatar} alt={pw.name} className="w-8 h-8 rounded-full object-cover shadow-xs" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-surface-container text-primary font-bold flex items-center justify-center text-xs">
                              {pw.initials}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="font-label-md text-label-md font-semibold text-on-surface">{pw.name}</span>
                            <span className="font-caption text-caption text-secondary">{pw.title}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 font-body-md text-body-md font-semibold text-on-surface">
                        {pw.activeEngagements}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-surface-container h-2 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                pw.capacityPercent > 90 ? 'bg-error' : pw.capacityPercent > 80 ? 'bg-primary' : 'bg-emerald-600'
                              }`}
                              style={{ width: `${pw.capacityPercent}%` }}
                            />
                          </div>
                          <span className={`font-mono text-xs font-bold ${
                            pw.capacityPercent > 90 ? 'text-error' : 'text-on-surface'
                          }`}>
                            {pw.capacityPercent}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-body-md font-medium text-secondary">
                        {pw.billableYtd}h
                      </td>
                      <td className="py-3 font-mono text-body-md font-bold text-primary">
                        {pw.wipManaged}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setActiveModal('logTime');
                          }}
                          className="h-7 px-2.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-xs transition"
                        >
                          Log Time
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Urgent Bottlenecks & Critical Filing Blockers */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-error">warning</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Critical Filing Blockers &amp; Action Items
                </h2>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-error font-caption font-bold">
                Requires Immediate Review
              </span>
            </div>

            <div className="space-y-space-sm">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-space-md rounded-lg border flex flex-col md:flex-row md:items-center justify-between gap-space-sm ${
                    alert.severity === 'critical'
                      ? 'bg-rose-50/60 border-rose-200'
                      : alert.severity === 'warning'
                      ? 'bg-amber-50/60 border-amber-200'
                      : 'bg-indigo-50/60 border-indigo-200'
                  }`}
                >
                  <div className="flex items-start gap-space-sm">
                    <span className={`material-symbols-outlined text-[22px] mt-0.5 ${
                      alert.severity === 'critical' ? 'text-error' : alert.severity === 'warning' ? 'text-amber-600' : 'text-primary'
                    }`}>
                      {alert.severity === 'critical' ? 'error' : alert.severity === 'warning' ? 'schedule' : 'history_edu'}
                    </span>
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-label-md text-label-md font-bold text-on-surface">
                          {alert.title}
                        </span>
                        <span className="font-mono text-xs px-1.5 py-0.2 rounded bg-surface-container-lowest text-secondary border border-outline-variant/40">
                          {alert.code}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-secondary mt-0.5">
                        {alert.desc}
                      </p>
                      <span className="font-caption text-xs text-outline mt-1 font-medium">
                        Entity: <strong>{alert.client}</strong> • Logged {alert.time}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-space-xs self-end md:self-center">
                    <button
                      onClick={() => {
                        if (alert.client.includes('Beacon')) {
                          setSelectedClientId('BM-3301');
                          navigate('/client-360');
                        } else if (alert.client.includes('Summit')) {
                          setSelectedClientId('SR-9012');
                          navigate('/client-360');
                        } else {
                          setSelectedClientId('AD-4102');
                          navigate('/client-360');
                        }
                      }}
                      className="h-8 px-space-md bg-surface-container-lowest hover:bg-surface-container text-on-surface rounded-lg font-label-sm text-label-sm shadow-xs border border-outline-variant/30 transition"
                    >
                      Inspect Entity
                    </button>
                    <button
                      onClick={() => navigate('/workflows')}
                      className="h-8 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-sm text-label-sm transition"
                    >
                      Fix Return
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity Feed & Upcoming Tax Calendar */}
        <div className="space-y-space-lg">
          {/* Recent Audit & Filing Activity */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">history</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Firm Activity Stream
                </h2>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-space-md">
              {auditActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-space-sm pb-space-sm border-b border-outline-variant/15 last:border-0 last:pb-0">
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-primary shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[18px]">{act.icon}</span>
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-label-sm text-label-sm font-semibold text-on-surface line-clamp-1">
                      {act.action}
                    </span>
                    <span className="font-caption text-caption text-secondary">
                      Entity: {act.client}
                    </span>
                    <span className="font-caption text-[11px] text-outline mt-0.5">
                      By {act.user} • {act.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Filing Deadlines */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg border border-outline-variant/30">
            <div className="flex items-center justify-between mb-space-md pb-space-xs border-b border-outline-variant/20">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-[20px] text-primary">calendar_month</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Statutory Deadlines
                </h2>
              </div>
              <span className="font-caption text-caption text-secondary uppercase font-semibold">Q2 2024</span>
            </div>

            <div className="space-y-space-sm">
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm font-bold text-on-surface">Apr 15, 2024</p>
                  <p className="font-caption text-caption text-secondary">Forms 1040, 1120, Q1 Est. Tax</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-error-container text-error font-bold font-caption">
                  14 Days
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm font-bold text-on-surface">May 15, 2024</p>
                  <p className="font-caption text-caption text-secondary">Form 990 Exempt Org Filings</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-bold font-caption">
                  44 Days
                </span>
              </div>
              <div className="p-space-sm rounded-lg bg-surface-container-low flex items-center justify-between">
                <div>
                  <p className="font-label-sm text-label-sm font-bold text-on-surface">Jun 17, 2024</p>
                  <p className="font-caption text-caption text-secondary">Q2 Estimated Tax Payments</p>
                </div>
                <span className="px-2 py-0.5 rounded bg-surface-container text-secondary font-bold font-caption">
                  77 Days
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
