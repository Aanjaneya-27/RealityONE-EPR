import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";

const chartData = [
  { label: "JUL", actual: 8.2, projected: 9.5 },
  { label: "AUG", actual: 9.6, projected: 10.1 },
  { label: "SEP", actual: 11.4, projected: 11.0 },
  { label: "OCT", actual: 7.1, projected: 9.8 },
  { label: "NOV", actual: 10.3, projected: 10.5 },
  { label: "DEC", actual: 12.6, projected: 12.0 },
];
const CHART_MAX = Math.max(...chartData.flatMap((d) => [d.actual, d.projected])) * 1.1;

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

function daysFromNow(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}
function monthsFromNow(offset, day = 15) {
  const d = new Date();
  d.setMonth(d.getMonth() + offset, day);
  return d;
}
function fmt(date) {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

const INITIAL_TRANSACTIONS = [
  {
    id: "#TXN-89021",
    initials: "AM",
    name: "Arthur Morgan",
    property: "Riverfront Estate - Phase 2",
    amountValue: 24500,
    dueDate: daysFromNow(-3),
    status: "Paid",
    paymentMethod: "Wire",
  },
  {
    id: "#TXN-89022",
    initials: "SK",
    name: "Sarah Koenig",
    property: "The Zenith - Apt 12A",
    amountValue: 12000,
    dueDate: daysFromNow(-20),
    status: "Overdue",
    paymentMethod: "Escrow",
  },
  {
    id: "#TXN-89023",
    initials: "JD",
    name: "John Doe",
    property: "Oakwood Villas - Villa 7",
    amountValue: 38900,
    dueDate: daysFromNow(6),
    status: "Pending",
    paymentMethod: "Bank Draft",
  },
  {
    id: "#TXN-89024",
    initials: "LR",
    name: "Laura Reyes",
    property: "Skyline Towers - Unit 402",
    amountValue: 15750,
    dueDate: daysFromNow(-1),
    status: "Paid",
    paymentMethod: "Wire",
  },
  {
    id: "#TXN-89025",
    initials: "MC",
    name: "Miguel Cortez",
    property: "Emerald Garden - Plot 22",
    amountValue: 8500,
    dueDate: monthsFromNow(-2),
    status: "Overdue",
    paymentMethod: "Bank Draft",
  },
  {
    id: "#TXN-89026",
    initials: "NP",
    name: "Nadia Petrov",
    property: "Marina Bay - Unit 1021",
    amountValue: 45000,
    dueDate: monthsFromNow(0, 20),
    status: "Pending",
    paymentMethod: "Escrow",
  },
  {
    id: "#TXN-89027",
    initials: "OT",
    name: "Owen Tran",
    property: "Luxury Suites - Booking",
    amountValue: 19800,
    dueDate: daysFromNow(-45),
    status: "Paid",
    paymentMethod: "Escrow",
  },
  {
    id: "#TXN-89028",
    initials: "RB",
    name: "Renee Bishop",
    property: "Oakwood Villas - Villa 12",
    amountValue: 27650,
    dueDate: daysFromNow(2),
    status: "Pending",
    paymentMethod: "Wire",
  },
];

const statusClassMap = {
  Paid: "bg-green-100 text-green-700",
  Overdue: "bg-red-100 text-red-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

const DATE_RANGE_OPTIONS = ["All Time", "Last 7 Days", "This Month", "Q3"];
const PAYMENT_METHOD_OPTIONS = ["All Methods", "Wire", "Escrow", "Bank Draft"];

function isInQ3(date) {
  const m = new Date(date).getMonth(); 
  return m >= 6 && m <= 8;
}

function matchesDateRange(dateObj, range) {
  const now = new Date();
  const date = new Date(dateObj);
  if (range === "All Time") return true;
  if (range === "Last 7 Days") {
    const diffDays = (now - date) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  }
  if (range === "This Month") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }
  if (range === "Q3") return isInQ3(date);
  return true;
}

function Bar({ label, actual, projected, delay }) {
  const actualRef = useRef(null);
  const projectedRef = useRef(null);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const actualEl = actualRef.current;
    const projectedEl = projectedRef.current;
    if (!actualEl || !projectedEl) return;
    actualEl.style.height = "0%";
    projectedEl.style.height = "0%";
    const t = setTimeout(() => {
      actualEl.style.height = `${(actual / CHART_MAX) * 100}%`;
      projectedEl.style.height = `${(projected / CHART_MAX) * 100}%`;
    }, delay);
    return () => clearTimeout(t);
  }, [actual, projected, delay]);

  return (
    <div
      className="flex-1 flex flex-col items-center gap-2"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="w-full flex items-end justify-center gap-1.5 h-40 relative">
        {hover && (
          <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-[#1a1b21] text-white text-[11px] font-semibold rounded-lg px-3 py-1.5 whitespace-nowrap shadow-lg z-10">
            Actual ${actual.toFixed(1)}M · Projected ${projected.toFixed(1)}M
          </div>
        )}
        <div className="w-full max-w-[16px] bg-[#012c7e]/10 rounded-t-lg relative h-full overflow-hidden cursor-pointer">
          <div
            ref={actualRef}
            className="absolute bottom-0 w-full rounded-t-lg transition-[height] duration-1000 ease-out"
            style={{ backgroundColor: "#012c7e" }}
          />
        </div>
        <div className="w-full max-w-[16px] bg-red-100 rounded-t-lg relative h-full overflow-hidden cursor-pointer">
          <div
            ref={projectedRef}
            className="absolute bottom-0 w-full rounded-t-lg transition-[height] duration-1000 ease-out"
            style={{ backgroundColor: "#dc2626" }}
          />
        </div>
      </div>
      <span className="text-[11px] font-semibold tracking-wide text-gray-400">
        {label}
      </span>
    </div>
  );
}

