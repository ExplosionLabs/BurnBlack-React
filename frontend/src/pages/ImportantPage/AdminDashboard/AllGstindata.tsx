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
        console.log("gst",response.data);
        setGstData(response.data.result); // Assuming the API returns { results: GSTData[] }
        setError(null);
      } catch (err) {
        console.error(err || 'An error occurred');
        setError('Failed to fetch GST data. Please try again.');
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All GST Data</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {gstData.length === 0 && !error ? (
        <p className="text-gray-700">No data available.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {gstData.map((data, index) => (
            <div
              key={index}
              className="border p-4 rounded-md shadow-md bg-white hover:shadow-lg transition duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{data.business_name}</h2>
              <p>
                <strong>Legal Name:</strong> {data.legal_name}
              </p>
              <p>
                <strong>GSTIN:</strong> {data.gstin}
              </p>
              <p>
                <strong>PAN Number:</strong> {data.pan_number}
              </p>
              <p>
                <strong>Constitution of Business:</strong> {data.constitution_of_business}
              </p>
              <p>
                <strong>Taxpayer Type:</strong> {data.taxpayer_type}
              </p>
              <p>
                <strong>GSTIN Status:</strong> {data.gstin_status}
              </p>
              <p>
                <strong>Date of Registration:</strong>{' '}
                {new Date(data.date_of_registration).toLocaleDateString()}
              </p>
              <p>
                <strong>Annual Turnover:</strong> {data.annual_turnover}
              </p>
              <p>
                <strong>Principal Address:</strong> {data.contact_details?.principal?.address}
              </p>
              <p>
                <strong>Principal Email:</strong> {data.contact_details?.principal?.email}
              </p>
              <p>
                <strong>Principal Mobile:</strong> {data.contact_details?.principal?.mobile}
              </p>
              <p>
                <strong>Nature of Core Business:</strong>{' '}
                {data.nature_of_core_business_activity_description}
              </p>
              <p>
                <strong>Promoters:</strong> {data.promoters?.join(', ')}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllGSTData;
