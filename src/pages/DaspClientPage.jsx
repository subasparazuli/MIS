import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export default function DaspClientPage() {
  const { daspClients, addDaspClient, updateDaspClientField, deleteDaspClient } = useApp();

  const [search, setSearch] = useState('');
  const [newName, setNewName] = useState('');
  const [newStatus, setNewStatus] = useState('In progress');
  const [newFeeStatus, setNewFeeStatus] = useState('Unpaid');

  const filtered = daspClients.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      (c.name || '').toLowerCase().includes(q) ||
      (c.status || '').toLowerCase().includes(q) ||
      (c.feeStatus || '').toLowerCase().includes(q)
    );
  });

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    addDaspClient({
      name: newName.trim(),
      status: newStatus,
      feeStatus: newFeeStatus
    });
    setNewName('');
    setNewStatus('In progress');
    setNewFeeStatus('Unpaid');
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Page Title */}
      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 mb-4">
        <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          DASP Client
        </h1>

        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[16px]">
            search
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface-container-lowest text-xs text-on-surface border border-outline-variant/30 focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Simple Add Client Row */}
      <form
        onSubmit={handleAdd}
        className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 mb-4 shadow-2xs flex flex-wrap items-center gap-2"
      >
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Client name..."
          required
          className="flex-1 min-w-[180px] h-8 px-3 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/20 focus:border-primary focus:outline-none"
        />

        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="h-8 px-2.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
        >
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={newFeeStatus}
          onChange={(e) => setNewFeeStatus(e.target.value)}
          className="h-8 px-2.5 rounded-lg bg-surface-container text-xs font-semibold text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
        >
          <option value="Unpaid">Unpaid</option>
          <option value="Paid">Paid</option>
        </select>

        <button
          type="submit"
          className="h-8 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          <span>Add</span>
        </button>
      </form>

      {/* Clean DASP Client Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold text-[11px] tracking-wide">
                <th className="py-2.5 px-3 w-10 text-center">#</th>
                <th className="py-2.5 px-3 min-w-[220px]">Name</th>
                <th className="py-2.5 px-3 min-w-[160px]">Status</th>
                <th className="py-2.5 px-3 min-w-[160px]">Fee status</th>
                <th className="py-2.5 px-2 w-10 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15">
              {filtered.map((row, idx) => (
                <tr key={row.id} className="hover:bg-surface-container-low/60 transition group">
                  <td className="py-2 px-3 text-center text-secondary font-mono text-[11px]">
                    {idx + 1}
                  </td>

                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={row.name || ''}
                      onChange={(e) => updateDaspClientField(row.id, 'name', e.target.value)}
                      className="w-full text-xs font-semibold px-2 py-1 rounded bg-transparent hover:bg-surface-container-lowest focus:bg-surface-container-lowest border border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none text-on-surface"
                    />
                  </td>

                  <td className="py-2 px-3">
                    <select
                      value={row.status || 'In progress'}
                      onChange={(e) => updateDaspClientField(row.id, 'status', e.target.value)}
                      className={`w-full max-w-[160px] h-7 px-2 rounded-lg text-xs font-bold border transition focus:outline-none cursor-pointer ${
                        row.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}
                    >
                      <option value="In progress">In progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>

                  <td className="py-2 px-3">
                    <select
                      value={row.feeStatus || 'Unpaid'}
                      onChange={(e) => updateDaspClientField(row.id, 'feeStatus', e.target.value)}
                      className={`w-full max-w-[150px] h-7 px-2 rounded-lg text-xs font-bold border transition focus:outline-none cursor-pointer ${
                        row.feeStatus === 'Paid'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-rose-50 text-rose-800 border-rose-300'
                      }`}
                    >
                      <option value="Paid">Paid</option>
                      <option value="Unpaid">Unpaid</option>
                    </select>
                  </td>

                  <td className="py-2 px-2 text-center">
                    <button
                      type="button"
                      onClick={() => deleteDaspClient(row.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-error rounded hover:bg-surface-container transition"
                      title="Delete"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-8 text-center text-xs text-secondary">
            No DASP clients found.
          </div>
        )}
      </div>
    </div>
  );
}
