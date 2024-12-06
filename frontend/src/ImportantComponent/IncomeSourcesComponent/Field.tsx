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

const providentFundOptions = [
  "Interest on EPF Balance- 1st Proviso to sec 10(11)",
  "Interest on EPF Balance- 2nd Proviso to sec 10(11)",
  "Interest on RPF Balance- 1st Proviso to sec 10(12)",
  "Interest on RPF Balance- 2nd Proviso to sec 10(12)",
]

export default function Fields({ type, data, onUpdate }: FieldsProps) {
  const getDefaultItem = () => {
    const newItem: any = { amount: 0 }
    if (type === "Savings Bank" || type === "P2P Investments" || type === "Bond Investments") {
      newItem.name = ""
    } else if (type === "Fixed Deposits" || type === "Other Interest Income") {
      newItem.description = ""
    } else if (type === "Provident Fund") {
      newItem.fieldType = providentFundOptions[0]
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
    const token = localStorage.getItem("token")
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/interest-income`,
        {
          type,
          data: newData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log("Data saved successfully:", response.data)
    } catch (error) {
      console.error("Error saving data:", error.response ? error.response.data : error.message)
    }
  }, 500)

  return (
    <div className="p-4 space-y-4">
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-4">
          {type === "Savings Bank" || type === "P2P Investments" || type === "Bond Investments" ? (
            <input
              type="text"
              placeholder="Enter Name of Platform"
              value={item.name || ""}
              onChange={(e) => updateItem(index, "name", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : type === "Fixed Deposits" || type === "Other Interest Income" ? (
            <input
              type="text"
              placeholder="Enter Description"
              value={item.description || ""}
              onChange={(e) => updateItem(index, "description", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : type === "Provident Fund" ? (
            <select
              value={item.fieldType || ""}
              onChange={(e) => updateItem(index, "fieldType", e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {providentFundOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : null}
          
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

