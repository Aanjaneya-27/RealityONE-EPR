// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "../pages/Login";
// import DashboardLayout from "../layouts/DashboardLayout";
// import Dashboard from "../pages/Dashboard";
// import CRM from "../pages/CRM";
// import Leads from "../pages/Lead";
// import Customers from "../pages/Customers";
// import Projects from "../pages/Projects";
// import Inventory from "../pages/Inventory";
// import Booking from "../pages/BookingWizard";
// import Payments from "../pages/Payments";
// import Finance from "../pages/Finace";
// import SettingsPage from "../pages/Settings";
// import SupportPage from "../pages/Support";

// // 1. Create the Protected Route Wrapper
// const ProtectedRoute = ({ children }) => {
//   const isAuthenticated = localStorage.getItem("userToken");

//   if (!isAuthenticated) {
//     // If no token is found, redirect them to the login page immediately
//     return <Navigate to="/login" replace />;
//   }
//     return children;
// };

// function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route 
//         element={
//           <ProtectedRoute>
//             <DashboardLayout />
//           </ProtectedRoute>
//         }
//       >
//         <Route path="/" element={<Dashboard />} />
//         <Route path="/crm" element={<CRM />} />
//         <Route path="/leads" element={<Leads />} />
//         <Route path="/customers" element={<Customers />} />
//         <Route path="/projects" element={<Projects />} />
//         <Route path="/inventory" element={<Inventory />} />
//         <Route path="/bookings" element={<Booking />} />
//         <Route path="/payments" element={<Payments />} />
//         <Route path="/finance" element={<Finance />} />
//         <Route path="/settings" element={<SettingsPage />} />
//         <Route path="/support" element={<SupportPage />} />
//       </Route>
//     </Routes>
//   );
// }

// export default AppRoutes;

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard";
import CRM from "../pages/CRM";
import Leads from "../pages/Lead";
import Customers from "../pages/Customers";
import Projects from "../pages/Projects";
import Inventory from "../pages/Inventory";
import Booking from "../pages/BookingWizard";
import Payments from "../pages/Payments";
import Finance from "../pages/Finace";
import SettingsPage from "../pages/Settings";
import SupportPage from "../pages/Support";

// 1. Create the Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
   }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route 
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/crm" element={<CRM />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/bookings" element={<Booking />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/finance" element={<Finance />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;