import axios from "axios";
import React, { useState } from "react";
import AllGSTData from "./AllGstindata";

interface GSTData {
  business_name: string;
  legal_name: string;
  gstin: string;
  pan_number: string;
  constitution_of_business: string;
  taxpayer_type: string;
  gstin_status: string;
  date_of_registration: string;
  annual_turnover: string;
  contact_details: {
    principal: {
      address: string;
      email: string;
      mobile: string;
    };
  };
  promoters: string[];
  nature_of_core_business_activity_description: string;
}

const AdminDashboard = () => {
  const [gstin, setGstin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GSTData | null>(null);

  const handleVerify = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/verificationApi/getGSTData`,
        { gstin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.result);
      alert("GST data fetched successfully");
      setError(null);
    } catch (err) {
      console.error(err || "An error occurred");
      setError("Failed to verify GSTIN. Please try again.");
      setResult(null);
    }
  };

  return (
    <>
    <div className="bg-white text-black">
      <div className="container mx-auto p-6 ">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-lg p-6">
          <label
            htmlFor="gstin"
            className="block text-sm font-semibold text-gray-800 mb-2"
          >
            GSTIN Number
          </label>
          <input
            type="text"
            id="gstin"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            placeholder="Enter a valid GSTIN number"
          />
          <button
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-4 hover:bg-blue-700 transition duration-300"
            onClick={handleVerify}
          >
            Verify GSTIN
          </button>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>

        {result && (
          <div className="mt-10 bg-gray-50 shadow-md rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6">GST Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p>
                <strong>Business Name:</strong> {result.business_name}
              </p>
              <p>
                <strong>Legal Name:</strong> {result.legal_name}
              </p>
              <p>
                <strong>GSTIN:</strong> {result.gstin}
              </p>
              <p>
                <strong>PAN Number:</strong> {result.pan_number}
              </p>
              <p>
                <strong>Constitution of Business:</strong>{" "}
                {result.constitution_of_business}
              </p>
              <p>
                <strong>Taxpayer Type:</strong> {result.taxpayer_type}
              </p>
              <p>
                <strong>GSTIN Status:</strong> {result.gstin_status}
              </p>
              <p>
                <strong>Date of Registration:</strong>{" "}
                {new Date(result.date_of_registration).toLocaleDateString()}
              </p>
              <p>
                <strong>Annual Turnover:</strong> {result.annual_turnover}
              </p>
              <p>
                <strong>Principal Address:</strong>{" "}
                {result.contact_details?.principal?.address}
              </p>
              <p>
                <strong>Principal Email:</strong>{" "}
                {result.contact_details?.principal?.email}
              </p>
              <p>
                <strong>Principal Mobile:</strong>{" "}
                {result.contact_details?.principal?.mobile}
              </p>
              <p>
                <strong>Nature of Core Business:</strong>{" "}
                {result.nature_of_core_business_activity_description}
              </p>
              <p>
                <strong>Promoters:</strong> {result.promoters?.join(", ")}
              </p>
            </div>
          </div>
        )}
      </div>
      <AllGSTData />
      </div>
    </>
  );
};

export default AdminDashboard;
