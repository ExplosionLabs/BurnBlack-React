import React, { useState } from "react";
import axios from "axios";
import debounce from "lodash.debounce";

interface FieldsProps {
  userId: string;
  type: string;
  data: any[];
  onUpdate: (newData: any[]) => void;
}

const providentFundOptions = [
  "Interest on EPF Balance- 1st Proviso to sec 10(11)",
  "Interest on EPF Balance- 2nd Proviso to sec 10(11)",
  "Interest on RPF Balance- 1st Proviso to sec 10(12)",
  "Interest on RPF Balance- 2nd Proviso to sec 10(12)",
];

const Fields: React.FC<FieldsProps> = ({ userId, type, data, onUpdate }) => {
  const [items, setItems] = useState<any[]>(data);

  // Add an item based on the type
  const addItem = () => {
    const newItem: any = { amount: 0 }; // Default field for amount
    if (type === "Savings Bank" || type === "P2P Investments" || type === "Bond Investments") {
      newItem.name = ""; // Default field for name of platform
    } else if (type === "Fixed Deposits" || type==="Other Interest Income") {
      newItem.description = ""; // Default field for description
    }
    if (type === "Provident Fund") {
      newItem.fieldType = providentFundOptions[0]; // Default to first option
    }
    setItems([...items, newItem]);
  };

  // Update a specific item in the list based on its index
  const updateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setItems(updatedItems);

    // Debounced auto-save to update parent state
    debouncedSave(updatedItems);
  };

  const debouncedSave = debounce(async (newData: any[]) => {
    const token = localStorage.getItem("token");
    try {
      // API call to save data
      const response = await axios.post( `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/interest-income`, {
        type,
        data: newData,
      },{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data saved successfully:", response.data);
    } catch (error) {
      console.error("Error saving data:", error.response ? error.response.data : error.message);
    }
  }, 500);

  // When fields change, handle persistence and ensure fields remain open
  const handleFieldChange = (index: number, field: string, value: string | number) => {
    updateItem(index, field, value);
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #eee" }}>
      {items.map((item, index) => (
        <div key={index} style={{ marginBottom: "10px" }}>
          {/* Always show fields dynamically based on type */}
          {type === "Savings Bank" || type === "P2P Investments" || type === "Bond Investments" ? (
            <input
              type="text"
              placeholder="Enter Name of Platform"
              value={item.name || ""}
              onChange={(e) => handleFieldChange(index, "name", e.target.value)}
              style={{ marginRight: "10px" }}
            />
          ) : type === "Fixed Deposits" || type==="Other Interest Income" ? (
            <input
              type="text"
              placeholder="Enter Description"
              value={item.description || ""}
              onChange={(e) => handleFieldChange(index, "description", e.target.value)}
              style={{ marginRight: "10px" }}
            />
            
          ):
          type === "Provident Fund" ? (
            <select
              value={item.fieldType || ""}
              onChange={(e) => updateItem(index, "fieldType", e.target.value)}
              style={{ marginRight: "10px" }}
            >
              {providentFundOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : null}
          <input
            type="number"
            placeholder="Enter Amount"
            value={item.amount || 0}
            onChange={(e) => handleFieldChange(index, "amount", parseFloat(e.target.value))}
          />
        </div>
      ))}
      
      {/* Button to add more fields */}
      <button onClick={addItem} style={{ marginTop: "10px" }}>
        Add More
      </button>
    </div>
  );
};

export default Fields;
