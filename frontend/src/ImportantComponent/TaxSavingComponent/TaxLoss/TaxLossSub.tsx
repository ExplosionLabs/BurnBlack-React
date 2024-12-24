import React from 'react'
import DeprectationLoss from './DeprectationLoss'
import ForeignAssets from './ForeignAssets'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const TaxLossSub = () => {
  return (
    <>
        <div className="flex items-center gap-4 mb-4">
          <Link to="/tax-saving" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">Carry Forward Loss, AIS & Other Information</h1>
          <p className="text-sm text-gray-500 mt-1">
          Other less popular details like Carry Forward of Losses, Foreign Assets, Directorship etc.


                </p>
                </div>
        </div>
    <DeprectationLoss/>
    <ForeignAssets/>
    </>
  )
}

export default TaxLossSub