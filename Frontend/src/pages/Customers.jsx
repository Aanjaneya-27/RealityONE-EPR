import { useState, useMemo, useRef, useEffect } from "react";
import axios from "axios"


const COLORS = {
  primary: "#012c7e",
  primaryContainer: "#254495",
  secondary: "#1a53c8",
  secondaryContainer: "#3e6ee3",
  onSecondaryContainer: "#fefcff",
  tertiaryContainer: "#793600",
  onTertiaryContainer: "#ffa269",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
  surface: "#faf8ff",
  surfaceContainerLowest: "#ffffff",
  surfaceContainerLow: "#f4f3fa",
  surfaceContainer: "#eeedf5",
  surfaceContainerHigh: "#e8e7ef",
  surfaceContainerHighest: "#e3e2e9",
  surfaceVariant: "#e3e2e9",
  onSurface: "#1a1b21",
  onSurfaceVariant: "#444651",
  outline: "#747683",
  outlineVariant: "#c4c6d3",
  background: "#faf8ff",
};

const STATUS_STYLES = {
  Booked: "bg-green-100 text-green-700",
  Interested: "bg-blue-100 text-blue-700",
  Negotiating: "bg-amber-100 text-amber-700",
  Dormant: "bg-gray-200 text-gray-600",
};

const ACTIVITY_DOT = {
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  tertiaryContainer: COLORS.tertiaryContainer,
};

const DEFAULT_AGENT = {
  name: "Michael Realman",
  title: "Senior Portfolio Manager",
  avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Michael&backgroundColor=012c7e",
};

const BASE_CUSTOMERS = [
  {
    id: "CUST-90124",
    name: "Eleanor Shellstrop",
    email: "eleanor@realestate.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Eleanor&backgroundColor=1a53c8",
    project: "Skyline Residences",
    units: "02",
    collectionValue: 480000,
    status: "Booked",
    lastActivity: "Today, 10:42 AM",
    lastNote: "Payment Received",
    location: "Phoenix, Arizona",
    tier: "Premium Client",
    phone: "+1 (602) 555-0199",
    address: "123 Lemon Street, Phoenix, AZ",
    occupation: "Senior Legal Consultant",
    company: "Bad Place & Associates",
    nominee: { name: "Tahani Al-Jamil", relation: "Sister", verified: true },
    agent: DEFAULT_AGENT,
    activity: [
      { color: "primary", title: "Unit Possession Document Shared", sub: "Property: Skyview Towers", file: "Possession_Letter.pdf", time: "2 hours ago" },
      { color: "secondary", title: "Payment Received: $450,000", sub: "Transaction ID: #TXN-8821901", time: "Yesterday" }
    ],
    documents: [
      { icon: "badge", name: "PAN Card", meta: "ABCDE1234F • PDF • 1.2MB" },
      { icon: "fingerprint", name: "National ID", meta: "[Aadhaar Redacted] • JPG • 2.4MB" },
    ],
  },
  {
    id: "CUST-90125",
    name: "Marcus Aurelius",
    email: "marcus.a@stoic.io",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Marcus&backgroundColor=793600",
    project: "Emerald Gardens",
    units: "01",
    collectionValue: 215000,
    status: "Interested",
    lastActivity: "Yesterday, 4:20 PM",
    lastNote: "Site Visit Scheduled",
    location: "Rome, Italy",
    tier: "Standard Client",
    phone: "+1 (480) 555-0142",
    address: "44 Meditations Ave, Rome",
    occupation: "Philosophy Professor",
    company: "Stoic Institute",
    nominee: { name: "Commodus Aurelius", relation: "Son", verified: false },
    agent: DEFAULT_AGENT,
    activity: [
      { color: "secondary", title: "Site Visit Scheduled", sub: "Property: Emerald Gardens", time: "Yesterday, 4:20 PM" }
    ],
    documents: [],
  },
  {
    id: "CUST-90126",
    name: "Sarah Jenkins",
    email: "s.jenkins@wealthmgmt.com",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Sarah&backgroundColor=012c7e",
    project: "Oakwood Heights",
    units: "04",
    collectionValue: 1250000,
    status: "Booked",
    lastActivity: "Oct 24, 2023",
    lastNote: "Tax Document Signed",
    location: "Scottsdale, Arizona",
    tier: "Premium Client",
    phone: "+1 (480) 555-0110",
    address: "9 Wealth Row, Scottsdale",
    occupation: "Wealth Manager",
    company: "Jenkins Wealth Management",
    nominee: { name: "Tom Jenkins", relation: "Spouse", verified: true },
    agent: DEFAULT_AGENT,
    activity: [],
    documents: [],
  },
];

