import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCurrentUser,
  sampleUsers,
  initialServices,
  initialClients,
  initialPendingTasks,
  initialTeamCommunications,
  initialNotProcessedItems,
  initialDeadlineApproachingTasks,
  initialIssueTokens,
  initialBasRecords,
  initialPayRuns,
  initialPayslips,
  initialPayslipTracking
} from '../data/mockData';

const AppContext = createContext();

// Clean up old legacy keys if present
try {
  ['lp_clients', 'lp_workflows', 'lp_wip', 'lp_invoices', 'mis_v2_payslip_tracking', 'mis_v2_bas_records', 'mis_v2_super_batches', 'mis_v2_super_allocations'].forEach((k) => localStorage.removeItem(k));
  const u = localStorage.getItem('mis_v2_current_user');
  if (u && (u.includes('Elena') || u.includes('Liam'))) {
    localStorage.removeItem('mis_v2_current_user');
  }
  const com = localStorage.getItem('mis_v3_team_communications');
  if (com && (com.includes('Elena') || com.includes('Liam') || com.includes('Rachel') || com.includes('Superannuation') || com.includes('AustralianSuper'))) {
    localStorage.removeItem('mis_v3_team_communications');
  }
  const tsk = localStorage.getItem('mis_v3_pending_tasks');
  if (tsk && (tsk.includes('Elena') || tsk.includes('Liam') || tsk.includes('Rachel') || tsk.includes('Superannuation'))) {
    localStorage.removeItem('mis_v3_pending_tasks');
  }
} catch {
  // ignore
}

