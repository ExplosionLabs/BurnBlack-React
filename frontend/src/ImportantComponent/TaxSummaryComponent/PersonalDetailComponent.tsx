import { RootState } from '@/stores/store';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { CircleUserRound, Pencil } from 'lucide-react';
import { useTaxData } from '@/api/taxCaluatorhook';

const PersonalDetailComponent = () => {
  const [personalDetails, setPersonalDetails] = useState<any>({});
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
const [panNumber,setPanNumber]=useState("");
const {itrType}=useTaxData() || {};
const currentYear = new Date().getFullYear();
const sessionYear = `${currentYear}-${currentYear + 1}`;

  useEffect(() => {

    const fetchContactDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/personal/contact-details`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setPanNumber(data.panNumber);
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };
    const fetchPersonalDetails = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/personal/personal-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setPersonalDetails(response.data);
      } catch (error) {
        console.error('Error fetching personal details:', error);
      }
    };

    if (isUserLoggedIn) {
      fetchPersonalDetails();
      fetchContactDetail();
    }
  }, [isUserLoggedIn]);

  return (
    <>
 

      <div className="">
      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-md">
            <CircleUserRound className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Personal Information</h1>
          </div>
          <button className="text-blue-500 hover:text-blue-600">
            <Pencil className="w-5 h-5" />
          </button>
        </div>

        {/* Other Income Section */}
        <div className="border-t border-gray-100">
          <button
           
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Name</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">{personalDetails.firstName} {personalDetails.middleName} {personalDetails.lastName}</span>
             
            </div>
          </button>
        </div>

        {/* Capital Gain Section */}
        <div className="border-t border-gray-100">
          <button
           
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Date of Birth</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">{personalDetails.dob
          ? format(new Date(personalDetails.dob), 'dd/MM/yyyy')
          : 'N/A'}</span>
            
            </div>
          </button>

         
        </div>
        <div className="border-t border-gray-100">
          <button
           
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">PAN</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">{panNumber}</span>
            
            </div>
          </button>

         
        </div>
        <div className="border-t border-gray-100">
          <button
           
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Assessment Year</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">{sessionYear}</span>
            
            </div>
          </button>

         
        </div>
        <div className="border-t border-gray-100">
          <button
           
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">ITR Type</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">{itrType?itrType:null}</span>
            
            </div>
          </button>

         
        </div>
        <div className="border-t border-gray-100">
          <button
           
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Residential Status</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">Resident</span>
            
            </div>
          </button>

         
        </div>

        {/* Gross Total Income */}
      
      </div>
    </div>
    </>
  );
};

export default PersonalDetailComponent;
