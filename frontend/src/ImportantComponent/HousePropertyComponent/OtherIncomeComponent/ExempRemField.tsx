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
   "Betting",
    "Card Games",
    "Crossword Puzzle",
    "Gambling",
    "Other Game shows",
    "Races Including Horse-race",
    "Winning from Lottery",
    "Others"
    
  
]
const deductibleIncomeOption = [
   "Expenses/Deduction",
"Dividend Deduction"
  
]
const otherIncomeOption = [
   "Rental income from machinery, plants, buildings, etc., Gross",
    "Family Pension",
    "Dividend Income (Taxable) u/s 56(2)(i)",
    "Cash credits u/s 68",
    "Unexplained investments u/s 69",
    "Unexplained money etc. u/s 69A",
    "Undisclosed investments etc. u/s 69B",
    "Unexplained expenditure etc. u/s 69C",
    "Hundi transactions - Amount borrowed or repaid u/s 69D",
    "115A(1)(a)(i) -Dividends interest and income from units purchase in foreign currency",
    "115A(1)(a)(ii)- Interest received from govt/Indian Concerns received in Foreign Currency",
    "115A(1)(a)(iia) -Interest from Infrastructure Debt Fund",
    "115A(1) (a)(iiaa) -Interest as per Sec. 194LC",
    "115A(1)(a)(iiab) -Interest as per Sec. 194LD",
    "115A(1)(a)(iii) - Income received in respect of units of UTI purchased in Foreign Currency",
    "115A(1)(b)(A)- Income from royalty & technical services",
    "115A(1)(b)(B) Income from royalty & technical services",
    "115AC(1)(a & b) - Income from bonds or GDR purchased in foreign currency - non-resident",
    "115AD(1)(i) -Income received by an FII in respect of securities (other than units as per Sec 115AB)",
    "115BBA - Tax on non-residents sportsmen or sports associations",
    "115E(a) - Investment income",
    "115A(1)(a)(iiac) -Interest as per Sec. 194LBA",
    "GDR purchased in Foreign Currency - Resident",
    "115BBF - Tax on income from patent",
    "Others"
  
]

export default function ExempRemField({ type, data, onUpdate }: FieldsProps) {
  const getDefaultItem = () => {
    const newItem: any = { amount: 0 }
    if (type === "Invoice Discounting" ) {
        newItem.name = ""
      }
    else  if (type === "Lottery and Gift") {
      newItem.fieldType = exemptIncomeOption[0]
       newItem.description = ""
    }
    else  if (type === "Online Gaming") {
      newItem.description = ""
    }
    else  if (type === "Deductible Expenses") {
        newItem.fieldType = deductibleIncomeOption[0]
    }
    else  if (type === "Income from Other Sources") {
        newItem.fieldType = otherIncomeOption
         newItem.description = ""
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
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addexemprem-income`,
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
          { 
          type === "Lottery and Gift" ? (
            <>
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
              <input
              type="text"
              placeholder="Enter Description"
              value={item.description || ""}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            </>
          ) :
          type === "Income from Other Sources" ? (
            <>
         
            <select
              value={item.fieldType || ""}
              onChange={(e) => updateItem(index, "fieldType", e.target.value)}
              className="w-20 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {otherIncomeOption.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Enter Description"
              value={item.description || ""}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            /></>
          ) :
          type === "Deductible Expenses" ? (
            <select
              value={item.fieldType || ""}
              onChange={(e) => updateItem(index, "fieldType", e.target.value)}
              className="w-20 flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {deductibleIncomeOption.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) :
          type==="Income from Other Sources" || type==="Online Gaming" ? (
          <input
          type="text"
          placeholder="Enter Description"
          value={item.description || ""}
          onChange={(e) => updateItem(index, "description", e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
          ) :
          type === "Invoice Discounting" ? (
          <input
          type="text"
          placeholder="Enter Name of platform"
          value={item.name || ""}
          onChange={(e) => updateItem(index, "name", e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
          ) :
          
          null}
          
         
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

