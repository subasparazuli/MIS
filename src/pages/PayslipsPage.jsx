import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Standard options
export const standardPayrunPeriods = [
  'Fortnightly',
  'Weekly',
  'Monthly',
  'Fortnightly-Note',
  'Fortnightly(Direct submitted super)',
  'Fortnightly/Individual',
  'Fortnightly-Hold payslip for Bishal',
  'Fortnightly/Hold payslip for pratik',
  'Fortnightly(2 different payslip)',
  'Weekly/Individual',
  'weekly(Direct submitted super)',
  'weekly'
];

export const standardNotesOptions = [
  'Fixed until said',
  'Client will send working hrs',
  'Client will send working hrs/ individual',
  'Fixed until said/ Wednesday',
  'Client will send working hrs(Friday sent paylip)'
];

// Interactive Cell Component for Payrun Period
function PayrunPeriodCell({ row, onUpdate, recentPeriods, onAddRecentPeriod }) {
  const [isManual, setIsManual] = useState(false);
  const [manualText, setManualText] = useState(row.payrunPeriod || '');

  useEffect(() => {
    setManualText(row.payrunPeriod || '');
  }, [row.payrunPeriod]);

  const handleSaveManual = () => {
    const val = manualText.trim();
    if (val) {
      onUpdate(row.id, 'payrunPeriod', val);
      if (!standardPayrunPeriods.includes(val)) {
        onAddRecentPeriod(val);
      }
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
              setManualText(row.payrunPeriod || '');
              setIsManual(false);
            }
          }}
          placeholder="Enter custom period..."
          className="w-full text-xs px-2 py-1 rounded bg-surface-container-lowest border border-primary focus:outline-none text-on-surface shadow-2xs"
        />
        <button
          type="button"
          onClick={handleSaveManual}
          className="h-6 w-6 rounded bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition"
          title="Save custom period"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setManualText(row.payrunPeriod || '');
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
    <div className="flex items-center gap-1 group/period">
      <select
        value={row.payrunPeriod || ''}
        onChange={(e) => {
          if (e.target.value === '__MANUAL__') {
            setIsManual(true);
          } else {
            onUpdate(row.id, 'payrunPeriod', e.target.value);
          }
        }}
        className="w-full h-7 px-2 rounded bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 focus:border-primary focus:outline-none text-xs text-on-surface transition cursor-pointer"
      >
        <option value="">-- Select Period --</option>

        {/* Recently Added Section */}
        {recentPeriods && recentPeriods.length > 0 && (
          <optgroup label="Recently Added">
            {recentPeriods.map((opt) => (
              <option key={`recent-period-${opt}`} value={opt}>
                ⭐ {opt}
              </option>
            ))}
          </optgroup>
        )}

        {/* Standard Options Section */}
        <optgroup label="Standard Options">
          {standardPayrunPeriods.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </optgroup>

        {/* Current Custom Value if not in either list */}
        {row.payrunPeriod &&
          !standardPayrunPeriods.includes(row.payrunPeriod) &&
          (!recentPeriods || !recentPeriods.includes(row.payrunPeriod)) && (
            <optgroup label="Current Value">
              <option value={row.payrunPeriod}>{row.payrunPeriod}</option>
            </optgroup>
          )}

        <option value="__MANUAL__">✏️ + Type Custom Period...</option>
      </select>

      <button
        type="button"
        onClick={() => setIsManual(true)}
        className="opacity-0 group-hover/period:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface-container transition shrink-0"
        title="Type custom period"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

// Interactive Cell Component for Notes
function NotesCell({ row, onUpdate, recentNotes, onAddRecentNote }) {
  const [isManual, setIsManual] = useState(false);
  const [manualText, setManualText] = useState(row.notes || '');

  useEffect(() => {
    setManualText(row.notes || '');
  }, [row.notes]);

  const handleSaveManual = () => {
    const val = manualText.trim();
    if (val) {
      onUpdate(row.id, 'notes', val);
      if (!standardNotesOptions.includes(val)) {
        onAddRecentNote(val);
      }
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
              setManualText(row.notes || '');
              setIsManual(false);
            }
          }}
          placeholder="Enter custom note..."
          className="w-full text-xs px-2 py-1 rounded bg-surface-container-lowest border border-primary focus:outline-none text-on-surface shadow-2xs"
        />
        <button
          type="button"
          onClick={handleSaveManual}
          className="h-6 w-6 rounded bg-primary text-on-primary hover:bg-primary-container flex items-center justify-center shrink-0 transition"
          title="Save custom note"
        >
          <span className="material-symbols-outlined text-[13px]">check</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setManualText(row.notes || '');
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
    <div className="flex items-center gap-1 group/note">
      <select
        value={row.notes || ''}
        onChange={(e) => {
          if (e.target.value === '__MANUAL__') {
            setIsManual(true);
          } else {
            onUpdate(row.id, 'notes', e.target.value);
          }
        }}
        className="w-full h-7 px-2 rounded bg-surface-container-low border border-outline-variant/20 hover:border-outline-variant/50 focus:border-primary focus:outline-none text-xs text-on-surface transition cursor-pointer"
      >
        <option value="">-- Select Note --</option>

        {/* Recently Added Section */}
        {recentNotes && recentNotes.length > 0 && (
          <optgroup label="Recently Added">
            {recentNotes.map((opt) => (
              <option key={`recent-note-${opt}`} value={opt}>
                ⭐ {opt}
              </option>
            ))}
          </optgroup>
        )}

        {/* Standard Options Section */}
        <optgroup label="Standard Options">
          {standardNotesOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </optgroup>

        {/* Current Custom Value if not in either list */}
        {row.notes &&
          !standardNotesOptions.includes(row.notes) &&
          (!recentNotes || !recentNotes.includes(row.notes)) && (
            <optgroup label="Current Value">
              <option value={row.notes}>{row.notes}</option>
            </optgroup>
          )}

        <option value="__MANUAL__">✏️ + Type Custom Note...</option>
      </select>

      <button
        type="button"
        onClick={() => setIsManual(true)}
        className="opacity-0 group-hover/note:opacity-100 p-1 text-secondary hover:text-primary rounded hover:bg-surface-container transition shrink-0"
        title="Type custom note"
      >
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </button>
    </div>
  );
}

