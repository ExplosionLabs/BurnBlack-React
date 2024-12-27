import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { ArrowLeft, PlusCircle, Trash2, Info } from 'lucide-react'
import { Link } from "react-router-dom";
import { fetchBussinessData } from "@/api/professionalIncome";

const BussinessIncome: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  type ProfessionDetail = {
    professionTypes: string;
    natureOfProfessions: string;
    companyNames: string;
    descriptions: string;
  };
  const [formData, setFormData] = useState({
    revenueCash: "",
    revenueMode: "",
    revenueDigitalMode: "",
    profitcash: 0,
    profitMode: 0,
    profitDigitalMode: 0  ,
  });

  const [professionDetails, setProfessionDetails] = useState<ProfessionDetail[]>([
    {
      professionTypes: "",
      natureOfProfessions: "",
      companyNames: "",
      descriptions: "",
    },
  ]);

  const calculateProfit = (revenue: any) => {
    return (revenue) * 0.08;
  };

  // Update totalRevenue when revenue fields change
  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      profitcash:calculateProfit(prevState.revenueCash),
      profitMode:calculateProfit(prevState.revenueMode),
      profitDigitalMode:calculateProfit(prevState.revenueDigitalMode)
    }));
  }, [formData.revenueCash, formData.revenueMode, formData.revenueDigitalMode]);

  useEffect(() => {
    const fetchProfessionalIncome = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        return ;
      }
      try {
        const response = await fetchBussinessData(token);
        const data = response.data;
        setFormData({
          revenueCash: data.revenueCash || "",
          revenueMode: data.revenueMode || "",
          revenueDigitalMode: data.revenueDigitalMode || "",
          profitcash:calculateProfit(data.revenueCash),
          profitMode:calculateProfit(data.revenueMode),
          profitDigitalMode:calculateProfit(data.revenueDigitalMode)
        });
        setProfessionDetails(
          data.professionDetail || [
            {
              professionTypes: "",
              natureOfProfessions: "",
              companyNames: "",
              descriptions: "",
            },
          ]
        );
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchProfessionalIncome();
    }
  }, [isUserLoggedIn]);

  const saveData = async (updatedData: { revenueCash: string; revenueMode: string; revenueDigitalMode: string; profitcash: number; profitMode: number; profitDigitalMode: number; professionDetail: { professionTypes: string; natureOfProfessions: string; companyNames: string; descriptions: string; }[]; }) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addBussinessIncomeData`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    saveData({
      professionDetail: professionDetails,
      ...updatedFormData,
    });
  };

  const handleDetailChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    const updatedDetails = [...professionDetails];
    updatedDetails[index] = {
      ...updatedDetails[index],
      [name as keyof ProfessionDetail]: value,
    };
  
    setProfessionDetails(updatedDetails);
  
    saveData({
      professionDetail: updatedDetails,
      ...formData,
    });
  };
  

  const handleAddDetail = () => {
    const updatedDetails = [
      ...professionDetails,
      {
        professionTypes: "",
        natureOfProfessions: "",
        companyNames: "",
        descriptions: "",
      },
    ];
    setProfessionDetails(updatedDetails);

    saveData({
      professionDetail: updatedDetails,
      ...formData,
    });
  };

  const totalProfit = formData.profitcash + formData.profitMode + formData.profitDigitalMode
  const handleRemoveDetail = (index: number) => {
    setProfessionDetails(professionDetails.filter((_, i) => i !== index))
  }

  return (
    <div className="">
    <div className="">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link to="/fileITR/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Business Income under Section 44AD</h1>
      </div>

      {/* Main Form */}
      <div className="rounded-md border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Info className="h-5 w-5" />
            </span>
            <h2 className="font-medium text-gray-900">Please provide details of your business</h2>
          </div>
          <p className="text-sm text-gray-500">
            You can first select the business type and then specify the nature of business
          </p>
        </div>

        {/* Business Details */}
        {professionDetails.map((detail, index) => (
          <div key={index} className="mb-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Business Type<span className="text-red-500">*</span>
                </label>
                <select
                  name="professionTypes"
                  value={detail.professionTypes}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Business</option>
                  <option value="Computer and Related Services">Computer and Related Services</option>
                  <option value="Profession">Profession</option>
                  <option value="Healthcare Services">Healthcare Services</option>
                  <option value="Culture & Sports">Culture & Sports</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nature of Business<span className="text-red-500">*</span>
                </label>
                <select
                  name="natureOfProfessions"
                  value={detail.natureOfProfessions}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Nature of Business</option>
                  <option value="00001 - Share of income from firm only">
                    00001 - Share of income from firm only
                  </option>
                  <option value="01001 - Growing and manufacturing of tea">
                    01001 - Growing and manufacturing of tea
                  </option>
                  <option value="01002 - Growing and manufacturing of coffee">
                    01002 - Growing and manufacturing of coffee
                  </option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Company Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="companyNames"
                  value={detail.companyNames}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  name="descriptions"
                  value={detail.descriptions}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {index > 0 && (
                  <button
                    onClick={() => handleRemoveDetail(index)}
                    className="absolute right-0 top-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddDetail}
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          Add more items
        </button>

        {/* Revenue and Profit Details */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Revenue and Profit Details</h3>
          <div className="grid gap-6 md:grid-cols-3">
            {/* Cash Section */}
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Revenue via Cash</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="revenueCash"
                    value={formData.revenueCash}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-7 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Profit via Cash (8%)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="profitcash"
                    value={formData.profitcash}
                    readOnly
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pl-7 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Other Modes Section */}
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Revenue via Other Modes
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="revenueMode"
                    value={formData.revenueMode}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-7 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Profit via Other Modes (8%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="profitMode"
                    value={formData.profitMode}
                    readOnly
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pl-7 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Digital Modes Section */}
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Revenue via Digital Modes
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="revenueDigitalMode"
                    value={formData.revenueDigitalMode}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-7 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Profit via Digital Modes (8%)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                  <input
                    type="number"
                    name="profitDigitalMode"
                    value={formData.profitDigitalMode}
                    readOnly
                    className="w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 pl-7 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Total Profit */}
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">Total Profit</p>
            <p className="font-medium text-gray-900">₹ {totalProfit.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default BussinessIncome;
