
import Loans from './Loans'
import MedicalInsu from './MedicalInsu'
import OtherDeduction from './OtherDeduction'
import SavingInvestment from './SavingInvestment'
import TaxDonation from './TaxDonation'

const TaxDashboard = () => {

  
  return (
<>
<div className='flex flex-col gap-2'>

<SavingInvestment/>
<TaxDonation/>
<MedicalInsu/>
<Loans/>
<OtherDeduction/>
</div>
</>
  )
}

export default TaxDashboard;