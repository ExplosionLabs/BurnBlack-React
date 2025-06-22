import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";
import { fetchMedical80D } from "@/api/taxSaving";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";

const Medical80D = () => {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [formData, setFormData] = useState({
    selfAndFamily: {
      hasInsurance: "",
      premium: "",
      healthCheckup: "",
      isSeniorCitizen: false,
      medicalExpenditure: "",
    },
    parents: {
      hasInsurance: "",
      premium: "",
      healthCheckup: "",
      isSeniorCitizen: false,
      medicalExpenditure: "",
    },
  });

   useEffect(() => {
  
        const fetchData = async () => {
          const token = localStorage.getItem('token');
          if(!token){
              return ;
          }
          try {
            
            const response = await fetchMedical80D(token);
            if(response){

                setFormData(response);
            }
          } catch (error) {
            console.error('Error fetching personal details:', error);
          }
        };
    
        if (isUserLoggedIn) {
         fetchData();
        }
      }, [isUserLoggedIn]);
  const saveData = debounce(async(data) => {
    const token = localStorage.getItem("token")
    try {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postMedical80D`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        
      } catch (error) {
        console.error("Error updating data:", error)
      }
  }, 500);


  type SectionKey = "selfAndFamily" | "parents";
  type FieldKey =
    | "hasInsurance"
    | "premium"
    | "healthCheckup"
    | "isSeniorCitizen"
    | "medicalExpenditure";
  const handleInputChange = (
    section: SectionKey,
    field: FieldKey,
    value: string | boolean
  ) => {
    const updatedData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    };
    setFormData(updatedData);
    saveData(updatedData);
  };

  return (
    <div>
      <h1>Medical 80D</h1>

      <h2>For Self & Family (spouse & children)</h2>
      <label>
        Do you have Medical Insurance for Self & Family?
        <select
          value={formData.selfAndFamily.hasInsurance}
          onChange={(e) => handleInputChange("selfAndFamily", "hasInsurance", e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>

      {formData.selfAndFamily.hasInsurance === "yes" && (
        <div>
          <label>
            Medical Insurance Premium:
            <input
              type="number"
              value={formData.selfAndFamily.premium}
              onChange={(e) => handleInputChange("selfAndFamily", "premium", e.target.value)}
            />
          </label>

          <label>
            Preventive Health Check-up:
            <input
              type="number"
              value={formData.selfAndFamily.healthCheckup}
              onChange={(e) => handleInputChange("selfAndFamily", "healthCheckup", e.target.value)}
            />
          </label>

          <label>
            Are you or your family member a senior citizen?
            <input
              type="checkbox"
              checked={formData.selfAndFamily.isSeniorCitizen}
              onChange={(e) =>
                handleInputChange("selfAndFamily", "isSeniorCitizen", e.target.checked)
              }
            />
          </label>

          {formData.selfAndFamily.isSeniorCitizen && (
            <label>
              Medical Expenditure:
              <input
                type="number"
                value={formData.selfAndFamily.medicalExpenditure}
                onChange={(e) =>
                  handleInputChange("selfAndFamily", "medicalExpenditure", e.target.value)
                }
              />
            </label>
          )}
        </div>
      )}

      <h2>For Parents</h2>
      <label>
        Do you have Medical Insurance for Parents?
        <select
          value={formData.parents.hasInsurance}
          onChange={(e) => handleInputChange("parents", "hasInsurance", e.target.value)}
        >
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
      </label>

      {formData.parents.hasInsurance === "yes" && (
        <div>
          <label>
            Medical Insurance Premium:
            <input
              type="number"
              value={formData.parents.premium}
              onChange={(e) => handleInputChange("parents", "premium", e.target.value)}
            />
          </label>

          <label>
            Preventive Health Check-up:
            <input
              type="number"
              value={formData.parents.healthCheckup}
              onChange={(e) => handleInputChange("parents", "healthCheckup", e.target.value)}
            />
          </label>

          <label>
            Are your parents senior citizens?
            <input
              type="checkbox"
              checked={formData.parents.isSeniorCitizen}
              onChange={(e) =>
                handleInputChange("parents", "isSeniorCitizen", e.target.checked)
              }
            />
          </label>

          {formData.parents.isSeniorCitizen && (
            <label>
              Medical Expenditure:
              <input
                type="number"
                value={formData.parents.medicalExpenditure}
                onChange={(e) =>
                  handleInputChange("parents", "medicalExpenditure", e.target.value)
                }
              />
            </label>
          )}
        </div>
      )}
    </div>
  );
};

export default Medical80D;
