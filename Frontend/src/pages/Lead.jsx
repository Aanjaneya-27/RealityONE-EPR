import { useState, useEffect } from "react";
import axios from "axios";

export default function Leads() {
  const [selectedLead, setSelectedLead] = useState(null);
  const [viewMode, setViewMode] = useState("kanban"); 
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  const [leadsList, setLeadlist] = useState ([
    { 
      id: "L-101", name: "Marcus Thorne", desc: "Interested in Skyview Penthouse", 
      tag: "Hot Lead", star: "92", source: "Website", type: "Residential", 
      status: "NEW LEADS", email: "m.thorne@venturecap.com", phone: "+1 (555) 012-9934", 
      location: "New York, USA", propertyType: "Luxury Penthouse", budget: "$4.5M - $6.2M",
      desiredArea: "Downtown / Upper East", aiScore: "94",
      aiReason: "Marcus has viewed the virtual tour 4 times in the last 48 hours.",
      whatsappLog: "Hi Marcus, I've just sent over the revised floor plans for the penthouse.",
      siteVisitLog: "Conducted tour of Building A. Prospect showed high interest."
    },
    { 
      id: "L-102", name: "Sophia Chen", desc: "Looking for 2BHK in Downtown", 
      tag: "Warm", star: "78", source: "Referral", type: "Residential", 
      status: "NEW LEADS", email: "sophia.chen@techglobal.io", phone: "+1 (555) 321-7654", 
      location: "San Francisco, USA", propertyType: "Premium 2BHK Apartment", budget: "$1.2M - $1.8M",
      desiredArea: "Downtown Financial District", aiScore: "78",
      aiReason: "Sophia interacted with our email newsletter referral link twice today.",
      whatsappLog: "Hello Sophia, shared the premium 2BHK property portfolios over email.",
      siteVisitLog: "Site tour not initiated yet. Initial inquiry validation ongoing."
    },
    { 
      id: "L-103", name: "Julianne Moore", desc: "Corporate lease query - 10 units", 
      tag: "Follow up", star: "85", source: "Direct", type: "Commercial", 
      status: "CONTACTED", email: "j.moore@paramountcorp.com", phone: "+1 (555) 789-1122", 
      location: "Los Angeles, USA", propertyType: "Commercial Complex Lease", budget: "$8.0M - $12.0M",
      desiredArea: "Corporate Tech Park Zone", aiScore: "85",
      aiReason: "Corporate lead validated via direct B2B institutional outreach protocols.",
      whatsappLog: "Sent the commercial brochure. Waiting for budget confirmation.",
      siteVisitLog: "Initial site layout validation call completed."
    },
    { 
      id: "L-104", name: "Robert Patterson", desc: "Site: Emerald Heights - Unit 402", 
      tag: "Tomorrow", star: "96", source: "Campaign", type: "Residential", 
      status: "SITE VISIT SCHEDULED", email: "robert.p@studiosnexus.com", phone: "+1 (555) 456-7890", 
      location: "Chicago, USA", propertyType: "Emerald Heights Penthouse", budget: "$3.2M - $4.0M",
      desiredArea: "Emerald Heights Block A", aiScore: "96",
      aiReason: "Automated alert: High intent profile with scheduled on-site verification.",
      whatsappLog: "Hi Robert, confirming your site visit token for Emerald Heights tomorrow.",
      siteVisitLog: "Pre-inspection preparation ongoing."
    },
    { 
      id: "L-105", name: "Elena Rodriguez", desc: "Discussing payment milestones", 
      tag: "Offer Out", star: "Deal: $1.2M", source: "Direct", type: "Residential", 
      status: "NEGOTIATION", email: "elena.r@rodriguezlaw.com", phone: "+1 (555) 987-6543", 
      location: "Miami, USA", propertyType: "Waterfront Premium Villa", budget: "$2.5M - $3.5M",
      desiredArea: "Biscayne Bay Luxury Strip", aiScore: "91",
      aiReason: "Client reviewed the custom milestone ledger draft 3 times.",
      whatsappLog: "Hi Elena, dispatched the modified installment structure configuration sheet.",
      siteVisitLog: "Site tour completed. Client fully satisfied with beachfront parameters."
    }
  ]);

  useEffect(() => {
    let isMounted = true;
    const fetchLeads = async () => {
      try {
        const res = await axios.get("https://realityone-epr.onrender.com/api/leads/all");
        if (!isMounted) return;
        const dbLeads = res.data.data.map((lead) => ({
          id: `DB-${lead.id}`,
          name: lead.name,
          desc: lead.project_interest,
          tag: "New Lead",
          star: "90",
          source: "CRM",
          type: "Residential",
          status: "NEW LEADS",
          email: lead.email,
          phone: lead.phone,
          location: "",
          propertyType: lead.project_interest,
          budget: "",
          desiredArea: "",
          aiScore: "90",
          aiReason: "Lead imported from CRM.",
          whatsappLog: "No WhatsApp activity.",
          siteVisitLog: "No Site Visit."
        }));
        setLeadlist((prev) => [...prev, ...dbLeads]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLeads();
    return () => {
      isMounted = false;
    };
  }, []);

  const columns = [
    { id: "NEW LEADS", name: "NEW LEADS", color: "bg-blue-400" },
    { id: "CONTACTED", name: "CONTACTED", color: "bg-purple-400" },
    { id: "SITE VISIT SCHEDULED", name: "SITE VISIT SCHEDULED", color: "bg-orange-400" },
    { id: "NEGOTIATION", name: "NEGOTIATION", color: "bg-emerald-400" }
  ];

  const displayLeads = activeFilter === "All" ? leadsList : leadsList.filter(l => l.status === activeFilter);
  const displayColumns = activeFilter === "All" ? columns : columns.filter(c => c.id === activeFilter);

  const getTagStyles = (tag) => {
    switch(tag?.toLowerCase()) {
      case 'hot lead': return 'bg-red-50 text-red-700 border border-red-100';
      case 'warm': return 'bg-yellow-50 text-yellow-700 border border-yellow-100';
      case 'follow up': return 'bg-blue-50 text-blue-700 border border-blue-100';
      case 'tomorrow': return 'bg-orange-50 text-orange-700 border border-orange-100';
      case 'offer out': return 'bg-emerald-50 text-emerald-700 border border-emerald-100';
      default: return 'bg-gray-50 text-gray-700 border border-gray-100';
    }
  };

  const handleEditClick = (lead) => {
    setEditFormData(lead);
    setIsEditModalOpen(true);
  };

  // BACKEND INTEGRATED SUBMIT FUNCTION
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    // UI Update immediately
    setLeadlist(prev => prev.map(l => l.id === editFormData.id ? editFormData : l));
    if (selectedLead && selectedLead.id === editFormData.id) {
      setSelectedLead(editFormData);
    }
    setIsEditModalOpen(false);

    // Send data to Backend
    try {
      const cleanId = String(editFormData.id).replace('DB-', '').replace('L-', '');
      
      const response = await axios.put(`https://realityone-epr.onrender.com/api/leads/update/${cleanId}`, {
        name: editFormData.name,
        email: editFormData.email,
        phone: editFormData.phone,
        status: editFormData.status, 
        propertyType: editFormData.propertyType,
        budget: editFormData.budget,
        tag: editFormData.tag,
        source: editFormData.source,
        desc: editFormData.desc
      });

      if (response.data.success) {
        console.log("Database updated successfully!");
      }
    } catch (error) {
      console.error("Backend Error:", error);
      alert("Failed to save to database. Please check console.");
    }
  };

  const handleScheduleSiteVisit = () => {
    alert(`Scheduling Site Visit for ${selectedLead.name}...`);
  };

  const handleMoveToBooking = () => {
    alert(`Moving ${selectedLead.name} to Booking Phase...`);
  };

  const getTimelineProgress = (status) => {
    const stages = ["NEW LEADS", "CONTACTED", "SITE VISIT SCHEDULED", "NEGOTIATION"];
    const currentIndex = stages.indexOf(status);
    return { stages, currentIndex };
  };

  if (selectedLead !== null) {
    const { stages, currentIndex } = getTimelineProgress(selectedLead.status);
    
    return (
      <div className="fixed left-[260px] top-[64px] right-0 bottom-0 flex flex-col bg-[#F6F8FB] overflow-hidden select-none z-10">
        
        <div className="w-full flex-shrink-0 flex justify-between items-center bg-white border-b border-[#c4c6d3] h-16 px-6 relative z-20">
          <button 
            onClick={() => setSelectedLead(null)}
            className="flex items-center gap-2 text-[#444651] hover:text-[#012c7e] font-semibold text-sm transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            Back to Leads
          </button>
          <div className="flex gap-3">
            <span className="text-xs bg-[#eeedf5] text-[#444651] font-bold px-3 py-1.5 rounded-full flex items-center">
              Lead Profile: {selectedLead.name}
            </span>
            <button 
              onClick={() => handleEditClick(selectedLead)}
              className="h-8 px-4 bg-[#012c7e] hover:bg-[#012260] transition-all text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span> Edit
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-8 max-w-[1200px] mx-auto w-full space-y-6 hide-scrollbar relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden relative bg-[#012c7e] text-white flex items-center justify-center text-3xl font-black shrink-0">
                {selectedLead.name.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-[24px] font-bold text-[#1a1b21] tracking-tight">{selectedLead.name}</h2>
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-widest ${getTagStyles(selectedLead.tag)}`}>{selectedLead.tag}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-[#444651] text-sm">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">mail</span> {selectedLead.email}</span>
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-sm">call</span> {selectedLead.phone}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handleScheduleSiteVisit} className="flex items-center gap-2 px-6 py-3 border border-[#c4c6d3] text-gray-700 bg-white hover:bg-[#f4f3fa] transition-all rounded-xl font-medium text-sm cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">event</span> Schedule Site Visit
              </button>
              <button onClick={handleMoveToBooking} className="flex items-center gap-2 px-6 py-3 bg-[#012c7e] text-white hover:bg-[#254495] transition-all rounded-xl font-bold text-sm shadow-lg shadow-[#012c7e]/20 cursor-pointer">
                <span className="material-symbols-outlined text-[18px]">point_of_sale</span> Move to Booking
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#c4c6d3] p-6 shadow-sm w-full">
            <h3 className="font-semibold text-xs text-[#444651] uppercase tracking-widest mb-6">Lead Progression Pipeline</h3>
            <div className="relative flex items-center justify-between w-full px-4 sm:px-12">
              <div className="absolute left-[10%] right-[10%] top-1/2 -translate-y-1/2 h-1 bg-[#eeedf5] z-0"></div>
              <div 
                className="absolute left-[10%] top-1/2 -translate-y-1/2 h-1 bg-[#012c7e] z-0 transition-all duration-500"
                style={{ width: `${(currentIndex / (stages.length - 1)) * 80}%` }}
              ></div>
              
              {stages.map((stage, idx) => {
                const isActive = idx <= currentIndex;
                const isCurrent = idx === currentIndex;
                return (
                  <div key={stage} className="relative z-10 flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors border-2 ${
                      isActive ? 'bg-[#012c7e] text-white border-[#012c7e]' : 'bg-white text-[#c4c6d3] border-[#c4c6d3]'
                    }`}>
                      {isActive ? <span className="material-symbols-outlined text-[16px]">check</span> : idx + 1}
                    </div>
                    <span className={`absolute top-10 text-[10px] font-bold uppercase tracking-wider text-center w-24 -ml-12 left-1/2 ${
                      isCurrent ? 'text-[#012c7e]' : isActive ? 'text-[#444651]' : 'text-gray-400'
                    }`}>
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className="h-8"></div>
          </div>

          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 lg:col-span-4 space-y-6">
              <div className="bg-white rounded-xl border border-[#c4c6d3] p-6 shadow-sm">
                <h3 className="font-semibold text-xs text-[#444651] uppercase tracking-widest mb-4">AI Purchase Intent</h3>
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-5xl font-extrabold text-[#012c7e]">{selectedLead.aiScore}</span>
                  <span className="text-[#444651] font-bold text-xl mb-1">/100</span>
                </div>
                <div className="w-full bg-[#eeedf5] h-2.5 rounded-full mb-6 overflow-hidden">
                  <div className="bg-[#012c7e] h-full rounded-full" style={{ width: `${selectedLead.aiScore}%` }}></div>
                </div>
                <p className="text-sm text-[#444651] leading-relaxed font-medium">
                  <span className="font-bold text-[#012c7e]">System Metrics Insight.</span> {selectedLead.aiReason}
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#c4c6d3] p-6 shadow-sm">
                <h3 className="font-semibold text-xs text-[#444651] uppercase tracking-widest mb-6">Requirements</h3>
                <div className="space-y-4 text-sm font-medium">
                  <div className="flex justify-between items-center border-b border-[#eeedf5] pb-3">
                    <span className="text-[#444651]">Property Type</span>
                    <span className="text-[#1a1b21] font-bold">{selectedLead.propertyType}</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-[#eeedf5] pb-3">
                    <span className="text-[#444651]">Budget</span>
                    <span className="text-[#1a1b21] font-bold">{selectedLead.budget}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#444651]">Desired Area</span>
                    <span className="text-[#1a1b21] font-bold text-right">{selectedLead.desiredArea}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-8 bg-white rounded-xl border border-[#c4c6d3] shadow-sm flex flex-col min-h-[400px]">
              <div className="p-6 border-b border-[#c4c6d3] flex justify-between items-center bg-[#f4f3fa]/30">
                <h3 className="font-semibold text-xs text-[#444651] uppercase tracking-widest">Activity & Communication</h3>
              </div>
              <div className="p-6 space-y-8">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-lg">chat</span>
                  </div>
                  <div className="absolute left-4 top-8 bottom-0 w-[2px] bg-[#c4c6d3] -mb-8"></div>
                  <div className="mb-1 flex justify-between items-center text-sm">
                    <span className="font-bold text-[#1a1b21]">WhatsApp Timeline Log</span>
                    <span className="text-[#444651]">Delivered</span>
                  </div>
                  <div className="bg-[#f4f3fa] rounded-xl p-4 border border-[#c4c6d3] text-sm">
                    <p className="text-[#1a1b21] leading-relaxed">"{selectedLead.whatsappLog}"</p>
                  </div>
                </div>
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-8 h-8 bg-[#012c7e] text-white rounded-full flex items-center justify-center z-10">
                    <span className="material-symbols-outlined text-lg">groups</span>
                  </div>
                  <div className="mb-1 flex justify-between items-center text-sm">
                    <span className="font-bold text-[#1a1b21]">Site Activity Ledger</span>
                  </div>
                  <div className="bg-white rounded-xl p-4 border border-[#c4c6d3] text-sm text-[#444651]">
                    <p>{selectedLead.siteVisitLog}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {isEditModalOpen && (
          <div className="fixed inset-0 bg-[#00174c]/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-[#c4c6d3]">
                <h2 className="text-lg font-bold text-[#1a1b21]">Edit Lead Details</h2>
                <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              <div className="p-6 overflow-y-auto flex-1 font-medium text-sm">
                <form id="editLeadForm" onSubmit={handleEditSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Full Name</label>
                      <input type="text" value={editFormData.name || ''} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e]" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Email Address</label>
                      <input type="email" value={editFormData.email || ''} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e]" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Phone Number</label>
                      <input type="text" value={editFormData.phone || ''} onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e]" required />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Pipeline Stage (Status)</label>
                      <select value={editFormData.status || ''} onChange={(e) => setEditFormData({...editFormData, status: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e] bg-white cursor-pointer">
                        <option value="NEW LEADS">NEW LEADS</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="SITE VISIT SCHEDULED">SITE VISIT SCHEDULED</option>
                        <option value="NEGOTIATION">NEGOTIATION</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Property Type</label>
                      <input type="text" value={editFormData.propertyType || ''} onChange={(e) => setEditFormData({...editFormData, propertyType: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Budget Range</label>
                      <input type="text" value={editFormData.budget || ''} onChange={(e) => setEditFormData({...editFormData, budget: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e]" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Urgency Tag</label>
                      <select value={editFormData.tag || ''} onChange={(e) => setEditFormData({...editFormData, tag: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e] bg-white cursor-pointer">
                        <option value="Hot Lead">Hot Lead</option>
                        <option value="Warm">Warm</option>
                        <option value="Follow up">Follow up</option>
                        <option value="Tomorrow">Tomorrow</option>
                        <option value="Offer Out">Offer Out</option>
                        <option value="New Lead">New Lead</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-gray-600">Lead Source</label>
                      <select value={editFormData.source || ''} onChange={(e) => setEditFormData({...editFormData, source: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e] bg-white cursor-pointer">
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Direct">Direct</option>
                        <option value="Campaign">Campaign</option>
                        <option value="CRM">CRM</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-semibold text-gray-600">Quick Description</label>
                    <textarea rows="2" value={editFormData.desc || ''} onChange={(e) => setEditFormData({...editFormData, desc: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-[#012c7e] resize-none"></textarea>
                  </div>
                </form>
              </div>

              <div className="p-4 border-t border-[#c4c6d3] flex justify-end gap-3 bg-gray-50 rounded-b-2xl">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="px-5 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer">
                  Cancel
                </button>
                <button type="submit" form="editLeadForm" className="px-5 py-2 bg-[#012c7e] text-white rounded-lg font-bold hover:bg-[#012260] shadow-md transition-all active:scale-95 cursor-pointer">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="fixed left-[260px] top-[64px] right-0 bottom-0 flex flex-col bg-[#faf8ff] p-6 overflow-hidden select-none">
      <div className="w-full flex-shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-[#e3e2e9] mb-4 relative z-20">
        <div>
          <h2 className="text-xl font-bold text-[#1a1b21] tracking-tight">Lead Pipeline</h2>
          <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
            <span className="px-2 py-0.5 bg-[#012c7e]/10 text-[#012c7e] rounded uppercase tracking-wider">Active Quarter</span>
            <span className="text-gray-300">•</span>
            <p className="text-[#444651]">Managing live full-stack pipeline automation secure filters</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-[#eeedf5] rounded-xl p-1 text-xs font-bold border border-[#c4c6d3]">
            <button 
              onClick={() => setViewMode("kanban")}
              className={`px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === "kanban" ? "bg-white shadow-sm text-[#012c7e]" : "text-[#444651] hover:bg-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">view_kanban</span> Kanban
            </button>
            <button 
              onClick={() => setViewMode("list")}
              className={`px-4 py-1.5 rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                viewMode === "list" ? "bg-white shadow-sm text-[#012c7e]" : "text-[#444651] hover:bg-white"
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span> List
            </button>
          </div>

          <div className="relative z-50">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="h-9 px-4 border border-[#c4c6d3] text-[#444651] bg-white hover:bg-[#f4f3fa] transition-all rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">filter_list</span> 
              {activeFilter === "All" ? "Filters" : activeFilter}
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-[#c4c6d3] rounded-xl shadow-lg overflow-hidden py-1">
                <div className="px-4 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Filter by Stage</div>
                {["All", "NEW LEADS", "CONTACTED", "SITE VISIT SCHEDULED", "NEGOTIATION"].map((stage) => (
                  <button 
                    key={stage}
                    onClick={() => {
                      setActiveFilter(stage);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-[#faf8ff] transition-colors cursor-pointer ${
                      activeFilter === stage ? "text-[#012c7e] bg-[#dbe1ff]/30" : "text-[#444651]"
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <button 
            onClick={() => alert("Please select a lead first to edit it.")}
            className="h-9 px-4 bg-[#012c7e] hover:bg-[#012260] transition-all text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm cursor-pointer z-10"
          >
            <span className="material-symbols-outlined text-[16px]">edit</span> Edit Lead
          </button>
        </div>
      </div>

      
      {viewMode === "kanban" && (
        <div className="flex-1 w-full overflow-x-auto flex gap-6 pt-2 pb-4 items-start hide-scrollbar relative z-10">
          {displayColumns.map((column) => {
            const columnLeads = displayLeads.filter(lead => lead.status === column.id);
            return (
              <div key={column.id} className="w-[320px] flex-shrink-0 flex flex-col h-full bg-transparent">
                <div className="flex-shrink-0 flex items-center justify-between mb-4 px-1 text-[11px] font-black text-[#444651] tracking-wider">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${column.color}`}></span>
                    <span>{column.name}</span>
                    <span className="bg-[#eeedf5] text-[#444651] px-1.5 py-0.5 rounded text-[10px] font-bold">{columnLeads.length}</span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-6 hide-scrollbar">
                  {columnLeads.map((lead) => (
                    <div 
                      key={lead.id}
                      onClick={() => setSelectedLead(lead)}
                      className="bg-white border border-[#c4c6d3] p-4 rounded-xl shadow-sm hover:border-[#012c7e]/40 hover:shadow-md transition-all cursor-pointer group space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${getTagStyles(lead.tag)}`}>{lead.tag}</span>
                        <div className="flex items-center gap-0.5 text-[#012c7e] font-bold text-xs">
                          <span className="material-symbols-outlined text-[15px]">star</span>
                          <span>{lead.star}</span>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-bold text-[#1a1b21] text-[15px] group-hover:text-[#012c7e] transition-colors">{lead.name}</h4>
                        <p className="text-xs text-[#444651] mt-0.5 line-clamp-2">{lead.desc}</p>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-[#444651] pt-1">
                        <span className="px-2 py-1 bg-[#eeedf5] rounded-md flex items-center gap-1">
                          <span className="material-symbols-outlined text-[13px]">{lead.source === 'Website' ? 'language' : 'share'}</span>
                          {lead.source}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {viewMode === "list" && (
        <div className="flex-1 w-full bg-white border border-[#c4c6d3] rounded-2xl shadow-sm flex flex-col mt-2 overflow-hidden relative z-10">
          <div className="flex-1 overflow-auto hide-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#f4f3fa] border-b border-[#c4c6d3] sticky top-0 z-10">
                <tr className="text-[#444651] font-bold text-[11px] uppercase tracking-wider">
                  <th className="px-6 py-4">Lead Name & Contact</th>
                  <th className="px-6 py-4">Current Stage</th>
                  <th className="px-6 py-4">Property Source</th>
                  <th className="px-6 py-4">Budget Range</th>
                  <th className="px-6 py-4">Intent Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eeedf5]">
                {displayLeads.length > 0 ? (
                  displayLeads.map(lead => (
                    <tr 
                      key={lead.id} 
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-[#faf8ff] cursor-pointer transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#012c7e] text-white flex items-center justify-center font-black text-sm shrink-0 group-hover:scale-105 transition-transform">
                            {lead.name.substring(0,2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-[#1a1b21] group-hover:text-[#012c7e] transition-colors">{lead.name}</p>
                            <div className="flex items-center gap-2 text-xs text-[#444651] mt-0.5">
                              <span>{lead.phone}</span>
                              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${getTagStyles(lead.tag)}`}>{lead.tag}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700">
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-[#1a1b21]">{lead.type}</span>
                          <span className="text-[10px] text-[#444651]">{lead.source}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-[#1a1b21] bg-[#f4f3fa] px-2.5 py-1 rounded-md">{lead.budget}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-2 bg-[#eeedf5] rounded-full overflow-hidden">
                            <div className="bg-[#012c7e] h-full rounded-full" style={{width: `${lead.aiScore}%`}}></div>
                          </div>
                          <span className="text-xs font-bold text-[#012c7e]">{lead.aiScore}</span>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-[#444651] font-medium">No leads match the selected filter.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}