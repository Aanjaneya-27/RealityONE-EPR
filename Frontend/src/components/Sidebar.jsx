import { NavLink } from "react-router-dom";

const navItems = [
  { icon: "dashboard", label: "Dashboard", path: "/" },
  { icon: "contacts", label: "CRM", path: "/crm" },
  { icon: "group_add", label: "Leads", path: "/leads" },
  { icon: "person", label: "Customers", path: "/customers" },
  { icon: "location_city", label: "Projects", path: "/projects" },
  { icon: "inventory", label: "Inventory", path: "/inventory" },
  { icon: "event_available", label: "Bookings", path: "/bookings" },
  { icon: "payments", label: "Payments", path: "/payments" },
  { icon: "account_balance", label: "Finance", path: "/finance" },
  { icon: "settings", label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 bg-[#1E2A3A] shadow-md flex flex-col z-50">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"/>
      
      <div className="p-6 flex flex-col gap-2 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#012c7e] flex items-center justify-center overflow-hidden text-white font-bold">
            <h2>RO</h2>
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-[20px] text-white leading-tight">RealtyOne ERP</span>
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Business OS</span>
          </div>
        </div>
      </div>

      <nav className="sidebar-scrollbar flex-1 px-4 overflow-y-auto flex flex-col gap-1 py-4">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive
                  ? "bg-white/10 text-white scale-95 duration-150 font-semibold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span className="text-[15px] font-normal">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 flex flex-col gap-1">
        <NavLink to="/support" className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] ${isActive ? "bg-white/10 text-white" : "text-white/60 hover:text-white"}`}>
          <span className="material-symbols-outlined">help</span>
          <span>Support</span>
        </NavLink>
      </div>
    </aside>
  );
}