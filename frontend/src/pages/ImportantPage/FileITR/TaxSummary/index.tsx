import IncomeSourceComponent from '@/ImportantComponent/TaxSummaryComponent/IncomeSourceComponent';
import PersonalDetailComponent from '@/ImportantComponent/TaxSummaryComponent/PersonalDetailComponent';
import TaxPaidComponent from '@/ImportantComponent/TaxSummaryComponent/TaxPaidComponent';
import TaxPayableComponent from '@/ImportantComponent/TaxSummaryComponent/TaxPayableComponent';
import TaxSaving from '@/ImportantComponent/TaxSummaryComponent/TaxSaving';
import TaxSummarySection from '@/ImportantComponent/TaxSummaryComponent/TaxSummarySection';
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
    <TopUserDetail backLink="/tax-saving" nextLink="/tax-saving" />
      <div className="bg-white px-4 py-4 rounded-md shadow-sm mb-4">
        <SectionNavigation />
      <div>

     
      <TaxSummarySection/>
        <PersonalDetailComponent/>
        <IncomeSourceComponent/>
        <TaxSaving/>
        <TaxPayableComponent/>
        <TaxPaidComponent/>
        </div>
      </div>
     
      </div>
     
   
    </div>
  );
}

export default Main;

