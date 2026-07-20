import { useEffect, useState } from "react";
import {
  Building,
  Wallet,
  Tag,
  BadgeCheck,
  MapPin,
  Check,
  RefreshCw,
  Clock,
  Wrench,
  FileText,
  BarChart3,
  History,
  Share2,
  ChevronRight,
  ArrowRight,
  ArrowLeft,
  Plus,
  Filter,
  Download
} from "lucide-react";

const c = {
  primary: "#012c7e",
  primaryContainer: "#254495",
  primaryFixed: "#dbe1ff",
  onPrimaryContainer: "#a0b6ff",
  secondary: "#1a53c8",
  secondaryContainer: "#3e6ee3",
  tertiaryContainer: "#793600",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  surface: "#faf8ff",
  surfaceContainerLow: "#f4f3fa",
  surfaceContainer: "#eeedf5",
  surfaceContainerHigh: "#e8e7ef",
  surfaceContainerHighest: "#e3e2e9",
  surfaceContainerLowest: "#ffffff",
  onSurface: "#1a1b21",
  onSurfaceVariant: "#444651",
  outlineVariant: "#c4c6d3",
  background: "#faf8ff",
};

const ledgers = {
  "The Atrium Plaza": {
    budget: 185000000,
    spent: 142800000,
    transactions: [
      { date: "2025-06-02", desc: "Site mobilization & clearing", category: "Construction", vendor: "Summit Grading Co.", ref: "PO-10421", amount: -1850000 },
      { date: "2025-06-18", desc: "Structural steel — Phase 1 delivery", category: "Materials", vendor: "Ironclad Steel Supply", ref: "PO-10433", amount: -6420000 },
      { date: "2025-07-05", desc: "Architectural design services Q2", category: "Professional Services", vendor: "Meridian Architecture Group", ref: "INV-2291", amount: -980000 },
      { date: "2025-07-22", desc: "Building permit — commercial tower", category: "Permits & Fees", vendor: "City Dept. of Buildings", ref: "PMT-5567", amount: -412000 },
      { date: "2025-08-10", desc: "Curtain wall glazing system", category: "Materials", vendor: "VistaGlass Facades", ref: "PO-10467", amount: -8930000 },
      { date: "2025-08-28", desc: "Pre-sale deposit — Unit 14B & 14C", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-3301", amount: 2450000 },
      { date: "2025-09-14", desc: "MEP subcontractor — Phase 1", category: "Construction", vendor: "Voltage & Flow Mechanical", ref: "PO-10488", amount: -5210000 },
      { date: "2025-10-01", desc: "Structural engineering review", category: "Professional Services", vendor: "Kessler Structural Partners", ref: "INV-2318", amount: -365000 },
      { date: "2025-10-19", desc: "Elevator & vertical transport install", category: "Construction", vendor: "Apex Vertical Systems", ref: "PO-10502", amount: -4780000 },
      { date: "2025-11-03", desc: "Pre-sale deposit — Unit 22A", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-3322", amount: 1180000 },
      { date: "2025-12-08", desc: "Concrete superstructure — Levels 8-14", category: "Construction", vendor: "Summit Grading Co.", ref: "PO-10531", amount: -11200000 },
      { date: "2026-01-15", desc: "Legal & title services", category: "Professional Services", vendor: "Hargrove & Wells LLP", ref: "INV-2354", amount: -215000 },
      { date: "2026-02-04", desc: "Pre-sale deposit — Unit 30A & 30B", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-3358", amount: 3120000 },
      { date: "2026-03-09", desc: "Fire & life safety systems", category: "Construction", vendor: "SafeGuard Systems Inc.", ref: "PO-10592", amount: -3670000 },
      { date: "2026-07-01", desc: "Quarterly project audit fee", category: "Professional Services", vendor: "Bramwell & Co. Auditors", ref: "INV-2402", amount: -95000 },
    ],
  },
  "Horizon Heights": {
    budget: 210000000,
    spent: 38200000,
    transactions: [
      { date: "2025-12-20", desc: "Land clearing & site prep", category: "Construction", vendor: "Northbay Earthworks", ref: "PO-20014", amount: -2100000 },
      { date: "2026-01-04", desc: "Zoning & land use permit", category: "Permits & Fees", vendor: "City Dept. of Buildings", ref: "PMT-6103", amount: -318000 },
      { date: "2026-01-18", desc: "Geotechnical & soils engineering", category: "Professional Services", vendor: "Bedrock Geo Consultants", ref: "INV-3011", amount: -245000 },
      { date: "2026-02-05", desc: "Foundation excavation", category: "Construction", vendor: "Northbay Earthworks", ref: "PO-20028", amount: -3480000 },
      { date: "2026-02-22", desc: "Rebar & foundation concrete", category: "Materials", vendor: "Marina Concrete Supply", ref: "PO-20041", amount: -5620000 },
      { date: "2026-03-10", desc: "Pre-sale deposit — Unit 3A", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-4102", amount: 890000 },
      { date: "2026-04-11", desc: "Crane mobilization & rental", category: "Construction", vendor: "SkyLift Crane Services", ref: "PO-20059", amount: -1940000 },
      { date: "2026-04-29", desc: "Structural steel — Phase 1", category: "Materials", vendor: "Ironclad Steel Supply", ref: "PO-20073", amount: -6180000 },
      { date: "2026-05-13", desc: "Pre-sale deposit — Units 5B & 5C", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-4128", amount: 1560000 },
      { date: "2026-07-01", desc: "Concrete superstructure — Levels 5-7", category: "Construction", vendor: "Marina Concrete Supply", ref: "PO-20108", amount: -6890000 },
    ],
  },
  "Oakwood Estates": {
    budget: 96000000,
    spent: 71400000,
    transactions: [
      { date: "2025-03-11", desc: "Land acquisition & closing costs", category: "Permits & Fees", vendor: "County Land Records Office", ref: "PMT-4402", amount: -1220000 },
      { date: "2025-03-29", desc: "Site clearing & grading", category: "Construction", vendor: "Oakwood Grading LLC", ref: "PO-30012", amount: -1640000 },
      { date: "2025-04-16", desc: "Civil engineering & site design", category: "Professional Services", vendor: "Hartley Civil Engineers", ref: "INV-4110", amount: -385000 },
      { date: "2025-05-04", desc: "Roadway & utility infrastructure", category: "Construction", vendor: "Oakwood Grading LLC", ref: "PO-30028", amount: -4870000 },
      { date: "2025-05-22", desc: "Framing lumber — Phase 1 lots", category: "Materials", vendor: "Cascade Timber Supply", ref: "PO-30041", amount: -3210000 },
      { date: "2025-06-09", desc: "Pre-sale deposit — Lot 4", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-5011", amount: 540000 },
      { date: "2025-06-27", desc: "Foundation & slab work — Phase 1", category: "Construction", vendor: "Bedford Concrete Co.", ref: "PO-30057", amount: -2980000 },
      { date: "2025-07-14", desc: "Building permits — 12 single-family units", category: "Permits & Fees", vendor: "County Dept. of Buildings", ref: "PMT-4438", amount: -196000 },
      { date: "2025-08-01", desc: "Pre-sale deposit — Lots 7 & 8", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-5034", amount: 1080000 },
      { date: "2025-08-19", desc: "Roofing & exterior materials", category: "Materials", vendor: "Cascade Timber Supply", ref: "PO-30073", amount: -2450000 },
      { date: "2025-09-06", desc: "Framing labor — Phase 1", category: "Construction", vendor: "Oakwood Grading LLC", ref: "PO-30089", amount: -3670000 },
      { date: "2025-10-02", desc: "Landscape architecture services", category: "Professional Services", vendor: "Fernbrook Landscape Design", ref: "INV-4155", amount: -212000 },
      { date: "2025-11-15", desc: "Pre-sale deposit — Lots 11 & 12", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-5061", amount: 1120000 },
      { date: "2026-01-08", desc: "Interior finishes — Phase 1 units", category: "Materials", vendor: "Cascade Timber Supply", ref: "PO-30104", amount: -3980000 },
      { date: "2026-03-20", desc: "HOA & community amenity buildout", category: "Construction", vendor: "Oakwood Grading LLC", ref: "PO-30126", amount: -2140000 },
      { date: "2026-06-11", desc: "Pre-sale deposit — Lots 15-17", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-5098", amount: 1650000 },
    ],
  },
  "Wellington Estate": {
    budget: 142000000,
    spent: 24600000,
    transactions: [
      { date: "2026-01-12", desc: "Land acquisition — Wellington parcel", category: "Permits & Fees", vendor: "County Land Records Office", ref: "PMT-7701", amount: -3850000 },
      { date: "2026-01-30", desc: "Topographic & boundary survey", category: "Professional Services", vendor: "Alden Surveying Group", ref: "INV-6002", amount: -164000 },
      { date: "2026-02-16", desc: "Master planning & architecture", category: "Professional Services", vendor: "Coastal Line Architecture", ref: "INV-6019", amount: -890000 },
      { date: "2026-03-05", desc: "Zoning variance & entitlement fees", category: "Permits & Fees", vendor: "City Dept. of Buildings", ref: "PMT-7724", amount: -276000 },
      { date: "2026-03-23", desc: "Site clearing & demolition", category: "Construction", vendor: "Wellington Earthmoving Co.", ref: "PO-40011", amount: -2340000 },
      { date: "2026-04-10", desc: "Geotechnical survey & soils report", category: "Professional Services", vendor: "Bedrock Geo Consultants", ref: "INV-6047", amount: -198000 },
      { date: "2026-04-28", desc: "Reservation deposit — Estate Lot 1", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-7010", amount: 720000 },
      { date: "2026-05-15", desc: "Excavation & foundation prep", category: "Construction", vendor: "Wellington Earthmoving Co.", ref: "PO-40029", amount: -4610000 },
      { date: "2026-06-02", desc: "Structural steel — gatehouse & clubhouse", category: "Materials", vendor: "Ironclad Steel Supply", ref: "PO-40044", amount: -3920000 },
      { date: "2026-06-20", desc: "Reservation deposit — Estate Lots 3 & 4", category: "Revenue", vendor: "Buyer Escrow Account", ref: "REV-7033", amount: 1450000 },
      { date: "2026-07-07", desc: "Perimeter & security infrastructure", category: "Construction", vendor: "Wellington Earthmoving Co.", ref: "PO-40058", amount: -2680000 },
      { date: "2026-07-11", desc: "Legal & entitlement counsel", category: "Professional Services", vendor: "Hargrove & Wells LLP", ref: "INV-6082", amount: -140000 },
    ],
  },
};

function fmt(n) {
  return (n < 0 ? "-$" : "$") + Math.abs(n).toLocaleString("en-US");
}

const LedgerPage = ({ projectName, onBack }) => {
  const ledger = ledgers[projectName];
  const sorted = [...ledger.transactions].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
  const rows = sorted.reduce((acc, t) => {
    const previousBalance = acc.length ? acc[acc.length - 1].balance : 0;
    acc.push({ ...t, balance: previousBalance + t.amount });
    return acc;
  }, []);

  return (
    <div className="min-h-screen w-full bg-white" style={{ color: c.onSurface, fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-5xl mx-auto p-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-semibold mb-4 hover:underline"
          style={{ color: c.primary }}
        >
          <ArrowLeft size={16} />
          Back to Projects
        </button>

        <h1 className="text-xl font-bold mb-1">Full Project Ledger</h1>
        <p className="text-sm mb-4" style={{ color: c.onSurfaceVariant }}>{projectName}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-sm">
          <div className="border rounded p-3" style={{ borderColor: c.outlineVariant }}>
            <div style={{ color: c.onSurfaceVariant }}>Total Budget</div>
            <div className="font-bold">{fmt(ledger.budget)}</div>
          </div>
          <div className="border rounded p-3" style={{ borderColor: c.outlineVariant }}>
            <div style={{ color: c.onSurfaceVariant }}>Total Spent</div>
            <div className="font-bold">{fmt(ledger.spent)}</div>
          </div>
          <div className="border rounded p-3" style={{ borderColor: c.outlineVariant }}>
            <div style={{ color: c.onSurfaceVariant }}>Remaining</div>
            <div className="font-bold">{fmt(ledger.budget - ledger.spent)}</div>
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm border-collapse">
            <thead>
              <tr className="border-b text-left" style={{ borderColor: c.outlineVariant, color: c.onSurfaceVariant }}>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2 pr-3">Category</th>
                <th className="py-2 pr-3">Vendor</th>
                <th className="py-2 pr-3">Ref #</th>
                <th className="py-2 pr-3 text-right">Amount</th>
                <th className="py-2 pr-3 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              {rows
                .slice()
                .reverse()
                .map((t, i) => (
                  <tr key={i} className="border-b" style={{ borderColor: c.surfaceContainer }}>
                    <td className="py-2 pr-3 whitespace-nowrap">{t.date}</td>
                    <td className="py-2 pr-3">{t.desc}</td>
                    <td className="py-2 pr-3">{t.category}</td>
                    <td className="py-2 pr-3">{t.vendor}</td>
                    <td className="py-2 pr-3" style={{ color: c.onSurfaceVariant }}>{t.ref}</td>
                    <td
                      className="py-2 pr-3 text-right"
                      style={{ color: t.amount < 0 ? c.onSurface : "#16a34a" }}
                    >
                      {fmt(t.amount)}
                    </td>
                    <td className="py-2 pr-3 text-right" style={{ color: c.onSurfaceVariant }}>
                      {fmt(t.balance)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------
   Small Helper Components
--------------------------------------------------------- */
const MetricCard = ({ icon: Icon, iconBg, iconColor, tag, tagBg, tagColor, label, value }) => (
  <div
    className="p-4 rounded-[14px] border"
    style={{
      background: "rgba(255,255,255,0.8)",
      backdropFilter: "blur(12px)",
      borderColor: "#E5E7EB",
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
    }}
  >
    <div className="flex justify-between items-start mb-2">
      <span
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: iconBg, color: iconColor }}
      >
        <Icon size={20} />
      </span>
      <span
        className="text-xs font-bold px-2 py-1 rounded-full"
        style={{ background: tagBg, color: tagColor }}
      >
        {tag}
      </span>
    </div>
    <p className="text-[13px] font-semibold tracking-wide" style={{ color: c.onSurfaceVariant }}>
      {label}
    </p>
    <h3 className="text-2xl font-bold mt-1" style={{ color: c.onSurface }}>
      {value}
    </h3>
  </div>
);

const HubButton = ({ icon: Icon, label }) => (
  <button className="w-full flex items-center justify-between p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-all border border-white/5 group">
    <div className="flex items-center gap-3">
      <Icon size={18} className="text-white" />
      <span className="text-sm font-bold text-white">{label}</span>
    </div>
    <ChevronRight
      size={16}
      className="text-white/50 group-hover:translate-x-1 transition-transform"
    />
  </button>
);

const TimelineRow = ({ name, trackBg, trackFillBg, labelWidth, statusLabel, dateLabel, delta, deltaColor }) => (
  <div className="flex items-center gap-4">
    <div className="w-32 text-sm font-bold truncate" style={{ color: c.onSurfaceVariant }}>
      {name}
    </div>
    <div
      className="flex-1 relative h-6 rounded-lg overflow-hidden"
      style={{ background: c.surfaceContainer }}
    >
      <div className="absolute left-0 h-full" style={{ width: trackBg, background: trackFillBg + "33" }} />
      <div
        className="absolute left-0 h-full flex items-center px-3 text-[10px] font-bold text-white whitespace-nowrap"
        style={{ width: labelWidth, background: trackFillBg }}
      >
        {statusLabel}
      </div>
      <div
        className="absolute right-0 h-full flex items-center px-3 text-[10px] font-bold"
        style={{ color: c.onSurfaceVariant }}
      >
        {dateLabel}
      </div>
    </div>
    <div className="w-12 text-right text-xs font-bold" style={{ color: deltaColor }}>
      {delta}
    </div>
  </div>
);

const MilestoneStep = ({ status, label, sub, accent }) => {
  if (status === "done") {
    return (
      <div className="flex items-center gap-3">
        <span className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
          <Check size={14} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          <p className="text-[11px]" style={{ color: c.onSurfaceVariant }}>
            {sub}
          </p>
        </div>
      </div>
    );
  }
  if (status === "active") {
    return (
      <div className="flex items-center gap-3">
        <span
          className="w-6 h-6 rounded-full text-white flex items-center justify-center shrink-0 animate-pulse"
          style={{ background: accent }}
        >
          <RefreshCw size={13} />
        </span>
        <div className="flex-1">
          <p className="text-sm font-medium">{label}</p>
          <div className="w-full h-1 rounded-full mt-1" style={{ background: c.surfaceContainer }}>
            <div className="h-full rounded-full" style={{ width: sub, background: accent }} />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center gap-3 opacity-50">
      <span
        className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0"
        style={{ borderColor: c.outlineVariant, color: c.onSurfaceVariant }}
      >
        <Clock size={13} />
      </span>
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

const StatBox = ({ label, value, sub, subColor }) => (
  <div
    className="p-3 rounded-xl border"
    style={{ background: c.surface, borderColor: c.outlineVariant + "4d" }}
  >
    <p className="text-[10px] uppercase font-bold tracking-wider mb-1" style={{ color: c.onSurfaceVariant }}>
      {label}
    </p>
    <p className="text-xl font-bold" style={{ color: c.onSurface }}>
      {value}
    </p>
    <p className="text-[11px] mt-1" style={{ color: subColor }}>
      {sub}
    </p>
  </div>
);

/* ---------------------------------------------------------
   Project Card Component
--------------------------------------------------------- */
const ProjectCard = ({
  imageUrl, badgeLabel, badgeColor, title, location, completion, milestonePercent, accent, steps,
  budgetSpent, budgetTotal, budgetVarianceLabel, budgetVarianceColor, budgetFillPercent, budgetOverPercent,
  inventoryValue, inventorySub, inventorySubColor, yieldValue, yieldSub, yieldSubColor, avatars, onOpenLedger,
}) => (
  <div
    className="rounded-[14px] border overflow-hidden group bg-white"
    style={{
      borderColor: c.outlineVariant,
      boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
    }}
  >
    {/* Image Header */}
    <div className="relative h-56 overflow-hidden">
      <div
        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
        style={{ backgroundImage: `url('${imageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
        <div>
          <span
            className="inline-block px-2 py-1 text-white text-[10px] font-bold rounded uppercase tracking-wider mb-2"
            style={{ background: badgeColor }}
          >
            {badgeLabel}
          </span>
          <h3 className="text-white text-2xl font-semibold">{title}</h3>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin size={14} />
            {location}
          </p>
        </div>
        <div className="text-right">
          <p className="text-white/60 uppercase tracking-widest text-[10px]">Est. Completion</p>
          <p className="text-white font-bold">{completion}</p>
        </div>
      </div>
    </div>

    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Progress & Milestones */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-[13px] font-bold uppercase tracking-wide" style={{ color: c.onSurface }}>
            Construction Milestone
          </h4>
          <span className="font-bold text-sm" style={{ color: accent }}>
            {milestonePercent}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden mb-6" style={{ background: c.surfaceContainer }}>
          <div className="h-full rounded-full" style={{ width: `${milestonePercent}%`, background: accent }} />
        </div>
        <div className="space-y-4">
          {steps.map((s, i) => (
            <MilestoneStep key={i} {...s} accent={accent} />
          ))}
        </div>
      </div>

      {/* Financials & Inventory */}
      <div className="space-y-6">
        <div>
          <h4 className="text-[11px] uppercase tracking-widest font-bold mb-3" style={{ color: c.onSurfaceVariant }}>
            Budget Allocation
          </h4>
          <div className="flex justify-between items-end mb-1">
            <span className="text-sm font-bold" style={{ color: c.onSurface }}>
              {budgetSpent}{" "}
              <span className="text-[11px] font-normal" style={{ color: c.onSurfaceVariant }}>
                / {budgetTotal}
              </span>
            </span>
            <span className="text-[11px] font-bold" style={{ color: budgetVarianceColor }}>
              {budgetVarianceLabel}
            </span>
          </div>
          <div
            className="relative h-1.5 w-full rounded-full overflow-hidden"
            style={{ background: c.surfaceContainerHighest }}
          >
            <div
              className="absolute h-full rounded-full z-10"
              style={{ width: `${budgetFillPercent}%`, background: accent }}
            />
            {budgetOverPercent && (
              <div
                className="absolute h-full z-[5]"
                style={{
                  left: `${budgetFillPercent}%`,
                  width: `${budgetOverPercent}%`,
                  background: c.error + "66",
                }}
              />
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <StatBox label="Inventory" value={inventoryValue} sub={inventorySub} subColor={inventorySubColor} />
          <StatBox label="Yield Projection" value={yieldValue} sub={yieldSub} subColor={yieldSubColor} />
        </div>
      </div>
    </div>

    {/* Footer Area */}
    <div
      className="px-6 py-4 border-t flex justify-between items-center"
      style={{ borderColor: c.outlineVariant, background: c.surfaceContainerLowest }}
    >
      <div className="flex -space-x-2">
        {avatars.map((a, i) => (
          <img
            key={i}
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
            src={a}
            alt="Team Member"
          />
        ))}
        <div
          className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold"
          style={{ background: c.surfaceContainerHighest }}
        >
          +12
        </div>
      </div>
      <button
        onClick={onOpenLedger}
        className="font-bold text-sm hover:underline flex items-center gap-1"
        style={{ color: c.primary }}
      >
        Full Project Ledger
        <ArrowRight size={14} />
      </button>
    </div>
  </div>
);

/* ---------------------------------------------------------
   Main Page Component (Projects) - Navbar Removed!
--------------------------------------------------------- */
export default function Projects() {
  const [view, setView] = useState("projects"); // "projects" | "ledger"
  const [activeProject, setActiveProject] = useState(null);

  // Load Google Fonts
  useEffect(() => {
    const id = "realtyone-fonts";
    if (!document.getElementById(id)) {
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  const bodyFont = { fontFamily: "'Inter', sans-serif" };
  const displayFont = { fontFamily: "'Plus Jakarta Sans', sans-serif" };

  const openLedger = (projectName) => {
    setActiveProject(projectName);
    setView("ledger");
  };

  if (view === "ledger" && activeProject) {
    return (
      <LedgerPage
        projectName={activeProject}
        onBack={() => setView("projects")}
      />
    );
  }

  return (
    <div className="min-h-screen w-full" style={{ background: c.background, color: c.onSurface, ...bodyFont }}>
      
      {/* MAIN CONTENT AREA */}
      <main className="p-6 max-w-[1600px] mx-auto w-full">
        
        {/* Dashboard Header */}
        <div className="mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <p className="font-bold text-[13px] tracking-widest uppercase mb-1" style={{ color: c.primary }}>
              Ecosystem Overview
            </p>
            <h2 className="text-4xl font-bold" style={{ ...displayFont, color: c.onSurface }}>
              Construction Portfolio
            </h2>
          </div>
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-xl text-[13px] font-semibold hover:bg-black/5 transition-colors whitespace-nowrap"
              style={{ borderColor: c.outlineVariant }}
            >
              <Filter size={16} />
              Filter
            </button>
            <button
              className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white border rounded-xl text-[13px] font-semibold hover:bg-black/5 transition-colors whitespace-nowrap"
              style={{ borderColor: c.outlineVariant }}
            >
              <Download size={16} />
              Export Report
            </button>
          </div>
        </div>

        {/* Key Metrics Bento */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={Building}
            iconBg={c.primary + "1a"}
            iconColor={c.primary}
            tag="+2 Active"
            tagBg="#f0fdf4"
            tagColor="#16a34a"
            label="Total Projects"
            value="12"
          />
          <MetricCard
            icon={Wallet}
            iconBg={c.secondary + "1a"}
            iconColor={c.secondary}
            tag="Monthly Burn"
            tagBg="transparent"
            tagColor={c.onSurfaceVariant}
            label="Portfolio Budget"
            value="$428.5M"
          />
          <MetricCard
            icon={Tag}
            iconBg={c.tertiaryContainer + "33"}
            iconColor={c.tertiaryContainer}
            tag="-3.4% Low"
            tagBg={c.errorContainer + "4d"}
            tagColor={c.error}
            label="Unit Availability"
            value="18.5%"
          />
          <MetricCard
            icon={BadgeCheck}
            iconBg="#dcfce7"
            iconColor="#15803d"
            tag="On Schedule"
            tagBg="transparent"
            tagColor={c.onSurfaceVariant}
            label="Avg. Project Velocity"
            value="94%"
          />
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <ProjectCard
            imageUrl="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
            badgeLabel="Commercial / Mix-Use"
            badgeColor={c.primary}
            title="The Atrium Plaza"
            location="Downtown Financial District, Sector 4"
            completion="Oct 2025"
            milestonePercent={68}
            accent={c.primary}
            steps={[
              { status: "done", label: "Foundation & Substructure", sub: "Completed on Mar 12" },
              { status: "active", label: "External Facade Installation", sub: "45%" },
              { status: "pending", label: "Interior Fit-out" },
            ]}
            budgetSpent="$142.8M"
            budgetTotal="$185M"
            budgetVarianceLabel="-2.4% Under Budget"
            budgetVarianceColor="#16a34a"
            budgetFillPercent={77}
            inventoryValue="84 / 112 Units"
            inventorySub="75% Pre-sold"
            inventorySubColor="#16a34a"
            yieldValue="12.4%"
            yieldSub="Target 11.5%"
            yieldSubColor={c.primary}
            avatars={[
              "https://i.pravatar.cc/100?img=11",
              "https://i.pravatar.cc/100?img=12",
            ]}
            onOpenLedger={() => openLedger("The Atrium Plaza")}
          />

          <ProjectCard
            imageUrl="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=2000&auto=format&fit=crop"
            badgeLabel="Residential / Luxury"
            badgeColor={c.tertiaryContainer}
            title="Horizon Heights"
            location="North Bay Marina District"
            completion="Jan 2026"
            milestonePercent={32}
            accent={c.secondary}
            steps={[
              { status: "done", label: "Permitting & Land Clearing", sub: "Completed on Dec 20" },
              { status: "active", label: "Structural Superstructure", sub: "15%" },
              { status: "pending", label: "MEP Rough-in" },
            ]}
            budgetSpent="$38.2M"
            budgetTotal="$210M"
            budgetVarianceLabel="+5.8% Variance"
            budgetVarianceColor={c.error}
            budgetFillPercent={18}
            budgetOverPercent={5}
            inventoryValue="112 / 240 Units"
            inventorySub="46% Pre-sold"
            inventorySubColor={c.primary}
            yieldValue="18.2%"
            yieldSub="Market Surge"
            yieldSubColor="#16a34a"
            avatars={[
              "https://i.pravatar.cc/100?img=33",
              "https://i.pravatar.cc/100?img=47",
            ]}
            onOpenLedger={() => openLedger("Horizon Heights")}
          />

          <ProjectCard
            imageUrl="https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop"
            badgeLabel="Residential / Single-Family"
            badgeColor={c.secondaryContainer}
            title="Oakwood Estates"
            location="Oakwood Township, Lakeview Corridor"
            completion="May 2026"
            milestonePercent={74}
            accent={c.secondaryContainer}
            steps={[
              { status: "done", label: "Roads & Utility Infrastructure", sub: "Completed on Aug 19" },
              { status: "active", label: "Phase 1 Home Construction", sub: "60%" },
              { status: "pending", label: "Landscaping & Amenities" },
            ]}
            budgetSpent="$71.4M"
            budgetTotal="$96M"
            budgetVarianceLabel="-1.1% Under Budget"
            budgetVarianceColor="#16a34a"
            budgetFillPercent={74}
            inventoryValue="17 / 24 Lots"
            inventorySub="71% Pre-sold"
            inventorySubColor="#16a34a"
            yieldValue="10.8%"
            yieldSub="Target 10.0%"
            yieldSubColor={c.secondaryContainer}
            avatars={[
              "https://i.pravatar.cc/100?img=15",
              "https://i.pravatar.cc/100?img=25",
            ]}
            onOpenLedger={() => openLedger("Oakwood Estates")}
          />

          <ProjectCard
            imageUrl="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
            badgeLabel="Residential / Luxury Estate"
            badgeColor={c.tertiaryContainer}
            title="Wellington Estate"
            location="Wellington Hills, Private Enclave"
            completion="Apr 2027"
            milestonePercent={17}
            accent={c.error}
            steps={[
              { status: "done", label: "Land Acquisition & Entitlements", sub: "Completed on Mar 5" },
              { status: "active", label: "Site Prep & Foundation", sub: "20%" },
              { status: "pending", label: "Gatehouse & Clubhouse Build" },
            ]}
            budgetSpent="$24.6M"
            budgetTotal="$142M"
            budgetVarianceLabel="On Budget"
            budgetVarianceColor="#16a34a"
            budgetFillPercent={17}
            inventoryValue="4 / 18 Lots"
            inventorySub="22% Reserved"
            inventorySubColor={c.primary}
            yieldValue="21.5%"
            yieldSub="Ultra-Luxury Tier"
            yieldSubColor="#16a34a"
            avatars={[
              "https://i.pravatar.cc/100?img=52",
              "https://i.pravatar.cc/100?img=60",
            ]}
            onOpenLedger={() => openLedger("Wellington Estate")}
          />
        </div>

        {/* Secondary Section: Risk and Resource Overview */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 pb-12">
          {/* Critical Path / Delays */}
          <div
            className="lg:col-span-2 bg-white rounded-[14px] border p-6"
            style={{
              borderColor: c.outlineVariant,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
              <h3 className="text-xl font-semibold" style={{ ...displayFont, color: c.onSurface }}>
                Project Timeline Variance
              </h3>
              <div className="flex gap-2">
                <button
                  className="flex-1 sm:flex-none px-3 py-1 text-[13px] rounded-lg font-bold whitespace-nowrap"
                  style={{ background: c.surfaceContainerLow, color: c.primary }}
                >
                  All Active
                </button>
                <button
                  className="flex-1 sm:flex-none px-3 py-1 text-[13px] rounded-lg font-medium hover:bg-black/5 whitespace-nowrap"
                  style={{ color: c.onSurfaceVariant }}
                >
                  At Risk
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <TimelineRow
                name="Atrium Plaza"
                trackBg="60%"
                trackFillBg={c.primary}
                labelWidth="45%"
                statusLabel="On Schedule"
                dateLabel="Oct '25"
                delta="0d"
                deltaColor="#16a34a"
              />
              <TimelineRow
                name="Horizon Heights"
                trackBg="30%"
                trackFillBg={c.secondary}
                labelWidth="25%"
                statusLabel="On Schedule"
                dateLabel="Jan '26"
                delta="0d"
                deltaColor="#16a34a"
              />
              <TimelineRow
                name="Skyline Lofts"
                trackBg="85%"
                trackFillBg={c.error}
                labelWidth="80%"
                statusLabel="Material Shortage"
                dateLabel="Jun '24"
                delta="+14d"
                deltaColor={c.error}
              />
              <TimelineRow
                name="The Grand Mall"
                trackBg="15%"
                trackFillBg={c.tertiaryContainer}
                labelWidth="12%"
                statusLabel="Early Phase"
                dateLabel="Dec '26"
                delta="-4d"
                deltaColor="#16a34a"
              />
              <TimelineRow
                name="Oakwood Estates"
                trackBg="74%"
                trackFillBg={c.secondaryContainer}
                labelWidth="60%"
                statusLabel="On Schedule"
                dateLabel="May '26"
                delta="0d"
                deltaColor="#16a34a"
              />
              <TimelineRow
                name="Wellington Estate"
                trackBg="17%"
                trackFillBg={c.error}
                labelWidth="14%"
                statusLabel="Early Phase"
                dateLabel="Apr '27"
                delta="0d"
                deltaColor="#16a34a"
              />
            </div>

            <div className="mt-8 flex gap-6 items-center border-t pt-6" style={{ borderColor: c.outlineVariant }}>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded" style={{ background: c.primary }} />
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: c.onSurfaceVariant }}>
                  Commercial
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded" style={{ background: c.secondary }} />
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: c.onSurfaceVariant }}>
                  Residential
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded" style={{ background: c.error }} />
                <span className="text-[11px] font-medium uppercase tracking-wider" style={{ color: c.onSurfaceVariant }}>
                  Critical Risk
                </span>
              </div>
            </div>
          </div>

          {/* Resource Hub / Quick Actions */}
          <div
            className="rounded-[14px] p-6 flex flex-col text-white"
            style={{
              background: c.primaryContainer,
              boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)",
            }}
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-semibold text-white" style={displayFont}>
                Management Hub
              </h3>
              <Share2 size={20} className="text-white/50" />
            </div>

            <div className="space-y-3 flex-1">
              <HubButton icon={Wrench} label="Vendor Directory" />
              <HubButton icon={FileText} label="Permit Tracking" />
              <HubButton icon={BarChart3} label="Financial Audits" />
              <HubButton icon={History} label="Change Order Log" />
            </div>

            <div className="mt-8 p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-[11px] uppercase tracking-widest text-white/60 font-bold mb-3">
                AI Intelligence Task
              </p>
              <p className="text-xs text-white/90 leading-relaxed mb-4">
                "Horizon Heights structural concrete costs are trending 5.2% above baseline. Recommend
                reviewing vendor contracts."
              </p>
              <button
                className="w-full py-2 bg-white rounded-lg text-[13px] font-bold hover:bg-[#dbe1ff] transition-colors"
                style={{ color: c.primary }}
              >
                Apply Strategy
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button (FAB) */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50"
        style={{ background: c.primary }}
      >
        <Plus size={24} />
        <span className="absolute right-16 bg-[#1a1b21] text-white text-[10px] font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg pointer-events-none">
          Launch New Project
        </span>
      </button>
    </div>
  );
}