import axios from 'axios';
import React, { useState } from 'react';
import AllGSTData from './AllGstindata';

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
  const [gstin, setGstin] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GSTData | null>(null)
  const handleVerify = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/verificationApi/getGSTData`,
        { gstin },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(response.data.result); // Save the result to the state
      alert('GST data got successfully');
      setError(null);
    } catch (err) {
      console.error(err || 'An error occurred');
      setError('Failed to verify GSTIN. Please try again.');
      setResult(null);
    }
  };

  return (
    <>
      <div>
        <h1>Admin Dashboard</h1>
        <div className="lg:w-1/2">
          <label htmlFor="gstin" className="block text-sm font-semibold text-gray-800 mb-1">
            GSTIN Number
          </label>
          <input
            type="text"
            id="gstin"
            value={gstin}
            onChange={(e) => setGstin(e.target.value)}
            className="w-full px-6 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">Enter a valid GSTIN number</p>
          <button
            className="w-full items-center bg-dark border hover:text-white hover:bg-blue-900 text-white font-semibold py-4 px-6 rounded-md transition duration-300 ease-in-out mt-4"
            onClick={handleVerify}
          >
            Proceed →
          </button>
        </div>

        {error && <p className="text-red-500 mt-4">{error}</p>}

        {result && (
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">GST Details</h2>
            <div>
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
                <strong>Constitution of Business:</strong> {result.constitution_of_business}
              </p>
              <p>
                <strong>Taxpayer Type:</strong> {result.taxpayer_type}
              </p>
              <p>
                <strong>GSTIN Status:</strong> {result.gstin_status}
              </p>
              <p>
                <strong>Date of Registration:</strong> {new Date(result.date_of_registration).toLocaleDateString()}
              </p>
              <p>
                <strong>Annual Turnover:</strong> {result.annual_turnover}
              </p>
              <p>
                <strong>Principal Address:</strong> {result.contact_details?.principal?.address}
              </p>
              <p>
                <strong>Principal Email:</strong> {result.contact_details?.principal?.email}
              </p>
              <p>
                <strong>Principal Mobile:</strong> {result.contact_details?.principal?.mobile}
              </p>
              <p>
                <strong>Nature of Core Business:</strong> {result.nature_of_core_business_activity_description}
              </p>
              <p>
                <strong>Promoters:</strong> {result.promoters?.join(', ')}
              </p>
            </div>
          </div>
        )}
      </div>
      <AllGSTData/>
    </>
  );
};

export default AdminDashboard;
