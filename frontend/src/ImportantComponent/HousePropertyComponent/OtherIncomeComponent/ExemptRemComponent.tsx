'use client'

import React, { useState, useEffect } from "react"

import axios from "axios"
import { BanknoteIcon as BankIcon, FileTextIcon, UsersIcon, FileIcon, WalletIcon, ChevronDownIcon, ChevronRightIcon, ChevronUp } from 'lucide-react'
import Sliderbar from "@/Layout/Sidebar"
import SectionNavigation from "@/utils/SectionNavigation"
import { fetchExemptData, fetchExemptRemData, fetchInterestData } from "@/api/incomeSoucre"
import ExempRemField from "./ExempRemField"


type InterestType = "Lottery and Gift" | "Online Gaming" | "Invoice Discounting" | "Deductible Expenses" |"Income from Other Sources" 

interface InterestItem {
  name?: string
  description?: string
  amount: number
}

interface InterestData {
  type: InterestType
  data: InterestItem[]
  description: string
  icon: React.ReactNode
  isNew?: boolean
  amount?: string
}

const initialData: InterestData[] = [
  { 
    type: "Lottery and Gift", 
    data: [], 
    description: "Example: Interest earned on PPF.",
    icon: <BankIcon className="w-6 h-6 text-blue-400" />
  },
  { 
    type: "Online Gaming", 
    data: [], 
    description: "Interest earned from Non Residential External Accounts",
    icon: <FileTextIcon className="w-6 h-6 text-blue-400" />
  },
  { 
    type: "Invoice Discounting", 
    data: [], 
    description: "Specify any Invoice Discounting.",
    icon: <UsersIcon className="w-6 h-6 text-emerald-400" />,
    isNew: true,
    // amount: "₹ 200"
  },
  { 
    type: "Deductible Expenses", 
    data: [], 
    description: "Specify any Invoice Discounting.",
    icon: <UsersIcon className="w-6 h-6 text-emerald-400" />,
    isNew: true,
    // amount: "₹ 200"
  },
  { 
    type: "Income from Other Sources", 
    data: [], 
    description: "Specify any Invoice Discounting.",
    icon: <UsersIcon className="w-6 h-6 text-emerald-400" />,
    isNew: true,
    // amount: "₹ 200"
  }
]

export default function ExemptRemComponent() {
  const [interestData, setInterestData] = useState<InterestData[]>(initialData)
  const [expanded, setExpanded] = useState<Record<InterestType, boolean>>({
    "Lottery and Gift": false,
    "Online Gaming": false,
    "Invoice Discounting": false,
    "Deductible Expenses":false,
    "Income from Other Sources":false
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        
      if (!token) {
        console.error("No token found in localStorage");
      
        return;
      }
        const updatedInterestData = await Promise.all(
          interestData.map(async (section) => {
            const data = await fetchExemptRemData(token, section.type)
            return { ...section, data }
          })
        )
        setInterestData(updatedInterestData)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  const toggleSection = (type: InterestType) => {
    setExpanded((prev) => ({ ...prev, [type]: !prev[type] }))
  }

  const updateData = (type: InterestType, newData: InterestItem[]) => {
    setInterestData((prev) =>
      prev.map((item) => (item.type === type ? { ...item, data: newData } : item))
    )
  }

  return (
    <div className="flex flex-col gap-4 ">

      {interestData.map((section) => (
        <div 
          key={section.type}
          className="bg-white rounded-md shadow-sm border border-gray-100 overflow-hidden"
        >
          <div
            className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50"
            onClick={() => toggleSection(section.type)}
          >
            <div className="flex items-center gap-4">
              {section.icon}
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">
                    Interest from {section.type}
                  </h3>
                  {section.isNew && (
                    <span className="px-2 py-0.5 text-xs font-medium text-white bg-emerald-500 rounded">
                      New
                    </span>
                  )}
                  {section.amount && (
                    <span className="text-gray-600">
                      {section.amount}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  {section.description}
                </p>
              </div>
            </div>
            {expanded[section.type] ? (
               <ChevronUp className="w-5 h-5 text-gray-400" />
            
            ) : (
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            )}
          </div>

          {expanded[section.type] && (
            <div className="border-t border-gray-100 mx-10">
              <ExempRemField
                type={section.type}
                data={section.data}
                onUpdate={(newData: InterestItem[]) => updateData(section.type, newData)}
              />
            </div>
          )}
        </div>
      ))}
      </div>
   
  )
}
