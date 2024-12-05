import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { BarChart, BarChart2 } from "lucide-react";
const CapitalGainMain: React.FC = () => {
 

  return (
    <>

    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="space-y-4">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart2 className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Gains from Stocks, Mutual Funds, FnO & Others

</h2>
          </div>
          <div className="flex items-center space-x-4">
           
            <Link
              to="/fileITR/capitalGain"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
            >
            Add Details
            </Link>
          </div>
        </div>

        {/* Description */}
        <div className="text-sm text-gray-600 mx-8 w-9/12" >
        Easy auto-processing of your Gains from selling of Stocks, Mutual Funds, US Stocks, Land, Bonds, RSUs, Jewellery and more.
        </div>

        {/* Salary Entry */}
        {/* <div className="mt-4 ml-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-medium text-gray-900">Tata Consultancy Services Ltd.</span>
            <ExclamationTriangleIcon className="w-5 h-5 text-orange-500" />
          </div>
          <div className="flex items-center space-x-4">
            <span className="font-medium text-gray-900">₹2,000</span>
            <button className="text-gray-700 hover:text-gray-900 font-medium">
              Edit
            </button>
            <button className="text-gray-700 hover:text-gray-900 font-medium">
              Remove
            </button>
          </div>
        </div> */}
      </div>
    </div>
    </>
  );
};

export default CapitalGainMain;
