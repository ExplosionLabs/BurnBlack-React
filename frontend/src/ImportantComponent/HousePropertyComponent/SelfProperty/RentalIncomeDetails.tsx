import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useEffect, useState } from "react";

const RentalIncomeDetails: React.FC<{
  data: any;
  onChange: (data: any) => void;
}> = ({ data, onChange }) => {
  const [isOpen, setIsOpen] = useState(true); // State to track visibility of content

  const handleChange = (field: string, value: any) => {
    console.log("field",field,"valu",value);
    onChange({ ...data, [field]: value });
  };

  useEffect(() => {
    // Calculate the standard deduction based on current values
    const standardDeduction = Math.max(0, 0.3 * (data.annualRent || 0) - (data.taxPaid || 0));
  
    // Update the standard deduction directly
    onChange({ ...data, standardDeduction });
  
    // Calculate the net income after updating the deduction
    const netIncome = Math.max(
      0,
      (data.annualRent || 0) - (data.taxPaid || 0) - standardDeduction
    );
  
    // Update the net income
    onChange({ ...data, standardDeduction, netIncome });
  
    console.log("Standard Deduction:", standardDeduction);
    console.log("Net Income:", netIncome);
  }, [data.annualRent, data.taxPaid]);
  
  

  // Toggle visibility of the form content
  const toggleContent = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="rounded-lg border bg-white p-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50">
            <svg
              className="h-6 w-6 text-red-500"
              fill="none"
              height="24"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6" />
              <path d="M16 13H8" />
              <path d="M16 17H8" />
              <path d="M10 9H8" />
            </svg>
          </div>
          <div className="flex flex-1 items-center justify-between">
            <h2 className="text-lg font-semibold">Rental Income and Property Tax Details</h2>
            {/* Toggle arrow based on state */}
            {isOpen ? (
              <ChevronUp className="h-5 w-5 text-gray-500" onClick={toggleContent} />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" onClick={toggleContent} />
            )}
          </div>
        </div>

        {/* Conditional rendering of the content */}
        {isOpen && (
          <div className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="annualRent" className="text-sm font-medium text-gray-900">
                A. Total Estimated Annual rent receivable
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="annualRent"
                  value={data.annualRent || ""}
                  onChange={(e) => handleChange("annualRent", Number(e.target.value))}
                  className="w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label htmlFor="taxPaid" className="text-sm font-medium text-gray-900">
                B. Municipal/Property Tax Paid
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="taxPaid"
                  value={data.taxPaid || ""}
                  onChange={(e) => handleChange("taxPaid", Number(e.target.value))}
                  className="w-full rounded-md border border-gray-200 py-2 pl-8 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <p className="text-sm text-gray-500">Specifying this reduces your tax liability</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="standardDeduction" className="text-sm font-medium text-gray-900">
                C. Standard Deduction u/s 24a(30% of (A - B))
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="standardDeduction"
                  value={data.standardDeduction || ""}
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm"
                  placeholder="0"
                  disabled
                />
              </div>
              <p className="text-sm text-gray-500">This field is auto-calculated</p>
            </div>

            <div className="space-y-1">
              <label htmlFor="netIncome" className="text-sm font-medium text-gray-900">
                Net Income (A - B - C)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="number"
                  id="netIncome"
                  value={data.netIncome || ""}
                  className="w-full rounded-md border border-gray-200 bg-gray-50 py-2 pl-8 pr-3 text-sm"
                  placeholder="0"
                  disabled
                />
              </div>
              <p className="text-sm text-gray-500">This field is auto-calculated</p>
            </div> 
          </div>
        )}
      </div>
    </>
  );
};

export default RentalIncomeDetails;
