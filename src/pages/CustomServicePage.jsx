import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function CustomServicePage() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { services, clients, deleteServiceType, setSelectedClientId, showToast } = useApp();

  const service = services.find((s) => s.path === `/services/${serviceId}` || s.id === serviceId) || {
    id: serviceId,
    name: 'Custom Service',
    description: 'Advisory and compliance practice workflow module.',
    icon: 'star',
    category: 'Advisory',
    frequency: 'Ad-Hoc'
  };

  const handleInspectClient = (clientId) => {
    setSelectedClientId(clientId);
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Page Title */}
      <div className="py-space-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20 mb-space-md">
        <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          {service.name}
        </h1>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => showToast(`Initiated workflow batch for ${service.name}...`)}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>Create Service Engagement</span>
          </button>

          {!service.isDefault && (
            <button
              type="button"
              onClick={() => {
                deleteServiceType(service.id);
                navigate('/quick-view');
              }}
              className="h-9 px-3 bg-red-50 hover:bg-red-100 text-error rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-red-200 shadow-xs transition"
            >
              <span className="material-symbols-outlined text-[18px]">delete</span>
              <span>Remove Service</span>
            </button>
          )}
        </div>
      </div>

      {/* Service Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-sm mb-space-lg">
        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-xs font-bold text-secondary uppercase block">Service Category</span>
          <span className="text-lg font-bold text-on-surface mt-1 block">{service.category || 'General Practice'}</span>
          <span className="text-[11px] text-secondary">Billing Schedule: {service.frequency || 'Quarterly'}</span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-xs font-bold text-secondary uppercase block">Subscribed Clients</span>
          <span className="text-lg font-bold text-primary mt-1 block">{clients.length} Eligible Entities</span>
          <span className="text-[11px] text-secondary">Available for all enrolled corporate entities</span>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-lowest border border-outline-variant/30 shadow-xs">
          <span className="text-xs font-bold text-secondary uppercase block">Compliance Checklist</span>
          <span className="text-lg font-bold text-emerald-700 mt-1 block">Standard SOP Ready</span>
          <span className="text-[11px] text-emerald-600">ATO &amp; Australian Accounting Standards</span>
        </div>
      </div>

      {/* Eligible Client Entities for this Service */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="p-3 border-b border-outline-variant/20 flex items-center justify-between">
          <h2 className="font-bold text-xs uppercase tracking-wider text-secondary">
            Enrolled Client Entities for {service.name}
          </h2>
          <span className="text-xs text-primary font-semibold">{clients.length} Active Clients</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                <th className="py-2.5 px-3">Entity Name</th>
                <th className="py-2.5 px-3">ABN</th>
                <th className="py-2.5 px-3">Entity Type</th>
                <th className="py-2.5 px-3">Director</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 font-normal">
              {clients.map((c) => (
                <tr key={c.id} className="hover:bg-surface-container-low/50 transition">
                  <td className="py-3 px-3 font-semibold text-primary">{c.name}</td>
                  <td className="py-3 px-3 font-mono text-secondary">{c.abn}</td>
                  <td className="py-3 px-3 text-secondary">{c.entityType}</td>
                  <td className="py-3 px-3 font-medium text-on-surface">{c.director}</td>
                  <td className="py-3 px-3">{c.state}</td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => handleInspectClient(c.id)}
                      className="h-7 px-2.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] font-semibold transition border border-outline-variant/30"
                    >
                      Open Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
