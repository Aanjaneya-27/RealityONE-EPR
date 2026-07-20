import { useState } from "react";
import {
  User,
  Building2,
  Mail,
  Phone,
  MapPin,
  Tag,
  Home,
  Wallet,
  CalendarClock,
  StickyNote,
  ChevronDown,
  Star,
  Plus,
  X,
  Check,
  AlertCircle,
  RotateCcw,
} from "lucide-react";
import axios from "axios";



const STAGES = [
  { key: "new", label: "New Lead", color: "bg-[#012c7e]" },
  { key: "contacted", label: "Contacted", color: "bg-[#1a53c8]" },
  { key: "visit", label: "Site Visit", color: "bg-[#753400]" },
  { key: "negotiation", label: "Negotiation", color: "bg-amber-500" },
  { key: "won", label: "Closed Won", color: "bg-emerald-600" },
];

const AGENTS = [
  { name: "Aria Kapoor", initials: "AK" },
  { name: "Devon Ruiz", initials: "DR" },
  { name: "Marcus Vale", initials: "MV" },
  { name: "Priya Shah", initials: "PS" },
];

const PROPERTIES = ["The Atrium Plaza", "Horizon Heights", "Oakwood Estates", "Wellington Estate"];
const UNIT_TYPES = ["2 BHK Apartment", "3 BHK Apartment", "Villa", "Commercial Unit", "Plot / Land"];
const SOURCES = ["Website", "Referral", "Walk-in", "Property Portal", "Social Media", "Cold Call"];

const initialForm = {
  fullName: "",
  company: "",
  email: "",
  phone: "",
  city: "",
  leadSource: "Website",
  property: PROPERTIES[0],
  unitType: UNIT_TYPES[0],
  budget: "",
  visitDate: "",
  notes: "",
};

