
import TaxDeduction from '@/ImportantComponent/TaxSavingComponent/TaxDeduction/TaxDeduction';
import TaxLoss from '@/ImportantComponent/TaxSavingComponent/TaxLoss/TaxLoss';
import TaxPaid from '@/ImportantComponent/TaxSavingComponent/TaxPaid/TaxPaid';
import Sliderbar from '@/Layout/Sidebar';
import { RootState } from '@/stores/store';
import SectionNavigation from '@/utils/SectionNavigation'
import TopUserDetail from '@/utils/TopUserDetail';
import React from 'react'
import { useSelector } from 'react-redux';


function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
   <div  className="lg:col-span-2">
     <div className="mx-auto p-3 lg:p-5">
      <TopUserDetail backLink="/fileITR/incomeSources" nextLink="/fileITR/tax-summary" />
    <div className="bg-white px-4 py-4 rounded-md shadow-sm mb-4">
    <SectionNavigation/>
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 my-4'>

    <TaxDeduction/>
    <TaxPaid/>
    <TaxLoss/>
    </div>
    </div>
    </div>
   </div>
  );
}

export default Main;

