# LedgerPoint | Accounting Client Manager

A high-density web application engineered for CPAs, audit leads, and advisory partners, built from the Google Stitch project **Accounting Client Manager** (`14212466351890930901`) with the **Executive Precision** design system.

---

## Downloaded Stitch Assets & References

Located in the [`downloaded/`](./downloaded/) directory:
1. **Screen 1 (`326222b62e094f36b309a609be079929`):** Invoicing, Retainers & WIP Hub
   - [`screen1_invoicing_retainers_wip.html`](./downloaded/screen1_invoicing_retainers_wip.html)
   - [`screen1_invoicing_retainers_wip.png`](./downloaded/screen1_invoicing_retainers_wip.png)
2. **Screen 2 (`b0ae12a2ab47437f80378bcf40ceea61`):** Firm Overview & Operations Dashboard
   - [`screen2_firm_overview_dashboard.html`](./downloaded/screen2_firm_overview_dashboard.html)
   - [`screen2_firm_overview_dashboard.png`](./downloaded/screen2_firm_overview_dashboard.png)
3. **Screen 3 (`c4a0e3e2d0d040bbaba3a5e0cfda2925`):** Tax & Compliance Workflow Pipeline
   - [`screen3_tax_compliance_workflow.html`](./downloaded/screen3_tax_compliance_workflow.html)
   - [`screen3_tax_compliance_workflow.png`](./downloaded/screen3_tax_compliance_workflow.png)
4. **Screen 4 (`de6ef178b7b44919a2feddad0ac30efb`):** Client 360 Detail & Engagement Hub
   - [`screen4_client_360_detail.html`](./downloaded/screen4_client_360_detail.html)
   - [`screen4_client_360_detail.png`](./downloaded/screen4_client_360_detail.png)
5. **Screen 5 (`e83db9f7c0ed4f3daa45d9d3a0873c2c`):** Client Directory & Portfolio
   - [`screen5_client_directory_portfolio.html`](./downloaded/screen5_client_directory_portfolio.html)
   - [`screen5_client_directory_portfolio.png`](./downloaded/screen5_client_directory_portfolio.png)

---

## Features & Screens Built

- **Overview (`/` or `/overview`):**
  - Operations readiness banner & 14-day tax deadline counter
  - 4 KPI metric cards (Active Engagements 142, Billed YTD $1.48M, Realization Rate 94.2%, Pipeline Throughput 84%)
  - Partner Workload & Utilization Matrix (Elena Vance, Marcus Reed, Sarah Jenkins, David Miller)
  - Critical filing blockers & IRS e-File alerts
  - Live firm activity feed & statutory tax deadlines schedule

- **Clients Directory (`/clients`):**
  - 248 Active Entities portfolio with multi-faceted filtering (Entity Type, Filing Status, Partner, Retainer Tier)
  - Search filter and batch actions
  - Full client table with multi-select checkboxes and direct links to Client 360

- **Client 360 Detail (`/client-360`):**
  - Entity Hero Card for Vanguard Logistics Group, Inc. (and live entity switcher)
  - 6 tabs: Overview, Returns & Workflows, Invoices & Retainers, Documents & Vault, Communications, Audit Trail
  - Retainer KPIs, Active Engagements, Corporate Subsidiaries, Primary Contacts, and Firm Engagement Team

- **Tax Compliance Workflows (`/workflows`):**
  - 5-stage interactive Kanban board:
    1. Document Ingestion
    2. Workpaper & Tie-Out
    3. Partner Review
    4. Form 8879 Signature
    5. IRS Accepted & Filed
  - Filter by form type (Form 1065, 1120-S, 1120, 1040), partner, and search query
  - Interactive "Advance" action moving returns across pipeline stages
  - Kanban Board / Table View / Deadlines view switcher

- **Billing & WIP Hub (`/billing-and-wip`):**
  - Unbilled WIP Inventory ($218k+), Realization Rate, Retainers Collected, Overdue Receivables
  - WIP aging ledger with billable hours, rates, and "Bill Now" action
  - Active invoices table with payment status chips and PDF download
  - Retainer auto-debit triggers & time entry tracking

- **Interactive Modals:**
  - `+ New Client / Engagement` modal
  - `+ Log Time / WIP Entry` modal
  - `+ New Tax Return / Job` modal
  - `Cmd+K` Global Spotlight Search modal

---

## Development & Build

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```
