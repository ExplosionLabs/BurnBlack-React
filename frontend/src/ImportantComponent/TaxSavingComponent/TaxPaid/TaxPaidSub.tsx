import React from 'react'
import SelfTax from './Component/SelfTax'
import NonSalary from './Component/NonSalary'
import TDSRent from './Component/TDSRent'
import TaxCollected from './Component/TaxCollected'

const TaxPaidSub = () => {
  return (
    <div className='flex flex-col gap-4'>
        <SelfTax/>
        <NonSalary/>
        <TDSRent/>
        <TaxCollected/>
    </div>
  )
}

export default TaxPaidSub