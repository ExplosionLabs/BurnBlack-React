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
        const [showForm, setShowForm] = useState(false);
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
    <div className=" p-6 space-y-8">
   <div
        className="flex items-center justify-between gap-3 cursor-pointer"
        onClick={() => setShowForm(!showForm)} // Toggle the form visibility
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Medical Insurance, Health Check-ups, Disabilities etc.</h2>
            <p className="text-sm text-gray-500">
            Deductions related to 80D - Insurance, Disabilities, Health Checkups, etc.
            </p>
          </div>
        </div>
        <div>
          <svg
            className={`w-5 h-5 transform transition-transform ${
              showForm ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>

{showForm && (
    <div className="space-y-6">
      {/* 80D Section */}
      <section className="">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">
              80D - Medical Insurance and Preventive Health Checkup
            </h2>
            <p className="text-sm text-gray-500">
              Applicable for you (self), family (spouse & children) and parents.
            </p>
          </div>
          <button
            onClick={() => setIs80DModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Details
          </button>
        </div>
      </section>

      {/* Disabled Dependent Section */}
      <section className="">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h2 className="text-lg font-medium">
              Deduction for Disabled Dependent (Spouse/Children/Parents)
            </h2>
            <p className="text-sm text-gray-500">
              80DD - For a dependent, who is differently-abled & is wholly dependent on you
            </p>
          </div>
          <button
            onClick={() => setIsDisabliltyModelOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Add Details
          </button>
        </div>
      </section>

      {/* Self Disability Section */}
      <section className="py-6 bg-white shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-medium">Deduction for Self Disability</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Yes</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.selfDisability.hasDisability === 'yes'}
                onChange={(e) =>
                  handleFormChange(
                    {
                      target: {
                        value: e.target.checked ? 'yes' : 'no',
                      },
                    } as React.ChangeEvent<HTMLInputElement>,
                    'selfDisability',
                    'hasDisability'
                  )
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
            </label>
          </div>
        </div>

        {formData.selfDisability.hasDisability === 'yes' && (
          <div className="space-y-6">
            <div className="grid gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Disability Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="disabilityType"
                      value="40%"
                      checked={formData.selfDisability.disabilityType === '40%'}
                      onChange={(e) => handleFormChange(e, 'selfDisability', 'disabilityType')}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">40% or more disability</span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="disabilityType"
                      value="80%"
                      checked={formData.selfDisability.disabilityType === '80%'}
                      onChange={(e) => handleFormChange(e, 'selfDisability', 'disabilityType')}
                      className="text-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-600">80% or more disability</span>
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Form 10IA details</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Form 10IA Filing Date</label>
                    <input
                      type="date"
                      value={formData.selfDisability.form10IA.fillingDate}
                      onChange={(e) => handleFormChange(e, 'selfDisability', 'form10IA.fillingDate')}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">ACK No</label>
                    <input
                      type="text"
                      value={formData.selfDisability.form10IA.ackNo}
                      onChange={(e) => handleFormChange(e, 'selfDisability', 'form10IA.ackNo')}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">UDID No.</label>
                    <input
                      type="text"
                      value={formData.selfDisability.form10IA.uuidNo}
                      onChange={(e) => handleFormChange(e, 'selfDisability', 'form10IA.uuidNo')}
                      className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Specified Diseases Section */}
      <section className="py-6 bg-white shadow-sm space-y-6">
        <h2 className="text-lg font-medium">Deductions for treatment of specified diseases</h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Age of person for whom deduction is being claimed
            </label>
            <select
              value={formData.specificDisease.age}
              onChange={(e) => handleFormChange(e, 'specificDisease', 'age')}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Age Group</option>
              <option value="Below 60 year">Below 60 years</option>
              <option value="60-79">60-79 years</option>
              <option value="above80">80 years or above</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Medical treatment costs</label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                type="number"
                value={formData.specificDisease.costOfTreatment}
                onChange={(e) => handleFormChange(e, 'specificDisease', 'costOfTreatment')}
                className="w-full pl-8 pr-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      </section>
    </div>)}
  </div>
  )
}

export default MedicalInsu