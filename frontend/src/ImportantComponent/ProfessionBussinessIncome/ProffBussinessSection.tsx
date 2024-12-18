import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const ProfBussinessSection: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);


  const [professionDetails, setProfessionDetails] = useState([
    {
      professionTypes: "",
      natureOfProfessions: "",
      companyNames: "",
      descriptions: "",
    },
  ]);


  useEffect(() => {
    const fetchProfessionalIncome = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getProfandBussinessIncomeData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
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

  const saveData = async (updatedData: { professionDetail: { professionTypes: string; natureOfProfessions: string; companyNames: string; descriptions: string; }[]; }) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addProfandBussinessIncomeData`,
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


  const handleDetailChange = (
    index: number,
    e: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
  
    // Ensure `name` is a key of the object
    if (name in professionDetails[index]) {
      const updatedDetails = [...professionDetails];
      updatedDetails[index] = {
        ...updatedDetails[index],
        [name]: value, // Update the specific field dynamically
      };
      setProfessionDetails(updatedDetails);
  
      saveData({
        professionDetail: updatedDetails,
      });
    }
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

    });
  };

  return (
    <>
   
    <div>
      <h1>Regular Business & Professional Income (Books of Accounts maintained)</h1>
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
      </form>
    </div>
    <div>
      <div>

    P&L (Profit And Loss)
      </div>
      <Link to="/fileITR/profit-and-loss-boa"> Add Detail</Link>

    </div>
    <div>
      <div>
      Balance Sheet
      </div>
      <Link to="/fileITR/balance-sheet-boa"> Add Detail</Link>

    </div>
    <div>

Depreciation
   <Link to="/fileITR/add-deprectation">
   Add Details</Link>
   </div>
    </>
  );
};

export default ProfBussinessSection;
