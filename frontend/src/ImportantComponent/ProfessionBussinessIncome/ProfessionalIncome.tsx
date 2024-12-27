import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { ArrowLeft, PlusCircle, Trash2, Info } from 'lucide-react'
import { Link } from "react-router-dom";
import { fetchProfessionalData } from "@/api/professionalIncome";

interface ProfessionDetail {
  professionTypes: string;
  natureOfProfessions: string;
  companyNames: string;
  descriptions: string;
}
const ProfessionalIncome: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    revenueCash: "",
    revenueMode: "",
    revenueDigitalMode: "",
    totalRevenue: 0,
  });

  const [professionDetails, setProfessionDetails] = useState<ProfessionDetail[]>([
    {
      professionTypes: "",
      natureOfProfessions: "",
      companyNames: "",
      descriptions: "",
    },
  ]);

  const calculateTotalRevenue = (cash: string, mode: string, digital: string) => {
    return (Number(cash || 0) + Number(mode || 0) + Number(digital || 0)) * 0.5;
  };

  // Update totalRevenue when revenue fields change
  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totalRevenue: calculateTotalRevenue(
        prevState.revenueCash,
        prevState.revenueMode,
        prevState.revenueDigitalMode
      ),
    }));
  }, [formData.revenueCash, formData.revenueMode, formData.revenueDigitalMode]);

  useEffect(() => {
    const fetchProfessionalIncome = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        return ;
      }
      try {
        const response = await fetchProfessionalData(token);
        console.log("Repsons",response.data);
        const data = response.data;
        setFormData({
          revenueCash: data.revenueCash || "",
          revenueMode: data.revenueMode || "",
          revenueDigitalMode: data.revenueDigitalMode || "",
          totalRevenue: calculateTotalRevenue(
            data.revenueCash || 0,
            data.revenueMode || 0,
            data.revenueDigitalMode || 0
          ),
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

  const saveData = async (updatedData: { revenueCash: string; revenueMode: string; revenueDigitalMode: string; totalRevenue: number; professionDetail: { professionTypes: string; natureOfProfessions: string; companyNames: string; descriptions: string; }[]; }) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addProfesionalIncomeData`,
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
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const updatedDetails = [...professionDetails];
    updatedDetails[index][name as keyof ProfessionDetail] = value;
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

  const handleRemoveDetail = (index: number) => {
    setProfessionDetails(professionDetails.filter((_, i) => i !== index))
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link to="/fileITR/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Professional Income under Section 44ADA</h1>
      </div>

      {/* Main Form */}
      <div className="rounded-md border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Info className="h-5 w-5" />
            </span>
            <h2 className="font-medium text-gray-900">Please provide details of your profession(s)</h2>
          </div>
          <p className="text-sm text-gray-500">
            You can first select the profession type and then specify the nature of profession
          </p>
        </div>

        {/* Profession Details */}
        {professionDetails.map((detail, index) => (
          <div key={index} className="mb-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Profession Type<span className="text-red-500">*</span>
                </label>
                <select
                  name="professionTypes"
                  value={detail.professionTypes}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Profession</option>
                  <option value="Computer and Related Services">Computer and Related Services</option>
                  <option value="Profession">Profession</option>
                  <option value="Healthcare Services">Healthcare Services</option>
                  <option value="Culture & Sports">Culture & Sports</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Nature of Profession<span className="text-red-500">*</span>
                </label>
                <select
                  name="natureOfProfessions"
                  value={detail.natureOfProfessions}
                  onChange={(e) => handleDetailChange(index, e)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select Nature of Profession</option>
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
                  Name of Company<span className="text-red-500">*</span>
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

        {/* Revenue Details */}
        <div className="mb-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Total Revenue/Sales Details</h3>
          <div className="mb-2 flex justify-end">
            <p className="text-sm font-medium">
              Gross Revenue: <span className="text-gray-900">₹ {(formData.totalRevenue)*2}</span>
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
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
          </div>
        </div>

        {/* Total Expenses */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="mb-1 text-lg font-medium text-gray-900">Total Expenses</h3>
              <p className="text-sm text-gray-500">Total expenses should be less than 50% of gross revenue</p>
            </div>
            <div className="w-72">
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
                <input
                type="number"
                name="totalRevenue"
                value={formData.totalRevenue}
                readOnly
      
                  className="w-full rounded-md border border-gray-300 px-3 py-2 pl-7 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Net Taxable Income */}
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <p className="font-medium text-gray-900">
              Net taxable income u/s 44ADA(Gross Revenue - Total Expenses)
            </p>
            <p className="font-medium text-gray-900">₹ {formData.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProfessionalIncome;
