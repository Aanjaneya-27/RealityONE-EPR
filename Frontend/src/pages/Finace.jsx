import { useMemo, useState } from "react";
import {
  Download,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calculator,
  RefreshCw,
  X,
  ChevronRight,
  ChevronLeft,
  MoreVertical,
  BellRing,
  ReceiptText,
  CalendarDays,
  UserRound,
  ArrowDownToLine,
  CircleDollarSign,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

const INSTALLMENTS = [
  { id: 1, label: "Instalment 01", due: "Nov 15, 2023", amount: 64000, status: "paid", ref: "TXN_98210398" },
  { id: 2, label: "Instalment 02", due: "Dec 15, 2023", amount: 64000, status: "overdue", ref: null },
  { id: 3, label: "Instalment 03", due: "Jan 15, 2024", amount: 64000, status: "upcoming", ref: null },
  { id: 4, label: "Instalment 04", due: "Feb 15, 2024", amount: 64000, status: "upcoming", ref: null },
  { id: 5, label: "Instalment 05", due: "Mar 15, 2024", amount: 64000, status: "upcoming", ref: null },
  { id: 6, label: "Instalment 06", due: "Apr 15, 2024", amount: 64000, status: "upcoming", ref: null },
];

const TRANSACTIONS = [
  { month: "JAN", day: "12", label: "PAYMENT RECEIVED", amount: "$12,000.00", note: "Cheque #209318 · Processed", tone: "primary" },
  { month: "DEC", day: "28", label: "AUTO-DEBIT FAILED", amount: "$64,000.00", note: "Insufficient funds · ACH rejected", tone: "danger" },
  { month: "NOV", day: "16", label: "MORTGAGE RELEASE", amount: "$350,000.00", note: "External loan credit · Wells Fargo", tone: "gold" },
];

const STATUS_STYLE = {
  paid: { label: "Paid", icon: CheckCircle2, cls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  overdue: { label: "Overdue", icon: AlertTriangle, cls: "bg-rose-50 text-rose-700 border-rose-200" },
  upcoming: { label: "Upcoming", icon: Clock, cls: "bg-slate-100 text-slate-500 border-slate-200" },
};

const fmt = (n) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });

/* ------------------------------------------------------------------ */
/*  Small building blocks                                              */
/* ------------------------------------------------------------------ */

function CollectionRing({ percent, size = 128, stroke = 11 }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;
  return (
    <svg width={size} height={size} className="-rotate-90 shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="#D4AF61"
        strokeWidth={stroke}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 900ms cubic-bezier(.4,0,.2,1)" }}
      />
    </svg>
  );
}

