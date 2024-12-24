import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./StocksFund/Modal";
import StockMututalForm from "./StocksFund/StockMutualForm";
import ForeignAssetForm from "./ForeignAssets/ForeignAssetsForm";
import SectionNavigation from "@/utils/SectionNavigation";
import LandBuildForm from "./LandBuildComponent/LandBuildForm";
import StockRsuForm from "./StockRsu/StockRsuForm";
import BondsDebentureForm from "./BondsDebenture/BondsDebenture";
import LongShortTerm from "./LongShortTerm/LongShortTerm";
import GoldAssestsForm from "./GoldAssestComponent/GoldAssetsForm";
import { fetchBondData, fetchForeignAssetsData, fetchGoldData, fetchLandFormData, fetchLongShortData, fetchStockRsuData } from "@/api/incomeSoucre";
import Sliderbar from "@/Layout/Sidebar";
import { ArrowLeft, BarChart2 } from "lucide-react";
import { ChangeEvent } from "react"
import { Link } from "react-router-dom";
const CapitalGainSubMain: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Stocks" | "Mutual Funds">("Stocks");
  const [step, setStep] = useState(1);


  const [existingStockData, setExistingStockData] = useState<any | null>(null);
  const [existingMutualData, setExistingMutualData] = useState<any | null>(null);
  const [existingForeignData, setExistingForeignData] = useState<any | null>(null);
  const [existingLandFormData, setExistingLandFormData] = useState<any | null>(null);
  const [existingStockRsuData, setExistingStockRsuData] = useState<any | null>(null);
  const [existingBondDebentureData, setExistingBondDebentureData] = useState<any | null>(null);
  const [existingShortLongData, setExistingShortLongData] = useState<any | null>(null);
  const [existingGoldData, setExistingGoldData] = useState<any | null>(null);
  const [isForeignModalOpen, setIsForeignModalOpen] = useState(false);
  const [isLandBuildModalOpen, setIsLandBuildModalOpen] = useState(false);
  const [isStockRsuModalOpen, setIsStockRsuModalOpen] = useState(false);
  const [isBondDebentureModalOpen, setIsBondDebentureModalOpen] = useState(false);
  const [isshortLongModalOpen, setIsShortLongModalOpen] = useState(false);
  const [isGoldModalOpen, setIsGoldModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    assetType: "Stocks",
    assetSubType: "",
    dateOfSale: "",
    dateOfPurchase: "",
    description: "",
    salePrice: "",
    transferExpenses: "",
    purchasePrice: "",
    sttPaid: "",
  });

  const [foreignFormData, setForeignFormData] = useState({
    assetSubType: "",
    dateOfSale: "",
    dateOfPurchase: "",
    description: "",
    salePrice: "",
    transferExpenses: "",
    purchasePrice: ""
  });
  const [landFormData, setLandFormData] = useState({
    assetSubType: "",
    dateOfSale: "",
    dateOfPurchase: "",
    description: "",
    salePrice: "",
    transferExpenses: "",
    purchasePrice: "",
    stampDutyPrice:"",
    isHouseProperty: false,
    improvementDetails: [{ description: "", amount: "" }],
    propertyAddress: {
      pincode: "",
      addressLine: "",
      country: "",
      state: "",
      city: "",
    },
    buyers: [
      {
        buyerName: "",
        ownershipPercentage: "",
        aadhaar: "",
        pan: "",
        amountPaid: "",
      },
    ],
  });

  const [stockRsuData, setStockRsuData] = useState({
    assetSubType: "",
    dateOfSale: "",
    dateOfPurchase: "",
    description: "",
    salePrice: "",
    transferExpenses: "",
    exercisePrice: "",
    sttPaid: "",
    fairValue:""
  });
  const [bondDebentureData, setBondDebentureData] = useState({
    assetSubType: "",
    dateOfSale: "",
    dateOfPurchase: "",
    description: "",
    salePrice: "",
    transferExpenses: "",
    purchasePrice:""
  });
  const [shortTermDetails, setShortTermDetails] = useState({
    shortTermCapitalGain: "no",
    shortOtherAmountDeemed: "",
    shortTotalAmountDeemed: "",
    shortUnutilizedCapitalGain: "notApplicable",
    shortEntries: [
      {
        shortPrevYear: "",
        shortSection: "",
        shortYearNewAsset: "",
        shortAmountUtilised: "",
        shortAmountNotUsed: "",
      },
    ],
  });

  const [longTermDetails, setLongTermDetails] = useState({
    longTermCapitalGain: "no", // Whether there's a long-term capital gain
    longOtherAmountDeemed: "",
    longTotalAmountDeemed: "",
    unutilizedCapitalGain: "notApplicable",
    longEntries: [
      {
        longPrevYear: "",
        longSection: "",
        longYearNewAsset: "",
        longAmountUtilised: "",
        longAmountNotUsed: "",
      },
    ],
  });
  const [goldTermDetails, setGoldTermDetails] = useState({
    dateOfSale: "",
    dateOfPurchase: "",
    description: "",
    salePrice: "",
    transferExpenses: "",
    purchasePrice: "",
    improvementDetails: [{ description: "", amount: "" }],
  

  });
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extracts "yyyy-MM-dd"
  };


  const resetForm = () => {
    setFormData({
      assetType: activeTab === "Stocks" ? "Stocks" : "Mutual Funds",
      assetSubType: "",
      dateOfSale: "",
      dateOfPurchase: "",
      description: "",
      salePrice: "",
      transferExpenses: "",
      purchasePrice: "",
      sttPaid: "",
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setStep(1);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleInputStockRsuChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setStockRsuData({ ...stockRsuData, [name]: value });
  };
  const handleInputBondDebentureChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBondDebentureData({ ...bondDebentureData, [name]: value });
  };

  
  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const assetType = activeTab === "Stocks" ? "Stock" : "Mutual Fund";

      const url = (activeTab === "Stocks" && existingStockData) || 
                  (activeTab === "Mutual Funds" && existingMutualData)
        ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editStockMutualData`
        : `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/postStockMutualData`;

      const dataToSubmit = { ...formData, assetType };
      const response = await axios.post(url, dataToSubmit, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message);
      closeModal();
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };

  const handleForeignInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForeignFormData({ ...foreignFormData, [name]: value });
  };
  const handleShortTermInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
  
    console.log("e", e.target);
  
    // Ensure `index` is a number if provided
    const numericIndex = typeof index === "string" ? parseInt(index, 10) : index;
  
    if (
      name.startsWith("shortPrevYear_") ||
      name.startsWith("shortSection_") ||
      name.startsWith("shortYearNewAsset_") ||
      name.startsWith("shortAmountUtilised_") ||
      name.startsWith("shortAmountNotUsed_")
    ) {
      const fieldName = name.split("_")[0]; // Get the dynamic part of the name
      setShortTermDetails((prevData) => {
        const updatedEntries = [...prevData.shortEntries]; // Create a copy of the shortEntries array
  
        // Validate `numericIndex` before updating the array
        if (
          numericIndex !== undefined &&
          Number.isInteger(numericIndex) &&
          numericIndex >= 0 &&
          numericIndex < updatedEntries.length
        ) {
          updatedEntries[numericIndex] = {
            ...updatedEntries[numericIndex],
            [fieldName]: value,
          };
        }
  
        return {
          ...prevData,
          shortEntries: updatedEntries,
        };
      });
    } else {
      // For top-level fields like shortTermCapitalGain, shortOtherAmountDeemed, etc.
      setShortTermDetails((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  const handleLongTermInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index?: number
  ) => {
    const { name, value } = e.target;
  
    if (
      name.startsWith("longPrevYear_") ||
      name.startsWith("longSection_") ||
      name.startsWith("longYearNewAsset_") ||
      name.startsWith("longAmountUtilised_") ||
      name.startsWith("longAmountNotUsed_")
    ) {
      const fieldName = name.split("_")[0]; // Extract the dynamic part of the field name
      setLongTermDetails((prevData) => {
        const updatedEntries = [...prevData.longEntries]; // Clone the longEntries array
  
        // Ensure the index is valid
        if (index !== undefined && index >= 0 && index < updatedEntries.length) {
          updatedEntries[index] = {
            ...updatedEntries[index],
            [fieldName]: value, // Update the specific field
          };
        }
  
        return {
          ...prevData,
          longEntries: updatedEntries,
        };
      });
    } else {
      // For top-level fields like longTermCapitalGain, longOtherAmountDeemed, etc.
      setLongTermDetails((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };
  
  
  
  
  
  const addShortTermEntry = () => {
    setShortTermDetails((prevDetails) => ({
      ...prevDetails,
      shortEntries: [
        ...prevDetails.shortEntries,
        { shortPrevYear: "", shortSection: "", shortYearNewAsset: "", shortAmountUtilised: "",  shortAmountNotUsed: "" },
      ],
    }));
  };
    
  const addLongTermEntry = () => {
    setLongTermDetails((prevDetails) => ({
      ...prevDetails,
      longEntries: [
        ...prevDetails.longEntries,
        { longPrevYear: "", longSection: "", longYearNewAsset: "", longAmountUtilised: "", longAmountNotUsed: "" },
      ],
    }));
  };
  
   const handleForeignSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingForeignData? `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editForeignAssest`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/addForeignAssest`;

      const response = await axios.post(url, foreignFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
      setIsForeignModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };
   const handleLandForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingLandFormData?`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editLandFormAssest`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/addLandBuildAssest`;

      const response = await axios.post(url, landFormData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
setIsLandBuildModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };
   const handleStockRsuForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingStockRsuData?`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editStockRsuAssest`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/addStockRsuAssest`;

      const response = await axios.post(url, stockRsuData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
setIsStockRsuModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };
   const handleBondDebentureForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingBondDebentureData?`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editBondDebenture`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/addBondDebentureAssest`;

      const response = await axios.post(url, bondDebentureData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
setIsBondDebentureModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };
   const handleLongShortForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingShortLongData?`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editLongShortGain`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/postsLongShortGain`;
const data={shortTermDetails,longTermDetails}
      const response = await axios.post(url,data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
setIsShortLongModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };
  const handleInputChangeLandForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    const isCheckbox = e.target instanceof HTMLInputElement && type === "checkbox";
    setLandFormData((prevState: any) => ({
      ...prevState,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  
  const handleInputChangeGold = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
  
    const isCheckbox = e.target instanceof HTMLInputElement && type === "checkbox";
    setGoldTermDetails((prevState: any) => ({
      ...prevState,
      [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
    }));
  };
  

  const handleGoldAssetsForm = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = existingGoldData?`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/editGoldAssest`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/postsGoldAssests`;

      const response = await axios.post(url, goldTermDetails, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert(response.data.message);
setIsGoldModalOpen(false);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error submitting form");
    }
  };
  
  useEffect(() => {
    const fetchExistingData = async () => {
      const token = localStorage.getItem("token");
      const assetType = activeTab === "Stocks" ? "Stock" : "Mutual Fund";
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getStockMutualData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { assetType },
          }
        );

        const data = response.data;
      console.log("dat",data);
        if (data) {
          if (activeTab === "Stocks") {
            setExistingStockData(data);
          } else {
            setExistingMutualData(data);
          }
          setFormData({
            ...data,
            dateOfSale: data.dateOfSale ? formatDate(data.dateOfSale) : "",
            dateOfPurchase: data.dateOfPurchase ? formatDate(data.dateOfPurchase) : "",
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };

    fetchExistingData();
  }, [activeTab]);

  useEffect(() => {
    const fetchExistingForeignAssest = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        resetForm();  // Optionally handle the case when there is no token
        return;
      }
  
      try {
        const data = await fetchForeignAssetsData(token);
  
        if (data) {
          setExistingForeignData(data);
          setForeignFormData({
            ...data,
            dateOfSale: data.dateOfSale ? formatDate(data.dateOfSale) : "",
            dateOfPurchase: data.dateOfPurchase ? formatDate(data.dateOfPurchase) : "",
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };
  
    fetchExistingForeignAssest();
  }, []);
  
  useEffect(() => {
    const fetchExistingLandFormAssest = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        resetForm();  // Optionally handle the case when there is no token
        return;
      }
  
      try {
        const data=await fetchLandFormData(token);

      
        if (data) {
          setExistingLandFormData(data);
          setLandFormData({
            ...data,
            dateOfSale: data.dateOfSale ? formatDate(data.dateOfSale) : "",
            dateOfPurchase: data.dateOfPurchase ? formatDate(data.dateOfPurchase) : "",
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };
    fetchExistingLandFormAssest();
  }, []);
  useEffect(() => {
    const fetchExistingStockRsuAssest = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        resetForm();  // Optionally handle the case when there is no token
        return;
      }
  
      try {
        const data = await fetchStockRsuData(token);

      
        if (data) {
          setExistingStockRsuData(data);
          setStockRsuData({
            ...data,
            dateOfSale: data.dateOfSale ? formatDate(data.dateOfSale) : "",
            dateOfPurchase: data.dateOfPurchase ? formatDate(data.dateOfPurchase) : "",
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };
    fetchExistingStockRsuAssest();
  }, []);
  useEffect(() => {
    const fetchExistingBondDebentureAssest = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        resetForm();  // Optionally handle the case when there is no token
        return;
      }
  
      try {
        const response = await fetchBondData(token);

        const data = response.data;
        if (data) {
          setExistingBondDebentureData(data);
          setBondDebentureData({
            ...data,
            dateOfSale: data.dateOfSale ? formatDate(data.dateOfSale) : "",
            dateOfPurchase: data.dateOfPurchase ? formatDate(data.dateOfPurchase) : "",
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };
   fetchExistingBondDebentureAssest();
  }, []);
  useEffect(() => {
    const fetchExistingLongShortAssets = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        resetForm();  // Optionally handle the case when there is no token
        return;
      }
  
      try {
        const data =await fetchLongShortData(token);

       
        if (data) {
          setExistingShortLongData(data);
          setShortTermDetails(data.shortTermDetails
          );
          setLongTermDetails(data.longTermDetails

          );
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };
    fetchExistingLongShortAssets();
  }, []);

  useEffect(() => {
    const fetchExistingGoldAssest = async () => {
      const token = localStorage.getItem("token");
  
      if (!token) {
        console.error("No token found in localStorage");
        resetForm();  // Optionally handle the case when there is no token
        return;
      }
  
      try {
        const data = await fetchGoldData(token);

    
        if (data) {
          setExistingGoldData(data);
          setGoldTermDetails({
            ...data,
            dateOfSale: data.dateOfSale ? formatDate(data.dateOfSale) : "",
            dateOfPurchase: data.dateOfPurchase ? formatDate(data.dateOfPurchase) : "",
          });
        } else {
          resetForm();
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        resetForm();
      }
    };
    fetchExistingGoldAssest();
  }, []);
  return (
    <>
     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
      <div className="lg:col-span-2 space-y-4 overflow-y-auto h-screen pr-4 scrollbar-hide">
      <div className="flex items-center gap-4 mb-4">
          <Link to="/fileITR/incomeSources" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">Add Capital Gains Income</h1>
                </div>
        </div>
  
    <div className="flex flex-col gap-4">
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BarChart2  className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 text-base">Capital Gain: Stocks & Mutual Funds</h3>
            <p className="text-sm text-gray-500 mt-1 ">
           
Import Stocks, Mutual Funds, Futures & Options (F&O), Derivatives,<br /> Currency, Commodity
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
          onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
                {formData ? "Edit Details" : "Add Details"}
          </button>
        </div>
      </div>

    
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BarChart2  className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900 text-base">Foreign Asset</h3>
          <p className="text-sm text-gray-500 mt-1">
            Declare assets held outside India, such as bank accounts, <br /> investments, and properties.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsForeignModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Add Foreign Assets
      </button>
    </div>
  </div>

  {/* Sale of Land or Building */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BarChart2  className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900 text-base">Sale of Land or Building</h3>
          <p className="text-sm text-gray-500 mt-1">
            Report the sale of land, buildings, or other immovable properties.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsLandBuildModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Add Entry
      </button>
    </div>
  </div>

  {/* Stock Options & RSUs */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BarChart2  className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900 text-base">Stock Options & RSUs</h3>
          <p className="text-sm text-gray-500 mt-1">
            Declare your income from stock options and RSUs (Restricted Stock Units).
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsStockRsuModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Add Entry
      </button>
    </div>
  </div>

  {/* Bonds and Debentures */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BarChart2 className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900 text-base">Bonds and Debentures</h3>
          <p className="text-sm text-gray-500 mt-1">
            Record your capital gains or losses from bonds and debentures.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsBondDebentureModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
      >
        Add Entry
      </button>
    </div>
  </div>

  {/* Gold, Jewellery, and Others */}
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BarChart2  className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900 text-base">Gold, Jewellery and Others</h3>
          <p className="text-sm text-gray-500 mt-1">
            Declare gains from selling gold, jewellery, or other valuable items.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsGoldModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-yellow-700 font-medium"
      >
        Add Details
      </button>
    </div>
  </div>
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <BarChart2  className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-medium text-gray-900 text-base">Deemed Capital Gains</h3>
          <p className="text-sm text-gray-500 mt-1">
            Declare gains from selling gold, jewellery, or other valuable items.
          </p>
        </div>
      </div>
      <button
        onClick={() => setIsShortLongModalOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-yellow-700 font-medium"
      >
        Add Details
      </button>
    </div>
  </div>

      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
      <div className="text-center mb-4">
  <div className="inline-flex items-center">
    <label className="flex items-center cursor-pointer mr-6">
      <input
        type="radio"
        name="activeTab"
        value="Stocks"
        checked={activeTab === "Stocks"}
        onChange={() => setActiveTab("Stocks")}
        className="form-radio h-5 w-5 text-blue-600"
      />
      <span className="ml-2 text-gray-800 font-medium">Stocks</span>
    </label>
    <label className="flex items-center cursor-pointer">
      <input
        type="radio"
        name="activeTab"
        value="Mutual Funds"
        checked={activeTab === "Mutual Funds"}
        onChange={() => setActiveTab("Mutual Funds")}
        className="form-radio h-5 w-5 text-blue-600"
      />
      <span className="ml-2 text-gray-800 font-medium">Mutual Funds</span>
    </label>
  </div>
</div>


        <StockMututalForm
          formData={formData}
          activeTab={activeTab}
          step={step}
          handleInputChange={handleInputChange}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSubmit={handleSubmit}
        />
      </Modal>
      <Modal isOpen={isForeignModalOpen} onClose={() => setIsForeignModalOpen(false)}>
        <ForeignAssetForm
          formData={foreignFormData}
          step={step}
          handleInputChange={handleForeignInputChange}
          handleNext={handleNext}
          handleBack={handleBack}
          handleSubmit={handleForeignSubmit}
        />
      </Modal>
      <Modal isOpen={isLandBuildModalOpen} onClose={() => setIsLandBuildModalOpen(false)}>
      <LandBuildForm
  landFormData={landFormData}
  setLandFormData={setLandFormData}
  step={step}
  handleNext={handleNext}
  handleBack={handleBack}
  handleSubmit={handleLandForm}
  handleInputChange={handleInputChangeLandForm} // Pass handleInputChange
/>

      </Modal>
      <Modal isOpen={isStockRsuModalOpen} onClose={() => setIsStockRsuModalOpen(false)}>
      <StockRsuForm
  formData={stockRsuData}
  step={step}
  handleInputChange={handleInputStockRsuChange}
  handleNext={handleNext}
  handleBack={handleBack}
  handleSubmit={handleStockRsuForm}
/>

      </Modal>
      <Modal isOpen={isBondDebentureModalOpen} onClose={() => setIsBondDebentureModalOpen(false)}>
      <BondsDebentureForm
  formData={bondDebentureData}
  step={step}
  handleInputChange={handleInputBondDebentureChange}
  handleNext={handleNext}
  handleBack={handleBack}
  handleSubmit={handleBondDebentureForm}
/>

      </Modal>
      <Modal isOpen={isshortLongModalOpen} onClose={() => setIsShortLongModalOpen(false)}>
      <LongShortTerm
    shortTermData={shortTermDetails}
    longTermData={longTermDetails}
    step={step}
    handleShortTermInputChange={handleShortTermInputChange}
    handleLongTermInputChange={handleLongTermInputChange}
    handleNext={handleNext}
    handleBack={handleBack}
    handleSubmit={handleLongShortForm}
    addShortTermEntry={addShortTermEntry}
    addLongTermEntry={addLongTermEntry}
  />

      </Modal>
      <Modal isOpen={isGoldModalOpen} onClose={() => setIsGoldModalOpen(false)}>
      <GoldAssestsForm
  landFormData={goldTermDetails}
  setLandFormData={setGoldTermDetails
  }
  step={step}
  handleNext={handleNext}
  handleBack={handleBack}
  handleSubmit={handleGoldAssetsForm}
  handleInputChange={handleInputChangeGold} // Pass handleInputChange
/>

      </Modal>
      
    </div>
    
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>
    </div>
    </>
  );
};

export default CapitalGainSubMain;
