import Sliderbar from '@/Layout/Sidebar'
import SectionNavigation from '@/utils/SectionNavigation'
import { Coins } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ExemptMain from './ExemptMain'
import AgriMain from './AgriMain'
import ExemptRemComponent from './ExemptRemComponent'

const OtherIncomeSubSection = () => {
  return (
 <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
      <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">
        <SectionNavigation/>
     <ExemptMain/>
     <AgriMain/>
     <ExemptRemComponent/>
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