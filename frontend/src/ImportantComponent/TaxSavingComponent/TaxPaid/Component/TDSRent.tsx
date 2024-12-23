
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const TDSRent = () => {

  return (
    <>
    
    <div className='flex gap-4'>TDS - Sale/Rent of Immovable Property

       <Link to="/tax-saving/tds-rent">
       Fill Details
       </Link>
    </div>
    
    </>
  )
}

export default TDSRent;