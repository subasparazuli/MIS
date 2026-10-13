export const initialClients = [
  {
    id: "VL-8821",
    name: "Vanguard Logistics Group, Inc.",
    ein: "84-2910482",
    entityType: "S-Corp",
    state: "DE",
    city: "Wilmington",
    industry: "Freight & Supply Chain Logistics",
    leadPartner: "Elena Vance, CPA",
    primaryContact: "Alan Morris (Corporate Controller)",
    contactPhone: "+1 (302) 555-0192",
    contactEmail: "amorris@vanguardlogistics.com",
    cfo: "Marcus Reed, VP of Finance",
    retainerTier: "Tier 1 ($48k/yr)",
    annualRetainer: 48000,
    wipBalance: 14250,
    realizationRate: 96.4,
    arBalance: 0,
    status: "In Progress",
    filingDeadline: "Apr 15, 2024",
    returns: ["Form 1120-S", "DE-1100S", "PA-20S"],
    associatedEntities: [
      { name: "Vanguard Mid-Atlantic LLC", ein: "84-3019284", role: "Operating Logistics Subsidiary", status: "Active" },
      { name: "Portside Freight Logistics LLC", ein: "84-4910283", role: "Terminal Facilities Entity", status: "Active" }
    ],
    team: [
      { name: "Elena Vance, CPA", role: "Lead Engagement Partner", hours: "8.4 hrs YTD", initials: "EV", color: "bg-primary text-on-primary" },
      { name: "David Miller", role: "Senior Tax Associate", hours: "32.0 hrs YTD", initials: "DM", color: "bg-surface-variant text-primary" },
      { name: "Rachel Kim", role: "Staff Accountant & Bookkeeper", hours: "41.6 hrs YTD", initials: "RK", color: "bg-surface-container text-on-surface" }
    ]
  },
  {
    id: "AD-4102",
    name: "Apex Dental Partners, LLC",
    ein: "47-1902831",
    entityType: "Partnership",
    state: "TX",
    city: "Dallas",
    industry: "Healthcare Practice Group",
    leadPartner: "Marcus Reed",
    primaryContact: "Dr. Julian Vance",
    contactPhone: "+1 (214) 555-0144",
    contactEmail: "julian@apexdental.com",
    retainerTier: "Tier 2 ($32k/yr)",
    annualRetainer: 32000,
    wipBalance: 18400,
    realizationRate: 92.8,
    arBalance: 4200,
    status: "Needs Review",
    filingDeadline: "Apr 15, 2024",
    returns: ["Form 1065", "TX Margin Tax"],
    team: [
      { name: "Marcus Reed", role: "Tax Partner", hours: "14.2 hrs YTD", initials: "MR", color: "bg-primary text-on-primary" },
      { name: "Rachel Kim", role: "Staff Accountant", hours: "28.5 hrs YTD", initials: "RK", color: "bg-surface-container text-on-surface" }
    ]
  },
  {
    id: "SR-9012",
    name: "Summit Ridge SPV II, LP",
    ein: "12-8920194",
    entityType: "Partnership",
    state: "NY",
    city: "New York",
    industry: "Private Equity Real Estate",
    leadPartner: "Elena Vance, CPA",
    primaryContact: "Claire Sterling",
    contactPhone: "+1 (212) 555-8912",
    contactEmail: "csterling@summitridge.com",
    retainerTier: "Tier 1 ($65k/yr)",
    annualRetainer: 65000,
    wipBalance: 29800,
    realizationRate: 98.1,
    arBalance: 0,
    status: "Filed",
    filingDeadline: "Mar 15, 2024",
    returns: ["Form 1065", "Schedule K-1 (38)"],
    team: [
      { name: "Elena Vance, CPA", role: "Partner", hours: "16.0 hrs YTD", initials: "EV", color: "bg-primary text-on-primary" }
    ]
  },
  {
    id: "CM-5531",
    name: "Coastal Marine Technologies",
    ein: "20-9481720",
    entityType: "C-Corp",
    state: "FL",
    city: "Tampa",
    industry: "Maritime Hardware & Autonomous Navigation",
    leadPartner: "David Miller",
    primaryContact: "Robert Chen",
    contactPhone: "+1 (813) 555-3921",
    contactEmail: "rchen@coastalmarine.tech",
    retainerTier: "Tier 2 ($28k/yr)",
    annualRetainer: 28000,
    wipBalance: 8400,
    realizationRate: 94.0,
    arBalance: 2800,
    status: "In Progress",
    filingDeadline: "Apr 15, 2024",
    returns: ["Form 1120", "FL F-1120", "R&D Credit Form 6765"],
    team: [
      { name: "David Miller", role: "Senior Tax Associate", hours: "22.0 hrs YTD", initials: "DM", color: "bg-surface-variant text-primary" }
    ]
  },
  {
    id: "HT-7729",
    name: "Horizon Therapeutics Corp",
    ein: "36-8192039",
    entityType: "C-Corp",
    state: "MA",
    city: "Boston",
    industry: "Biotech & Clinical Research",
    leadPartner: "Elena Vance, CPA",
    primaryContact: "Dr. Evelyn Drake",
    contactPhone: "+1 (617) 555-9011",
    contactEmail: "e.drake@horizonthera.com",
    retainerTier: "Tier 1 ($72k/yr)",
    annualRetainer: 72000,
    wipBalance: 34100,
    realizationRate: 95.5,
    arBalance: 0,
    status: "In Progress",
    filingDeadline: "Apr 15, 2024",
    returns: ["Form 1120", "Section 382 Study"],
    team: [
      { name: "Elena Vance, CPA", role: "Lead Partner", hours: "18.5 hrs YTD", initials: "EV", color: "bg-primary text-on-primary" }
    ]
  },
  {
    id: "AV-1092",
    name: "Alta Vista Capital Management",
    ein: "98-2290481",
    entityType: "Partnership",
    state: "NY",
    city: "New York",
    industry: "Quantitative Asset Management",
    leadPartner: "Marcus Reed",
    primaryContact: "Siddharth Mehta",
    contactPhone: "+1 (212) 555-4081",
    contactEmail: "smehta@altavistacap.com",
    retainerTier: "Tier 1 ($54k/yr)",
    annualRetainer: 54000,
    wipBalance: 12100,
    realizationRate: 97.2,
    arBalance: 0,
    status: "Filed",
    filingDeadline: "Mar 15, 2024",
    returns: ["Form 1065", "14 K-1s Transmitted"],
    team: [
      { name: "Marcus Reed", role: "Tax Partner", hours: "19.0 hrs YTD", initials: "MR", color: "bg-primary text-on-primary" }
    ]
  },
  {
    id: "BM-3301",
    name: "Beacon Media Holdings, LLC",
    ein: "52-1940294",
    entityType: "LLC",
    state: "CA",
    city: "Los Angeles",
    industry: "Digital Media & Streaming Networks",
    leadPartner: "Sarah Jenkins",
    primaryContact: "Talia Brooks",
    contactPhone: "+1 (310) 555-8291",
    contactEmail: "talia@beaconmedia.com",
    retainerTier: "Tier 3 ($18k/yr)",
    annualRetainer: 18000,
    wipBalance: 6200,
    realizationRate: 91.5,
    arBalance: 3200,
    status: "Blocked",
    filingDeadline: "Apr 15, 2024",
    returns: ["Form 1065", "CA Form 568"],
    team: [
      { name: "Sarah Jenkins", role: "Audit Lead", hours: "11.0 hrs YTD", initials: "SJ", color: "bg-surface-variant text-primary" }
    ]
  },
  {
    id: "CP-6402",
    name: "Clearview Energy Partners",
    ein: "76-0291845",
    entityType: "Partnership",
    state: "TX",
    city: "Houston",
    industry: "Renewable Grid Infrastructure",
    leadPartner: "Marcus Reed",
    primaryContact: "Gareth Cole",
    contactPhone: "+1 (713) 555-1102",
    contactEmail: "gcole@clearviewenergy.com",
    retainerTier: "Tier 1 ($50k/yr)",
    annualRetainer: 50000,
    wipBalance: 21500,
    realizationRate: 94.7,
    arBalance: 0,
    status: "In Progress",
    filingDeadline: "Apr 15, 2024",
    returns: ["Form 1065", "Section 45 Credit Analysis"],
    team: [
      { name: "Marcus Reed", role: "Tax Partner", hours: "15.4 hrs YTD", initials: "MR", color: "bg-primary text-on-primary" }
    ]
  }
];