const EXTRA_NAMES = ["John Smith", "David Lee", "Emma Watson", "Oliver Twist", "Sophia Grace", "Liam Neeson", "Noah Ark", "Isabella Swan", "Mason Mount", "Mia Khalifa", "James Bond", "Charlotte Bronte"];
const PROJECTS = ["Skyline Residences", "Emerald Gardens", "Oakwood Heights"];
const STATUSES = ["Booked", "Interested", "Negotiating", "Dormant"];

const EXTRA_CUSTOMERS = Array.from({ length: 37 }).map((_, i) => ({
  id: `CUST-${90127 + i}`,
  name: EXTRA_NAMES[i % EXTRA_NAMES.length] + ` ${i + 1}`,
  email: `client${i}@example.com`,
  avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Client${i}&backgroundColor=012c7e`,
  project: PROJECTS[i % PROJECTS.length],
  units: `0${(i % 3) + 1}`,
  collectionValue: 40000 + (i * 25000), 
  status: STATUSES[i % STATUSES.length],
  lastActivity: `${(i % 5) + 1} days ago`,
  lastNote: "Standard follow-up",
  location: "New York, USA",
  tier: i % 4 === 0 ? "Premium Client" : "Standard Client",
  phone: `+1 (555) 000-${1000 + i}`,
  address: `${10 + i} Business Street`,
  occupation: "Professional",
  company: "Corporate Ltd.",
  nominee: { name: "Pending", relation: "N/A", verified: false },
  agent: DEFAULT_AGENT,
  activity: [],
  documents: [],
}));

const INITIAL_CUSTOMERS = [...BASE_CUSTOMERS, ...EXTRA_CUSTOMERS];

const money = (n) => "$" + Number(n || 0).toLocaleString("en-US");
const uid = () => "CUST-" + Math.floor(90000 + Math.random() * 9999);


function Icon({ name, className = "", filled = false, style = {} }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{ fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`, ...style }}
    >
      {name}
    </span>
  );
}

