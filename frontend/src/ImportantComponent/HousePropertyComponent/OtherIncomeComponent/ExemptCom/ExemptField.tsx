'use client'

import React, { useState } from "react"
import axios from "axios"
import debounce from "lodash.debounce"
import { PlusIcon, TrashIcon } from 'lucide-react'

interface FieldsProps {
  type: string
  data: any[]
  onUpdate: (newData: any[]) => void
}

const exemptIncomeOption = [
  "Sec 10(10BC)-Any amount from the Central/State Govt./local authority by way of compensation on account of any disaster",
"Sec 10(10D)- Any sum received under a life insurance policy except mentioned in sub-clause(a) to(d)",
"Sec 10(11)-Statuory Provident Fund received",
"Sec 10(12)-Recognised Provident Fund received",
"Sec 10(12C)-Any payment from Agniveer Corpus Fund to a person enrolled under the Agnipath Scheme or to his nominee",
"Sec 10(13)-Approved superannuation fund received",
"Sec 10(16)-Scholarships granted to meet the cost of education",
"Sec 10(17)-Allownace MP/MLA/MLC",
"Sec 10(17A)-Award instituted by Government",
"Sec 10(18)-Pension received by winner of \"Param Vir Chakra\" or \"Maha Vir Chakra\" or \"Vir Chakra\" or such other gallantry award",
"Defense medical disability pension",
"Sec 10(19)-Armed Forces Family pension in case of death during operational duty",
"Sec 10(26)-Any income as referred to in section 10(26)",
"Sec 10(26AAA)-Any income as referred to in section 10(26AAA)",
"Any Other",
  
]

export default function ExemptField({ type, data, onUpdate }: FieldsProps) {
  const getDefaultItem = () => {
    const newItem: any = { amount: 0,description:"" }
     if (type === "Other Exempt Income") {
      newItem.fieldType = exemptIncomeOption[0]
    }
    return newItem
  }

  const [items, setItems] = useState<any[]>(data.length > 0 ? data : [getDefaultItem()])

  const addItem = () => {
    const newItem = getDefaultItem()
    setItems([...items, newItem])
  }

  const deleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index)
    setItems(updatedItems)
    debouncedSave(updatedItems)
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const updatedItems = [...items]
    updatedItems[index] = { ...updatedItems[index], [field]: value }
    setItems(updatedItems)
    debouncedSave(updatedItems)
  }

  const debouncedSave = debounce(async (newData: any[]) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addexcempt-income`,
        {
          type,
          data: newData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Data saved successfully:", response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // For Axios errors, access `response` safely
        console.error("Error saving data:", error.response?.data || error.message);
      } else if (error instanceof Error) {
        // For other errors, access `message`
        console.error("Error saving data:", error.message);
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  }, 500);
  

  return (
    <div className="p-4 space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          { type === "Other Exempt Income" ? (
            <select
              value={item.fieldType || ""}
              onChange={(e) => updateItem(index, "fieldType", e.target.value)}
              className="w-20 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {exemptIncomeOption.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : null}
          
          <input
              type="text"
              placeholder="Enter Description"
              value={item.description || ""}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          <input
            type="number"
            placeholder="Enter Amount"
            value={item.amount || 0}
            onChange={(e) => updateItem(index, "amount", parseFloat(e.target.value))}
            className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          
          <button
            onClick={() => deleteItem(index)}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md"
          >
            <TrashIcon className="w-5 h-5" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      ))}

      <button
        onClick={addItem}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
      >
        <PlusIcon className="w-4 h-4" />
        Add More Items
      </button>
    </div>
  )
}