export const initialWorkflowJobs = [
  {
    id: "JOB-101",
    clientName: "Summit Ridge SPV II, LP",
    clientId: "SR-9012",
    formType: "Form 1065",
    stage: "document_gathering",
    dueDate: "Apr 15, 2024",
    statusBadge: "3 Docs Outstanding",
    statusVariant: "amber",
    leadPartner: "Elena Vance, CPA",
    leadInitials: "EV",
    progress: 35,
    notes: "Awaiting Schedule K-1s from 3 underlying joint venture entities."
  },
  {
    id: "JOB-102",
    clientName: "Beacon Media Holdings, LLC",
    clientId: "BM-3301",
    formType: "Form 1065",
    stage: "document_gathering",
    dueDate: "Apr 15, 2024",
    statusBadge: "Blocked: Trial Balance Discrepancy",
    statusVariant: "rose",
    leadPartner: "Sarah Jenkins",
    leadInitials: "SJ",
    progress: 20,
    notes: "$42k unmapped journal entries in QBO feed."
  },
  {
    id: "JOB-103",
    clientName: "Vanguard Logistics Group, Inc.",
    clientId: "VL-8821",
    formType: "Form 1120-S",
    stage: "workpaper_prep",
    dueDate: "Apr 15, 2024",
    statusBadge: "Tie-Out 90% Complete",
    statusVariant: "indigo",
    leadPartner: "David Miller",
    leadInitials: "DM",
    progress: 75,
    notes: "Multi-state apportionment calculation for DE, PA, NJ."
  },
  {
    id: "JOB-104",
    clientName: "Coastal Marine Technologies",
    clientId: "CM-5531",
    formType: "Form 1120",
    stage: "workpaper_prep",
    dueDate: "Apr 15, 2024",
    statusBadge: "R&D Study Review",
    statusVariant: "indigo",
    leadPartner: "David Miller",
    leadInitials: "DM",
    progress: 60,
    notes: "Form 6765 qualifying research expenses tie-out in progress."
  },
  {
    id: "JOB-105",
    clientName: "Horizon Therapeutics Corp",
    clientId: "HT-7729",
    formType: "Form 1120",
    stage: "partner_review",
    dueDate: "Apr 12, 2024",
    statusBadge: "Partner Review Queue",
    statusVariant: "amber",
    leadPartner: "Elena Vance, CPA",
    leadInitials: "EV",
    progress: 88,
    notes: "Section 382 limitation analysis requires final sign-off."
  },
  {
    id: "JOB-106",
    clientName: "Apex Dental Partners, LLC",
    clientId: "AD-4102",
    formType: "Form 1065",
    stage: "client_signature",
    dueDate: "Apr 10, 2024",
    statusBadge: "Form 8879 Sent for Signature",
    statusVariant: "indigo",
    leadPartner: "Marcus Reed",
    leadInitials: "MR",
    progress: 92,
    notes: "Form 8879 pending digital signature from managing member."
  },
  {
    id: "JOB-107",
    clientName: "Alta Vista Capital Management",
    clientId: "AV-1092",
    formType: "Form 1065",
    stage: "irs_accepted",
    dueDate: "Mar 15, 2024",
    statusBadge: "IRS Accepted",
    statusVariant: "emerald",
    leadPartner: "Marcus Reed",
    leadInitials: "MR",
    progress: 100,
    notes: "Federal and NY State accepted. 14 K-1s published to portal."
  },
  {
    id: "JOB-108",
    clientName: "Clearview Energy Partners",
    clientId: "CP-6402",
    formType: "Form 1065",
    stage: "workpaper_prep",
    dueDate: "Apr 15, 2024",
    statusBadge: "Clean Books Tied",
    statusVariant: "indigo",
    leadPartner: "Marcus Reed",
    leadInitials: "MR",
    progress: 70,
    notes: "Depreciation schedules updated; preparing partner allocation."
  }
];

