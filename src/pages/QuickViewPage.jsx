import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export const TEAM_MEMBERS = [
  'Manoj Khanal, CA',
  'Ashmita',
  'Deepika',
  'Nepal',
  'Rajiv',
  'Rina',
  'Sagar',
  'Sobina'
];

export const SERVICES_LIST = [
  'BAS',
  'Payslip/Wage',
  'Superannuation',
  'Bookkeeping',
  'General'
];

export default function QuickViewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    currentUser,
    clients,
    pendingTasks,
    updatePendingTaskField,
    completePendingTask,
    addPendingTask,
    deletePendingTask,
    teamCommunications,
    addTeamCommunication,
    addCommunicationReply,
    updateCommunicationStatus,
    deleteTeamCommunication,
    setSelectedClientId,
    showToast
  } = useApp();

  // Active view: 'tasks', 'communications', or 'split'
  const tabParam = searchParams.get('tab') || 'tasks';
  const initialView = tabParam === 'tokens' || tabParam === 'communications' ? 'communications' : 'tasks';
  const [activeView, setActiveView] = useState(initialView);

  useEffect(() => {
    if (tabParam === 'tokens' || tabParam === 'communications') {
      setActiveView('communications');
      if (tabParam === 'tokens') setComStatusFilter('open');
    } else if (tabParam === 'deadlines') {
      setActiveView('tasks');
      setTaskPriorityFilter('critical');
    } else if (tabParam === 'tasks' || tabParam === 'not_processed') {
      setActiveView('tasks');
    }
  }, [tabParam]);

  const switchView = (view) => {
    setActiveView(view);
    setSearchParams({ tab: view });
  };

  // =========================================================================
  // VIEW 1: PENDING TASKS STATE & FILTERS
  // =========================================================================
  const [taskSearch, setTaskSearch] = useState('');
  const [taskServiceFilter, setTaskServiceFilter] = useState('all');
  const [taskStaffFilter, setTaskStaffFilter] = useState('all');
  const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
  const [taskStatusFilter, setTaskStatusFilter] = useState('all');
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);

  // New task form state
  const [newTask, setNewTask] = useState({
    task: '',
    clientId: '',
    clientName: '',
    service: 'BAS',
    assignedTo: 'Ashmita',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'High',
    status: 'Pending',
    notes: ''
  });

  const filteredTasks = pendingTasks.filter((t) => {
    if (taskSearch.trim()) {
      const q = taskSearch.toLowerCase();
      const match =
        (t.task || '').toLowerCase().includes(q) ||
        (t.clientName || '').toLowerCase().includes(q) ||
        (t.assignedTo || '').toLowerCase().includes(q) ||
        (t.notes || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    if (taskServiceFilter !== 'all' && (t.service || '').toLowerCase() !== taskServiceFilter.toLowerCase()) {
      return false;
    }
    if (taskStaffFilter !== 'all' && (t.assignedTo || '').toLowerCase() !== taskStaffFilter.toLowerCase()) {
      return false;
    }
    if (taskPriorityFilter !== 'all' && (t.priority || '').toLowerCase() !== taskPriorityFilter.toLowerCase()) {
      return false;
    }
    if (taskStatusFilter !== 'all' && (t.status || '').toLowerCase() !== taskStatusFilter.toLowerCase()) {
      return false;
    }
    return true;
  });

  const pendingCount = pendingTasks.filter((t) => t.status !== 'Completed').length;
  const criticalCount = pendingTasks.filter((t) => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Completed').length;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTask.task.trim()) {
      showToast('Please enter a task title.', 'error');
      return;
    }
    let cName = newTask.clientName;
    if (!cName && newTask.clientId) {
      const found = clients.find((c) => c.id === newTask.clientId);
      if (found) cName = found.name;
    }
    addPendingTask({ ...newTask, clientName: cName || 'General Client' });
    setNewTask({
      task: '',
      clientId: '',
      clientName: '',
      service: 'BAS',
      assignedTo: 'Ashmita',
      dueDate: new Date().toISOString().split('T')[0],
      priority: 'High',
      status: 'Pending',
      notes: ''
    });
    setShowAddTaskModal(false);
  };

  // Jump from task to team chat pre-filled
  const handleDiscussTask = (task) => {
    setActiveView('communications');
    setSearchParams({ tab: 'communications' });
    setComForm((prev) => ({
      ...prev,
      content: `Discussion on task "${task.task}": @${task.assignedTo} `,
      clientTagId: task.clientId || '',
      taskTagId: task.id,
      type: 'Instruction'
    }));
    showToast(`Pre-filled team communication for task "${task.task}".`);
  };

  // =========================================================================
  // VIEW 2: TEAM COMMUNICATIONS STATE & COMPOSER
  // =========================================================================
  const [comTypeFilter, setComTypeFilter] = useState('all');
  const [comStatusFilter, setComStatusFilter] = useState('all');
  const [comSearch, setComSearch] = useState('');
  const [expandedThreads, setExpandedThreads] = useState({});

  // Communication composer state
  const [comForm, setComForm] = useState({
    type: 'Comment', // Comment, Instruction, Issue, Complaint
    content: '',
    clientTagId: '',
    taskTagId: '',
    selectedMentions: [],
    status: 'Open'
  });

  // Reply input state per communication: { [comId]: { content: '', statusChange: '' } }
  const [replyInputs, setReplyInputs] = useState({});

  const toggleThread = (comId) => {
    setExpandedThreads((prev) => ({ ...prev, [comId]: !prev[comId] }));
  };

  const handlePostCommunication = (e) => {
    e.preventDefault();
    if (!comForm.content.trim()) {
      showToast('Please type a communication message.', 'error');
      return;
    }

    let clientTag = null;
    if (comForm.clientTagId) {
      const c = clients.find((item) => item.id === comForm.clientTagId);
      if (c) clientTag = { id: c.id, name: c.name };
    }

    let taskTag = null;
    if (comForm.taskTagId) {
      const t = pendingTasks.find((item) => item.id === comForm.taskTagId);
      if (t) taskTag = { id: t.id, title: t.task };
    }

    // Auto-detect mentions in text (@Name)
    const detectedMentions = [...comForm.selectedMentions];
    TEAM_MEMBERS.forEach((member) => {
      const firstName = member.split(' ')[0];
      if (
        (comForm.content.includes(`@${member}`) || comForm.content.includes(`@${firstName}`)) &&
        !detectedMentions.includes(member)
      ) {
        detectedMentions.push(member);
      }
    });

    addTeamCommunication({
      type: comForm.type,
      content: comForm.content,
      clientTag,
      taskTag,
      mentions: detectedMentions,
      isStatusRelated: comForm.type !== 'Comment',
      status: comForm.type === 'Comment' ? 'Resolved' : comForm.status || 'Open',
      severity: comForm.type === 'Complaint' || comForm.type === 'Issue' ? 'High' : 'Normal',
      category: comForm.type
    });

    setComForm({
      type: 'Comment',
      content: '',
      clientTagId: '',
      taskTagId: '',
      selectedMentions: [],
      status: 'Open'
    });
  };

  const handleSendReply = (comId) => {
    const input = replyInputs[comId] || { content: '', statusChange: '' };
    if (!input.content.trim() && !input.statusChange) {
      showToast('Please enter a response message or select a status change.', 'error');
      return;
    }
    addCommunicationReply(comId, {
      content: input.content || (input.statusChange ? `Status updated to ${input.statusChange}` : ''),
      statusChange: input.statusChange || null
    });
    setReplyInputs((prev) => ({ ...prev, [comId]: { content: '', statusChange: '' } }));
    setExpandedThreads((prev) => ({ ...prev, [comId]: true }));
  };

  const handleInsertMention = (member) => {
    const mentionTag = `@${member} `;
    setComForm((prev) => ({
      ...prev,
      content: prev.content + mentionTag,
      selectedMentions: prev.selectedMentions.includes(member)
        ? prev.selectedMentions
        : [...prev.selectedMentions, member]
    }));
  };

  const filteredCommunications = teamCommunications.filter((com) => {
    if (comTypeFilter !== 'all' && (com.type || '').toLowerCase() !== comTypeFilter.toLowerCase()) {
      return false;
    }
    if (comStatusFilter === 'open' && (com.status === 'Resolved' || !com.isStatusRelated)) {
      return false;
    }
    if (comStatusFilter === 'resolved' && com.status !== 'Resolved') {
      return false;
    }
    if (comSearch.trim()) {
      const q = comSearch.toLowerCase();
      const match =
        (com.content || '').toLowerCase().includes(q) ||
        (com.author?.name || '').toLowerCase().includes(q) ||
        (com.clientTag?.name || '').toLowerCase().includes(q) ||
        (com.taskTag?.title || '').toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  const openIssuesCount = teamCommunications.filter((c) => c.isStatusRelated && c.status !== 'Resolved').length;

  const handleInspectClient = (clientId) => {
    if (clientId) {
      setSelectedClientId(clientId);
      navigate(`/clients/${clientId}`);
    }
  };

  // Helper to format text with highlighted @mentions
  const renderMessageContent = (text) => {
    if (!text) return null;
    const parts = text.split(/(@[\w\s,.'-]+?(?=\s|[.,!?]|$))/g);
    return parts.map((part, i) => {
      if (part.startsWith('@')) {
        return (
          <span key={i} className="inline-block px-1.5 py-0.5 rounded bg-primary/10 text-primary font-bold text-[11px] mx-0.5">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Banner & Header */}
      <div className="py-3 flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-outline-variant/20 mb-4">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-wider font-semibold">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>Practice Management Center • Quick View</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-0.5 flex flex-wrap items-center gap-2.5">
            <span>Quick View &amp; Team Operations</span>
            {pendingCount > 0 ? (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {pendingCount} Tasks Pending
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Tasks Cleared
              </span>
            )}
            {openIssuesCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-error-container text-error border border-error/20">
                {openIssuesCount} Open Communications
              </span>
            )}
          </h1>
          <p className="font-body-md text-sm text-secondary mt-0.5">
            Summarized operational view of pending tasks and centralized team communications for comments, instructions, complaints, and issues.
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddTaskModal(true)}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">add_task</span>
            <span>+ Add Task</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveView('communications');
              setSearchParams({ tab: 'communications' });
              const el = document.getElementById('com-composer');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="h-9 px-3.5 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-primary">chat</span>
            <span>+ Post to Team</span>
          </button>
        </div>
      </div>

      {/* Modern 2-View Segmented Switcher */}
      <div className="flex items-center justify-between border-b border-outline-variant/30 pb-3 mb-4">
        <div className="flex items-center gap-2 p-1 bg-surface-container-low rounded-xl border border-outline-variant/20">
          <button
            type="button"
            onClick={() => switchView('tasks')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeView === 'tasks'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">checklist</span>
            <span>1. Pending Tasks / Works</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              {pendingTasks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => switchView('communications')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${activeView === 'communications'
                ? 'bg-surface-container-lowest text-primary shadow-xs'
                : 'text-secondary hover:text-on-surface'
              }`}
          >
            <span className="material-symbols-outlined text-[18px]">forum</span>
            <span>2. Team Communications</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${openIssuesCount > 0 ? 'bg-error-container text-error' : 'bg-surface-container text-secondary'
              }`}>
              {teamCommunications.length}
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => switchView(activeView === 'split' ? 'tasks' : 'split')}
          className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${activeView === 'split'
              ? 'bg-primary text-on-primary border-primary'
              : 'bg-surface-container-lowest hover:bg-surface-container text-secondary border-outline-variant/30'
            }`}
          title="Toggle Side-by-Side View"
        >
          <span className="material-symbols-outlined text-[16px]">view_column</span>
          <span>{activeView === 'split' ? 'Single View' : 'Split View'}</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 2-SECTION LAYOUT (SINGLE VIEW OR SPLIT VIEW) */}
      {/* ========================================================================= */}
      <div className={`grid gap-5 ${activeView === 'split' ? 'grid-cols-1 xl:grid-cols-2' : 'grid-cols-1'}`}>

        {/* ===================================================================== */}
        {/* VIEW 1: PENDING TASKS / WORKS (TABLE FORMAT) */}
        {/* ===================================================================== */}
        {(activeView === 'tasks' || activeView === 'split') && (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">checklist</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                  Pending Tasks &amp; Works Register
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <span>{filteredTasks.length} shown</span>
                <span>•</span>
                <span className="text-rose-700 font-bold">{criticalCount} critical</span>
              </div>
            </div>

            {/* Filter & Search Strip */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-2.5 mb-3 shadow-2xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative flex-1 min-w-[180px]">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-secondary text-[16px]">
                    search
                  </span>
                  <input
                    type="text"
                    value={taskSearch}
                    onChange={(e) => setTaskSearch(e.target.value)}
                    placeholder="Search pending tasks..."
                    className="w-full h-8 pl-8 pr-3 rounded-lg bg-surface-container-low text-xs text-on-surface placeholder:text-outline/50 border border-outline-variant/20 focus:border-primary focus:outline-none"
                  />
                  {taskSearch && (
                    <button
                      type="button"
                      onClick={() => setTaskSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-secondary hover:text-on-surface"
                    >
                      <span className="material-symbols-outlined text-[13px]">close</span>
                    </button>
                  )}
                </div>

                {/* Service Filter */}
                <select
                  value={taskServiceFilter}
                  onChange={(e) => setTaskServiceFilter(e.target.value)}
                  className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
                >
                  <option value="all">Service: All</option>
                  {SERVICES_LIST.map((s) => (
                    <option key={s} value={s.toLowerCase()}>{s}</option>
                  ))}
                </select>

                {/* Staff Filter */}
                <select
                  value={taskStaffFilter}
                  onChange={(e) => setTaskStaffFilter(e.target.value)}
                  className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
                >
                  <option value="all">Staff: All</option>
                  {TEAM_MEMBERS.map((m) => (
                    <option key={m} value={m.toLowerCase()}>{m}</option>
                  ))}
                </select>

                {/* Priority Filter */}
                <select
                  value={taskPriorityFilter}
                  onChange={(e) => setTaskPriorityFilter(e.target.value)}
                  className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
                >
                  <option value="all">Priority: All</option>
                  <option value="critical">Critical</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                {/* Status Filter */}
                <select
                  value={taskStatusFilter}
                  onChange={(e) => setTaskStatusFilter(e.target.value)}
                  className="h-8 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
                >
                  <option value="all">Status: All</option>
                  <option value="pending">Pending</option>
                  <option value="in progress">In Progress</option>
                  <option value="awaiting review">Awaiting Review</option>
                  <option value="completed">Completed</option>
                </select>

                {/* Reset */}
                {(taskSearch || taskServiceFilter !== 'all' || taskStaffFilter !== 'all' || taskPriorityFilter !== 'all' || taskStatusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setTaskSearch('');
                      setTaskServiceFilter('all');
                      setTaskStaffFilter('all');
                      setTaskPriorityFilter('all');
                      setTaskStatusFilter('all');
                    }}
                    className="text-xs text-primary font-bold hover:underline ml-auto"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Pending Tasks Table */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs min-w-[700px]">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold text-[11px] tracking-wide">
                      <th className="py-2.5 px-2.5 w-8 text-center">#</th>
                      <th className="py-2.5 px-3 min-w-[200px]">Task / Work Description</th>
                      <th className="py-2.5 px-3 min-w-[150px]">Client Entity</th>
                      <th className="py-2.5 px-2.5 min-w-[90px]">Service</th>
                      <th className="py-2.5 px-2.5 min-w-[110px]">Assigned Staff</th>
                      <th className="py-2.5 px-2.5 min-w-[95px]">Due Date</th>
                      <th className="py-2.5 px-2.5 min-w-[85px]">Priority</th>
                      <th className="py-2.5 px-2.5 min-w-[110px]">Status</th>
                      <th className="py-2.5 px-2.5 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/15 font-normal">
                    {filteredTasks.map((t, idx) => {
                      const isDone = t.status === 'Completed';
                      return (
                        <tr
                          key={t.id}
                          className={`hover:bg-surface-container-low/50 transition group ${isDone ? 'opacity-50 bg-slate-50/60' : ''
                            }`}
                        >
                          {/* Index */}
                          <td className="py-2 px-2.5 text-center text-secondary font-mono text-[11px]">
                            {idx + 1}
                          </td>

                          {/* Task Description */}
                          <td className="py-2 px-3">
                            <div className="flex flex-col">
                              <span className={`font-semibold text-on-surface ${isDone ? 'line-through text-secondary' : ''}`}>
                                {t.task}
                              </span>
                              {t.notes && (
                                <span className="text-[11px] text-secondary truncate max-w-[280px]">
                                  {t.notes}
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Client */}
                          <td className="py-2 px-3">
                            <button
                              type="button"
                              onClick={() => handleInspectClient(t.clientId)}
                              className="font-medium text-primary hover:underline text-left truncate max-w-[160px] block"
                              title={t.clientName}
                            >
                              {t.clientName}
                            </button>
                          </td>

                          {/* Service */}
                          <td className="py-2 px-2.5">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-surface-container text-secondary">
                              {t.service}
                            </span>
                          </td>

                          {/* Assigned Staff */}
                          <td className="py-2 px-2.5">
                            <select
                              value={t.assignedTo || ''}
                              onChange={(e) => updatePendingTaskField(t.id, 'assignedTo', e.target.value)}
                              className="w-full text-xs font-medium py-1 px-1.5 rounded bg-transparent hover:bg-surface-container-low border border-transparent hover:border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                            >
                              {TEAM_MEMBERS.map((m) => (
                                <option key={m} value={m}>{m}</option>
                              ))}
                            </select>
                          </td>

                          {/* Due Date */}
                          <td className="py-2 px-2.5 text-secondary font-mono text-[11px]">
                            {t.dueDate}
                          </td>

                          {/* Priority */}
                          <td className="py-2 px-2.5">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${t.priority === 'Critical'
                                  ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                  : t.priority === 'High'
                                    ? 'bg-orange-100 text-orange-900 border border-orange-200'
                                    : t.priority === 'Medium'
                                      ? 'bg-amber-100 text-amber-900 border border-amber-200'
                                      : 'bg-slate-100 text-slate-700'
                                }`}
                            >
                              {t.priority}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-2 px-2.5">
                            <select
                              value={t.status || 'Pending'}
                              onChange={(e) => updatePendingTaskField(t.id, 'status', e.target.value)}
                              className={`text-xs font-bold px-2 py-1 rounded-lg border transition focus:outline-none cursor-pointer ${t.status === 'Completed'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : t.status === 'In Progress'
                                    ? 'bg-amber-50 text-amber-900 border-amber-300'
                                    : t.status === 'Awaiting Review'
                                      ? 'bg-sky-50 text-sky-800 border-sky-300'
                                      : 'bg-surface-container text-on-surface border-outline-variant/20'
                                }`}
                            >
                              <option value="Pending">Pending</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Awaiting Review">Awaiting Review</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="py-2 px-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              {/* Toggle Complete */}
                              <button
                                type="button"
                                onClick={() => completePendingTask(t.id)}
                                className={`h-6 w-6 rounded flex items-center justify-center transition ${isDone
                                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                    : 'text-secondary hover:text-emerald-700 hover:bg-surface-container'
                                  }`}
                                title={isDone ? 'Mark as Pending' : 'Mark as Completed'}
                              >
                                <span className="material-symbols-outlined text-[15px]">check</span>
                              </button>

                              {/* Discuss in Team Chat */}
                              <button
                                type="button"
                                onClick={() => handleDiscussTask(t)}
                                className="h-6 w-6 rounded text-secondary hover:text-primary hover:bg-surface-container flex items-center justify-center transition"
                                title="Discuss in Team Communications"
                              >
                                <span className="material-symbols-outlined text-[15px]">chat</span>
                              </button>

                              {/* Delete */}
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete task "${t.task}"?`)) {
                                    deletePendingTask(t.id);
                                  }
                                }}
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 rounded text-outline hover:text-error hover:bg-surface-container flex items-center justify-center transition"
                                title="Delete task"
                              >
                                <span className="material-symbols-outlined text-[15px]">delete</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {filteredTasks.length === 0 && (
                <div className="p-8 text-center text-xs text-secondary">
                  <span className="material-symbols-outlined text-[32px] text-outline block mb-1">done_all</span>
                  <p className="font-bold text-on-surface">No pending tasks matching filters</p>
                  <p className="text-secondary mt-0.5">All tasks completed or cleared.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===================================================================== */}
        {/* VIEW 2: TEAM COMMUNICATIONS (CHAT-LIKE INTERFACE) */}
        {/* ===================================================================== */}
        {(activeView === 'communications' || activeView === 'split') && (
          <div className="flex flex-col w-full">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">forum</span>
                <h2 className="text-sm font-bold uppercase tracking-wider text-on-surface">
                  Team Communications
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs text-secondary">
                <span>{filteredCommunications.length} messages</span>
                <span>•</span>
                <span className="text-error font-bold">{openIssuesCount} actionable</span>
              </div>
            </div>

            {/* Sub-bar Filters */}
            <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-2.5 mb-3 shadow-2xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                {/* Category Pills */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setComTypeFilter('all')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${comTypeFilter === 'all'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                      }`}
                  >
                    All ({teamCommunications.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setComTypeFilter('instruction')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${comTypeFilter === 'instruction'
                        ? 'bg-indigo-700 text-white'
                        : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
                      }`}
                  >
                    <span>⚡ Instructions</span>
                    <span className="text-[10px]">
                      ({teamCommunications.filter((c) => c.type === 'Instruction').length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setComTypeFilter('issue')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${comTypeFilter === 'issue'
                        ? 'bg-error text-on-error'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200'
                      }`}
                  >
                    <span>⚠️ Issues</span>
                    <span className="text-[10px]">
                      ({teamCommunications.filter((c) => c.type === 'Issue').length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setComTypeFilter('complaint')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${comTypeFilter === 'complaint'
                        ? 'bg-orange-600 text-white'
                        : 'bg-orange-50 hover:bg-orange-100 text-orange-900 border border-orange-200'
                      }`}
                  >
                    <span>🚨 Complaints</span>
                    <span className="text-[10px]">
                      ({teamCommunications.filter((c) => c.type === 'Complaint').length})
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setComTypeFilter('comment')}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${comTypeFilter === 'comment'
                        ? 'bg-slate-700 text-white'
                        : 'bg-surface-container hover:bg-surface-container-high text-secondary'
                      }`}
                  >
                    <span>💬 Comments</span>
                    <span className="text-[10px]">
                      ({teamCommunications.filter((c) => c.type === 'Comment').length})
                    </span>
                  </button>
                </div>

                {/* Status Toggle & Search */}
                <div className="flex items-center gap-2">
                  <select
                    value={comStatusFilter}
                    onChange={(e) => setComStatusFilter(e.target.value)}
                    className="h-7 px-2 rounded-lg bg-surface-container text-xs text-on-surface border border-outline-variant/30 focus:outline-none cursor-pointer"
                  >
                    <option value="all">Status: All</option>
                    <option value="open">Open / Unresolved Only</option>
                    <option value="resolved">Resolved Only</option>
                  </select>

                  <input
                    type="text"
                    value={comSearch}
                    onChange={(e) => setComSearch(e.target.value)}
                    placeholder="Filter chat..."
                    className="h-7 px-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/20 focus:border-primary focus:outline-none w-28 sm:w-36"
                  />
                </div>
              </div>
            </div>

            {/* Chat Composer */}
            <div id="com-composer" className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 p-3 mb-4 shadow-xs">
              <form onSubmit={handlePostCommunication} className="flex flex-col gap-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  {/* Type Selector */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold text-secondary uppercase tracking-wider">Post Type:</span>
                    <div className="flex items-center gap-1">
                      {[
                        { type: 'Comment', label: '💬 Comment', color: 'hover:bg-slate-100' },
                        { type: 'Instruction', label: '⚡ Instruction', color: 'hover:bg-indigo-100 text-indigo-900' },
                        { type: 'Issue', label: '⚠️ Issue', color: 'hover:bg-rose-100 text-rose-900' },
                        { type: 'Complaint', label: '🚨 Complaint', color: 'hover:bg-orange-100 text-orange-900' }
                      ].map((item) => (
                        <button
                          key={item.type}
                          type="button"
                          onClick={() => setComForm({ ...comForm, type: item.type })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${comForm.type === item.type
                              ? 'bg-primary text-on-primary shadow-xs'
                              : `bg-surface-container text-on-surface ${item.color}`
                            }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status if status-related */}
                  {comForm.type !== 'Comment' && (
                    <div className="flex items-center gap-1 text-xs">
                      <span className="text-secondary text-[11px]">Initial Status:</span>
                      <select
                        value={comForm.status}
                        onChange={(e) => setComForm({ ...comForm, status: e.target.value })}
                        className="h-6 px-1.5 text-xs font-bold rounded bg-surface-container text-on-surface border border-outline-variant/30"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Waiting on Client">Waiting on Client</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </div>
                  )}
                </div>

                {/* Message input */}
                <textarea
                  rows={2}
                  value={comForm.content}
                  onChange={(e) => setComForm({ ...comForm, content: e.target.value })}
                  placeholder={`Add a ${comForm.type.toLowerCase()} for the team... Mention with @Name or click helper tags below`}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container-low border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface resize-none"
                />

                {/* Helpers Bar: Tag Client, Tag Task, @Mention Member */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-outline-variant/15 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Tag Client */}
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-secondary">business</span>
                      <select
                        value={comForm.clientTagId}
                        onChange={(e) => setComForm({ ...comForm, clientTagId: e.target.value })}
                        className="h-6 px-1.5 rounded bg-surface-container text-[11px] text-on-surface border border-outline-variant/20 max-w-[140px] truncate"
                      >
                        <option value="">Tag Client...</option>
                        {clients.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tag Task */}
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-secondary">task_alt</span>
                      <select
                        value={comForm.taskTagId}
                        onChange={(e) => setComForm({ ...comForm, taskTagId: e.target.value })}
                        className="h-6 px-1.5 rounded bg-surface-container text-[11px] text-on-surface border border-outline-variant/20 max-w-[140px] truncate"
                      >
                        <option value="">Tag Task...</option>
                        {pendingTasks.map((t) => (
                          <option key={t.id} value={t.id}>{t.task}</option>
                        ))}
                      </select>
                    </div>

                    {/* Quick Mention dropdown */}
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">alternate_email</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleInsertMention(e.target.value);
                          e.target.value = '';
                        }}
                        className="h-6 px-1.5 rounded bg-primary/10 text-[11px] text-primary font-bold border border-primary/20 cursor-pointer"
                        defaultValue=""
                      >
                        <option value="" disabled>@ Mention...</option>
                        {TEAM_MEMBERS.map((m) => (
                          <option key={m} value={m}>@{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="h-7 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider transition shadow-2xs flex items-center gap-1 ml-auto"
                  >
                    <span className="material-symbols-outlined text-[15px]">send</span>
                    <span>Post</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Chat Stream Feed */}
            <div className="flex flex-col gap-3">
              {filteredCommunications.map((com) => {
                const isExpanded = expandedThreads[com.id] || (com.responses && com.responses.length > 0);
                const replyState = replyInputs[com.id] || { content: '', statusChange: '' };

                return (
                  <div
                    key={com.id}
                    className={`p-3.5 rounded-xl border transition shadow-2xs ${com.status === 'Resolved'
                        ? 'bg-surface-container-lowest/70 border-outline-variant/20'
                        : com.type === 'Issue'
                          ? 'bg-rose-50/30 border-rose-200'
                          : com.type === 'Complaint'
                            ? 'bg-orange-50/30 border-orange-200'
                            : com.type === 'Instruction'
                              ? 'bg-indigo-50/30 border-indigo-200'
                              : 'bg-surface-container-lowest border-outline-variant/30'
                      }`}
                  >
                    {/* Header: Author, Avatar, Type, Status */}
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-primary/15 text-primary font-bold flex items-center justify-center text-xs shrink-0">
                          {com.author?.avatar || (com.author?.name ? com.author.name.slice(0, 2).toUpperCase() : 'US')}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-on-surface">
                              {com.author?.name || 'Team Member'}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-surface-container text-secondary">
                              {com.author?.role || 'Staff'}
                            </span>
                          </div>
                          <span className="text-[10px] text-secondary">
                            {com.createdAt}
                          </span>
                        </div>
                      </div>

                      {/* Badges: Type and Status */}
                      <div className="flex items-center gap-1.5 flex-wrap justify-end">
                        {/* Category badge */}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${com.type === 'Instruction'
                              ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                              : com.type === 'Issue'
                                ? 'bg-rose-100 text-rose-900 border border-rose-200'
                                : com.type === 'Complaint'
                                  ? 'bg-orange-100 text-orange-900 border border-orange-200'
                                  : 'bg-slate-100 text-slate-800'
                            }`}
                        >
                          {com.type}
                        </span>

                        {/* Status badge */}
                        {com.isStatusRelated && (
                          <select
                            value={com.status || 'Open'}
                            onChange={(e) => updateCommunicationStatus(com.id, e.target.value)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition focus:outline-none cursor-pointer ${com.status === 'Resolved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : com.status === 'In Progress'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : com.status === 'Waiting on Client'
                                    ? 'bg-purple-50 text-purple-900 border-purple-300'
                                    : 'bg-red-50 text-red-900 border-red-300'
                              }`}
                          >
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Waiting on Client">Waiting on Client</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Tagged Pills: Client & Task */}
                    {(com.clientTag || com.taskTag) && (
                      <div className="flex flex-wrap items-center gap-2 mb-2 text-xs">
                        {com.clientTag && (
                          <button
                            type="button"
                            onClick={() => handleInspectClient(com.clientTag.id)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-surface-container text-primary font-semibold text-[11px] hover:bg-surface-container-high transition"
                          >
                            <span className="material-symbols-outlined text-[13px]">business</span>
                            <span>{com.clientTag.name}</span>
                          </button>
                        )}

                        {com.taskTag && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-purple-50 text-purple-900 border border-purple-200 font-medium text-[11px]">
                            <span className="material-symbols-outlined text-[13px]">task_alt</span>
                            <span>{com.taskTag.title}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Body */}
                    <p className="text-xs text-on-surface leading-relaxed mb-2.5">
                      {renderMessageContent(com.content)}
                    </p>

                    {/* Thread Responses List */}
                    {com.responses && com.responses.length > 0 && isExpanded && (
                      <div className="pl-3 border-l-2 border-primary/30 space-y-2 mb-2.5 mt-2 bg-surface-container-low/40 p-2 rounded-r-lg">
                        {com.responses.map((resp) => (
                          <div key={resp.id} className="text-xs">
                            <div className="flex items-center gap-1.5 text-[11px]">
                              <span className="font-bold text-on-surface">{resp.author?.name}</span>
                              <span className="text-[10px] text-secondary">• {resp.createdAt}</span>
                              {resp.statusChange && (
                                <span className="text-[10px] px-1.5 py-0.2 rounded bg-primary/10 text-primary font-bold">
                                  marked as {resp.statusChange}
                                </span>
                              )}
                            </div>
                            <p className="text-on-surface-variant mt-0.5 leading-snug">
                              {renderMessageContent(resp.content)}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bottom Actions & Inline Reply Input */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-outline-variant/15 text-xs">
                      <div className="flex items-center justify-between text-secondary">
                        <button
                          type="button"
                          onClick={() => toggleThread(com.id)}
                          className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[14px]">
                            {isExpanded ? 'expand_less' : 'reply'}
                          </span>
                          <span>
                            {com.responses?.length
                              ? `${com.responses.length} responses • Reply`
                              : 'Add response / comment'}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm('Delete this communication?')) {
                              deleteTeamCommunication(com.id);
                            }
                          }}
                          className="text-[11px] text-outline hover:text-error transition"
                          title="Delete message"
                        >
                          Delete
                        </button>
                      </div>

                      {/* Reply Box */}
                      {isExpanded && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <input
                            type="text"
                            value={replyState.content}
                            onChange={(e) =>
                              setReplyInputs((prev) => ({
                                ...prev,
                                [com.id]: { ...(prev[com.id] || {}), content: e.target.value }
                              }))
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSendReply(com.id);
                            }}
                            placeholder="Write a response or note..."
                            className="flex-1 h-7 px-2.5 rounded-lg bg-surface-container-low text-xs text-on-surface border border-outline-variant/20 focus:border-primary focus:outline-none"
                          />

                          {/* Optional Status change alongside response */}
                          {com.isStatusRelated && (
                            <select
                              value={replyState.statusChange || ''}
                              onChange={(e) =>
                                setReplyInputs((prev) => ({
                                  ...prev,
                                  [com.id]: { ...(prev[com.id] || {}), statusChange: e.target.value }
                                }))
                              }
                              className="h-7 px-1.5 rounded-lg bg-surface-container text-[11px] text-on-surface border border-outline-variant/20 font-medium"
                            >
                              <option value="">Keep Status</option>
                              <option value="In Progress">→ In Progress</option>
                              <option value="Waiting on Client">→ Waiting Client</option>
                              <option value="Resolved">→ Resolved</option>
                            </select>
                          )}

                          <button
                            type="button"
                            onClick={() => handleSendReply(com.id)}
                            className="h-7 px-2.5 rounded-lg bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold flex items-center justify-center transition"
                            title="Send Reply"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {filteredCommunications.length === 0 && (
                <div className="p-8 text-center text-xs text-secondary bg-surface-container-lowest rounded-xl border border-outline-variant/30">
                  <span className="material-symbols-outlined text-[32px] text-outline block mb-1">forum</span>
                  <p className="font-bold text-on-surface">No communications match the filter</p>
                  <p className="text-secondary mt-0.5">Post an instruction, issue, complaint, or comment above.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-xl max-w-md w-full p-5 border border-outline-variant/30 shadow-xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">add_task</span>
                <h3 className="font-headline-sm text-base font-bold text-on-surface">
                  Create Pending Task
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddTaskModal(false)}
                className="text-secondary hover:text-on-surface p-1 rounded-lg hover:bg-surface-container"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Task Title <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTask.task}
                  onChange={(e) => setNewTask({ ...newTask, task: e.target.value })}
                  placeholder="e.g. Lodge Q1 BAS or Re-run payroll batch..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">
                  Client Entity
                </label>
                <select
                  value={newTask.clientId}
                  onChange={(e) => {
                    const found = clients.find((c) => c.id === e.target.value);
                    setNewTask({
                      ...newTask,
                      clientId: e.target.value,
                      clientName: found ? found.name : ''
                    });
                  }}
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                >
                  <option value="">-- General Practice / Unassigned --</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Service</label>
                  <select
                    value={newTask.service}
                    onChange={(e) => setNewTask({ ...newTask, service: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    {SERVICES_LIST.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Assigned Staff</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    {TEAM_MEMBERS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                    className="w-full text-xs px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                    className="w-full text-xs px-2.5 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface mb-1">Notes / Instructions</label>
                <textarea
                  rows={2}
                  value={newTask.notes}
                  onChange={(e) => setNewTask({ ...newTask, notes: e.target.value })}
                  placeholder="Specific requirements or guidance..."
                  className="w-full text-xs px-3 py-2 rounded-lg bg-surface-container border border-outline-variant/30 focus:border-primary focus:outline-none text-on-surface resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-3.5 py-1.5 rounded-lg border border-outline-variant/40 text-xs font-semibold text-secondary hover:text-on-surface hover:bg-surface-container transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold uppercase tracking-wider transition shadow-xs"
                >
                  Save Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
