import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./StocksFund/Modal";

const CapitalGainSubMain: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"Stocks" | "Mutual Funds">("Stocks");
  const [step, setStep] = useState(1);

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

  const [existingStockData, setExistingStockData] = useState<any | null>(null);
  const [existingMutualData, setExistingMutualData] = useState<any | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // Extracts "yyyy-MM-dd"
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
  return (
    <div className="p-4">
      <h1 className="text-lg font-bold mb-4">
        Capital Gain: Stocks, Mutual Funds, Futures & Options (F&O), and Others
      </h1>
      <button
        onClick={openModal}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
      >
        {activeTab === "Stocks" && existingStockData
          ? "Edit Stock Details"
          : activeTab === "Mutual Funds" && existingMutualData
          ? "Edit Mutual Fund Details"
          : "Add Details"}
      </button>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
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

        {step === 1 && (
          <div>
            <h2 className="text-lg font-bold mb-4">{activeTab}</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Select Type of Asset</label>
              <select
                name="assetSubType"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={formData.assetSubType}
              >
                {activeTab === "Stocks" ? (
                  <>
                    <option value="">Select</option>
                    <option value="Listed Securities">Listed Securities</option>
                    <option value="Non Listed Securities">Non Listed Securities</option>
                  </>
                ) : (
                  <>
                    <option value="">Select</option>
                    <option value="Mutual Fund(Equity)">Mutual Fund (Equity)</option>
                    <option value="Mutual Fund(Other than Equity)">
                      Mutual Fund (Other than Equity)
                    </option>
                  </>
                )}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date of Sale *</label>
              <input
                type="date"
                name="dateOfSale"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={formData.dateOfSale}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Date of Purchase *</label>
              <input
                type="date"
                name="dateOfPurchase"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={formData.dateOfPurchase}
                required
              />
            </div>
            <button
              onClick={handleNext}
              className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-bold mb-4">Additional Details</h2>
            <div className="mb-4">
              <label className="block text-gray-700">Description of Asset Sold</label>
              <input
                type="text"
                name="description"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={formData.description}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total Sale Price *</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="salePrice"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.salePrice}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Transfer Expenses</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="transferExpenses"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.transferExpenses}
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Purchase Price *</label>
              <div className="flex items-center">
                <span className="mr-2">₹</span>
                <input
                  type="number"
                  name="purchasePrice"
                  onChange={handleInputChange}
                  className="w-full border rounded px-3 py-2"
                  value={formData.purchasePrice}
                  required
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Was STT Paid? *</label>
              <select
                name="sttPaid"
                onChange={handleInputChange}
                className="w-full border rounded px-3 py-2"
                value={formData.sttPaid}
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </div>
            <button
  onClick={handleSubmit}
  className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
>
  {(activeTab === "Stocks" && existingStockData) || 
   (activeTab === "Mutual Funds" && existingMutualData)
    ? "Edit Details"
    : "Add Details"}
</button>

            <button
              onClick={handleBack}
              className="bg-gray-300 text-gray-700 py-2 px-4 rounded ml-4"
            >
              Back
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default CapitalGainSubMain;