export const initialWipEntries = [
  {
    id: "WIP-501",
    clientName: "Vanguard Logistics Group, Inc.",
    engagement: "FY23 1120-S & Apportionment",
    staff: "David Miller",
    hours: 24.5,
    rate: 275,
    amount: 6737.50,
    aging: "Current (< 30d)",
    status: "Unbilled"
  },
  {
    id: "WIP-502",
    clientName: "Vanguard Logistics Group, Inc.",
    engagement: "Partner Tax Advisory & Nexus Study",
    staff: "Elena Vance, CPA",
    hours: 8.4,
    rate: 450,
    amount: 3780.00,
    aging: "Current (< 30d)",
    status: "Unbilled"
  },
  {
    id: "WIP-503",
    clientName: "Apex Dental Partners, LLC",
    engagement: "Form 1065 Multi-Location Allocation",
    staff: "Marcus Reed",
    hours: 18.0,
    rate: 425,
    amount: 7650.00,
    aging: "31-60d",
    status: "Unbilled"
  },
  {
    id: "WIP-504",
    clientName: "Horizon Therapeutics Corp",
    engagement: "Section 382 Net Operating Loss Study",
    staff: "Elena Vance, CPA",
    hours: 32.0,
    rate: 450,
    amount: 14400.00,
    aging: "Current (< 30d)",
    status: "Unbilled"
  },
  {
    id: "WIP-505",
    clientName: "Summit Ridge SPV II, LP",
    engagement: "38 Partner Schedule K-1 Synthesis",
    staff: "Rachel Kim",
    hours: 42.0,
    rate: 195,
    amount: 8190.00,
    aging: "Current (< 30d)",
    status: "Unbilled"
  }
];

