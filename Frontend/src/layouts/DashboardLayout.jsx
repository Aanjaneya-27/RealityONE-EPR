import{Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function DashboardLayout(){
 return(
    <div className="flex min-h-screen bg-[#F7F8FU]">
       <Sidebar/>
    <div className="flex-1 ml-64">
         <Navbar/>
    <main className="p-6">
        <Outlet/>
    </main>
    </div>
 </div>
 )
}

export default DashboardLayout;