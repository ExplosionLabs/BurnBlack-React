import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

const DividentIncome: React.FC = () => {
  const [dividends, setDividends] = useState([
    { narration: "", amount: "", dateOfReceipt: "" },
  ]);

  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

 

  useEffect(() => {
    const fetchDividendDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getDividentData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.data;

        // Normalize the data into an array
        const formattedDividends = Array.isArray(data)
          ? data.map((dividend: any) => ({
              ...dividend,
              dateOfReceipt: dividend.dateOfReceipt
                ? format(new Date(dividend.dateOfReceipt), "yyyy-MM-dd")
                : "",
            }))
          : [
              {
                ...data,
                dateOfReceipt: data.dateOfReceipt
                  ? format(new Date(data.dateOfReceipt), "yyyy-MM-dd")
                  : "",
              },
            ];

        setDividends(formattedDividends); // Ensure dividends is always an array
      } catch (error) {
        console.error("Error fetching dividend details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchDividendDetails();
    }
  }, [isUserLoggedIn]);

  


  
  const autoSave = debounce(async (data) => {
    try {
        const token = localStorage.getItem("token");
        const response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addDividentData`,
            { dividendIncome:data },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      console.log("Data saved successfully!");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }, 500); // Adjust debounce time as needed


  const handleInputChange = (index: number, field: string, value: string) => {
    const newItems = [...dividends];
    newItems[index][field] = value;
    setDividends(newItems);
    autoSave(newItems); // Trigger auto-save
  };

  // Add new item
  const addItem = () => {
    setDividends([...dividends, { narration: "", amount: "", dateOfReceipt: "" }]);
  };


  return (
    <div>
    <h2>Dividend Income</h2>
    {dividends.map((item, index) => (
      <div key={index} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Narration"
          value={item.narration}
          onChange={(e) =>
            handleInputChange(index, "narration", e.target.value)
          }
          style={{ marginRight: "1rem" }}
        />
        <input
          type="number"
          placeholder="Amount"
          value={item.amount}
          onChange={(e) => handleInputChange(index, "amount", e.target.value)}
          style={{ marginRight: "1rem" }}
        />
        <input
          type="date"
          placeholder="Date of Receipt"
          value={item.dateOfReceipt}
          onChange={(e) => handleInputChange(index, "dateOfReceipt", e.target.value)}
        />
      </div>
    ))}
    <button onClick={addItem} style={{ marginTop: "1rem" }}>
      Add More
    </button>
    <br />
    {/* <Link to="/fileITR/dividend-income">Add Details</Link> */}
  </div>

  );
};

export default DividentIncome;
