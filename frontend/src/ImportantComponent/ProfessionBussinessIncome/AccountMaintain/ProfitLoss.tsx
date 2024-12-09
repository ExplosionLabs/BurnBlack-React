import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

const ProfitLoss: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    revenueCash: "",
    revenueMode: "",
    revenueDigitalMode: "",
    totalRevenue: 0,
  });

 

 


  useEffect(() => {
    const fetchProfessionalIncome = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getProfesionalIncomeData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setFormData({
          revenueCash: data.revenueCash || "",
          revenueMode: data.revenueMode || "",
          revenueDigitalMode: data.revenueDigitalMode || ""
          })
       
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchProfessionalIncome();
    }
  }, [isUserLoggedIn]);

  const saveData = async (updatedData) => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    saveData({
      ...updatedFormData,
    });
  };

 

  

  return (
    <div>
      <form>
       <h1>Profit Loss</h1>

        <label>Revenue via Cash</label>
        <input
          type="number"
          name="revenueCash"
          value={formData.revenueCash}
          onChange={handleChange}
        />

        <label>Revenue via Other Modes</label>
        <input
          type="number"
          name="revenueMode"
          value={formData.revenueMode}
          onChange={handleChange}
        />

        <label>Revenue via Digital Modes</label>
        <input
          type="number"
          name="revenueDigitalMode"
          value={formData.revenueDigitalMode}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default ProfitLoss;
