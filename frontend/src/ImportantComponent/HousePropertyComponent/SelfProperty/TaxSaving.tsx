'use client'

import { Scissors, ChevronDown } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TaxSavingsDetailsProps {
  data: {
    constructionYear: string
    interestDuringConstruction: number
    interestAfterCompletion: number
    totalDeduction: number
  }
  onChange: (updatedData: any) => void
}

export default function TaxSavingsDetails({ data, onChange }: TaxSavingsDetailsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const years = ["2022 - 2023", "2021 - 2022", "2020 - 2021", "2019 - 2020", "2018 - 2019"]

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value })
  }

  useEffect(() => {
    const totalDeduction = 0.2 * (data.interestDuringConstruction || 0) + (data.interestAfterCompletion || 0)
    handleChange("totalDeduction", totalDeduction)
  }, [data.interestDuringConstruction, data.interestAfterCompletion])

  return (
    <div className="w-full rounded-2xl p-6 shadow-sm bg-white border border-gray-100">
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center gap-2">
          <Scissors className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Tax Savings for Home Loan(Interest Paid Details)</h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label="Toggle form visibility"
        >
          <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>
      </div>
      
      <p className="text-gray-500 mb-4 ml-8">Following details are optional. Please fill in the relevant fields only.</p>

      {isOpen && (
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="construction-year" className="text-gray-700 font-medium">
                Year previous to completion of construction
              </label>
              <button className="text-gray-400 hover:text-gray-500" title="If construction completed on July 2023, specify 2022-23">
                ⓘ
              </button>
            </div>
            <select
              id="construction-year"
              value={data.constructionYear}
              onChange={(e) => handleChange("constructionYear", e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500">If construction completed on July 2023, specify 2022-23</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="interest-during-construction" className="text-gray-700 font-medium">
                A. Home Loan interest paid during construction period
              </label>
              <button className="text-gray-400 hover:text-gray-500" title="20% of the interest will be considered for deduction every year">
                ⓘ
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input
                type="number"
                id="interest-during-construction"
                value={data.interestDuringConstruction || ''}
                onChange={(e) => handleChange("interestDuringConstruction", Number(e.target.value))}
                className="w-full pl-8 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
            <p className="text-sm text-gray-500">20% of the interest will be considered for deduction every year</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="interest-after-completion" className="text-gray-700 font-medium">
                B. Home Loan interest paid after construction completion (Section 24b Deduction)
              </label>
              <button className="text-gray-400 hover:text-gray-500" title="Interest paid after completion">
                ⓘ
              </button>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input
                type="number"
                id="interest-after-completion"
                value={data.interestAfterCompletion || ''}
                onChange={(e) => handleChange("interestAfterCompletion", Number(e.target.value))}
                className="w-full pl-8 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label htmlFor="total-deduction" className="text-gray-700 font-medium">
                C. Total Deduction(20% of A + B)
              </label>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-500">₹</span>
              <input
                type="number"
                id="total-deduction"
                value={data.totalDeduction || '0'}
                readOnly
                className="w-full pl-8 p-2 bg-gray-50 border rounded-md"
              />
            </div>
            <p className="text-sm text-gray-500">Maximum deduction that can be claimed in a FY is Rs. 2,00,000</p>
          </div>
        </div>
      )}
    </div>
  )
}

