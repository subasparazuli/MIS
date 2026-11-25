import React from 'react';

/**
 * Bold chain-link icon shown after a client's name when Data Link is enabled.
 * Displays a "Data Linked" tooltip on hover.
 */
export default function DataLinkIcon({ className = '' }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ml-1 group/datalink align-middle shrink-0 ${className}`}
      title="Data Linked"
      aria-label="Data Linked"
    >
      <span
        className="material-symbols-outlined text-[16px] font-black text-primary leading-none"
        style={{ fontVariationSettings: "'FILL' 0, 'wght' 700, 'GRAD' 0, 'opsz' 20" }}
      >
        link
      </span>
      <span className="pointer-events-none opacity-0 group-hover/datalink:opacity-100 transition-opacity duration-150 absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-0.5 rounded bg-on-surface text-surface text-[10px] font-bold whitespace-nowrap shadow-md z-40">
        Data Linked
      </span>
    </span>
  );
}
