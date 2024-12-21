import React from 'react'
import { Link } from 'react-router-dom'

const TaxDonation = () => {
  return (
    <div className=''>
        <div>
        Donations / Contributions
        </div>
<div>
    <div>

    Donations to charitable organizations
    </div>

<div>
    <Link to="/tax-saving/deduction-80g">Add Details</Link>
</div>
</div>
<div>
    <div>

    Donations for Research/Rural Development
    </div>

<div>
    <Link to="/tax-saving/deduction-80gga">Add Details</Link>
</div>
</div>
<div>
    <div>

    80GGC - Contribution to political party
    </div>

<div>
    <Link to="/tax-saving/contri-party">Add Details</Link>
</div>
</div>
    </div>
  )
}

export default TaxDonation