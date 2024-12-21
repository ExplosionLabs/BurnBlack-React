
import TaxDeduction from '@/ImportantComponent/TaxSavingComponent/TaxDeduction/TaxDeduction';
import Sliderbar from '@/Layout/Sidebar';
import { RootState } from '@/stores/store';
import SectionNavigation from '@/utils/SectionNavigation'
import React from 'react'
import { useSelector } from 'react-redux';


function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
   <div>
    <SectionNavigation/>
    <TaxDeduction/>
   </div>
  );
}

export default Main;

