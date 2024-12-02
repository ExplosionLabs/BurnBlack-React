import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { ArrowRight, CheckCircle, MessageCircle, PlayCircle, Shield,CircleDashed } from 'lucide-react'
import Sliderbar from "@/Layout/Sidebar";
import { useState,useEffect } from "react";
import axios from "axios";
function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const selectUserName = (state: RootState) => state.user.user?.name;
    const userName = useSelector(selectUserName);
    const [panDetail,setPanDetails]=useState("");
    const [sessionYear, setSessionYear] = useState("");

    useEffect(() => {
      // Calculate the session year
      const calculateSessionYear = () => {
        const currentYear = new Date().getFullYear();
        const nextYear = currentYear + 1;
        setSessionYear(`AY ${currentYear} - ${nextYear}`);
      };
  
      calculateSessionYear();
  
      const fetchContactDetail = async () => {
        const token = localStorage.getItem("token");
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getContactDetails`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = response.data;
          setPanDetails(data.panNumber);
        } catch (error) {
          console.error("Error fetching personal details:", error);
        }
      };
  
      if (isUserLoggedIn) {
        fetchContactDetail(); // Fetch details if the user is logged in
      }
    }, [isUserLoggedIn]);
  
  return (
    <>

   <div className="min-h-screen mx-40 font-poppins">
      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">My Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 ">
          <div className="lg:col-span-2">
            <div className="flex flex-col">

            
            <div className="bg-white rounded-2xl shadow-sm p-6 border border-[#B7D5FE]">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                {panDetail&& (
  <div>
  <span className="font-medium">PAN:</span> {panDetail}
</div>
                ) }
              
                <div>
                  <span className="font-medium">Filing Status:</span> {sessionYear} (current)
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 mb-2 text-xl">Hi {userName}, it&apos;s a good day today to complete e-filing 😊</p>
                <h2 className="text-2xl font-semibold text-gray-900">Let&apos;s finish the last few steps quickly</h2>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        {/* <CheckCircle className="w-4 h-4 text-white" /> */}
                        <CircleDashed className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xl font-medium ">Link PAN & Pre-fill</span>
                    </div>
                    <div className="flex-1 mx-4 border-t border-dashed border-gray-300" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                        {/* <CheckCircle className="w-4 h-4 text-white" /> */}
                        <CircleDashed className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xl font-medium">Add your Details</span>
                    </div>
                    <div className="flex-1 mx-4 border-t border-dashed border-gray-300" />
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300" />
                      <span className="text-xl font-medium">File ITR</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-600">Know more about steps</span>
                  <ArrowRight className="w-4 h-4 text-blue-500" />
                </div>
              <div className="space-y-4">
                <button
                  className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out"
                >
                   <Link to="/fileITR/addPanCardDetail">
                  Complete E-Filing
                  </Link>
                </button>
               
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center gap-2">
                  <span className="text-gray-700">Want to file for friends or family?</span>
                  <button className="text-blue-500 font-medium flex items-center">
                    Start a New Filing <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
            <div>
            <div className="mt-8 flex  items-center gap-8 text-gray-600 text-sm">
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=32&width=32" alt="SSL Secure" className="w-8 h-8" />
           
          </div>
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=32&width=32" alt="Certified" className="w-8 h-8" />
            {/* <span>Govt. Certified</span> */}
          </div>
          <div className="flex items-center gap-2">
            <img src="/placeholder.svg?height=32&width=32" alt="Certified" className="w-8 h-8" />
            {/* <span>Govt. Certified</span> */}
          </div>
          <div className="flex items-center gap-8">
            <div className="flex  flex-col items-center">
              <span className="font-semibold">6M+</span>
              <span>Users</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">800 Cr+</span>
              <span>worth taxes filed</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            <span className="text-xs">Cleartax is a Govt. authorized ERI license holder. Your data is 100% secure with Cleartax.</span>
          </div>
        </div>
            </div>
            </div>
          </div>

         <Sliderbar/>
        </div>

       
      </main>
    </div>
    </>
  );
}

export default Main;
