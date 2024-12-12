import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { useState,useEffect } from 'react'
import { ArrowLeft, MessageCircle, Shield } from 'lucide-react'
import Sliderbar from "@/Layout/Sidebar";
import axios from "axios";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const [verificationMethod, setVerificationMethod] = useState<'it' | 'aadhaar'>('it')
  const [panNumber, setPanNumber] = useState('')
  const [dob, setDob] = useState('');

  const navigate=useNavigate();
  const updateDatabase = debounce(async (panNumber) => {
    const token = localStorage.getItem("token");
    const payload = { panNumber }; // Properly structure the payload
  
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateContactDetails`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data updated in database:", payload);
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  }, 3000);
  const updateDatabaseDob = debounce(async (dob) => {
    const token = localStorage.getItem("token");
    const payload = { dob }; // Properly structure the payload
  
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updatePersonalDetail`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data updated in database:", payload);
    } catch (error) {
      console.error("Error updating contact details:", error);
    }
  }, 3000);
  
  useEffect(() => {
    const fetchContactDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getContactDetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setPanNumber(data.panNumber        );
        
      } catch (error) {
        console.error("Error fetching personal details:", error);
      }
    };
    const fetchPersonalDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getPersonalDetail`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data;
        setDob(data.dob ? format(new Date(data.dob), "yyyy-MM-dd") : ""       );
        
      } catch (error) { 
        console.error("Error fetching personal details:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchContactDetail(); 
      fetchPersonalDetail();
    }
  }, [isUserLoggedIn]); 
 
  return (
    <>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">

     
     <div className="lg:col-span-2 ">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-800">
              Link your PAN to E-file{' '}
              <Link href="#" className="text-blue-600 text-base font-normal hover:underline">
                Learn More
              </Link>
            </h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            Step 1/3
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm border">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
              <span className="text-pink-600">📇</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Provide your PAN details</h2>
              <p className="text-gray-500">To register you with IT Department</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between gap-4">

            
            <div>
  <label htmlFor="pan" className="block text-sm font-medium text-gray-700 mb-1">
    PAN Card Number
  </label>
  <input
    type="text"
    id="pan"
    value={panNumber}
    onChange={(e) => {
      setPanNumber(e.target.value.toUpperCase());
      updateDatabase(e.target.value.toUpperCase());
    }}
    className="w-72 px-6 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
    maxLength={10}
  />
</div>

<div>
  <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
    Date of Birth
  </label>
  <input
    type="date"
    name="dob"
    value={dob}
    onChange={(e) => {
      setDob(e.target.value);
      updateDatabaseDob(e.target.value); // Use the correct debounced function
    }}
    className="w-72 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
  />
  <p className="mt-1 text-sm text-gray-500">Specify date in a format like DD/MM/YYYY</p>
</div>

            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Choose a method to verify OTP</h3>
              <p className="text-gray-500">OTP helps to verify your identity with the Income Tax Department.</p>

              <div className="flex gap-4 items-center">
                <label className="flex items-center gap-3 p-3  cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="verification"
                    checked={verificationMethod === 'it'}
                    onChange={() => setVerificationMethod('it')}
                    className="w-4 h-4 text-blue-600  focus:ring-blue-500"
                  />
                  <span className="text-gray-700">IT Department registered mobile number</span>
                </label>

                <label className="flex items-center gap-3 p-3  cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="verification"
                    checked={verificationMethod === 'aadhaar'}
                    onChange={() => setVerificationMethod('aadhaar')}
                    className="w-4 h-4 text-blue-600  focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Aadhaar registered mobile number</span>
                </label>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 p-4 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600" />
              <p className="text-sm text-blue-600">
                Cleartax is a Government authorized ERI license holder. Your data is 100% secure with Cleartax.
              </p>
            </div>

<div className="flex  gap-5">
  <button className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors" onClick={ ()=>
  navigate("/fileITR/uploadForm16")
  }>  
  Skip </button>
            <button  onClick={ ()=>
  navigate("/fileITR/uploadForm16")
  } className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors">
              Proceed
            </button>
</div>
          </div>
        </div>

       
      

       
      </div>
    </div>
    <div>
        <Sliderbar/>
        </div>
      </div>
    </>
  );
}

export default Main;
