import Modal from '@/ImportantComponent/CaptialGainComponent/StocksFund/Modal';
import React, { useEffect, useState } from 'react'
import Medical80D from './Medical80D';
import Disablitiy from './Disablitiy';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import { fetchDisablilty, fetchSpecificDisablilty } from '@/api/taxSaving';
import { debounce } from 'lodash';
import axios from 'axios';
import { updateData } from '@/components/Base/Ckeditor/ckeditor';

interface FormData {
    selfDisability: {
      hasDisability: string;
      disabilityType: string;
      form10IA: {
        fillingDate: string;
        ackNo: string;
        uuidNo: string;
      };
    };
    specificDisease: {
      age: string;
      costOfTreatment: number;
    };
  }
const MedicalInsu = () => {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
      const [is80GModalOpen, setIs80DModalOpen] = useState(false);
      const [isDisablitiyModalOpen, setIsDisabliltyModelOpen] = useState(false);
        const [formData, setFormData] = useState({
            selfDisability: {
                hasDisability:"",
                disabilityType:"",
                form10IA: {
                  fillingDate:"",
                  ackNo: "",
                  uuidNo: "",
                },
              },
              specificDisease: {
                age: "",
                costOfTreatment: 0,
            }
        });

        
        
   useEffect(() => {
  
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if(!token){
          return ;
      }
      try {
        
        const response = await fetchSpecificDisablilty(token);
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
      `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postSpecificDisablity`,
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
const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    field: keyof FormData, // 'selfDisability' | 'specificDisease'
    subField?: string // optional subfield for nested structures
  ) => {
    const value = e.target.value;
  
    setFormData((prevData) => {
      const updatedData = subField
        ? {
            ...prevData,
            [field]: {
              ...prevData[field],
              [subField]: value, // Update the nested field
            },
          }
        : {
            ...prevData,
            [field]: value,
          };
  
      // For nested objects (like form10IA), ensure proper deep update
      if (field === "selfDisability" && subField && subField.includes("form10IA")) {
        updatedData.selfDisability.form10IA = {
          ...updatedData.selfDisability.form10IA,
          [subField]: value,
        };
      }
  
      saveData(updatedData); // Debounced saving
      return updatedData;
    });
  };
  



  return (
    <>
   
    <div>Medical Insurance, Health Check-ups, Disabilities etc.</div>
    <div>
        <div >

    80D - Medical Insurance and Preventive Health Checkup
        </div>
        <button    onClick={() => setIs80DModalOpen(true)}>
            Add Details
        </button>

    </div>
    <div onClick={() => setIsDisabliltyModelOpen(true)}>
    Deduction for Disabled Dependent (Spouse/Children/Parents)
    <button>
        Add Details
    </button>
    </div>
    
    <Modal isOpen={is80GModalOpen} onClose={() => setIs80DModalOpen(false)}>
<Medical80D/>
    </Modal>
    <Modal isOpen={isDisablitiyModalOpen} onClose={() => setIsDisabliltyModelOpen(false)}>
<Disablitiy/>
    </Modal>
            {/* Form for Disability Details */}
            <div>
                <label>Has Disability?</label>
                <select
                    value={formData.selfDisability.hasDisability}
                    onChange={(e) => handleFormChange(e, 'selfDisability', 'hasDisability')}
                >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                </select>

                {formData.selfDisability.hasDisability === 'yes' && (
    <>
        <div>
            <label>Disability Type</label>
            <select
                value={formData.selfDisability.disabilityType}
                onChange={(e) => handleFormChange(e, 'selfDisability', 'disabilityType')}
            >
                <option value="">Select</option>
                <option value="40%">40% More</option>
                <option value="80%">80% More</option>
            </select>
        </div>

        <div>
            <label>Form 10IA</label>
            <div>
                <label>Filling Date</label>
                <input
                    type="date"
                    value={formData.selfDisability.form10IA.fillingDate}
                    onChange={(e) => handleFormChange(e, 'selfDisability', 'form10IA.fillingDate')}
                />
            </div>
            <div>
    <label>ACK No</label>
    <input
        type="text"
        value={formData.selfDisability.form10IA.ackNo}
        onChange={(e) => handleFormChange(e, 'selfDisability', 'form10IA.ackNo')}
    />
</div>
<div>
    <label>UUID No</label>
    <input
        type="text"
        value={formData.selfDisability.form10IA.uuidNo}
        onChange={(e) => handleFormChange(e, 'selfDisability', 'form10IA.uuidNo')}
    />
</div>

        </div>
    </>
)}

            </div>

            {/* Form for Specific Disease Details */}
            <div>
                <label>Age</label>
                <select
                    value={formData.specificDisease.age}
                    onChange={(e) => handleFormChange(e, 'specificDisease', 'age')}
                >
                    <option value="">Select Age Group</option>
                    <option value="Below 60 year">Below 60 year</option>
                    <option value="60-79">60-79</option>
                    <option value="above80">80 year or above</option>
                </select>

                <div>
                    <label>Cost of Treatment</label>
                    <input
                        type="number"
                        value={formData.specificDisease.costOfTreatment}
                        onChange={(e) => handleFormChange(e, 'specificDisease', 'costOfTreatment')}
                    />
                </div>
            </div>

    </>
  )
}

export default MedicalInsu