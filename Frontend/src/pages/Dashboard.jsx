import { useEffect, useState, useRef } from "react";

export default function Dashboard() {
  const [selectedFilter, setSelectedFilter] = useState("Last 6 Months");
  const [activeDrawer, setActiveDrawer] = useState(null); // 'aiAssistant' | 'aiInsights'
  const [activeDropdown, setActiveDropdown] = useState(null); // 'export' | 'action_0' | 'action_1' | 'action_2'
  const exportRef = useRef(null);
  const mainRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setActiveDrawer(null);
        setActiveDropdown(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Close Dropdowns on Outside Click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        // Close dropdowns if click is outside export area or action menus
        if (!e.target.closest('.action-menu-container')) {
          setActiveDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = (action) => {
    if (action === 'print') {
      window.print();
    } else {
      console.log(`Generating ${action}...`);
    }
    setActiveDropdown(null);
  };

  const handleBookingAction = (type, item) => {
    alert(`Action triggered: ${type} for ${item}`);
    setActiveDropdown(null);
  };

  // ==========================================
  // EXISTING CHART DATA
  // ==========================================
  const chartData = {
    "Last 6 Months": [
      { label: 'Jan', top: '60%', bot: '40%' },
      { label: 'Feb', top: '75%', bot: '55%' },
      { label: 'Mar', top: '90%', bot: '70%' },
      { label: 'Apr', top: '65%', bot: '45%' },
      { label: 'May', top: '80%', bot: '60%' },
      { label: 'Jun', top: '100%', bot: '85%' },
    ],
    "Last Year": [
      { label: 'Jan', top: '40%', bot: '25%' },
      { label: 'Feb', top: '50%', bot: '35%' },
      { label: 'Mar', top: '65%', bot: '50%' },
      { label: 'Apr', top: '85%', bot: '60%' },
      { label: 'May', top: '95%', bot: '75%' },
      { label: 'Jun', top: '70%', bot: '50%' },
    ]
  };

  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    let rafId = null;
    let pendingEvent = null;

    const applyMouseVars = () => {
      rafId = null;
      if (!pendingEvent) return;
      const target = pendingEvent.target.closest('.glass-card');
      if (target) {
        const rect = target.getBoundingClientRect();
        target.style.setProperty('--mouse-x', `${pendingEvent.clientX - rect.left}px`);
        target.style.setProperty('--mouse-y', `${pendingEvent.clientY - rect.top}px`);
      }
      pendingEvent = null;
    };

    const handleMouseMove = (e) => {
      pendingEvent = e;
      if (rafId === null) {
        rafId = requestAnimationFrame(applyMouseVars);
      }
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <style>{`
        /* GLOBAL POINTER FIX FOR ALL BUTTONS AND CLICKABLES */
        button, a, select, input[type="button"], input[type="submit"], [role="button"], .cursor-pointer {
          cursor: pointer !important;
        }

        .glass-card {
          background-color: rgba(255, 255, 255, 0.8);
          background-image: radial-gradient(300px circle at var(--mouse-x, -300px) var(--mouse-y, -300px), rgba(1, 44, 126, 0.05), transparent 70%);
          border: 1px solid #E5E7EB;
          position: relative;
          transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.25s ease;
          cursor: pointer;
          contain: layout style paint;
          transform: translateZ(0);
          backdrop-filter: blur(8px);
        }

        .glass-card:hover {
          transform: translateY(-2px) translateZ(0);
          box-shadow: 0 12px 30px rgba(1, 44, 126, 0.08);
        }

        /* Animations */
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fillWidth {
          from { width: 0%; }
        }
        @keyframes fillHeight {
          from { height: 0%; }
        }
        @keyframes scaleCircle {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .animate-card-fade {
          animation: cardFadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .animate-w-fill {
          animation: fillWidth 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-h-fill {
          animation: fillHeight 0.9s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .animate-circle {
          animation: scaleCircle 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        .max-w-container-max { max-width: 1600px; }
        .font-display-xl { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 44px; line-height: 52px; letter-spacing: -0.02em; font-weight: 800; }
        .font-display-lg { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 24px; line-height: 32px; letter-spacing: -0.01em; font-weight: 600; }
        .font-display-md { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 20px; line-height: 28px; letter-spacing: -0.01em; font-weight: 600; }
        .font-body-md { font-family: 'Inter', sans-serif; font-size: 15px; line-height: 24px; font-weight: 400; }
        .font-body-sm { font-family: 'Inter', sans-serif; font-size: 14px; line-height: 20px; font-weight: 400; }
        .font-label-md { font-family: 'Inter', sans-serif; font-size: 13px; line-height: 18px; letter-spacing: 0.02em; font-weight: 600; }
        
        .bg-primary { background-color: #012c7e; }
        .text-primary { color: #012c7e; }
        .bg-secondary { background-color: #1a53c8; }
        .text-secondary { color: #1a53c8; }
        .bg-tertiary { background-color: #562400; }
        .text-tertiary { color: #562400; }
        .bg-tertiary-container { background-color: #793600; }
        .text-on-tertiary-container { color: #ffa269; }
        .bg-surface-container { background-color: #eeedf5; }
        .bg-surface-container-low { background-color: #f4f3fa; }
        .bg-surface-container-highest { background-color: #e3e2e9; }
        .bg-surface-container-lowest { background-color: #ffffff; }
        .text-on-surface { color: #1a1b21; }
        .text-on-surface-variant { color: #444651; }
        .bg-primary-container { background-color: #254495; }
        .text-primary-container { color: #a0b6ff; }
        .border-outline-variant { border-color: #c4c6d3; }
        .bg-error { background-color: #ba1a1a; }
      `}</style>

      <main ref={mainRef} className="px-8 pt-0 pb-10 max-w-container-max mx-auto w-full font-body-md text-on-surface">
        
        {/* Header Block Title Area */}
        <div className="flex items-center justify-between mb-8 -mt-4 pt-1 opacity-0 animate-card-fade relative z-20" style={{ animationDelay: '0ms' }}>
          <div className="flex flex-col">
            <h1 className="font-display-xl text-on-surface tracking-tight">Executive Dashboard</h1>
            <p className="text-on-surface-variant font-body-md mt-1">Welcome back, Director. Here's your portfolio summary for July 2024.</p>
          </div>
          <div className="flex gap-3 relative">
            
            {/* Export Dropdown Feature */}
            <div className="relative" ref={exportRef}>
              <button 
                title="Export executive dashboard reports" 
                onClick={() => setActiveDropdown(activeDropdown === 'export' ? null : 'export')} 
                className="flex items-center gap-2 px-4 py-2 glass-card rounded-xl font-label-md text-on-surface hover:bg-surface-container transition-colors active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">download</span> Export Report
              </button>
              
              <div className={`absolute right-0 top-full mt-2 w-48 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 z-30 ${activeDropdown === 'export' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                <div className="p-1">
                  <button title="Download PDF document" onClick={() => handleExport('PDF')} className="w-full flex items-center gap-3 px-3 py-2.5 font-label-md text-on-surface hover:bg-surface-container hover:text-primary rounded-lg transition-colors text-left"><span className="material-symbols-outlined text-[18px]">picture_as_pdf</span> Export PDF</button>
                  <button title="Download Excel sheet" onClick={() => handleExport('Excel')} className="w-full flex items-center gap-3 px-3 py-2.5 font-label-md text-on-surface hover:bg-surface-container hover:text-primary rounded-lg transition-colors text-left"><span className="material-symbols-outlined text-[18px]">table_chart</span> Export Excel</button>
                  <button title="Download CSV data file" onClick={() => handleExport('CSV')} className="w-full flex items-center gap-3 px-3 py-2.5 font-label-md text-on-surface hover:bg-surface-container hover:text-primary rounded-lg transition-colors text-left"><span className="material-symbols-outlined text-[18px]">csv</span> Export CSV</button>
                  <div className="h-px bg-outline-variant/30 my-1 mx-2"></div>
                  <button title="Print this dashboard page" onClick={() => handleExport('print')} className="w-full flex items-center gap-3 px-3 py-2.5 font-label-md text-on-surface hover:bg-surface-container hover:text-primary rounded-lg transition-colors text-left"><span className="material-symbols-outlined text-[18px]">print</span> Print Dashboard</button>
                </div>
              </div>
            </div>

            {/* AI Assistant Button Trigger */}
            <button title="Open AI Chat Assistant" onClick={() => setActiveDrawer('aiAssistant')} className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-xl font-label-md hover:opacity-90 transition-all active:scale-95 shadow-sm">
              <span className="material-symbols-outlined text-[18px]">smart_toy</span> AI Assistant
            </button>
          </div>
        </div>

        {/* KPI Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 relative z-10">
          
          {/* Revenue */}
          <div title="Total Gross Revenue Summary" className="glass-card p-6 rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">payments</span>
              </div>
              <span title="Growth percentage compared to last month" className="text-secondary font-label-md bg-secondary/10 px-2 py-0.5 rounded-full">+12.4%</span>
            </div>
            <div className="relative z-10">
              <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Total Revenue</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-lg font-bold text-on-surface">$4.2M</span>
                <span className="text-on-surface-variant/60 font-body-sm">/ $5.0M Target</span>
              </div>
              <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden">
                <div className="bg-primary h-full rounded-full animate-w-fill" style={{ width: "84%" }}></div>
              </div>
            </div>
          </div>

          {/* Collections */}
          <div title="Customer Collections Efficiency" className="glass-card p-6 rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade" style={{ animationDelay: '150ms' }}>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">account_balance_wallet</span>
              </div>
              <span title="Collection drop percentage" className="text-error font-label-md bg-error/10 px-2 py-0.5 rounded-full">-2.1%</span>
            </div>
            <div className="relative z-10">
              <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Collections</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-lg font-bold text-on-surface">$2.8M</span>
                <span className="text-on-surface-variant/60 font-body-sm">Collected</span>
              </div>
              <div className="mt-4 flex items-center justify-between text-body-sm text-on-surface-variant">
                <span>$850k Outstanding</span>
                <span className="font-bold">76% Efficiency</span>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div title="Current Available Property Units" className="glass-card p-6 rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-secondary/10 text-secondary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">inventory_2</span>
              </div>
              <span className="text-on-surface-variant/60 font-label-md">Current Phase</span>
            </div>
            <div className="relative z-10">
              <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Available Inventory</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-lg font-bold text-on-surface">142</span>
                <span className="text-on-surface-variant/60 font-body-sm">Units ($18.5M Value)</span>
              </div>
              <div className="mt-4 flex gap-1 h-2 rounded-full overflow-hidden">
                <div className="bg-primary animate-w-fill" style={{ width: "45%" }}></div>
                <div className="bg-secondary animate-w-fill" style={{ width: "35%" }}></div>
                <div className="bg-outline-variant animate-w-fill" style={{ width: "20%" }}></div>
              </div>
            </div>
          </div>

          {/* Leads */}
          <div title="Active CRM Leads Overview" className="glass-card p-6 rounded-xl flex flex-col justify-between shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade" style={{ animationDelay: '250ms' }}>
            <div className="flex items-center justify-between mb-4 relative z-10">
              <div className="w-12 h-12 bg-primary-container/10 text-primary-container rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined">group_add</span>
              </div>
              <span title="New leads added this month" className="text-secondary font-label-md bg-secondary/10 px-2 py-0.5 rounded-full">+48 New</span>
            </div>
            <div className="relative z-10">
              <span className="text-on-surface-variant font-label-md uppercase tracking-wider">Total Leads</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="font-display-lg font-bold text-on-surface">1,204</span>
                <span className="text-on-surface-variant/60 font-body-sm">Active CRM</span>
              </div>
              <div className="mt-4 flex items-center gap-4 text-body-sm">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-error rounded-full"></span>
                  <span className="font-bold">84 Hot</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-secondary rounded-full"></span>
                  <span>312 Warm</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bento Grid Section: Charts & Tables */}
        <div className="grid grid-cols-12 gap-6 mb-8 relative z-10">
          
          {/* Revenue Trends */}
          <div className="col-span-12 lg:col-span-8 glass-card p-6 rounded-xl shadow-sm border border-outline-variant/30 relative opacity-0 animate-card-fade" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="font-display-md text-on-surface">Revenue &amp; Payment Trends</h3>
              <select 
                title="Select time period filter"
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="bg-surface-container-low border-none rounded-lg text-label-md px-3 py-1.5 focus:ring-1 focus:ring-primary/20 outline-none text-on-surface font-semibold"
              >
                <option value="Last 6 Months">Last 6 Months</option>
                <option value="Last Year">Last Year</option>
              </select>
            </div>
            <div className="relative h-64 flex gap-4 pl-12 pr-2">
              <div className="absolute inset-0 left-12 flex flex-col justify-between pointer-events-none z-0">
                <div className="w-full border-t border-outline-variant/20 flex items-center"><span className="absolute -left-12 text-[11px] font-bold text-on-surface-variant/60">$2.0M</span></div>
                <div className="w-full border-t border-outline-variant/20 flex items-center"><span className="absolute -left-12 text-[11px] font-bold text-on-surface-variant/60">$1.5M</span></div>
                <div className="w-full border-t border-outline-variant/20 flex items-center"><span className="absolute -left-12 text-[11px] font-bold text-on-surface-variant/60">$1.0M</span></div>
                <div className="w-full border-t border-outline-variant/20 flex items-center"><span className="absolute -left-12 text-[11px] font-bold text-on-surface-variant/60">$0.5M</span></div>
                <div className="w-full border-t border-outline-variant/40 flex items-center"></div>
              </div>

              {chartData[selectedFilter].map((item, idx) => (
                <div key={idx} title={`Month: ${item.label}`} className="flex-1 flex flex-col items-center justify-end h-full gap-2 group relative z-10">
                  <div className="w-full bg-surface-container-highest/60 rounded-t-lg relative flex items-end overflow-hidden h-full">
                    <div className="w-full bg-primary/40 transition-all duration-700 ease-out animate-h-fill" style={{ height: item.top }}></div>
                    <div className="absolute bottom-0 w-full bg-primary transition-all duration-700 ease-out animate-h-fill" style={{ height: item.bot }}></div>
                  </div>
                  <span className="text-label-md text-on-surface-variant font-semibold absolute -bottom-6">{item.label}</span>
                </div>
              ))}
            </div>
            <div className="mt-12 flex items-center gap-6 justify-center relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                <span className="text-body-sm text-on-surface-variant">Confirmed Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary/40 rounded-full"></span>
                <span className="text-body-sm text-on-surface-variant">Projected Cashflow</span>
              </div>
            </div>
          </div>

          {/* Lead Source Circle Tracker Box */}
          <div className="col-span-12 lg:col-span-4 glass-card p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col opacity-0 animate-card-fade" style={{ animationDelay: '350ms' }}>
            <h3 className="font-display-md text-on-surface mb-8 relative z-10">Lead Source</h3>
            <div className="flex-1 flex flex-col items-center justify-center relative z-10">
              <div className="relative w-48 h-48 animate-circle" title="1,200 Total Incoming Leads Distribution">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path className="text-surface-container" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="transparent" stroke="currentColor" strokeWidth="3"></path>
                  <path className="text-primary transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="transparent" stroke="currentColor" strokeDasharray="45, 100" strokeLinecap="round" strokeWidth="3"></path>
                  <path className="text-secondary transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="transparent" stroke="currentColor" strokeDasharray="25, 100" strokeDashoffset="-45" strokeLinecap="round" strokeWidth="3"></path>
                  <path className="text-tertiary transition-all duration-1000 ease-out" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831" fill="transparent" stroke="currentColor" strokeDasharray="15, 100" strokeDashoffset="-70" strokeLinecap="round" strokeWidth="3"></path>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-display-lg font-bold">1.2k</span>
                  <span className="text-label-md text-on-surface-variant">Total</span>
                </div>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-2 w-full">
                <div title="45% Digital Ads" className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span><span className="text-body-sm">Digital Ads</span></div>
                  <span className="font-bold text-body-sm">45%</span>
                </div>
                <div title="25% Customer Referrals" className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-secondary"></span><span className="text-body-sm">Referrals</span></div>
                  <span className="font-bold text-body-sm">25%</span>
                </div>
                <div title="15% Organic Search" className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-tertiary"></span><span className="text-body-sm">Organic</span></div>
                  <span className="font-bold text-body-sm">15%</span>
                </div>
                <div title="15% Property Events" className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-outline-variant"></span><span className="text-body-sm">Events</span></div>
                  <span className="font-bold text-body-sm">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bento Grid Layer 2: AI Panel & Tables Row */}
        <div className="grid grid-cols-12 gap-6 mb-8 relative z-10">
          
          {/* AI Insights Segment */}
          <div className="col-span-12 lg:col-span-4 bg-primary text-white p-6 rounded-xl shadow-lg relative overflow-hidden group opacity-0 animate-card-fade" style={{ animationDelay: '400ms' }}>
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-700"></div>
            <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-secondary/20 rounded-full blur-2xl"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-md">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <h3 className="font-display-md">AI Sales Insights</h3>
              </div>
              <div className="flex flex-col gap-4">
                <div title="Click to view urgent lead followups" className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all">
                  <p className="text-body-sm font-medium">3 Hot leads in 'The Atrium' project have reached 48hrs without follow-up.</p>
                  <span className="text-[11px] text-white/60 mt-2 block font-bold uppercase tracking-widest">Urgent Action</span>
                </div>
                <div title="Click to view forecast details" className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all">
                  <p className="text-body-sm font-medium">Revenue projection for Q3 increased by 15% based on current registration pace.</p>
                  <span className="text-[11px] text-white/60 mt-2 block font-bold uppercase tracking-widest">Portfolio Forecast</span>
                </div>
                <div title="Click to open customer workflow" className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-all">
                  <p className="text-body-sm font-medium">Customer 'A. Miller' just cleared a $250k milestone. Ready for Registry.</p>
                  <span className="text-[11px] text-white/60 mt-2 block font-bold uppercase tracking-widest">Workflow Trigger</span>
                </div>
              </div>
              
              <button title="Launch full deep-dive analytical drawer" onClick={() => setActiveDrawer('aiInsights')} className="w-full mt-6 py-3 bg-white text-primary rounded-xl font-bold text-label-md hover:shadow-xl transition-all active:scale-95">Launch AI Deep Dive</button>
            
            </div>
          </div>

          {/* Recent Bookings Complete Table */}
          <div className="col-span-12 lg:col-span-8 glass-card rounded-xl shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade" style={{ animationDelay: '450ms' }}>
            <div className="p-6 flex items-center justify-between border-b border-outline-variant/30">
              <h3 className="font-display-md text-on-surface">Recent Bookings</h3>
              <button title="View complete list of bookings" className="text-primary font-label-md hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto p-2">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-on-surface-variant font-label-md uppercase tracking-wider text-[11px]">
                    <th className="px-6 py-2">Property / Unit</th>
                    <th className="px-6 py-2">Customer</th>
                    <th className="px-6 py-2">Amount</th>
                    <th className="px-6 py-2">Status</th>
                    <th className="px-6 py-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>

                  {/* Booking Row 1 */}
                  <tr className="bg-transparent hover:bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative z-0 hover:z-10 rounded-xl group">
                    <td className="px-6 py-4 rounded-l-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">The Atrium, Suite 402</span>
                        <span className="text-[12px] text-on-surface-variant">Commercial • Phase 2</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface">Nexus Capital Group</td>
                    <td className="px-6 py-4 font-mono font-bold text-on-surface">$520,000</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-secondary/10 text-secondary font-label-md text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Site Visit
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-xl relative action-menu-container">
                      <button 
                        title="Actions menu for Suite 402"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === 'action_0' ? null : 'action_0');
                        }} 
                        className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {/* Action Dropdown Menu */}
                      <div className={`absolute right-4 top-12 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 z-30 ${activeDropdown === 'action_0' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                        <div className="p-1 text-left">
                          <button onClick={() => handleBookingAction('View Details', 'The Atrium, Suite 402')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">visibility</span> View Details</button>
                          <button onClick={() => handleBookingAction('Edit Booking', 'The Atrium, Suite 402')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">edit</span> Edit Booking</button>
                          <button onClick={() => handleBookingAction('Download Invoice', 'The Atrium, Suite 402')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">receipt</span> Invoice</button>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Booking Row 2 */}
                  <tr className="bg-transparent hover:bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative z-0 hover:z-10 rounded-xl group">
                    <td className="px-6 py-4 rounded-l-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">Skyline Tower, Apt 18B</span>
                        <span className="text-[12px] text-on-surface-variant">Residential • High-Rise</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface">Sarah J. Wellington</td>
                    <td className="px-6 py-4 font-mono font-bold text-on-surface">$1,250,000</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container font-label-md text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-tertiary"></span> Registration
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-xl relative action-menu-container">
                      <button 
                        title="Actions menu for Apt 18B"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === 'action_1' ? null : 'action_1');
                        }} 
                        className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {/* Action Dropdown Menu */}
                      <div className={`absolute right-4 top-12 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 z-30 ${activeDropdown === 'action_1' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                        <div className="p-1 text-left">
                          <button onClick={() => handleBookingAction('View Details', 'Skyline Tower, Apt 18B')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">visibility</span> View Details</button>
                          <button onClick={() => handleBookingAction('Edit Booking', 'Skyline Tower, Apt 18B')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">edit</span> Edit Booking</button>
                          <button onClick={() => handleBookingAction('Download Invoice', 'Skyline Tower, Apt 18B')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">receipt</span> Invoice</button>
                        </div>
                      </div>
                    </td>
                  </tr>

                  {/* Booking Row 3 */}
                  <tr className="bg-transparent hover:bg-surface-container-lowest transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative z-0 hover:z-10 rounded-xl group">
                    <td className="px-6 py-4 rounded-l-xl">
                      <div className="flex flex-col">
                        <span className="font-bold text-on-surface">Meadow Gardens, Villa 12</span>
                        <span className="text-[12px] text-on-surface-variant">Luxury • Villa</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-on-surface">Dr. Robert Chen</td>
                    <td className="px-6 py-4 font-mono font-bold text-on-surface">$890,000</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary font-label-md text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary"></span> Booking
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right rounded-r-xl relative action-menu-container">
                      <button 
                        title="Actions menu for Villa 12"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveDropdown(activeDropdown === 'action_2' ? null : 'action_2');
                        }} 
                        className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant transition-colors active:scale-95"
                      >
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>

                      {/* Action Dropdown Menu */}
                      <div className={`absolute right-4 top-12 w-44 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 z-30 ${activeDropdown === 'action_2' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
                        <div className="p-1 text-left">
                          <button onClick={() => handleBookingAction('View Details', 'Meadow Gardens, Villa 12')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">visibility</span> View Details</button>
                          <button onClick={() => handleBookingAction('Edit Booking', 'Meadow Gardens, Villa 12')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">edit</span> Edit Booking</button>
                          <button onClick={() => handleBookingAction('Download Invoice', 'Meadow Gardens, Villa 12')} className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold hover:bg-surface-container rounded-lg text-on-surface"><span className="material-symbols-outlined text-[16px]">receipt</span> Invoice</button>
                        </div>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Construction Progress & Funnel Efficiency Grid Rows */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 relative z-10">
          
          {/* Construction Progress */}
          <div className="glass-card p-6 rounded-xl shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade" style={{ animationDelay: '500ms' }}>
            <h3 className="font-display-md text-on-surface mb-6 relative z-10">Construction Milestone Progress</h3>
            <div className="space-y-6 relative z-10">
              <div title="The Atrium Plaza: 88% completed" className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-bold">The Atrium Plaza</span>
                  <span className="text-on-surface-variant">88% Complete</span>
                </div>
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden relative">
                  <div className="bg-primary h-full rounded-full animate-w-fill" style={{ width: "88%" }}></div>
                  <div className="absolute top-0 bottom-0 right-[12%] w-[1px] bg-white/20"></div>
                </div>
              </div>
              <div title="Horizon Heights: 42% completed" className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-bold">Horizon Heights (Phase 1)</span>
                  <span className="text-on-surface-variant">42% Complete</span>
                </div>
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                  <div className="bg-secondary h-full rounded-full animate-w-fill" style={{ width: "42%" }}></div>
                </div>
              </div>
              <div title="Oakwood Estates: 15% completed" className="flex flex-col gap-2">
                <div className="flex justify-between items-center text-body-sm">
                  <span className="font-bold">Oakwood Estates</span>
                  <span className="text-on-surface-variant">15% Complete</span>
                </div>
                <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                  <div className="bg-tertiary-container h-full rounded-full animate-w-fill" style={{ width: "15%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Funnel Efficiency Panels */}
          <div className="glass-card p-6 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col opacity-0 animate-card-fade" style={{ animationDelay: '550ms' }}>
            <h3 className="font-display-md text-on-surface mb-6 relative z-10">Sales Funnel Efficiency</h3>
            <div className="flex-1 flex flex-col gap-3 justify-center relative z-10">
              
              <div title="Total leads conversion pool" className="relative h-12 bg-blue-500/10 rounded-xl flex items-center px-6 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-blue-600 animate-w-fill opacity-20" style={{ width: "100%" }}></div>
                <div className="relative flex-1 flex items-center justify-between">
                  <span className="font-label-md text-blue-700">Leads (1,204)</span>
                  <span className="font-bold text-blue-700">100%</span>
                </div>
              </div>
              <div className="flex justify-center"><span className="material-symbols-outlined text-outline-variant">keyboard_arrow_down</span></div>
              
              <div title="65% leads converted to Site Visits" className="relative h-12 bg-red-500/10 rounded-xl flex items-center px-6 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-red-600 animate-w-fill opacity-20" style={{ width: "65%" }}></div>
                <div className="relative flex-1 flex items-center justify-between">
                  <span className="font-label-md text-red-700">Site Visits (782)</span>
                  <span className="font-bold text-red-700">65%</span>
                </div>
              </div>
              <div className="flex justify-center"><span className="material-symbols-outlined text-outline-variant">keyboard_arrow_down</span></div>
              
              <div title="28% site visits converted to Bookings" className="relative h-12 bg-green-500/10 rounded-xl flex items-center px-6 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-green-600 animate-w-fill opacity-20" style={{ width: "28%" }}></div>
                <div className="relative flex-1 flex items-center justify-between">
                  <span className="font-label-md text-green-700">Bookings (337)</span>
                  <span className="font-bold text-green-700">28%</span>
                </div>
              </div>
              <div className="flex justify-center"><span className="material-symbols-outlined text-outline-variant">keyboard_arrow_down</span></div>
              
              <div title="12% bookings converted to Final Registrations" className="relative h-12 bg-gray-800/10 rounded-xl flex items-center px-6 overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 bg-gray-900 animate-w-fill opacity-20" style={{ width: "12%" }}></div>
                <div className="relative flex-1 flex items-center justify-between">
                  <span className="font-label-md text-gray-900">Registrations (144)</span>
                  <span className="font-bold text-gray-900">12%</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tasks Framework Schedule Rows */}
        <div className="glass-card p-6 rounded-xl shadow-sm border border-outline-variant/30 opacity-0 animate-card-fade relative z-10" style={{ animationDelay: '600ms' }}>
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h3 className="font-display-md text-on-surface">Today's High-Priority Tasks</h3>
            <div className="flex items-center gap-2">
              <button title="Previous day tasks" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
              <span className="font-label-md px-2">July 24, 2024</span>
              <button title="Next day tasks" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            <div title="Click to open callback task details" className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-error/10 text-error flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">phone_callback</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-on-surface text-body-sm">Follow-up with Marcus V.</span>
                <span className="text-body-sm text-on-surface-variant">Re: Payment Plan Modification</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span className="text-[12px] font-medium text-on-surface-variant">09:30 AM</span>
                </div>
              </div>
            </div>
            <div title="Click to open site visit schedule" className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">location_on</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-on-surface text-body-sm">Site Visit: The Atrium</span>
                <span className="text-body-sm text-on-surface-variant">Prospect: Global Tech Solutions</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span className="text-[12px] font-medium text-on-surface-variant">02:00 PM</span>
                </div>
              </div>
            </div>
            <div title="Click to view registry task details" className="flex items-start gap-4 p-4 rounded-xl border border-outline-variant/20 bg-surface-container-lowest hover:border-primary/40 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">draw</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-bold text-on-surface text-body-sm">Sign Registry Documents</span>
                <span className="text-body-sm text-on-surface-variant">Client: Wellington Estate</span>
                <div className="flex items-center gap-2 mt-2">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>
                  <span className="text-[12px] font-medium text-on-surface-variant">04:30 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>

      {/* Shared Dark Overlay Background */}
      <div 
        onClick={() => setActiveDrawer(null)}
        className={`fixed inset-0 bg-[#00174c]/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${activeDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      ></div>

      {/* Base Slide-in Drawer Container */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-surface-container-lowest shadow-2xl z-50 transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${activeDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* DRAWER 1: AI ASSISTANT */}
        {activeDrawer === 'aiAssistant' && (
          <div className="flex-1 flex flex-col h-full bg-surface-container-lowest">
            <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <div>
                  <h2 className="text-lg font-bold text-primary leading-tight">AI Assistant</h2>
                  <p className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">Online</p>
                </div>
              </div>
              <button title="Close drawer" onClick={() => setActiveDrawer(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-outline-variant/30 text-on-surface-variant transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
              <div className="flex items-start gap-3 w-5/6">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-primary">smart_toy</span>
                </div>
                <div className="bg-surface-container-low p-4 rounded-2xl rounded-tl-sm text-body-sm text-on-surface shadow-sm border border-outline-variant/20">
                  Hello! I am your RealtyOne ERP AI Assistant. I can analyze sales data, check pending bookings, or summarize customer profiles. How can I help you today?
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button title="Quick prompt: Show today's sales" className="text-[12px] font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  Show today's sales
                </button>
                <button title="Quick prompt: Pending bookings" className="text-[12px] font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  Pending bookings
                </button>
                <button title="Quick prompt: Customer follow ups" className="text-[12px] font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  Customer follow ups
                </button>
                <button title="Quick prompt: Revenue summary" className="text-[12px] font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                  Revenue summary
                </button>
              </div>
            </div>

            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-low">
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  placeholder="Ask anything about your portfolio..." 
                  className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-full pl-4 pr-12 py-3 text-body-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                />
                <button title="Send Message" className="absolute right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center hover:bg-secondary transition-colors shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">send</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DRAWER 2: AI SALES INSIGHTS */}
        {activeDrawer === 'aiInsights' && (
          <div className="flex-1 flex flex-col h-full bg-surface-container-lowest overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant/30 bg-primary relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex items-center gap-3 relative z-10">
                <span className="material-symbols-outlined text-white text-[28px]">query_stats</span>
                <h2 className="text-lg font-bold text-white tracking-tight">AI Sales Insights</h2>
              </div>
              <button title="Close drawer" onClick={() => setActiveDrawer(null)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-surface-container-low">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div title="Today's confirmed revenue" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Today's Revenue</span>
                  <span className="text-lg font-bold text-primary">$425,000</span>
                </div>
                <div title="Total unit bookings created today" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Today's Bookings</span>
                  <span className="text-lg font-bold text-secondary">14 Units</span>
                </div>
                <div title="Current overall lead conversion rate" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Conversion Rate</span>
                  <span className="text-lg font-bold text-on-surface flex items-center gap-1">8.4% <span className="material-symbols-outlined text-secondary text-[16px]">trending_up</span></span>
                </div>
                <div title="Outstanding pending milestone collections" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-col justify-center">
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">Pending Payments</span>
                  <span className="text-lg font-bold text-error">$1.2M</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div title="Highest converting real estate project" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-tertiary">star</span>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Top Performing Project</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-on-surface">The Atrium Plaza</p>
                    <span className="text-body-sm font-bold text-secondary">42 Sales</span>
                  </div>
                </div>

                <div title="Pipeline state for hot leads" className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/30 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-error">local_fire_department</span>
                    <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Hot Leads Pipeline</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden mt-3 mb-1">
                     <div className="bg-error h-full rounded-full" style={{ width: "85%" }}></div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant font-bold text-right">85 Active Negotiations</p>
                </div>
              </div>

              <div className="bg-primary-container p-5 rounded-xl text-white shadow-md relative overflow-hidden">
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                   <span className="material-symbols-outlined text-[100px]">psychology</span>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-primary-container mb-3 block opacity-80">AI Recommendations</span>
                <ul className="space-y-3 relative z-10 text-body-sm">
                  <li className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Focus follow-ups on "Horizon Heights" Phase 1 due to high organic interest this week.
                  </li>
                  <li className="flex gap-2 items-start">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                    Send payment reminders to 14 clients currently in the 7-day grace period.
                  </li>
                </ul>
              </div>

            </div>

            <div className="p-4 border-t border-outline-variant/30 bg-surface-container-lowest flex gap-3">
              <button title="Refresh AI insights data" className="flex-1 py-2.5 bg-surface-container hover:bg-outline-variant/30 text-on-surface rounded-xl font-label-md flex items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
              </button>
              <button title="Generate downloadable summary report" className="flex-1 py-2.5 bg-primary text-white rounded-xl font-label-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95">
                <span className="material-symbols-outlined text-[18px]">summarize</span> Full Report
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}