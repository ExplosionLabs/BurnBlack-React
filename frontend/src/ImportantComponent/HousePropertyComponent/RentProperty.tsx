import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HouseAddresComponent from "./SelfProperty/HouseAddressComponent";
import OwnerDetails from "./SelfProperty/OwnerDetail";
import TaxSavingsDetails from "./SelfProperty/TaxSaving";
import RentalIncomeDetails from "./SelfProperty/RentalIncomeDetails";
import TenantDetailsComponent from "./RentProperty/TentantDetail";
import Sliderbar from "@/Layout/Sidebar";
import { ArrowLeft } from "lucide-react";
import { fetchRentPropertyData } from "@/api/landProperty";



const RentProperty: React.FC = () => {
  
  const [rentFormData, setRentFormData] = useState({
    netTaxableIncome:0,
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
    tentatDetails:[{
        name: "", panOrTan: "", aadhaar: "" 
    }]
  
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
        const response = await fetchRentPropertyData(token)


        if (response.data) {
          setRentFormData(response.data);
      
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
    setRentFormData((prev) => ({ ...prev, [section]: updatedData }));
  };
  useEffect(() => {
    const calculateNetTaxableIncome = () => {
      const { rentalIncomeDetails, taxSavings } = rentFormData;
      const netIncome = rentalIncomeDetails.netIncome || 0;
      const totalDeduction = taxSavings.totalDeduction || 0;

    
        return netIncome - totalDeduction;
    
  
    };

    setRentFormData((prev) => ({
      ...prev,
      netTaxableIncome: calculateNetTaxableIncome(),
    }));
  }, [rentFormData.taxSavings, rentFormData.rentalIncomeDetails]);
  

  const saveDataToDatabase = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addRentalData`, rentFormData, {
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
  }, [rentFormData]);

  if (loading) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
  <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
  <div className="w-full max-w-4xl p-6">
      <div className="mb-6">
        <div className="flex items-center mb-4">
        <Link to="/fileITR/income-house-property" className="inline-flex items-center text-gray-600 hover:text-gray-900 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">
          Add Rental Property
          </h1>
        </div>
        <p className="text-gray-600">
        Enter Rent, Home Loan Interest, Tenant and other details. You can get the interest details from the home loan certificate issued by the bank.
        </p>
      </div>
      <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Net Taxable Income: ₹{rentFormData.netTaxableIncome}
          </h2>
        </div>
    </div>

    

      {/* Render components */}
      <div className="flex flex-col gap-4">
        <HouseAddresComponent
          data={rentFormData.houseAddress}
          onChange={(updatedData: any) => handleFormChange("houseAddress", updatedData)}
        />
        <OwnerDetails
          data={rentFormData.ownerDetails}
          onChange={(updatedData: any) => handleFormChange("ownerDetails", updatedData)}
        />
     <TaxSavingsDetails
  data={rentFormData.taxSavings }
  onChange={(updatedData: any) => handleFormChange("taxSavings", updatedData)}
/>
        <RentalIncomeDetails  data={rentFormData.rentalIncomeDetails }
  onChange={(updatedData: any) => handleFormChange("rentalIncomeDetails", updatedData)} />
        <TenantDetailsComponent
  data={rentFormData.tentatDetails}
  onChange={(updatedData) =>
    setRentFormData((prev) => ({
      ...prev,
      tentatDetails: updatedData,
    }))
  }
/>

      </div>

      </div>
    <div className="lg:col-span-1">
        <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>
    </div>
  );
};

export default RentProperty;