function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 left-6 z-[200] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium text-white animate-[fadein_0.2s_ease-out]" style={{ background: COLORS.onSurface }}>
          <Icon name={t.icon || "check_circle"} className="!text-[18px]" style={{ color: "#b4c5ff" }} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" style={{ background: "rgba(26,27,33,0.5)" }} onClick={onClose}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-xl"} max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
          <h3 className="text-lg font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{title}</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5"><Icon name="close" /></button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${COLORS.outlineVariant}`, background: COLORS.surfaceContainerLow }}>{footer}</div>}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: COLORS.onSurfaceVariant }}>{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl text-sm px-3 py-2 outline-none focus:ring-2";
const inputStyle = { background: COLORS.surfaceContainerLow, border: `1px solid ${COLORS.outlineVariant}` };


function CustomerFormModal({ initial, onClose, onSave }) {
  // 🔥 PHOTO FIELD ADDED HERE 🔥
  const [form, setForm] = useState(
    initial || { name: "", email: "", project: "Skyline Residences", units: "01", collectionValue: "", status: "Interested", phone: "", avatar: "" }
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = form.name.trim() && form.email.trim();

  return (
    <Modal
      title={initial ? "Edit Customer" : "Add Customer"}
      onClose={onClose}
      wide={true} 
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>Cancel</button>
          <button disabled={!isValid} onClick={() => isValid && onSave(form)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: COLORS.primary }}>
            {initial ? "Save Changes" : "Add Customer"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Full Name"><input className={inputCls} style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. John Doe" /></Field>
        <Field label="Email"><input className={inputCls} style={inputStyle} value={form.email} onChange={set("email")} placeholder="e.g. john@email.com" /></Field>
        <Field label="Phone Number"><input className={inputCls} style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="+1 (000) 000-0000" /></Field>
        
        <Field label="Profile Photo URL (Optional)">
          <input className={inputCls} style={inputStyle} value={form.avatar} onChange={set("avatar")} placeholder="https://example.com/photo.jpg" />
        </Field>

        <Field label="Active Project">
          <select className={inputCls} style={inputStyle} value={form.project} onChange={set("project")}>
            {["Skyline Residences", "Emerald Gardens", "Oakwood Heights"].map((p) => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Units Owned"><input className={inputCls} style={inputStyle} value={form.units} onChange={set("units")} placeholder="01" /></Field>
        <Field label="Total Collection ($)"><input type="number" className={inputCls} style={inputStyle} value={form.collectionValue} onChange={set("collectionValue")} placeholder="0" /></Field>
        <Field label="Status">
          <select className={inputCls} style={inputStyle} value={form.status} onChange={set("status")}>
            {["Booked", "Interested", "Negotiating", "Dormant"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

function ProfileEditModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState({ phone: customer.phone, email: customer.email, address: customer.address, occupation: customer.occupation, company: customer.company });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal
      title="Edit Personal Details"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>Cancel</button>
          <button onClick={() => onSave(form)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.primary }}>Save Changes</button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Phone Number"><input className={inputCls} style={inputStyle} value={form.phone} onChange={set("phone")} /></Field>
        <Field label="Email Address"><input className={inputCls} style={inputStyle} value={form.email} onChange={set("email")} /></Field>
        <Field label="Current Address"><input className={inputCls} style={inputStyle} value={form.address} onChange={set("address")} /></Field>
        <Field label="Occupation"><input className={inputCls} style={inputStyle} value={form.occupation} onChange={set("occupation")} /></Field>
        <Field label="Company"><input className={inputCls} style={inputStyle} value={form.company} onChange={set("company")} /></Field>
      </div>
    </Modal>
  );
}

function AICampaignModal({ onClose, addToast }) {
  return (
    <Modal
      title="AI Retention Campaign Setup"
      onClose={onClose}
      wide
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>Cancel</button>
          <button onClick={() => { addToast("AI Campaign Successfully Launched!", "rocket_launch"); onClose(); }} className="px-4 py-2 rounded-xl text-sm font-semibold text-white hover:opacity-90" style={{ background: COLORS.primary }}>Launch Campaign</button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl" style={{ background: COLORS.surfaceContainer }}>
          <h4 className="font-bold flex items-center gap-2 mb-2"><Icon name="target" style={{color: COLORS.primary}} /> Target Audience</h4>
          <p className="text-sm text-gray-700">12 Dormant Customers in <strong>Skyline Residences</strong> showing high churn probability.</p>
        </div>
        <div className="p-4 rounded-xl" style={{ background: "rgba(37,68,149,0.1)" }}>
          <h4 className="font-bold flex items-center gap-2 mb-2" style={{color: COLORS.primary}}><Icon name="smart_toy" /> AI Strategy Instructions</h4>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            <li>Send personalized re-engagement emails.</li>
            <li>Offer a virtual tour of the newly completed clubhouse.</li>
            <li>Schedule an automated WhatsApp check-in after 48 hours.</li>
          </ul>
        </div>
        <div className="border rounded-xl p-4" style={{ borderColor: COLORS.outlineVariant }}>
          <h4 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>Draft Email Preview</h4>
          <p className="text-sm italic text-gray-600 bg-gray-50 p-3 rounded-lg border">"Hi [Customer Name], it's been a while since we discussed Skyline Residences! The clubhouse is finally ready. Would you like an exclusive virtual tour this week?"</p>
        </div>
      </div>
    </Modal>
  );
}

function CustomerDatabase({ customers, setCustomers, onOpenCustomer, addToast }) {
  const [fabOpen, setFabOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [draftProject, setDraftProject] = useState("All Projects");
  const [draftStatus, setDraftStatus] = useState("All Statuses");
  const [draftValue, setDraftValue] = useState("Any Range");
  const [appliedFilters, setAppliedFilters] = useState({ project: "All Projects", status: "All Statuses", value: "Any Range" });
  
  const [selectedIds, setSelectedIds] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCampaignModal, setShowCampaignModal] = useState(false); 
  const [editTarget, setEditTarget] = useState(null);
  
  const [page, setPage] = useState(1);
  const pageSize = 4; // 10 pages mapping (40/4 = 10)

  const inValueRange = (val, range) => {
    if (range === "Any Range") return true;
    if (range === "$0 - $50k") return val <= 50000;
    if (range === "$50k - $200k") return val > 50000 && val <= 200000;
    if (range === "$200k - $1M") return val > 200000 && val <= 1000000;
    if (range === "$1M+") return val > 1000000;
    return true;
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return customers.filter((c) => {
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.project.toLowerCase().includes(q);
      const matchesProject = appliedFilters.project === "All Projects" || c.project === appliedFilters.project;
      const matchesStatus = appliedFilters.status === "All Statuses" || c.status === appliedFilters.status;
      const matchesValue = inValueRange(c.collectionValue, appliedFilters.value);
      return matchesSearch && matchesProject && matchesStatus && matchesValue;
    });
  }, [customers, search, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allVisibleSelected = pageRows.length > 0 && pageRows.every((c) => selectedIds.includes(c.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      setSelectedIds((prev) => prev.filter((id) => !pageRows.some((c) => c.id === id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...pageRows.map((c) => c.id)])));
    }
  };

  const toggleSelect = (id) => setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const applyFilters = () => {
    setAppliedFilters({ project: draftProject, status: draftStatus, value: draftValue });
    setPage(1);
    addToast(`Filters applied — ${filtered.length} matches found`, "filter_alt");
  };

  const handleDeleteOne = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    addToast("Customer deleted", "delete");
    setOpenMenuId(null);
  };

const handleAddCustomer = async (form) => {
    // 1. Agar user ne photo nahi daali, toh default avatar generate karo
    const finalAvatar = form.avatar && form.avatar.trim() !== "" 
      ? form.avatar 
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=012c7e`;

    // 2. Data ko ek object mein set karo
    const newCustomer = {
      customer_id: uid(), // 'CUST-XXXXX' Generate hoke backend jayega
      name: form.name,
      email: form.email,
      phone: form.phone || "—",
      avatar: finalAvatar,
      project: form.project,
      units: form.units || "01",
      collectionValue: Number(form.collectionValue) || 0,
      status: form.status,
    };

    try {
        await axios.post("https://realityone-epr.onrender.com/api/customers/create", newCustomer);
        
        // 4. Data save hone ke baad UI (Table) ko update karo aur Form band kar do
        setCustomers((prev) => [newCustomer, ...prev]);
        setShowAddModal(false);
        addToast(`${form.name} added successfully`, "person_add");
    } catch (error) {
        addToast("Error saving to database!", "error");
        console.error("API Error:", error);
    }
  };

  const handleEditCustomer = (form) => {
    const finalAvatar = form.avatar && form.avatar.trim() !== "" 
      ? form.avatar 
      : `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=012c7e`;

    setCustomers((prev) => prev.map((c) => (c.id === editTarget.id ? { ...c, ...form, avatar: finalAvatar, collectionValue: Number(form.collectionValue) || 0 } : c)));
    setEditTarget(null);
    addToast("Customer updated", "edit");
  };

  return (
    <div style={{ background: COLORS.background, color: COLORS.onSurface }} className="min-h-screen font-sans" onClick={() => { setOpenMenuId(null); setFabOpen(false); }}>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-[36px] leading-[44px] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Customer Database</h2>
            <p className="mt-1" style={{ color: COLORS.onSurfaceVariant }}>Manage and track your {customers.length} active clients across all portfolios.</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md active:scale-95 transition-all hover:opacity-90" style={{ background: COLORS.primary }}>
              <Icon name="person_add" className="!text-[18px]" /> Add Customer
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md mb-6">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.outline }} />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 shadow-sm transition-all"
            style={{ background: COLORS.surfaceContainerLowest, border: `1px solid ${COLORS.outlineVariant}` }}
            placeholder="Search customers by name, email, or project..."
          />
        </div>

        {/* Filters */}
        <div className="p-6 rounded-2xl mb-6 shadow-sm" style={{ background: COLORS.surfaceContainerLowest, border: `1px solid ${COLORS.outlineVariant}` }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>Project</label>
              <select className="w-full rounded-xl text-sm px-3 py-2.5 outline-none focus:ring-1" style={inputStyle} value={draftProject} onChange={(e) => setDraftProject(e.target.value)}>
                {["All Projects", "Skyline Residences", "Emerald Gardens", "Oakwood Heights"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>Status</label>
              <select className="w-full rounded-xl text-sm px-3 py-2.5 outline-none focus:ring-1" style={inputStyle} value={draftStatus} onChange={(e) => setDraftStatus(e.target.value)}>
                {["All Statuses", "Booked", "Interested", "Negotiating", "Dormant"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>Value Range</label>
              <select className="w-full rounded-xl text-sm px-3 py-2.5 outline-none focus:ring-1" style={inputStyle} value={draftValue} onChange={(e) => setDraftValue(e.target.value)}>
                {["Any Range", "$0 - $50k", "$50k - $200k", "$200k - $1M", "$1M+"].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="flex items-end h-full pt-6 ml-auto">
              <button onClick={applyFilters} className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all active:scale-95" style={{ background: COLORS.secondaryContainer }}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-sm overflow-hidden bg-white" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
          <div className="overflow-x-auto min-h-[400px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: COLORS.surfaceContainerLow, borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
                  <th className="py-4 pl-6 pr-3 w-12"><input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded cursor-pointer" /></th>
                  {["Customer Name", "Active Project", "Units", "Total Collection", "Status", "Last Activity", ""].map((h, i) => (
                    <th key={i} className={`py-4 px-3 text-[12px] font-semibold uppercase tracking-wider ${h === "Total Collection" ? "text-right" : ""}`} style={{ color: COLORS.onSurfaceVariant }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.outlineVariant }}>
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="py-16 text-center text-sm" style={{ color: COLORS.onSurfaceVariant }}>No customers match your search or filters.</td></tr>
                )}
                {pageRows.map((c) => (
                  <tr key={c.id} onClick={() => onOpenCustomer(c)} className="transition-colors cursor-pointer hover:bg-black/[0.02]" style={{ borderColor: COLORS.outlineVariant }}>
                    <td className="py-4 pl-6 pr-3" onClick={(e) => e.stopPropagation()}><input type="checkbox" checked={selectedIds.includes(c.id)} onChange={() => toggleSelect(c.id)} className="w-4 h-4 rounded cursor-pointer" /></td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden" style={{ background: COLORS.surfaceVariant }}><img alt={c.name} className="w-full h-full object-cover" src={c.avatar} /></div>
                        <div>
                          <p className="font-semibold text-sm">{c.name}</p>
                          <p className="text-[11px]" style={{ color: COLORS.onSurfaceVariant }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-sm font-medium" style={{ color: COLORS.onSurfaceVariant }}>{c.project}</td>
                    <td className="py-4 px-3 text-sm"><span className="px-2 py-0.5 rounded text-[12px] font-bold" style={{ background: COLORS.surfaceContainerHigh }}>{c.units}</span></td>
                    <td className="py-4 px-3 text-sm font-bold text-right">{money(c.collectionValue)}</td>
                    <td className="py-4 px-3"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${STATUS_STYLES[c.status]}`}>{c.status}</span></td>
                    <td className="py-4 px-3 text-[12px]" style={{ color: COLORS.onSurfaceVariant }}>{c.lastActivity}</td>
                    
                    {/* Action Menu (3 Dots) */}
                    <td className="py-4 pl-3 pr-6 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)} className="p-2 transition-opacity rounded-lg hover:bg-black/5" style={{ opacity: openMenuId === c.id ? 1 : 0.4 }}>
                        <Icon name="more_vert" className="!text-[20px]" />
                      </button>
                      {openMenuId === c.id && (
                        <div className="absolute right-6 top-12 z-20 w-44 rounded-xl shadow-2xl bg-white overflow-hidden text-left" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
                          <button onClick={() => { setOpenMenuId(null); onOpenCustomer(c); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-black/5"><Icon name="visibility" className="!text-[18px]" /> View Profile</button>
                          
                          <button onClick={() => { 
                            setOpenMenuId(null); 
                            setEditTarget({ 
                              id: c.id, name: c.name, email: c.email, 
                              project: c.project, units: c.units, 
                              collectionValue: c.collectionValue, status: c.status, 
                              phone: c.phone, avatar: c.avatar 
                            }); 
                          }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-black/5"><Icon name="edit" className="!text-[18px]" /> Edit</button>
                          
                          <button onClick={() => handleDeleteOne(c.id)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50" style={{ color: COLORS.error }}><Icon name="delete" className="!text-[18px]" /> Delete</button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex justify-between items-center flex-wrap gap-3" style={{ background: COLORS.surfaceContainerLow, borderTop: `1px solid ${COLORS.outlineVariant}` }}>
            <span className="text-sm font-medium" style={{ color: COLORS.onSurfaceVariant }}>Showing <b>{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)}</b> of {filtered.length}</span>
            <div className="flex gap-2 items-center">
              <button disabled={currentPage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 bg-white shadow-sm hover:shadow active:scale-95 transition-all" style={{ border: `1px solid ${COLORS.outlineVariant}` }}><Icon name="chevron_left" className="!text-[16px]" /> Prev</button>
              <div className="flex gap-1 overflow-x-auto max-w-[200px] hide-scrollbar">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => {
                  if(n === 1 || n === totalPages || (n >= currentPage - 1 && n <= currentPage + 1)) {
                    return (
                      <button key={n} onClick={() => setPage(n)} className="w-8 h-8 rounded-lg text-xs font-bold transition-all" style={n === currentPage ? { background: COLORS.primary, color: "white" } : { background: "white", border: `1px solid ${COLORS.outlineVariant}` }}>{n}</button>
                    )
                  }
                  if(n === currentPage - 2 || n === currentPage + 2) return <span key={n} className="px-1 text-gray-400">...</span>;
                  return null;
                })}
              </div>
              <button disabled={currentPage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 bg-white shadow-sm hover:shadow active:scale-95 transition-all" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>Next <Icon name="chevron_right" className="!text-[16px]" /></button>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="smart_toy" filled style={{ color: COLORS.primary }} />
            <h3 className="text-xl font-semibold">AI Business Insights</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 rounded-[24px] text-white relative overflow-hidden" style={{ background: `linear-gradient(to bottom right, #1E2A3A, ${COLORS.primaryContainer})` }}>
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Churn Risk Alert</h4>
                <p className="text-white/70 max-w-md mb-6 leading-relaxed">Our AI detected a 12% increase in dormant status for customers in 'Skyline Residences'. Recommended action: Trigger retention campaign.</p>
                <button onClick={() => setShowCampaignModal(true)} className="px-6 py-3 bg-white rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-transform" style={{ color: COLORS.primary }}>Run Campaign</button>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10"><Icon name="monitoring" style={{ fontSize: "200px" }} /></div>
            </div>
            <div className="p-6 rounded-[24px] flex flex-col" style={{ background: COLORS.surfaceContainer, border: `1px solid ${COLORS.outlineVariant}` }}>
              <h4 className="font-bold mb-4">Conversion Predictor</h4>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase" style={{ color: COLORS.onSurfaceVariant }}>Potential Bookings</span>
                  <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>82%</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: COLORS.outlineVariant }}>
                  <div className="h-full rounded-full w-[82%]" style={{ background: COLORS.primary }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setFabOpen((o) => !o)}
          className="w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          style={{ background: COLORS.primary, transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Icon name="add" className="!text-[32px]" />
        </button>
        {fabOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 flex flex-col-reverse pb-2">
            {[
              { icon: "mail", label: "Compose email queued", act: "mail" },
              { icon: "call", label: "Opening dialer...", act: "call" },
              { icon: "description", label: "New document draft created", act: "description" },
            ].map((b) => (
              <button
                key={b.icon}
                onClick={() => { addToast(b.label, b.act); setFabOpen(false); }}
                className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:text-white transition-all"
                style={{ border: `1px solid ${COLORS.outlineVariant}`, color: COLORS.primary }}
                onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.primaryContainer)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
              >
                <Icon name={b.icon} />
              </button>
            ))}
          </div>
        )}
      </div>

      {showAddModal && <CustomerFormModal onClose={() => setShowAddModal(false)} onSave={handleAddCustomer} />}
      {editTarget && <CustomerFormModal initial={editTarget} onClose={() => setEditTarget(null)} onSave={handleEditCustomer} />}
      {showCampaignModal && <AICampaignModal onClose={() => setShowCampaignModal(false)} addToast={addToast} />}
    </div>
  );
}

function CustomerProfile({ customer, onUpdateCustomer, onBack, addToast }) {
  const [tab, setTab] = useState("timeline");
  const [showEdit, setShowEdit] = useState(false);

  const tabs = [
    { id: "timeline", label: "Timeline", icon: "history" },
    { id: "documents", label: "Documents", icon: "folder_open" },
    { id: "payments", label: "Payments", icon: "receipt_long" },
  ];

  return (
    <div style={{ background: COLORS.background, color: COLORS.onSurface }} className="min-h-screen font-sans">
      <div className="flex items-center w-full h-16 px-6 sticky top-0 z-40 backdrop-blur-md" style={{ background: "rgba(250,248,255,0.8)", borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
        <button onClick={onBack} className="flex items-center gap-2 hover:opacity-80 text-sm font-semibold" style={{ color: COLORS.primary }}>
          <Icon name="arrow_back" className="!text-lg" /> Back to Database
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto p-8">
        <div className="flex justify-between items-start flex-wrap gap-4 mb-10">
          <div className="flex items-center gap-6">
            <img className="w-24 h-24 rounded-2xl shadow-lg border-4 border-white object-cover" src={customer.avatar} alt={customer.name} />
            <div>
              <h2 className="text-3xl font-bold">{customer.name}</h2>
              <p className="text-sm mt-1" style={{ color: COLORS.onSurfaceVariant }}>{customer.email} • {customer.phone}</p>
            </div>
          </div>
          <button onClick={() => setShowEdit(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-black/5" style={{ background: COLORS.surface, border: `1px solid ${COLORS.outlineVariant}` }}>
            <Icon name="edit" className="!text-sm" /> Edit Profile
          </button>
        </div>

        <div className="flex gap-8 border-b mb-6">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`pb-4 font-bold border-b-2 transition-all ${tab === t.id ? 'border-[#012c7e] text-[#012c7e]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
              <span className="flex items-center gap-2"><Icon name={t.icon} className="!text-sm" /> {t.label}</span>
            </button>
          ))}
        </div>
        
        {tab === "timeline" && (
          <div className="bg-white rounded-xl p-6 shadow-sm" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
            <div className="space-y-8">
              {customer.activity.length === 0 && <p className="text-gray-500 py-8 text-center">No activity recorded yet.</p>}
              {customer.activity.map((a, i) => (
                <div key={i} className="relative pl-8" style={{ borderLeft: i !== customer.activity.length - 1 ? `2px solid ${COLORS.outlineVariant}` : "none", marginLeft: "1px" }}>
                  <div className="absolute left-[-7px] top-1 w-3 h-3 rounded-full" style={{ background: ACTIVITY_DOT[a.color] || COLORS.primary, boxShadow: `0 0 0 4px ${ACTIVITY_DOT[a.color] || COLORS.primary}1a` }}></div>
                  <div className="flex justify-between items-start flex-wrap gap-2">
                    <div>
                      <p className="font-semibold">{a.title}</p>
                      <p className="text-sm mt-1" style={{ color: COLORS.onSurfaceVariant }}>{a.sub}</p>
                      {a.file && (
                        <div onClick={() => addToast(`Downloading ${a.file}...`, "download")} className="mt-3 flex items-center gap-2 p-2 rounded-lg w-fit cursor-pointer hover:opacity-80 transition-all" style={{ background: COLORS.surfaceContainer }}>
                          <Icon name="picture_as_pdf" style={{ color: COLORS.primary }} />
                          <span className="text-xs font-medium">{a.file}</span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs whitespace-nowrap" style={{ color: COLORS.onSurfaceVariant }}>{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab !== "timeline" && (
          <div className="p-10 text-center text-gray-500 bg-white rounded-2xl border">
            <Icon name={tabs.find(t=>t.id===tab).icon} className="!text-4xl mb-3 opacity-50" />
            <p>Detailed {tab} data for {customer.name} will appear here.</p>
          </div>
        )}
      </div>

      {showEdit && (
        <ProfileEditModal
          customer={customer}
          onClose={() => setShowEdit(false)}
          onSave={(form) => {
            onUpdateCustomer(customer.id, form);
            setShowEdit(false);
            addToast("Personal details updated", "check_circle");
          }}
        />
      )}
    </div>
  );
}
export default function RealtyOneCRM() {
  const [view, setView] = useState("database");
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedId, setSelectedId] = useState(null);
  const [toasts, setToasts] = useState([]);
  const toastTimer = useRef(0);

  const addToast = (message, icon) => {
    const id = ++toastTimer.current;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3200);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedId) || customers[0];

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const fontLinks = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
      * { font-family: 'Inter', sans-serif; }
      .hide-scrollbar::-webkit-scrollbar { display: none; }
      @keyframes fadein { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
    `}</style>
  );

  return (
    <>
      {fontLinks}
      {view === "database" ? (
        <CustomerDatabase
          customers={customers}
          setCustomers={setCustomers}
          addToast={addToast}
          onOpenCustomer={(c) => {
            setSelectedId(c.id);
            setView("profile");
          }}
        />
      ) : (
        <CustomerProfile customer={selectedCustomer} onUpdateCustomer={updateCustomer} onBack={() => setView("database")} addToast={addToast} />
      )}
      <ToastStack toasts={toasts} />
    </>
  );
}