import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export default function AddClientModal() {
  const { activeModal, setActiveModal, addClient, currentUser } = useApp();

  const [name, setName] = useState('');
  const [abn, setAbn] = useState('');
  const [acn, setAcn] = useState('');
  const [entityType, setEntityType] = useState('Proprietary Limited Company');
  const [director, setDirector] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [city, setCity] = useState('Sydney');
  const [state, setState] = useState('NSW');
  const [postcode, setPostcode] = useState('2000');
  const [industry, setIndustry] = useState('Professional Services & Tech');
  const [gstBasis, setGstBasis] = useState('Accruals');
  const [lodgementCycle, setLodgementCycle] = useState('Quarterly');
  const [payrollFrequency, setPayrollFrequency] = useState('Fortnightly');
  const [employeeCount, setEmployeeCount] = useState(5);
  const [activeServices, setActiveServices] = useState(['bas', 'payslip', 'superannuation']);

  if (activeModal !== 'addClient') return null;

  const handleToggleService = (svc) => {
    setActiveServices((prev) =>
      prev.includes(svc) ? prev.filter((s) => s !== svc) : [...prev, svc]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !abn.trim()) return;

    addClient({
      name: name.trim(),
      abn: abn.trim(),
      acn: acn.trim() || '-',
      entityType,
      director: director.trim() || 'Principal Officer',
      primaryContact: `${director.trim()} (Director)`,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      city: city.trim(),
      state,
      postcode: postcode.trim(),
      industry,
      gstBasis,
      lodgementCycle,
      payrollFrequency,
      employeeCount: parseInt(employeeCount, 10) || 1,
      activeServices,
      leadPartner: currentUser.name || "Elena Vance, CA"
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-surface-container-lowest rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-space-lg py-space-md border-b border-outline-variant/20 flex items-center justify-between bg-surface-container-low shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary text-on-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[18px]">domain_add</span>
            </div>
            <div>
              <h2 className="font-bold text-sm text-on-surface">Add New Australian Client Entity</h2>
              <span className="text-[11px] text-secondary">Onboard entity into practice MIS registry</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveModal(null)}
            className="p-1 rounded-md text-secondary hover:text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-space-lg flex flex-col gap-3 overflow-y-auto text-xs">
          <div>
            <label className="font-bold text-on-surface block mb-1">Company / Entity Legal Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Apex Pacific Logistics Pty Ltd"
              className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">Australian Business Number (ABN) *</label>
              <input
                type="text"
                required
                value={abn}
                onChange={(e) => setAbn(e.target.value)}
                placeholder="XX XXX XXX XXX"
                className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-mono text-on-surface focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div>
              <label className="font-bold text-on-surface block mb-1">Entity Type</label>
              <select
                value={entityType}
                onChange={(e) => setEntityType(e.target.value)}
                className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold focus:outline-none"
              >
                <option value="Proprietary Limited Company">Proprietary Limited Company (Pty Ltd)</option>
                <option value="Discretionary Investment Trust">Discretionary Trust</option>
                <option value="Partnership">Partnership</option>
                <option value="Sole Trader">Sole Trader</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">Director / Officer</label>
              <input
                type="text"
                required
                value={director}
                onChange={(e) => setDirector(e.target.value)}
                placeholder="Full Name"
                className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">Email</label>
              <input
                type="email"
                required
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="contact@entity.com.au"
                className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                placeholder="+61 2 9..."
                className="w-full h-8 px-2.5 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-on-surface block mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">State</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs font-semibold focus:outline-none"
              >
                <option value="NSW">NSW</option>
                <option value="VIC">VIC</option>
                <option value="QLD">QLD</option>
                <option value="WA">WA</option>
                <option value="SA">SA</option>
                <option value="TAS">TAS</option>
                <option value="ACT">ACT</option>
                <option value="NT">NT</option>
              </select>
            </div>
            <div>
              <label className="font-bold text-on-surface block mb-1">Postcode</label>
              <input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
                className="w-full h-8 px-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none"
              />
            </div>
          </div>

          {/* Active Services Enrolled */}
          <div className="p-3 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2">
            <span className="font-bold text-on-surface block">Subscribed Practice Services:</span>
            <div className="flex flex-wrap gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={activeServices.includes('bas')}
                  onChange={() => handleToggleService('bas')}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Business Activity Statement (BAS)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={activeServices.includes('payslip')}
                  onChange={() => handleToggleService('payslip')}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Payslip &amp; Wage Management</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  checked={activeServices.includes('superannuation')}
                  onChange={() => handleToggleService('superannuation')}
                  className="rounded text-primary focus:ring-0"
                />
                <span>Superannuation Guarantee (SG)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 border-t border-outline-variant/20 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="h-8 px-3 rounded-lg text-xs font-semibold text-secondary hover:text-on-surface"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-9 px-4 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-2xs transition"
            >
              Add Client Entity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
