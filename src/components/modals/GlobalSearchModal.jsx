import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export default function GlobalSearchModal() {
  const { activeModal, setActiveModal, clients, setSelectedClientId } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (activeModal !== 'globalSearch') return null;

  const filtered = query.trim() === ''
    ? clients.slice(0, 5)
    : clients.filter(c =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.ein.includes(query) ||
        c.id.toLowerCase().includes(query.toLowerCase()) ||
        c.industry.toLowerCase().includes(query.toLowerCase())
      );

  const handleSelectClient = (c) => {
    setSelectedClientId(c.id);
    setActiveModal(null);
    navigate('/client-360');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-surface-container-lowest rounded-xl shadow-2xl max-w-xl w-full flex flex-col overflow-hidden border border-outline-variant/30">
        <div className="flex items-center px-4 py-3 border-b border-outline-variant/30 gap-3">
          <span className="material-symbols-outlined text-[22px] text-primary">search</span>
          <input
            autoFocus
            type="text"
            placeholder="Type a client name, EIN, return, or partner..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent font-body-lg text-body-lg text-on-surface placeholder:text-outline focus:outline-none"
          />
          <kbd className="px-2 py-0.5 text-[11px] font-mono bg-surface-container text-secondary rounded">
            ESC
          </kbd>
          <button
            onClick={() => setActiveModal(null)}
            className="text-secondary hover:text-on-surface"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <div className="p-2 max-h-96 overflow-y-auto">
          <div className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary">
            Clients &amp; Corporate Entities
          </div>
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-secondary font-body-sm">
              No matching clients found for "{query}".
            </div>
          ) : (
            filtered.map(c => (
              <button
                key={c.id}
                onClick={() => handleSelectClient(c)}
                className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-container flex items-center justify-between transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-surface-container-low group-hover:bg-primary-container group-hover:text-on-primary flex items-center justify-center text-primary font-bold text-label-sm transition">
                    {c.id.split('-')[0]}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-label-md text-label-md font-semibold text-on-surface group-hover:text-primary transition">
                      {c.name}
                    </span>
                    <span className="font-caption text-caption text-secondary">
                      {c.entityType} • EIN: {c.ein} • {c.leadPartner}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-caption text-caption px-2 py-0.5 rounded bg-surface-container text-secondary">
                    {c.id}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-outline group-hover:text-primary">
                    arrow_forward
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <div className="px-4 py-2 bg-surface-container-low/60 border-t border-outline-variant/20 flex items-center justify-between text-caption text-secondary">
          <span>Quick actions: <strong>Click</strong> to open 360 Hub</span>
          <span>Press <strong>ESC</strong> to dismiss</span>
        </div>
      </div>
    </div>
  );
}