function SectionCard({ icon: Icon, title, subtitle, children }) {
  return (
    <div className="bg-white/80 backdrop-blur-md border border-[#c4c6d3]/40 rounded-xl shadow-sm p-6">
      <div className="flex items-start gap-3 mb-6">
        <div className="w-9 h-9 rounded-lg bg-[#012c7e]/10 text-[#012c7e] flex items-center justify-center flex-shrink-0">
          <Icon size={18} strokeWidth={2} />
        </div>
        <div>
          <h3 className="font-semibold text-[15px] text-[#1a1b21] leading-tight">
            {title}
          </h3>
          {subtitle && (
            <p className="text-[12.5px] text-[#444651]/70 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

function Field({ label, required, error, children, span = "col-span-1" }) {
  return (
    <div className={`flex flex-col gap-1.5 ${span}`}>
      <label className="text-[12.5px] font-semibold text-[#444651] tracking-wide">
        {label}
        {required && <span className="text-[#ba1a1a] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <span className="flex items-center gap-1 text-[11.5px] text-[#ba1a1a] font-medium">
          <AlertCircle size={12} />
          {error}
        </span>
      )}
    </div>
  );
}

const baseInput =
  "w-full px-3.5 py-2.5 rounded-lg border bg-white text-[14px] text-[#1a1b21] placeholder:text-[#444651]/40 focus:outline-none focus:ring-2 transition-all";
const normalInput = `${baseInput} border-[#c4c6d3]/60 focus:ring-[#012c7e]/30 focus:border-[#012c7e]`;
const errorInput = `${baseInput} border-[#ba1a1a]/60 focus:ring-[#ba1a1a]/20 focus:border-[#ba1a1a]`;

export default function CRMLeadForm() {
  const [form, setForm] = useState(initialForm);
  const [stage, setStage] = useState("new");
  const [priority, setPriority] = useState("medium");
  const [assignedAgent, setAssignedAgent] = useState(AGENTS[0].name);
  const [tags, setTags] = useState(["First-time Buyer", "Referral"]);
  const [tagInput, setTagInput] = useState("");
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [saving, setSaving] = useState(false);

  const update = (key) => (e) => {
    const value = e.target ? e.target.value : e;
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: null }));
  };

  const addTag = () => {
    const val = tagInput.trim();
    if (val && !tags.includes(val)) setTags([...tags, val]);
    setTagInput("");
  };
  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required";
    if (!form.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address";
    if (!form.phone.trim()) next.phone = "Phone number is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const showToast = (message, tone = "success") => {
    setToast({ message, tone });
    setTimeout(() => setToast(null), 3200);
  };

 const handleSave = async () => {
  if (!validate()) {
    showToast("Please fix the highlighted fields", "error");
    return;
  }

  setSaving(true);

  try {
    await axios.post("http://localhost:5000/api/leads/create", {
      name: form.fullName,
      email: form.email,
      phone: form.phone,
      project_interest: form.property,
    });

    showToast("Lead Saved Successfully!");

    setForm(initialForm);
    setStage("new");
    setPriority("medium");
    setAssignedAgent(AGENTS[0].name);
    setTags([]);
    setTagInput("");
    setErrors({});
  } catch (err) {
    showToast("Error saving lead", "error");
    console.log(err);
  } finally {
    setSaving(false);
  }
};

  const handleReset = () => {
    setForm(initialForm);
    setStage("new");
    setPriority("medium");
    setAssignedAgent(AGENTS[0].name);
    setTags([]);
    setTagInput("");
    setErrors({});
    setShowResetConfirm(false);
    showToast("Form cleared", "neutral");
  };

  const hasChanges =
    JSON.stringify(form) !== JSON.stringify(initialForm) ||
    stage !== "new" ||
    priority !== "medium" ||
    tags.length > 0;

  return (
    <div className="min-h-screen w-full bg-[#F6F8FB] font-sans relative">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-body { font-family: 'Inter', sans-serif; }
        @keyframes slideIn { from { opacity: 0; transform: translateY(-8px) translateX(-50%); } to { opacity: 1; transform: translateY(0) translateX(-50%); } }
        .toast-anim { animation: slideIn 0.25s ease-out; }
      `}</style>

      {/* Toast */}
      {toast && (
        <div
          className={`toast-anim fixed top-6 left-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-lg shadow-lg text-white text-[13.5px] font-semibold ${
            toast.tone === "error"
              ? "bg-[#ba1a1a]"
              : toast.tone === "neutral"
              ? "bg-[#444651]"
              : "bg-emerald-600"
          }`}
        >
          {toast.tone === "error" ? (
            <AlertCircle size={16} />
          ) : (
            <Check size={16} strokeWidth={2.5} />
          )}
          {toast.message}
        </div>
      )}

      {/* Reset confirm modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center px-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full">
            <h4 className="font-display font-bold text-[16px] text-[#1a1b21] mb-2">
              Discard this lead?
            </h4>
            <p className="text-[13.5px] text-[#444651]/80 mb-6">
              Everything you've entered will be cleared. This can't be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded-lg border border-[#c4c6d3]/70 text-[#444651] text-[13px] font-semibold hover:bg-[#F6F8FB] transition-colors"
              >
                Keep editing
              </button>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-lg bg-[#ba1a1a] text-white text-[13px] font-semibold hover:bg-[#ba1a1a]/90 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10 font-body">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-[12.5px] text-[#444651]/60 font-medium mb-2">
              <span>CRM</span>
              <span>/</span>
              <span>Leads</span>
              <span>/</span>
              <span className="text-[#012c7e] font-semibold">New Lead</span>
            </div>
            <h1 className="font-display text-[26px] font-bold text-[#1a1b21] leading-tight">
              New Contact / Lead
            </h1>
            <p className="text-[13.5px] text-[#444651]/70 mt-1">
              Capture prospect details and route them into your sales pipeline.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => (hasChanges ? setShowResetConfirm(true) : null)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-[#c4c6d3]/70 text-[#444651] text-[13.5px] font-semibold hover:bg-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              disabled={!hasChanges}
            >
              <RotateCcw size={15} />
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#012c7e] text-white text-[13.5px] font-semibold shadow-sm hover:bg-[#012c7e]/90 active:scale-[0.98] transition-all disabled:opacity-60"
            >
              {saving ? (
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <Check size={16} strokeWidth={2.5} />
              )}
              {saving ? "Saving..." : "Save Lead"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Contact Info */}
            <SectionCard
              icon={User}
              title="Contact Information"
              subtitle="Who is this lead and how do we reach them?"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Full Name" required error={errors.fullName}>
                  <input
                    className={errors.fullName ? errorInput : normalInput}
                    placeholder="e.g. Marcus Vale"
                    value={form.fullName}
                    onChange={update("fullName")}
                  />
                </Field>
                <Field label="Company / Organization">
                  <div className="relative">
                    <Building2
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                    />
                    <input
                      className={`${normalInput} pl-9`}
                      placeholder="Global Tech Solutions"
                      value={form.company}
                      onChange={update("company")}
                    />
                  </div>
                </Field>
                <Field label="Email Address" required error={errors.email}>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                    />
                    <input
                      type="email"
                      className={`${errors.email ? errorInput : normalInput} pl-9`}
                      placeholder="name@example.com"
                      value={form.email}
                      onChange={update("email")}
                    />
                  </div>
                </Field>
                <Field label="Phone Number" required error={errors.phone}>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                    />
                    <input
                      type="tel"
                      className={`${errors.phone ? errorInput : normalInput} pl-9`}
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={update("phone")}
                    />
                  </div>
                </Field>
                <Field label="City / Region" span="col-span-2 sm:col-span-1">
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                    />
                    <input
                      className={`${normalInput} pl-9`}
                      placeholder="e.g. Bhubaneswar, IN"
                      value={form.city}
                      onChange={update("city")}
                    />
                  </div>
                </Field>
                <Field label="Lead Source" span="col-span-2 sm:col-span-1">
                  <div className="relative">
                    <select
                      className={`${normalInput} appearance-none pr-9`}
                      value={form.leadSource}
                      onChange={update("leadSource")}
                    >
                      {SOURCES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40 pointer-events-none"
                    />
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* Property Requirements */}
            <SectionCard
              icon={Home}
              title="Property Requirements"
              subtitle="What is this prospect looking for?"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Field label="Interested Property / Project">
                  <div className="relative">
                    <select
                      className={`${normalInput} appearance-none pr-9`}
                      value={form.property}
                      onChange={update("property")}
                    >
                      {PROPERTIES.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40 pointer-events-none"
                    />
                  </div>
                </Field>
                <Field label="Unit Type">
                  <div className="relative">
                    <select
                      className={`${normalInput} appearance-none pr-9`}
                      value={form.unitType}
                      onChange={update("unitType")}
                    >
                      {UNIT_TYPES.map((u) => (
                        <option key={u}>{u}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#444651]/40 pointer-events-none"
                    />
                  </div>
                </Field>
                <Field label="Budget Range">
                  <div className="relative">
                    <Wallet
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                    />
                    <input
                      className={`${normalInput} pl-9`}
                      placeholder="e.g. $250k – $400k"
                      value={form.budget}
                      onChange={update("budget")}
                    />
                  </div>
                </Field>
                <Field label="Preferred Visit Date">
                  <div className="relative">
                    <CalendarClock
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#444651]/40"
                    />
                    <input
                      type="date"
                      className={`${normalInput} pl-9`}
                      value={form.visitDate}
                      onChange={update("visitDate")}
                    />
                  </div>
                </Field>
              </div>
            </SectionCard>

            {/* Notes */}
            <SectionCard
              icon={StickyNote}
              title="Notes"
              subtitle="Internal context for the sales team"
            >
              <textarea
                rows={4}
                className={`${normalInput} resize-none`}
                placeholder="Add any relevant details about this lead — preferences, objections, prior conversations..."
                value={form.notes}
                onChange={update("notes")}
              />
              <div className="text-right text-[11.5px] text-[#444651]/50 mt-1">
                {form.notes.length} characters
              </div>
            </SectionCard>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col gap-6">
            {/* Lead Stage */}
            <SectionCard icon={Tag} title="Lead Status">
              <div className="flex flex-col gap-2 mb-6">
                {STAGES.map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setStage(s.key)}
                    className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-[13.5px] font-medium transition-all ${
                      stage === s.key
                        ? "border-[#012c7e] bg-[#012c7e]/5"
                        : "border-[#c4c6d3]/50 hover:bg-[#F6F8FB]"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`w-2 h-2 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                    {stage === s.key && (
                      <Check size={15} className="text-[#012c7e]" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>

              <label className="text-[12.5px] font-semibold text-[#444651] tracking-wide block mb-2">
                Priority
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["low", "medium", "high"].map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex items-center justify-center gap-1 py-2 rounded-lg border text-[12.5px] font-semibold capitalize transition-all ${
                      priority === p
                        ? p === "high"
                          ? "border-[#ba1a1a] bg-[#ba1a1a]/5 text-[#ba1a1a]"
                          : p === "medium"
                          ? "border-amber-500 bg-amber-50 text-amber-600"
                          : "border-emerald-600 bg-emerald-50 text-emerald-700"
                        : "border-[#c4c6d3]/50 text-[#444651]/60 hover:bg-[#F6F8FB]"
                    }`}
                  >
                    {priority === p && <Star size={12} fill="currentColor" />}
                    {p}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Assigned Agent */}
            <SectionCard icon={User} title="Assigned Agent">
              <div className="flex flex-col gap-2">
                {AGENTS.map((a) => (
                  <button
                    key={a.name}
                    onClick={() => setAssignedAgent(a.name)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg border text-left transition-all ${
                      assignedAgent === a.name
                        ? "border-[#012c7e] bg-[#012c7e]/5"
                        : "border-[#c4c6d3]/50 hover:bg-[#F6F8FB]"
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1E2A3A] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                      {a.initials}
                    </div>
                    <span className="text-[13.5px] font-medium text-[#1a1b21] flex-1">
                      {a.name}
                    </span>
                    {assignedAgent === a.name && (
                      <Check size={15} className="text-[#012c7e]" strokeWidth={2.5} />
                    )}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Tags */}
            <SectionCard icon={Tag} title="Tags">
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.length === 0 && (
                  <span className="text-[12.5px] text-[#444651]/50 italic">
                    No tags yet
                  </span>
                )}
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-[#012c7e]/8 text-[#012c7e] text-[12.5px] font-medium"
                  >
                    {t}
                    <button
                      onClick={() => removeTag(t)}
                      className="w-4 h-4 rounded-full hover:bg-[#012c7e]/15 flex items-center justify-center"
                    >
                      <X size={11} strokeWidth={2.5} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTag()}
                  className={`${normalInput} text-[13px] py-2`}
                  placeholder="Add a tag..."
                />
                <button
                  onClick={addTag}
                  className="w-10 h-10 flex-shrink-0 rounded-lg bg-[#012c7e] text-white flex items-center justify-center hover:bg-[#012c7e]/90 transition-colors active:scale-95"
                >
                  <Plus size={18} />
                </button>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}