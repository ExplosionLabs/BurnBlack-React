
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
<div className="flex items-center gap-4 mb-4">
          <Link to="/tax-saving" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">Tax Savings Deductions</h1>
          <p className="text-sm text-gray-500 mt-1">
          Invested your earnings to save taxes for AY 2024-25? Enter relevant fields & save taxes!


                </p>
                </div>
        </div>
<div className='flex flex-col gap-4'>

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