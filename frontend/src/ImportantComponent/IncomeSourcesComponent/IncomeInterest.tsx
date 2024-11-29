import React, { useState, useEffect } from "react";
import Fields from "./Field";
import axios from "axios";

type InterestType = "Savings Bank" | "Fixed Deposits" | "P2P Investments" | "Bond Investments" | "Provident Fund" | "Income Tax Refund" | 'Other Interest Income';

interface InterestItem {
  name?: string;
  description?: string;
  amount: number;
}

interface InterestData {
  type: InterestType;
  data: InterestItem[];
}

const initialData: InterestData[] = [
  { type: "Savings Bank", data: [] },
  { type: "Fixed Deposits", data: [] },
  { type: "P2P Investments", data: [] },
  { type: "Bond Investments", data: [] },
  { type: "Provident Fund", data: [] },
  { type: "Income Tax Refund", data: [] },
  { type: "Other Interest Income", data: [] },
];

const IncomeInterest: React.FC = () => {
  const [interestData, setInterestData] = useState<InterestData[]>(initialData);
  const [expanded, setExpanded] = useState<Record<InterestType, boolean>>({
    "Savings Bank": false,
    "Fixed Deposits": false,
    "P2P Investments": false,
    "Bond Investments": false,
    "Provident Fund": false,
    "Income Tax Refund": false,
    "Other Interest Income": false,
  });

  // Fetch saved data for the user on initial load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
        // Create a new array to store updated sections
        const updatedInterestData = await Promise.all(
          interestData.map(async (section) => {
          
            
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/get-interest-income/${section.type}`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
    
              console.log("Response for type", section.type, response.data); // Log the full response
    
              // Update the section data only if it's valid
              if (response.data.success && response.data.data) {
                section.data = response.data.data;
              }
    
            } catch (error) {
              console.error(`Error fetching data for ${section.type}:`, error);
            }
    
            return section; // Return the section (even if its data is empty)
          })
        );
    
        // Update the state with the new data
        setInterestData(updatedInterestData);
    
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    

    fetchData();
  }, []); // Empty dependency array to run once on component mount

  const toggleSection = (type: InterestType) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  const updateData = (type: InterestType, newData: InterestItem[]) => {
    setInterestData((prev) =>
      prev.map((item) => (item.type === type ? { ...item, data: newData } : item))
    );
  };

  return (
    <div>
      {interestData.map((section) => (
        <div key={section.type}>
          {/* Section Header */}
          <div
            style={{ display: "flex", justifyContent: "space-between", cursor: "pointer", padding: "10px", borderBottom: "1px solid #ccc" }}
            onClick={() => toggleSection(section.type)}
          >
            <h3>{section.type}</h3>
            <span>{expanded[section.type] ? "▼" : "▶"}</span>
          </div>

          {/* Fields */}
          {expanded[section.type] && (
            <Fields
              type={section.type}
              data={section.data}
              onUpdate={(newData) => updateData(section.type, newData)}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default IncomeInterest;
