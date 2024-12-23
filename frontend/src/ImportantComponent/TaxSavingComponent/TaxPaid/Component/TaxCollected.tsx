
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const TaxCollected = () => {

  return (
    <>
    
    <div className='flex gap-4'>Tax Collected at Source

       <Link to="/tax-saving/tax-collected">
       Fill Details
       </Link>
    </div>
    
    </>
  )
}

export default TaxCollected;