export function AppProvider({ children }) {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mis_v2_current_user');
    return saved ? JSON.parse(saved) : initialCurrentUser;
  });

  // Services State (Default services without superannuation + dynamically added service types)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('mis_v2_services');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((s) => s.id !== 'superannuation');
        }
      } catch (e) {}
    }
    return initialServices;
  });

  // Clients State
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('mis_v3_clients');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 50) return parsed;
      } catch (e) {}
    }
    return initialClients;
  });

  const [selectedClientId, setSelectedClientId] = useState(() => {
    const saved = localStorage.getItem('mis_v2_selected_client_id');
    return saved || 'CL-201';
  });

  // Flag Signs State: 1. Not Processed
  const [notProcessedItems, setNotProcessedItems] = useState(() => {
    const saved = localStorage.getItem('mis_v2_not_processed');
    return saved ? JSON.parse(saved) : initialNotProcessedItems;
  });

  // Flag Signs State: 2. Deadline Approaching Tasks
  const [deadlineApproachingTasks, setDeadlineApproachingTasks] = useState(() => {
    const saved = localStorage.getItem('mis_v2_deadlines');
    return saved ? JSON.parse(saved) : initialDeadlineApproachingTasks;
  });

  // Flag Signs State: 3. Issue Tokens
  const [issueTokens, setIssueTokens] = useState(() => {
    const saved = localStorage.getItem('mis_v2_issue_tokens');
    return saved ? JSON.parse(saved) : initialIssueTokens;
  });

  // Quick View: 1. Pending Tasks / Works
  const [pendingTasks, setPendingTasks] = useState(() => {
    const saved = localStorage.getItem('mis_v3_pending_tasks');
    return saved ? JSON.parse(saved) : initialPendingTasks;
  });

  // Quick View: 2. Team Communications
  const [teamCommunications, setTeamCommunications] = useState(() => {
    const saved = localStorage.getItem('mis_v3_team_communications');
    return saved ? JSON.parse(saved) : initialTeamCommunications;
  });

  // BAS Records State (247 client tracking sheet)
  const [basRecords, setBasRecords] = useState(() => {
    const saved = localStorage.getItem('mis_v3_bas_records');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].clientName !== undefined) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialBasRecords;
  });

  // BAS Report Selection: Year and Month
  const [basReportYear, setBasReportYearState] = useState(() => {
    const saved = localStorage.getItem('mis_bas_report_year');
    return saved ? parseInt(saved, 10) : 2021;
  });

  const [basReportMonth, setBasReportMonthState] = useState(() => {
    const saved = localStorage.getItem('mis_bas_report_month');
    return saved ? parseInt(saved, 10) : 9; // 9 = September
  });

  const setBasReportYear = (yr) => {
    const val = parseInt(yr, 10);
    setBasReportYearState(val);
    localStorage.setItem('mis_bas_report_year', val.toString());
  };

  const setBasReportMonth = (m) => {
    const val = parseInt(m, 10);
    setBasReportMonthState(val);
    localStorage.setItem('mis_bas_report_month', val.toString());
  };

  // Monthly BAS Store: { [periodKey 'YYYY-MM']: { [recordId]: { periodStatus, basStatus, remarks, responsible, priority } } }
  const [monthlyBasStore, setMonthlyBasStore] = useState(() => {
    const saved = localStorage.getItem('mis_v3_bas_monthly_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {}
    }
    const initialMap = {};
    initialBasRecords.forEach((r) => {
      initialMap[r.id] = {
        periodStatus: r.basSep21 || '',
        basStatus: r.basStatus || 'In progress',
        remarks: r.remarks || '',
        responsible: r.responsible || '',
        priority: r.priority || 'Med'
      };
    });
    return { '2021-09': initialMap };
  });

  // Yearly Company Tax Return Store: { [yearStr 'YYYY']: { [recordId]: 'Submitted' | 'Not Submitted' } }
  const [yearlyCompanyTaxReturnStore, setYearlyCompanyTaxReturnStore] = useState(() => {
    const saved = localStorage.getItem('mis_v3_company_tax_return_yearly');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return parsed;
        }
      } catch (e) {}
    }
    return {};
  });

  // Custom Columns for BAS Table
  const [basCustomColumns, setBasCustomColumns] = useState(() => {
    const saved = localStorage.getItem('mis_v3_bas_custom_columns');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {}
    }
    return [];
  });

  // Yearly Custom Column Values Store: { [yearStr]: { [recordId]: { [colId]: value } } }
  const [yearlyBasCustomStore, setYearlyBasCustomStore] = useState(() => {
    const saved = localStorage.getItem('mis_v3_bas_yearly_custom_store');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') return parsed;
      } catch (e) {}
    }
    return {};
  });

  // Recently Added Values for BAS Dropdowns
  const [recentBasResponsibles, setRecentBasResponsibles] = useState(() => {
    const saved = localStorage.getItem('mis_recent_bas_responsibles');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentBasPriorities, setRecentBasPriorities] = useState(() => {
    const saved = localStorage.getItem('mis_recent_bas_priorities');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentBasStatuses, setRecentBasStatuses] = useState(() => {
    const saved = localStorage.getItem('mis_recent_bas_statuses');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentBasSep21, setRecentBasSep21] = useState(() => {
    const saved = localStorage.getItem('mis_recent_bas_sep21');
    return saved ? JSON.parse(saved) : [];
  });

  const addRecentBasResponsible = (val) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    setRecentBasResponsibles((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev];
      localStorage.setItem('mis_recent_bas_responsibles', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecentBasPriority = (val) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    setRecentBasPriorities((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev];
      localStorage.setItem('mis_recent_bas_priorities', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecentBasStatus = (val) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    setRecentBasStatuses((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev];
      localStorage.setItem('mis_recent_bas_statuses', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecentBasSep21 = (val) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    setRecentBasSep21((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev];
      localStorage.setItem('mis_recent_bas_sep21', JSON.stringify(updated));
      return updated;
    });
  };

  // Payslip & Pay Runs State
  const [payRuns, setPayRuns] = useState(() => {
    const saved = localStorage.getItem('mis_v2_pay_runs');
    return saved ? JSON.parse(saved) : initialPayRuns;
  });

  const [payslips, setPayslips] = useState(() => {
    const saved = localStorage.getItem('mis_v2_payslips');
    return saved ? JSON.parse(saved) : initialPayslips;
  });

  // Payslip Tracking State (exact spreadsheet tracking table with updates, emails, etc.)
  const [payslipTracking, setPayslipTracking] = useState(() => {
    const saved = localStorage.getItem('mis_v3_payslip_tracking');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].updates !== undefined) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialPayslipTracking;
  });

  // Recently Added Custom Dropdown Values
  const [recentPayrunPeriods, setRecentPayrunPeriods] = useState(() => {
    const saved = localStorage.getItem('mis_recent_payrun_periods');
    return saved ? JSON.parse(saved) : [];
  });

  const [recentNotes, setRecentNotes] = useState(() => {
    const saved = localStorage.getItem('mis_recent_notes');
    return saved ? JSON.parse(saved) : [];
  });

  const addRecentPayrunPeriod = (val) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    setRecentPayrunPeriods((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev];
      localStorage.setItem('mis_recent_payrun_periods', JSON.stringify(updated));
      return updated;
    });
  };

  const addRecentNote = (val) => {
    if (!val || !val.trim()) return;
    const trimmed = val.trim();
    setRecentNotes((prev) => {
      if (prev.includes(trimmed)) return prev;
      const updated = [trimmed, ...prev];
      localStorage.setItem('mis_recent_notes', JSON.stringify(updated));
      return updated;
    });
  };

  // Navigation & Interactive UI state
  const [activeModal, setActiveModal] = useState(null);
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedBas, setSelectedBas] = useState(null);
  const [period, setPeriod] = useState("Q3 FY24 (Jan - Mar)");
  const [globalSearch, setGlobalSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Sidebar Visibility State (Show/Hide)
  const [sidebarVisible, setSidebarVisible] = useState(() => {
    const saved = localStorage.getItem('mis_sidebar_visible');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const toggleSidebar = () => {
    setSidebarVisible((prev) => {
      const next = !prev;
      localStorage.setItem('mis_sidebar_visible', JSON.stringify(next));
      return next;
    });
  };

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('mis_v2_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mis_v2_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('mis_v3_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('mis_v2_selected_client_id', selectedClientId);
  }, [selectedClientId]);

  useEffect(() => {
    localStorage.setItem('mis_v2_not_processed', JSON.stringify(notProcessedItems));
  }, [notProcessedItems]);

  useEffect(() => {
    localStorage.setItem('mis_v2_deadlines', JSON.stringify(deadlineApproachingTasks));
  }, [deadlineApproachingTasks]);

  useEffect(() => {
    localStorage.setItem('mis_v2_issue_tokens', JSON.stringify(issueTokens));
  }, [issueTokens]);

  useEffect(() => {
    localStorage.setItem('mis_v3_bas_records', JSON.stringify(basRecords));
  }, [basRecords]);

  useEffect(() => {
    localStorage.setItem('mis_v2_pay_runs', JSON.stringify(payRuns));
  }, [payRuns]);

  useEffect(() => {
    localStorage.setItem('mis_v2_payslips', JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem('mis_v3_payslip_tracking', JSON.stringify(payslipTracking));
  }, [payslipTracking]);

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Auth & Role Handlers
  const login = (email, role = 'Admin') => {
    const existing = sampleUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      const updated = { ...existing, role };
      setCurrentUser(updated);
      showToast(`Logged in successfully as ${updated.name} (${role}).`);
    } else {
      const fallback = {
        id: `USR-${Math.floor(100 + Math.random() * 900)}`,
        name: email.split('@')[0].replace('.', ' '),
        email,
        role,
        title: role === 'Admin' ? 'Managing Partner (Admin)' : 'Staff Accountant (User)',
        phone: "+61 2 9200 4500",
        avatar: email.substring(0, 2).toUpperCase()
      };
      setCurrentUser(fallback);
      showToast(`Welcome! Logged in as ${fallback.name} (${role}).`);
    }
    setActiveModal(null);
  };

  const signup = ({ name, email, role, title, phone }) => {
    const newUser = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name,
      email,
      role: role || 'User',
      title: title || (role === 'Admin' ? 'Partner / Admin' : 'Staff Member'),
      phone: phone || '+61 2 9200 0000',
      avatar: name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    };
    setCurrentUser(newUser);
    showToast(`Account registered and active as ${newUser.name} (${newUser.role}).`);
    setActiveModal(null);
  };

  const switchRole = (newRole) => {
    setCurrentUser((prev) => ({
      ...prev,
      role: newRole,
      title: newRole === 'Admin' ? 'Managing Director & Registered Tax Agent' : 'Senior Staff Accountant'
    }));
    showToast(`Role switched to ${newRole}.`);
  };

  const logout = () => {
    setCurrentUser({
      id: "GUEST",
      name: "Guest User",
      email: "guest@apexledger.com.au",
      role: "User",
      title: "Visitor (Read-Only)",
      phone: "-",
      avatar: "GU"
    });
    showToast("Logged out. You are now browsing in visitor mode.");
  };

  // Dynamic Service Types Handlers
  const addServiceType = (newService) => {
    const serviceSlug = newService.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const serviceObj = {
      id: `svc-${serviceSlug}-${Date.now().toString().slice(-4)}`,
      name: newService.name,
      shortName: newService.shortName || newService.name,
      path: `/services/${serviceSlug}`,
      icon: newService.icon || 'star',
      description: newService.description || 'Custom firm advisory and compliance service.',
      category: newService.category || 'Advisory',
      frequency: newService.frequency || 'Ad-Hoc / Quarterly',
      activeClientsCount: 0,
      unprocessedCount: 0,
      deadlineCount: 0,
      isDefault: false
    };

    setServices((prev) => [...prev, serviceObj]);
    showToast(`Service "${serviceObj.name}" added to Services list.`);
    setActiveModal(null);
  };

  const deleteServiceType = (serviceId) => {
    setServices((prev) => prev.filter((s) => s.id !== serviceId));
    showToast("Service removed from catalog.");
  };

  // Clients Handlers
  const addClient = (newClient) => {
    const fullClient = {
      id: `CL-${Math.floor(200 + Math.random() * 800)}`,
      status: "Active",
      flagsCount: 0,
      unresolvedTokensCount: 0,
      activeServices: newClient.activeServices || ["bas", "payslip"],
      lodgementCycle: newClient.lodgementCycle || "Quarterly",
      gstBasis: newClient.gstBasis || "Accruals",
      payrollFrequency: newClient.payrollFrequency || "Fortnightly",
      employeeCount: parseInt(newClient.employeeCount, 10) || 1,
      dataLinkType: newClient.dataLinkType || "Without Data Link",
      leadPartner: currentUser.name || "Manoj Khanal, CA",
      software: newClient.software || "Quickbook",
      ...newClient
    };
    setClients((prev) => [fullClient, ...prev]);

    // Also add to tracking table
    const newTrackingRow = {
      id: `PT-${Date.now().toString().slice(-4)}`,
      clientId: fullClient.id,
      software: fullClient.software,
      company: fullClient.name,
      updates: '',
      payrunPeriod: fullClient.payrollFrequency,
      superStatus: '',
      payslipStatus: '',
      notes: 'Fixed until said',
      processed: 'Next week',
      email: fullClient.contactEmail || '',
      cc: fullClient.contactCc || ''
    };
    setPayslipTracking((prev) => [newTrackingRow, ...prev]);

    showToast(`Client "${fullClient.name}" created and added to tracking table.`);
    setActiveModal(null);
  };

  const updateClient = (updated) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    if (updated.payrollFrequency) {
      const cleanName = (updated.name || '').trim().toLowerCase();
      setPayslipTracking((prev) =>
        prev.map((row) =>
          row.clientId === updated.id ||
          (cleanName && row.company && row.company.trim().toLowerCase() === cleanName)
            ? { ...row, payrunPeriod: updated.payrollFrequency }
            : row
        )
      );
    }
    showToast(`Client "${updated.name}" updated.`);
  };

  const ensureClientForName = (name, preferredId = null) => {
    if (preferredId) {
      const byId = clients.find((c) => c.id === preferredId);
      if (byId) return byId;
    }
    const cleanName = (name || '').trim().toLowerCase();
    if (cleanName) {
      const exact = clients.find((c) => (c.name || '').trim().toLowerCase() === cleanName);
      if (exact) return exact;
      const partial = clients.find(
        (c) =>
          (c.name || '').trim().toLowerCase().includes(cleanName) ||
          cleanName.includes((c.name || '').trim().toLowerCase())
      );
      if (partial) return partial;
    }
    const newClient = {
      id: preferredId || `CL-${Date.now().toString().slice(-5)}`,
      name: (name || 'New Client').trim(),
      abn: '',
      entityType: 'Pty Ltd',
      software: 'Quickbook',
      status: 'Active',
      flagsCount: 0,
      unresolvedTokensCount: 0,
      activeServices: ['bas', 'payslip'],
      lodgementCycle: 'Quarterly',
      gstBasis: 'Accruals',
      payrollFrequency: 'Fortnightly',
      employeeCount: 1,
      dataLinkType: 'Without Data Link',
      leadPartner: currentUser.name || 'Manoj Khanal, CA',
      contactEmail: '',
      contactCc: ''
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const isClientDataLinked = (clientId, clientName) => {
    let found = null;
    if (clientId) {
      found = clients.find((c) => c.id === clientId);
    }
    if (!found && clientName) {
      const clean = clientName.trim().toLowerCase();
      found = clients.find((c) => (c.name || '').trim().toLowerCase() === clean);
    }
    return found?.dataLinkType === 'With Data Link';
  };

  // Flag Signs Actions: Not Processed
  const markItemProcessed = (itemId) => {
    setNotProcessedItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: 'Processed', stage: 'Completed & Verified' } : item))
    );
    showToast(`Flag sign item resolved & marked as processed.`);
  };

  const addNotProcessedItem = (item) => {
    const newItem = {
      id: `NP-${Date.now().toString().slice(-4)}`,
      status: "Not Processed",
      daysRemaining: 7,
      priority: "Medium",
      assignedTo: currentUser.name || "Manoj Khanal, CA",
      ...item
    };
    setNotProcessedItems((prev) => [newItem, ...prev]);
    showToast(`Added to Not Processed items queue.`);
  };

  // Flag Signs Actions: Deadline Tasks
  const completeDeadlineTask = (taskId) => {
    setDeadlineApproachingTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true, countdown: 'Completed' } : t))
    );
    showToast(`Deadline task marked completed.`);
  };

  const addDeadlineTask = (task) => {
    const newTask = {
      id: `DL-${Date.now().toString().slice(-4)}`,
      priority: "Urgent",
      assignedTo: currentUser.name || "Manoj Khanal, CA",
      completed: false,
      ...task
    };
    setDeadlineApproachingTasks((prev) => [newTask, ...prev]);
    showToast(`Urgent deadline task logged.`);
  };

  // Flag Signs Actions: Issue Tokens
  const resolveIssueToken = (tokenId, notes = "Verified and resolved in portal") => {
    setIssueTokens((prev) =>
      prev.map((t) => (t.id === tokenId ? { ...t, status: 'Resolved', resolutionNotes: notes, resolvedAt: new Date().toLocaleDateString() } : t))
    );
    // Also resolve in teamCommunications if matched
    setTeamCommunications((prev) =>
      prev.map((c) => (c.id === tokenId || (c.content && c.content.includes(tokenId)) ? { ...c, status: 'Resolved' } : c))
    );
    showToast(`Issue token ${tokenId} resolved.`);
  };

  const addIssueToken = (token) => {
    const newToken = {
      id: `TKN-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "Unresolved",
      severity: token.severity || "Warning",
      reportedDate: new Date().toISOString().split('T')[0],
      ...token
    };
    setIssueTokens((prev) => [newToken, ...prev]);

    // Also mirror to Team Communications as an Issue
    const newCom = {
      id: `COM-${Date.now().toString().slice(-4)}`,
      author: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar
      },
      type: "Issue",
      content: `${token.title || 'Compliance Discrepancy'}: ${token.description || token.category || ''}`,
      createdAt: 'Just now',
      clientTag: token.clientId ? { id: token.clientId, name: token.clientName || '' } : null,
      taskTag: null,
      mentions: [],
      isStatusRelated: true,
      status: 'Open',
      severity: token.severity || 'Warning',
      category: token.category || 'General',
      responses: []
    };
    setTeamCommunications((prev) => [newCom, ...prev]);
    showToast(`Issue token ${newToken.id} logged to Quick View.`);
    setActiveModal(null);
  };

  // Quick View: Pending Tasks Actions
  const updatePendingTaskField = (taskId, field, value) => {
    setPendingTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, [field]: value } : t));
      localStorage.setItem('mis_v3_pending_tasks', JSON.stringify(updated));
      return updated;
    });
  };

  const completePendingTask = (taskId) => {
    setPendingTasks((prev) => {
      const updated = prev.map((t) => (t.id === taskId ? { ...t, status: t.status === 'Completed' ? 'Pending' : 'Completed' } : t));
      localStorage.setItem('mis_v3_pending_tasks', JSON.stringify(updated));
      return updated;
    });
    showToast(`Task status toggled.`);
  };

  const addPendingTask = (taskData) => {
    const newTask = {
      id: `TSK-${Math.floor(100 + Math.random() * 900)}`,
      task: taskData.task || 'New Task',
      clientId: taskData.clientId || '',
      clientName: taskData.clientName || 'General Practice',
      service: taskData.service || 'General',
      assignedTo: taskData.assignedTo || currentUser.name,
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      priority: taskData.priority || 'Medium',
      status: taskData.status || 'Pending',
      notes: taskData.notes || ''
    };
    setPendingTasks((prev) => {
      const updated = [newTask, ...prev];
      localStorage.setItem('mis_v3_pending_tasks', JSON.stringify(updated));
      return updated;
    });
    showToast(`Task "${newTask.task}" added.`);
  };

  const deletePendingTask = (taskId) => {
    setPendingTasks((prev) => {
      const updated = prev.filter((t) => t.id !== taskId);
      localStorage.setItem('mis_v3_pending_tasks', JSON.stringify(updated));
      return updated;
    });
    showToast('Task removed.');
  };

  // Quick View: Team Communications Actions
  const addTeamCommunication = (comData) => {
    const newCom = {
      id: `COM-${Date.now().toString().slice(-4)}`,
      author: {
        name: currentUser.name,
        role: currentUser.role,
        avatar: currentUser.avatar
      },
      type: comData.type || 'Comment',
      content: (comData.content || '').trim(),
      createdAt: 'Just now',
      clientTag: comData.clientTag || null,
      taskTag: comData.taskTag || null,
      serviceTag: comData.serviceTag || null,
      mentions: comData.mentions || [],
      isStatusRelated: comData.isStatusRelated !== undefined ? comData.isStatusRelated : (comData.type !== 'Comment'),
      status: comData.status || 'Open',
      severity: comData.severity || 'Normal',
      category: comData.category || 'General',
      responses: []
    };
    setTeamCommunications((prev) => {
      const updated = [newCom, ...prev];
      localStorage.setItem('mis_v3_team_communications', JSON.stringify(updated));
      return updated;
    });
    showToast('Posted message to Team Communications.');
  };

  const addCommunicationReply = (communicationId, { content, statusChange }) => {
    setTeamCommunications((prev) => {
      const updated = prev.map((com) => {
        if (com.id === communicationId) {
          const newReply = {
            id: `RESP-${Date.now().toString().slice(-4)}`,
            author: {
              name: currentUser.name,
              role: currentUser.role,
              avatar: currentUser.avatar
            },
            content: content.trim(),
            createdAt: 'Just now',
            statusChange: statusChange || null
          };
          return {
            ...com,
            status: statusChange || com.status,
            responses: [...(com.responses || []), newReply]
          };
        }
        return com;
      });
      localStorage.setItem('mis_v3_team_communications', JSON.stringify(updated));
      return updated;
    });
    showToast('Response posted to thread.');
  };

  const updateCommunicationStatus = (communicationId, newStatus) => {
    setTeamCommunications((prev) => {
      const updated = prev.map((com) => {
        if (com.id === communicationId) {
          return { ...com, status: newStatus };
        }
        return com;
      });
      localStorage.setItem('mis_v3_team_communications', JSON.stringify(updated));
      return updated;
    });
    showToast(`Communication status updated to ${newStatus}.`);
  };

  const getServiceNotifications = (serviceKey, clientId, clientName) => {
    const cleanName = (clientName || '').trim().toLowerCase();
    const svcKey = (serviceKey || '').trim().toLowerCase();

    return teamCommunications.filter((com) => {
      if (com.status === 'Resolved') return false;
      if (!com.mentions || com.mentions.length === 0) return false;
      if (!com.clientTag || !com.serviceTag) return false;

      // Check service match
      const tagSvcId = (com.serviceTag.id || '').toLowerCase();
      const tagSvcName = (com.serviceTag.name || '').toLowerCase();
      const serviceMatches =
        tagSvcId === svcKey ||
        (svcKey === 'bas' && (tagSvcId === 'bas' || tagSvcName.includes('bas'))) ||
        (svcKey === 'payslip' && (tagSvcId === 'payslip' || tagSvcName.includes('payslip') || tagSvcName.includes('wage')));
      if (!serviceMatches) return false;

      // Check client match
      const tagClientId = com.clientTag.id;
      const tagClientName = (com.clientTag.name || '').trim().toLowerCase();
      return (
        (clientId && tagClientId && tagClientId === clientId) ||
        (cleanName && tagClientName && tagClientName === cleanName)
      );
    });
  };

  const deleteTeamCommunication = (communicationId) => {
    setTeamCommunications((prev) => {
      const updated = prev.filter((c) => c.id !== communicationId);
      localStorage.setItem('mis_v3_team_communications', JSON.stringify(updated));
      return updated;
    });
    showToast('Communication deleted.');
  };

  // BAS Monthly Actions & Data Retrieval
  const currentBasPeriodKey = `${basReportYear}-${String(basReportMonth).padStart(2, '0')}`;

  const getBasRecordsForPeriod = (periodKey = currentBasPeriodKey) => {
    const periodData = monthlyBasStore[periodKey];
    const yearKey = String(periodKey).split('-')[0];
    const yearTaxReturns = yearlyCompanyTaxReturnStore[yearKey] || {};
    const yearCustom = yearlyBasCustomStore[yearKey] || {};

    return basRecords.map((base) => {
      const companyTaxReturn = yearTaxReturns[base.id] || 'Not Submitted';
      const customValues = {
        ...(yearCustom[base.id] || {}),
        ...(periodData?.[base.id]?.customFields || {})
      };
      if (periodData && periodData[base.id]) {
        const p = periodData[base.id];
        return {
          ...base,
          responsible: p.responsible !== undefined ? p.responsible : base.responsible,
          priority: p.priority !== undefined ? p.priority : base.priority,
          basSep21: p.periodStatus !== undefined ? p.periodStatus : (periodKey === '2021-09' ? base.basSep21 : ''),
          basStatus: p.basStatus !== undefined ? p.basStatus : (periodKey === '2021-09' ? base.basStatus : 'In progress'),
          remarks: p.remarks !== undefined ? p.remarks : (periodKey === '2021-09' ? base.remarks : ''),
          companyTaxReturn,
          customValues
        };
      }
      if (periodKey === '2021-09') {
        return { ...base, companyTaxReturn, customValues };
      }
      return {
        ...base,
        basSep21: '',
        basStatus: 'In progress',
        remarks: '',
        companyTaxReturn,
        customValues
      };
    });
  };

  const addBasCustomColumn = (colDef) => {
    const newCol = {
      id: `col_${Date.now().toString(36)}`,
      title: (colDef.title || 'New Column').trim(),
      type: colDef.type || 'text',
      scope: colDef.scope || 'monthly',
      options: Array.isArray(colDef.options) ? colDef.options : []
    };
    setBasCustomColumns((prev) => {
      const updated = [...prev, newCol];
      localStorage.setItem('mis_v3_bas_custom_columns', JSON.stringify(updated));
      return updated;
    });
    showToast(`Added column "${newCol.title}" to BAS report.`);
    return newCol;
  };

  const deleteBasCustomColumn = (colId) => {
    setBasCustomColumns((prev) => {
      const updated = prev.filter((c) => c.id !== colId);
      localStorage.setItem('mis_v3_bas_custom_columns', JSON.stringify(updated));
      return updated;
    });
    showToast('Custom column removed.');
  };

  const updateBasCustomCell = (scope, periodKey, recordId, colId, value) => {
    if (scope === 'yearly') {
      const yearKey = String(periodKey).split('-')[0];
      setYearlyBasCustomStore((prev) => {
        const yearObj = { ...(prev[yearKey] || {}) };
        const recObj = { ...(yearObj[recordId] || {}), [colId]: value };
        yearObj[recordId] = recObj;
        const updated = { ...prev, [yearKey]: yearObj };
        localStorage.setItem('mis_v3_bas_yearly_custom_store', JSON.stringify(updated));
        return updated;
      });
    } else {
      setMonthlyBasStore((prev) => {
        const periodObj = { ...(prev[periodKey] || {}) };
        const currentRec = periodObj[recordId] || {};
        const customFields = { ...(currentRec.customFields || {}), [colId]: value };
        periodObj[recordId] = { ...currentRec, customFields };
        const updatedStore = { ...prev, [periodKey]: periodObj };
        localStorage.setItem('mis_v3_bas_monthly_store', JSON.stringify(updatedStore));
        return updatedStore;
      });
    }
  };

  const updateCompanyTaxReturn = (year, recordId, status) => {
    const yearKey = String(year);
    setYearlyCompanyTaxReturnStore((prev) => {
      const yearObj = { ...(prev[yearKey] || {}) };
      yearObj[recordId] = status;
      const updated = { ...prev, [yearKey]: yearObj };
      localStorage.setItem('mis_v3_company_tax_return_yearly', JSON.stringify(updated));
      return updated;
    });
  };

  const updateBasPeriodField = (periodKey, recordId, field, value) => {
    // 1. Update monthly store
    setMonthlyBasStore((prev) => {
      const periodObj = { ...(prev[periodKey] || {}) };
      const currentRec = periodObj[recordId] || {};
      periodObj[recordId] = {
        ...currentRec,
        [field === 'basSep21' ? 'periodStatus' : field]: value
      };
      const updatedStore = { ...prev, [periodKey]: periodObj };
      localStorage.setItem('mis_v3_bas_monthly_store', JSON.stringify(updatedStore));
      return updatedStore;
    });

    // 2. If clientName, responsible, or priority changed, update baseline
    if (['clientName', 'responsible', 'priority'].includes(field)) {
      setBasRecords((prev) => {
        const updated = prev.map((b) => (b.id === recordId ? { ...b, [field]: value } : b));
        localStorage.setItem('mis_v3_bas_records', JSON.stringify(updated));
        return updated;
      });
    }

    // 3. For 2021-09, keep basRecords in sync
    if (periodKey === '2021-09') {
      setBasRecords((prev) => {
        const updated = prev.map((b) => (b.id === recordId ? { ...b, [field]: value } : b));
        localStorage.setItem('mis_v3_bas_records', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateBasRecordField = (recordId, field, value) => {
    updateBasPeriodField(currentBasPeriodKey, recordId, field, value);
  };

  const deleteBasRecordFromPeriod = (periodKey, recordId) => {
    setBasRecords((prev) => {
      const updated = prev.filter((b) => b.id !== recordId);
      localStorage.setItem('mis_v3_bas_records', JSON.stringify(updated));
      return updated;
    });
    setMonthlyBasStore((prev) => {
      const periodObj = { ...(prev[periodKey] || {}) };
      delete periodObj[recordId];
      const updatedStore = { ...prev, [periodKey]: periodObj };
      localStorage.setItem('mis_v3_bas_monthly_store', JSON.stringify(updatedStore));
      return updatedStore;
    });
    showToast('BAS tracking entry removed.');
  };

  const deleteBasRecord = (recordId) => {
    deleteBasRecordFromPeriod(currentBasPeriodKey, recordId);
  };

  const archiveBasRecord = (recordId) => {
    setBasRecords((prev) => {
      const updated = prev.map((b) => (b.id === recordId ? { ...b, archived: true } : b));
      localStorage.setItem('mis_v3_bas_records', JSON.stringify(updated));
      return updated;
    });
    showToast('Client moved to Archived Clients.');
  };

  const restoreBasRecord = (recordId) => {
    setBasRecords((prev) => {
      const updated = prev.map((b) => (b.id === recordId ? { ...b, archived: false } : b));
      localStorage.setItem('mis_v3_bas_records', JSON.stringify(updated));
      return updated;
    });
    showToast('Client activated and restored to Active Clients.');
  };

  const lodgeBasWithAto = (basId) => {
    const today = new Date().toISOString().split('T')[0];
    updateBasPeriodField(currentBasPeriodKey, basId, 'basStatus', 'Lodged');
    updateBasPeriodField(currentBasPeriodKey, basId, 'remarks', `Lodged with ATO on ${today}`);
    showToast(`BAS for record ${basId} marked as Lodged.`);
  };

  const addBasRecordToPeriod = (periodKey, basData) => {
    const newId = `BAS-${Date.now().toString().slice(-4)}`;
    const newBas = {
      id: newId,
      clientName: basData.clientName || 'New Client',
      responsible: basData.responsible || '',
      priority: basData.priority || 'Med',
      basSep21: basData.basSep21 || '',
      basStatus: basData.basStatus || 'In progress',
      remarks: basData.remarks || ''
    };
    setBasRecords((prev) => {
      const updated = [newBas, ...prev];
      localStorage.setItem('mis_v3_bas_records', JSON.stringify(updated));
      return updated;
    });
    setMonthlyBasStore((prev) => {
      const periodObj = { ...(prev[periodKey] || {}) };
      periodObj[newId] = {
        periodStatus: basData.basSep21 || '',
        basStatus: basData.basStatus || 'In progress',
        remarks: basData.remarks || '',
        responsible: basData.responsible || '',
        priority: basData.priority || 'Med'
      };
      const updatedStore = { ...prev, [periodKey]: periodObj };
      localStorage.setItem('mis_v3_bas_monthly_store', JSON.stringify(updatedStore));
      return updatedStore;
    });
    if (basData.companyTaxReturn) {
      const yearKey = String(periodKey).split('-')[0];
      updateCompanyTaxReturn(yearKey, newId, basData.companyTaxReturn);
    }
    showToast(`BAS entry for ${newBas.clientName} added.`);
    setActiveModal(null);
  };

  const addBasRecord = (basData) => {
    addBasRecordToPeriod(currentBasPeriodKey, basData);
  };

  const rollOverBasMonth = (targetPeriodKey, sourcePeriodKey, copyStatuses = false) => {
    const sourceData = getBasRecordsForPeriod(sourcePeriodKey);
    setMonthlyBasStore((prev) => {
      const targetObj = {};
      sourceData.forEach((rec) => {
        targetObj[rec.id] = {
          responsible: rec.responsible || '',
          priority: rec.priority || 'Med',
          periodStatus: copyStatuses ? rec.basSep21 : '',
          basStatus: copyStatuses ? rec.basStatus : 'In progress',
          remarks: copyStatuses ? rec.remarks : ''
        };
      });
      const updatedStore = { ...prev, [targetPeriodKey]: targetObj };
      localStorage.setItem('mis_v3_bas_monthly_store', JSON.stringify(updatedStore));
      return updatedStore;
    });
    showToast(`Rolled over ${sourceData.length} client entities to ${targetPeriodKey}.`);
  };

  // Payslip Actions
  const approvePayRun = (payRunId) => {
    setPayRuns((prev) =>
      prev.map((pr) => (pr.id === payRunId ? { ...pr, status: 'Approved', stpStatus: 'Lodged to ATO STP' } : pr))
    );
    setPayslips((prev) =>
      prev.map((ps) => (ps.payRunId === payRunId ? { ...ps, status: 'Approved' } : ps))
    );
    showToast(`Pay run ${payRunId} approved and submitted via STP Phase 2.`);
  };

  const createPayRun = (payRunData) => {
    const newPR = {
      id: `PR-2024-W${Math.floor(10 + Math.random() * 40)}-${Date.now().toString().slice(-3)}`,
      status: "Pending Approval",
      stpStatus: "Pending Lodgement",
      ...payRunData
    };
    setPayRuns((prev) => [newPR, ...prev]);
    showToast(`Pay run ${newPR.id} created.`);
    setActiveModal(null);
  };

  // Payslip Tracking Actions
  const updatePayslipTrackingRow = (rowId, updates) => {
    setPayslipTracking((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...updates } : row))
    );
  };

  const updatePayslipTrackingField = (rowId, field, value) => {
    setPayslipTracking((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, [field]: value } : row))
    );
  };

  const addPayslipTrackingRow = (newRow) => {
    const row = {
      id: `PT-${Date.now().toString().slice(-4)}`,
      clientId: `CL-${Math.floor(200 + Math.random() * 800)}`,
      software: 'Quickbook',
      company: 'New Client Company',
      updates: '',
      payrunPeriod: 'Fortnightly',
      superStatus: '',
      payslipStatus: '',
      notes: 'Fixed until said',
      processed: 'Next week',
      email: '',
      cc: '',
      ...newRow
    };
    setPayslipTracking((prev) => [row, ...prev]);
    showToast(`Added new payslip tracking entry for "${row.company}".`);
  };

  const deletePayslipTrackingRow = (rowId) => {
    setPayslipTracking((prev) => prev.filter((r) => r.id !== rowId));
    showToast("Payslip tracking entry permanently deleted.");
  };

  const archivePayslipTrackingRow = (rowId) => {
    setPayslipTracking((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, archived: true } : r))
    );
    showToast("Client moved to Archived Clients.");
  };

  const restorePayslipTrackingRow = (rowId) => {
    setPayslipTracking((prev) =>
      prev.map((r) => (r.id === rowId ? { ...r, archived: false } : r))
    );
    showToast("Client activated and restored to Active Clients.");
  };

  // Reset to initial clean data
  const resetAllData = () => {
    setCurrentUser(initialCurrentUser);
    setServices(initialServices);
    setClients(initialClients);
    setSelectedClientId('CL-201');
    setNotProcessedItems(initialNotProcessedItems);
    setDeadlineApproachingTasks(initialDeadlineApproachingTasks);
    setIssueTokens(initialIssueTokens);
    setBasRecords(initialBasRecords);
    setBasReportYearState(2021);
    setBasReportMonthState(9);
    const initialMap = {};
    initialBasRecords.forEach((r) => {
      initialMap[r.id] = {
        periodStatus: r.basSep21 || '',
        basStatus: r.basStatus || 'In progress',
        remarks: r.remarks || '',
        responsible: r.responsible || '',
        priority: r.priority || 'Med'
      };
    });
    setMonthlyBasStore({ '2021-09': initialMap });
    setYearlyCompanyTaxReturnStore({});
    localStorage.removeItem('mis_v3_company_tax_return_yearly');
    setPayRuns(initialPayRuns);
    setPayslips(initialPayslips);
    setPayslipTracking(initialPayslipTracking);
    setPendingTasks(initialPendingTasks);
    setTeamCommunications(initialTeamCommunications);
    localStorage.setItem('mis_v3_payslip_tracking', JSON.stringify(initialPayslipTracking));
    localStorage.setItem('mis_v3_clients', JSON.stringify(initialClients));
    localStorage.setItem('mis_v3_bas_records', JSON.stringify(initialBasRecords));
    localStorage.setItem('mis_bas_report_year', '2021');
    localStorage.setItem('mis_bas_report_month', '9');
    localStorage.setItem('mis_v3_bas_monthly_store', JSON.stringify({ '2021-09': initialMap }));
    localStorage.setItem('mis_v3_pending_tasks', JSON.stringify(initialPendingTasks));
    localStorage.setItem('mis_v3_team_communications', JSON.stringify(initialTeamCommunications));
    showToast("MIS data reset to clean initial tracking sheet state.");
  };

  // Calculated Flag counts
  const flagCounts = {
    notProcessed: pendingTasks.filter((t) => t.status !== 'Completed').length,
    deadlineApproaching: pendingTasks.filter((t) => (t.priority === 'Critical' || t.priority === 'High') && t.status !== 'Completed').length,
    unresolvedTokens: teamCommunications.filter((c) => c.isStatusRelated && c.status !== 'Resolved').length
  };
  const totalFlagCount = flagCounts.notProcessed + flagCounts.unresolvedTokens;

  const selectedClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  return (
    <AppContext.Provider
      value={{
        // Auth & Role
        currentUser,
        login,
        signup,
        switchRole,
        logout,
        sampleUsers,

        // Flag Signs & Operational Controls
        notProcessedItems,
        markItemProcessed,
        addNotProcessedItem,
        deadlineApproachingTasks,
        completeDeadlineTask,
        addDeadlineTask,
        issueTokens,
        resolveIssueToken,
        addIssueToken,
        flagCounts,
        totalFlagCount,

        // Quick View: 1. Pending Tasks / Works
        pendingTasks,
        setPendingTasks,
        updatePendingTaskField,
        completePendingTask,
        addPendingTask,
        deletePendingTask,

        // Quick View: 2. Team Communications
        teamCommunications,
        setTeamCommunications,
        addTeamCommunication,
        addCommunicationReply,
        updateCommunicationStatus,
        getServiceNotifications,
        deleteTeamCommunication,

        // Services
        services,
        addServiceType,
        deleteServiceType,

        // Clients
        clients,
        selectedClientId,
        setSelectedClientId,
        selectedClient,
        addClient,
        updateClient,
        ensureClientForName,
        isClientDataLinked,

        // BAS
        basRecords,
        setBasRecords,
        selectedBas,
        setSelectedBas,
        addBasRecord,
        updateBasRecordField,
        deleteBasRecord,
        lodgeBasWithAto,
        recentBasResponsibles,
        addRecentBasResponsible,
        recentBasPriorities,
        addRecentBasPriority,
        recentBasStatuses,
        addRecentBasStatus,
        recentBasSep21,
        addRecentBasSep21,
        basReportYear,
        setBasReportYear,
        basReportMonth,
        setBasReportMonth,
        monthlyBasStore,
        yearlyCompanyTaxReturnStore,
        basCustomColumns,
        addBasCustomColumn,
        deleteBasCustomColumn,
        updateBasCustomCell,
        getBasRecordsForPeriod,
        updateBasPeriodField,
        updateCompanyTaxReturn,
        addBasRecordToPeriod,
        deleteBasRecordFromPeriod,
        archiveBasRecord,
        restoreBasRecord,
        rollOverBasMonth,
        currentBasPeriodKey,

        // Payslips & Wages
        payRuns,
        payslips,
        selectedPayslip,
        setSelectedPayslip,
        createPayRun,
        approvePayRun,

        // Payslip Tracking Table
        payslipTracking,
        setPayslipTracking,
        updatePayslipTrackingRow,
        updatePayslipTrackingField,
        addPayslipTrackingRow,
        deletePayslipTrackingRow,
        archivePayslipTrackingRow,
        restorePayslipTrackingRow,
        recentPayrunPeriods,
        addRecentPayrunPeriod,
        recentNotes,
        addRecentNote,

        // Global UI
        activeModal,
        setActiveModal,
        period,
        setPeriod,
        globalSearch,
        setGlobalSearch,
        sidebarVisible,
        setSidebarVisible,
        toggleSidebar,
        toast,
        showToast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
