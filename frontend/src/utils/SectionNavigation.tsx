import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Info } from "lucide-react"; // Importing icons from Lucide React

export default function SectionNavigation() {
  const navigate = useNavigate();

  const sections = [
    {
      title: "Personal Info",
      path: "/fileITR/personalDetail",
      status: "pending",
    },
    {
      title: "Income Sources",
      path: "/fileITR/incomeSources",
      status: "completed",
    },
    {
      title: "Tax Saving",
      path: "/fileITR/bankDetail",
      status: "info",
    },
    {
      title: "Tax Summary",
      path: "/fileITR/bankDetail",
      status: "pending",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex gap-4 ">
        {sections.map((section) => (
          <button
            key={section.path}
            onClick={() => navigate(section.path)}
            className={`
              flex items-center gap-2 rounded-full px-6 py-2 text-sm font-medium transition-colors
              ${section.status === "completed" ? "bg-blue-800 text-white" : 
                section.status === "info" ? "border border-gray-300" :
                "border border-gray-300 bg-white"}
            `}
          >
            {section.title}
            {section.status === "completed" && (
              <CheckCircle size={16} className="text-white" />
            )}
            {section.status === "info" && (
              <Info size={16} className="text-blue-500" />
            )}
          </button>
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
