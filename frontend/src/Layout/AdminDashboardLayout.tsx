import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

const AdminDashboardLayout = () => {
  return (
    <div className="flex">
    <AdminSidebar/>
      <main className="flex-1 p-6 overflow-y-auto bg-gray-100 min-h-screen">
        <Outlet /> {/* Render the nested route here */}
      </main>
    </div>
  );
};

export default AdminDashboardLayout;
