import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

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
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getProfitLossData`,
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

  return (
    <div>
      <form>
        <h1>Profit Loss</h1>
        <h1>Total Profit: {formData.totalProfit}</h1>

        <div>
          <h1>Income</h1>
          <p>Total Income: {formData.totalIncome}</p>
          <label>Turnover from options</label>
          <input
            type="number"
            name="turnOverOption"
            value={formData.turnOverOption}
            onChange={handleChange}
          />

          <label>Turnover from futures</label>
          <input
            type="number"
            name="turnOverFuture"
            value={formData.turnOverFuture}
            onChange={handleChange}
          />

          <label>Turnover from currency derivatives</label>
          <input
            type="number"
            name="turnOverCurrency"
            value={formData.turnOverCurrency}
            onChange={handleChange}
          />

          <label>Turnover from commodity derivatives</label>
          <input
            type="number"
            name="turnOverCommudity"
            value={formData.turnOverCommudity}
            onChange={handleChange}
          />
        </div>

        <div>
          <h1>Expenses</h1>
          <p>Total Expenses: {formData.totalExpenses}</p>

          <label>Purchase value of futures</label>
          <input
            type="number"
            name="pValueFuture"
            value={formData.pValueFuture}
            onChange={handleChange}
          />

          <label>Purchase value of options</label>
          <input
            type="number"
            name="pValueOption"
            value={formData.pValueOption}
            onChange={handleChange}
          />

          <label>Purchase value of currency derivatives</label>
          <input
            type="number"
            name="pValueCurrecy"
            value={formData.pValueCurrecy}
            onChange={handleChange}
          />

          <label>Purchase value of commodity derivatives</label>
          <input
            type="number"
            name="pValueCommudity"
            value={formData.pValueCommudity}
            onChange={handleChange}
          />

          <label>Other Brokerage Expenses</label>
          <input
            type="number"
            name="otherBrokerageExpenses"
            value={formData.otherBrokerageExpenses}
            onChange={handleChange}
          />
        </div>
      </form>
    </div>
  );
};

export default ProfitLoss;
