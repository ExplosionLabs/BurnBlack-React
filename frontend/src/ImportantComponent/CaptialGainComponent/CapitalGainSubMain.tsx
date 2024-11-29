import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./StocksFund/Modal";
import StockMututalForm from "./StocksFund/StockMutualForm";
import ForeignAssetForm from "./ForeignAssets/ForeignAssetsForm";
import SectionNavigation from "@/utils/SectionNavigation";
import LandBuildForm from "./LandBuildComponent/LandBuildForm";

const CapitalGainSubMain: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Stocks" | "Mutual Funds">("Stocks");
  const [step, setStep] = useState(1);


  const [existingStockData, setExistingStockData] = useState<any | null>(null);
  const [existingMutualData, setExistingMutualData] = useState<any | null>(null);
  const [existingForeignData, setExistingForeignData] = useState<any | null>(null);
  const [existingLandFormData, setExistingLandFormData] = useState<any | null>(null);
  const [isForeignModalOpen, setIsForeignModalOpen] = useState(false);
  const [isLandBuildModalOpen, setIsLandBuildModalOpen] = useState(false);

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
  const handleInputChangeLandForm = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target;
    setLandFormData((prevState: any) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
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
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getForeignAssest`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        
          }
        );

        const data = response.data;
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
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/capitalGain/getLandFormAssest`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        
          }
        );

        const data = response.data;
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
  return (
    <>
   <SectionNavigation/>
    <div className="p-4">
      <div>

      <h1 className="text-lg font-bold mb-4">Capital Gain: Stocks & Mutual Funds</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
        {formData ? "Edit Details" : "Add Details"}
      </button>
        </div>
        <div>
        <h1 className="text-lg font-bold mb-4">Foreign Assest</h1>
        <button
        
        onClick={() => setIsForeignModalOpen(true)}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Add Foreign Assets
      </button>
        </div>
        <div>
        <h1 className="text-lg font-bold mb-4">Sale of Land or Building</h1>
        <button
        
        onClick={() => setIsLandBuildModalOpen(true)}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
      >
        Add Entry
      </button>
        </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="text-center mb-4">
          <button
            onClick={() => setActiveTab("Stocks")}
            className={`px-4 py-2 rounded-l ${
              activeTab === "Stocks" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => setActiveTab("Mutual Funds")}
            className={`px-4 py-2 rounded-r ${
              activeTab === "Mutual Funds" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
          >
            Mutual Funds
          </button>
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
    </div>
    </>
  );
};

export default CapitalGainSubMain;