function Pill({ status }) {
  const s = STATUS_STYLE[status];
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${s.cls}`}>
      <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                                 */
/* ------------------------------------------------------------------ */

export default function App() {
  const [tab, setTab] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [amountInput, setAmountInput] = useState("6400.00");
  const [dateInput, setDateInput] = useState("");
  const [modeInput, setModeInput] = useState("ACH / Wire Transfer");
  const [noteInput, setNoteInput] = useState("");
  const [confirmedMsg, setConfirmedMsg] = useState("");

  const [outstanding, setOutstanding] = useState(64000);
  const [rate, setRate] = useState(18);
  const [days, setDays] = useState(42);

  const agreementValue = 1240000;
  const paidToDate = 768800;
  const balanceDue = 471200;
  const overdueAmount = 24500;
  const percentCollected = Math.round((paidToDate / agreementValue) * 100);

  const filteredInstallments = useMemo(() => {
    if (tab === "all") return INSTALLMENTS;
    return INSTALLMENTS.filter((i) => i.status === tab);
  }, [tab]);

  const accruedInterest = useMemo(() => (outstanding * (rate / 100) * (days / 365)), [outstanding, rate, days]);
  const fixedPenalty = 500;
  const totalAdjustment = accruedInterest + fixedPenalty;

  const handleConfirmPayment = (e) => {
    e.preventDefault();
    setConfirmedMsg(`Payment of $${amountInput || "0.00"} recorded successfully.`);
    setModalOpen(false);
    setTimeout(() => setConfirmedMsg(""), 3500);
  };

  return (
    <div
      className="min-h-screen w-full text-[#12172B]"
      style={{
        fontFamily: "'Inter', ui-sans-serif, system-ui, sans-serif",
        background:
          "radial-gradient(1200px 500px at 100% -10%, #EEF1FB 0%, transparent 60%), radial-gradient(900px 500px at -10% 10%, #FBF3E4 0%, transparent 55%), #F6F7FB",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif; }
        .tnum { font-variant-numeric: tabular-nums; }
        .ledger-scroll::-webkit-scrollbar { height: 6px; width: 6px; }
        .ledger-scroll::-webkit-scrollbar-thumb { background: #E2E4EE; border-radius: 999px; }
        @keyframes riseIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: translateY(0);} }
        .rise-in { animation: riseIn .45s ease both; }
      `}</style>

      <main className="max-w-[1400px] mx-auto px-6 md:px-10 py-10">
        {/* success toast */}
        {confirmedMsg && (
          <div className="mb-6 rise-in flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-4 py-3 rounded-xl">
            <CheckCircle2 className="w-4 h-4" /> {confirmedMsg}
          </div>
        )}

        {/* Ledger header */}
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <nav className="flex items-center gap-1.5 text-slate-400 text-[11px] uppercase tracking-[0.15em] font-bold mb-2.5">
              <span>Finance</span>
              <ChevronRight className="w-3 h-3" />
              <span>Ledgers</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-[#3D4BA8]">BK-2024-08921</span>
            </nav>
            <h1 className="font-display font-extrabold text-[26px] md:text-[30px] tracking-tight text-[#12172B]">
              Unit 402 · Azure Heights
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-2.5">
              <span className="inline-flex items-center gap-1.5 bg-[#EFF1FB] text-[#3D4BA8] px-2.5 py-1 rounded-lg text-xs font-bold">
                <UserRound className="w-3.5 h-3.5" /> Jonathan Wickens
              </span>
              <span className="text-slate-400 text-xs flex items-center gap-1.5 font-medium">
                <CalendarDays className="w-3.5 h-3.5" /> Agreement dated Oct 12, 2023
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="bg-white border border-slate-200 text-[#12172B] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
              <Download className="w-4 h-4" /> Statement
            </button>
            <button
              onClick={() => setModalOpen(true)}
              className="bg-[#3D4BA8] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-[#3D4BA8]/25 hover:shadow-[#3D4BA8]/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <CircleDollarSign className="w-4 h-4" /> Record Payment
            </button>
          </div>
        </div>

        {/* Signature summary: ledger banner + overdue callout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          <div className="lg:col-span-7 relative overflow-hidden rounded-2xl bg-[#12172B] text-white p-7 flex flex-col sm:flex-row items-center gap-8">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />
            <div className="relative shrink-0 grid place-items-center">
              <CollectionRing percent={percentCollected} />
              <div className="absolute text-center">
                <p className="font-display font-extrabold text-2xl leading-none">{percentCollected}%</p>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Collected</p>
              </div>
            </div>
            <div className="relative flex-1 grid grid-cols-2 gap-x-6 gap-y-5 w-full">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Agreement Value</p>
                <p className="font-display font-bold text-lg tnum">{fmt(agreementValue)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Paid To Date</p>
                <p className="font-display font-bold text-lg tnum text-[#D4AF61]">{fmt(paidToDate)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Outstanding Balance</p>
                <p className="font-display font-bold text-lg tnum">{fmt(balanceDue)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1.5">Next Due</p>
                <p className="font-display font-bold text-lg">Dec 15, 2023</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-rose-50 border border-rose-200/80 p-7 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-xl bg-rose-100 text-rose-600 grid place-items-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <span className="text-[10px] uppercase tracking-widest font-bold text-rose-500">Action Required</span>
            </div>
            <div className="mt-5">
              <p className="text-rose-700/70 text-sm font-semibold">Overdue Amount</p>
              <p className="font-display font-extrabold text-3xl tnum text-rose-700 mt-1">{fmt(overdueAmount)}</p>
              <p className="text-rose-700/60 text-xs mt-1.5">Instalment 02 · 26 days past due</p>
            </div>
            <button className="mt-5 w-full bg-rose-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-rose-700 transition-colors flex items-center justify-center gap-2">
              <BellRing className="w-4 h-4" /> Send Payment Reminder
            </button>
          </div>
        </div>

        {/* Main grid: table + tools */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* EMI schedule */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/50 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-2.5">
                <h2 className="font-display font-bold text-lg text-[#12172B]">EMI Payment Schedule</h2>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[11px] font-bold">
                  12 Instalments
                </span>
              </div>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-[12px] font-bold">
                {["all", "upcoming", "paid", "overdue"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1.5 capitalize transition-colors ${
                      tab === t ? "bg-[#12172B] text-white" : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto ledger-scroll">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50/80">
                    {["Instal. #", "Due Date", "Amount Due", "Status", "Bank Ref", ""].map((h, i) => (
                      <th
                        key={h + i}
                        className={`px-6 py-3.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 ${
                          i === 2 ? "text-right" : i === 3 ? "text-center" : ""
                        }`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInstallments.map((row) => (
                    <tr
                      key={row.id}
                      className={`group transition-colors ${
                        row.status === "overdue" ? "bg-rose-50/40 hover:bg-rose-50" : "hover:bg-slate-50/70"
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-[#12172B]">{row.label}</td>
                      <td
                        className={`px-6 py-4 text-sm ${
                          row.status === "overdue" ? "text-rose-600 font-bold" : "text-slate-500"
                        }`}
                      >
                        {row.due}
                      </td>
                      <td
                        className={`px-6 py-4 text-sm font-bold text-right tnum ${
                          row.status === "overdue" ? "text-rose-600" : "text-[#12172B]"
                        }`}
                      >
                        {fmt(row.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Pill status={row.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">{row.ref || "—"}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          className={`p-2 rounded-full transition-all ${
                            row.status === "overdue"
                              ? "bg-rose-100 text-rose-600 hover:bg-rose-200"
                              : "opacity-0 group-hover:opacity-100 hover:bg-slate-100 text-slate-500"
                          }`}
                        >
                          {row.status === "overdue" ? (
                            <BellRing className="w-4 h-4" />
                          ) : row.status === "paid" ? (
                            <ReceiptText className="w-4 h-4" />
                          ) : (
                            <MoreVertical className="w-4 h-4" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInstallments.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm">
                        No instalments in this view.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex justify-between items-center">
              <p className="text-slate-400 text-xs">Showing {filteredInstallments.length} of 12 records</p>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-lg hover:bg-slate-200/60 disabled:opacity-30 text-slate-500" disabled>
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-500">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar tools */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Penalty calculator */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm shadow-slate-200/50 p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-lg text-[#12172B]">Penalty Calculator</h3>
                <Calculator className="w-5 h-5 text-[#3D4BA8]" />
              </div>

              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Outstanding Amount</label>
              <div className="relative mb-4">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">$</span>
                <input
                  type="number"
                  value={outstanding}
                  onChange={(e) => setOutstanding(Number(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8] outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Rate (p.a.)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm">%</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1.5">Days Delayed</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Accrued Interest</span>
                  <span className="text-sm font-bold text-rose-600 tnum">{fmt(accruedInterest)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Fixed Penalty</span>
                  <span className="text-sm font-bold text-rose-600 tnum">{fmt(fixedPenalty)}</span>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-100">
                  <span className="font-bold text-[#12172B] text-sm">Total Adjustment</span>
                  <span className="font-extrabold text-rose-600 text-lg tnum">{fmt(totalAdjustment)}</span>
                </div>
              </div>

              <button className="w-full mt-5 bg-slate-100 text-[#12172B] px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
                Apply to Ledger
              </button>
            </div>

            {/* Banking sync */}
            <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: "linear-gradient(145deg, #3D4BA8, #232E77)" }}>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-full bg-white/15 grid place-items-center">
                  <RefreshCw className="w-4.5 h-4.5" size={18} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base leading-none">Banking Sync</h3>
                  <p className="text-xs text-white/60 mt-1">Live feed via Plaid API</p>
                </div>
              </div>
              <div className="bg-white/10 p-3 rounded-xl flex items-center justify-between mb-3.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span className="text-xs font-semibold">Chase Corporate …0291</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-white/40">Connected</span>
              </div>
              <p className="text-xs text-white/70 leading-relaxed italic">
                No unallocated transactions detected for this booking reference. Last sync performed 14 minutes ago.
              </p>
              <button className="w-full mt-4 border border-white/25 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4" /> Force Re-sync
              </button>
            </div>
          </div>
        </div>

        {/* Transaction log */}
        <div className="mt-10">
          <h3 className="font-display font-bold text-lg text-[#12172B] mb-5">Recent Transaction Log</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TRANSACTIONS.map((t, idx) => {
              const toneMap = {
                primary: { bg: "bg-[#3D4BA8]/5 group-hover:bg-[#3D4BA8]/10", text: "text-[#3D4BA8]" },
                danger: { bg: "bg-rose-500/5 group-hover:bg-rose-500/10", text: "text-rose-600" },
                gold: { bg: "bg-[#D4AF61]/10 group-hover:bg-[#D4AF61]/20", text: "text-[#9C7A2E]" },
              };
              const tone = toneMap[t.tone];
              return (
                <div key={idx} className="group bg-white p-5 rounded-2xl border border-slate-200 relative overflow-hidden">
                  <div className={`absolute right-0 top-0 w-24 h-24 rounded-bl-full -mr-12 -mt-12 transition-all ${tone.bg}`} />
                  <div className="relative flex items-start gap-4">
                    <div className="flex flex-col items-center w-10 shrink-0">
                      <span className="text-[10px] font-bold text-slate-300">{t.month}</span>
                      <span className="text-lg font-bold text-[#12172B]">{t.day}</span>
                    </div>
                    <div className="flex-1">
                      <p className={`text-[11px] font-bold mb-1 tracking-wide ${tone.text}`}>{t.label}</p>
                      <p className={`text-base font-bold tnum ${t.tone === "danger" ? "text-rose-600" : "text-[#12172B]"}`}>
                        {t.amount}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{t.note}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Record Payment modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#12172B]/60 backdrop-blur-sm px-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden rise-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-display font-bold text-lg text-[#12172B]">Record New Payment</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleConfirmPayment} className="p-7 space-y-5">
              <div>
                <label className="block text-[11px] font-bold text-[#12172B] uppercase mb-2">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-[#3D4BA8] outline-none focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-[11px] font-bold text-[#12172B] uppercase mb-2">Date Received</label>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#12172B] uppercase mb-2">Payment Mode</label>
                  <select
                    value={modeInput}
                    onChange={(e) => setModeInput(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8]"
                  >
                    <option>ACH / Wire Transfer</option>
                    <option>Check</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#12172B] uppercase mb-2">
                  Transaction Reference / Note
                </label>
                <textarea
                  rows={3}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Reference ID, bank name, or specific notes…"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#3D4BA8]/20 focus:border-[#3D4BA8] resize-none"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-[#3D4BA8] text-white py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-[#3D4BA8]/30 transition-all flex items-center justify-center gap-2"
                >
                  <ArrowDownToLine className="w-4 h-4" /> Confirm Payment Entry
                </button>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-3.5 border border-slate-200 rounded-xl font-bold text-[#12172B] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}