function DropdownMenu({ items, onSelect, align = "right" }) {
  return (
    <div
      className={`absolute z-50 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 ${
        align === "right" ? "right-0" : "left-0"
      }`}
    >
      {items.map((item) => (
        <button
          key={item.label}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(item);
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-[13px] font-medium text-[#1a1b21] hover:bg-gray-50 transition-colors text-left"
        >
          {item.icon && (
            <span
              className={`material-symbols-outlined text-[18px] ${
                item.iconColor || "text-gray-400"
              }`}
            >
              {item.icon}
            </span>
          )}
          {item.label}
        </button>
      ))}
    </div>
  );
}

function ConfirmationModal({ title, message, onClose }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-[24px] shadow-2xl max-w-sm w-full p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
          style={{ backgroundColor: "#dbe1ff", color: "#012c7e" }}
        >
          <span className="material-symbols-outlined">task_alt</span>
        </div>
        <h4 className="font-display text-[18px] font-semibold text-[#1a1b21] mb-1">
          {title}
        </h4>
        <p className="text-[14px] text-[#444651] mb-6">{message}</p>
        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl text-white text-[13px] font-semibold"
          style={{ backgroundColor: "#012c7e" }}
        >
          Done
        </button>
      </div>
    </div>
  );
}

export default function Payments() {
  const [tab, setTab] = useState("All Transactions");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("All Methods");
  const [dateRangeFilter, setDateRangeFilter] = useState("All Time");

  // MAIN STATE
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [showAddModal, setShowAddModal] = useState(false);

  const [openMenu, setOpenMenu] = useState(null);
  const [modal, setModal] = useState(null); 

  const containerRef = useRef(null);

  // FETCH DATA FROM DATABASE ON LOAD
  useEffect(() => {
    let isMounted = true;
    const fetchPayments = async () => {
      try {
        const response = await axios.get("https://realityone-epr.onrender.com/api/payments/all");
        if (isMounted && response.data.success && response.data.data.length > 0) {
          // Convert DB rows into UI format
          const dbData = response.data.data.map(db => ({
            id: db.payment_id,
            initials: db.customer_name.substring(0, 2).toUpperCase(),
            name: db.customer_name,
            property: `${db.project} - ${db.unit_id}`,
            amountValue: Number(db.amount),
            dueDate: new Date(db.date),
            status: db.status,
            paymentMethod: db.method
          }));
          // Append DB data above Dummy data
          setTransactions([...dbData, ...INITIAL_TRANSACTIONS]);
        }
      } catch (error) {
        console.error("Backend fetch error:", error);
      }
    };
    fetchPayments();
    return () => { isMounted = false; };
  }, []);

  // CLOSE DROPDOWNS
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleMenu = (key) => setOpenMenu((prev) => (prev === key ? null : key));

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const statusOk = tab === "All Transactions" ? true : tx.status === tab;
      const methodOk = paymentMethodFilter === "All Methods" ? true : tx.paymentMethod === paymentMethodFilter;
      const dateOk = matchesDateRange(tx.dueDate, dateRangeFilter);
      return statusOk && methodOk && dateOk;
    });
  }, [transactions, tab, paymentMethodFilter, dateRangeFilter]);

  // ACTIONS
  function handleDownloadInvoice(tx) {
    const lines = [
      `Invoice for ${tx.id}`,
      `Customer: ${tx.name}`,
      `Property: ${tx.property}`,
      `Amount: $${tx.amountValue.toLocaleString()}`,
      `Due Date: ${fmt(tx.dueDate)}`,
      `Status: ${tx.status}`,
      `Payment Method: ${tx.paymentMethod}`,
    ].join("\n");
    const blob = new Blob([lines], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${tx.id.replace("#", "")}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setModal({
      title: "Invoice Downloaded",
      message: `Invoice for ${tx.id} has been downloaded.`,
    });
  }

  // MARK AS PAID API
  async function handleMarkAsPaid(tx) {
    // 1. Optimistic UI update
    setTransactions(prev => prev.map(t => t.id === tx.id ? { ...t, status: "Paid" } : t));
    try {
      // 2. Database update
      await axios.put(`https://realityone-epr.onrender.com/api/payments/status/${tx.id}`, { status: "Paid" });
      setModal({
        title: "Transaction Verified",
        message: `${tx.id} for ${tx.name} has been marked as Paid in database.`,
      });
    } catch (error) {
      console.error(error);
      alert("Failed to update database.");
    }
  }

  function handleSendReminder(tx) {
    setModal({
      title: "Reminder Sent",
      message: `A payment reminder has been sent to ${tx.name} for ${tx.id}.`,
    });
  }

  function handleRowAction(item, tx) {
    setOpenMenu(null);
    if (item.key === "download") handleDownloadInvoice(tx);
    if (item.key === "markPaid") handleMarkAsPaid(tx);
    if (item.key === "verify") setModal({ title: "Verified", message: "Checked details." });
    if (item.key === "remind") handleSendReminder(tx);
  }

  // ADD NEW PAYMENT API
  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    // Extract property and unit correctly from UI inputs
    const projName = formData.get("project");
    const unitId = formData.get("unit");

    const newPayment = {
      payment_id: "#TXN-" + Math.floor(10000 + Math.random() * 90000),
      customer_name: formData.get("customer"),
      project: projName,
      unit_id: unitId,
      amount: Number(formData.get("amount")),
      date: formData.get("date"),
      method: formData.get("method"),
      status: formData.get("status"),
    };

    try {
      await axios.post("https://realityone-epr.onrender.com/api/payments/add", newPayment);
      
      const uiFormat = {
        id: newPayment.payment_id,
        initials: newPayment.customer_name.substring(0, 2).toUpperCase(),
        name: newPayment.customer_name,
        property: `${projName} - ${unitId}`,
        amountValue: newPayment.amount,
        dueDate: new Date(newPayment.date),
        status: newPayment.status,
        paymentMethod: newPayment.method
      };

      setTransactions([uiFormat, ...transactions]);
      setShowAddModal(false);
      setModal({ title: "Payment Recorded", message: "Payment successfully saved to Database!" });
    } catch (error) {
      console.error("Add payment error:", error);
      alert("Error saving to database.");
    }
  };

  // EXPORT STUFF
  function buildExportRows() {
    const header = [
      "Transaction ID",
      "Customer",
      "Property Detail",
      "Amount",
      "Due Date",
      "Status",
      "Payment Method",
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.name,
      tx.property,
      tx.amountValue,
      fmt(tx.dueDate),
      tx.status,
      tx.paymentMethod,
    ]);
    return [header, ...rows];
  }

  function downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function rowsToCsv(rows) {
    return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
  }

  function handleExportCsv() {
    const csv = rowsToCsv(buildExportRows());
    downloadFile(csv, "payment-schedule.csv", "text/csv;charset=utf-8;");
    setOpenMenu(null);
    setModal({ title: "CSV Exported", message: "Your payment schedule has been downloaded as a CSV file." });
  }

  function handleExportExcel() {
    const rows = buildExportRows();
    const html = `<table>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")}</table>`;
    downloadFile(html, "payment-schedule.xls", "application/vnd.ms-excel");
    setOpenMenu(null);
    setModal({ title: "Excel File Exported", message: "Your payment schedule has been downloaded as an Excel file." });
  }

  function handleExportPdf() {
    setOpenMenu(null);
    window.print();
    setModal({ title: "Export to PDF", message: "Use the print dialog's 'Save as PDF' destination to save this report." });
  }

  function handlePrint() {
    setOpenMenu(null);
    window.print();
  }

  const exportMenuItems = [
    { key: "pdf", label: "Export as PDF", icon: "picture_as_pdf", iconColor: "text-red-600" },
    { key: "excel", label: "Export as Excel", icon: "grid_on", iconColor: "text-green-600" },
    { key: "csv", label: "Export as CSV", icon: "description", iconColor: "text-blue-600" },
    { key: "print", label: "Print Report", icon: "print", iconColor: "text-gray-500" },
  ];

  function handleExportSelect(item) {
    if (item.key === "pdf") handleExportPdf();
    if (item.key === "excel") handleExportExcel();
    if (item.key === "csv") handleExportCsv();
    if (item.key === "print") handlePrint();
  }

  const rowMenuItemsFor = (tx) => [
    { key: "download", label: "Download Invoice", icon: "download", iconColor: "text-blue-600" },
    ...(tx.status !== "Paid" ? [{ key: "markPaid", label: "Mark as Paid", icon: "check_circle", iconColor: "text-green-600" }] : []),
    { key: "verify", label: "Verify Transaction", icon: "verified", iconColor: "text-primary" },
    { key: "remind", label: "Send Reminder", icon: "notifications_active", iconColor: "text-yellow-600" },
  ];

  // DASHBOARD CALCULATIONS
  const totalCollected = transactions.filter(t => t.status === "Paid").reduce((acc, curr) => acc + curr.amountValue, 0);
  const pendingValue = transactions.filter(t => t.status === "Pending").reduce((acc, curr) => acc + curr.amountValue, 0);
  const overdueValue = transactions.filter(t => t.status === "Overdue").reduce((acc, curr) => acc + curr.amountValue, 0);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full"
      style={{
        backgroundColor: "#F6F8FB",
        fontFamily: "'Inter', sans-serif",
        color: "#1a1b21",
      }}
    >
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" />
      <style>{`
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; font-family: 'Material Symbols Outlined'; }
        .font-display { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}</style>

      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <h2 className="font-display font-bold text-[36px] leading-[44px] tracking-[-0.02em]" style={{ color: "#012c7e" }}>
              Sales &amp; Payments
            </h2>
            <p className="text-[15px] leading-6 text-[#444651] mt-1">
              Real-time overview of your real estate portfolio performance.
            </p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => toggleMenu("filterRange")}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[#1a1b21] text-[13px] font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                {dateRangeFilter === "All Time" ? "Filter Range" : dateRangeFilter}
              </button>
              {openMenu === "filterRange" && (
                <DropdownMenu
                  items={DATE_RANGE_OPTIONS.map((opt) => ({ label: opt }))}
                  onSelect={(item) => { setDateRangeFilter(item.label); setOpenMenu(null); }}
                />
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => toggleMenu("export")}
                className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-[#1a1b21] text-[13px] font-semibold flex items-center gap-2 hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">file_download</span>
                Export Report
              </button>
              {openMenu === "export" && <DropdownMenu items={exportMenuItems} onSelect={handleExportSelect} />}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            className="md:col-span-2 p-8 rounded-[24px] text-white flex flex-col justify-between shadow-lg relative overflow-hidden group"
            style={{ background: "linear-gradient(135deg, #254495 0%, #012c7e 100%)" }}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-[120px]">trending_up</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold opacity-80 uppercase tracking-widest">Total Sales Volume (YTD)</p>
              <h3 className="font-display text-[48px] mt-2 font-extrabold">${(totalCollected / 1000000).toFixed(1)}M</h3>
            </div>
            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-[13px] font-semibold">
                <span className="material-symbols-outlined text-[16px]">arrow_upward</span> 12.5%
              </div>
              <p className="text-[13px] opacity-70">vs last fiscal year</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#dbe1ff", color: "#012c7e" }}>
                <span className="material-symbols-outlined">event_repeat</span>
              </div>
              <p className="text-[11px] font-semibold text-[#444651] uppercase tracking-wider">Upcoming EMIs</p>
              <h3 className="font-display text-[24px] font-semibold text-[#1a1b21] mt-1">${(pendingValue / 1000).toFixed(1)}K</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[13px] text-[#444651]"><span className="font-bold" style={{ color: "#012c7e" }}>124</span> installments due</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: "#ffdad6", color: "#ba1a1a" }}>
                <span className="material-symbols-outlined">warning</span>
              </div>
              <p className="text-[11px] font-semibold text-[#444651] uppercase tracking-wider">Overdue Payments</p>
              <h3 className="font-display text-[24px] font-semibold mt-1" style={{ color: "#ba1a1a" }}>${(overdueValue / 1000).toFixed(1)}K</h3>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <p className="text-[13px] text-[#444651]"><span className="font-bold" style={{ color: "#ba1a1a" }}>18</span> high-priority follow-ups</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Forecast Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h4 className="font-display text-[20px] font-semibold text-[#1a1b21]">Collection Forecast</h4>
                <p className="text-[14px] text-[#444651]">Estimated revenue vs actual collections for Q3</p>
              </div>
              <select className="bg-gray-50 border-none rounded-lg text-[13px] font-semibold text-[#444651] focus:ring-0 py-2 px-3">
                <option>Next 6 Months</option>
                <option>Monthly View</option>
              </select>
            </div>

            <div className="h-64 flex items-end justify-between gap-4 px-2">
              {chartData.map((bar, i) => (
                <Bar key={bar.label} label={bar.label} actual={bar.actual} projected={bar.projected} delay={300 + i * 60} />
              ))}
            </div>

            <div className="mt-8 flex gap-6 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#012c7e" }} />
                <span className="text-[13px] text-[#444651]">Actual Collections</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: "#dc2626" }} />
                <span className="text-[13px] text-[#444651]">Projected Revenue</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-[24px] border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-display text-[20px] font-semibold text-[#1a1b21]">Live Ledger</h4>
              <button className="font-semibold text-[13px] hover:underline" style={{ color: "#012c7e" }}>View All</button>
            </div>
            <div className="space-y-6">
              {ledger.map((item, idx) => (
                <div className="flex items-center gap-4" key={idx}>
                  <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center ${item.iconColor}`}>
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#1a1b21] truncate">{item.title}</p>
                    <p className="text-[11px] text-[#444651]">{item.subtitle}</p>
                  </div>
                  <p className={`text-[13px] font-semibold ${item.amountColor}`}>{item.amount}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <h4 className="font-display text-[20px] font-semibold text-[#1a1b21]">Payment Schedule &amp; Records</h4>
            <div className="flex gap-2 items-center">
              <div className="bg-gray-50 p-1 rounded-lg flex">
                {["All Transactions", "Overdue", "Pending"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-3 py-1 rounded-md text-[13px] font-semibold transition-colors ${
                      tab === t ? "bg-white shadow-sm text-[#012c7e]" : "text-[#444651] hover:text-[#1a1b21]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <div className="relative">
                <select
                  value={paymentMethodFilter}
                  onChange={(e) => setPaymentMethodFilter(e.target.value)}
                  className="bg-gray-50 border-none rounded-lg text-[13px] font-semibold text-[#444651] focus:ring-0 py-2 px-3 outline-none"
                >
                  {PAYMENT_METHOD_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50">
                  {["Transaction ID", "Customer", "Property Detail", "Amount", "Due Date", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[11px] font-semibold text-[#444651] uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-10 text-center text-[14px] text-[#444651]">
                      No transactions match the current filters.
                    </td>
                  </tr>
                )}
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-[13px] font-medium" style={{ color: "#012c7e" }}>{tx.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: "rgba(1,44,126,0.1)", color: "#012c7e" }}>
                          {tx.initials}
                        </div>
                        <span className="text-[15px] text-[#1a1b21]">{tx.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[15px] text-[#444651]">{tx.property}</td>
                    <td className="px-6 py-4 text-[13px] font-semibold text-[#1a1b21]">
                      ${tx.amountValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-[15px] text-[#444651]">{fmt(tx.dueDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${statusClassMap[tx.status]}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <button onClick={() => toggleMenu(`row-${tx.id}`)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-400">
                          <span className="material-symbols-outlined text-[20px]">more_vert</span>
                        </button>
                        {openMenu === `row-${tx.id}` && (
                          <DropdownMenu items={rowMenuItemsFor(tx)} onSelect={(item) => handleRowAction(item, tx)} />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-4 px-6">
            <p className="text-[13px] text-[#444651]">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </p>
            <div className="flex items-center gap-4">
              <button className="p-2 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[20px]">chevron_left</span>
              </button>
              <span className="text-[13px] font-semibold text-[#1a1b21]">Page 1 of 1</span>
              <button className="p-2 border border-gray-200 rounded-lg bg-white">
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
        <div className="h-4" />
      </div>

      <button
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group z-40"
        style={{ backgroundColor: "#012c7e" }}
      >
        <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">payments</span>
        <span className="absolute right-16 text-white px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-lg" style={{ backgroundColor: "#012c7e" }}>
          New Collection
        </span>
      </button>

      {/* ADD PAYMENT MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-display text-xl font-bold text-[#1a1b21]">Record New Payment</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-black">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <form onSubmit={handleRecordPaymentSubmit} className="p-6 space-y-4">
              <div>
                <label className="text-[11px] font-bold uppercase text-[#747683]">Customer Name</label>
                <input name="customer" required className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm" placeholder="John Doe" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#747683]">Project</label>
                  <input name="project" defaultValue="Skyline Residences" required className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#747683]">Unit ID</label>
                  <input name="unit" required className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm" placeholder="E-204" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#747683]">Amount ($)</label>
                  <input name="amount" type="number" required className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm" placeholder="25000" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#747683]">Date</label>
                  <input name="date" type="date" required className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#747683]">Method</label>
                  <select name="method" className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm">
                    <option>Wire</option><option>Escrow</option><option>Bank Draft</option><option>Cheque</option><option>Cash</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase text-[#747683]">Status</label>
                  <select name="status" className="w-full mt-1 px-4 py-2.5 bg-[#f4f3fa] border border-[#e3e2e9] rounded-xl outline-none text-sm">
                    <option>Paid</option><option>Pending</option><option>Overdue</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2.5 border border-[#e3e2e9] rounded-xl font-bold text-[#444651] hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-[#012c7e] text-white rounded-xl font-bold hover:bg-[#254495] shadow-md text-sm">Save Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modal && <ConfirmationModal title={modal.title} message={modal.message} onClose={() => setModal(null)} />}
    </div>
  );
}