import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

const BalanceSheet: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    longTermHold: "",
    shortTermHold: "",
    cash: "",
    balanceBank: "",
    otherAssets: "",
    totalAssest: 0, // Change to number
    capitalInvestment: "",
    securedLoan: "",
    totatLiablities: 0, // Change to number
  });
  

  const totalAsset = (
    longTermHold: string,
    shortTermHold: string,
    cash: string,
    balanceBank: string,
    otherAssets:string
  ) => {
    return (
      parseFloat(longTermHold || "0") +
      parseFloat(shortTermHold || "0") +
      parseFloat(cash || "0") +
      parseFloat(balanceBank || "0")+
      parseFloat(otherAssets || "0")
    );
  };

  const calculateLiabilities = (
    capitalInvestment: string,
    securedLoan: string,
  ) => {
    return (
      parseFloat(capitalInvestment || "0") +
      parseFloat(securedLoan || "0") 
    );
  };



  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totalAssest: totalAsset(
        prevState.longTermHold,
        prevState.shortTermHold,
        prevState.cash,
        prevState.balanceBank,
        prevState.otherAssets
      ),
    }));
  }, [
    formData.longTermHold,
    formData.shortTermHold,
    formData.cash,
    formData.balanceBank,
    formData.otherAssets,
  ]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totatLiablities: calculateLiabilities(
        prevState.capitalInvestment,
        prevState.securedLoan,
      ),
    }));
  }, [
    formData.capitalInvestment,
    formData.securedLoan,
  ]);


  useEffect(() => {
    const fetchProfessionalIncome = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getBalanceSheetData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setFormData(data);
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchProfessionalIncome();
    }
  }, [isUserLoggedIn]);

  const saveData = async (updatedData: any) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addBalanceSheetData`,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    saveData(updatedFormData);
  };

  
  const InputField = ({ label, name, value }: { label: string; name: string; value: string }) => (
    <div className="space-y-1.5">
      <label className="text-sm text-gray-600">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
        <input
          type="number"
          name={name}
          value={value}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-200 bg-white px-8 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  )
  

  return (
    <div className="p-6">
        <div className="mb-6 flex items-center gap-4">
        <Link to="/fileITR/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Balance Sheet</h1>
      </div>
      <div className="rounded-md border bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center gap-3">
          <PlusCircle className="h-6 w-6 text-red-500" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">Balance Sheet</h1>
              <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                Simplified Sheet
              </span>
            </div>
            <p className="mt-1 text-sm text-gray-600">
              Details of assets and liabilities of your business/profession for the period - April 2023 to March 2024.
            </p>
          </div>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Total Assets</span>
              <span className="text-lg font-semibold">₹{formData.totalAssest}</span>
            </div>
          </div>
          <div className="rounded-md bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">Total Liabilities</span>
              <span className="text-lg font-semibold">₹{formData.totatLiablities}</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-md border border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" />
              <h2 className="font-medium text-gray-900">Assets</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Long-term holdings (Shares/MFs)"
                name="longTermHold"
                value={formData.longTermHold}
              />
              <InputField
                label="Short-term holdings (Shares/MFs)"
                name="shortTermHold"
                value={formData.shortTermHold}
              />
              <InputField label="Cash you have" name="cash" value={formData.cash} />
              <InputField label="Balance in bank" name="balanceBank" value={formData.balanceBank} />
              <InputField label="Other Assets" name="otherAssets" value={formData.otherAssets} />
            </div>
          </div>

          <div className="rounded-md border border-gray-200 p-4">
            <div className="mb-4 flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" />
              <h2 className="font-medium text-gray-900">Liabilities</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Capital Investment"
                name="capitalInvestment"
                value={formData.capitalInvestment}
              />
              <InputField label="Secured Loan" name="securedLoan" value={formData.securedLoan} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BalanceSheet;
