import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Coins, Currency } from "lucide-react";

export const OtherIncome = () => {
  return (
      <>
    
   
   
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6">
         {/* Header Section */}
         <div className="flex items-center justify-between">
           <div className="flex items-center gap-4">
             <Coins className="w-6 h-6 text-blue-600" />
             <div>
               <h3 className="font-medium text-gray-900 text-base">Exempt, Online Gaming & Other Income</h3>
               <p className="text-sm text-gray-500 mt-1 ">
               Exempt Income, Invoice Discounting, Online Gaming, Puzzles, Lottery Winnings etc.


               </p>
             </div>
           </div>
           <div className="flex items-center space-x-4">
             <Link
                          to="/fileITR/other-income"
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
                   className="bg-gray-50 rounded-lg p-4 flex items-center justify-between mb-2"
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
  )
}
