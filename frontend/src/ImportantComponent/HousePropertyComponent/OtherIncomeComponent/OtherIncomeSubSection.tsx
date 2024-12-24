import Sliderbar from '@/Layout/Sidebar'
import SectionNavigation from '@/utils/SectionNavigation'
import { ArrowLeft, Coins } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ExemptMain from './ExemptMain'
import AgriMain from './AgriMain'
import ExemptRemComponent from './ExemptRemComponent'
import BussinessFund from './BussinessFund'

const OtherIncomeSubSection = () => {
  return (
 <>
    <div className="flex items-center gap-4 mb-4">
          <Link to="/fileITR/incomeSources" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">Exempt, Online Gaming & Other Incomes</h1>
          <p className="text-sm text-gray-500 mt-1">
          Exempt Income, Invoice Discounting, Online Gaming, Puzzles, Lottery Winnings etc.
                </p>
                </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
      <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">

     <ExemptMain/>
     <AgriMain/>
     <ExemptRemComponent/>
     <BussinessFund/>
      </div>
      <div className="lg:col-span-1">
      <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>
    </div>

 </>
  )
}

export default OtherIncomeSubSection