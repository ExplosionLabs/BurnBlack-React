import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Sliderbar from "@/Layout/Sidebar";
import { ArrowLeft, Home } from "lucide-react";
const HousePropMain: React.FC = () => {
 

  return (
    <>
    
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
<div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
<div className="flex items-center space-x-6">
          <Link to="/fileITR/incomeSources" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">House Properties owned by you</h1>
            <p className="text-gray-600 mt-1">
              Add details if you earned rent from your property or paid interest on home loan
            </p>
          </div>
        </div>

    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-4">
      <Home className="w-6 h-6 text-blue-600 mt-1" />
      <div>
        <h3 className="font-medium text-gray-900 text-base">
        Self Occupied Properties (not given on rent)
        </h3>
        <p className="text-sm text-gray-500">
          Add details of the properties you own that are rented out to <br />tenants, including rental income information.
        </p>
      </div>
    </div>
    <Link
      to="/fileITR/self-occupied-property"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
    >
      Add Details
    </Link>
  </div>
</div>
    <div className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden p-6">
  <div className="flex items-center justify-between">
    <div className="flex items-start gap-4">
      <Home className="w-6 h-6 text-blue-600 mt-1" />
      <div>
        <h3 className="font-medium text-gray-900 text-base">
          Properties you have given on rent
        </h3>
        <p className="text-sm text-gray-500">
          Add details of the properties you own that are rented out to <br />tenants, including rental income information.
        </p>
      </div>
    </div>
    <Link
      to="/fileITR/rental-property"
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-medium"
    >
      Add Details
    </Link>
  </div>
</div>
</div>
<div className="lg:col-span-1">
        <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>
</div>
    </>
  );
};

export default HousePropMain;
