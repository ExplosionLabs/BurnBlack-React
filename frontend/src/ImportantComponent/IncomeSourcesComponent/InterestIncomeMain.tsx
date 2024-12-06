import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Calculator } from "lucide-react";
import { fetchAllInterestData } from "@/api/incomeSoucre";

interface InterestItem {
  fieldType?: string;
  name?: string;
  description?: string;
  amount: number;
}

interface InterestData {
  _id: string;
  type: string;
  data: InterestItem[];
}

const InterestIncomeMain: React.FC = () => {
  const [interestData, setInterestData] = useState<InterestData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing from localStorage");
        }

        const responseData = await fetchAllInterestData(token);
        console.log("Fetched Interest Data:", responseData);

        if (responseData?.data && Array.isArray(responseData.data)) {
          setInterestData(responseData.data);
        } else {
          setInterestData([]);
          console.warn("Data format is not as expected");
        }
      } catch (err: any) {
        console.error("Error fetching data:", err.message);
        setError("Failed to fetch interest income data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Calculator className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 text-base">Interest Income</h3>
            <p className="text-sm text-gray-500 mt-1">
              Interest earned from Savings Bank, FDs, Post Office Deposits, P2P, Bonds etc.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            to="/fileITR/incomeInterest"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Add Details
          </Link>
        </div>
      </div>

      {/* Interest Details Section */}
      <div className="mt-4 ml-10">
        {interestData.length > 0 ? (
          interestData.map((section) => {
            const totalAmount = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
            return (
              <div
                key={section._id}
                className="bg-gray-50 rounded-lg p-4 flex items-center justify-between mb-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{section.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  <Link    to="/fileITR/incomeInterest" className="text-gray-700 hover:text-gray-900 font-medium">Edit</Link>

                </div>
              </div>
            );
          })
        ) : (
          <div>No interest income details available.</div>
        )}
      </div>
    </div>
  );
};

export default InterestIncomeMain;