export default function PayslipsPage() {
  const navigate = useNavigate();
  const {
    payslipTracking,
    updatePayslipTrackingField,
    addPayslipTrackingRow,
    deletePayslipTrackingRow,
    recentPayrunPeriods,
    addRecentPayrunPeriod,
    recentNotes,
    addRecentNote,
    setSelectedClientId,
    showToast
  } = useApp();

  const [search, setSearch] = useState('');
  const [softwareFilter, setSoftwareFilter] = useState('all');
  const [payrunFilter, setPayrunFilter] = useState('all');
  const [superFilter, setSuperFilter] = useState('all');
  const [payslipFilter, setPayslipFilter] = useState('all');
  const [processedFilter, setProcessedFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New row form state
  const [newRow, setNewRow] = useState({
    software: 'Quickbook',
    company: '',
    updates: '',
    payrunPeriod: 'Fortnightly',
    superStatus: '',
    payslipStatus: '',
    notes: 'Fixed until said',
    processed: 'Next week',
    email: '',
    cc: ''
  });

  const [manualPayrunInModal, setManualPayrunInModal] = useState(false);
  const [manualNoteInModal, setManualNoteInModal] = useState(false);

  const superStatusOptions = [
    { label: '-- Select Super Status --', value: '' },
    { label: 'Submitted', value: 'Submitted' },
    { label: 'Not activate heroclear', value: 'Not activate heroclear' },
    { label: 'Hold payslip', value: 'Hold payslip' },
    { label: 'Paid', value: 'Paid' },
    { label: 'Pending', value: 'Pending' }
  ];

  const payslipStatusOptions = [
    { label: '-- Select Payslip Status --', value: '' },
    { label: 'Payslip sent', value: 'Payslip sent' },
    { label: 'Hold payslip', value: 'Hold payslip' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Pending', value: 'Pending' }
  ];

  const processedOptions = [
    { label: '-- Select Timing --', value: '' },
    { label: 'Next week', value: 'Next week' },
    { label: 'This Week', value: 'This Week' },
    { label: 'This Week/Individual', value: 'This Week/Individual' },
    { label: 'Monthly', value: 'Monthly' },
    { label: 'Every Week', value: 'Every Week' },
    { label: 'Every week /Individual', value: 'Every week /Individual' },
    { label: 'Every Monday/Individual', value: 'Every Monday/Individual' },
    { label: 'Every Week(Wednesday)', value: 'Every Week(Wednesday)' },
    { label: 'Every Week(Friday)', value: 'Every Week(Friday)' }
  ];

  // Filter rows
  const filteredRows = payslipTracking.filter((row) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        (row.company || '').toLowerCase().includes(q) ||
        (row.email || '').toLowerCase().includes(q) ||
        (row.cc || '').toLowerCase().includes(q) ||
        (row.updates || '').toLowerCase().includes(q) ||
        (row.notes || '').toLowerCase().includes(q) ||
        (row.software || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (softwareFilter !== 'all' && (row.software || '').toLowerCase() !== softwareFilter.toLowerCase()) return false;
    if (payrunFilter !== 'all') {
      const pr = (row.payrunPeriod || '').toLowerCase();
      if (payrunFilter === 'fortnightly' && !pr.includes('fortnightly')) return false;
      if (payrunFilter === 'weekly' && !pr.includes('weekly')) return false;
      if (payrunFilter === 'monthly' && !pr.includes('monthly')) return false;
    }
    if (superFilter !== 'all') {
      if (superFilter === 'empty' && row.superStatus) return false;
      if (superFilter !== 'empty' && row.superStatus !== superFilter) return false;
    }
    if (payslipFilter !== 'all') {
      if (payslipFilter === 'empty' && row.payslipStatus) return false;
      if (payslipFilter !== 'empty' && row.payslipStatus !== payslipFilter) return false;
    }
    if (processedFilter !== 'all') {
      if (processedFilter === 'next' && !row.processed.toLowerCase().includes('next')) return false;
      if (processedFilter === 'this' && !row.processed.toLowerCase().includes('this')) return false;
      if (processedFilter === 'every' && !row.processed.toLowerCase().includes('every')) return false;
      if (processedFilter === 'monthly' && !row.processed.toLowerCase().includes('monthly')) return false;
    }
    return true;
  });

  // Summary Metrics
  const totalRecords = payslipTracking.length;
  const payslipsSentCount = payslipTracking.filter((r) => r.payslipStatus === 'Payslip sent').length;
  const superSubmittedCount = payslipTracking.filter((r) => r.superStatus === 'Submitted').length;
  const holdOrActionCount = payslipTracking.filter(
    (r) => r.superStatus === 'Not activate heroclear' || r.payslipStatus === 'Hold payslip'
  ).length;

  const handleInspectClient = (clientId) => {
    setSelectedClientId(clientId);
    navigate(`/clients/${clientId}`);
  };

  const handleExportCsv = () => {
    const headers = [
      'Software',
      'Company',
      'Updates',
      'Payrun Period',
      'Super status',
      'Payslip status',
      'Notes',
      'Processed',
      'email',
      'CC'
    ];

    const escapeCsv = (str) => {
      const s = str === null || str === undefined ? '' : String(str);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };

    const lines = [headers.join(',')];
    filteredRows.forEach((r) => {
      lines.push([
        escapeCsv(r.software),
        escapeCsv(r.company),
        escapeCsv(r.updates),
        escapeCsv(r.payrunPeriod),
        escapeCsv(r.superStatus),
        escapeCsv(r.payslipStatus),
        escapeCsv(r.notes),
        escapeCsv(r.processed),
        escapeCsv(r.email),
        escapeCsv(r.cc)
      ].join(','));
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Payslip_Tracking_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Exported ${filteredRows.length} payslip tracking records to CSV.`);
  };

  const handleCreateRow = (e) => {
    e.preventDefault();
    if (!newRow.company.trim()) {
      showToast('Please enter a company name.', 'error');
      return;
    }

    // If custom period or note, register in recently added
    if (newRow.payrunPeriod && !standardPayrunPeriods.includes(newRow.payrunPeriod)) {
      addRecentPayrunPeriod(newRow.payrunPeriod);
    }
    if (newRow.notes && !standardNotesOptions.includes(newRow.notes)) {
      addRecentNote(newRow.notes);
    }

    addPayslipTrackingRow(newRow);
    setNewRow({
      software: 'Quickbook',
      company: '',
      updates: '',
      payrunPeriod: 'Fortnightly',
      superStatus: '',
      payslipStatus: '',
      notes: 'Fixed until said',
      processed: 'Next week',
      email: '',
      cc: ''
    });
    setManualPayrunInModal(false);
    setManualNoteInModal(false);
    setShowAddModal(false);
  };

  // Badge styling helpers
  const getSuperBadgeStyle = (status) => {
    if (!status) return 'bg-surface-container-low text-secondary border-outline-variant/30';
    if (status === 'Submitted') return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (status === 'Not activate heroclear') return 'bg-amber-50 text-amber-900 border-amber-300 font-bold';
    if (status === 'Hold payslip') return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  const getPayslipBadgeStyle = (status) => {
    if (!status) return 'bg-surface-container-low text-secondary border-outline-variant/30';
    if (status === 'Payslip sent') return 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold';
    if (status === 'Hold payslip') return 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
    return 'bg-blue-50 text-blue-800 border-blue-200';
  };

  const getProcessedBadgeStyle = (val) => {
    if (!val) return 'bg-surface-container-low text-secondary border-outline-variant/30';
    const v = val.toLowerCase();
    if (v.includes('this week')) return 'bg-amber-50 text-amber-900 border-amber-300 font-semibold';
    if (v.includes('next week')) return 'bg-indigo-50 text-indigo-900 border-indigo-200 font-semibold';
    if (v.includes('every')) return 'bg-sky-50 text-sky-900 border-sky-200 font-semibold';
    if (v.includes('monthly')) return 'bg-purple-50 text-purple-900 border-purple-200 font-semibold';
    return 'bg-surface-container text-on-surface border-outline-variant/30';
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Header */}
      <div className="py-space-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20 mb-space-md">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-[16px] text-primary">table_chart</span>
            <span>Client Payslip &amp; Wage Management Master Sheet</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-1 flex items-center gap-2">
            Payslip / Wage Management
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
              {totalRecords} Active Records
            </span>
          </h1>
          <p className="font-body-md text-sm text-secondary mt-0.5">
            Interactive tracking table for client payruns, updates, superannuation, payslip dispatch, and schedule status.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Record</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Aggregate Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm mb-space-md">
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Total Clients</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">receipt_long</span>
          </div>
          <span className="text-xl font-bold text-on-surface font-headline-lg">{totalRecords}</span>
          <span className="text-[10px] text-secondary block">Full practice ledger</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Payslips Sent</span>
            <span className="material-symbols-outlined text-[18px] text-emerald-600">mark_email_read</span>
          </div>
          <span className="text-xl font-bold text-emerald-700 font-headline-lg">{payslipsSentCount}</span>
          <span className="text-[10px] text-emerald-600 block">Dispatched to employees</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Super Submitted</span>
            <span className="material-symbols-outlined text-[18px] text-primary">savings</span>
          </div>
          <span className="text-xl font-bold text-primary font-headline-lg">{superSubmittedCount}</span>
          <span className="text-[10px] text-primary block">Cleared / direct submitted</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-secondary uppercase block">Action Required</span>
            <span className="material-symbols-outlined text-[18px] text-rose-500">warning</span>
          </div>
          <span className="text-xl font-bold text-rose-700 font-headline-lg">{holdOrActionCount}</span>
          <span className="text-[10px] text-rose-600 block">HeroClear setup or On-hold</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs mb-space-md flex flex-col gap-2.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-space-sm">
          {/* Search box */}
          <div className="flex flex-1 items-center gap-2 max-w-md bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/30">
            <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by company, email, CC, updates, or notes..."
              className="w-full text-xs bg-transparent focus:outline-none placeholder:text-outline text-on-surface"
            />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="text-secondary hover:text-on-surface">
                <span className="material-symbols-outlined text-[16px]">clear</span>
              </button>
            )}
          </div>

          <div className="text-xs text-secondary font-medium">
            Showing <strong className="text-on-surface">{filteredRows.length}</strong> of {totalRecords} records
          </div>
        </div>

        {/* Dropdown Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-outline-variant/20 text-xs">
          <span className="text-secondary font-bold text-[11px] uppercase tracking-wider">Filters:</span>

          {/* Software Filter */}
          <select
            value={softwareFilter}
            onChange={(e) => setSoftwareFilter(e.target.value)}
            className="h-7 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">Software: All</option>
            <option value="Quickbook">Quickbook</option>
            <option value="Xero">Xero</option>
          </select>

          {/* Payrun Period Filter */}
          <select
            value={payrunFilter}
            onChange={(e) => setPayrunFilter(e.target.value)}
            className="h-7 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">Period: All</option>
            <option value="fortnightly">Fortnightly</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {/* Super Status Filter */}
          <select
            value={superFilter}
            onChange={(e) => setSuperFilter(e.target.value)}
            className="h-7 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">Super Status: All</option>
            <option value="Submitted">Submitted</option>
            <option value="Not activate heroclear">Not activate heroclear</option>
            <option value="Hold payslip">Hold payslip</option>
            <option value="empty">Not Submitted / Empty</option>
          </select>

          {/* Payslip Status Filter */}
          <select
            value={payslipFilter}
            onChange={(e) => setPayslipFilter(e.target.value)}
            className="h-7 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">Payslip Status: All</option>
            <option value="Payslip sent">Payslip sent</option>
            <option value="Hold payslip">Hold payslip</option>
            <option value="empty">Not Sent / Empty</option>
          </select>

          {/* Processed Timing Filter */}
          <select
            value={processedFilter}
            onChange={(e) => setProcessedFilter(e.target.value)}
            className="h-7 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none"
          >
            <option value="all">Processed Timing: All</option>
            <option value="this">This Week</option>
            <option value="next">Next Week</option>
            <option value="every">Every Week</option>
            <option value="monthly">Monthly</option>
          </select>

          {/* Reset Filters */}
          {(softwareFilter !== 'all' || payrunFilter !== 'all' || superFilter !== 'all' || payslipFilter !== 'all' || processedFilter !== 'all' || search) && (
            <button
              type="button"
              onClick={() => {
                setSoftwareFilter('all');
                setPayrunFilter('all');
                setSuperFilter('all');
                setPayslipFilter('all');
                setProcessedFilter('all');
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

      {/* Main Payslip Tracking Table */}
      <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs min-w-[1360px]">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold text-[11px] tracking-wide">
                <th className="py-2.5 px-2 w-9 text-center">#</th>
                <th className="py-2.5 px-2 min-w-[105px]">Software</th>
                <th className="py-2.5 px-2 min-w-[170px]">Company</th>
                <th className="py-2.5 px-2 min-w-[210px]">Updates</th>
                <th className="py-2.5 px-2 min-w-[180px]">
                  <div className="flex items-center gap-1">
                    <span>Payrun Period</span>

                  </div>
                </th>
                <th className="py-2.5 px-2 min-w-[145px]">Super status</th>
                <th className="py-2.5 px-2 min-w-[130px]">Payslip status</th>
                <th className="py-2.5 px-2 min-w-[190px]">
                  <div className="flex items-center gap-1">
                    <span>Notes</span>

                  </div>
                </th>
                <th className="py-2.5 px-2 min-w-[150px]">Processed</th>
                <th className="py-2.5 px-2 min-w-[160px]">email</th>
                <th className="py-2.5 px-2 min-w-[150px]">CC</th>
                <th className="py-2.5 px-1.5 w-8 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/15 font-normal">
              {filteredRows.map((row, idx) => {
                return (
                  <tr
                    key={row.id}
                    className="hover:bg-surface-container-low/60 transition group"
                  >
                    {/* # Index */}
                    <td className="py-2 px-2 text-center text-secondary font-mono text-[11px]">
                      {idx + 1}
                    </td>

                    {/* 1. Software Dropdown */}
                    <td className="py-2 px-2">
                      <select
                        value={row.software}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'software', e.target.value)}
                        className={`h-7 px-2 rounded-lg text-xs font-bold border transition focus:outline-none cursor-pointer ${row.software === 'Xero'
                            ? 'bg-sky-50 text-sky-800 border-sky-300'
                            : row.software === 'MYOB'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          }`}
                      >
                        <option value="Quickbook">Quickbook</option>
                        <option value="Xero">Xero</option>
                        <option value="MYOB">MYOB</option>
                      </select>
                    </td>

                    {/* 2. Company */}
                    <td className="py-2 px-2">
                      <div className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => handleInspectClient(row.clientId)}
                          className="font-bold text-on-surface hover:text-primary transition text-left text-xs leading-snug line-clamp-2"
                          title={`View profile for ${row.company}`}
                        >
                          {row.company}
                        </button>
                        <span className="text-[10px] text-secondary font-mono">{row.id}</span>
                      </div>
                    </td>

                    {/* 3. Updates (Text Input) */}
                    <td className="py-2 px-2">
                      <input
                        type="text"
                        value={row.updates || ''}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'updates', e.target.value)}
                        placeholder="Add updates / instructions..."
                        className="w-full text-xs px-2 py-1 rounded bg-transparent hover:bg-surface-container-lowest focus:bg-surface-container-lowest border border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none transition text-on-surface placeholder:text-outline/40"
                      />
                    </td>

                    {/* 4. Payrun Period (Interactive Cell with manual text input & 'Recently Added' section) */}
                    <td className="py-2 px-2">
                      <PayrunPeriodCell
                        row={row}
                        onUpdate={updatePayslipTrackingField}
                        recentPeriods={recentPayrunPeriods}
                        onAddRecentPeriod={addRecentPayrunPeriod}
                      />
                    </td>

                    {/* 5. Super status (Dropdown) */}
                    <td className="py-2 px-2">
                      <select
                        value={row.superStatus || ''}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'superStatus', e.target.value)}
                        className={`w-full h-7 px-2 rounded-lg text-xs border transition focus:outline-none cursor-pointer ${getSuperBadgeStyle(
                          row.superStatus
                        )}`}
                      >
                        {superStatusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                        {row.superStatus && !superStatusOptions.some((o) => o.value === row.superStatus) && (
                          <option value={row.superStatus}>{row.superStatus}</option>
                        )}
                      </select>
                    </td>

                    {/* 6. Payslip status (Dropdown) */}
                    <td className="py-2 px-2">
                      <select
                        value={row.payslipStatus || ''}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'payslipStatus', e.target.value)}
                        className={`w-full h-7 px-2 rounded-lg text-xs border transition focus:outline-none cursor-pointer ${getPayslipBadgeStyle(
                          row.payslipStatus
                        )}`}
                      >
                        {payslipStatusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                        {row.payslipStatus && !payslipStatusOptions.some((o) => o.value === row.payslipStatus) && (
                          <option value={row.payslipStatus}>{row.payslipStatus}</option>
                        )}
                      </select>
                    </td>

                    {/* 7. Notes (Interactive Cell with manual text input & 'Recently Added' section) */}
                    <td className="py-2 px-2">
                      <NotesCell
                        row={row}
                        onUpdate={updatePayslipTrackingField}
                        recentNotes={recentNotes}
                        onAddRecentNote={addRecentNote}
                      />
                    </td>

                    {/* 8. Processed (Dropdown) */}
                    <td className="py-2 px-2">
                      <select
                        value={row.processed || ''}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'processed', e.target.value)}
                        className={`w-full h-7 px-2 rounded-lg text-xs border transition focus:outline-none cursor-pointer ${getProcessedBadgeStyle(
                          row.processed
                        )}`}
                      >
                        {processedOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                        {row.processed && !processedOptions.some((o) => o.value === row.processed) && (
                          <option value={row.processed}>{row.processed}</option>
                        )}
                      </select>
                    </td>

                    {/* 9. email (Email input) */}
                    <td className="py-2 px-2">
                      <input
                        type="email"
                        value={row.email || ''}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'email', e.target.value)}
                        placeholder="client@email.com"
                        className="w-full text-xs px-2 py-1 rounded bg-transparent hover:bg-surface-container-lowest focus:bg-surface-container-lowest border border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none transition text-on-surface placeholder:text-outline/40 font-mono text-[11px]"
                      />
                    </td>

                    {/* 10. CC (Email input) */}
                    <td className="py-2 px-2">
                      <input
                        type="email"
                        value={row.cc || ''}
                        onChange={(e) => updatePayslipTrackingField(row.id, 'cc', e.target.value)}
                        placeholder="cc@email.com"
                        className="w-full text-xs px-2 py-1 rounded bg-transparent hover:bg-surface-container-lowest focus:bg-surface-container-lowest border border-transparent hover:border-outline-variant/40 focus:border-primary focus:outline-none transition text-on-surface placeholder:text-outline/40 font-mono text-[11px]"
                      />
                    </td>

                    {/* Row delete action */}
                    <td className="py-2 px-1 text-center">
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Delete tracking entry for ${row.company}?`)) {
                            deletePayslipTrackingRow(row.id);
                          }
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-outline hover:text-error rounded hover:bg-surface-container transition"
                        title="Delete entry"
                      >
                        <span className="material-symbols-outlined text-[16px]">delete</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredRows.length === 0 && (
          <div className="p-12 text-center text-xs text-secondary">
            <span className="material-symbols-outlined text-[36px] text-outline block mb-1">search_off</span>
            <p className="font-bold text-on-surface">No matching payslip records found</p>
            <p className="text-secondary mt-0.5">Try clearing filters or search keywords.</p>
          </div>
        )}
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col">
            <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">add_chart</span>
                </div>
                <div>
                  <h2 className="font-bold text-sm text-on-surface">Add Payslip Tracking Record</h2>
                  <span className="text-[11px] text-secondary">Insert new client entry to master schedule</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateRow} className="p-space-lg flex flex-col gap-3 text-xs overflow-y-auto max-h-[80vh]">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Accounting Software *</label>
                  <select
                    value={newRow.software}
                    onChange={(e) => setNewRow({ ...newRow, software: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 font-semibold text-xs focus:outline-none"
                  >
                    <option value="Quickbook">Quickbook</option>
                    <option value="Xero">Xero</option>
                    <option value="MYOB">MYOB</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Company / Entity *</label>
                  <input
                    type="text"
                    required
                    value={newRow.company}
                    onChange={(e) => setNewRow({ ...newRow, company: e.target.value })}
                    placeholder="e.g. Apex Tech Pty Ltd"
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-on-surface block mb-1">Updates / Instructions</label>
                <input
                  type="text"
                  value={newRow.updates}
                  onChange={(e) => setNewRow({ ...newRow, updates: e.target.value })}
                  placeholder="Special payslip notes or employee instructions..."
                  className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Payrun Period with manual input toggle */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-on-surface">Payrun Period</label>
                    <button
                      type="button"
                      onClick={() => setManualPayrunInModal(!manualPayrunInModal)}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      {manualPayrunInModal ? 'Choose from list' : '+ Type custom'}
                    </button>
                  </div>

                  {manualPayrunInModal ? (
                    <input
                      type="text"
                      value={newRow.payrunPeriod}
                      onChange={(e) => setNewRow({ ...newRow, payrunPeriod: e.target.value })}
                      placeholder="e.g. Fortnightly-Custom"
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  ) : (
                    <select
                      value={newRow.payrunPeriod}
                      onChange={(e) => {
                        if (e.target.value === '__CUSTOM__') {
                          setManualPayrunInModal(true);
                          setNewRow({ ...newRow, payrunPeriod: '' });
                        } else {
                          setNewRow({ ...newRow, payrunPeriod: e.target.value });
                        }
                      }}
                      className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none"
                    >
                      {recentPayrunPeriods && recentPayrunPeriods.length > 0 && (
                        <optgroup label="Recently Added">
                          {recentPayrunPeriods.map((opt) => (
                            <option key={`modal-recent-period-${opt}`} value={opt}>
                              ⭐ {opt}
                            </option>
                          ))}
                        </optgroup>
                      )}
                      <optgroup label="Standard Options">
                        {standardPayrunPeriods.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </optgroup>
                      <option value="__CUSTOM__">✏️ + Type custom...</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Processed Timing</label>
                  <select
                    value={newRow.processed}
                    onChange={(e) => setNewRow({ ...newRow, processed: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none"
                  >
                    {processedOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Super Status</label>
                  <select
                    value={newRow.superStatus}
                    onChange={(e) => setNewRow({ ...newRow, superStatus: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none"
                  >
                    {superStatusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">Payslip Status</label>
                  <select
                    value={newRow.payslipStatus}
                    onChange={(e) => setNewRow({ ...newRow, payslipStatus: e.target.value })}
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none"
                  >
                    {payslipStatusOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes with manual input toggle */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-on-surface">Notes</label>
                  <button
                    type="button"
                    onClick={() => setManualNoteInModal(!manualNoteInModal)}
                    className="text-[11px] text-primary hover:underline font-semibold"
                  >
                    {manualNoteInModal ? 'Choose from list' : '+ Type custom'}
                  </button>
                </div>

                {manualNoteInModal ? (
                  <input
                    type="text"
                    value={newRow.notes}
                    onChange={(e) => setNewRow({ ...newRow, notes: e.target.value })}
                    placeholder="e.g. Custom instructions for payrun..."
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                ) : (
                  <select
                    value={newRow.notes}
                    onChange={(e) => {
                      if (e.target.value === '__CUSTOM__') {
                        setManualNoteInModal(true);
                        setNewRow({ ...newRow, notes: '' });
                      } else {
                        setNewRow({ ...newRow, notes: e.target.value });
                      }
                    }}
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none"
                  >
                    {recentNotes && recentNotes.length > 0 && (
                      <optgroup label="Recently Added">
                        {recentNotes.map((opt) => (
                          <option key={`modal-recent-note-${opt}`} value={opt}>
                            ⭐ {opt}
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <optgroup label="Standard Options">
                      {standardNotesOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </optgroup>
                    <option value="__CUSTOM__">✏️ + Type custom...</option>
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-on-surface block mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={newRow.email}
                    onChange={(e) => setNewRow({ ...newRow, email: e.target.value })}
                    placeholder="payroll@client.com"
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="font-bold text-on-surface block mb-1">CC Email</label>
                  <input
                    type="email"
                    value={newRow.cc}
                    onChange={(e) => setNewRow({ ...newRow, cc: e.target.value })}
                    placeholder="director@client.com"
                    className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-outline-variant/20 flex items-center justify-end gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-8 px-3 rounded-lg text-xs font-semibold text-secondary hover:text-on-surface"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-8 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs transition"
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
