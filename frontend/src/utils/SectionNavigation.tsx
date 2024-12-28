import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react"; // Importing icons

export default function SectionNavigation() {
  const [isOpen, setIsOpen] = useState(false); // State to handle dropdown visibility
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

  const sections = [
    {
      title: "1. Personal Info",
      path: "/fileITR/personalDetail",
      status: "pending",
    },
    {
      title: "2. Income Sources",
      path: "/fileITR/incomeSources",
      status: "pending",
    },
    {
      title: "3. Tax Saving",
      path: "/tax-saving",
      status: "info",
    },
    {
      title: "4. Tax Summary",
      path: "/fileITR/tax-summary",
      status: "pending",
    },
  ];

  // Get the active section based on the current location
  const activeSection = sections.find((section) => section.path === location.pathname) || sections[0];

  return (
    <div className="space-y-6">
      {/* Mobile View Dropdown */}
      <div className="block md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between rounded-md border border-gray-300 px-4 py-2 text-sm font-medium focus:outline-none bg-dark text-white"
      >
        <span>{activeSection.title}</span>
        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {isOpen && (
        <div className="mt-2 space-y-2">
        {sections.map((section) => (
          <NavLink
          key={section.path}
          to={section.path}
          className={({ isActive }) =>
            `flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            isActive
              ? "bg-dark text-white"
              : section.status === "completed"
              ? "bg-dark text-white"
              : section.status === "info"
              ? "border border-gray-300 bg-white"
              : "border border-gray-300 bg-white"
            }`
          }
          onClick={() => setIsOpen(false)} // Close dropdown on selection
          >
          {section.title}
          {section.status === "completed" && (
            <CheckCircle size={16} className="text-white" />
          )}
          {section.status === "info" && (
            <Info size={16} className="text-blue-500" />
          )}
          </NavLink>
        ))}
        </div>
      )}
      </div>

      {/* Desktop View */}
      <div className="hidden md:grid grid-cols-4  bg-gray-100 p-2  rounded-md">
      {sections.map((section) => (
        <NavLink
        key={section.path}
        to={section.path}
        className={({ isActive }) =>
          `flex flex-row items-center justify-center  px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "rounded-md bg-dark text-white"
            : section.status === "completed"
            ? "rounded-md bg-dark text-white"
            : section.status === "info"
            ? " bg-gray-100"
            : " bg-gray-100"
          }`
        }
        >
        
        {section.status === "completed" && (
          <CheckCircle size={16} className="text-white mr-2" />
        )}
        {section.status === "info" && (
          <Info size={16} className="text-orange-500 mr-2" />
        )}
        {section.title}
        </NavLink>
      ))}
      </div>

      
    </div>
  );
}