export const initialInvoices = [
  {
    id: "INV-2024-089",
    client: "Vanguard Logistics Group, Inc.",
    date: "Apr 01, 2024",
    dueDate: "Apr 30, 2024",
    amount: 12000.00,
    type: "Monthly Retainer",
    status: "Paid",
    statusBadge: "bg-emerald-50 text-emerald-700 border-emerald-200"
  },
  {
    id: "INV-2024-074",
    client: "Apex Dental Partners, LLC",
    date: "Mar 15, 2024",
    dueDate: "Apr 15, 2024",
    amount: 4200.00,
    type: "WIP Milestone Billing",
    status: "Pending",
    statusBadge: "bg-amber-50 text-amber-700 border-amber-200"
  },
  {
    id: "INV-2024-061",
    client: "Beacon Media Holdings, LLC",
    date: "Feb 28, 2024",
    dueDate: "Mar 30, 2024",
    amount: 3200.00,
    type: "Q4 Bookkeeping True-up",
    status: "Past Due",
    statusBadge: "bg-rose-50 text-rose-700 border-rose-200"
  },
  {
    id: "INV-2024-055",
    client: "Alta Vista Capital Management",
    date: "Mar 01, 2024",
    dueDate: "Mar 31, 2024",
    amount: 18500.00,
    type: "Tax Compliance Retainer",
    status: "Paid",
    statusBadge: "bg-emerald-50 text-emerald-700 border-emerald-200"
  }
];

