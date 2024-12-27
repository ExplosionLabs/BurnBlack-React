import IncomeSourceComponent from '@/ImportantComponent/TaxSummaryComponent/IncomeSourceComponent';
import PersonalDetailComponent from '@/ImportantComponent/TaxSummaryComponent/PersonalDetailComponent';
import TaxPaidComponent from '@/ImportantComponent/TaxSummaryComponent/TaxPaidComponent';
import TaxPayableComponent from '@/ImportantComponent/TaxSummaryComponent/TaxPayableComponent';
import TaxSaving from '@/ImportantComponent/TaxSummaryComponent/TaxSaving';
import TaxSummarySection from '@/ImportantComponent/TaxSummaryComponent/TaxSummarySection';
import Sliderbar from '@/Layout/Sidebar';
import { RootState } from '@/stores/store';
import SectionNavigation from '@/utils/SectionNavigation'
import React from 'react'
import { useSelector } from 'react-redux';


function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
     
      <div className="lg:col-span-2 space-y-4 overflow-y-auto h-screen pr-4 scrollbar-hide">
        <SectionNavigation />
      
      <TaxSummarySection/>
        <PersonalDetailComponent/>
        <IncomeSourceComponent/>
        <TaxSaving/>
        <TaxPayableComponent/>
        <TaxPaidComponent/>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>

     
   
    </div>
  );
}

export default Main;

