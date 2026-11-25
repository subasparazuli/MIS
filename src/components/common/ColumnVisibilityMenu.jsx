import React, { useState, useRef, useEffect } from 'react';

/**
 * Dropdown menu to toggle visibility of any table column.
 */
export default function ColumnVisibilityMenu({ columns, hiddenColumns, onToggleColumn, onShowAll }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const hiddenCount = hiddenColumns.length;
  const visibleCount = Math.max(0, columns.length - hiddenCount);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`h-8 px-2.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition shadow-2xs ${
          hiddenCount > 0
            ? 'bg-primary/10 text-primary border-primary/40'
            : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30'
        }`}
        title="Show or hide table columns"
      >
        <span className="material-symbols-outlined text-[16px]">view_week</span>
        <span>Columns</span>
        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-surface-container text-secondary">
          {visibleCount}/{columns.length}
        </span>
        <span className="material-symbols-outlined text-[15px]">
          {open ? 'expand_less' : 'expand_more'}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-60 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xl z-40 p-2 animate-fade-in">
          <div className="flex items-center justify-between px-2 py-1.5 border-b border-outline-variant/20 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
              Visible Columns
            </span>
            {hiddenCount > 0 && (
              <button
                type="button"
                onClick={onShowAll}
                className="text-[11px] font-bold text-primary hover:underline"
              >
                Show All
              </button>
            )}
          </div>

          <div className="max-h-64 overflow-y-auto flex flex-col gap-0.5 py-0.5">
            {columns.map((col) => {
              const isVisible = !hiddenColumns.includes(col.key);
              return (
                <label
                  key={col.key}
                  className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-surface-container-low cursor-pointer text-xs text-on-surface"
                >
                  <span className="flex items-center gap-2 truncate">
                    <input
                      type="checkbox"
                      checked={isVisible}
                      onChange={() => onToggleColumn(col.key)}
                      className="rounded text-primary focus:ring-0 cursor-pointer"
                    />
                    <span className={`truncate ${isVisible ? 'font-medium' : 'text-secondary line-through'}`}>
                      {col.label}
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-[14px] text-secondary shrink-0">
                    {isVisible ? 'visibility' : 'visibility_off'}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
