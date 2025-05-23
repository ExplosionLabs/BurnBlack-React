// components/Sidebar.tsx
import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  const navItems = [
    { name: "Dashboard", path: "/admin" },
    // { name: "GST Verification", path: "/admin/gst-verification" },
    { name: "All GST Data", path: "/admin/all-gst-data" },
    { name: "Users", path: "/admin/users" },
    // { name: "Settings", path: "/admin/settings" },
  ];

  return (
    <div className="w-64  bg-gray-900 text-white flex flex-col shadow-lg">
      <div className="text-2xl font-bold p-6 border-b border-gray-700">Admin Panel</div>
      <nav className="flex flex-col p-4 space-y-2">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className="px-4 py-2 rounded hover:bg-gray-800 transition"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;
