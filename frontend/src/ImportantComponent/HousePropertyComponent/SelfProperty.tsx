import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HouseAddresComponent from "./SelfProperty/HouseAddressComponent";
import OwnerDetails from "./SelfProperty/OwnerDetail";
import TaxSavingsDetails from "./SelfProperty/TaxSaving";
import RentalIncomeDetails from "./SelfProperty/RentalIncomeDetails";
import { ArrowLeft, HelpCircle } from "lucide-react";
import Sliderbar from "@/Layout/Sidebar";
import { fetchLandPropertyData } from "@/api/landProperty";



const SelfProperty: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>("Self Occupied House Property");
  const [formData, setFormData] = useState({
    propertyType: "Self Occupied House Property",
    netTaxableIncome: 0,
    houseAddress: {
      flatNo: "",
      premiseName: "",
      road: "",
      area: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    },
    ownerDetails: {
      ownerName: "",
      ownerPan: "",
      ownerShare: 0,
      hasMultipleOwners: false,
      coOwners: [],
    },
    taxSavings: {
      constructionYear: "",
      interestDuringConstruction: 0,
      interestAfterCompletion: 0,
      totalDeduction: 0,
    },
    rentalIncomeDetails: {
      annualRent: 0,
      taxPaid: 0,
      standardDeduction: 0,
      netIncome: 0,
    },
  
  });
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing from localStorage");
        }
        const response = await fetchLandPropertyData(token);
        if (response.data) {
          setFormData(response.data);
        
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (section: string, updatedData: any) => {
    setFormData((prev) => ({ ...prev, [section]: updatedData }));
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
    setFormData((prev) => ({ ...prev, propertyType: e.target.value }));
  };
  useEffect(() => {
    const calculateNetTaxableIncome = () => {
      const { rentalIncomeDetails, taxSavings } = formData;
      const netIncome = rentalIncomeDetails.netIncome || 0;
      const totalDeduction = taxSavings.totalDeduction || 0;

      if (propertyType === "Deemed Let Out Property") {
        return netIncome - totalDeduction;
      } else if (propertyType === "Self Occupied House Property") {
        return -totalDeduction;
      }
      return 0;
    };

    setFormData((prev) => ({
      ...prev,
      netTaxableIncome: calculateNetTaxableIncome(),
    }));
  }, [propertyType, formData.taxSavings, formData.rentalIncomeDetails]);

  const saveDataToDatabase = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addPropertyData`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      saveDataToDatabase();
    }, 1000); // Save after 1 second of inactivity
    return () => clearTimeout(debounce);
  }, [formData]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
  <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
    {/* Header */}
    <div className="w-full max-w-4xl p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
        <Link to="/fileITR/income-house-property" className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
            Self Occupied Properties (not given on rent)
          </h1>
        </div>
        <p className="text-gray-600">
          Enter the home loan interest, address and other details. You can get the interest details from the home loan certificate issued by the bank.
        </p>
      </div>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-2 min-w-[180px]">
          <label htmlFor="propertyType" className="font-medium text-gray-700">
            Your property type
          </label>
          <HelpCircle className="w-4 h-4 text-gray-400" />
        </div>
        <select
          id="propertyType"
          value={formData.propertyType}
          onChange={handlePropertyTypeChange}
          className="w-full md:w-[400px] p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Self Occupied House Property">Self Occupied House Property</option>
          <option value="Deemed Let Out Property">Deemed Let Out Property</option>
        </select>
      </div>
      <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Net Taxable Income: ₹{formData.netTaxableIncome}
          </h2>
        </div>
    </div>






      {/* Render components */}
      <div className="flex flex-col gap-4">
        <HouseAddresComponent
          data={formData.houseAddress}
          onChange={(updatedData: any) => handleFormChange("houseAddress", updatedData)}
        />
        <OwnerDetails
          data={formData.ownerDetails}
          onChange={(updatedData: any) => handleFormChange("ownerDetails", updatedData)}
        />
     <TaxSavingsDetails
  data={formData.taxSavings }
  onChange={(updatedData: any) => handleFormChange("taxSavings", updatedData)}
/>
        {formData.propertyType === "Deemed Let Out Property" && <RentalIncomeDetails  data={formData.rentalIncomeDetails }
  onChange={(updatedData: any) => handleFormChange("rentalIncomeDetails", updatedData)} />}
      </div>

      {/* Navigation links */}
      
    </div>
    <div className="lg:col-span-1">
        <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>
    </div>
  );
};

export default SelfProperty;
