import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { format } from "date-fns";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import Sliderbar from "@/Layout/Sidebar";
import { ArrowLeft, Download, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { fetchDividendData } from "@/api/incomeSoucre";

// Define a type for a single dividend item
type DividendItem = {
  narration: string;
  amount: string;
  dateOfReceipt: string;
};

const DividentIncome: React.FC = () => {
  // Update the state type to use the DividendItem type
  const [dividends, setDividends] = useState<DividendItem[]>([
    { narration: "", amount: "", dateOfReceipt: "" },
  ]);

  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  useEffect(() => {
    const fetchDividendDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found in localStorage");
        return;
      }
      try {
        const response = await fetchDividendData(token);
        const data = response.data.dividendIncome;
        setDividends(data); // Ensure dividends is always an array
      } catch (error) {
        console.error("Error fetching dividend details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchDividendDetails();
    }
  }, [isUserLoggedIn]);

  const autoSave = debounce(async (data: DividendItem[]) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addDividentData`,
        { dividendIncome: data },
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

  const handleInputChange = (index: number, field: keyof DividendItem, value: string) => {
    const newItems = [...dividends];
    newItems[index][field] = value;
    setDividends(newItems);
    autoSave(newItems); // Trigger auto-save
  };

  // Add new item
  const addItem = () => {
    setDividends([...dividends, { narration: "", amount: "", dateOfReceipt: "" }]);
  };

  const deleteItem = async (index: number) => {
    const token = localStorage.getItem("token");

    const dividendToDelete = dividends[index];

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/deleteDividentData`,
        {
          data: { dividendIncome: dividendToDelete },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newDividends = dividends.filter((_, i) => i !== index);
      setDividends(newDividends);
      console.log("Item deleted successfully!");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const deleteAll = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/deleteAllDividentData`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDividends([{ narration: "", amount: "", dateOfReceipt: "" }]);
      console.log("All items deleted successfully!");
    } catch (error) {
      console.error("Error deleting all items:", error);
    }
  };

  const downloadTemplate = () => {
    const templateUrl = "/DividendTemplate.xlsx";
    console.log("Template URL:", templateUrl); // Debug the URL
    FileSaver.saveAs(templateUrl, "Dividend_Template.xlsx");
  };

  // Import Data
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const binaryStr = e.target?.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

      try {
        const token = localStorage.getItem("token");
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addDividentData`,
          { dividendIncome: sheetData },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    setDividends((prev: DividendItem[]) => [...prev, ...sheetData as DividendItem[]]);
        console.log("Data imported successfully!");
      } catch (error) {
        console.error("Error importing data:", error);
      }
    };
    reader.readAsBinaryString(file);
  };

  // Export Data
  const exportData = () => {
    // Create the worksheet with the dividends data
    const worksheet = XLSX.utils.json_to_sheet(dividends);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DividendIncome");
  
    // Generate the Excel file buffer
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
    // Create a Blob and save the file
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    FileSaver.saveAs(blob, "Dividend_Income.xlsx");
  };
  

  const totalDividend = dividends.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
      <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <Link to="/fileITR/incomeSources" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-semibold">Dividend Income</h1>
        </div>

        {/* Info Text */}
        <p className="text-gray-600 mb-8">
          You may see your dividend income details in your{' '}
          <Link to="#" className="text-gray-700 underline">Form 26AS</Link>,
          P&L Reports (Eg:{' '}
          <Link to="#" className="text-gray-700 underline">Zerodha P&L</Link>)
        </p>

        {/* Main Card */}
        <div className="border rounded-lg p-6 bg-white shadow-sm">
          <div className="flex items-start gap-2 mb-6">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">✓</div>
            <h2 className="text-lg font-medium">Dividend Income from Equities, Stocks, Mutual Funds, etc.</h2>
          </div>

          {/* Total and Actions */}
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Total Dividend Income</span>
                <span className="font-semibold">₹ {totalDividend}</span>
              </div>
              <button
                onClick={deleteAll}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Delete All
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button onClick={exportData} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <label htmlFor="file-upload" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 cursor-pointer">
                <Plus className="w-4 h-4" />
                Import Data
              </label>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
              />
              <button onClick={downloadTemplate} className="flex items-center gap-2 text-blue-600 hover:text-blue-700">
                <Download className="w-4 h-4" />
                Download Template
              </button>
            </div>
          </div>

          {/* Dividend Rows */}
          {dividends.map((dividend, index) => (
            <div className="flex gap-4 mb-6" key={index}>
              <div className="flex-1">
                <input
                  type="text"
                  value={dividend.narration}
                  onChange={(e) => handleInputChange(index, 'narration', e.target.value)}
                  placeholder="Narration"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={dividend.amount}
                  onChange={(e) => handleInputChange(index, 'amount', e.target.value)}
                  placeholder="Amount"
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex-1">
                <input
                  type="date"
                  value={dividend.dateOfReceipt}
                  onChange={(e) => handleInputChange(index, 'dateOfReceipt', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={() => deleteItem(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          {/* Add Item Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={addItem}
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <Sliderbar />
    </div>
  );
};

export default DividentIncome;
