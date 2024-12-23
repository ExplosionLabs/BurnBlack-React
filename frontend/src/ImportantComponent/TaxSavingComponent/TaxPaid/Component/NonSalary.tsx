
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const NonSalary = () => {

  return (
    <>
    
    <div className='flex gap-4'>Non Salary

       <Link to="/tax-saving/tds-nonsalary">
       Fill Details
       </Link>
    </div>
    
    </>
  )
}

export default NonSalary;