import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import DataLinkIcon from '../components/common/DataLinkIcon';
import ColumnVisibilityMenu from '../components/common/ColumnVisibilityMenu';
import ServiceNotificationBell from '../components/common/ServiceNotificationBell';

// Standard predefined options for BAS
export const standardResponsibles = [
  'Ashmita',
  'Deepika',
  'Manoj',
  'Nepal',
  'Rajiv',
  'Rina',
  'Sagar',
  'Sobina',
  'NO BAS'
];

export const standardPriorities = [
  'Very High',
  'High',
  'Med',
  'Low'
];

export const standardBasPeriodOptions = [
  'Lodged',
  'ELD',
  'HOLD',
  'In process',
  'Ready to review',
  'Suspense sent'
];

export const companyTaxReturnOptions = [
  'Not Submitted',
  'Submitted'
];

export const MONTHS = [
  { value: 1, name: 'January', short: 'Jan', quarter: 'Q3' },
  { value: 2, name: 'February', short: 'Feb', quarter: 'Q3' },
  { value: 3, name: 'March', short: 'Mar', quarter: 'Q3 (End)' },
  { value: 4, name: 'April', short: 'Apr', quarter: 'Q4' },
  { value: 5, name: 'May', short: 'May', quarter: 'Q4' },
  { value: 6, name: 'June', short: 'Jun', quarter: 'Q4 (FY End)' },
  { value: 7, name: 'July', short: 'Jul', quarter: 'Q1' },
  { value: 8, name: 'August', short: 'Aug', quarter: 'Q1' },
  { value: 9, name: 'September', short: 'Sep', quarter: 'Q1 (End)' },
  { value: 10, name: 'October', short: 'Oct', quarter: 'Q2' },
  { value: 11, name: 'November', short: 'Nov', quarter: 'Q2' },
  { value: 12, name: 'December', short: 'Dec', quarter: 'Q2 (End)' }
];

export const YEARS = [2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030];

