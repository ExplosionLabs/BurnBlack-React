
import { useTaxData } from '@/api/taxCaluatorhook';
import { Pencil} from 'lucide-react';

const TaxSaving = () => {
 
const {totalDeduction}=useTaxData() || {};


  
  return (
    <>
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
            <h1 className="text-xl font-semibold text-gray-900">Tax Saving</h1>
          </div>
          <button className="text-blue-500 hover:text-blue-600">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        {/* <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Tax Deduction</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">₹{totalDeduction.toLocaleString()}</span>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
  </button>
  
        {isExpanded && (
          <>
      
        {totalSum > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Saving</span>
            <span className="text-gray-900">₹{totalSum}</span>
          </div>
        )}
  
        {totalDonation > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Donation</span>
            <span className="text-gray-900">₹{totalDonation}</span>
          </div>
        )}
  
        {medical80d > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Medical Expense</span>
            <span className="text-gray-900">₹{medical80d}</span>
          </div>
        )}
  
        {totalLoans > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Loans</span>
            <span className="text-gray-900">₹{totalLoans}</span>
          </div>
        )}
  
        {otherDeduction > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Other Deduction</span>
            <span className="text-gray-900">₹{otherDeduction}</span>
          </div>
        )}
                  </>
        )} */}
  <button
  
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Tax Deduction</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">₹{totalDeduction?totalDeduction.toLocaleString():0}</span>
     
    </div>
  </button>
      </div>
    </div>
  </>
  
  );
};

export default TaxSaving;
