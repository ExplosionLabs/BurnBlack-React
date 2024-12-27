import { useTaxData } from '@/api/taxCaluatorhook';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react';
import React, { useState } from 'react';

const TaxPayableComponent = () => {
  const { 
    grossIncome, 
    taxableIncome, 
    taxLiability, 
    taxPaid, 
    taxDue, 
    incomeTaxAtNormalRates, 
    healthAndEducationCess, 
    totalTaxI 
  } = useTaxData() || {}; // Fallback to an empty object if useTaxData returns undefined

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
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
            <h1 className="text-xl font-semibold text-gray-900">Tax Payable</h1>
          </div>
          <button className="text-blue-500 hover:text-blue-600">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="text-indigo-600 font-medium">Total Tax</span>
          <div className="flex items-center gap-4">
            <span className="text-gray-900">₹{totalTaxI ?? 0}</span> {/* Default to 0 */}
            {isExpanded ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </button>

        {isExpanded && (
          <>
            {incomeTaxAtNormalRates && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Income Tax at normal rates</span>
                <span className="text-gray-900">₹{incomeTaxAtNormalRates}</span>
              </div>
            )}

            {healthAndEducationCess && (
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Health and Education Cess</span>
                <span className="text-gray-900">₹{healthAndEducationCess}</span>
              </div>
            )}
          </>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between py-2"
        >
          <span className="text-indigo-600 font-medium">
            Total Taxable Income (Gross Total Income - Total Deductions)
          </span>
          <div className="flex items-center gap-4">
            <span className="text-gray-900">{taxableIncome ?? 0}</span> {/* Default to 0 */}
          </div>
        </button>
      </div>
    </div>
  );
};

export default TaxPayableComponent;
