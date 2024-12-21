import React, { useState } from "react";
import { useNavigate, NavLink, useLocation } from "react-router-dom";
import { CheckCircle, Info, ChevronDown, ChevronUp } from "lucide-react"; // Importing icons

export default function SectionNavigation() {
  const [isOpen, setIsOpen] = useState(false); // State to handle dropdown visibility
  const navigate = useNavigate();
  const location = useLocation(); // To get the current path

  const sections = [
    {
      title: "Personal Info",
      path: "/fileITR/personalDetail",
      status: "pending",
    },
    {
      title: "Income Sources",
      path: "/fileITR/incomeSources",
      status: "pending",
    },
    {
      title: "Tax Saving",
      path: "/tax-saving",
      status: "info",
    },
    {
      title: "Tax Summary",
      path: "/fileITR/tax-summary",
      status: "pending",
    },
  ];

  // Get the active section based on the current location
  const activeSection = sections.find((section) => section.path === location.pathname) || sections[0];

  return (
    <div className="space-y-4">
      {/* Mobile View Dropdown */}
      <div className="block md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium focus:outline-none"
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
                  `flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-800 text-white"
                      : section.status === "completed"
                      ? "bg-blue-800 text-white"
                      : section.status === "info"
                      ? "border border-gray-300"
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
      <div className="hidden md:flex justify-between">
        {sections.map((section) => (
          <NavLink
            key={section.path}
            to={section.path}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-blue-800 text-white"
                  : section.status === "completed"
                  ? "bg-blue-800 text-white"
                  : section.status === "info"
                  ? "border border-gray-300"
                  : "border border-gray-300 bg-white"
              }`
            }
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

      <div className="flex items-center justify-between rounded-lg bg-blue-50 p-4">
        <div className="flex items-center gap-2 text-sm">
          <CheckCircle size={20} className="text-green-600" />
          <span>File your taxes confidently with 100% accuracy — We've got you covered.</span>
        </div>
        <a
          href="#"
          className="text-sm font-medium text-blue-600 hover:underline"
        >
          Learn More →
        </a>
      </div>
    </div>
  );
}