// Interactive Cell Component for Responsible
function ResponsibleCell({ row, onUpdate, recentResponsibles, onAddRecentResponsible }) {
  const [isManual, setIsManual] = useState(false);
  const [manualText, setManualText] = useState(row.responsible || '');

  useEffect(() => {
    setManualText(row.responsible || '');
  }, [row.responsible]);

  const handleSaveManual = () => {
    const val = manualText.trim();
    onUpdate(row.id, 'responsible', val);
    if (val && !standardResponsibles.includes(val)) {
      onAddRecentResponsible(val);
    }
    setIsManual(false);
  };

  if (isManual) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          autoFocus
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveManual();
            if (e.key === 'Escape') {
              setManualText(row.responsible || '');
              setIsManual(false);
            }
          }}
          placeholder="Enter responsible..."
          className="w-full text-xs px-2 py-1 rounded bg-surface-container-lowest border border-primary focus:outline-none text-on-surface shadow-2xs"
        />
        <button
          type="button"
          onClick={handleSaveManual}
          className="h-6 w-6 rounded bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition"
          title="Save"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setManualText(row.responsible || '');
            setIsManual(false);
          }}
          className="h-6 w-6 rounded text-secondary hover:text-on-surface hover:bg-surface-container flex items-center justify-center shrink-0 transition"
          title="Cancel"
        >
          <span className="material-symbols-outlined text-[13px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group/resp">
      <select
        value={row.responsible || ''}
        onChange={(e) => {
          if (e.target.value === '__MANUAL__') {
            setIsManual(true);
          } else {
            onUpdate(row.id, 'responsible', e.target.value);
          }
        }}
        className="w-full h-7 px-2 rounded bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 focus:border-primary focus:outline-none text-xs text-on-surface transition cursor-pointer font-medium"
      >
        <option value="">-- Unassigned --</option>

        {recentResponsibles && recentResponsibles.length > 0 && (
          <optgroup label="Recently Added">
            {recentResponsibles.map((opt) => (
              <option key={`recent-resp-${opt}`} value={opt}>
                ⭐ {opt}
              </option>
            ))}
          </optgroup>
        )}

        <optgroup label="Standard Team">
          {standardResponsibles.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </optgroup>

        {row.responsible &&
          !standardResponsibles.includes(row.responsible) &&
          (!recentResponsibles || !recentResponsibles.includes(row.responsible)) && (
            <optgroup label="Current Value">
              <option value={row.responsible}>{row.responsible}</option>
            </optgroup>
          )}

        <option value="__MANUAL__">✏️ + Type Custom Name...</option>
      </select>

      <button
        type="button"
        onClick={() => setIsManual(true)}
        className="opacity-0 group-hover/resp:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface-container transition shrink-0"
        title="Type custom name"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

// Interactive Cell Component for Priority
function PriorityCell({ row, onUpdate, recentPriorities, onAddRecentPriority }) {
  const [isManual, setIsManual] = useState(false);
  const [manualText, setManualText] = useState(row.priority || '');

  useEffect(() => {
    setManualText(row.priority || '');
  }, [row.priority]);

  const handleSaveManual = () => {
    const val = manualText.trim();
    onUpdate(row.id, 'priority', val);
    if (val && !standardPriorities.includes(val)) {
      onAddRecentPriority(val);
    }
    setIsManual(false);
  };

  const getPriorityBadge = (val) => {
    const p = (val || '').toLowerCase();
    if (p.includes('very high')) return 'bg-rose-100 text-rose-900 border-rose-300 font-bold';
    if (p.includes('high')) return 'bg-orange-100 text-orange-900 border-orange-300 font-semibold';
    if (p.includes('med')) return 'bg-amber-100 text-amber-900 border-amber-300 font-medium';
    if (p.includes('low')) return 'bg-slate-100 text-slate-800 border-slate-300';
    return 'bg-surface-container text-secondary border-outline-variant/30';
  };

  if (isManual) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          autoFocus
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveManual();
            if (e.key === 'Escape') {
              setManualText(row.priority || '');
              setIsManual(false);
            }
          }}
          placeholder="Priority..."
          className="w-full text-xs px-2 py-1 rounded bg-surface-container-lowest border border-primary focus:outline-none text-on-surface shadow-2xs"
        />
        <button
          type="button"
          onClick={handleSaveManual}
          className="h-6 w-6 rounded bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition"
          title="Save"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setManualText(row.priority || '');
            setIsManual(false);
          }}
          className="h-6 w-6 rounded text-secondary hover:text-on-surface hover:bg-surface-container flex items-center justify-center shrink-0 transition"
          title="Cancel"
        >
          <span className="material-symbols-outlined text-[13px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group/pri">
      <select
        value={row.priority || ''}
        onChange={(e) => {
          if (e.target.value === '__MANUAL__') {
            setIsManual(true);
          } else {
            onUpdate(row.id, 'priority', e.target.value);
          }
        }}
        className={`w-full h-7 px-2 rounded-lg text-xs border transition focus:outline-none cursor-pointer ${getPriorityBadge(
          row.priority
        )}`}
      >
        <option value="">-- Priority --</option>

        {recentPriorities && recentPriorities.length > 0 && (
          <optgroup label="Recently Added">
            {recentPriorities.map((opt) => (
              <option key={`recent-pri-${opt}`} value={opt}>
                ⭐ {opt}
              </option>
            ))}
          </optgroup>
        )}

        <optgroup label="Standard">
          {standardPriorities.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </optgroup>

        {row.priority &&
          !standardPriorities.includes(row.priority) &&
          (!recentPriorities || !recentPriorities.includes(row.priority)) && (
            <optgroup label="Current Value">
              <option value={row.priority}>{row.priority}</option>
            </optgroup>
          )}

        <option value="__MANUAL__">✏️ + Custom Priority...</option>
      </select>

      <button
        type="button"
        onClick={() => setIsManual(true)}
        className="opacity-0 group-hover/pri:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface-container transition shrink-0"
        title="Type custom priority"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

// Interactive Cell Component for Monthly Period Lodgement Status (e.g. BAS Sep 21, BAS Nov 26)
function BasPeriodCell({ row, onUpdate, recentSep21, onAddRecentSep21, periodTitle }) {
  const [isManual, setIsManual] = useState(false);
  const [manualText, setManualText] = useState(row.basSep21 || '');

  useEffect(() => {
    setManualText(row.basSep21 || '');
  }, [row.basSep21]);

  const handleSaveManual = () => {
    const val = manualText.trim();
    onUpdate(row.id, 'basSep21', val);
    if (val && !standardBasPeriodOptions.includes(val)) {
      onAddRecentSep21(val);
    }
    setIsManual(false);
  };

  const getPeriodStyle = (val) => {
    const s = (val || '').toLowerCase();
    if (s.includes('lodged')) return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (s.includes('hold')) return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    if (s.includes('eld')) return 'bg-indigo-50 text-indigo-800 border-indigo-200 font-bold';
    if (s.includes('suspense')) return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
    return 'bg-surface-container-low text-on-surface border-outline-variant/20';
  };

  if (isManual) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          autoFocus
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSaveManual();
            if (e.key === 'Escape') {
              setManualText(row.basSep21 || '');
              setIsManual(false);
            }
          }}
          placeholder={`${periodTitle} status...`}
          className="w-full text-xs px-2 py-1 rounded bg-surface-container-lowest border border-primary focus:outline-none text-on-surface shadow-2xs"
        />
        <button
          type="button"
          onClick={handleSaveManual}
          className="h-6 w-6 rounded bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition"
          title="Save"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setManualText(row.basSep21 || '');
            setIsManual(false);
          }}
          className="h-6 w-6 rounded text-secondary hover:text-on-surface hover:bg-surface-container flex items-center justify-center shrink-0 transition"
          title="Cancel"
        >
          <span className="material-symbols-outlined text-[13px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 group/sep">
      <select
        value={row.basSep21 || ''}
        onChange={(e) => {
          if (e.target.value === '__MANUAL__') {
            setIsManual(true);
          } else {
            onUpdate(row.id, 'basSep21', e.target.value);
          }
        }}
        className={`w-full h-7 px-2 rounded-lg text-xs border transition focus:outline-none cursor-pointer ${getPeriodStyle(
          row.basSep21
        )}`}
      >
        <option value="">-- Select --</option>

        {recentSep21 && recentSep21.length > 0 && (
          <optgroup label="Recently Added">
            {recentSep21.map((opt) => (
              <option key={`recent-sep-${opt}`} value={opt}>
                ⭐ {opt}
              </option>
            ))}
          </optgroup>
        )}

        <optgroup label="Standard Options">
          {standardBasPeriodOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </optgroup>

        {row.basSep21 &&
          !standardBasPeriodOptions.includes(row.basSep21) &&
          (!recentSep21 || !recentSep21.includes(row.basSep21)) && (
            <optgroup label="Current Value">
              <option value={row.basSep21}>{row.basSep21}</option>
            </optgroup>
          )}

        <option value="__MANUAL__">✏️ + Custom Status...</option>
      </select>

      <button
        type="button"
        onClick={() => setIsManual(true)}
        className="opacity-0 group-hover/sep:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface-container transition shrink-0"
        title="Type custom status"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

// Interactive Cell Component for Yearly Company Tax Return Status
function CompanyTaxReturnCell({ row, year, onUpdate }) {
  const status = row.companyTaxReturn || 'Not Submitted';

  const getStatusStyle = (val) => {
    if (val === 'Submitted') {
      return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    }
    return 'bg-amber-50 text-amber-900 border-amber-200 font-semibold';
  };

  return (
    <select
      value={status}
      onChange={(e) => onUpdate(year, row.id, e.target.value)}
      title={`Company Tax Return (${year})`}
      className={`w-full h-7 px-2 rounded-lg text-xs border transition focus:outline-none cursor-pointer ${getStatusStyle(
        status
      )}`}
    >
      <option value="Not Submitted">Not Submitted</option>
      <option value="Submitted">Submitted</option>
    </select>
  );
}

// Interactive Cell Component for Clickable Client Name (with hover rename)
function ClientNameCell({ row, isDataLinked, notifications, onResolveNotification, onOpenProfile, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(row.clientName || '');

  useEffect(() => {
    setText(row.clientName || '');
  }, [row.clientName]);

  const handleSave = () => {
    const val = text.trim();
    if (val && val !== row.clientName) {
      onRename(row.id, 'clientName', val);
    }
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          type="text"
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setText(row.clientName || '');
              setIsEditing(false);
            }
          }}
          className="w-full text-xs font-semibold px-2 py-1 rounded bg-surface-container-lowest border border-primary focus:outline-none text-on-surface"
        />
        <button
          type="button"
          onClick={handleSave}
          className="h-6 w-6 rounded bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition"
          title="Save"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setText(row.clientName || '');
            setIsEditing(false);
          }}
          className="h-6 w-6 rounded text-secondary hover:text-on-surface hover:bg-surface-container flex items-center justify-center shrink-0 transition"
          title="Cancel"
        >
          <span className="material-symbols-outlined text-[13px]">close</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between gap-1 group/cname">
      <div className="inline-flex items-center flex-wrap">
        <button
          type="button"
          onClick={() => onOpenProfile(row)}
          className="font-bold text-on-surface hover:text-primary hover:underline transition text-left text-xs leading-snug cursor-pointer inline-flex items-center flex-wrap"
          title={`Open profile for ${row.clientName}`}
        >
          <span>{row.clientName}</span>
          {isDataLinked && <DataLinkIcon />}
        </button>
        <ServiceNotificationBell notifications={notifications} onResolve={onResolveNotification} />
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        className="opacity-0 group-hover/cname:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface-container transition shrink-0 print:hidden"
        title="Rename client"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

