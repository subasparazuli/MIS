import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialClients, initialWorkflowJobs, initialWipEntries, initialInvoices, criticalAlerts } from '../data/mockData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem('lp_clients');
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [workflowJobs, setWorkflowJobs] = useState(() => {
    const saved = localStorage.getItem('lp_workflows');
    return saved ? JSON.parse(saved) : initialWorkflowJobs;
  });

  const [wipEntries, setWipEntries] = useState(() => {
    const saved = localStorage.getItem('lp_wip');
    return saved ? JSON.parse(saved) : initialWipEntries;
  });

  const [invoices, setInvoices] = useState(() => {
    const saved = localStorage.getItem('lp_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [selectedClientId, setSelectedClientId] = useState("VL-8821");
  const [activeModal, setActiveModal] = useState(null); // 'addClient' | 'logTime' | 'newJob' | 'globalSearch' | null
  const [period, setPeriod] = useState("FY 2024");
  const [globalSearch, setGlobalSearch] = useState("");
  const [toast, setToast] = useState(null);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('lp_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('lp_workflows', JSON.stringify(workflowJobs));
  }, [workflowJobs]);

  useEffect(() => {
    localStorage.setItem('lp_wip', JSON.stringify(wipEntries));
  }, [wipEntries]);

  useEffect(() => {
    localStorage.setItem('lp_invoices', JSON.stringify(invoices));
  }, [invoices]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const addClient = (newClient) => {
    const fullClient = {
      id: `CL-${Math.floor(1000 + Math.random() * 9000)}`,
      realizationRate: 95.0,
      wipBalance: 0,
      arBalance: 0,
      status: "In Progress",
      filingDeadline: "Apr 15, 2024",
      returns: [newClient.entityType === 'S-Corp' ? 'Form 1120-S' : newClient.entityType === 'Partnership' ? 'Form 1065' : 'Form 1120'],
      associatedEntities: [],
      team: [
        { name: newClient.leadPartner || "Elena Vance, CPA", role: "Lead Partner", hours: "0.0 hrs YTD", initials: "EV", color: "bg-primary text-on-primary" }
      ],
      ...newClient,
    };
    setClients(prev => [fullClient, ...prev]);
    showToast(`Entity "${fullClient.name}" added successfully.`);
  };

  const addWipEntry = (entry) => {
    const rate = entry.staff.includes("Elena") ? 450 : entry.staff.includes("Marcus") ? 425 : 275;
    const hours = parseFloat(entry.hours) || 1.0;
    const newEntry = {
      id: `WIP-${Math.floor(500 + Math.random() * 900)}`,
      clientName: entry.clientName,
      engagement: entry.engagement || "Tax & Compliance Advisory",
      staff: entry.staff || "Elena Vance, CPA",
      hours: hours,
      rate: rate,
      amount: hours * rate,
      aging: "Current (< 30d)",
      status: "Unbilled"
    };
    setWipEntries(prev => [newEntry, ...prev]);

    // Also update client's WIP balance
    setClients(prev => prev.map(c => {
      if (c.name === entry.clientName) {
        return { ...c, wipBalance: (c.wipBalance || 0) + newEntry.amount };
      }
      return c;
    }));

    showToast(`Logged ${hours} hrs billable WIP ($${newEntry.amount.toLocaleString()}).`);
  };

  const moveJobStage = (jobId, newStage) => {
    setWorkflowJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        return { ...j, stage: newStage };
      }
      return j;
    }));
    showToast(`Workflow stage updated.`);
  };

  const addWorkflowJob = (newJob) => {
    const job = {
      id: `JOB-${Math.floor(200 + Math.random() * 800)}`,
      stage: "document_gathering",
      progress: 15,
      statusBadge: "New Engagement Ingested",
      statusVariant: "indigo",
      ...newJob,
    };
    setWorkflowJobs(prev => [job, ...prev]);
    showToast(`Tax Job "${job.clientName} - ${job.formType}" created.`);
  };

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0];

  return (
    <AppContext.Provider value={{
      clients,
      addClient,
      selectedClientId,
      setSelectedClientId,
      selectedClient,
      workflowJobs,
      moveJobStage,
      addWorkflowJob,
      wipEntries,
      addWipEntry,
      invoices,
      activeModal,
      setActiveModal,
      period,
      setPeriod,
      globalSearch,
      setGlobalSearch,
      toast,
      showToast,
      alerts: criticalAlerts
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
