import { fetchDisablilty, fetchMedical80D } from '@/api/taxSaving';
import { RootState } from '@/stores/store';
import axios from 'axios';
import { debounce } from 'lodash';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

type DisabilityDetails = {
    disabilityNature: string;
    dependentType: string;
    panOfDependent: string;
    aadhaarOfDependent: string;
    form10IA: {
      filingDate: string;
      ackNumber: string;
      udidNumber: string;
    };
  };
  
  type FormDataType = {
    disabilityDetails: DisabilityDetails;
  };
  
const Disablitiy = () => {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const [formData, setFormData] = useState<FormDataType>({

        disabilityDetails: {
          disabilityNature: "",
          dependentType: "",
          panOfDependent: "",
          aadhaarOfDependent: "",
          form10IA: {
            filingDate: "",
            ackNumber: "",
            udidNumber: "",
          },
        },
      });

      useEffect(() => {
  
        const fetchData = async () => {
          const token = localStorage.getItem('token');
          if(!token){
              return ;
          }
          try {
            
            const response = await fetchDisablilty(token);
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
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postDisablity`,
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

  const handleInputChange = <T extends keyof DisabilityDetails>(
    section: keyof FormDataType,
    field: T,
    value: string,
    nestedField?: keyof DisabilityDetails["form10IA"]
  ) => {
    const updatedData = { ...formData };
  
    if (
      section === "disabilityDetails" &&
      field === "form10IA" &&
      nestedField
    ) {
      // Explicitly cast the type of form10IA
      (updatedData[section][field] as DisabilityDetails["form10IA"])[
        nestedField
      ] = value;
    } else {
      updatedData[section][field] = value as any; // Safe for other fields
    }
  
    setFormData(updatedData);
    saveData(updatedData);
  };
  

  return (
    <div>Disablitiy
   <h2>Disability Details</h2>
      <label>
        Disability Nature:
        <select
          value={formData.disabilityDetails.disabilityNature}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "disabilityNature", e.target.value)
          }
        >
          <option value="">Select</option>
          <option value="40%Disablility">40 % Disability</option>
          <option value="SevereDisability">Severe Disability</option>
        </select>
      </label>

      <label>
        Dependent Type:
        <select
          value={formData.disabilityDetails.dependentType}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "dependentType", e.target.value)
          }
        >
          <option value="">Select</option>
          <option value="spouse">Spouse</option>
          <option value="daugher">Daughter</option>
          <option value="son">Daughter</option>
          <option value="brother">brother</option>
          <option value="Mother">Mother</option>
          <option value="Father">Father</option>
          <option value="parent">Parent</option>
        </select>
      </label>

      <label>
        PAN of Dependent:
        <input
          type="text"
          value={formData.disabilityDetails.panOfDependent}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "panOfDependent", e.target.value)
          }
        />
      </label>

      <label>
        Aadhaar of Dependent:
        <input
          type="text"
          value={formData.disabilityDetails.aadhaarOfDependent}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "aadhaarOfDependent", e.target.value)
          }
        />
      </label>

      <h3>Form 10IA Details</h3>
      <label>
        Form 10IA Filing Date:
        <input
          type="date"
          value={formData.disabilityDetails.form10IA.filingDate}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "form10IA", e.target.value, "filingDate")
          }
        />
      </label>

      <label>
        Form 10IA Ack. No.:
        <input
          type="text"
          value={formData.disabilityDetails.form10IA.ackNumber}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "form10IA", e.target.value, "ackNumber")
          }
        />
      </label>

      <label>
        UDID No. (if available):
        <input
          type="text"
          value={formData.disabilityDetails.form10IA.udidNumber}
          onChange={(e) =>
            handleInputChange("disabilityDetails", "form10IA", e.target.value, "udidNumber")
          }
        />
      </label>

    </div>
  )
}

export default Disablitiy