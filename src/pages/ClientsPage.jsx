import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, setSelectedClientId, setActiveModal, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [entityFilter, setEntityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [partnerFilter, setPartnerFilter] = useState('all');
  const [tierFilter, setTierFilter] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // Filtering logic
  const filteredClients = clients.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        c.ein.includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.industry.toLowerCase().includes(q) ||
        c.leadPartner.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (entityFilter !== 'all' && c.entityType !== entityFilter) return false;
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (partnerFilter !== 'all' && !c.leadPartner.includes(partnerFilter)) return false;
    if (tierFilter !== 'all' && !c.retainerTier.toLowerCase().includes(tierFilter.toLowerCase())) return false;
    return true;
  });

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(filteredClients.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const resetAllFilters = () => {
    setSearch('');
    setEntityFilter('all');
    setStatusFilter('all');
    setPartnerFilter('all');
    setTierFilter('all');
    showToast('Filters reset to default.');
  };

  const handleGoToClient = (client) => {
    setSelectedClientId(client.id);
    navigate('/client-360');
  };

  const handleExportCSV = () => {
    showToast(`Exported ${filteredClients.length} entity records to CSV.`);
  };

  const handleResync = () => {
    showToast('Re-syncing QBO & Xero general ledger feeds...');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Utility Bar / Command strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-md py-space-lg">
        <div className="flex items-center gap-space-md">
          <div className="flex items-baseline gap-space-sm">
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-bold">
              Client Directory
            </h1>
            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold">
              {clients.length} Active Entities
            </span>
          </div>
          <div className="hidden xl:flex items-center gap-space-xs text-secondary font-caption text-caption pl-space-xs">
            <span className="w-2 h-2 rounded-full bg-primary inline-block" />
            <span>IRS e-Services Synced 8m ago</span>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="flex flex-wrap items-center gap-space-sm">
          <button
            onClick={handleExportCSV}
            className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs shadow-sm transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span>Export CSV</span>
          </button>
          <button
            onClick={handleResync}
            className="h-9 px-space-md bg-surface-container-lowest hover:bg-surface-container-low text-on-surface rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs shadow-sm transition-colors border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">sync_alt</span>
            <span>Re-Sync QBO/Xero</span>
          </button>
          <button
            onClick={() => setActiveModal('addClient')}
            className="h-9 px-space-md bg-primary hover:bg-primary-container text-on-primary rounded-lg font-label-md text-label-md uppercase tracking-wider flex items-center gap-space-xs shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>+ Add New Entity</span>
          </button>
        </div>
      </div>

      {/* Metric Snapshot Banner (Data-dense KPI preview) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md mb-space-lg">
        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-caption text-caption uppercase text-secondary font-medium tracking-wider">
              Total Retainer Base
            </span>
            <span className="font-metric-lg text-metric-lg font-bold text-on-surface mt-0.5">
              $3,420,800<span className="font-body-sm text-body-sm text-secondary font-normal">/yr</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">payments</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-caption text-caption uppercase text-secondary font-medium tracking-wider">
              Form 1120/1065 Filed
            </span>
            <span className="font-metric-lg text-metric-lg font-bold text-on-surface mt-0.5">
              188 <span className="text-primary font-label-md text-label-md font-semibold">/ 248</span>
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[22px]">fact_check</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-caption text-caption uppercase text-secondary font-medium tracking-wider">
              Action / 1099 Flags
            </span>
            <span className="font-metric-lg text-metric-lg font-bold text-error mt-0.5">
              22 Entities
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 flex items-center justify-center text-error">
            <span className="material-symbols-outlined text-[22px]">flag</span>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between border border-outline-variant/30">
          <div className="flex flex-col">
            <span className="font-caption text-caption uppercase text-secondary font-medium tracking-wider">
              Practice Realization
            </span>
            <span className="font-metric-lg text-metric-lg font-bold text-emerald-700 mt-0.5">
              94.8%
            </span>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
            <span className="material-symbols-outlined text-[22px]">trending_up</span>
          </div>
        </div>
      </div>

      {/* Multi-Faceted Filter Multi-Bar */}
      <div className="p-space-md rounded-xl bg-surface-container-lowest shadow-sm flex flex-wrap items-center justify-between gap-space-md mb-space-md border border-outline-variant/30">
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
              placeholder="Search entity, EIN, partner..."
              className="w-full h-8 pl-8 pr-space-sm bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest border border-outline-variant/30"
            />
          </div>

          {/* Entity Type Dropdown */}
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Entity Types</option>
            <option value="S-Corp">S-Corporations</option>
            <option value="Partnership">Partnerships / LPs</option>
            <option value="C-Corp">C-Corporations</option>
            <option value="LLC">LLCs</option>
          </select>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Filing Statuses</option>
            <option value="Filed">Filed &amp; Accepted</option>
            <option value="In Progress">In Progress</option>
            <option value="Needs Review">Needs Partner Review</option>
            <option value="Blocked">Blocked</option>
          </select>

          {/* Partner Dropdown */}
          <select
            value={partnerFilter}
            onChange={(e) => setPartnerFilter(e.target.value)}
            className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Lead Partners</option>
            <option value="Elena">Elena Vance, CPA</option>
            <option value="Marcus">Marcus Reed</option>
            <option value="Sarah">Sarah Jenkins</option>
            <option value="David">David Miller</option>
          </select>

          {/* Tier Dropdown */}
          <select
            value={tierFilter}
            onChange={(e) => setTierFilter(e.target.value)}
            className="h-8 px-2 bg-surface-container-low rounded-lg font-body-sm text-body-sm text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Retainer Tiers</option>
            <option value="Tier 1">Tier 1 (&gt; $45k/yr)</option>
            <option value="Tier 2">Tier 2 ($25k-$45k)</option>
            <option value="Tier 3">Tier 3 (&lt; $25k)</option>
          </select>
        </div>

        <button
          onClick={resetAllFilters}
          className="text-xs font-label-sm text-secondary hover:text-primary transition"
        >
          Reset Filters
        </button>
      </div>

      {/* Selected Action Bar */}
      {selectedIds.length > 0 && (
        <div className="p-space-sm px-space-md mb-space-sm bg-primary-container text-on-primary rounded-lg flex items-center justify-between shadow-sm animate-fadeIn">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-md font-bold">{selectedIds.length} entities selected</span>
          </div>
          <div className="flex items-center gap-space-xs">
            <button
              onClick={() => showToast(`Initiated batch billing for ${selectedIds.length} entities.`)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold"
            >
              Batch Generate Invoices
            </button>
            <button
              onClick={() => showToast(`Exported ${selectedIds.length} entities.`)}
              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded text-xs font-semibold"
            >
              Export Selected
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Client Data Table */}
      <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low/60 border-b border-outline-variant/30 text-secondary font-label-sm text-label-sm uppercase">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedIds.length === filteredClients.length && filteredClients.length > 0}
                    className="rounded text-primary focus:ring-primary"
                  />
                </th>
                <th className="py-3 px-4 font-semibold">Client Entity &amp; ID</th>
                <th className="py-3 px-4 font-semibold">Entity Type</th>
                <th className="py-3 px-4 font-semibold">Lead Partner</th>
                <th className="py-3 px-4 font-semibold">Filing Status</th>
                <th className="py-3 px-4 font-semibold">Retainer Base</th>
                <th className="py-3 px-4 font-semibold">WIP Balance</th>
                <th className="py-3 px-4 font-semibold">Realization</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredClients.map((client) => {
                const isSelected = selectedIds.includes(client.id);
                return (
                  <tr
                    key={client.id}
                    className={`hover:bg-surface-container-low/50 transition cursor-pointer ${
                      isSelected ? 'bg-surface-container-high/40' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(client.id)}
                        className="rounded text-primary focus:ring-primary"
                      />
                    </td>
                    <td className="py-3.5 px-4" onClick={() => handleGoToClient(client)}>
                      <div className="flex flex-col">
                        <span className="font-label-md text-label-md font-bold text-on-surface hover:text-primary transition">
                          {client.name}
                        </span>
                        <span className="font-caption text-caption text-secondary">
                          EIN: {client.ein} • ID: {client.id} • {client.city}, {client.state}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4" onClick={() => handleGoToClient(client)}>
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-label-sm text-xs font-semibold bg-surface-container text-on-surface-variant">
                        {client.entityType}
                      </span>
                    </td>
                    <td className="py-3.5 px-4" onClick={() => handleGoToClient(client)}>
                      <span className="font-body-sm text-body-sm text-on-surface font-medium">
                        {client.leadPartner}
                      </span>
                    </td>
                    <td className="py-3.5 px-4" onClick={() => handleGoToClient(client)}>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-label-sm text-xs font-bold ${
                          client.status === 'Filed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : client.status === 'Needs Review'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : client.status === 'Blocked'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {client.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-body-sm font-semibold tabular-nums text-on-surface" onClick={() => handleGoToClient(client)}>
                      ${(client.annualRetainer || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-body-sm font-bold tabular-nums text-primary" onClick={() => handleGoToClient(client)}>
                      ${(client.wipBalance || 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-body-sm font-semibold text-emerald-700" onClick={() => handleGoToClient(client)}>
                      {client.realizationRate}%
                    </td>
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleGoToClient(client)}
                          title="Open Client 360 Detail"
                          className="h-8 px-2.5 bg-surface-container hover:bg-primary hover:text-on-primary text-on-surface rounded-lg font-label-sm text-xs transition flex items-center gap-1"
                        >
                          <span>Client 360</span>
                          <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
                        </button>
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
