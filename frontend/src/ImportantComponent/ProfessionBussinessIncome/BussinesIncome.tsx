import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

const BussinessIncome: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    revenueCash: "",
    revenueMode: "",
    revenueDigitalMode: "",
    profitcash: 0,
    profitMode: 0,
    profitDigitalMode: 0  ,
  });

  const [professionDetails, setProfessionDetails] = useState([
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
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getBussinessIncomeData`,
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

  const saveData = async (updatedData) => {
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

  const handleChange = (e) => {
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

  const handleDetailChange = (index, e) => {
    const { name, value } = e.target;
    const updatedDetails = [...professionDetails];
    updatedDetails[index][name] = value;
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

  return (
    <div>
        <h1>Bussiness Income</h1>
      <form>
        {professionDetails.map((detail, index) => (
          <div key={index}>
            <label>Profession Type*</label>
            <select
              name="professionTypes"
              value={detail.professionTypes}
              onChange={(e) => handleDetailChange(index, e)}
            >
              <option value="">Select Profession</option>
              <option value="Computer and Related Services">
                Computer and Related Services
              </option>
              <option value="Profession">Profession</option>
              <option value="Healthcare Services">
                Healthcare Services
              </option>
              <option value="Culture & Sports">Culture & Sports</option>
            </select>

            <label>Nature of Profession*</label>
            <select
              name="natureOfProfessions"
              value={detail.natureOfProfessions}
              onChange={(e) => handleDetailChange(index, e)}
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

            <label>Company Name*</label>
            <input
              type="text"
              name="companyNames"
              value={detail.companyNames}
              onChange={(e) => handleDetailChange(index, e)}
              required
            />

            <label>Description (Optional)</label>
            <input
              type="text"
              name="descriptions"
              value={detail.descriptions}
              onChange={(e) => handleDetailChange(index, e)}
            />
          </div>
        ))}

        <button type="button" onClick={handleAddDetail}>
          Add More Details
        </button>

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

        <label>Profit Via Cash</label>
        <input
          type="number"
          name="profitcash"
          value={formData.profitcash}
          readOnly
        />
        <label>Profit Via Other Mode</label>
        <input
          type="number"
          name="profitMode"
          value={formData.profitMode}
          readOnly
        />
        <label>Profit Via Digital Mode</label>
        <input
          type="number"
          name="profitDigitalMode"
          value={formData.profitDigitalMode}
          readOnly
        />
      </form>
    </div>
  );
};

export default BussinessIncome;
