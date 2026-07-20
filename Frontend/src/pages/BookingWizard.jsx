import { useState, useMemo } from "react";
import {
  Building2, CreditCard, Search, Calendar, ArrowLeft, ArrowRight, 
  Info, CheckCircle2, Home, MapPin, FileText, Upload, User, Check, Sparkles, X
} from "lucide-react";

const STEPS = [
  { id: 1, label: "Customer Info" },
  { id: 2, label: "Property" },
  { id: 3, label: "Pricing" },
  { id: 4, label: "Schedule" },
  { id: 5, label: "Documents" },
  { id: 6, label: "Summary" },
];

const MOCK_LEADS = [
  { name: "Johnathan Wick", email: "wick@continental.com", phone: "+1 234 567 890", pan: "ABCJW1234K", tag: "Lead" },
  { name: "Amelia Hart", email: "amelia.hart@meridian.com", phone: "+1 415 220 9981", pan: "AMHPT5521L", tag: "Lead" },
  { name: "Ravi Kapoor", email: "ravi.kapoor@apex.co", phone: "+91 98200 11223", pan: "RKAPR9087M", tag: "Client" },
];

const PROPERTIES = [
  { id: "p1", name: "Penthouse A-12", project: "The Horizon Residences", price: 1200000, area: 4200, status: "Available" },
  { id: "p2", name: "Villa 04-B", project: "Oakwood Estates", price: 2400000, area: 6500, status: "Available" },
  { id: "p3", name: "Commercial Unit 201", project: "Vertex Business Plaza", price: 850000, area: 1800, status: "Hold" },
  { id: "p4", name: "Skyline Loft 9C", project: "The Horizon Residences", price: 980000, area: 2100, status: "Available" },
  { id: "p5", name: "Garden Villa 11", project: "Oakwood Estates", price: 1750000, area: 4800, status: "Available" },
  { id: "p6", name: "Retail Bay 07", project: "Vertex Business Plaza", price: 610000, area: 1200, status: "Available" },
];

const REQUIRED_DOCS = [
  { id: "d1", label: "PAN Card / National ID", hint: "Government-issued ID matching legal name" },
  { id: "d2", label: "Address Proof", hint: "Utility bill or bank statement, last 3 months" },
  { id: "d3", label: "Passport Photograph", hint: "Recent, plain background" },
  { id: "d4", label: "Income Proof", hint: "Salary slip or ITR, last financial year" },
];

const AGENTS = ["Priya Menon", "Daniel Ortiz", "Sara Whitfield", "Tomás Rivera"];

const currency = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

