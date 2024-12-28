import React, { useState, useEffect } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ArrowLeft, Coins, Info, Trash2 } from "lucide-react";

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

  const handleRemoveDetail = (index: number) => {
    setProfessionDetails(professionDetails.filter((_, i) => i !== index))
  }

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
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <Link to="/fileITR/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Regular Business & Professional Income (Books of Accounts maintained)</h1>
      </div>

      <div className="rounded-md border bg-white p-6 shadow-sm">
      <div className="mb-6">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-blue-600">
              <Info className="h-5 w-5" />
            </span>
            <h2 className="font-medium text-gray-900">Please provide details of your profession(s)</h2>
          </div>
          <p className="text-sm text-gray-500">
            You can first select the profession type and then specify the nature of profession
          </p>
        </div>
        {professionDetails.map((detail, index) => (
          <div key={index} className="mb-6 grid gap-4">
                <div className="grid gap-4 md:grid-cols-4">
                  <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" >Profession Type<span className="text-red-500">*</span></label>
            <select
              name="professionTypes"
              value={detail.professionTypes}
              onChange={(e) => handleDetailChange(index, e)}
               className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            </div>
            <div>

        
            <label className="mb-1.5 block text-sm font-medium text-gray-700">  Nature of Profession<span className="text-red-500">*</span></label>
            <select
              name="natureOfProfessions"
              value={detail.natureOfProfessions}
              onChange={(e) => handleDetailChange(index, e)}
               className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
            </div>
            <div>

        
            <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Name of Company<span className="text-red-500">*</span>
                </label>
            <input
              type="text"
              name="companyNames"
              value={detail.companyNames}
              onChange={(e) => handleDetailChange(index, e)}
               className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
                </div>

<div className="relative">


            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description (Optional)</label>
            <input
              type="text"
              name="descriptions"
              value={detail.descriptions}
              onChange={(e) => handleDetailChange(index, e)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
              {index > 0 && (
                  <button
                    onClick={() => handleRemoveDetail(index)}
                    className="absolute right-0 top-8 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
            </div>
           
        
            </div>
          </div>
        ))}

        <button type="button" onClick={handleAddDetail}>
          Add More Details
        </button>
      </div>
    </div>

    
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Coins className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 text-base">  P&L (Profit And Loss)</h3>
            <p className="text-sm text-gray-500 mt-1 ">
           
Details of income and expenses of your business/profession for the <br /> period - April 2023 to March 2024

            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <Link to="/fileITR/profit-and-loss-boa"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Add Details
          </Link>
        </div>
      </div>

      {/* Interest Details Section */}
      {/* <div className="mt-4 ml-10">
        {interestData.length > 0 ? (
          interestData.map((section) => {
            const totalAmount = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
            return (
              <div
                key={section._id}
                className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{section.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  <Link    to="/fileITR/incomeInterest" className="text-gray-700 hover:text-gray-900 font-medium">Edit</Link>

                </div>
              </div>
            );
          })
        ) : (
          <div>No interest income details available.</div>
        )}
      </div> */}
    </div>
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Coins className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 text-base">Balance Sheet</h3>
            <p className="text-sm text-gray-500 mt-1 ">

            Details of assets and liabilities of your business/profession as on 31st March, 2024

            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <Link to="/fileITR/balance-sheet-boa"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Add Details
          </Link>
        </div>
      </div>

      {/* Interest Details Section */}
      {/* <div className="mt-4 ml-10">
        {interestData.length > 0 ? (
          interestData.map((section) => {
            const totalAmount = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
            return (
              <div
                key={section._id}
                className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{section.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  <Link    to="/fileITR/incomeInterest" className="text-gray-700 hover:text-gray-900 font-medium">Edit</Link>

                </div>
              </div>
            );
          })
        ) : (
          <div>No interest income details available.</div>
        )}
      </div> */}
    </div>
   

    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Coins className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 text-base">Depreciation</h3>
            <p className="text-sm text-gray-500 mt-1 ">

          
Summary of depreciation on all assets under the Income-Tax Act.

            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
        <Link to="/fileITR/add-deprectation"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Add Details
          </Link>
        </div>
      </div>

      {/* Interest Details Section */}
      {/* <div className="mt-4 ml-10">
        {interestData.length > 0 ? (
          interestData.map((section) => {
            const totalAmount = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
            return (
              <div
                key={section._id}
                className="bg-gray-50 rounded-md p-4 flex items-center justify-between mb-2"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-gray-900">{section.type}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="font-medium text-gray-900">₹{totalAmount.toLocaleString()}</span>
                  <Link    to="/fileITR/incomeInterest" className="text-gray-700 hover:text-gray-900 font-medium">Edit</Link>

                </div>
              </div>
            );
          })
        ) : (
          <div>No interest income details available.</div>
        )}
      </div> */}
    </div>
 
    </>
  );
};

export default ProfBussinessSection;
