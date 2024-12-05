'use client'

import React, { useState, useEffect } from "react"

import axios from "axios"
import { BanknoteIcon as BankIcon, FileTextIcon, UsersIcon, FileIcon, WalletIcon, ChevronDownIcon, ChevronRightIcon, ChevronUp } from 'lucide-react'
import Fields from "./Field"
import Sliderbar from "@/Layout/Sidebar"
import SectionNavigation from "@/utils/SectionNavigation"

type InterestType = "Savings Bank" | "Fixed Deposits" | "P2P Investments" | "Bond Investments" | "Provident Fund" | "Income Tax Refund" | "Other Interest Income"

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
    type: "Savings Bank", 
    data: [], 
    description: "Add interest earned from Savings Bank or Post Office Bank Account",
    icon: <BankIcon className="w-6 h-6 text-blue-400" />
  },
  { 
    type: "Fixed Deposits", 
    data: [], 
    description: "Add interest earned from any fixed deposits including Post Office FDs",
    icon: <FileTextIcon className="w-6 h-6 text-blue-400" />
  },
  { 
    type: "P2P Investments", 
    data: [], 
    description: "Popular Platforms: CredMint, 12% Club, LendBox, IndiaP2P",
    icon: <UsersIcon className="w-6 h-6 text-emerald-400" />,
    isNew: true,
    // amount: "₹ 200"
  },
  { 
    type: "Bond Investments", 
    data: [], 
    description: "Popular Platforms: Grip, Jiraaf, WintWealth, TheFixedIncome, GoldenPi",
    icon: <FileIcon className="w-6 h-6 text-orange-400" />,
    isNew: true,
    // amount: "₹ 200"
  },
  { 
    type: "Provident Fund", 
    data: [], 
    description: "Add interest earned from Employee / Recognized Provident Fund (EPF/RPF)",
    icon: <WalletIcon className="w-6 h-6 text-purple-400" />
  },
  { 
    type: "Income Tax Refund", 
    data: [], 
    description: "Add interest earned from Employee / Recognized Provident Fund (EPF/RPF)",
    icon: <WalletIcon className="w-6 h-6 text-purple-400" />
  },
  { 
    type: "Other Interest Income", 
    data: [], 
    description: "Add interest earned from Employee / Recognized Provident Fund (EPF/RPF)",
    icon: <WalletIcon className="w-6 h-6 text-purple-400" />
  }
]

export default function IncomeInterest() {
  const [interestData, setInterestData] = useState<InterestData[]>(initialData)
  const [expanded, setExpanded] = useState<Record<InterestType, boolean>>({
    "Savings Bank": false,
    "Fixed Deposits": false,
    "P2P Investments": false,
    "Bond Investments": false,
    "Provident Fund": false,
    "Income Tax Refund": false,
    "Other Interest Income": false,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token")
        const updatedInterestData = await Promise.all(
          interestData.map(async (section) => {
            try {
              const response = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/get-interest-income/${section.type}`,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              )

              if (response.data.success && response.data.data) {
                section.data = response.data.data
              }
            } catch (error) {
              console.error(`Error fetching data for ${section.type}:`, error)
            }
            return section
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
            <div className="border-t border-gray-100">
              <Fields
                type={section.type}
                data={section.data}
                onUpdate={(newData) => updateData(section.type, newData)}
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
