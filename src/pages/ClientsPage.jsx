import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DataLinkIcon from '../components/common/DataLinkIcon';

export default function ClientsPage() {
  const navigate = useNavigate();
  const { clients, setSelectedClientId, setActiveModal, showToast } = useApp();

  const [search, setSearch] = useState('');
  const [softwareFilter, setSoftwareFilter] = useState('all');
  const [entityFilter, setEntityFilter] = useState('all');
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('mis_clients_view_mode') || 'grid');

  const handleSetViewMode = (mode) => {
    setViewMode(mode);
    localStorage.setItem('mis_clients_view_mode', mode);
  };

  const filteredClients = clients.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        c.name.toLowerCase().includes(q) ||
        (c.abn || '').replace(/\s/g, '').includes(q.replace(/\s/g, '')) ||
        (c.software || '').toLowerCase().includes(q) ||
        (c.contactEmail || '').toLowerCase().includes(q) ||
        (c.director || '').toLowerCase().includes(q) ||
        (c.id || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (softwareFilter !== 'all' && (c.software || '').toLowerCase() !== softwareFilter.toLowerCase()) return false;
    if (entityFilter !== 'all' && !(c.entityType || '').includes(entityFilter)) return false;
    return true;
  });

  const handleSelectClient = (client) => {
    setSelectedClientId(client.id);
    navigate(`/clients/${client.id}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Page Title */}
      <div className="py-space-md flex flex-col sm:flex-row sm:items-center justify-between gap-space-md border-b border-outline-variant/20 mb-space-md">
        <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          Clients Directory
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('addClient')}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">domain_add</span>
            <span>Add New Client</span>
          </button>

          <button
            type="button"
            onClick={() => showToast(`Exported ${filteredClients.length} Australian entity records to CSV.`)}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs mb-space-md">
        <div className="flex flex-1 items-center gap-2 max-w-md">
          <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, software, email, or ABN..."
            className="w-full text-xs bg-transparent focus:outline-none placeholder:text-outline text-on-surface"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Software Filter */}
          <select
            value={softwareFilter}
            onChange={(e) => setSoftwareFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Software</option>
            <option value="Quickbook">Quickbook</option>
            <option value="Xero">Xero</option>
            <option value="MYOB">MYOB</option>
          </select>

          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="h-8 px-2.5 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">All Entity Types</option>
            <option value="Company">Proprietary Limited Company</option>
            <option value="Trust">Discretionary Trust</option>
            <option value="Partnership">Partnership</option>
          </select>

          {/* Grid / List View Switcher */}
          <div className="flex items-center p-0.5 bg-surface-container rounded-lg border border-outline-variant/30">
            <button
              type="button"
              onClick={() => handleSetViewMode('grid')}
              className={`h-7 px-2.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'grid'
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
              title="Grid View"
            >
              <span className="material-symbols-outlined text-[16px]">grid_view</span>
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              onClick={() => handleSetViewMode('list')}
              className={`h-7 px-2.5 rounded-md text-xs font-bold flex items-center gap-1 transition ${
                viewMode === 'list'
                  ? 'bg-surface-container-lowest text-primary shadow-2xs'
                  : 'text-secondary hover:text-on-surface'
              }`}
              title="List View"
            >
              <span className="material-symbols-outlined text-[16px]">view_list</span>
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {/* Clients View: Grid or List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {filteredClients.map((client) => {
          return (
            <div
              key={client.id}
              onClick={() => handleSelectClient(client)}
              className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs hover:border-primary hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Entity Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-on-primary transition-colors shrink-0">
                    <span className="material-symbols-outlined text-[22px]">corporate_fare</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Software Tag */}
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        client.software === 'Xero'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {client.software || 'Quickbook'}
                    </span>

                    {client.flagsCount > 0 ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        {client.flagsCount} Flags
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Active
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-sm text-on-surface group-hover:text-primary transition-colors leading-tight mb-1 inline-flex items-center flex-wrap">
                  <span>{client.name}</span>
                  {client.dataLinkType === 'With Data Link' && <DataLinkIcon />}
                </h3>

                <div className="flex flex-col gap-1 text-xs text-secondary mb-3">
                  {client.contactEmail && (
                    <span className="text-[11px] font-mono text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-secondary">mail</span>
                      {client.contactEmail}
                    </span>
                  )}
                  <span className="font-mono text-[11px] text-secondary">Payrun: {client.payrollFrequency || 'Fortnightly'}</span>
                  <span className="text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">location_on</span>
                    {client.city || 'Adelaide'}, {client.state || 'SA'}
                  </span>
                </div>

                {/* Subscribed Services */}
                <div className="pt-2 border-t border-outline-variant/20 mb-3">
                  <span className="text-[10px] uppercase font-bold text-secondary block mb-1">
                    Active Services:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(
                      new Set((client.activeServices || ['bas', 'payslip']).filter((s) => s === 'bas' || s === 'payslip'))
                    ).map((svc) => (
                      <span
                        key={svc}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface capitalize"
                      >
                        {svc === 'bas'
                          ? 'BAS / GST'
                          : 'Wage / Payroll'}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs">
                <span className="text-secondary text-[11px]">Software: <strong className="text-on-surface">{client.software || 'Quickbook'}</strong></span>
                <span className="text-primary font-bold text-xs flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  View Profile &rarr;
                </span>
              </div>
            </div>
          );
        })}
      </div>
      ) : (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs min-w-[880px]">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold text-[11px] tracking-wide">
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 min-w-[220px]">Client Name</th>
                  <th className="py-2.5 px-3">Software</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Payrun</th>
                  <th className="py-2.5 px-3">Active Services</th>
                  <th className="py-2.5 px-3">Location</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15">
                {filteredClients.map((client, idx) => (
                  <tr
                    key={client.id}
                    onClick={() => handleSelectClient(client)}
                    className="hover:bg-surface-container-low/60 transition cursor-pointer group"
                  >
                    <td className="py-2.5 px-3 text-center text-secondary font-mono text-[11px]">
                      {idx + 1}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface group-hover:text-primary transition inline-flex items-center flex-wrap">
                          <span>{client.name}</span>
                          {client.dataLinkType === 'With Data Link' && <DataLinkIcon />}
                        </span>
                        {client.entityType && (
                          <span className="text-[10px] text-secondary">{client.entityType}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                          client.software === 'Xero'
                            ? 'bg-sky-50 text-sky-800 border-sky-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        {client.software || 'Quickbook'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-secondary">
                      {client.contactEmail || '-'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-on-surface">
                      {client.payrollFrequency || 'Fortnightly'}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex flex-wrap gap-1">
                        {Array.from(
                          new Set((client.activeServices || ['bas', 'payslip']).filter((s) => s === 'bas' || s === 'payslip'))
                        ).map((svc) => (
                          <span
                            key={svc}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-surface-container text-on-surface"
                          >
                            {svc === 'bas' ? 'BAS / GST' : 'Wage / Payroll'}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[11px] text-secondary">
                      {client.city || 'Adelaide'}, {client.state || 'SA'}
                    </td>
                    <td className="py-2.5 px-3">
                      {client.flagsCount > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 inline-flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          {client.flagsCount} Flags
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="text-primary font-bold text-xs whitespace-nowrap">
                        View &rarr;
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredClients.length === 0 && (
        <div className="p-10 text-center text-xs text-secondary bg-surface-container-lowest rounded-xl border border-outline-variant/30 mt-3">
          No clients matching your search or filters.
        </div>
      )}
    </div>
  );
}
