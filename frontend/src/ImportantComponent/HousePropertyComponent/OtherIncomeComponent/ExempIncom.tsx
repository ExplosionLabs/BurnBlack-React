'use client'

import React, { useState, useEffect } from "react"

import axios from "axios"
import { BanknoteIcon as BankIcon, FileTextIcon, UsersIcon, FileIcon, WalletIcon, ChevronDownIcon, ChevronRightIcon, ChevronUp } from 'lucide-react'
import Sliderbar from "@/Layout/Sidebar"
import SectionNavigation from "@/utils/SectionNavigation"
import { fetchExemptData, fetchInterestData } from "@/api/incomeSoucre"
import ExemptField from "./ExemptField"

type InterestType = "Income from PPF" | "Income from NRE" | "Other Exempt Income" 

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
    type: "Income from PPF", 
    data: [], 
    description: "Example: Interest earned on PPF.",
    icon: <BankIcon className="w-6 h-6 text-blue-400" />
  },
  { 
    type: "Income from NRE", 
    data: [], 
    description: "Interest earned from Non Residential External Accounts",
    icon: <FileTextIcon className="w-6 h-6 text-blue-400" />
  },
  { 
    type: "Other Exempt Income", 
    data: [], 
    description: "Specify any other exempt income.",
    icon: <UsersIcon className="w-6 h-6 text-emerald-400" />,
    isNew: true,
    // amount: "₹ 200"
  }
]

export default function ExemptIncome() {
  const [interestData, setInterestData] = useState<InterestData[]>(initialData)
  const [expanded, setExpanded] = useState<Record<InterestType, boolean>>({
    "Income from PPF": false,
    "Income from NRE": false,
    "Other Exempt Income": false
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
            const data = await fetchExemptData(token, section.type)
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
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
      <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
        <SectionNavigation/>
        <h1>Exempt, Online Gaming & Other Incomes

</h1>
      {interestData.map((section) => (
        <div 
          key={section.type}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
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
              <ExemptField
                type={section.type}
                data={section.data}
                onUpdate={(newData: InterestItem[]) => updateData(section.type, newData)}
              />
            </div>
          )}
        </div>
      ))}
      </div>
      <div className="lg:col-span-1">
      <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>
    </div>
  )
}