export const partnerWorkloads = [
  {
    name: "Elena Vance, CPA",
    title: "Managing Partner",
    activeEngagements: 48,
    capacityPercent: 92,
    billableYtd: 480.5,
    wipManaged: "$114,200",
    initials: "EV",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDM-9xcIPNgyot7olyfq9LPtH8qDEgbqi-eTkNvImZ7jgB4rGBVatMIoVqWFdU_fB4X6Lv4wrRf99Fld5IrzwFaT3WPyXXCSoYQke0aVWFi6AZBpTn5rr0jAEz-3EMXe_NtcBm_55m7474JTsImAwfRKr96sFpB8L64sJIhFzZ4zZT5YpAUJfRTb0_q4dl-XXc502pW8vYn4FC6jvwq9tI29I5wkmvUaI8TPzkh2779bctme6X08GB6IQ"
  },
  {
    name: "Marcus Reed",
    title: "Tax & Advisory Partner",
    activeEngagements: 42,
    capacityPercent: 88,
    billableYtd: 452.0,
    wipManaged: "$98,400",
    initials: "MR",
    avatar: null
  },
  {
    name: "Sarah Jenkins, CPA",
    title: "Audit & Assurance Lead",
    activeEngagements: 28,
    capacityPercent: 74,
    billableYtd: 390.0,
    wipManaged: "$62,100",
    initials: "SJ",
    avatar: null
  },
  {
    name: "David Miller",
    title: "Senior Tax Associate",
    activeEngagements: 24,
    capacityPercent: 96,
    billableYtd: 512.0,
    wipManaged: "$44,300",
    initials: "DM",
    avatar: null
  }
];

export const criticalAlerts = [
  {
    id: "ALT-1",
    severity: "critical",
    title: "IRS e-File Rejection Notice (Schema Validation)",
    client: "Beacon Media Holdings, LLC",
    code: "ERR-F1065-021",
    desc: "EIN mismatch between principal officer SSN and Schedule K-1 allocation line 4.",
    time: "24m ago"
  },
  {
    id: "ALT-2",
    severity: "warning",
    title: "7 Unconfirmed Schedule K-1s Remaining",
    client: "Summit Ridge SPV II, LP",
    code: "WARN-K1-AUDIT",
    desc: "3 partner capital account balances require confirmation before e-file transmission.",
    time: "2h ago"
  },
  {
    id: "ALT-3",
    severity: "info",
    title: "Form 8879 Signature Pending Client Authorization",
    client: "Apex Dental Partners, LLC",
    code: "PEND-SIGN-8879",
    desc: "Automated SMS/Email signature reminder sent 4 hours ago to Dr. Julian Vance.",
    time: "4h ago"
  }
];

export const auditActivities = [
  {
    id: "ACT-1",
    action: "Form 1120-S Workpaper Tie-out Approved",
    user: "Elena Vance, CPA",
    client: "Vanguard Logistics Group, Inc.",
    time: "12m ago",
    icon: "task_alt"
  },
  {
    id: "ACT-2",
    action: "Form 1065 e-File Accepted by IRS & NY DTF",
    user: "IRS e-Services",
    client: "Alta Vista Capital Management",
    time: "48m ago",
    icon: "verified"
  },
  {
    id: "ACT-3",
    action: "Time Entry Logged: 4.3 hrs Tax Advisory",
    user: "David Miller",
    client: "Vanguard Logistics Group, Inc.",
    time: "1h ago",
    icon: "more_time"
  },
  {
    id: "ACT-4",
    action: "Document Uploaded: Final 2023 1099-NEC Compilation",
    user: "Alan Morris (Client Portal)",
    client: "Vanguard Logistics Group, Inc.",
    time: "3h ago",
    icon: "cloud_upload"
  }
];
