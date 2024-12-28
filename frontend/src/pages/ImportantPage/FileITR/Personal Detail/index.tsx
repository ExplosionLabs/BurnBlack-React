import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";
import ContactDetail from "../../../../ImportantComponent/PersonalDetailComponent/ContactDetail";
import PersonalDetail from "../../../../ImportantComponent/PersonalDetailComponent/PersonalDetail";
import AddressSection from "../../../../ImportantComponent/PersonalDetailComponent/AddresDetail";
import BankDetails from "../../../../ImportantComponent/PersonalDetailComponent/BankDetail";
import Sliderbar from "@/Layout/Sidebar";
import PanLinkingSection from "@/ImportantComponent/PersonalDetailComponent/PanDetail";
import { ArrowLeft, BinaryIcon, Delete, DeleteIcon, MoveRightIcon, SaveIcon, Shield, Trash, Trash2, Trash2Icon, UploadCloud, VerifiedIcon } from "lucide-react";

function Main() {
    const navigate = useNavigate();
    const selectUserData = (state: RootState) => state.user.user;

    const userData=useSelector(selectUserData);
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
    <div className="lg:col-span-2">
      
      <div className="mx-auto p-6 lg:p-8">
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            className="flex bg-gray-200 p-1 hover:bg-gray-300 border border-gray-300 rounded-full items-center gap-2 text-gray-600 pr-3"
            onClick={() => navigate("/fileITR/uploadForm16")}
          >
            <ArrowLeft className="pl-2 w-5 h-5 text-gray-600" /> Back
          </button>
          <button
            className="flex  p-1 bg-gradient-to-r from-green-700 to-green-500  rounded-full items-center gap-2 text-white pr-3 font-medium"
            
          >
            <VerifiedIcon className="pl-2 w-5 h-5 " /> Certified Confidently by BurnBlack
          </button>

        <div className="ml-auto flex">
              <p className="flex text-gray-400 text-sm font-medium bg-white border rounded-md py-2 px-6 hover:bg-red-500 hover:text-white mr-2">
              <Trash2Icon className=" pr-2 w-5 h-5 " />
                Cancel File 
                
              </p>
                

                <p className="flex text-dark text-sm hover:bg-orange-500 hover:text-white font-medium bg-white border rounded-md py-2 px-6 mr-2">
                <SaveIcon className=" pr-2 w-5 h-5 " />
                  Save File
                  
                </p>

                <p className="flex text-white text-sm hover:bg-blue-900 font-medium bg-dark border rounded-md py-2 px-6 ">
              
                  Next 
                  <MoveRightIcon className="pl-2 w-5 h-5 text-white" />
                </p>

        </div>
          

        </div>

        
        <div className="bg-gradient-to-r from-indigo-700 to-blue-900 p-4 rounded-md shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <h3 className="text-xs font-medium text-gray-200">Filing Name:</h3>
              <p className="text-sm font-semibold text-white">{userData?.name} (AY 2024-25)</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">Email:</h3>
              <p className="text-sm font-semibold text-white">{userData?.email}</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">Phone:</h3>
              <p className="text-sm font-semibold text-white">+91489615668</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">Tax Regime:</h3>
              <p className="text-sm font-semibold text-white">New (2018)</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">City:</h3>
              <p className="text-sm font-semibold text-white">New Delhi</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">PAN:</h3>
              <p className="text-sm font-semibold text-white">CFUS241SV</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">Total Taxable Income</h3>
              <p className="text-sm font-semibold text-white">₹0/-</p>
            </div>
            <div>
              <h3 className="text-xs font-medium text-gray-200">Total Tax Rebate</h3>
              <p className="text-sm font-semibold text-white">₹9823</p>
            </div>
          </div>
        </div>

<div className="bg-white px-4 py-px rounded-md shadow-sm mb-8">
  <SectionNavigation />
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
    <div className="row-span-1">
      <PersonalDetail />
      <div className="my-2"></div>
      <AddressSection />
    </div>
    <div className="row-span-1">
      <ContactDetail />
      <div className="my-2"></div>
      <BankDetails />
    </div>
    
  </div>
</div>
        
      </div>
      

     
   
    </div>
  );
}

export default Main;
