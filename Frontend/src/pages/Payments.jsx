import { useEffect, useRef, useState } from "react";

/**
 * Sales & Payments — ASZONE ERP
 * Standalone content only (no sidebar / top navbar), built with React + Tailwind CSS.
 */

const chartData = [
  { label: "JUL", h: "h-3/4" },
  { label: "AUG", h: "h-4/5" },
  { label: "SEP", h: "h-[90%]" },
  { label: "OCT", h: "h-[65%]" },
  { label: "NOV", h: "h-[85%]" },
  { label: "DEC", h: "h-[95%]" },
];

const ledger = [
  {
    icon: "add_circle",
    iconColor: "text-primary",
    title: "Skyline Towers - Unit 402",
    subtitle: "Installment Received • 2m ago",
    amount: "+$12,400",
    amountColor: "text-primary",
  },
  {
    icon: "error",
    iconColor: "text-red-600",
    title: "Emerald Garden - Plot 22",
    subtitle: "Payment Failed • 45m ago",
    amount: "$8,500",
    amountColor: "text-red-600",
  },
  {
    icon: "verified",
    iconColor: "text-primary",
    title: "Luxury Suites - Booking",
    subtitle: "New Sale Confirmed • 2h ago",
    amount: "+$45,000",
    amountColor: "text-primary",
  },
  {
    icon: "history",
    iconColor: "text-gray-400",
    title: "Marina Bay - Unit 1021",
    subtitle: "Grace Period Applied • 4h ago",
    amount: "--",
    amountColor: "text-gray-400",
  },
];

const transactions = [
  {
    id: "#TXN-89021",
    initials: "AM",
    name: "Arthur Morgan",
    property: "Riverfront Estate - Phase 2",
    amount: "$24,500.00",
    due: "Oct 12, 2023",
    status: "Paid",
    statusClass: "bg-green-100 text-green-700",
  },
  {
    id: "#TXN-89022",
    initials: "SK",
    name: "Sarah Koenig",
    property: "The Zenith - Apt 12A",
    amount: "$12,000.00",
    due: "Sep 28, 2023",
    status: "Overdue",
    statusClass: "bg-red-100 text-red-700",
  },
  {
    id: "#TXN-89023",
    initials: "JD",
    name: "John Doe",
    property: "Oakwood Villas - Villa 7",
    amount: "$38,900.00",
    due: "Oct 20, 2023",
    status: "Pending",
    statusClass: "bg-yellow-100 text-yellow-700",
  },
];

function Bar({ label, h, delay }) {
  const barRef = useRef(null);

  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    el.style.height = "0%";
    const t = setTimeout(() => {
      el.classList.add(h);
    }, delay);
    return () => clearTimeout(t);
  }, [h, delay]);

  return (
    <div className="flex-1 flex flex-col items-center gap-2">
      <div className="w-full max-w-[40px] bg-[#012c7e]/10 rounded-t-lg relative h-40 group cursor-pointer overflow-hidden">
        <div
          ref={barRef}
          className="absolute bottom-0 w-full bg-[#012c7e]/40 group-hover:bg-[#012c7e] transition-[height] duration-1000 ease-out"
        />
      </div>
      <span className="text-[11px] font-semibold tracking-wide text-gray-400">
        {label}
      </span>
    </div>
  );
}

