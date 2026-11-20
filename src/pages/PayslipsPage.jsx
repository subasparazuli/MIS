import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function PayslipsPage() {
  const navigate = useNavigate();
  const {
    payRuns,
    payslips,
    approvePayRun,
    setSelectedPayslip,
    setActiveModal,
    setSelectedClientId,
    showToast
  } = useApp();

  const [activeTab, setActiveTab] = useState('payslips'); // 'payslips' | 'payruns'
  const [search, setSearch] = useState('');
  const [employerFilter, setEmployerFilter] = useState('all');

  // Summary Metrics
  const totalGrossPayroll = payRuns.reduce((acc, pr) => acc + (pr.totalGrossWages || 0), 0);
  const totalPaygTax = payRuns.reduce((acc, pr) => acc + (pr.totalPaygWithheld || 0), 0);
  const totalSuperGuarantee = payRuns.reduce((acc, pr) => acc + (pr.totalSuperGuarantee || 0), 0);
  const totalNetDisbursed = payRuns.reduce((acc, pr) => acc + (pr.totalNetPay || 0), 0);

  const filteredPayslips = payslips.filter((ps) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const match =
        ps.employeeName.toLowerCase().includes(q) ||
        ps.employerName.toLowerCase().includes(q) ||
        ps.id.toLowerCase().includes(q) ||
        ps.superFundName.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (employerFilter !== 'all' && ps.clientId !== employerFilter) return false;
    return true;
  });

  const handleOpenPayslip = (ps) => {
    setSelectedPayslip(ps);
    setActiveModal('viewPayslip');
  };

  const handleInspectClient = (clientId) => {
    setSelectedClientId(clientId);
    navigate(`/clients/${clientId}`);
  };

  return (
    <div className="flex flex-col w-full pb-16">
      {/* Top Header */}
      <div className="py-space-md flex flex-col lg:flex-row lg:items-center justify-between gap-space-md border-b border-outline-variant/20 mb-space-md">
        <div>
          <div className="flex items-center gap-2 text-secondary text-xs uppercase tracking-wider font-semibold">
            <span className="material-symbols-outlined text-[16px] text-primary">payments</span>
            <span>Fair Work &amp; Single Touch Payroll (STP Phase 2) Engine</span>
          </div>
          <h1 className="font-headline-lg text-2xl lg:text-3xl font-bold text-on-surface tracking-tight mt-1 flex items-center gap-2">
            Payslip &amp; Wage Management
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
              STP 2 Active
            </span>
          </h1>
          <p className="font-body-md text-sm text-secondary mt-0.5">
            Generation of compliant Australian payslips, PAYG tax withholding deductions, and Super Guarantee (11.5%) tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveModal('createPayRun')}
            className="h-9 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Create Pay Run</span>
          </button>

          <button
            type="button"
            onClick={() => showToast('Batch generating PDF payslips for all active employees...')}
            className="h-9 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg text-xs font-semibold flex items-center gap-1.5 border border-outline-variant/30 shadow-xs transition"
          >
            <span className="material-symbols-outlined text-[18px] text-secondary">file_download</span>
            <span>Batch Download Payslips</span>
          </button>
        </div>
      </div>

      {/* Aggregate Payroll Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm mb-space-lg">
        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Total Gross Wages</span>
          <span className="text-xl font-bold text-on-surface font-headline-lg">
            ${totalGrossPayroll.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-secondary">Current pay cycle</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">PAYG Tax Withheld</span>
          <span className="text-xl font-bold text-primary font-headline-lg">
            ${totalPaygTax.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-primary">ATO withholding remittance</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Super Guarantee (11.5%)</span>
          <span className="text-xl font-bold text-emerald-700 font-headline-lg">
            ${totalSuperGuarantee.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-emerald-600">Accrued SG contributions</span>
        </div>

        <div className="p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs">
          <span className="text-[11px] font-bold text-secondary uppercase block">Net Pay Disbursed</span>
          <span className="text-xl font-bold text-on-surface font-headline-lg">
            ${totalNetDisbursed.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-[10px] text-secondary">Direct bank ABA transfer</span>
        </div>
      </div>

      {/* View Switcher & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-3 bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs mb-space-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('payslips')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'payslips'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-secondary hover:text-on-surface bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">badge</span>
            <span>Individual Payslips ({payslips.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('payruns')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
              activeTab === 'payruns'
                ? 'bg-primary text-on-primary shadow-xs'
                : 'text-secondary hover:text-on-surface bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">view_timeline</span>
            <span>Pay Runs Summary ({payRuns.length})</span>
          </button>
        </div>

        <div className="flex flex-1 sm:max-w-xs items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee, employer, super fund..."
            className="w-full text-xs bg-transparent focus:outline-none placeholder:text-outline text-on-surface"
          />
        </div>
      </div>

      {/* TAB 1: INDIVIDUAL PAYSLIPS TABLE */}
      {activeTab === 'payslips' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                  <th className="py-2.5 px-3">Employee Name</th>
                  <th className="py-2.5 px-3">Employer Entity</th>
                  <th className="py-2.5 px-3">Pay Period</th>
                  <th className="py-2.5 px-3 text-right">Ordinary Hours</th>
                  <th className="py-2.5 px-3 text-right">Gross Pay</th>
                  <th className="py-2.5 px-3 text-right">PAYG Tax</th>
                  <th className="py-2.5 px-3 text-right">Super (11.5%)</th>
                  <th className="py-2.5 px-3 text-right">Net Pay</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Payslip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 font-normal">
                {filteredPayslips.map((ps) => {
                  const isApproved = ps.status === 'Approved';
                  return (
                    <tr key={ps.id} className="hover:bg-surface-container-low/50 transition">
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          <span className="font-bold text-on-surface">{ps.employeeName}</span>
                          <span className="text-[11px] text-secondary">{ps.jobTitle}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <button
                          type="button"
                          onClick={() => handleInspectClient(ps.clientId)}
                          className="font-medium text-primary hover:underline text-left"
                        >
                          {ps.employerName}
                        </button>
                      </td>
                      <td className="py-3 px-3">
                        <span className="text-secondary">{ps.payPeriod}</span>
                        <span className="text-[10px] text-secondary block font-mono">Paid: {ps.payDate}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-on-surface">
                        {ps.ordinaryHours}h @ ${ps.hourlyRate.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-on-surface">
                        ${ps.totalGross.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-error">
                        -${ps.paygWithholding.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-emerald-700">
                        ${ps.superGuaranteeAmount.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <span className="font-bold text-on-surface text-sm">
                          ${ps.netPay.toFixed(2)}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            isApproved
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {ps.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => handleOpenPayslip(ps)}
                          className="h-7 px-2.5 rounded bg-primary hover:bg-primary-container text-on-primary text-[11px] font-semibold flex items-center gap-1 transition ml-auto shadow-2xs"
                        >
                          <span className="material-symbols-outlined text-[14px]">visibility</span>
                          <span>View Slip</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PAY RUNS SUMMARY */}
      {activeTab === 'payruns' && (
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/30 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant/20 text-secondary uppercase font-semibold">
                  <th className="py-2.5 px-3">Pay Run ID</th>
                  <th className="py-2.5 px-3">Client Employer</th>
                  <th className="py-2.5 px-3">Frequency &amp; Period</th>
                  <th className="py-2.5 px-3 text-right">Employees</th>
                  <th className="py-2.5 px-3 text-right">Total Gross</th>
                  <th className="py-2.5 px-3 text-right">PAYG Withheld</th>
                  <th className="py-2.5 px-3 text-right">Super (11.5%)</th>
                  <th className="py-2.5 px-3 text-right">Total Net Pay</th>
                  <th className="py-2.5 px-3">STP Gateway Status</th>
                  <th className="py-2.5 px-3 text-right">Run Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/15 font-normal">
                {payRuns.map((pr) => {
                  const isApproved = pr.status === 'Approved';
                  return (
                    <tr key={pr.id} className="hover:bg-surface-container-low/50 transition">
                      <td className="py-3 px-3 font-mono font-bold text-on-surface">{pr.id}</td>
                      <td className="py-3 px-3 font-medium text-primary">{pr.clientName}</td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-on-surface block">{pr.frequency}</span>
                        <span className="text-[11px] text-secondary">{pr.payPeriod}</span>
                      </td>
                      <td className="py-3 px-3 text-right font-medium">{pr.employeesCount} staff</td>
                      <td className="py-3 px-3 text-right font-semibold">
                        ${pr.totalGrossWages.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-error">
                        ${pr.totalPaygWithheld.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-medium text-emerald-700">
                        ${pr.totalSuperGuarantee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-sm">
                        ${pr.totalNetPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold ${
                            pr.stpStatus === 'Lodged to ATO STP'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {pr.stpStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {!isApproved ? (
                          <button
                            type="button"
                            onClick={() => approvePayRun(pr.id)}
                            className="h-7 px-3 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition flex items-center gap-1 ml-auto shadow-2xs"
                          >
                            <span className="material-symbols-outlined text-[14px]">done_all</span>
                            <span>Approve &amp; Lodge</span>
                          </button>
                        ) : (
                          <span className="text-emerald-700 font-bold text-[11px] flex items-center justify-end gap-1">
                            <span className="material-symbols-outlined text-[14px]">verified</span>
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
