import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

const BalanceSheet: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    longTermHold: "",
    shortTermHold: "",
    cash: "",
    balanceBank: "",
    otherAssets:"",
    totalAssest: "",
  
    capitalInvestment: "",
    securedLoan: "",
    totatLiablities: 0,
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

  

  return (
    <div>
      <form>
        <h1>Balance Sheet</h1>
    
        <div>
          <h1>Assets</h1>
          <p>Total Assests: {formData.totalAssest}</p>
          <label>Long-term holdings(Shares/MFs)</label>
          <input
            type="number"
            name="longTermHold"
            value={formData.longTermHold}
            onChange={handleChange}
          />

          <label>
Short-term holdings(Shares/MFs)</label>
          <input
            type="number"
            name="shortTermHold"
            value={formData.shortTermHold}
            onChange={handleChange}
          />

          <label>Cash you have</label>
          <input
            type="number"
            name="cash"
            value={formData.cash}
            onChange={handleChange}
          />

          <label>Balance in bank</label>
          <input
            type="number"
            name="balanceBank"
            value={formData.balanceBank}
            onChange={handleChange}
          />
          <label>Other Assets</label>
          <input
            type="number"
            name="otherAssets"
            value={formData.otherAssets}
            onChange={handleChange}
          />
        
        </div>

        <div>
          <h1>Liabilities</h1>
          <p>Total Liablilites: {formData.totatLiablities}</p>

          <label>Capital Investment</label>
          <input
            type="number"
            name="capitalInvestment"
            value={formData.capitalInvestment}
            onChange={handleChange}
          />

          <label>Secured Loan</label>
          <input
            type="number"
            name="securedLoan"
            value={formData.securedLoan}
            onChange={handleChange}
          />


        </div>
      </form>
    </div>
  );
};

export default BalanceSheet;
