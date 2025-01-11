import axios from 'axios';
import React, { useEffect, useState } from 'react';

// Interface for GST Data
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

const AllGSTData: React.FC = () => {
  const [gstData, setGstData] = useState<GSTData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/verificationApi/getAllGSTData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setGstData(response.data.result); // Assuming the API returns { result: GSTData[] }
        setError(null);
      } catch (err) {
        console.error(err || 'An error occurred');
        setError('Failed to fetch GST data. Please try again.');
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-8">All GST Data</h1>

      {error && <p className="text-red-500 text-center mb-6">{error}</p>}

      {gstData.length === 0 && !error ? (
        <p className="text-center text-gray-700">No data available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {gstData.map((data, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-lg p-6 shadow-md hover:shadow-lg bg-white transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">{data.business_name}</h2>

              <p className="mb-2">
                <strong>Legal Name:</strong> {data.legal_name}
              </p>
              <p className="mb-2">
                <strong>GSTIN:</strong> {data.gstin}
              </p>
              <p className="mb-2">
                <strong>PAN Number:</strong> {data.pan_number}
              </p>
              <p className="mb-2">
                <strong>Constitution of Business:</strong> {data.constitution_of_business}
              </p>
              <p className="mb-2">
                <strong>Taxpayer Type:</strong> {data.taxpayer_type}
              </p>
              <p className="mb-2">
                <strong>GSTIN Status:</strong> {data.gstin_status}
              </p>
              <p className="mb-2">
                <strong>Date of Registration:</strong>{' '}
                {new Date(data.date_of_registration).toLocaleDateString()}
              </p>
              <p className="mb-2">
                <strong>Annual Turnover:</strong> {data.annual_turnover}
              </p>
              <p className="mb-2">
                <strong>Principal Address:</strong> {data.contact_details?.principal?.address}
              </p>
              <p className="mb-2">
                <strong>Principal Email:</strong> {data.contact_details?.principal?.email}
              </p>
              <p className="mb-2">
                <strong>Principal Mobile:</strong> {data.contact_details?.principal?.mobile}
              </p>
              <p className="mb-2">
                <strong>Nature of Core Business:</strong>{' '}
                {data.nature_of_core_business_activity_description}
              </p>
              <p>
                <strong>Promoters:</strong> {data.promoters?.join(', ') || 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllGSTData;
