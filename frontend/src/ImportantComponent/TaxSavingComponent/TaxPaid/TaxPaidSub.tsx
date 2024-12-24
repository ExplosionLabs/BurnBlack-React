import React from 'react'
import SelfTax from './Component/SelfTax'
import NonSalary from './Component/NonSalary'
import TDSRent from './Component/TDSRent'
import TaxCollected from './Component/TaxCollected'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const TaxPaidSub = () => {
  return (
    <>
    <div className="flex items-center gap-4 mb-4">
          <Link to="/tax-saving" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">Taxes Paid, TDS and TCS</h1>
          <p className="text-sm text-gray-500 mt-1">
          TDS or TCS Payments, Payments for Advance Taxes or Tax due and others. You can also <br />Upload Form 26AS to fetch these details.


                </p>
                </div>
        </div>
    <div className='flex flex-col gap-4'>
        <SelfTax/>
        <NonSalary/>
        <TDSRent/>
        <TaxCollected/>
    </div>
    </>
  )
}

export default TaxPaidSub