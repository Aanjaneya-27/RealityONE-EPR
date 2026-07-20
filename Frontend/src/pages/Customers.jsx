import { useState, useMemo, useRef, useEffect } from "react";
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
  avatar:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCPtzfNqE_QhPaL1ZxVv6o0Cz79WskLvpd7mAOD2qPEDBSETw-bFEZf_yWEBDVsJJuLLIJ5K9GLUJlFfEvolF7q82TDPS7RHlXwSBwK5HJdQvV6u-1Eqp86UBLCDIr8B-i6a4GF5_tmnBiHjQwmvV8WPefhYHF4MCIYcTM59AkQo6T7gocHIG3uaMSaBaEYa1QsvvI5q8VBG_OIUj4OgEq0EPi5LCVHNZThU40zSOliJ1dURpHq4yX_nQ",
};

const INITIAL_CUSTOMERS = [
  {
    id: "CUST-90124",
    name: "Eleanor Shellstrop",
    email: "eleanor@realestate.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuALtgWZiyAKCAvZkWHocUAb0VQ2z8nm8j_3VPExGlkxPjK4n-bQ6Tm8zytQq-1KjbhdEercfkpvBwKlSgQz02ago4Tv0pSp1RFbd5C9pwvbn9rT4CF1mhAg5stUOMhhbrZ2vPGBecbQrwkJi1gM59oUSk2HsXn4pE1PNEqb4gESbfNaUwU2AaXP873_-srXcY4Flm_EWn5lnLPJuGi_Yn0dbDvSl_STolySlYIz4vimigNEst_rHUnJdg",
    project: "Skyline Residences",
    units: "02",
    collectionValue: 480000,
    status: "Booked",
    lastActivity: "Today, 10:42 AM",
    lastNote: "Payment Received",
    location: "Phoenix, Arizona",
    tier: "Premium Client",
    phone: "+1 (602) 555-0199",
    address: "123 Lemon Street, Phoenix, AZ 85001",
    occupation: "Senior Legal Consultant",
    company: "Bad Place & Associates",
    nominee: { name: "Tahani Al-Jamil", relation: "Sister", verified: true },
    agent: DEFAULT_AGENT,
    activity: [
      {
        color: "primary",
        title: "Unit Possession Document Shared",
        sub: "Property: Skyview Towers, Penthouse B",
        file: "Possession_Letter_V2.pdf",
        time: "2 hours ago",
      },
      {
        color: "secondary",
        title: "Payment Received: INR 4,50,000",
        sub: "Transaction ID: #TXN-8821901",
        time: "Yesterday, 4:30 PM",
      },
      {
        color: "tertiaryContainer",
        title: "Virtual Tour Completed",
        sub: "Assisted by: Chidi Anagonye (Sales Manager)",
        time: "Oct 24, 2023",
      },
    ],
    documents: [
      { icon: "badge", name: "PAN Card", meta: "ABCDE1234F • PDF • 1.2MB" },
      { icon: "fingerprint", name: "Aadhaar Card", meta: "XXXX-XXXX-8901 • JPG • 2.4MB" },
    ],
  },
  {
    id: "CUST-90125",
    name: "Marcus Aurelius",
    email: "marcus.a@stoic.io",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAemX5Shm-SlD4Nsez6oAqZHuY3NdOC6lrHNzTDYU1jiyfTkpUya_CWCBLoPr1hzYCZb58Rm4BWKmdg8jSOILadL32g9XUNre9nLzG1BAsHNFVUR8eDb5J4YRuio_LuUawq6mjnU7iDk4HsEdg5EuZLUsvcAUYSvLKu2lyWlDLpD49bZcscEDnkJtMClzxF3euWrCL1mh3hnfE0_3yHQgqH1Wv83Oh0Yx2bjh3E7KRKp8u3GGj0UzFEJg",
    project: "Emerald Gardens",
    units: "01",
    collectionValue: 215000,
    status: "Interested",
    lastActivity: "Yesterday, 4:20 PM",
    lastNote: "Site Visit Scheduled",
    location: "Rome, Italy",
    tier: "Standard Client",
    phone: "+1 (480) 555-0142",
    address: "44 Meditations Ave, Rome, IT 00100",
    occupation: "Philosophy Professor",
    company: "Stoic Institute",
    nominee: { name: "Commodus Aurelius", relation: "Son", verified: false },
    agent: DEFAULT_AGENT,
    activity: [
      {
        color: "secondary",
        title: "Site Visit Scheduled",
        sub: "Property: Emerald Gardens, Block C",
        time: "Yesterday, 4:20 PM",
      },
      {
        color: "tertiaryContainer",
        title: "Brochure Sent via Email",
        sub: "Sent by: Chidi Anagonye (Sales Manager)",
        time: "Oct 20, 2023",
      },
    ],
    documents: [{ icon: "badge", name: "Passport", meta: "IT9081234 • PDF • 0.9MB" }],
  },
  {
    id: "CUST-90126",
    name: "Sarah Jenkins",
    email: "s.jenkins@wealthmgmt.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsPPe22IoyeBNYn1j3EDvPax6iiqELz4NBzJThn7FfDRm5nakw6lbMtLJU6faw1MTw0EokYU9lyuQzdgQi2d_YKMw5oMqHQcuT3ffF6U-SqAYcPzh0bVXDrSq-ELtz3gRGnXn_ym5k-_LcqFU3hEuXeSIP4cqLq7SUtl8ruDrnNK62ROz9wWRHQct7AIkey_SRr4Ci-maKuFvBgulhFDZCa904P2L6s1E302dZX1aEqI-j9O7-7FQB8A",
    project: "Oakwood Heights",
    units: "04",
    collectionValue: 1250000,
    status: "Booked",
    lastActivity: "Oct 24, 2023",
    lastNote: "Tax Document Signed",
    location: "Scottsdale, Arizona",
    tier: "Premium Client",
    phone: "+1 (480) 555-0110",
    address: "9 Wealth Row, Scottsdale, AZ 85251",
    occupation: "Wealth Manager",
    company: "Jenkins Wealth Management",
    nominee: { name: "Tom Jenkins", relation: "Spouse", verified: true },
    agent: DEFAULT_AGENT,
    activity: [
      {
        color: "primary",
        title: "Tax Document Signed",
        sub: "Property: Oakwood Heights, Unit 4B",
        file: "Tax_Statement_2023.pdf",
        time: "Oct 24, 2023",
      },
      {
        color: "secondary",
        title: "Final Payment Received: $1,250,000",
        sub: "Transaction ID: #TXN-7743210",
        time: "Oct 18, 2023",
      },
    ],
    documents: [
      { icon: "badge", name: "Driver's License", meta: "AZ-556123 • PDF • 1.1MB" },
      { icon: "description", name: "Purchase Agreement", meta: "Signed • PDF • 3.8MB" },
    ],
  },
];

