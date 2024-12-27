import { fetchTaxPaid } from '@/api/calculateIncome';
import { Pencil } from 'lucide-react'
import React, { useEffect, useState } from 'react'

const TaxPaidComponent = () => {
    const [taxPaid,setTaxPaid]=useState("");
      useEffect(() => {
        const fetchGrossIncome = async () => {
          try {
            const token = localStorage.getItem('token');
            if (!token) {
              return;
            }
            const response = await fetchTaxPaid(token);
        
            if(response){
    setTaxPaid(response);
         
          }
          } catch (error) {
            console.error('Error fetching gross income:', error);
          }
        };
    
        fetchGrossIncome();
      }, []);
  return (
    <div className="mx-auto">
    <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-50 rounded-md">
            <svg
              className="w-5 h-5 text-red-500"
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
          <h1 className="text-xl font-semibold text-gray-900">Tax Paid</h1>
        </div>
        <button className="text-blue-500 hover:text-blue-600">
          <Pencil className="w-5 h-5" />
        </button>
      </div>
<button

  className="w-full flex items-center justify-between py-2"
>
  <span className="text-indigo-600 font-medium">TDS</span>
  <div className="flex items-center gap-4">
    <span className="text-gray-900">₹{taxPaid?taxPaid:0}</span>
   
  </div>
</button>
    </div>
  </div>
  )
}

export default TaxPaidComponent