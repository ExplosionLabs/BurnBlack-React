// components/Sidebar.tsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Users, 
  Download, 
  Receipt, 
  Database, 
  BarChart3, 
  CreditCard, 
  BookOpen, 
  Settings 
} from "lucide-react";

const AdminSidebar = () => {
  const location = useLocation();
  
  const navItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Users", path: "/admin/users", icon: Users },
    { name: "ITR Downloads", path: "/admin/itr-downloads", icon: Download },
    { name: "GST Management", path: "/admin/gst", icon: Receipt },
    { name: "GST Data", path: "/admin/all-gst-data", icon: Database },
    { name: "Analytics", path: "/admin/analytics", icon: BarChart3 },
    { name: "Payments", path: "/admin/payments", icon: CreditCard },
    { name: "Documentation", path: "/admin/docs", icon: BookOpen },
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="text-2xl font-bold p-6 border-b border-gray-700">
        <span className="text-blue-400">BurnBlack</span> Admin
      </div>
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={index}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-800'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="text-sm text-gray-400">
          <p>System Status</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