export default function BasPage() {
  const navigate = useNavigate();
  const {
    basRecords,
    recentBasResponsibles,
    addRecentBasResponsible,
    recentBasPriorities,
    addRecentBasPriority,
    recentBasSep21,
    addRecentBasSep21,
    basReportYear,
    setBasReportYear,
    basReportMonth,
    setBasReportMonth,
    getBasRecordsForPeriod,
    updateBasPeriodField,
    updateCompanyTaxReturn,
    basCustomColumns,
    addBasCustomColumn,
    deleteBasCustomColumn,
    updateBasCustomCell,
    addBasRecordToPeriod,
    deleteBasRecordFromPeriod,
    archiveBasRecord,
    restoreBasRecord,
    rollOverBasMonth,
    currentBasPeriodKey,
    ensureClientForName,
    isClientDataLinked,
    getServiceNotifications,
    updateCommunicationStatus,
    setSelectedClientId,
    showToast
  } = useApp();

  // Period calculations
  const currentMonthObj = MONTHS.find((m) => m.value === basReportMonth) || MONTHS[8];
  const yearShort = String(basReportYear).slice(-2);
  const periodColumnTitle = `BAS ${currentMonthObj.short} '${yearShort}`;

  // Next month calculation for ATO statutory due date
  let nextMonthVal = basReportMonth + 1;
  let nextYearVal = basReportYear;
  if (nextMonthVal > 12) {
    nextMonthVal = 1;
    nextYearVal += 1;
  }
  const nextMonthObj = MONTHS.find((m) => m.value === nextMonthVal) || MONTHS[0];
  const atoStandardDueDate = `21 ${nextMonthObj.name} ${nextYearVal}`;
  const atoTaxAgentDueDate = `28 ${nextMonthObj.name} ${nextYearVal}`;

  // Active records for current period
  const activeRecords = getBasRecordsForPeriod(currentBasPeriodKey);

  // Filters & Search
  const [clientTab, setClientTab] = useState('active'); // 'active' | 'archived'
  const [hiddenColumns, setHiddenColumns] = useState(() => {
    try {
      const saved = localStorage.getItem('mis_bas_hidden_columns');
      const parsed = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  });

  const toggleColumnVisibility = (key) => {
    setHiddenColumns((prev) => {
      const updated = prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key];
      localStorage.setItem('mis_bas_hidden_columns', JSON.stringify(updated));
      return updated;
    });
  };

  const showAllColumns = () => {
    setHiddenColumns([]);
    localStorage.setItem('mis_bas_hidden_columns', JSON.stringify([]));
  };

  const isColVisible = (key) => !hiddenColumns.includes(key);

  const allTableColumns = [
    { key: 'clientName', label: 'Client Name' },
    { key: 'responsible', label: 'Responsible' },
    { key: 'priority', label: 'Priority' },
    { key: 'periodStatus', label: periodColumnTitle },
    { key: 'companyTaxReturn', label: 'Company Tax Return' },
    { key: 'remarks', label: 'Remarks' },
    ...basCustomColumns.map((col) => ({ key: col.id, label: col.title }))
  ];

  const [search, setSearch] = useState('');
  const [responsibleFilter, setResponsibleFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [periodStatusFilter, setPeriodStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRolloverModal, setShowRolloverModal] = useState(false);
  const [showStaffWorkload, setShowStaffWorkload] = useState(false);
  const [showAddColumnModal, setShowAddColumnModal] = useState(false);
  const [newColForm, setNewColForm] = useState({
    title: '',
    type: 'text',
    scope: 'monthly',
    optionsText: 'Pending, Done, N/A'
  });

  const handleCreateColumn = (e) => {
    e.preventDefault();
    if (!newColForm.title.trim()) {
      showToast('Please enter a Column Name.', 'error');
      return;
    }
    const options =
      newColForm.type === 'dropdown'
        ? newColForm.optionsText
            .split(',')
            .map((o) => o.trim())
            .filter(Boolean)
        : [];
    if (newColForm.type === 'dropdown' && options.length === 0) {
      showToast('Please enter at least one dropdown option (comma-separated).', 'error');
      return;
    }
    addBasCustomColumn({
      title: newColForm.title,
      type: newColForm.type,
      scope: newColForm.scope,
      options
    });
    setNewColForm({
      title: '',
      type: 'text',
      scope: 'monthly',
      optionsText: 'Pending, Done, N/A'
    });
    setShowAddColumnModal(false);
  };

  // New row form state
  const [newRow, setNewRow] = useState({
    clientName: '',
    responsible: '',
    priority: 'Med',
    basSep21: '',
    companyTaxReturn: 'Not Submitted',
    remarks: ''
  });

  const [manualRespInModal, setManualRespInModal] = useState(false);
  const [manualPriInModal, setManualPriInModal] = useState(false);
  const [manualSepInModal, setManualSepInModal] = useState(false);

  // Month Navigation
  const handlePrevMonth = () => {
    if (basReportMonth === 1) {
      setBasReportMonth(12);
      setBasReportYear(basReportYear - 1);
    } else {
      setBasReportMonth(basReportMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (basReportMonth === 12) {
      setBasReportMonth(1);
      setBasReportYear(basReportYear + 1);
    } else {
      setBasReportMonth(basReportMonth + 1);
    }
  };

  const handleJumpToSep2021 = () => {
    setBasReportYear(2021);
    setBasReportMonth(9);
    showToast('Switched to September 2021 (Uploaded Baseline).');
  };

  const handleJumpToCurrentMonth = () => {
    setBasReportYear(2026);
    setBasReportMonth(11);
    showToast('Switched to Current Reporting Month (November 2026).');
  };

  // Cell Update delegator
  const handleUpdateRecordField = (recordId, field, value) => {
    updateBasPeriodField(currentBasPeriodKey, recordId, field, value);
  };

  const handleOpenClientProfile = (row) => {
    const client = ensureClientForName(row.clientName, row.clientId);
    if (client) {
      setSelectedClientId(client.id);
      navigate(`/clients/${client.id}`);
    }
  };

  // Active vs Archived split
  const activeClientRecords = activeRecords.filter((b) => !b.archived);
  const archivedClientRecords = activeRecords.filter((b) => !!b.archived);
  const tabRecords = clientTab === 'archived' ? archivedClientRecords : activeClientRecords;

  // Filtering
  const filteredRecords = tabRecords.filter((b) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        (b.clientName || '').toLowerCase().includes(q) ||
        (b.responsible || '').toLowerCase().includes(q) ||
        (b.priority || '').toLowerCase().includes(q) ||
        (b.basSep21 || '').toLowerCase().includes(q) ||
        (b.companyTaxReturn || 'Not Submitted').toLowerCase().includes(q) ||
        (b.remarks || '').toLowerCase().includes(q) ||
        basCustomColumns.some((col) => (b.customValues?.[col.id] || '').toLowerCase().includes(q));
      if (!match) return false;
    }
    if (responsibleFilter !== 'all') {
      if (responsibleFilter === 'unassigned') {
        if (b.responsible && b.responsible.trim()) return false;
      } else if ((b.responsible || '').toLowerCase() !== responsibleFilter.toLowerCase()) {
        return false;
      }
    }
    if (priorityFilter !== 'all') {
      const pri = (b.priority || '').toLowerCase();
      if (priorityFilter === 'high' && !pri.includes('high')) return false;
      if (priorityFilter === 'very high' && !pri.includes('very high')) return false;
      if (priorityFilter === 'med' && !pri.includes('med')) return false;
      if (priorityFilter === 'low' && !pri.includes('low')) return false;
    }
    if (statusFilter !== 'all') {
      const ctr = (b.companyTaxReturn || 'Not Submitted').toLowerCase();
      if (statusFilter === 'submitted' && ctr !== 'submitted') return false;
      if (statusFilter === 'not submitted' && ctr !== 'not submitted') return false;
    }
    if (periodStatusFilter !== 'all') {
      const sep = (b.basSep21 || '').toLowerCase();
      if (periodStatusFilter === 'lodged' && !sep.includes('lodged')) return false;
      if (periodStatusFilter === 'hold' && !sep.includes('hold')) return false;
      if (periodStatusFilter === 'eld' && !sep.includes('eld')) return false;
      if (periodStatusFilter === 'suspense' && !sep.includes('suspense')) return false;
    }
    return true;
  });

  // Summary Metrics for Active Period (Active Clients only)
  const totalCount = activeClientRecords.length;
  const lodgedCount = activeClientRecords.filter((b) => (b.basSep21 || '').toLowerCase().includes('lodged')).length;
  const taxReturnSubmittedCount = activeClientRecords.filter((b) => b.companyTaxReturn === 'Submitted').length;
  const taxReturnPendingCount = totalCount - taxReturnSubmittedCount;
  const highPriorityCount = activeClientRecords.filter((b) => (b.priority || '').toLowerCase().includes('high')).length;
  const completionPercentage = totalCount > 0 ? Math.round((lodgedCount / totalCount) * 100) : 0;
  const taxReturnCompletionPct = totalCount > 0 ? Math.round((taxReturnSubmittedCount / totalCount) * 100) : 0;

  // Staff Workload Breakdown
  const staffWorkload = standardResponsibles.map((staff) => {
    const assigned = activeClientRecords.filter(
      (b) => (b.responsible || '').trim().toLowerCase() === staff.toLowerCase()
    );
    const lodged = assigned.filter((b) => (b.basSep21 || '').toLowerCase().includes('lodged')).length;
    return {
      staff,
      total: assigned.length,
      lodged,
      percent: assigned.length > 0 ? Math.round((lodged / assigned.length) * 100) : 0
    };
  }).filter((sw) => sw.total > 0);

  // Unassigned count
  const unassignedCount = activeClientRecords.filter((b) => !b.responsible || !b.responsible.trim()).length;

  const handleExportCsv = () => {
    const headers = [
      'Client Name',
      'Responsible',
      'Priority',
      periodColumnTitle,
      `Company Tax Return (${basReportYear})`,
      'Remarks',
      ...basCustomColumns.map((col) =>
        col.scope === 'yearly' ? `${col.title} (${basReportYear})` : col.title
      ),
      'Reporting Period'
    ];

    const escapeCsv = (str) => {
      const s = str === null || str === undefined ? '' : String(str);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const lines = [headers.join(',')];
    filteredRecords.forEach((r) => {
      lines.push([
        escapeCsv(r.clientName),
        escapeCsv(r.responsible),
        escapeCsv(r.priority),
        escapeCsv(r.basSep21),
        escapeCsv(r.companyTaxReturn || 'Not Submitted'),
        escapeCsv(r.remarks),
        ...basCustomColumns.map((col) => escapeCsv(r.customValues?.[col.id] || '')),
        escapeCsv(`${currentMonthObj.name} ${basReportYear}`)
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BAS_Monthly_Report_${currentMonthObj.short}_${basReportYear}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredRecords.length} records for ${currentMonthObj.name} ${basReportYear}.`);
  };

  const handleCreateRow = (e) => {
    e.preventDefault();
    if (!newRow.clientName.trim()) {
      showToast('Please enter a Client Name.', 'error');
      return;
    }

    if (newRow.responsible && !standardResponsibles.includes(newRow.responsible)) {
      addRecentBasResponsible(newRow.responsible);
    }
    if (newRow.priority && !standardPriorities.includes(newRow.priority)) {
      addRecentBasPriority(newRow.priority);
    }
    if (newRow.basSep21 && !standardBasPeriodOptions.includes(newRow.basSep21)) {
      addRecentBasSep21(newRow.basSep21);
    }

    addBasRecordToPeriod(currentBasPeriodKey, newRow);
    setNewRow({
      clientName: '',
      responsible: '',
      priority: 'Med',
      basSep21: '',
      companyTaxReturn: 'Not Submitted',
      remarks: ''
    });
    setManualRespInModal(false);
    setManualPriInModal(false);
    setManualSepInModal(false);
    setShowAddModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Printable Report Header (Visible when printed) */}
      <div className="hidden print-only mb-4 p-4 border-b border-black">
        <h1 className="text-xl font-bold uppercase tracking-tight">
          Apex LedgerPoint Advisory — BAS Monthly Compliance Report
        </h1>
        <div className="text-xs flex gap-6 mt-1 text-gray-700">
          <span><strong>Reporting Period:</strong> {currentMonthObj.name} {basReportYear} ({currentMonthObj.quarter})</span>
          <span><strong>ATO Statutory Due Date:</strong> {atoStandardDueDate}</span>
          <span><strong>Total Client Entities:</strong> {totalCount}</span>
          <span><strong>Lodged:</strong> {lodgedCount} ({completionPercentage}%)</span>
        </div>
      </div>

      {/* Page Title & Export */}
      <div className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-outline-variant/20 mb-4 print:hidden">
        <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
          BAS Monthly Report
        </h1>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
            title="Export Monthly Report to CSV"
          >
            <span className="material-symbols-outlined text-[17px] text-secondary">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Monthly Period Selection Control Bar */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-3 mb-4 shadow-2xs print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Year & Month Dropdowns + Step Nav */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 bg-surface-container-lowest px-2.5 py-1 rounded-lg border border-outline-variant/30">
              <span className="material-symbols-outlined text-[18px] text-primary">calendar_month</span>
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">Report Period:</span>
            </div>

            {/* Previous Month Button */}
            <button
              type="button"
              onClick={handlePrevMonth}
              className="h-8 w-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30 flex items-center justify-center transition"
              title="Previous Month"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>

            {/* Month Dropdown */}
            <div className="flex items-center gap-1">
              <label htmlFor="select-bas-month" className="text-xs font-semibold text-secondary sr-only">
                Month
              </label>
              <select
                id="select-bas-month"
                value={basReportMonth}
                onChange={(e) => setBasReportMonth(Number(e.target.value))}
                className="h-8 px-3 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-primary/40 focus:border-primary focus:outline-none shadow-2xs cursor-pointer"
              >
                {MONTHS.map((m) => (
                  <option key={m.value} value={m.value}>
                    {String(m.value).padStart(2, '0')} - {m.name} ({m.quarter})
                  </option>
                ))}
              </select>
            </div>

            {/* Year Dropdown */}
            <div className="flex items-center gap-1">
              <label htmlFor="select-bas-year" className="text-xs font-semibold text-secondary sr-only">
                Year
              </label>
              <select
                id="select-bas-year"
                value={basReportYear}
                onChange={(e) => setBasReportYear(Number(e.target.value))}
                className="h-8 px-3 rounded-lg bg-surface-container-lowest text-xs font-bold text-on-surface border border-primary/40 focus:border-primary focus:outline-none shadow-2xs cursor-pointer"
              >
                {YEARS.map((yr) => (
                  <option key={yr} value={yr}>
                    Year: {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* Next Month Button */}
            <button
              type="button"
              onClick={handleNextMonth}
              className="h-8 w-8 rounded-lg bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30 flex items-center justify-center transition"
              title="Next Month"
            >
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          {/* Quick Period Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-secondary">Quick Jump:</span>

            <button
              type="button"
              onClick={handleJumpToSep2021}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold transition border flex items-center gap-1 ${
                basReportYear === 2021 && basReportMonth === 9
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>Sep 2021 (Uploaded Data)</span>
            </button>

            <button
              type="button"
              onClick={handleJumpToCurrentMonth}
              className={`h-7 px-2.5 rounded-lg text-xs font-bold transition border flex items-center gap-1 ${
                basReportYear === 2026 && basReportMonth === 11
                  ? 'bg-primary text-on-primary border-primary shadow-xs'
                  : 'bg-surface-container-lowest hover:bg-surface-container text-on-surface border-outline-variant/30'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">today</span>
              <span>Current (Nov 2026)</span>
            </button>

            <button
              type="button"
              onClick={() => setShowStaffWorkload(!showStaffWorkload)}
              className="h-7 px-2.5 rounded-lg text-xs font-semibold bg-surface-container-lowest hover:bg-surface-container text-on-surface border border-outline-variant/30 flex items-center gap-1 transition"
            >
              <span className="material-symbols-outlined text-[14px] text-primary">groups</span>
              <span>{showStaffWorkload ? 'Hide Staff Summary' : 'Staff Workload'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Staff Workload Breakdown Drawer (Collapsible) */}
      {showStaffWorkload && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3.5 mb-4 shadow-xs print:hidden animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-secondary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">badge</span>
              <span>Accountant Workload for {currentMonthObj.name} {basReportYear}</span>
            </h3>
            <span className="text-[11px] text-secondary">Click on any staff to filter the report</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
            {staffWorkload.map((sw) => (
              <button
                key={sw.staff}
                type="button"
                onClick={() => setResponsibleFilter(responsibleFilter === sw.staff.toLowerCase() ? 'all' : sw.staff.toLowerCase())}
                className={`p-2 rounded-lg border text-left transition ${
                  responsibleFilter === sw.staff.toLowerCase()
                    ? 'bg-primary/10 border-primary text-primary font-bold ring-1 ring-primary'
                    : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/20 text-on-surface'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold truncate">{sw.staff}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container font-mono">
                    {sw.lodged}/{sw.total}
                  </span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-1.5 mt-1.5 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${sw.percent}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-secondary mt-1">
                  <span>{sw.percent}% Lodged</span>
                  <span>{sw.total - sw.lodged} Pending</span>
                </div>
              </button>
            ))}

            {unassignedCount > 0 && (
              <button
                type="button"
                onClick={() => setResponsibleFilter(responsibleFilter === 'unassigned' ? 'all' : 'unassigned')}
                className={`p-2 rounded-lg border text-left transition ${
                  responsibleFilter === 'unassigned'
                    ? 'bg-rose-50 border-rose-400 text-rose-900 font-bold ring-1 ring-rose-400'
                    : 'bg-rose-50/40 hover:bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-800">Unassigned</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-200/60 font-mono">
                    {unassignedCount}
                  </span>
                </div>
                <div className="text-[10px] text-rose-700 mt-2 font-medium">
                  Requires staff assignment
                </div>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Summary Metrics Ribbon */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-space-sm mb-4 print:grid-cols-5">
        {/* Total Entities */}
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Entities in Period</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">domain</span>
          </div>
          <span className="text-xl font-bold text-on-surface font-headline-lg">{totalCount}</span>
          <span className="text-[10px] text-secondary block">{currentMonthObj.name} {basReportYear}</span>
        </div>

        {/* Lodged & Compliant */}
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Monthly BAS Lodged</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">verified</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-emerald-700 font-headline-lg">{lodgedCount}</span>
            <span className="text-xs font-bold text-emerald-600">({completionPercentage}%)</span>
          </div>
          <div className="w-full bg-surface-container rounded-full h-1 mt-1 overflow-hidden">
            <div
              className="bg-emerald-600 h-1 rounded-full transition-all"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Company Tax Return Submitted */}
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Tax Return ({basReportYear})</span>
            <span className="material-symbols-outlined text-[18px] text-sky-600">task_alt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-sky-700 font-headline-lg">{taxReturnSubmittedCount}</span>
            <span className="text-xs font-bold text-sky-600">({taxReturnCompletionPct}%)</span>
          </div>
          <span className="text-[10px] text-sky-600 block">Submitted for {basReportYear}</span>
        </div>

        {/* Company Tax Return Not Submitted */}
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Tax Return Pending</span>
            <span className="material-symbols-outlined text-[18px] text-amber-600">pending_actions</span>
          </div>
          <span className="text-xl font-bold text-amber-700 font-headline-lg">{taxReturnPendingCount}</span>
          <span className="text-[10px] text-amber-600 block">Not submitted ({basReportYear})</span>
        </div>

        {/* High Priority Entities */}
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">High Priority</span>
            <span className="material-symbols-outlined text-[18px] text-rose-600">priority_high</span>
          </div>
          <span className="text-xl font-bold text-rose-700 font-headline-lg">{highPriorityCount}</span>
          <span className="text-[10px] text-rose-600 block">Urgent attention</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 mb-4 shadow-2xs print:hidden">
        <div className="flex flex-col lg:flex-row lg:items-center gap-2">
          {/* Global Search */}
          <div className="relative flex-1 min-w-[220px]">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[17px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search client, accountant, priority, status or remarks..."
              className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline/50 border border-outline-variant/20 focus:border-primary focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Responsible Filter */}
          <select
            value={responsibleFilter}
            onChange={(e) => setResponsibleFilter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">Staff: All ({totalCount})</option>
            {standardResponsibles.map((r) => (
              <option key={r} value={r.toLowerCase()}>
                {r}
              </option>
            ))}
            <option value="unassigned">-- Unassigned ({unassignedCount}) --</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">Priority: All</option>
            <option value="very high">Very High</option>
            <option value="high">High</option>
            <option value="med">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Period Status Filter */}
          <select
            value={periodStatusFilter}
            onChange={(e) => setPeriodStatusFilter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">{periodColumnTitle}: All</option>
            <option value="lodged">Lodged</option>
            <option value="hold">HOLD</option>
            <option value="eld">ELD</option>
            <option value="suspense">Suspense sent</option>
          </select>

          {/* Company Tax Return Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
          >
            <option value="all">Tax Return ({basReportYear}): All</option>
            <option value="submitted">Submitted</option>
            <option value="not submitted">Not Submitted</option>
          </select>

          {/* Clear Filters */}
          {(responsibleFilter !== 'all' || priorityFilter !== 'all' || statusFilter !== 'all' || periodStatusFilter !== 'all' || search) && (
            <button
              type="button"
              onClick={() => {
                setResponsibleFilter('all');
                setPriorityFilter('all');
                setStatusFilter('all');
                setPeriodStatusFilter('all');
                setSearch('');
              }}
              className="text-xs text-primary font-bold hover:underline flex items-center gap-0.5 ml-auto"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* Active / Archived Clients Tabs (Top-left of table) */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 print:hidden">
        <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl border border-outline-variant/25">
          <button
            type="button"
            onClick={() => setClientTab('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              clientTab === 'active'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">domain</span>
            <span>Active Clients</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              {activeClientRecords.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setClientTab('archived')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
              clientTab === 'archived'
                ? 'bg-surface-container-lowest text-amber-800 shadow-xs'
                : 'text-secondary hover:text-on-surface'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">inventory_2</span>
            <span>Archived Clients</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-surface-container text-secondary">
              {archivedClientRecords.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-secondary font-medium">
            Showing {filteredRecords.length} of {tabRecords.length} {clientTab} clients
          </span>
          <ColumnVisibilityMenu
            columns={allTableColumns}
            hiddenColumns={hiddenColumns}
            onToggleColumn={toggleColumnVisibility}
            onShowAll={showAllColumns}
          />
        </div>
      </div>

      {/* Main Monthly BAS Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[1050px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold text-[11px] tracking-wide">
                <th className="py-2.5 px-2 w-9 text-center">#</th>
                {isColVisible('clientName') && (
                  <th className="py-2.5 px-3 min-w-[240px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <span>Client Name</span>
                      <button
                        type="button"
                        onClick={() => toggleColumnVisibility('clientName')}
                        className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition print:hidden"
                        title="Hide Client Name column"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      </button>
                    </div>
                  </th>
                )}
                {isColVisible('responsible') && (
                  <th className="py-2.5 px-2 min-w-[150px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span>Responsible</span>
                        <span className="text-[10px] text-primary lowercase">(dropdown/type)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleColumnVisibility('responsible')}
                        className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition print:hidden"
                        title="Hide Responsible column"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      </button>
                    </div>
                  </th>
                )}
                {isColVisible('priority') && (
                  <th className="py-2.5 px-2 min-w-[130px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span>Priority</span>
                        <span className="text-[10px] text-primary lowercase">(dropdown/type)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleColumnVisibility('priority')}
                        className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition print:hidden"
                        title="Hide Priority column"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      </button>
                    </div>
                  </th>
                )}
                {isColVisible('periodStatus') && (
                  <th className="py-2.5 px-2 min-w-[150px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-on-surface">{periodColumnTitle}</span>
                        <span className="text-[10px] text-primary lowercase">(monthly)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleColumnVisibility('periodStatus')}
                        className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition print:hidden"
                        title={`Hide ${periodColumnTitle} column`}
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      </button>
                    </div>
                  </th>
                )}
                {isColVisible('companyTaxReturn') && (
                  <th className="py-2.5 px-2 min-w-[165px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span>Company Tax Return</span>
                        <span className="text-[10px] text-primary lowercase">({basReportYear} yearly)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleColumnVisibility('companyTaxReturn')}
                        className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition print:hidden"
                        title="Hide Company Tax Return column"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      </button>
                    </div>
                  </th>
                )}
                {isColVisible('remarks') && (
                  <th className="py-2.5 px-3 min-w-[200px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1">
                        <span>Remarks</span>
                        <span className="text-[10px] text-secondary lowercase">(manual text input)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleColumnVisibility('remarks')}
                        className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition print:hidden"
                        title="Hide Remarks column"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                      </button>
                    </div>
                  </th>
                )}
                {basCustomColumns.filter((col) => isColVisible(col.id)).map((col) => (
                  <th key={col.id} className="py-2.5 px-2 min-w-[155px] group/colhdr">
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 truncate">
                        <span className="truncate">{col.title}</span>
                        <span className="text-[10px] text-primary lowercase shrink-0">
                          ({col.scope === 'yearly' ? `${basReportYear} yearly` : 'monthly'})
                        </span>
                      </div>
                      <div className="flex items-center gap-0.5 shrink-0 print:hidden">
                        <button
                          type="button"
                          onClick={() => toggleColumnVisibility(col.id)}
                          className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-primary rounded transition"
                          title={`Hide "${col.title}" column`}
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility_off</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Remove custom column "${col.title}"?`)) {
                              deleteBasCustomColumn(col.id);
                            }
                          }}
                          className="opacity-0 group-hover/colhdr:opacity-100 p-0.5 text-outline hover:text-error rounded transition"
                          title={`Delete column "${col.title}"`}
                        >
                          <span className="material-symbols-outlined text-[14px]">close</span>
                        </button>
                      </div>
                    </div>
                  </th>
                ))}
                <th className="py-2.5 px-1.5 w-10 text-center print:hidden">
                  <button
                    type="button"
                    onClick={() => setShowAddColumnModal(true)}
                    className="p-1 rounded hover:bg-surface-container text-primary transition inline-flex items-center justify-center"
                    title="Add new column"
                  >
                    <span className="material-symbols-outlined text-[16px]">add_box</span>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 font-normal">
              {filteredRecords.map((row, idx) => {
                const rowNotifications = getServiceNotifications('bas', row.clientId, row.clientName);
                return (
                  <tr
                    key={row.id}
                    className={`hover:bg-surface-container-low/60 transition group ${
                      rowNotifications.length > 0 ? 'bg-emerald-50/25' : ''
                    }`}
                  >
                    {/* Index */}
                    <td className="py-2 px-2 text-center text-secondary font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* 1. Client Name (Clickable to open Client Profile) */}
                    {isColVisible('clientName') && (
                      <td className="py-2 px-3">
                        <ClientNameCell
                          row={row}
                          isDataLinked={isClientDataLinked(row.clientId, row.clientName)}
                          notifications={rowNotifications}
                          onResolveNotification={updateCommunicationStatus}
                          onOpenProfile={handleOpenClientProfile}
                          onRename={handleUpdateRecordField}
                        />
                      </td>
                    )}

                    {/* 2. Responsible */}
                    {isColVisible('responsible') && (
                      <td className="py-2 px-2">
                        <ResponsibleCell
                          row={row}
                          onUpdate={handleUpdateRecordField}
                          recentResponsibles={recentBasResponsibles}
                          onAddRecentResponsible={addRecentBasResponsible}
                        />
                      </td>
                    )}

                    {/* 3. Priority */}
                    {isColVisible('priority') && (
                      <td className="py-2 px-2">
                        <PriorityCell
                          row={row}
                          onUpdate={handleUpdateRecordField}
                          recentPriorities={recentBasPriorities}
                          onAddRecentPriority={addRecentBasPriority}
                        />
                      </td>
                    )}

                    {/* 4. Monthly Period Status (Dynamic column, e.g. BAS Sep 21, BAS Nov 26) */}
                    {isColVisible('periodStatus') && (
                      <td className="py-2 px-2">
                        <BasPeriodCell
                          row={row}
                          onUpdate={handleUpdateRecordField}
                          recentSep21={recentBasSep21}
                          onAddRecentSep21={addRecentBasSep21}
                          periodTitle={periodColumnTitle}
                        />
                      </td>
                    )}

                    {/* 5. Company Tax Return (Yearly for respective BAS year) */}
                    {isColVisible('companyTaxReturn') && (
                      <td className="py-2 px-2">
                        <CompanyTaxReturnCell
                          row={row}
                          year={basReportYear}
                          onUpdate={updateCompanyTaxReturn}
                        />
                      </td>
                    )}

                    {/* 6. Remarks (Manual Text Input) */}
                    {isColVisible('remarks') && (
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={row.remarks || ''}
                          onChange={(e) => handleUpdateRecordField(row.id, 'remarks', e.target.value)}
                          placeholder="Add remarks / notes..."
                          className="w-full text-xs px-2.5 py-1 rounded bg-transparent hover:bg-surface-container-lowest focus:bg-surface-container-lowest border border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none transition text-on-surface placeholder:text-outline/40"
                        />
                      </td>
                    )}

                    {/* Dynamic Custom Columns */}
                    {basCustomColumns.filter((col) => isColVisible(col.id)).map((col) => {
                      const val = row.customValues?.[col.id] || '';
                      return (
                        <td key={col.id} className="py-2 px-2">
                          {col.type === 'dropdown' ? (
                            <select
                              value={val}
                              onChange={(e) =>
                                updateBasCustomCell(col.scope, currentBasPeriodKey, row.id, col.id, e.target.value)
                              }
                              className="w-full h-7 px-2 rounded-lg bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 focus:border-primary focus:outline-none text-xs text-on-surface transition cursor-pointer font-medium"
                            >
                              <option value="">-- Select --</option>
                              {col.options.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={val}
                              onChange={(e) =>
                                updateBasCustomCell(col.scope, currentBasPeriodKey, row.id, col.id, e.target.value)
                              }
                              placeholder={`Enter ${col.title.toLowerCase()}...`}
                              className="w-full text-xs px-2.5 py-1 rounded bg-transparent hover:bg-surface-container-lowest focus:bg-surface-container-lowest border border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none transition text-on-surface placeholder:text-outline/40"
                            />
                          )}
                        </td>
                      );
                    })}

                    {/* Archive (Active tab) OR Activate / Delete (Archived tab) */}
                    <td className="py-2 px-1 text-center print:hidden">
                      {clientTab === 'active' ? (
                        <button
                          type="button"
                          onClick={() => archiveBasRecord(row.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-amber-700 rounded hover:bg-amber-50 transition"
                          title="Archive client (hide from active list)"
                        >
                          <span className="material-symbols-outlined text-[16px]">archive</span>
                        </button>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => restoreBasRecord(row.id)}
                            className="p-1 text-emerald-700 hover:text-emerald-900 rounded hover:bg-emerald-50 transition"
                            title="Activate client (restore to Active Clients)"
                          >
                            <span className="material-symbols-outlined text-[16px]">unarchive</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Permanently delete BAS record for ${row.clientName}?`)) {
                                deleteBasRecordFromPeriod(currentBasPeriodKey, row.id);
                              }
                            }}
                            className="p-1 text-outline hover:text-error rounded hover:bg-rose-50 transition"
                            title="Delete permanently"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRecords.length === 0 && (
          <div className="p-12 text-center text-xs text-secondary">
            <span className="material-symbols-outlined text-[36px] text-outline block mb-1">search_off</span>
            <p className="font-bold text-on-surface">No matching BAS records found for {currentMonthObj.name} {basReportYear}</p>
            <p className="text-secondary mt-0.5">Try clearing filters or click &ldquo;Rollover / Pre-fill&rdquo; to populate clients from previous month.</p>
          </div>
        )}
      </div>

      {/* Add BAS Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-lg w-full p-5 border border-outline-variant/30 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">add_circle</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Add BAS Record to {currentMonthObj.name} {basReportYear}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRow} className="space-y-3.5">
              {/* Client Name */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Client Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newRow.clientName}
                  onChange={(e) => setNewRow({ ...newRow, clientName: e.target.value })}
                  placeholder="e.g. ACME PTY LTD"
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface font-medium"
                />
              </div>

              {/* Responsible */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface">Responsible Accountant</label>
                  <button
                    type="button"
                    onClick={() => setManualRespInModal(!manualRespInModal)}
                    className="text-[11px] text-primary font-bold hover:underline"
                  >
                    {manualRespInModal ? 'Choose from list' : '+ Type custom'}
                  </button>
                </div>
                {manualRespInModal ? (
                  <input
                    type="text"
                    value={newRow.responsible}
                    onChange={(e) => setNewRow({ ...newRow, responsible: e.target.value })}
                    placeholder="Enter accountant name..."
                    className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  />
                ) : (
                  <select
                    value={newRow.responsible}
                    onChange={(e) => setNewRow({ ...newRow, responsible: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    <option value="">-- Select Responsible --</option>
                    {standardResponsibles.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Priority */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-on-surface">Priority</label>
                  <button
                    type="button"
                    onClick={() => setManualPriInModal(!manualPriInModal)}
                    className="text-[11px] text-primary font-bold hover:underline"
                  >
                    {manualPriInModal ? 'Choose from list' : '+ Type custom'}
                  </button>
                </div>
                {manualPriInModal ? (
                  <input
                    type="text"
                    value={newRow.priority}
                    onChange={(e) => setNewRow({ ...newRow, priority: e.target.value })}
                    placeholder="e.g. Urgent / High"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  />
                ) : (
                  <select
                    value={newRow.priority}
                    onChange={(e) => setNewRow({ ...newRow, priority: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    {standardPriorities.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Period Status */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-on-surface">{periodColumnTitle}</label>
                    <button
                      type="button"
                      onClick={() => setManualSepInModal(!manualSepInModal)}
                      className="text-[11px] text-primary font-bold hover:underline"
                    >
                      {manualSepInModal ? 'List' : '+ Type'}
                    </button>
                  </div>
                  {manualSepInModal ? (
                    <input
                      type="text"
                      value={newRow.basSep21}
                      onChange={(e) => setNewRow({ ...newRow, basSep21: e.target.value })}
                      placeholder="Status..."
                      className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                    />
                  ) : (
                    <select
                      value={newRow.basSep21}
                      onChange={(e) => setNewRow({ ...newRow, basSep21: e.target.value })}
                      className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                    >
                      <option value="">-- None --</option>
                      {standardBasPeriodOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Company Tax Return (Yearly) */}
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Company Tax Return ({basReportYear})
                  </label>
                  <select
                    value={newRow.companyTaxReturn}
                    onChange={(e) => setNewRow({ ...newRow, companyTaxReturn: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    {companyTaxReturnOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Remarks &amp; Notes</label>
                <textarea
                  rows={2}
                  value={newRow.remarks}
                  onChange={(e) => setNewRow({ ...newRow, remarks: e.target.value })}
                  placeholder="Additional compliance or client notes..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface resize-none"
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition shadow-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Rollover / Pre-fill Modal */}
      {showRolloverModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-5 border border-outline-variant/30 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">sync_alt</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Rollover / Pre-fill Month
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowRolloverModal(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <p className="text-xs text-secondary mb-4 leading-relaxed">
              Pre-fill client entities into <strong className="text-on-surface">{currentMonthObj.name} {basReportYear}</strong> from a baseline or previous month so you don&apos;t have to re-enter clients.
            </p>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  rollOverBasMonth(currentBasPeriodKey, '2021-09', false);
                  setShowRolloverModal(false);
                }}
                className="w-full p-3 rounded-xl border border-outline-variant/30 hover:border-primary bg-surface-container-low hover:bg-surface-container text-left transition flex items-start gap-3 group"
              >
                <span className="material-symbols-outlined text-[20px] text-primary mt-0.5">history_edu</span>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-primary transition">
                    Pre-fill from Sep 2021 Baseline (Fresh Statuses)
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Copies all 247 clients, accountants, and priorities, resetting lodgement status to &ldquo;In progress&rdquo;.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  rollOverBasMonth(currentBasPeriodKey, '2021-09', true);
                  setShowRolloverModal(false);
                }}
                className="w-full p-3 rounded-xl border border-outline-variant/30 hover:border-primary bg-surface-container-low hover:bg-surface-container text-left transition flex items-start gap-3 group"
              >
                <span className="material-symbols-outlined text-[20px] text-secondary mt-0.5">content_copy</span>
                <div>
                  <div className="text-xs font-bold text-on-surface group-hover:text-primary transition">
                    Clone Exactly from Sep 2021 (Including Statuses)
                  </div>
                  <div className="text-[11px] text-secondary mt-0.5">
                    Clones all 247 clients with their exact Sep 2021 lodgement statuses and remarks.
                  </div>
                </div>
              </button>
            </div>

            <div className="flex justify-end pt-4 mt-4 border-t border-outline-variant/20">
              <button
                type="button"
                onClick={() => setShowRolloverModal(false)}
                className="px-4 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Column Modal */}
      {showAddColumnModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-5 border border-outline-variant/30 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">view_column</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Add Custom Column
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddColumnModal(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateColumn} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Column Name <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={newColForm.title}
                  onChange={(e) => setNewColForm({ ...newColForm, title: e.target.value })}
                  placeholder="e.g. ATO Payment Plan, ASIC Review, Fee Status..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Field Type
                  </label>
                  <select
                    value={newColForm.type}
                    onChange={(e) => setNewColForm({ ...newColForm, type: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    <option value="text">Text Input</option>
                    <option value="dropdown">Dropdown Options</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Tracking Basis
                  </label>
                  <select
                    value={newColForm.scope}
                    onChange={(e) => setNewColForm({ ...newColForm, scope: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    <option value="monthly">Monthly ({currentMonthObj.short} {basReportYear})</option>
                    <option value="yearly">Yearly ({basReportYear})</option>
                  </select>
                </div>
              </div>

              {newColForm.type === 'dropdown' && (
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">
                    Dropdown Options <span className="text-[11px] font-normal text-secondary">(comma-separated)</span>
                  </label>
                  <input
                    type="text"
                    value={newColForm.optionsText}
                    onChange={(e) => setNewColForm({ ...newColForm, optionsText: e.target.value })}
                    placeholder="e.g. Pending, Done, N/A"
                    className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddColumnModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition shadow-xs"
                >
                  Add Column
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
