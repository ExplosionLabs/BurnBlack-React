import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { fetchProfitLossData } from "@/api/professionalIncome";

const ProfitLoss: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    turnOverOption: "",
    turnOverFuture: "",
    turnOverCurrency: "",
    turnOverCommudity: "",
    totalIncome: 0,
    pValueFuture: "",
    pValueOption: "",
    pValueCurrecy: "",
    pValueCommudity: "",
    otherBrokerageExpenses: "",
    totalExpenses: 0,
    totalProfit: 0,
  });

  const calculateIncome = (
    turnOverOption: string,
    turnOverFuture: string,
    turnOverCurrency: string,
    turnOverCommudity: string
  ) => {
    return (
      parseFloat(turnOverOption || "0") +
      parseFloat(turnOverFuture || "0") +
      parseFloat(turnOverCurrency || "0") +
      parseFloat(turnOverCommudity || "0")
    );
  };

  const calculateExpense = (
    pValueOption: string,
    pValueFuture: string,
    pValueCommudity: string,
    pValueCurrecy: string,
    otherBrokerageExpenses: string
  ) => {
    return (
      parseFloat(pValueOption || "0") +
      parseFloat(pValueFuture || "0") +
      parseFloat(pValueCommudity || "0") +
      parseFloat(pValueCurrecy || "0") +
      parseFloat(otherBrokerageExpenses || "0")
    );
  };

  const calculateProfit = (totalIncome: number, totalExpenses: number) => {
    return totalIncome - totalExpenses;
  };

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totalIncome: calculateIncome(
        prevState.turnOverOption,
        prevState.turnOverFuture,
        prevState.turnOverCurrency,
        prevState.turnOverCommudity
      ),
    }));
  }, [
    formData.turnOverOption,
    formData.turnOverFuture,
    formData.turnOverCurrency,
    formData.turnOverCommudity,
  ]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totalExpenses: calculateExpense(
        prevState.pValueOption,
        prevState.pValueFuture,
        prevState.pValueCommudity,
        prevState.pValueCurrecy,
        prevState.otherBrokerageExpenses
      ),
    }));
  }, [
    formData.pValueOption,
    formData.pValueFuture,
    formData.pValueCommudity,
    formData.pValueCurrecy,
    formData.otherBrokerageExpenses,
  ]);

  useEffect(() => {
    setFormData((prevState) => ({
      ...prevState,
      totalProfit: calculateProfit(prevState.totalIncome, prevState.totalExpenses),
    }));
  }, [formData.totalIncome, formData.totalExpenses]);

  useEffect(() => {
    const fetchProfessionalIncome = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        return;
      }
      try {
        const response = await fetchProfitLossData(token);
        if(response){

        
        const data = response.data;
        setFormData(data);
      }
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addProfitLossData`,
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
          className="w-full rounded-lg border border-gray-200 bg-white px-8 py-2.5 text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  )
  return (
    <div className="">
       <div className="mb-6 flex items-center gap-4">
        <Link to="/fileITR/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-2xl font-semibold text-gray-900">Profit And Loss</h1>
      </div>
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center gap-3">
        <PlusCircle className="h-12 w-12 text-red-500" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold text-gray-900">Profit & Loss</h1>
            <span className="rounded bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
              Simplified P&L Sheet
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Details of income and expenses of your business/profession for the period - April 2023 to March 2024. Following
            details will be auto-calculated from the F&O reports uploaded in capital gains section.
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-700">Profit(Income - Expenses)</span>
          <span className="text-lg font-semibold">₹{formData.totalProfit}</span>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" />
              <h2 className="font-medium text-gray-900">Income</h2>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Income:</div>
              <div className="font-medium">₹{formData.totalIncome}</div>
            </div>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            Details of income earned from the businesses, professional services, trading activities etc.
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="Turnover from options" name="turnOverOption" value={formData.turnOverOption} />
            <InputField label="Turnover from futures" name="turnOverFuture" value={formData.turnOverFuture} />
            <InputField
              label="Turnover from currency derivatives"
              name="turnOverCurrency"
              value={formData.turnOverCurrency}
            />
            <InputField
              label="Turnover from commodity derivatives"
              name="turnOverCommudity"
              value={formData.turnOverCommudity}
            />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-blue-500" />
              <h2 className="font-medium text-gray-900">Expenses</h2>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600">Total Expenses:</div>
              <div className="font-medium">₹{formData.totalExpenses}</div>
            </div>
          </div>
          <p className="mb-4 text-sm text-gray-600">Enter details of expenses incurred wrt businesses or trading activities</p>
          <div className="grid gap-4 md:grid-cols-2">
            <InputField label="Purchase value of futures" name="pValueFuture" value={formData.pValueFuture} />
            <InputField label="Purchase value of options" name="pValueOption" value={formData.pValueOption} />
            <InputField
              label="Purchase value of currency derivatives"
              name="pValueCurrecy"
              value={formData.pValueCurrecy}
            />
            <InputField
              label="Purchase value of commodity derivatives"
              name="pValueCommudity"
              value={formData.pValueCommudity}
            />
          </div>
          <div className="mt-4">
            <InputField
              label="Other Brokerage Expenses"
              name="otherBrokerageExpenses"
              value={formData.otherBrokerageExpenses}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default ProfitLoss;
