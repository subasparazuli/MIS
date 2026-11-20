import React from 'react';
import { useApp } from '../../context/AppContext';

export default function PayslipModal() {
  const { activeModal, setActiveModal, selectedPayslip, showToast } = useApp();

  if (activeModal !== 'viewPayslip' || !selectedPayslip) return null;

  const ps = selectedPayslip;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`Downloading Fair Work compliant PDF payslip for ${ps.employeeName}...`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/60 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="px-space-lg py-space-sm border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt</span>
            <span className="text-xs font-bold text-on-surface">
              Australian Standard Payslip (Fair Work Act 2009 Compliant)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="h-8 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">download</span>
              <span>Download PDF</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="h-8 px-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1 border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[16px]">print</span>
              <span>Print</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Printable Payslip Body */}
        <div className="p-space-xl overflow-y-auto font-sans text-slate-800 text-xs flex flex-col gap-4">
          {/* Employer & Payslip Header */}
          <div className="flex justify-between items-start border-b border-slate-200 pb-4">
            <div>
              <h1 className="text-lg font-bold text-slate-900">{ps.employerName}</h1>
              <p className="text-slate-600 font-mono text-xs">ABN: {ps.employerAbn}</p>
              <p className="text-slate-500 text-[11px] mt-0.5">Pay Advice / Single Touch Payroll Record</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1">
                {ps.status}
              </span>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">Pay Date:</span> {ps.payDate}
              </p>
              <p className="text-slate-600">
                <span className="font-semibold text-slate-900">Period:</span> {ps.payPeriod}
              </p>
            </div>
          </div>

          {/* Employee & Bank Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Employee Details</span>
              <p className="font-bold text-sm text-slate-900">{ps.employeeName}</p>
              <p className="text-slate-600">ID: {ps.employeeId} • {ps.jobTitle}</p>
              <p className="text-slate-600 font-medium">Employment: {ps.employmentType}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Payment Disbursement</span>
              <p className="text-slate-900 font-mono">{ps.bankAccount}</p>
              <p className="text-slate-600">Annual Base: ${ps.annualSalary ? ps.annualSalary.toLocaleString() : '-'}</p>
              <p className="text-slate-600">Hourly Rate: ${ps.hourlyRate.toFixed(2)} / hr</p>
            </div>
          </div>

          {/* Earnings Breakdown Table */}
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
              Earnings &amp; Hours
            </h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Hours / Units</th>
                  <th className="py-2 px-3 text-right">Rate</th>
                  <th className="py-2 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Ordinary Hours Worked</td>
                  <td className="py-2 px-3 text-right">{ps.ordinaryHours} hrs</td>
                  <td className="py-2 px-3 text-right">${ps.hourlyRate.toFixed(2)}</td>
                  <td className="py-2 px-3 text-right font-medium">${ps.grossEarnings.toFixed(2)}</td>
                </tr>
                {ps.allowances > 0 && (
                  <tr>
                    <td className="py-2 px-3 font-medium">Allowances &amp; Stipends</td>
                    <td className="py-2 px-3 text-right">1.0</td>
                    <td className="py-2 px-3 text-right">${ps.allowances.toFixed(2)}</td>
                    <td className="py-2 px-3 text-right font-medium">${ps.allowances.toFixed(2)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50 font-bold border-t border-slate-200">
                  <td className="py-2 px-3" colSpan={3}>Total Gross Earnings</td>
                  <td className="py-2 px-3 text-right text-slate-900">${ps.totalGross.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Deductions & Taxation */}
          <div>
            <h2 className="font-bold text-xs uppercase tracking-wider text-slate-700 mb-1.5">
              Taxes &amp; Deductions (PAYG Withholding)
            </h2>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-semibold">
                  <th className="py-2 px-3">Deduction Description</th>
                  <th className="py-2 px-3">Statutory Code</th>
                  <th className="py-2 px-3 text-right">Amount Deducted</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-2 px-3 font-medium">PAYG Tax Withheld (Remitted to ATO)</td>
                  <td className="py-2 px-3 font-mono text-slate-500">ATO-W2</td>
                  <td className="py-2 px-3 text-right font-bold text-red-600">
                    -${ps.paygWithholding.toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Superannuation Guarantee Breakdown */}
          <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-200">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-900 block">
                  Superannuation Guarantee (SG {ps.superGuaranteeRate}%)
                </span>
                <p className="font-semibold text-slate-900 mt-0.5">
                  Nominated Fund: {ps.superFundName}
                </p>
                <p className="text-[11px] text-slate-600 font-mono">
                  USI: {ps.superFundUsi} • Member No: {ps.superMemberNo}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-900 block">
                  ${ps.superGuaranteeAmount.toFixed(2)}
                </span>
                <span className="text-[10px] text-blue-700 font-medium">
                  Contribution Paid by Employer
                </span>
              </div>
            </div>
          </div>

          {/* Net Payment Total Banner */}
          <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-slate-400 block tracking-wider">
                Total Net Disbursement
              </span>
              <span className="text-[11px] text-slate-300">
                Direct Electronic Bank Credit
              </span>
            </div>
            <div className="text-2xl font-bold font-headline-lg">
              ${ps.netPay.toFixed(2)}
            </div>
          </div>

          {/* Year-to-Date (YTD) Summary */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 text-center text-xs">
            <div className="p-2 rounded-lg bg-slate-100">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">YTD Gross Earnings</span>
              <span className="font-bold text-slate-900">${ps.ytdGross ? ps.ytdGross.toLocaleString() : '-'}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-100">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">YTD PAYG Tax Paid</span>
              <span className="font-bold text-slate-900">${ps.ytdTax ? ps.ytdTax.toLocaleString() : '-'}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-100">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">YTD Super Contributions</span>
              <span className="font-bold text-slate-900">${ps.ytdSuper ? ps.ytdSuper.toLocaleString() : '-'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
