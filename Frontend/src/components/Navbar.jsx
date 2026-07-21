

import { useState, useEffect, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios"; // 🔥 API ki jagah wapas axios laga diya hai 🔥

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeDrawer, setActiveDrawer] = useState(null); 
  const [activeDropdown, setActiveDropdown] = useState(null); 
  
  const { user, logout } = useContext(AuthContext);


  const [chatInput, setChatInput] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [messages, setMessages] = useState([]); 

  useEffect(() => {
    const resetTimer = setTimeout(() => {
      setMessages([]);
    }, 0);

    return () => clearTimeout(resetTimer);
  }, [location.pathname]);


  const handleSendMessage = async (suggestedText = null) => {
    const queryText = typeof suggestedText === "string" ? suggestedText : chatInput;
    
    if (!queryText.trim()) return;
    
    const newMessages = [...messages, { sender: "user", text: queryText }];
    setMessages(newMessages);
    
    if (typeof suggestedText !== "string") {
      setChatInput(""); 
    }
    
    setIsAiLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/ai/ask", { query: queryText });
      
      setMessages([...newMessages, { sender: "ai", text: res.data.answer }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages([...newMessages, { sender: "ai", text: "Oops! Backend se connect nahi ho pa raha." }]);
    } finally {
      setIsAiLoading(false);
    }
  };

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

  useEffect(() => {
    const handleClick = () => setActiveDropdown(null);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  const closeAll = () => {
    setActiveDrawer(null);
    setActiveDropdown(null);
  };

  const toggleDropdown = (name, e) => {
    e.stopPropagation(); 
    setActiveDropdown(activeDropdown === name ? null : name);
    setActiveDrawer(null);
  };

  const openDrawer = (name) => {
    setActiveDrawer(name);
    setActiveDropdown(null);
  };
  
  const handleNavigate = (path) => {
    navigate(path);
    closeAll();
  };

  const handleLogout = () => {
    logout(); 
    closeAll();
    navigate("/login");
  };

  const UserAvatar = ({ className }) => (
    <div className={`flex items-center justify-center font-bold text-white bg-[#012c7e] ${className}`}>
      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
    </div>
  );

  const getAIContext = () => {
    switch (location.pathname) {
      case "/leads":
        return {
          title: "Pipeline Intelligence",
          greeting: "Hello! I'm analyzing your current lead pipeline. Here are some quick actions you can take:",
          suggestions: [
            "Which leads have the highest intent score today?",
            "Summarize Marcus Thorne's recent activity.",
            "Show me leads looking for properties over $2M."
          ]
        };
      case "/inventory":
        return {
          title: "Inventory Intelligence",
          greeting: "Hello! I'm scanning your real estate inventory. How can I assist you with properties today?",
          suggestions: [
            "Show all available 3BHK units under $1.5M.",
            "Which properties have the highest inquiry rate?",
            "Are there any units pending maintenance?"
          ]
        };
      case "/crm":
        return {
          title: "Customer Intelligence",
          greeting: "Hello! I'm analyzing your customer relations database. Who should we connect with today?",
          suggestions: [
            "List clients who haven't been contacted in 30 days.",
            "Summarize feedback from last week's site visits.",
            "Show me the purchase history of Nexus Group."
          ]
        };
      case "/projects":
        return {
          title: "Project Intelligence",
          greeting: "Hello! I'm tracking your ongoing construction and development projects. What's the focus?",
          suggestions: [
            "What milestones are due this week?",
            "Summarize the compliance report for Emerald Heights.",
            "Show me pending tasks for the Marketing phase."
          ]
        };
      case "/sales":
      case "/finance":
      case "/payments":
        return {
          title: "Financial Intelligence",
          greeting: "Hello! I'm analyzing your ledgers, invoices, and revenue streams. Need financial insights?",
          suggestions: [
            "Generate a Q3 revenue projection report.",
            "What is our current sales conversion rate?"
          ]
        };
      case "/bookings":
      case "/booking":
        return {
          title: "Booking Intelligence",
          greeting: "Hello! I'm looking at your current allocations and booking drafts. What do you need?",
          suggestions: [
            "Show me unconfirmed bookings from this week.",
            "Which bookings are awaiting KYC approval?",
            "Calculate the total booking amount for July."
          ]
        };
      default:
        return {
          title: "Workspace Intelligence",
          greeting: "Hello! I'm your global RealtyOne AI Assistant. How can I help you manage your workspace today?",
          suggestions: [
            "Summarize my daily agenda and meetings.",
            "Which high-priority tasks are pending?",
            "Show me today's revenue projection."
          ]
        };
    }
  };

  const aiData = getAIContext();

  const QuickAddMenu = () => (
    <div onClick={(e) => e.stopPropagation()} className={`absolute right-0 top-full mt-2 w-48 bg-white border border-[#c4c6d3] rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 z-50 ${activeDropdown === 'quickAdd' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
      <div className="p-1 text-gray-800">
        <button onClick={() => handleNavigate('/crm')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[#f4f3fa] hover:text-[#012c7e] rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">add_reaction</span> New Lead
        </button>
        <button onClick={() => handleNavigate('/bookings')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[#f4f3fa] hover:text-[#012c7e] rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">post_add</span> New Booking
        </button>
        <button onClick={() => handleNavigate('/projects')} className="w-full flex items-center gap-3 px-3 py-2.5 text-sm hover:bg-[#f4f3fa] hover:text-[#012c7e] rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">domain_add</span> New Project
        </button>
      </div>
    </div>
  );

  const ProfileMenu = () => (
    <div onClick={(e) => e.stopPropagation()} className={`absolute right-0 top-full mt-2 w-56 bg-white border border-[#c4c6d3] rounded-xl shadow-xl overflow-hidden origin-top-right transition-all duration-200 z-50 ${activeDropdown === 'profile' ? 'scale-100 opacity-100 visible' : 'scale-95 opacity-0 invisible'}`}>
      <div className="px-4 py-3 border-b border-[#c4c6d3] bg-[#faf8ff]">
        <p className="text-sm font-bold text-[#012c7e] truncate">{user?.name || "User"}</p>
        <p className="text-xs text-gray-500 truncate">{user?.role || "Role"}</p>
      </div>
      <div className="p-1 text-gray-800">
        <button onClick={() => handleNavigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#f4f3fa] hover:text-[#012c7e] rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">person</span> My Profile
        </button>
        <button onClick={() => handleNavigate('/settings')} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#f4f3fa] hover:text-[#012c7e] rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">settings</span> Account Settings
        </button>
        
        <button onClick={() => handleNavigate('/support')} className="w-full flex items-center gap-3 px-3 py-2 text-sm hover:bg-[#f4f3fa] hover:text-[#012c7e] rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">help</span> Help
        </button>
        
        <div className="h-px bg-[#c4c6d3] my-1 mx-2"></div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#ba1a1a] hover:bg-[#ba1a1a]/10 rounded-lg transition-colors text-left">
          <span className="material-symbols-outlined text-[18px]">logout</span> Logout
        </button>
      </div>
    </div>
  );
  const headerClass = "flex justify-between items-center w-full h-16 px-6 bg-[#faf8ff]/90 backdrop-blur-md border-b border-[#c4c6d3] sticky top-0 z-40";

  const renderNavbar = () => {
    if (location.pathname === "/") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-6">
            <div className="relative group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 opacity-60">search</span>
              <input className="bg-[#f4f3fa] border-none rounded-xl pl-10 pr-4 py-2 w-80 text-sm focus:ring-2 focus:ring-[#012c7e]/20 transition-all outline-none" placeholder="Search portfolio, leads, or tasks..." type="text"/>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-4 border-r border-[#c4c6d3]">
              <button onClick={() => openDrawer('notifications')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eeedf5] transition-colors relative text-gray-600">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full"></span>
              </button>
              <button onClick={() => openDrawer('tasks')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eeedf5] transition-colors text-gray-600">
                <span className="material-symbols-outlined">task_alt</span>
              </button>
              <button onClick={() => openDrawer('calendar')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eeedf5] transition-colors text-gray-600">
                <span className="material-symbols-outlined">calendar_today</span>
              </button>
              <button onClick={() => openDrawer('chat')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eeedf5] transition-colors text-gray-600">
                <span className="material-symbols-outlined">chat_bubble</span>
              </button>
            </div>
            <div className="flex items-center gap-3 ml-2">
              <div className="relative">
                <button onClick={(e) => toggleDropdown('quickAdd', e)} className="bg-[#012c7e] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:opacity-90 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">add</span> Quick Add
                </button>
                <QuickAddMenu />
              </div>
              <div className="relative">
                <div onClick={(e) => toggleDropdown('profile', e)} className="w-10 h-10 rounded-full border-2 border-[#012c7e]/20 p-0.5 cursor-pointer overflow-hidden">
                  <UserAvatar className="w-full h-full rounded-full" />
                </div>
                <ProfileMenu />
              </div>
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/leads") {
      return (
        <header className={headerClass}>
          <div className="flex items-center flex-1">
            <div className="relative w-96 max-w-full group">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors">search</span>
              <input className="w-full bg-[#f4f3fa] border-none rounded-full pl-10 pr-4 h-10 text-sm focus:ring-2 focus:ring-[#012c7e]/20 focus:bg-white transition-all outline-none" placeholder="Search leads, clients, or properties..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => openDrawer('ai_assistant')} className="px-4 h-10 flex items-center gap-2 text-[#012c7e] font-bold hover:bg-[#012c7e]/5 transition-colors rounded-full text-sm">
              <span className="material-symbols-outlined text-[20px]">smart_toy</span> AI Assistant
            </button>
          
            <div className="h-8 w-[1px] bg-[#c4c6d3] mx-2"></div>
            <div className="flex items-center gap-1">
              <button onClick={() => openDrawer('notifications')} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#e3e2e9] rounded-full transition-colors">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button onClick={() => openDrawer('calendar')} className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-[#e3e2e9] rounded-full transition-colors">
                <span className="material-symbols-outlined">calendar_today</span>
              </button>
            </div>
            
            <div className="relative">
              <div onClick={(e) => toggleDropdown('profile', e)} className="ml-2 flex items-center gap-3 pl-3 border-l border-[#c4c6d3] cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-bold leading-none text-gray-800">{user?.name || "User"}</p>
                  <p className="text-[11px] text-gray-500">{user?.role || "Role"}</p>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-[#254495]/20 p-0.5">
                  <UserAvatar className="w-full h-full rounded-full" />
                </div>
              </div>
              <ProfileMenu />
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/crm") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-[#f4f3fa] border border-[#c4c6d3] rounded-xl text-sm focus:ring-1 focus:ring-[#012c7e] focus:border-[#012c7e] transition-all outline-none" placeholder="Search customers, properties, or files..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-[#c4c6d3] pr-4 mr-2">
              <button onClick={() => openDrawer('notifications')} className="p-2 hover:bg-[#e8e7ef] rounded-full transition-colors text-gray-600">
                <span className="material-symbols-outlined">notifications</span>
              </button>
              <button onClick={() => openDrawer('chat')} className="p-2 hover:bg-[#e8e7ef] rounded-full transition-colors text-gray-600">
                <span className="material-symbols-outlined">chat_bubble</span>
              </button>
              <button className="p-2 hover:bg-[#e8e7ef] rounded-full transition-colors text-gray-600">
                <span className="material-symbols-outlined">contrast</span>
              </button>
            </div>
            
            <div className="relative">
              <button onClick={(e) => toggleDropdown('quickAdd', e)} className="flex items-center gap-2 bg-[#012c7e] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all hover:shadow-lg active:scale-95">
                <span className="material-symbols-outlined text-[20px]">add</span> Quick Add
              </button>
              <QuickAddMenu />
            </div>
            
            <div className="relative">
              <div onClick={(e) => toggleDropdown('profile', e)} className="flex items-center gap-3 ml-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-gray-800 leading-none">{user?.name || "User"}</p>
                  <p className="text-[11px] text-gray-500">{user?.role || "Role"}</p>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#254495]">
                  <UserAvatar className="w-full h-full" />
                </div>
              </div>
              <ProfileMenu />
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/projects") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input className="w-full bg-[#f4f3fa] border-none rounded-full py-2 pl-10 pr-4 text-sm focus:ring-2 focus:ring-[#012c7e]/20 outline-none" placeholder="Search projects, documents, or team members..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex gap-2 mr-4">
              <div className="relative">
                <button onClick={(e) => toggleDropdown('quickAdd', e)} className="bg-[#012c7e] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-all active:scale-95">
                  <span className="material-symbols-outlined !text-lg">add</span> Quick Add
                </button>
                <QuickAddMenu />
              </div>
              <button onClick={() => openDrawer('ai_assistant')} className="bg-[#e3e2e9] text-[#012c7e] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#012c7e]/5 transition-all">
                <span className="material-symbols-outlined !text-lg">smart_toy</span> AI Assistant
              </button>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => openDrawer('notifications')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e3e2e9] transition-colors relative text-gray-600">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
              </button>
              <button onClick={() => openDrawer('calendar')} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e3e2e9] transition-colors text-gray-600">
                <span className="material-symbols-outlined">calendar_today</span>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#e3e2e9] transition-colors text-gray-600">
                <span className="material-symbols-outlined">contrast</span>
              </button>
            </div>
            <div className="h-8 w-px bg-[#c4c6d3] mx-2"></div>
            
            <div className="relative">
              <div onClick={(e) => toggleDropdown('profile', e)} className="flex items-center gap-3 pl-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden lg:block">
                  <p className="text-sm text-gray-800 font-bold">{user?.name || "User"}</p>
                  <p className="text-[11px] text-gray-500 uppercase">{user?.role || "Role"}</p>
                </div>
                <UserAvatar className="w-10 h-10 rounded-full border border-[#c4c6d3]" />
              </div>
              <ProfileMenu />
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/inventory") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input className="w-full bg-[#f4f3fa] border-none rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#012c7e]/20 outline-none transition-all" placeholder="Search by Property ID, Location or Price..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 text-gray-600">
              <button onClick={() => openDrawer('notifications')} className="material-symbols-outlined p-2 hover:bg-[#eeedf5] rounded-full transition-colors">notifications</button>
              <button onClick={() => openDrawer('calendar')} className="material-symbols-outlined p-2 hover:bg-[#eeedf5] rounded-full transition-colors">calendar_today</button>
              <button onClick={() => openDrawer('ai_assistant')} className="material-symbols-outlined p-2 hover:bg-[#eeedf5] rounded-full transition-colors text-[#012c7e]">smart_toy</button>
            </div>
            <div className="h-8 w-[1px] bg-[#c4c6d3]"></div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <button onClick={(e) => toggleDropdown('quickAdd', e)} className="bg-[#012c7e] text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all active:scale-95">Quick Add</button>
                <QuickAddMenu />
              </div>
              <div className="relative">
                <div onClick={(e) => toggleDropdown('profile', e)} className="w-10 h-10 cursor-pointer overflow-hidden rounded-full border-2 border-white shadow-sm">
                  <UserAvatar className="w-full h-full" />
                </div>
                <ProfileMenu />
              </div>
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/bookings" || location.pathname === "/booking") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-[#f4f3fa] border-none rounded-full text-sm focus:ring-2 focus:ring-[#012c7e]/20 outline-none" placeholder="Global search..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4 text-gray-600">
            <div className="flex items-center gap-1">
              <button onClick={() => openDrawer('notifications')} className="p-2 hover:text-[#012c7e] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <button onClick={() => openDrawer('calendar')} className="p-2 hover:text-[#012c7e] transition-colors"><span className="material-symbols-outlined">calendar_today</span></button>
              <button onClick={() => openDrawer('chat')} className="p-2 hover:text-[#012c7e] transition-colors"><span className="material-symbols-outlined">chat_bubble</span></button>
            </div>
            <div className="h-8 w-[1px] bg-[#c4c6d3] mx-2"></div>
            
            <div className="relative">
              <button onClick={(e) => toggleDropdown('quickAdd', e)} className="flex items-center gap-2 bg-[#012c7e] text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                <span className="material-symbols-outlined text-[20px]">add</span> Quick Add
              </button>
              <QuickAddMenu />
            </div>
            <div className="relative">
              <div onClick={(e) => toggleDropdown('profile', e)} className="w-10 h-10 cursor-pointer overflow-hidden rounded-full border-2 border-[#254495]">
                <UserAvatar className="w-full h-full" />
              </div>
              <ProfileMenu />
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/sales") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input className="w-full pl-10 pr-4 py-2 bg-[#f4f3fa] border-none rounded-xl focus:ring-2 focus:ring-[#012c7e]/20 text-sm outline-none" placeholder="Search invoices, customers, or properties..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 mr-4 text-gray-600">
              <button onClick={() => openDrawer('notifications')} className="p-2 hover:text-[#012c7e] transition-colors relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#ba1a1a] rounded-full border-2 border-white"></span>
              </button>
              <button onClick={() => openDrawer('tasks')} className="p-2 hover:text-[#012c7e] transition-colors"><span className="material-symbols-outlined">task_alt</span></button>
              <button onClick={() => openDrawer('calendar')} className="p-2 hover:text-[#012c7e] transition-colors"><span className="material-symbols-outlined">calendar_today</span></button>
              <button onClick={() => openDrawer('chat')} className="p-2 hover:text-[#012c7e] transition-colors"><span className="material-symbols-outlined">chat_bubble</span></button>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <button onClick={(e) => toggleDropdown('quickAdd', e)} className="bg-[#012c7e] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#254495] transition-all active:scale-95 shadow-sm">
                  <span className="material-symbols-outlined text-[18px]">add</span> Quick Add
                </button>
                <QuickAddMenu />
              </div>
              <button onClick={() => openDrawer('ai_assistant')} className="bg-[#e8e7ef] text-[#012c7e] px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-[#e3e2e9] transition-all active:scale-95">
                <span className="material-symbols-outlined text-[18px]">smart_toy</span> AI Insights
              </button>
            </div>
            <div className="w-px h-8 bg-[#c4c6d3] mx-2"></div>
            
            <div className="relative">
              <div onClick={(e) => toggleDropdown('profile', e)} className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="text-right hidden xl:block">
                  <p className="text-sm font-bold text-gray-800 leading-tight">{user?.name || "User"}</p>
                  <p className="text-[11px] text-gray-500">{user?.role || "Role"}</p>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                  <UserAvatar className="w-full h-full" />
                </div>
              </div>
              <ProfileMenu />
            </div>
          </div>
        </header>
      );
    }

    if (location.pathname === "/finance" || location.pathname === "/payments") {
      return (
        <header className={headerClass}>
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 max-w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">search</span>
              <input className="w-full bg-[#f4f3fa] border-none rounded-full pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#012c7e]/20 transition-all outline-none" placeholder="Search Ledgers, Bookings, or Receipts..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 border-r border-[#c4c6d3] pr-4 mr-2 text-gray-600">
              <button onClick={() => openDrawer('notifications')} className="p-2 hover:bg-[#e8e7ef] rounded-full transition-colors"><span className="material-symbols-outlined">notifications</span></button>
              <button onClick={() => openDrawer('chat')} className="p-2 hover:bg-[#e8e7ef] rounded-full transition-colors"><span className="material-symbols-outlined">chat_bubble</span></button>
              <button className="p-2 hover:bg-[#e8e7ef] rounded-full transition-colors"><span className="material-symbols-outlined">contrast</span></button>
            </div>
            <button onClick={() => openDrawer('ai_assistant')} className="flex items-center gap-2 bg-[#3e6ee3] text-white px-4 py-2 rounded-xl text-sm font-bold transition-all">
              <span className="material-symbols-outlined text-lg">smart_toy</span> AI Assistant
            </button>
            
            <div className="relative">
              <button onClick={(e) => toggleDropdown('quickAdd', e)} className="bg-[#012c7e] text-white px-4 py-2 rounded-xl text-sm font-bold hover:shadow-lg transition-all">
                Quick Add
              </button>
              <QuickAddMenu />
            </div>
          </div>
        </header>
      );
    }

    return (
      <header className={headerClass}>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 opacity-60">search</span>
            <input className="bg-[#f4f3fa] border-none rounded-xl pl-10 pr-4 py-2 w-80 text-sm focus:ring-2 focus:ring-[#012c7e]/20 transition-all outline-none" placeholder="Search..." type="text"/>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-600">
          <button onClick={() => openDrawer('notifications')} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-[#eeedf5] transition-colors"><span className="material-symbols-outlined">notifications</span></button>
          
          <div className="relative">
            <button onClick={(e) => toggleDropdown('quickAdd', e)} className="bg-[#012c7e] text-white text-sm font-semibold px-4 py-2 rounded-xl flex items-center gap-2"><span className="material-symbols-outlined text-[18px]">add</span> Quick Add</button>
            <QuickAddMenu />
          </div>

          <div className="relative">
            <div onClick={(e) => toggleDropdown('profile', e)} className="w-10 h-10 cursor-pointer overflow-hidden rounded-full hover:opacity-80 transition-opacity">
              <UserAvatar className="w-full h-full" />
            </div>
            <ProfileMenu />
          </div>
        </div>
      </header>
    );
  };

  return (
    <>
      {renderNavbar()}
      <div onClick={closeAll} className={`fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-[60] transition-opacity duration-300 ${activeDrawer ? 'opacity-100 visible' : 'opacity-0 invisible'}`}></div>

      {/* Global Slide-In Drawer Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] flex flex-col ${activeDrawer ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Drawer Header */}
        <div className={`flex items-center justify-between px-6 py-4 border-b ${activeDrawer === 'ai_assistant' ? 'bg-[#012c7e] border-[#011a4f]' : 'bg-[#faf8ff] border-[#c4c6d3]'}`}>
          <h2 className={`text-lg font-bold capitalize flex items-center gap-2 ${activeDrawer === 'ai_assistant' ? 'text-white' : 'text-[#012c7e]'}`}>
            <span className={`material-symbols-outlined ${activeDrawer === 'ai_assistant' ? 'text-[#dbe1ff]' : ''}`}>
              {activeDrawer === 'notifications' ? 'notifications' : activeDrawer === 'tasks' ? 'task_alt' : activeDrawer === 'calendar' ? 'calendar_today' : activeDrawer === 'ai_assistant' ? 'smart_toy' : 'chat_bubble'}
            </span>
            {activeDrawer === 'ai_assistant' ? 'AI Assistant' : activeDrawer}
          </h2>
          <button onClick={closeAll} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${activeDrawer === 'ai_assistant' ? 'text-white hover:bg-white/20' : 'text-gray-600 hover:bg-[#c4c6d3]/40'}`}>
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

      
        {activeDrawer === 'ai_assistant' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-[#faf8ff]">
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar">
              
              {/* Sirf tab dikhao jab chat shuru na hui ho */}
              {messages.length === 0 && (
                <>
                  <div className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
                    {aiData.title} Initialized
                  </div>

                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#012c7e] text-[16px]">smart_toy</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-2xl rounded-tl-none shadow-sm border border-[#c4c6d3] text-sm text-[#1a1b21] font-medium leading-relaxed">
                      {aiData.greeting}
                    </div>
                  </div>

                  {/* 🔥 CLICKABLE SUGGESTION BUTTONS 🔥 */}
                  <div className="flex flex-col gap-2 mt-4 ml-11">
                    {aiData.suggestions.map((suggestion, index) => (
                      <button 
                        key={index} 
                        onClick={() => handleSendMessage(suggestion)}
                        className="text-left text-xs font-bold bg-white border border-[#012c7e]/30 text-[#012c7e] px-4 py-2.5 rounded-xl hover:bg-[#dbe1ff]/50 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* 🔥 MAIN CHAT OUTPUT 🔥 */}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.sender === "ai" && (
                    <div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[#012c7e] text-[16px]">smart_toy</span>
                    </div>
                  )}
                  <div className={`p-3.5 rounded-2xl text-sm font-medium leading-relaxed max-w-[80%] ${msg.sender === "user" ? "bg-[#012c7e] text-white rounded-tr-none shadow-md" : "bg-white text-[#1a1b21] rounded-tl-none shadow-sm border border-[#c4c6d3]"}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {isAiLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-[#dbe1ff] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#012c7e] text-[16px]">smart_toy</span>
                  </div>
                  <div className="p-3.5 bg-white border border-[#c4c6d3] rounded-2xl rounded-tl-none text-sm text-gray-500">
                    Analyzing data...
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 bg-white border-t border-[#c4c6d3]">
              <div className="relative">
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Ask about ${location.pathname.replace('/', '') || 'dashboard'}...`} 
                  className="w-full bg-[#f4f3fa] border border-transparent rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-[#012c7e] focus:ring-1 focus:ring-[#012c7e] text-[#1a1b21]"
                />
                <button 
                  onClick={() => handleSendMessage()}
                  disabled={isAiLoading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#012c7e] hover:text-[#16a34a] transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] mt-1">send</span>
                </button>
              </div>
              <div className="text-center mt-2 text-[10px] text-gray-400 font-semibold">
                AI can make mistakes. Please verify important information.
              </div>
            </div>
          </div>
        )}

  
        {activeDrawer === 'notifications' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="px-6 py-3 border-b border-[#c4c6d3] flex justify-between items-center bg-white sticky top-0 z-10">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent</span>
              <button className="text-xs font-bold text-[#012c7e] hover:underline">Mark all as read</button>
            </div>
            <div className="divide-y divide-[#c4c6d3]">
              <div className="p-4 hover:bg-[#f4f3fa] transition-colors cursor-pointer flex gap-4 relative">
                <span className="absolute top-1/2 -translate-y-1/2 left-2 w-1.5 h-1.5 bg-[#012c7e] rounded-full"></span>
                <div className="w-10 h-10 rounded-full bg-[#012c7e]/10 text-[#012c7e] flex items-center justify-center shrink-0"><span className="material-symbols-outlined text-[20px]">person_add</span></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">New Lead Assigned</p>
                  <p className="text-xs text-gray-600 mt-0.5">Marcus Thorne - Interested in Luxury Villa</p>
                  <p className="text-[11px] text-gray-400 mt-1">2 mins ago</p>
                </div>
              </div>
              <div className="p-4 hover:bg-[#f4f3fa] transition-colors cursor-pointer flex gap-4 relative">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-700 flex items-center justify-center shrink-0 pl-1"><span className="material-symbols-outlined text-[20px]">check_circle</span></div>
                <div>
                  <p className="text-sm font-bold text-gray-800">Booking Confirmed</p>
                  <p className="text-xs text-gray-600 mt-0.5">Unit A-12 Skyline Tower has been secured.</p>
                  <p className="text-[11px] text-gray-400 mt-1">1 hour ago</p>
                </div>
              </div>
            </div>
            <div className="mt-auto p-4 border-t border-[#c4c6d3]">
              <button className="w-full py-2.5 bg-[#f4f3fa] text-[#012c7e] rounded-xl text-sm font-bold hover:bg-[#e3e2e9] transition-colors">View All Notifications</button>
            </div>
          </div>
        )}

        {activeDrawer === 'tasks' && (
          <div className="flex-1 overflow-y-auto flex flex-col p-6">
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-bold text-gray-700">Today's Progress</span>
                <span className="text-[#012c7e] font-bold">60%</span>
              </div>
              <div className="w-full h-2 bg-[#f4f3fa] rounded-full overflow-hidden">
                <div className="h-full bg-[#012c7e] rounded-full" style={{ width: '60%' }}></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 border border-[#c4c6d3] rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white">
                <div className="flex items-start gap-3">
                  <input type="checkbox" className="mt-1 w-4 h-4 text-[#012c7e] rounded focus:ring-[#012c7e]" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800">Prepare contracts for Nexus Group</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded-md uppercase">High Priority</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <button className="mt-8 w-full py-3 bg-[#012c7e] text-white rounded-xl text-sm font-bold hover:bg-[#00174c] transition-colors shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">add</span> Add New Task
            </button>
          </div>
        )}

        {activeDrawer === 'calendar' && (
          <div className="flex-1 overflow-y-auto bg-[#faf8ff]">
            <div className="p-6 bg-white border-b border-[#c4c6d3]">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-[#012c7e]">July 2026</span>
                <div className="flex gap-2">
                  <button className="w-6 h-6 flex items-center justify-center bg-[#f4f3fa] rounded-md"><span className="material-symbols-outlined text-[16px]">chevron_left</span></button>
                  <button className="w-6 h-6 flex items-center justify-center bg-[#f4f3fa] rounded-md"><span className="material-symbols-outlined text-[16px]">chevron_right</span></button>
                </div>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 text-gray-400 font-bold">
                <div>Su</div><div>Mo</div><div>Tu</div><div>We</div><div>Th</div><div>Fr</div><div>Sa</div>
              </div>
            </div>
            <div className="p-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Today's Schedule</h3>
              <div className="relative border-l-2 border-[#c4c6d3] ml-3 space-y-6">
                <div className="relative pl-6">
                  <span className="absolute -left-1.5 top-1 w-3 h-3 bg-purple-500 rounded-full ring-4 ring-[#faf8ff]"></span>
                  <p className="text-xs font-bold text-gray-500">09:00 AM</p>
                  <div className="mt-1 p-3 bg-white border border-[#c4c6d3] rounded-xl shadow-sm">
                    <p className="text-sm font-bold text-[#012c7e]">Sales Team Meeting</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDrawer === 'chat' && (
          <div className="flex-1 flex flex-col overflow-hidden bg-white">
            <div className="p-4 border-b border-[#c4c6d3]">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                <input type="text" placeholder="Search conversations..." className="w-full bg-[#f4f3fa] rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#012c7e]/20" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-[#c4c6d3]">
              <div className="p-4 flex items-center gap-3 hover:bg-[#f4f3fa] cursor-pointer transition-colors bg-[#012c7e]/5">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-lg">M</div>
                </div>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-baseline">
                    <p className="text-sm font-bold text-gray-900 truncate">Marcus Thorne (Lead)</p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">Thanks! I will review the brochure.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}