export default function Payments() {
  const [tab, setTab] = useState("All Transactions");

  return (
    <div
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#F6F8FB",
        fontFamily: "'Inter', sans-serif",
        color: "#1a1b21",
      }}
    >
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
      />
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
        }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h2
              className="font-display font-bold text-[36px] leading-[44px] tracking-[-0.02em]"
              style={{ color: "#012c7e" }}
            >
              Sales &amp; Payments
            </h2>
            <p className="text-[15px] leading-6 text-[#444651] mt-1">
              Real-time overview of your real estate portfolio performance.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[#1a1b21] text-[13px] font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                filter_list
              </span>
              Filter Range
            </button>
            <button className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[#1a1b21] text-[13px] font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-[18px]">
                file_download
              </span>
              Export Report
            </button>
          </div>
        </div>

        {/* Bento Grid Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Main Stat: Total Sales */}
          <div
            className="md:col-span-2 p-8 rounded-[24px] text-white flex flex-col justify-between shadow-lg relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #254495 0%, #012c7e 100%)",
            }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">
                trending_up
              </span>
            </div>
            <div>
              <p className="text-[13px] font-semibold opacity-80 uppercase tracking-widest">
                Total Sales Volume (YTD)
              </p>
              <h3 className="font-display text-[48px] mt-2 font-extrabold">
                $142.8M
              </h3>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-[13px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">
                  arrow_upward
                </span>
                12.5%
              </div>
              <p className="text-[13px] opacity-70">vs last fiscal year</p>
            </div>
          </div>

          {/* Upcoming Collections */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#dbe1ff", color: "#012c7e" }}
              >
                <span className="material-symbols-outlined">
                  event_repeat
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#444651] uppercase tracking-wider">
                Upcoming EMIs
              </p>
              <h3 className="font-display text-[24px] font-semibold text-[#1a1b21] mt-1">
                $4.2M
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[13px] text-[#444651]">
                <span className="font-bold" style={{ color: "#012c7e" }}>
                  124
                </span>{" "}
                installments due this week
              </p>
            </div>
          </div>

          {/* Overdue Payments */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: "#ffdad6", color: "#ba1a1a" }}
              >
                <span className="material-symbols-outlined">warning</span>
              </div>
              <p className="text-[11px] font-semibold text-[#444651] uppercase tracking-wider">
                Overdue Payments
              </p>
              <h3 className="font-display text-[24px] font-semibold mt-1" style={{ color: "#ba1a1a" }}>
                $842.5K
              </h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[13px] text-[#444651]">
                <span className="font-bold" style={{ color: "#ba1a1a" }}>
                  18
                </span>{" "}
                high-priority follow-ups
              </p>
            </div>
          </div>
        </div>

        {/* Middle Section: Forecast and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forecast Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="font-display text-[20px] font-semibold text-[#1a1b21]">
                  Collection Forecast
                </h4>
                <p className="text-[14px] text-[#444651]">
                  Estimated revenue vs actual collections for Q3
                </p>
              </div>
              <select className="bg-gray-50 border-none rounded-lg text-[13px] font-semibold text-[#444651] focus:ring-0 py-2 px-3">
                <option>Next 6 Months</option>
                <option>Monthly View</option>
              </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {chartData.map((bar, i) => (
                <Bar key={bar.label} label={bar.label} h={bar.h} delay={300 + i * 60} />
              ))}
            </div>

            <div className="mt-8 flex gap-6 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "rgba(1,44,126,0.4)" }}
                />
                <span className="text-[13px] text-[#444651]">
                  Actual Collections
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "rgba(1,44,126,0.1)" }}
                />
                <span className="text-[13px] text-[#444651]">
                  Projected Revenue
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-display text-[20px] font-semibold text-[#1a1b21]">
                Live Ledger
              </h4>
              <button
                className="font-semibold text-[13px] hover:underline"
                style={{ color: "#012c7e" }}
              >
                View All
              </button>
            </div>

            <div className="space-y-6">
              {ledger.map((item, idx) => (
                <div className="flex items-center gap-4" key={idx}>
                  <div
                    className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${item.iconColor}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {item.icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1a1b21] truncate">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-[#444651]">
                      {item.subtitle}
                    </p>
                  </div>
                  <p className={`text-[13px] font-semibold ${item.amountColor}`}>
                    {item.amount}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Detailed Transactions Table */}
        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h4 className="font-display text-[20px] font-semibold text-[#1a1b21]">
              Payment Schedule &amp; Records
            </h4>
            <div className="flex gap-2">
              <div className="bg-gray-50 p-1 rounded-lg flex">
                {["All Transactions", "Overdue", "Pending"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 rounded-md text-[13px] font-semibold transition-colors ${
                      tab === t
                        ? "bg-white shadow-sm"
                        : "text-[#444651] hover:text-[#1a1b21]"
                    }`}
                    style={tab === t ? { color: "#012c7e" } : {}}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  {[
                    "Transaction ID",
                    "Customer",
                    "Property Detail",
                    "Amount",
                    "Due Date",
                    "Status",
                    "Action",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-[11px] font-semibold text-[#444651] uppercase tracking-widest"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td
                      className="px-6 py-4 text-[13px] font-medium"
                      style={{ color: "#012c7e" }}
                    >
                      {tx.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px]"
                          style={{
                            backgroundColor: "rgba(1,44,126,0.1)",
                            color: "#012c7e",
                          }}
                        >
                          {tx.initials}
                        </div>
                        <span className="text-[15px] text-[#1a1b21]">
                          {tx.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[15px] text-[#444651]">
                      {tx.property}
                    </td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1a1b21]">
                      {tx.amount}
                    </td>
                    <td className="px-6 py-4 text-[15px] text-[#444651]">
                      {tx.due}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${tx.statusClass}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                        <span className="material-symbols-outlined text-[20px]">
                          more_vert
                        </span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 px-6">
            <p className="text-[13px] text-[#444651]">
              Showing 1-10 of 1,248 transactions
            </p>
            <div className="flex items-center gap-4">
              <button
                className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-[20px]">
                  chevron_left
                </span>
              </button>
              <span className="text-[13px] font-semibold text-[#1a1b21]">
                Page 1 of 125
              </span>
              <button className="p-2 border border-gray-200 rounded-lg bg-white">
                <span className="material-symbols-outlined text-[20px]">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="h-4" />
      </div>

      {/* Contextual FAB */}
      <button
        className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-50"
        style={{ backgroundColor: "#012c7e" }}
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">
          payments
        </span>
        <span
          className="absolute right-16 text-white px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg"
          style={{ backgroundColor: "#012c7e" }}
        >
          New Collection
        </span>
      </button>
    </div>
  );
}