import React, { useState } from 'react';

/**
 * Blinking green notification bell displayed on a client row when a Team Communication
 * tags that client, service, and mentions at least one team member.
 * Hovering or clicking shows the note containing the Team Communication text input.
 */
export default function ServiceNotificationBell({ notifications = [], onResolve }) {
  const [pinned, setPinned] = useState(false);

  if (!notifications || notifications.length === 0) return null;

  return (
    <span
      className="relative inline-flex items-center justify-center ml-1.5 group/bell align-middle shrink-0 print:hidden"
      onClick={(e) => {
        e.stopPropagation();
        setPinned((prev) => !prev);
      }}
    >
      {/* Blinking Green Notification Bell */}
      <span className="relative inline-flex items-center justify-center cursor-pointer p-0.5 rounded-full bg-emerald-100 border border-emerald-400 shadow-2xs">
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600" />
        </span>
        <span className="material-symbols-outlined text-[15px] text-emerald-700 animate-pulse leading-none">
          notifications_active
        </span>
      </span>

      {/* Note Popover (Shown on hover or when clicked/pinned) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`${
          pinned ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none group-hover/bell:opacity-100 group-hover/bell:pointer-events-auto'
        } transition-opacity duration-150 absolute left-0 top-full mt-1.5 w-72 max-w-[calc(100vw-2rem)] bg-surface-container-lowest rounded-xl border border-emerald-300 shadow-xl z-50 p-3 text-left`}
      >
        <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-emerald-200/70">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Team Note ({notifications.length})</span>
          </div>
          {pinned && (
            <button
              type="button"
              onClick={() => setPinned(false)}
              className="text-secondary hover:text-on-surface p-0.5 rounded"
              title="Close"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          )}
        </div>

        <div className="flex flex-col gap-2 max-h-56 overflow-y-auto">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-200/80 text-xs flex flex-col gap-1"
            >
              <div className="flex items-center justify-between gap-1 text-[10px] text-secondary">
                <span className="font-bold text-on-surface">{n.author?.name || 'Team'}</span>
                <span>{n.createdAt}</span>
              </div>

              {n.mentions && n.mentions.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {n.mentions.map((m) => (
                    <span
                      key={m}
                      className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 font-bold text-[10px]"
                    >
                      @{m}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs text-on-surface leading-snug whitespace-pre-wrap break-words font-medium">
                {n.content}
              </p>

              {onResolve && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => onResolve(n.id, 'Resolved')}
                    className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[12px]">check_circle</span>
                    <span>Mark Resolved</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </span>
  );
}
