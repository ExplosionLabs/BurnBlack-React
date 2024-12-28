import React, { useEffect, useState } from "react"
import { BuildingIcon as BuildingBankIcon, PlusCircleIcon, TrashIcon, InfoIcon, ChevronUpIcon } from 'lucide-react'
import axios from "axios"
import debounce from "lodash.debounce"

type BankDetail = {
  accountNo: string
  ifscCode: string
  bankName: string
  type: string
}

export default function BankDetails() {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([
    { accountNo: "", ifscCode: "", bankName: "", type: "" },
  ])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [isExpanded, setIsExpanded] = useState(true)

  // Fetch bank details from the backend
  useEffect(() => {
    const fetchBankDetails = async () => {
      const token = localStorage.getItem("token")
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getBankDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        setBankDetails(response.data.data.bankDetails || [])
        
      } catch (err) {
        setError("Failed to load bank details.")
        console.error(err)
        setLoading(false)
      }
    }

    fetchBankDetails()
  }, [])

  // Debounced function to save data to the database
  const autoSave = debounce(async (details: BankDetail[]) => {
    const token = localStorage.getItem("token")
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateBankDetails`,
        { bankDetails: details },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
   
    } catch (error) {
      console.error("Error saving bank details:", error)
    }
  }, 300)

  // Handle input change
  const handleChange = (index: number, field: keyof BankDetail, value: string) => {
    const updatedDetails = [...bankDetails]
    updatedDetails[index][field] = value
    setBankDetails(updatedDetails)
    autoSave(updatedDetails)
  }

  // Add a new account
  const addAccount = () => {
    setBankDetails([...bankDetails, { accountNo: "", ifscCode: "", bankName: "", type: "" }])
  }

  // Remove an account
  const removeAccount = (index: number) => {
    const updatedDetails = bankDetails.filter((_, i) => i !== index)
    setBankDetails(updatedDetails)
    autoSave(updatedDetails)
  }

 

  return (
    <div className="mx-auto bg-white border rounded-md overflow-hidden max-w-4xl">
      <div onClick={() => setIsExpanded(!isExpanded)} className="cursor-pointer p-2 border-b border-gray-200 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors duration-200">  
          <div className="flex items-center space-x-4">
            <BuildingBankIcon className="h-7 w-7 text-blue-500 ml-2" />
            <div>
              <h2 className="text-base font-semibold text-gray-800">Bank Details</h2>
              <p className="text-xs text-gray-600">
              Provide all the bank accounts. You will receive refund in any one of the accounts mentioned.
              </p>
            </div>
          </div>
          <button className="text-gray-500 hover:text-gray-700"   onClick={() => setIsExpanded(!isExpanded)}>
            {/* {? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />} */}
            <ChevronUpIcon className={`w-5 h-5 transition-transform ${isExpanded ? '' : 'rotate-180'}`} />
          </button>
        </div>

      {isExpanded && (
        <>
         
<div className="mx-auto p-6">
          <div className="mb-4">
            <a href="#" className="text-blue-600 hover:underline">
              How to find Bank account details
            </a>
          </div>

          {bankDetails.map((detail, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Account number</label>
                  <input
                    type="text"
                    value={detail.accountNo}
                    onChange={(e) => handleChange(index, "accountNo", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    IFSC code
                    <InfoIcon className="w-4 h-4 text-gray-400" />
                  </label>
                  <input
                    type="text"
                    value={detail.ifscCode}
                    onChange={(e) => handleChange(index, "ifscCode", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Bank name</label>
                  <input
                    type="text"
                    value={detail.bankName}
                    onChange={(e) => handleChange(index, "bankName", e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <div className="flex gap-2">
                    <select
                      value={detail.type}
                      onChange={(e) => handleChange(index, "type", e.target.value)}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Type</option>
                      <option value="CASH CREDIT">CASH CREDIT</option>
                      <option value="CURRENT">CURRENT</option>
                      <option value="SAVINGS">SAVINGS</option>
                      <option value="OVER DRAFT">OVER DRAFT</option>
                      <option value="NON RESIDENT">NON RESIDENT</option>
                      <option value="OTHER">OTHER</option>
                    </select>
                    {bankDetails.length > 1 && (
                      <button
                        onClick={() => removeAccount(index)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addAccount}
            className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-700"
          >
            <PlusCircleIcon className="w-5 h-5" />
            Add another account
          </button>
          </div>  
        </>
      )}
    </div>
  )
}

