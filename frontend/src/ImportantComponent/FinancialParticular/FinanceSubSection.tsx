import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import _ from "lodash";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
const FinanceSubSection: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    unsettledPayables: "",
    outstandingPrincipalSecured: "",
    outstandingPrincipalUnsecured: "",
    advances: "",
    amountsReceivedInAdvance: "",
    capitalInvestment: "",
    otherLiabilities: "",
    uncollectedReceivables: "",
    totalInventoryValue: "",
    fixedAssets: "",
    closingBalanceWithBanks: "",
    loandAdvance:"",
    otherAssets: "",
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getFinanceParticularData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setFormData({
          ...formData,
          ...data,
        });
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchFinanceData();
    }
  }, [isUserLoggedIn]);

  const debouncedSaveData = useCallback(
    _.debounce(async (updatedData) => {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addFinanceParticularData`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Error saving finance data:", err);
      }
    }, 300), // 300ms debounce
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    debouncedSaveData(updatedFormData); // Debounced autosave
  };

  const InputField = ({ label, name, value, helperText }: { label: string; name: string; value: string; helperText?: string }) => (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      </div>
      <div className="relative rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">₹</span>
        </div>
        <input
          type="number"
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="0.00"
        />
      </div>
      {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
    </div>
  )

  return (
    <>
      <div className=" flex items-center gap-4">
        <Link to="/fileITR/incomeSources/income-professional-freelancing-business" className="rounded-full p-2 hover:bg-gray-100">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-semibold text-gray-900">Add Financial Particulars</h1>
      </div>

    <div className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-md shadow">
        <div className="px-6 py-5 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">Please add the financial particulars of your Business(es) and Profession(s)</h1>
          <div className="mt-4 space-y-2">
            <p className="text-sm text-gray-600">1. Exclude personal assets and liabilities.</p>
            <p className="text-sm text-gray-600">2. Include only business or profession-related assets and liabilities.</p>
            <p className="text-sm text-gray-600">3. If your business has no inventory, payables, or receivables, you can declare them as 0.</p>
            <p className="text-sm text-gray-600">4. If you have multiple businesses, you can combine assets and liabilities of all of them.</p>
          </div>
        </div>

        <form className="px-6 py-5">
          <div className="space-y-8">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add details of Liabilities</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField
                  label="Unsettled Payables"
                  name="unsettledPayables"
                  value={formData.unsettledPayables}
                  helperText="Amount yet to be paid to suppliers or vendors"
                />
                <InputField
                  label="Outstanding Principal - Secured Loans"
                  name="outstandingPrincipalSecured"
                  value={formData.outstandingPrincipalSecured}
                  helperText="Loans backed by collateral or assets"
                />
                <InputField
                  label="Outstanding Principal - Unsecured Loans"
                  name="outstandingPrincipalUnsecured"
                  value={formData.outstandingPrincipalUnsecured}
                />
                <InputField
                  label="Advances"
                  name="advances"
                  value={formData.advances}
                  helperText="Amounts received in advance"
                />
                <InputField
                  label="Capital Investment"
                  name="capitalInvestment"
                  value={formData.capitalInvestment}
                  helperText="Capital provided by business partners"
                />
                <InputField
                  label="Other Liabilities"
                  name="otherLiabilities"
                  value={formData.otherLiabilities}
                />
              </div>
            </div>

            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-6">Add details of Assets</h2>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <InputField
                  label="Uncollected Receivables"
                  name="uncollectedReceivables"
                  value={formData.uncollectedReceivables}
                  helperText="Amounts yet to be collected from customers/clients"
                />
                <InputField
                  label="Total Inventory Value"
                  name="totalInventoryValue"
                  value={formData.totalInventoryValue}
                  helperText="Total worth of goods held for sale"
                />
                <InputField
                  label="Fixed Assets"
                  name="fixedAssets"
                  value={formData.fixedAssets}
                />
                <InputField
                  label="Closing Balance With Banks"
                  name="closingBalanceWithBanks"
                  value={formData.closingBalanceWithBanks}
                  helperText="Amount held in bank accounts"
                />
                <InputField
                  label="Loans And Advances"
                  name="loandAdvance"
                  value={formData.loandAdvance}
                />
                <InputField
                  label="Other Assets"
                  name="otherAssets"
                  value={formData.otherAssets}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}

export default FinanceSubSection;
