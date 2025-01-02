import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sliderbar from "@/Layout/Sidebar";
import { ArrowLeft, Home } from "lucide-react";
import { fetchAllLandPropertyData, fetchAllRentalData, fetchLandPropertyData } from "@/api/landProperty";

interface PropertyData {
  _id: string;
 
netTaxableIncome
: number;
}
const HousePropMain: React.FC = () => {
 const [propertyData, setPropertyData] = useState<PropertyData[]>([]);
 const [rentalData, setRentalData] = useState<PropertyData[]>([]);
      const [loading, setLoading] = useState<boolean>(true);
     useEffect(() => {
       
       const fetchData = async () => {
         try {
           const token = localStorage.getItem("token");
           if (!token) {
             throw new Error("Token is missing from localStorage");
           }
           const response = await fetchAllLandPropertyData(token);
           if (response.data) {
      
             setPropertyData(response.data);
           
           }
         } catch (error) {
           console.error("Error fetching property data:", error);
         }
       };
       const fetchRentalData = async () => {
         try {
           const token = localStorage.getItem("token");
           if (!token) {
             throw new Error("Token is missing from localStorage");
           }
           const response = await fetchAllRentalData(token);
           if (response.data) {
      
             setRentalData(response.data);
           
           }
         } catch (error) {
           console.error("Error fetching property data:", error);
         }
       };
   
       fetchData();
       fetchRentalData();
     }, []);
   

  return (
    <>
    

{/* <div className="flex items-center space-x-6">
          <Link to="/fileITR/incomeSources" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">House Properties owned by you</h1>
            <p className="text-gray-600 mt-1">
              Add details if you earned rent from your property or paid interest on home loan
            </p>
          </div>
        </div> */}

    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-4">
      <Home className="w-6 h-6 text-blue-600 mt-1" />
      <div>
        <h3 className="font-medium text-gray-900 text-base">
        Self Occupied Properties (not given on rent)
        </h3>
        <p className="text-sm text-gray-500">
          Add details of the properties you own that are rented out to <br />tenants, including rental income information.
        </p>
      </div>
    </div>
    <Link
      to={`/fileITR/incomeSources/self-occupied-property/${propertyData.length === 0 ? 0 : propertyData.length}`}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
    >
      Add Details
    </Link>
  </div>
  <div className="mt-4 ml-10">
 {propertyData ? ( // Check if propertyData has elements
    propertyData.map((section, index) => (
      <div
        key={section._id}
        className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">House Property {index + 1}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-900">
            ₹{section.netTaxableIncome.toLocaleString()}
          </span>
          <Link
       to={`/fileITR/incomeSources/self-occupied-property/${index}`}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Edit
          </Link>
        </div>
      </div>
    ))
  ) : (
   <>
   </>
  )}
      </div>
</div>
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-4">
      <Home className="w-6 h-6 text-blue-600 mt-1" />
      <div>
        <h3 className="font-medium text-gray-900 text-base">
          Properties you have given on rent
        </h3>
        <p className="text-sm text-gray-500">
          Add details of the properties you own that are rented out to <br />tenants, including rental income information.
        </p>
      </div>
    </div>
    <Link
    to={`/fileITR/incomeSources/rental-property/${rentalData.length === 0 ? 0 : rentalData.length}`}
     
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
    >
      Add Details
    </Link>
  </div>
  <div className="mt-4 ml-10">
 {rentalData ? ( // Check if propertyData has elements
    rentalData.map((section, index) => (
      <div
        key={section._id}
        className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-gray-900">Rent Property {index + 1}</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-medium text-gray-900">
            ₹{section.netTaxableIncome.toLocaleString()}
          </span>
          <Link
       to={`/fileITR/incomeSources/rental-property/${index}`}
            className="text-gray-700 hover:text-gray-900 font-medium"
          >
            Edit
          </Link>
        </div>
      </div>
    ))
  ) : (
   <>
   </>
  )}
      </div>
</div>


    </>
  );
};

export default HousePropMain;
