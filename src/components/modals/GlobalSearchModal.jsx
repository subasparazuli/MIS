import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function GlobalSearchModal() {
  const { activeModal, setActiveModal, clients, setSelectedClientId, services } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (activeModal !== 'globalSearch') return null;

  const q = query.toLowerCase().trim();
  const filteredClients = q === ''
    ? clients.slice(0, 5)
    : clients.filter((c) =>
        c.name.toLowerCase().includes(q) ||
        (c.abn && c.abn.replace(/\s/g, '').includes(q.replace(/\s/g, ''))) ||
        c.id.toLowerCase().includes(q) ||
        (c.director && c.director.toLowerCase().includes(q)) ||
        (c.industry && c.industry.toLowerCase().includes(q))
      );

  const filteredServices = q === ''
    ? []
    : services.filter((s) => s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));

  const handleSelectClient = (c) => {
    setSelectedClientId(c.id);
    setActiveModal(null);
    navigate(`/clients/${c.id}`);
  };

  const handleSelectService = (s) => {
    setActiveModal(null);
    navigate(s.path);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-outline-variant/30">
        <div className="flex items-center px-4 py-3 border-b border-outline-variant/30 gap-3">
          <span className="material-symbols-outlined text-[22px] text-primary">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Type client name, ABN, director, or service..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-on-surface placeholder:text-outline focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono bg-surface-container text-secondary rounded">
            ESC
          </kbd>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="text-secondary hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-2 max-h-96 overflow-y-auto">
          {filteredServices.length > 0 && (
            <div className="mb-2">
              <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
                Services
              </div>
              {filteredServices.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleSelectService(s)}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-container flex items-center justify-between transition text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-primary">{s.icon}</span>
                    <span className="font-semibold text-on-surface">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-secondary">Open Service &rarr;</span>
                </button>
              ))}
            </div>
          )}

          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary">
            Clients &amp; Business Entities
          </div>
          {filteredClients.length === 0 ? (
            <div className="p-6 text-center text-secondary text-xs">
              No matching clients found for "{query}".
            </div>
          ) : (
            filteredClients.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleSelectClient(c)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-container flex items-center justify-between transition group text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low group-hover:bg-primary group-hover:text-on-primary flex items-center justify-center text-primary font-bold text-xs transition">
                    <span className="material-symbols-outlined text-[16px]">corporate_fare</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-on-surface group-hover:text-primary transition">
                      {c.name}
                    </span>
                    <span className="text-[11px] text-secondary">
                      {c.entityType} • ABN: {c.abn} • Director: {c.director}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-surface-container-low/60 border-t border-outline-variant/20 flex items-center justify-between text-[11px] text-secondary">
          <span>Click to open Client Profile</span>
          <span>Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
}