function FloatingInput({ id, label, value, onChange, type = "text", error }) {
  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        className={`peer w-full px-3 py-3 border rounded-xl outline-none transition-all bg-white
          ${error ? "border-red-400 focus:border-red-500" : "border-[#c4c6d3] focus:border-[#012c7e]"}`}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-3 text-slate-400 text-sm transition-all pointer-events-none bg-white px-1
          peer-focus:-translate-y-5 peer-focus:scale-90 peer-focus:text-[#012c7e]
          peer-[:not(:placeholder-shown)]:-translate-y-5 peer-[:not(:placeholder-shown)]:scale-90"
      >
        {label}
      </label>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}

function StepCard({ icon: Icon, title, children, action }) {
  return (
    <div className="bg-white border border-[#c4c6d3] rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-[#012c7e]">
          <Icon className="w-5 h-5" />
          {title}
        </h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export default function Bookings() {
  const [step, setStep] = useState(1);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [showAiModal, setShowAiModal] = useState(false);

  const [customer, setCustomer] = useState({ name: "", phone: "", email: "", pan: "" });
  const [search, setSearch] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const [propertyId, setPropertyId] = useState(null);
  const [propertySearch, setPropertySearch] = useState("");

  const [pricing, setPricing] = useState({ plc: 25000, discountPct: 5, taxPct: 12 });

  const [schedule, setSchedule] = useState({ date: "", slot: "", agent: "" });

  const [docs, setDocs] = useState(() =>
    Object.fromEntries(REQUIRED_DOCS.map((d) => [d.id, false]))
  );

  const [confirmed, setConfirmed] = useState(false);

  const selectedProperty = useMemo(
    () => PROPERTIES.find((p) => p.id === propertyId) || null,
    [propertyId]
  );

  const basePrice = selectedProperty ? selectedProperty.price : 0;
  const plc = Number(pricing.plc) || 0;
  const discount = ((basePrice + plc) * (Number(pricing.discountPct) || 0)) / 100;
  const taxable = basePrice + plc - discount;
  const tax = (taxable * (Number(pricing.taxPct) || 0)) / 100;
  const total = taxable + tax;

  const filteredProperties = PROPERTIES.filter(
    (p) =>
      p.name.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.project.toLowerCase().includes(propertySearch.toLowerCase())
  );

  // Updated filtering logic to search by name, email, or phone
  const filteredLeads = MOCK_LEADS.filter((l) => {
    const term = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(term) ||
      l.email.toLowerCase().includes(term) ||
      l.phone.toLowerCase().includes(term)
    );
  });

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const pickLead = (lead) => {
    setCustomer(lead);
    setSearch(lead.name);
    setShowDropdown(false);
  };

  const validateStep = () => {
    if (step === 1) {
      const e = {};
      if (!customer.name.trim()) e.name = "Name is required for legal documentation";
      if (!customer.phone.trim()) e.phone = "Contact number is required";
      if (!customer.email.trim()) e.email = "Email address is required";
      setErrors(e);
      return Object.keys(e).length === 0;
    }
    if (step === 2) {
      if (!propertyId) {
        showToast("Select a property to continue");
        return false;
      }
    }
    return true;
  };

  const goNext = () => {
    if (!validateStep()) return;
    if (step < 6) {
      setStep(step + 1);
      window.scrollTo?.({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const nextLabel = () => {
    switch (step) {
      case 1: return "Next: Property Selection";
      case 2: return "Next: Pricing";
      case 3: return "Next: Schedule";
      case 4: return "Next: Documents";
      case 5: return "Next: Summary";
      default: return "Confirm Booking";
    }
  };

  const handlePrimaryAction = () => {
    if (step === 6) {
      setConfirmed(true);
      showToast("Booking confirmed and sent for allotment");
    } else {
      goNext();
    }
  };

  const progressPct = (step / STEPS.length) * 100;

  return (
    <div className="bg-[#faf8ff] min-h-screen text-slate-900 font-sans">
      <div className="flex flex-col min-w-0">
        <main className="flex-1 p-6 md:p-8 max-w-[1500px] mx-auto w-full">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-extrabold text-[#012c7e]">New Booking Wizard</h2>
              <p className="text-slate-500 mt-1">Guided workflow for real estate unit allotment.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Session ID</span>
              <p className="font-mono text-sm">#BK-2023-9941</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="bg-white border border-[#c4c6d3] rounded-2xl p-6 mb-6">
            <div className="flex justify-between relative">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-200 -z-0" />
              <div
                className="absolute top-5 left-0 h-0.5 bg-[#012c7e] transition-all duration-500 -z-0"
                style={{ width: `${progressPct}%` }}
              />
              {STEPS.map((s) => {
                const isDone = s.id < step;
                const isActive = s.id === step;
                return (
                  <button
                    key={s.id}
                    onClick={() => (s.id < step ? setStep(s.id) : null)}
                    className={`flex flex-col items-center gap-2 bg-white px-1 sm:px-2 relative z-10 ${
                      s.id < step ? "cursor-pointer" : "cursor-default"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                        isActive
                          ? "bg-[#012c7e] text-white shadow-md"
                          : isDone
                          ? "bg-[#012c7e]/80 text-white"
                          : "bg-slate-200 text-slate-500"
                      }`}
                    >
                      {isDone ? <Check className="w-4 h-4" /> : s.id}
                    </div>
                    <span
                      className={`text-[10px] sm:text-xs font-bold hidden sm:block ${
                        isActive ? "text-[#012c7e]" : isDone ? "text-[#012c7e]/80" : "text-slate-400"
                      }`}
                    >
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left column */}
            <div className="lg:col-span-8 space-y-6">
              {/* STEP 1 */}
              {step === 1 && (
                <StepCard
                  icon={User}
                  title="Customer Identification"
                  // Action Prop Removed entirely to delete the "Create New Lead" button
                >
                  <div className="space-y-6">
                    <div className="relative">
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">
                        Search Existing Customer
                      </label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            value={search}
                            onChange={(e) => {
                              setSearch(e.target.value);
                              setShowDropdown(e.target.value.length > 2);
                            }}
                            className="w-full pl-10 pr-4 py-3 bg-[#faf8ff] border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] focus:ring-1 focus:ring-[#012c7e] outline-none transition-all"
                            placeholder="Start typing name, email or phone..."
                          />
                        </div>
                        <button
                          onClick={() => setShowDropdown(search.length > 0)}
                          className="bg-slate-100 px-6 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                        >
                          Search
                        </button>
                      </div>
                      {showDropdown && (
                        <div className="absolute w-full mt-2 bg-white border border-[#c4c6d3] rounded-xl shadow-xl z-10 overflow-hidden">
                          {filteredLeads.map((lead) => (
                            <div
                              key={lead.email}
                              onClick={() => pickLead(lead)}
                              className="p-3 hover:bg-blue-50 cursor-pointer flex justify-between items-center border-b border-slate-100 last:border-0"
                            >
                              <div>
                                <p className="font-bold text-sm">{lead.name}</p>
                                <p className="text-xs text-slate-500">{lead.email} • {lead.phone}</p>
                              </div>
                              <span className="text-xs bg-blue-100 text-[#012c7e] px-2 py-1 rounded">{lead.tag}</span>
                            </div>
                          ))}
                          {filteredLeads.length === 0 && (
                            <p className="p-3 text-sm text-slate-400">No matches found. Fill the form below for a new customer.</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FloatingInput
                        id="cust-name" label="Full Legal Name" value={customer.name}
                        onChange={(v) => setCustomer({ ...customer, name: v })} error={errors.name}
                      />
                      <FloatingInput
                        id="cust-phone" label="Contact Number" value={customer.phone} type="tel"
                        onChange={(v) => setCustomer({ ...customer, phone: v })} error={errors.phone}
                      />
                      <FloatingInput
                        id="cust-email" label="Email Address" value={customer.email} type="email"
                        onChange={(v) => setCustomer({ ...customer, email: v })} error={errors.email}
                      />
                      <FloatingInput
                        id="cust-id" label="National ID / PAN Card" value={customer.pan}
                        onChange={(v) => setCustomer({ ...customer, pan: v })}
                      />
                    </div>
                  </div>
                </StepCard>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <StepCard icon={Building2} title="Property Selection">
                  <div className="relative mb-5">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-[#faf8ff] border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] focus:ring-1 focus:ring-[#012c7e] outline-none transition-all"
                      placeholder="Search by unit name or project..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredProperties.map((p) => {
                      const selected = propertyId === p.id;
                      const onHold = p.status === "Hold";
                      return (
                        <button
                          key={p.id}
                          onClick={() => !onHold && setPropertyId(p.id)}
                          disabled={onHold}
                          className={`text-left rounded-xl border p-4 transition-all ${
                            selected
                              ? "border-[#012c7e] ring-2 ring-blue-200 bg-blue-50"
                              : onHold
                              ? "border-[#c4c6d3] opacity-60 cursor-not-allowed"
                              : "border-[#c4c6d3] hover:border-[#012c7e] hover:shadow-md"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="w-11 h-11 rounded-lg bg-[#012c7e] text-white flex items-center justify-center">
                              <Home className="w-5 h-5" />
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                                onHold ? "bg-amber-100 text-amber-700" : "bg-green-100 text-[#16a34a]"
                              }`}
                            >
                              {p.status}
                            </span>
                          </div>
                          <h5 className="font-bold">{p.name}</h5>
                          <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" /> {p.project}
                          </p>
                          <div className="mt-3 flex justify-between items-center">
                            <span className="font-mono font-bold text-[#012c7e]">{currency(p.price)}</span>
                            <span className="text-[11px] text-slate-400">{p.area.toLocaleString()} sq.ft</span>
                          </div>
                          {selected && (
                            <div className="mt-2 flex items-center gap-1 text-[#012c7e] text-xs font-bold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </StepCard>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <StepCard icon={CreditCard} title="Pricing & Discounts">
                  {!selectedProperty ? (
                    <p className="text-sm text-slate-400">Go back and select a property to calculate pricing.</p>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex justify-between items-center p-3 bg-[#faf8ff] rounded-lg text-sm border border-[#c4c6d3]">
                        <span className="text-slate-500">Base Price — {selectedProperty.name}</span>
                        <span className="font-mono font-bold">{currency(basePrice)}</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">PLC Charges ($)</label>
                          <input
                            type="number" value={pricing.plc}
                            onChange={(e) => setPricing({ ...pricing, plc: e.target.value })}
                            className="w-full px-3 py-3 border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Discount (%)</label>
                          <input
                            type="number" value={pricing.discountPct}
                            onChange={(e) => setPricing({ ...pricing, discountPct: e.target.value })}
                            className="w-full px-3 py-3 border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2">GST / Tax (%)</label>
                          <input
                            type="number" value={pricing.taxPct}
                            onChange={(e) => setPricing({ ...pricing, taxPct: e.target.value })}
                            className="w-full px-3 py-3 border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] outline-none"
                          />
                        </div>
                      </div>
                      <div className="border-t border-[#c4c6d3] pt-4 space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-slate-500">Base Price</span><span className="font-mono">{currency(basePrice)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">PLC Charges</span><span className="font-mono">+{currency(plc)}</span></div>
                        <div className="flex justify-between text-sm text-orange-700"><span>Applied Discount</span><span className="font-mono">-{currency(discount)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-slate-500">GST / Taxes</span><span className="font-mono">+{currency(tax)}</span></div>
                        <div className="flex justify-between items-center pt-2 border-t border-[#c4c6d3]">
                          <span className="font-bold">Estimated Total</span>
                          <span className="text-xl font-bold font-mono text-[#012c7e]">{currency(total)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </StepCard>
              )}

              {/* STEP 4 */}
              {step === 4 && (
                <StepCard icon={Calendar} title="Schedule">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Booking / Visit Date</label>
                      <input
                        type="date" value={schedule.date}
                        onChange={(e) => setSchedule({ ...schedule, date: e.target.value })}
                        className="w-full md:w-1/2 px-3 py-3 border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Preferred Slot</label>
                      <div className="flex gap-3 flex-wrap">
                        {["Morning (9–12)", "Afternoon (1–4)", "Evening (5–8)"].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setSchedule({ ...schedule, slot })}
                            className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all ${
                              schedule.slot === slot
                                ? "bg-[#012c7e] text-white border-[#012c7e]"
                                : "border-[#c4c6d3] text-slate-600 hover:border-[#012c7e]"
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Assign Sales Agent</label>
                      <select
                        value={schedule.agent}
                        onChange={(e) => setSchedule({ ...schedule, agent: e.target.value })}
                        className="w-full md:w-1/2 px-3 py-3 border border-[#c4c6d3] rounded-xl focus:border-[#012c7e] outline-none bg-white"
                      >
                        <option value="">Select an agent...</option>
                        {AGENTS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>
                </StepCard>
              )}

              {/* STEP 5 */}
              {step === 5 && (
                <StepCard icon={FileText} title="Documents">
                  <div className="space-y-3">
                    {REQUIRED_DOCS.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between p-4 border border-[#c4c6d3] rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${docs[d.id] ? "bg-green-100 text-[#16a34a]" : "bg-[#faf8ff] text-slate-400"}`}>
                            {docs[d.id] ? <CheckCircle2 className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{d.label}</p>
                            <p className="text-xs text-slate-400">{d.hint}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setDocs({ ...docs, [d.id]: !docs[d.id] })}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
                            docs[d.id]
                              ? "bg-green-50 text-[#16a34a] border border-green-200"
                              : "bg-[#012c7e] text-white hover:bg-blue-900"
                          }`}
                        >
                          {docs[d.id] ? <><Check className="w-3.5 h-3.5" /> Uploaded</> : <><Upload className="w-3.5 h-3.5" /> Upload</>}
                        </button>
                      </div>
                    ))}
                  </div>
                </StepCard>
              )}

              {/* STEP 6 */}
              {step === 6 && (
                <StepCard icon={CheckCircle2} title="Booking Summary">
                  {confirmed ? (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 rounded-full bg-green-100 text-[#16a34a] flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-9 h-9" />
                      </div>
                      <h4 className="text-xl font-bold text-[#012c7e]">Booking Confirmed</h4>
                      <p className="text-slate-500 mt-1 text-sm">
                        Session #BK-2023-9941 has been sent for allotment review.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div>
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Customer</h5>
                        <p className="font-bold">{customer.name || "—"}</p>
                        <p className="text-sm text-slate-500">{customer.email || "—"} • {customer.phone || "—"}</p>
                      </div>
                      <div className="border-t border-[#c4c6d3] pt-4">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Property</h5>
                        <p className="font-bold">{selectedProperty ? `${selectedProperty.name} — ${selectedProperty.project}` : "—"}</p>
                      </div>
                      <div className="border-t border-[#c4c6d3] pt-4">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Schedule</h5>
                        <p className="text-sm">{schedule.date || "No date set"} {schedule.slot && `• ${schedule.slot}`}</p>
                        <p className="text-sm text-slate-500">Agent: {schedule.agent || "Unassigned"}</p>
                      </div>
                      <div className="border-t border-[#c4c6d3] pt-4">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-2">Documents</h5>
                        <p className="text-sm">{Object.values(docs).filter(Boolean).length} of {REQUIRED_DOCS.length} uploaded</p>
                      </div>
                      <div className="border-t border-[#c4c6d3] pt-4 flex justify-between items-center">
                        <span className="font-bold">Estimated Total</span>
                        <span className="text-xl font-bold font-mono text-[#012c7e]">{currency(total)}</span>
                      </div>
                    </div>
                  )}
                </StepCard>
              )}

              {/* Nav buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                {step === 1 ? (
                  <button className="flex items-center gap-2 px-6 py-3 text-slate-400 font-bold hover:text-[#012c7e] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Cancel Wizard
                  </button>
                ) : (
                  <button onClick={goBack} className="flex items-center gap-2 px-6 py-3 text-slate-400 font-bold hover:text-[#012c7e] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                )}
                <div className="flex gap-3 w-full sm:w-auto">
                  <button
                    onClick={() => showToast("Progress saved")}
                    className="flex-1 sm:flex-none px-8 py-3 bg-[#faf8ff] text-[#012c7e] border border-[#012c7e] rounded-xl font-bold hover:bg-blue-50 transition-all"
                  >
                    Save Progress
                  </button>
                  <button
                    onClick={handlePrimaryAction}
                    disabled={confirmed}
                    className="flex-1 sm:flex-none px-8 py-3 bg-[#012c7e] text-white rounded-xl font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {nextLabel()}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right column - WRAPPED IN A SINGLE STICKY CONTAINER */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 self-start space-y-6">
                
                {/* 1. Booking Summary Widget */}
                <div className="bg-[#012c7e] text-white rounded-2xl p-6 shadow-lg">
                  <h4 className="text-lg font-bold mb-4 border-b border-white/20 pb-2">Booking Summary</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-start">
                      <span className="opacity-70">Selected Customer</span>
                      <span className="font-bold text-right">{customer.name || "—"}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="opacity-70">Project/Unit</span>
                      <span className="font-bold text-right">{selectedProperty ? selectedProperty.name : "—"}</span>
                    </div>
                  </div>
                  <div className="py-4 my-2 border-y border-white/10 space-y-2">
                    <div className="flex justify-between text-sm"><span>Base Price</span><span className="font-mono">{currency(basePrice)}</span></div>
                    <div className="flex justify-between text-sm"><span>PLC Charges</span><span className="font-mono">+{currency(plc)}</span></div>
                    <div className="flex justify-between text-sm opacity-80"><span>Applied Discounts</span><span className="font-mono">-{currency(discount)}</span></div>
                    <div className="flex justify-between text-sm"><span>GST / Taxes</span><span className="font-mono">+{currency(tax)}</span></div>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold">Estimated Total</span>
                    <span className="text-xl font-bold font-mono">{currency(total)}</span>
                  </div>
                  <div className="mt-5 p-3 bg-white/10 rounded-lg flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-xs">Pricing is estimated until Unit Selection.</p>
                  </div>
                </div>

                {/* 2. AI Guide Widget */}
                <div className="bg-white border border-[#c4c6d3] rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#faf8ff] text-[#012c7e] border border-[#c4c6d3] flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm text-[#012c7e]">AI Guide</p>
                      <p className="text-[11px] uppercase text-slate-400">Intelligent Support</p>
                    </div>
                  </div>
                  <p className="text-sm italic text-slate-500 mb-4">
                    "Ensure the customer's PAN card is verified. Incomplete identification might delay the allotment process by up to 48 hours."
                  </p>
                  <button 
                    onClick={() => setShowAiModal(true)}
                    className="w-full py-2 border border-[#012c7e] text-[#012c7e] rounded-lg font-bold text-xs hover:bg-[#faf8ff] transition-colors"
                  >
                    View Compliance Checklist
                  </button>
                </div>

              </div>
            </div>
          </div>
        </main>
      </div>

      {/* AI Guide Modal Overlay */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-[#012c7e] p-5 flex justify-between items-center text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <h3 className="font-bold text-lg">AI Compliance Check</h3>
              </div>
              <button onClick={() => setShowAiModal(false)} className="text-white/80 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-600 mb-2">Based on current form data, here is the automated compliance analysis for {customer.name || "the applicant"}:</p>
              
              <ul className="space-y-3">
                <li className="flex items-start gap-3 p-3 bg-green-50 border border-green-100 rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-green-900">Identity Verification</p>
                    <p className="text-xs text-green-700">PAN format validates successfully.</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                  <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Document Uploads Pending</p>
                    <p className="text-xs text-amber-700">Proof of Address and Income statements are required before allotment can be finalized.</p>
                  </div>
                </li>
              </ul>
              
              <button 
                onClick={() => setShowAiModal(false)}
                className="w-full mt-4 py-3 bg-[#012c7e] text-white rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      <div
        className={`fixed bottom-6 right-6 flex items-center gap-3 bg-slate-900 text-white px-6 py-4 rounded-xl shadow-2xl transition-transform duration-300 z-50 ${
          toast ? "translate-y-0" : "translate-y-24 pointer-events-none"
        }`}
      >
        <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
        <p className="text-sm font-medium">{toast}</p>
      </div>
    </div>
  );
}