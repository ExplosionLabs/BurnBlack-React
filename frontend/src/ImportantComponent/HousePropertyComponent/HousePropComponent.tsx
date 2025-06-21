import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Home } from "lucide-react";
const HousePropComponent: React.FC = () => {
 

  return (
    <>
 


    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Home className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="font-medium text-gray-900 text-base">  House Properties owned by you</h3>
            <p className="text-sm text-gray-500 mt-1 ">
            Add details if you earned rent from your property or paid interest on home loan
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Link
           to="/fileITR/incomeSources/income-house-property"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
          >
            Add Details
          </Link>
        </div>
      </div>

   
    </div>
    </>
  );
};

export default HousePropComponent;