const money = (n) => "$" + Number(n || 0).toLocaleString("en-US");
const uid = () => "CUST-" + Math.floor(90000 + Math.random() * 9999);

/* ---------------------------------------------------------------
   Icon helper (Material Symbols Outlined via Google Fonts CDN)
----------------------------------------------------------------- */
function Icon({ name, className = "", filled = false, style = {} }) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={{
        fontVariationSettings: `'FILL' ${filled ? 1 : 0}, 'wght' 400, 'GRAD' 0, 'opsz' 24`,
        ...style,
      }}
    >
      {name}
    </span>
  );
}

/* ---------------------------------------------------------------
   Toast notifications (stand-in for real side effects: calls,
   sms, emails, downloads etc. that can't truly happen in-browser)
----------------------------------------------------------------- */
function ToastStack({ toasts }) {
  return (
    <div className="fixed bottom-6 left-6 z-[200] space-y-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-2xl text-sm font-medium text-white animate-[fadein_0.2s_ease-out]"
          style={{ background: COLORS.onSurface }}
        >
          <Icon name={t.icon || "check_circle"} className="!text-[18px]" style={{ color: "#b4c5ff" }} />
          {t.message}
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------------------------------------
   Generic Modal
----------------------------------------------------------------- */
function Modal({ title, onClose, children, footer, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" style={{ background: "rgba(26,27,33,0.5)" }} onClick={onClose}>
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full ${wide ? "max-w-2xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
          <h3 className="text-lg font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {title}
          </h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5">
            <Icon name="close" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && (
          <div className="px-6 py-4 flex justify-end gap-3" style={{ borderTop: `1px solid ${COLORS.outlineVariant}`, background: COLORS.surfaceContainerLow }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-bold uppercase tracking-wider" style={{ color: COLORS.onSurfaceVariant }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls = "w-full rounded-xl text-sm px-3 py-2 outline-none focus:ring-2";
const inputStyle = { background: COLORS.surfaceContainerLow, border: `1px solid ${COLORS.outlineVariant}` };

/* ---------------------------------------------------------------
   Add / Quick-edit Customer Modal
----------------------------------------------------------------- */
function CustomerFormModal({ initial, onClose, onSave }) {
  const [form, setForm] = useState(
    initial || {
      name: "",
      email: "",
      project: "Skyline Residences",
      units: "01",
      collectionValue: "",
      status: "Interested",
      phone: "",
    }
  );
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const isValid = form.name.trim() && form.email.trim();

  return (
    <Modal
      title={initial ? "Edit Customer" : "Add Customer"}
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
            Cancel
          </button>
          <button
            disabled={!isValid}
            onClick={() => isValid && onSave(form)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: COLORS.primary }}
          >
            {initial ? "Save Changes" : "Add Customer"}
          </button>
        </>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full Name">
          <input className={inputCls} style={inputStyle} value={form.name} onChange={set("name")} placeholder="e.g. John Doe" />
        </Field>
        <Field label="Email">
          <input className={inputCls} style={inputStyle} value={form.email} onChange={set("email")} placeholder="e.g. john@email.com" />
        </Field>
        <Field label="Phone Number">
          <input className={inputCls} style={inputStyle} value={form.phone} onChange={set("phone")} placeholder="+1 (000) 000-0000" />
        </Field>
        <Field label="Active Project">
          <select className={inputCls} style={inputStyle} value={form.project} onChange={set("project")}>
            {["Skyline Residences", "Emerald Gardens", "Oakwood Heights"].map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
        <Field label="Units Owned">
          <input className={inputCls} style={inputStyle} value={form.units} onChange={set("units")} placeholder="01" />
        </Field>
        <Field label="Total Collection ($)">
          <input
            type="number"
            className={inputCls}
            style={inputStyle}
            value={form.collectionValue}
            onChange={set("collectionValue")}
            placeholder="0"
          />
        </Field>
        <Field label="Status">
          <select className={inputCls} style={inputStyle} value={form.status} onChange={set("status")}>
            {["Booked", "Interested", "Negotiating", "Dormant"].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
      </div>
    </Modal>
  );
}

/* ---------------------------------------------------------------
   Full Profile Edit Modal (used inside Customer Profile view)
----------------------------------------------------------------- */
function ProfileEditModal({ customer, onClose, onSave }) {
  const [form, setForm] = useState({
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    occupation: customer.occupation,
    company: customer.company,
  });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <Modal
      title="Edit Personal Details"
      onClose={onClose}
      footer={
        <>
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-semibold" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)} className="px-4 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: COLORS.primary }}>
            Save Changes
          </button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="Phone Number">
          <input className={inputCls} style={inputStyle} value={form.phone} onChange={set("phone")} />
        </Field>
        <Field label="Email Address">
          <input className={inputCls} style={inputStyle} value={form.email} onChange={set("email")} />
        </Field>
        <Field label="Current Address">
          <input className={inputCls} style={inputStyle} value={form.address} onChange={set("address")} />
        </Field>
        <Field label="Occupation">
          <input className={inputCls} style={inputStyle} value={form.occupation} onChange={set("occupation")} />
        </Field>
        <Field label="Company">
          <input className={inputCls} style={inputStyle} value={form.company} onChange={set("company")} />
        </Field>
      </div>
    </Modal>
  );
}

function downloadCSV(rows, filename) {
  const header = ["Customer ID", "Name", "Email", "Project", "Units", "Total Collection", "Status", "Last Activity"];
  const lines = rows.map((c) =>
    [c.id, c.name, c.email, c.project, c.units, c.collectionValue, c.status, c.lastActivity]
      .map((v) => `"${String(v).replace(/"/g, '""')}"`)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* ================================================================
   CUSTOMER DATABASE (list) VIEW
================================================================= */
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
  const [editTarget, setEditTarget] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
      const matchesSearch =
        !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.project.toLowerCase().includes(q);
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

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const applyFilters = () => {
    setAppliedFilters({ project: draftProject, status: draftStatus, value: draftValue });
    setPage(1);
    addToast(`Filters applied — ${filtered.length} match${filtered.length === 1 ? "" : "es"} expected`, "filter_alt");
  };

  const handleDeleteSelected = () => {
    setCustomers((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
    addToast(`Deleted ${selectedIds.length} customer${selectedIds.length === 1 ? "" : "s"}`, "delete");
    setSelectedIds([]);
  };

  const handleDeleteOne = (id) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
    setSelectedIds((prev) => prev.filter((x) => x !== id));
    addToast("Customer deleted", "delete");
    setOpenMenuId(null);
  };

  const handleAddCustomer = (form) => {
    const newCustomer = {
      id: uid(),
      name: form.name,
      email: form.email,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(form.name)}&backgroundColor=012c7e&textColor=ffffff`,
      project: form.project,
      units: form.units || "00",
      collectionValue: Number(form.collectionValue) || 0,
      status: form.status,
      lastActivity: "Just now",
      lastNote: "Customer Created",
      location: "—",
      tier: "Standard Client",
      phone: form.phone || "—",
      address: "—",
      occupation: "—",
      company: "—",
      nominee: { name: "—", relation: "—", verified: false },
      agent: DEFAULT_AGENT,
      activity: [{ color: "primary", title: "Customer Profile Created", sub: "Added via Customer Database", time: "Just now" }],
      documents: [],
    };
    setCustomers((prev) => [newCustomer, ...prev]);
    setShowAddModal(false);
    addToast(`${form.name} added to Customer Database`, "person_add");
  };

  const handleEditCustomer = (form) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === editTarget.id
          ? { ...c, ...form, collectionValue: Number(form.collectionValue) || 0 }
          : c
      )
    );
    setEditTarget(null);
    addToast("Customer updated", "edit");
  };

  return (
    <div style={{ background: COLORS.background, color: COLORS.onSurface }} className="min-h-screen font-sans" onClick={() => setOpenMenuId(null)}>
      <div className="p-8 max-w-[1600px] mx-auto">
        {/* Page Header */}
        <div className="flex justify-between items-end mb-8 flex-wrap gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs mb-2" style={{ color: COLORS.outline }}>
              <span className="hover:opacity-80 cursor-pointer" style={{ color: COLORS.primary }}>
                CRM
              </span>
              <Icon name="chevron_right" className="!text-[14px]" />
              <span style={{ color: COLORS.onSurfaceVariant }} className="font-medium">
                Customer Management
              </span>
            </nav>
            <h2 className="text-[36px] leading-[44px] tracking-[-0.02em] font-bold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Customer Database
            </h2>
            <p className="mt-1" style={{ color: COLORS.onSurfaceVariant }}>
              Manage and track your active and interested clients across all portfolios.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                downloadCSV(filtered, "realtyone-customers.csv");
                addToast(`Exported ${filtered.length} customers to CSV`, "ios_share");
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-colors hover:bg-black/5"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.outlineVariant}`, color: COLORS.onSurface }}
            >
              <Icon name="ios_share" className="!text-[18px]" />
              Export
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white shadow-md active:scale-95 transition-all hover:opacity-90"
              style={{ background: COLORS.primary }}
            >
              <Icon name="person_add" className="!text-[18px]" />
              Add Customer
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-md mb-6">
          <Icon name="search" className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: COLORS.outline }} />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2"
            style={{ background: COLORS.surfaceContainerLow, border: `1px solid ${COLORS.outlineVariant}` }}
            placeholder="Search customers, properties, or files..."
          />
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: "group", label: "Total Customers", value: customers.length.toLocaleString(), bg: "rgba(37,68,149,0.1)", fg: COLORS.primaryContainer },
            {
              icon: "apartment",
              label: "Active Bookings",
              value: customers.filter((c) => c.status === "Booked").length,
              bg: "rgba(62,110,227,0.1)",
              fg: COLORS.secondaryContainer,
            },
            {
              icon: "payments",
              label: "Total Collection",
              value: money(customers.reduce((s, c) => s + c.collectionValue, 0)),
              bg: "rgba(121,54,0,0.1)",
              fg: COLORS.tertiaryContainer,
            },
            { icon: "trending_up", label: "Retention Rate", value: "94.2%", bg: "#dcfce7", fg: "#15803d" },
          ].map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-2xl flex items-center gap-4"
              style={{ background: COLORS.surfaceContainerLowest, border: `1px solid ${COLORS.outlineVariant}` }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: s.bg, color: s.fg }}>
                <Icon name={s.icon} filled />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: COLORS.onSurfaceVariant }}>
                  {s.label}
                </p>
                <p className="text-2xl font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="p-6 rounded-2xl mb-6" style={{ background: COLORS.surfaceContainerLowest, border: `1px solid ${COLORS.outlineVariant}` }}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>
                Project
              </label>
              <select
                className="w-full rounded-xl text-sm px-3 py-2 outline-none focus:ring-1"
                style={{ background: COLORS.surfaceContainerLow, border: `1px solid ${COLORS.outlineVariant}` }}
                value={draftProject}
                onChange={(e) => setDraftProject(e.target.value)}
              >
                {["All Projects", "Skyline Residences", "Emerald Gardens", "Oakwood Heights"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>
                Status
              </label>
              <select
                className="w-full rounded-xl text-sm px-3 py-2 outline-none focus:ring-1"
                style={{ background: COLORS.surfaceContainerLow, border: `1px solid ${COLORS.outlineVariant}` }}
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value)}
              >
                {["All Statuses", "Booked", "Interested", "Negotiating", "Dormant"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <label className="block text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: COLORS.onSurfaceVariant }}>
                Value Range
              </label>
              <select
                className="w-full rounded-xl text-sm px-3 py-2 outline-none focus:ring-1"
                style={{ background: COLORS.surfaceContainerLow, border: `1px solid ${COLORS.outlineVariant}` }}
                value={draftValue}
                onChange={(e) => setDraftValue(e.target.value)}
              >
                {["Any Range", "$0 - $50k", "$50k - $200k", "$200k - $1M", "$1M+"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end h-full pt-6">
              <button
                onClick={() => addToast("Advanced filters (date range, agent, tags) coming soon", "tune")}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:opacity-80"
                style={{ background: COLORS.surfaceContainerHigh, border: `1px solid ${COLORS.outlineVariant}`, color: COLORS.onSurfaceVariant }}
              >
                More Filters
              </button>
            </div>
            <div className="flex items-end h-full pt-6 ml-auto">
              <button
                onClick={applyFilters}
                className="px-6 py-2 rounded-xl text-sm font-semibold text-white shadow-sm hover:shadow-md transition-all"
                style={{ background: COLORS.secondaryContainer }}
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-2xl shadow-sm overflow-hidden bg-white" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
          <div
            className="px-6 py-4 flex justify-between items-center flex-wrap gap-3"
            style={{ borderBottom: `1px solid ${COLORS.outlineVariant}`, background: COLORS.surfaceContainerLowest }}
          >
            {selectedIds.length > 0 ? (
              <div className="flex items-center gap-4">
                <div
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold"
                  style={{ background: "rgba(37,68,149,0.1)", color: COLORS.primary }}
                >
                  <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: COLORS.primary }}></span>
                  {selectedIds.length} Selected
                </div>
                <div className="h-6 w-px" style={{ background: COLORS.outlineVariant }}></div>
                <div className="flex gap-1">
                  <button
                    onClick={() => addToast(`Email queued for ${selectedIds.length} customer${selectedIds.length === 1 ? "" : "s"}`, "mail")}
                    className="p-2 rounded-lg transition-all hover:bg-black/5"
                    style={{ color: COLORS.onSurfaceVariant }}
                    title="Bulk Email"
                  >
                    <Icon name="mail" className="!text-[20px]" />
                  </button>
                  <button
                    onClick={() => addToast(`SMS queued for ${selectedIds.length} customer${selectedIds.length === 1 ? "" : "s"}`, "sms")}
                    className="p-2 rounded-lg transition-all hover:bg-black/5"
                    style={{ color: COLORS.onSurfaceVariant }}
                    title="Bulk SMS"
                  >
                    <Icon name="sms" className="!text-[20px]" />
                  </button>
                  <button
                    onClick={() => {
                      const rows = customers.filter((c) => selectedIds.includes(c.id));
                      downloadCSV(rows, "selected-customers.csv");
                      addToast(`Exported ${rows.length} selected customers`, "download");
                    }}
                    className="p-2 rounded-lg transition-all hover:bg-black/5"
                    style={{ color: COLORS.onSurfaceVariant }}
                    title="Export Selected"
                  >
                    <Icon name="download" className="!text-[20px]" />
                  </button>
                  <button
                    onClick={handleDeleteSelected}
                    className="p-2 rounded-lg transition-all hover:bg-red-50"
                    style={{ color: COLORS.error }}
                    title="Delete Selected"
                  >
                    <Icon name="delete" className="!text-[20px]" />
                  </button>
                </div>
              </div>
            ) : (
              <div />
            )}
            <div className="text-xs" style={{ color: COLORS.onSurfaceVariant }}>
              Showing <b>{filtered.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filtered.length)}</b> of{" "}
              {filtered.length} customers
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr style={{ background: COLORS.surfaceContainerLow, borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
                  <th className="py-4 pl-6 pr-3 w-12">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded cursor-pointer"
                      style={{ borderColor: COLORS.outlineVariant }}
                    />
                  </th>
                  {["Customer Name", "Active Project", "Units Owned", "Total Collection", "Status", "Last Activity", ""].map((h, i) => (
                    <th
                      key={i}
                      className={`py-4 px-3 text-[12px] font-semibold uppercase tracking-wider ${
                        h === "Total Collection" ? "text-right" : h === "Units Owned" || h === "Status" ? "text-center" : ""
                      }`}
                      style={{ color: COLORS.onSurfaceVariant }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: COLORS.outlineVariant }}>
                {pageRows.length === 0 && (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-sm" style={{ color: COLORS.onSurfaceVariant }}>
                      No customers match your search or filters.
                    </td>
                  </tr>
                )}
                {pageRows.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => onOpenCustomer(c)}
                    className="transition-colors group cursor-pointer hover:bg-black/[0.02] relative"
                    style={{ borderColor: COLORS.outlineVariant }}
                  >
                    <td className="py-4 pl-6 pr-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="w-4 h-4 rounded cursor-pointer"
                        style={{ borderColor: COLORS.outlineVariant }}
                      />
                    </td>
                    <td className="py-4 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden" style={{ background: COLORS.surfaceVariant }}>
                          <img alt={c.name} className="w-full h-full object-cover" src={c.avatar} />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{c.name}</p>
                          <p className="text-[11px]" style={{ color: COLORS.onSurfaceVariant }}>
                            {c.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-3 text-sm font-medium" style={{ color: COLORS.onSurfaceVariant }}>
                      {c.project}
                    </td>
                    <td className="py-4 px-3 text-sm text-center">
                      <span className="px-2 py-0.5 rounded text-[12px] font-bold" style={{ background: COLORS.surfaceContainerHigh }}>
                        {c.units}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-sm font-bold text-right">{money(c.collectionValue)}</td>
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase ${STATUS_STYLES[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-3 text-[12px]" style={{ color: COLORS.onSurfaceVariant }}>
                      {c.lastActivity}
                      <p className="text-[10px] opacity-70">{c.lastNote}</p>
                    </td>
                    <td className="py-4 pl-3 pr-6 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === c.id ? null : c.id)}
                        className="p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg hover:bg-black/5"
                        style={{ opacity: openMenuId === c.id ? 1 : undefined }}
                      >
                        <Icon name="more_vert" className="!text-[20px]" />
                      </button>
                      {openMenuId === c.id && (
                        <div
                          className="absolute right-6 top-12 z-20 w-44 rounded-xl shadow-2xl bg-white overflow-hidden text-left"
                          style={{ border: `1px solid ${COLORS.outlineVariant}` }}
                        >
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              onOpenCustomer(c);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-black/5"
                          >
                            <Icon name="visibility" className="!text-[18px]" /> View Profile
                          </button>
                          <button
                            onClick={() => {
                              setOpenMenuId(null);
                              setEditTarget({
                                id: c.id,
                                name: c.name,
                                email: c.email,
                                project: c.project,
                                units: c.units,
                                collectionValue: c.collectionValue,
                                status: c.status,
                                phone: c.phone,
                              });
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-black/5"
                          >
                            <Icon name="edit" className="!text-[18px]" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteOne(c.id)}
                            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-red-50"
                            style={{ color: COLORS.error }}
                          >
                            <Icon name="delete" className="!text-[18px]" /> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div
            className="px-6 py-4 flex justify-between items-center flex-wrap gap-3"
            style={{ background: COLORS.surfaceContainerLow, borderTop: `1px solid ${COLORS.outlineVariant}` }}
          >
            <button
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-50 bg-white"
              style={{ border: `1px solid ${COLORS.outlineVariant}`, color: COLORS.onSurfaceVariant }}
            >
              <Icon name="chevron_left" className="!text-[16px]" />
              Previous
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="w-8 h-8 rounded-lg text-xs font-bold transition-colors"
                  style={
                    n === currentPage
                      ? { background: COLORS.primary, color: "white" }
                      : { color: COLORS.onSurfaceVariant }
                  }
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-white disabled:opacity-50"
              style={{ border: `1px solid ${COLORS.outlineVariant}`, color: COLORS.onSurfaceVariant }}
            >
              Next
              <Icon name="chevron_right" className="!text-[16px]" />
            </button>
          </div>
        </div>

        {/* AI Insights */}
        <div className="mt-12">
          <div className="flex items-center gap-3 mb-6">
            <Icon name="smart_toy" filled style={{ color: COLORS.primary }} />
            <h3 className="text-xl font-semibold">AI Business Insights</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="lg:col-span-2 p-8 rounded-[24px] text-white relative overflow-hidden"
              style={{ background: `linear-gradient(to bottom right, #1E2A3A, ${COLORS.primaryContainer})` }}
            >
              <div className="relative z-10">
                <h4 className="text-xl font-bold mb-2">Churn Risk Alert</h4>
                <p className="text-white/70 max-w-md mb-6 leading-relaxed">
                  Our AI detected a 12% increase in dormant status for customers in 'Skyline Residences'. Recommended action: Trigger
                  retention campaign.
                </p>
                <button
                  onClick={() => addToast("Retention campaign started for Skyline Residences", "campaign")}
                  className="px-6 py-3 bg-white rounded-xl font-bold text-sm shadow-xl hover:scale-105 transition-transform"
                  style={{ color: COLORS.primary }}
                >
                  Run Campaign
                </button>
              </div>
              <div className="absolute right-0 bottom-0 w-64 h-64 opacity-10">
                <Icon name="monitoring" style={{ fontSize: "200px", fontVariationSettings: "'wght' 100" }} />
              </div>
            </div>
            <div className="p-6 rounded-[24px] flex flex-col" style={{ background: COLORS.surfaceContainer, border: `1px solid ${COLORS.outlineVariant}` }}>
              <h4 className="font-bold mb-4">Conversion Predictor</h4>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold uppercase" style={{ color: COLORS.onSurfaceVariant }}>
                    Potential Bookings
                  </span>
                  <span className="text-2xl font-bold" style={{ color: COLORS.primary }}>
                    82%
                  </span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden" style={{ background: COLORS.outlineVariant }}>
                  <div className="h-full rounded-full w-[82%]" style={{ background: COLORS.primary }}></div>
                </div>
                <p className="text-[11px] mt-4 text-center" style={{ color: COLORS.onSurfaceVariant }}>
                  Based on last 30 days of interaction data.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Hub */}
      <div className="fixed bottom-8 right-8 z-50" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setFabOpen((o) => !o)}
          className="w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all"
          style={{ background: COLORS.primary, transform: fabOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Icon name="add" className="!text-[32px]" />
        </button>
        {fabOpen && (
          <div className="absolute bottom-16 right-0 space-y-3 flex flex-col-reverse">
            {[
              { icon: "mail", label: "Compose email queued", act: "mail" },
              { icon: "call", label: "Opening dialer...", act: "call" },
              { icon: "description", label: "New document draft created", act: "description" },
            ].map((b) => (
              <button
                key={b.icon}
                onClick={() => {
                  addToast(b.label, b.act);
                  setFabOpen(false);
                }}
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
    </div>
  );
}

/* ================================================================
   CUSTOMER PROFILE VIEW
================================================================= */
function CustomerProfile({ customer, onUpdateCustomer, onBack, addToast }) {
  const [tab, setTab] = useState("timeline");
  const [showEdit, setShowEdit] = useState(false);

  const tabs = [
    { id: "timeline", label: "Timeline", icon: "history" },
    { id: "documents", label: "Documents", icon: "folder_open" },
    { id: "bookings", label: "Bookings", icon: "book_online" },
    { id: "payments", label: "Payments", icon: "receipt_long" },
  ];

  return (
    <div style={{ background: COLORS.background, color: COLORS.onSurface }} className="min-h-screen font-sans">
      {/* Breadcrumb bar (stands in for the removed top navbar) */}
      <div
        className="flex items-center w-full h-16 px-6 sticky top-0 z-40 backdrop-blur-md"
        style={{ background: "rgba(250,248,255,0.8)", borderBottom: `1px solid ${COLORS.outlineVariant}` }}
      >
        <nav className="flex items-center text-sm gap-2" style={{ color: COLORS.onSurfaceVariant }}>
          <span onClick={onBack} className="hover:opacity-80 cursor-pointer" style={{ color: COLORS.onSurfaceVariant }}>
            Customers
          </span>
          <Icon name="chevron_right" className="!text-xs" />
          <span className="font-semibold" style={{ color: COLORS.primary }}>
            {customer.name}
          </span>
        </nav>
      </div>

      <div className="max-w-[1600px] mx-auto p-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <img className="w-full h-full object-cover" src={customer.avatar} alt={customer.name} />
              </div>
              <span className="absolute -bottom-2 -right-2 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white uppercase tracking-wider">
                Active
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {customer.name}
              </h2>
              <div className="flex items-center gap-4 mt-1 flex-wrap text-sm" style={{ color: COLORS.onSurfaceVariant }}>
                <span className="flex items-center gap-1">
                  <Icon name="id_card" className="!text-sm" /> {customer.id}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="location_on" className="!text-sm" /> {customer.location}
                </span>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded uppercase" style={{ background: "rgba(1,44,126,0.1)", color: COLORS.primary }}>
                  {customer.tier}
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => addToast(`Calling ${customer.name} at ${customer.phone}...`, "call")}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-black/5"
              style={{ border: `1px solid ${COLORS.outlineVariant}` }}
            >
              <Icon name="call" style={{ color: COLORS.onSurfaceVariant }} />
            </button>
            <button
              onClick={() => addToast(`Opening WhatsApp chat with ${customer.name}`, "chat_bubble")}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-black/5"
              style={{ border: `1px solid ${COLORS.outlineVariant}` }}
            >
              <Icon name="chat_bubble" style={{ color: COLORS.onSurfaceVariant }} />
            </button>
            <button
              onClick={() => addToast(`Email draft opened for ${customer.email}`, "mail")}
              className="flex items-center justify-center w-10 h-10 rounded-xl transition-colors hover:bg-black/5"
              style={{ border: `1px solid ${COLORS.outlineVariant}` }}
            >
              <Icon name="mail" style={{ color: COLORS.onSurfaceVariant }} />
            </button>
            <button
              onClick={() => addToast("Agreement generated and ready to download", "description")}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all"
              style={{ background: COLORS.secondaryContainer, color: COLORS.onSecondaryContainer }}
            >
              <Icon name="description" className="!text-sm" />
              Generate Agreement
            </button>
            <button
              onClick={() => setShowEdit(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-black/5"
              style={{ background: COLORS.surface, border: `1px solid ${COLORS.outlineVariant}` }}
            >
              <Icon name="edit" className="!text-sm" />
              Edit Profile
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Main Column */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Tabs */}
            <div className="flex gap-8" style={{ borderBottom: `1px solid ${COLORS.outlineVariant}` }}>
              {tabs.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="relative py-4 font-medium transition-all"
                  style={{ color: tab === t.id ? COLORS.primary : COLORS.onSurfaceVariant, fontWeight: tab === t.id ? 700 : 500 }}
                >
                  <span className="flex items-center gap-2">
                    <Icon name={t.icon} className="!text-sm" /> {t.label}
                  </span>
                  {tab === t.id && <div className="absolute -bottom-[1px] left-0 right-0 h-[2px]" style={{ background: COLORS.primary }} />}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="min-h-[500px]">
              {tab === "timeline" && (
                <div className="rounded-xl overflow-hidden bg-white" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
                  <div
                    className="p-6 flex justify-between items-center"
                    style={{ borderBottom: `1px solid ${COLORS.outlineVariant}`, background: COLORS.surfaceContainerLow }}
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: COLORS.onSurfaceVariant }}>
                      Activity Feed
                    </h3>
                    <button
                      onClick={() => addToast("Activity log filters opened", "filter_list")}
                      className="text-sm font-semibold hover:underline"
                      style={{ color: COLORS.primary }}
                    >
                      Filter Log
                    </button>
                  </div>
                  <div className="p-6 space-y-8">
                    {customer.activity.length === 0 && (
                      <p className="text-sm text-center py-8" style={{ color: COLORS.onSurfaceVariant }}>
                        No activity recorded yet.
                      </p>
                    )}
                    {customer.activity.map((a, i) => (
                      <div
                        key={i}
                        className="relative pl-8"
                        style={{
                          borderLeft: i !== customer.activity.length - 1 ? `2px solid ${COLORS.outlineVariant}` : "none",
                          marginLeft: "1px",
                        }}
                      >
                        <div
                          className="absolute left-[-7px] top-1 w-3 h-3 rounded-full"
                          style={{ background: ACTIVITY_DOT[a.color], boxShadow: `0 0 0 4px ${ACTIVITY_DOT[a.color]}1a` }}
                        ></div>
                        <div className="flex justify-between items-start flex-wrap gap-2">
                          <div>
                            <p className="font-semibold">{a.title}</p>
                            <p className="text-sm mt-1" style={{ color: COLORS.onSurfaceVariant }}>
                              {a.sub}
                            </p>
                            {a.file && (
                              <div
                                onClick={() => addToast(`Downloading ${a.file}...`, "download")}
                                className="mt-3 flex items-center gap-2 p-2 rounded-lg w-fit cursor-pointer hover:opacity-80 transition-all"
                                style={{ background: COLORS.surfaceContainer }}
                              >
                                <Icon name="picture_as_pdf" style={{ color: COLORS.primary }} />
                                <span className="text-xs font-medium">{a.file}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs whitespace-nowrap" style={{ color: COLORS.onSurfaceVariant }}>
                            {a.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === "documents" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {customer.documents.length === 0 && (
                    <div
                      className="md:col-span-2 flex flex-col items-center justify-center text-center py-20 rounded-xl bg-white"
                      style={{ border: `1px dashed ${COLORS.outlineVariant}`, color: COLORS.onSurfaceVariant }}
                    >
                      <Icon name="folder_open" className="!text-4xl mb-3" style={{ color: COLORS.outline }} />
                      <p className="font-semibold" style={{ color: COLORS.onSurface }}>
                        No documents uploaded
                      </p>
                    </div>
                  )}
                  {customer.documents.map((d, i) => (
                    <div
                      key={i}
                      onClick={() => addToast(`Downloading ${d.name}...`, "download")}
                      className="bg-white p-4 rounded-xl flex items-center justify-between group hover:border-current transition-all cursor-pointer"
                      style={{ border: `1px solid ${COLORS.outlineVariant}`, color: COLORS.primary }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: "rgba(1,44,126,0.05)" }}>
                          <Icon name={d.icon} style={{ color: COLORS.primary }} />
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: COLORS.onSurface }}>
                            {d.name}
                          </p>
                          <p className="text-xs" style={{ color: COLORS.onSurfaceVariant }}>
                            {d.meta}
                          </p>
                        </div>
                      </div>
                      <Icon name="download" style={{ color: COLORS.onSurfaceVariant }} />
                    </div>
                  ))}
                </div>
              )}

              {tab === "bookings" && (
                <div
                  className="flex flex-col items-center justify-center text-center py-24 rounded-xl bg-white"
                  style={{ border: `1px dashed ${COLORS.outlineVariant}`, color: COLORS.onSurfaceVariant }}
                >
                  <Icon name="book_online" className="!text-4xl mb-3" style={{ color: COLORS.outline }} />
                  <p className="font-semibold" style={{ color: COLORS.onSurface }}>
                    No bookings to show yet
                  </p>
                  <p className="text-sm mt-1">Bookings for {customer.name} will appear here.</p>
                </div>
              )}

              {tab === "payments" && (
                <div
                  className="flex flex-col items-center justify-center text-center py-24 rounded-xl bg-white"
                  style={{ border: `1px dashed ${COLORS.outlineVariant}`, color: COLORS.onSurfaceVariant }}
                >
                  <Icon name="receipt_long" className="!text-4xl mb-3" style={{ color: COLORS.outline }} />
                  <p className="font-semibold" style={{ color: COLORS.onSurface }}>
                    No payment records yet
                  </p>
                  <p className="text-sm mt-1">Payment history for {customer.name} will appear here.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 lg:col-span-4 space-y-6">
            {/* Personal Details */}
            <div className="bg-white p-6 rounded-2xl shadow-sm" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Personal Details
                </h3>
                <button onClick={() => setShowEdit(true)} className="text-sm font-bold flex items-center gap-1" style={{ color: COLORS.primary }}>
                  <Icon name="edit" className="!text-sm" /> Edit
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold" style={{ color: COLORS.onSurfaceVariant }}>
                    Phone Number
                  </span>
                  <span className="font-medium">{customer.phone}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold" style={{ color: COLORS.onSurfaceVariant }}>
                    Email Address
                  </span>
                  <span className="font-medium">{customer.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs uppercase font-bold" style={{ color: COLORS.onSurfaceVariant }}>
                    Current Address
                  </span>
                  <span className="font-medium">{customer.address}</span>
                </div>
                <div className="pt-4" style={{ borderTop: `1px solid ${COLORS.outlineVariant}` }}>
                  <span className="text-xs uppercase font-bold" style={{ color: COLORS.onSurfaceVariant }}>
                    Occupation
                  </span>
                  <p className="font-medium mt-1">{customer.occupation}</p>
                  <p className="text-sm" style={{ color: COLORS.onSurfaceVariant }}>
                    {customer.company}
                  </p>
                </div>
              </div>
            </div>

            {/* Nominee */}
            <div className="p-6 rounded-2xl" style={{ background: "rgba(1,44,126,0.05)", border: "1px solid rgba(1,44,126,0.1)" }}>
              <div className="flex items-center gap-3 mb-4">
                <Icon name="family_history" style={{ color: COLORS.primary }} />
                <h3 className="text-lg font-semibold" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Nominee Info
                </h3>
              </div>
              <div className="p-4 rounded-xl border border-white" style={{ background: "rgba(255,255,255,0.6)" }}>
                <p className="font-semibold">{customer.nominee.name}</p>
                <p className="text-sm" style={{ color: COLORS.onSurfaceVariant }}>
                  Relationship: {customer.nominee.relation}
                </p>
                {customer.nominee.verified && (
                  <div className="mt-2 flex items-center gap-2 text-xs font-bold" style={{ color: COLORS.primary }}>
                    <Icon name="verified" className="!text-xs" />
                    KYC VERIFIED
                  </div>
                )}
              </div>
            </div>

            {/* Agent */}
            <div className="bg-white p-6 rounded-2xl" style={{ border: `1px solid ${COLORS.outlineVariant}` }}>
              <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: COLORS.onSurfaceVariant }}>
                Assigned Agent
              </h3>
              <div className="flex items-center gap-4">
                <img className="w-12 h-12 rounded-full object-cover" src={customer.agent.avatar} alt={customer.agent.name} />
                <div>
                  <p className="font-bold">{customer.agent.name}</p>
                  <p className="text-xs" style={{ color: COLORS.onSurfaceVariant }}>
                    {customer.agent.title}
                  </p>
                </div>
                <button
                  onClick={() => addToast(`Opening chat with ${customer.agent.name}`, "chat")}
                  className="ml-auto w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(37,68,149,0.2)", color: COLORS.primaryContainer }}
                >
                  <Icon name="chat" className="!text-sm" />
                </button>
              </div>
            </div>
          </aside>
        </div>
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

/* ================================================================
   ROOT APP — switches between Database and Profile
================================================================= */
export default function RealtyOneCRM() {
  const [view, setView] = useState("database");
  const [customers, setCustomers] = useState(INITIAL_CUSTOMERS);
  const [selectedId, setSelectedId] = useState(INITIAL_CUSTOMERS[0].id);
  const [toasts, setToasts] = useState([]);
  const toastTimer = useRef(0);

  const addToast = (message, icon) => {
    const id = ++toastTimer.current;
    setToasts((prev) => [...prev, { id, message, icon }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  const selectedCustomer = customers.find((c) => c.id === selectedId) || customers[0];

  const updateCustomer = (id, updates) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const fontLinks = (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
      * { font-family: 'Inter', sans-serif; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: #f1f1f1; }
      ::-webkit-scrollbar-thumb { background: #c4c6d3; border-radius: 10px; }
      ::-webkit-scrollbar-thumb:hover { background: #747683; }
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