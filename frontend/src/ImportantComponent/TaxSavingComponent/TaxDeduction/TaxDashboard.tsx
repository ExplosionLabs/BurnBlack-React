
import { ArrowLeft } from 'lucide-react'
import Loans from './Loans'
import MedicalInsu from './MedicalInsu'
import OtherDeduction from './OtherDeduction'
import SavingInvestment from './SavingInvestment'
import TaxDonation from './TaxDonation'
import { Link } from 'react-router-dom'

const TaxDashboard = () => {

  
  return (
<>


<SavingInvestment/>
<TaxDonation/>
<MedicalInsu/>
<Loans/>
<OtherDeduction/>

</>
  )
}

export default TaxDashboard;