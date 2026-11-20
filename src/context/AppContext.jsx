import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialCurrentUser,
  sampleUsers,
  initialServices,
  initialClients,
  initialNotProcessedItems,
  initialDeadlineApproachingTasks,
  initialIssueTokens,
  initialBasRecords,
  initialPayRuns,
  initialPayslips,
  initialSuperBatches,
  initialSuperAllocations
} from '../data/mockData';

const AppContext = createContext();

// Clean up old legacy keys if present
try {
  ['lp_clients', 'lp_workflows', 'lp_wip', 'lp_invoices'].forEach((k) => localStorage.removeItem(k));
} catch {
  // ignore
}

export function AppProvider({ children }) {
  // Authentication & Role State
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('mis_v2_current_user');
    return saved ? JSON.parse(saved) : initialCurrentUser;
  });

  // Services State (Default 3 services + dynamically added service types)
  const [services, setServices] = useState(() => {
    const saved = localStorage.getItem('mis_v2_services');
    return saved ? JSON.parse(saved) : initialServices;
  });

  // Clients State
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('mis_v2_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [selectedClientId, setSelectedClientId] = useState(() => {
    const saved = localStorage.getItem('mis_v2_selected_client_id');
    return saved || 'CL-101';
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

  // BAS Records State
  const [basRecords, setBasRecords] = useState(() => {
    const saved = localStorage.getItem('mis_v2_bas_records');
    return saved ? JSON.parse(saved) : initialBasRecords;
  });

  // Payslip & Pay Runs State
  const [payRuns, setPayRuns] = useState(() => {
    const saved = localStorage.getItem('mis_v2_pay_runs');
    return saved ? JSON.parse(saved) : initialPayRuns;
  });

  const [payslips, setPayslips] = useState(() => {
    const saved = localStorage.getItem('mis_v2_payslips');
    return saved ? JSON.parse(saved) : initialPayslips;
  });

  // Superannuation State
  const [superBatches, setSuperBatches] = useState(() => {
    const saved = localStorage.getItem('mis_v2_super_batches');
    return saved ? JSON.parse(saved) : initialSuperBatches;
  });

  const [superAllocations, setSuperAllocations] = useState(() => {
    const saved = localStorage.getItem('mis_v2_super_allocations');
    return saved ? JSON.parse(saved) : initialSuperAllocations;
  });

  // Navigation & Interactive UI state
  const [activeModal, setActiveModal] = useState(null); // 'addService' | 'auth' | 'addClient' | 'addIssueToken' | 'prepareBas' | 'viewPayslip' | 'createPayRun' | 'globalSearch' | null
  const [selectedPayslip, setSelectedPayslip] = useState(null);
  const [selectedBas, setSelectedBas] = useState(null);
  const [period, setPeriod] = useState("Q3 FY24 (Jan - Mar)");
  const [globalSearch, setGlobalSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('mis_v2_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('mis_v2_services', JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem('mis_v2_clients', JSON.stringify(clients));
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
    localStorage.setItem('mis_v2_bas_records', JSON.stringify(basRecords));
  }, [basRecords]);

  useEffect(() => {
    localStorage.setItem('mis_v2_pay_runs', JSON.stringify(payRuns));
  }, [payRuns]);

  useEffect(() => {
    localStorage.setItem('mis_v2_payslips', JSON.stringify(payslips));
  }, [payslips]);

  useEffect(() => {
    localStorage.setItem('mis_v2_super_batches', JSON.stringify(superBatches));
  }, [superBatches]);

  useEffect(() => {
    localStorage.setItem('mis_v2_super_allocations', JSON.stringify(superAllocations));
  }, [superAllocations]);

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
      id: `CL-${Math.floor(100 + Math.random() * 900)}`,
      status: "Active",
      flagsCount: 0,
      unresolvedTokensCount: 0,
      activeServices: newClient.activeServices || ["bas", "payslip", "superannuation"],
      lodgementCycle: newClient.lodgementCycle || "Quarterly",
      gstBasis: newClient.gstBasis || "Accruals",
      payrollFrequency: newClient.payrollFrequency || "Fortnightly",
      employeeCount: parseInt(newClient.employeeCount, 10) || 1,
      leadPartner: currentUser.name || "Elena Vance, CA",
      ...newClient
    };
    setClients((prev) => [fullClient, ...prev]);
    showToast(`Client "${fullClient.name}" created successfully.`);
    setActiveModal(null);
  };

  const updateClient = (updated) => {
    setClients((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
    showToast(`Client "${updated.name}" updated.`);
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
      assignedTo: currentUser.name || "Elena Vance, CA",
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
      assignedTo: currentUser.name || "Elena Vance, CA",
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
    showToast(`Issue token ${newToken.id} created.`);
    setActiveModal(null);
  };

  // BAS Actions
  const lodgeBasWithAto = (basId) => {
    if (currentUser.role !== 'Admin') {
      showToast("Permission Denied: Only Registered Tax Agent (Admin) can authorize ATO BAS lodgements.", "error");
      return;
    }
    const receipt = `ATO-BAS-2024-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const today = new Date().toISOString().split('T')[0];
    setBasRecords((prev) =>
      prev.map((b) => (b.id === basId ? { ...b, status: 'Lodged', atoReceiptId: receipt, lodgedDate: today, reviewedBy: currentUser.name } : b))
    );
    showToast(`BAS successfully lodged to ATO! SBR Receipt: ${receipt}`);
  };

  const addBasRecord = (basData) => {
    const newBas = {
      id: `BAS-24-${Date.now().toString().slice(-4)}`,
      status: "Ready for Review",
      preparedBy: currentUser.name || "Elena Vance, CA",
      ...basData
    };
    setBasRecords((prev) => [newBas, ...prev]);
    showToast(`BAS for ${newBas.clientName} created.`);
    setActiveModal(null);
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

  // Superannuation Actions
  const authorizeSuperBatch = (batchId) => {
    if (currentUser.role !== 'Admin') {
      showToast("Admin authorization required to disburse superannuation clearing batches.", "error");
      return;
    }
    setSuperBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'Processing', authorizedBy: currentUser.name } : b))
    );
    showToast(`Super batch ${batchId} authorized. Dispatched to clearing house gateway.`);
  };

  const submitSuperBatch = (batchId) => {
    setSuperBatches((prev) =>
      prev.map((b) => (b.id === batchId ? { ...b, status: 'Reconciled' } : b))
    );
    showToast(`Super batch ${batchId} reconciled.`);
  };

  // Reset to initial clean data
  const resetAllData = () => {
    setCurrentUser(initialCurrentUser);
    setServices(initialServices);
    setClients(initialClients);
    setSelectedClientId('CL-101');
    setNotProcessedItems(initialNotProcessedItems);
    setDeadlineApproachingTasks(initialDeadlineApproachingTasks);
    setIssueTokens(initialIssueTokens);
    setBasRecords(initialBasRecords);
    setPayRuns(initialPayRuns);
    setPayslips(initialPayslips);
    setSuperBatches(initialSuperBatches);
    setSuperAllocations(initialSuperAllocations);
    showToast("MIS data reset to clean initial state.");
  };

  // Calculated Flag counts
  const flagCounts = {
    notProcessed: notProcessedItems.filter((i) => i.status !== 'Processed').length,
    deadlineApproaching: deadlineApproachingTasks.filter((t) => !t.completed).length,
    unresolvedTokens: issueTokens.filter((t) => t.status !== 'Resolved').length
  };
  const totalFlagCount = flagCounts.notProcessed + flagCounts.deadlineApproaching + flagCounts.unresolvedTokens;

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

        // Flag Signs
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

        // BAS
        basRecords,
        selectedBas,
        setSelectedBas,
        addBasRecord,
        lodgeBasWithAto,

        // Payslips & Wages
        payRuns,
        payslips,
        selectedPayslip,
        setSelectedPayslip,
        createPayRun,
        approvePayRun,

        // Superannuation
        superBatches,
        superAllocations,
        authorizeSuperBatch,
        submitSuperBatch,

        // Global UI
        activeModal,
        setActiveModal,
        period,
        setPeriod,
        globalSearch,
        setGlobalSearch,
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
