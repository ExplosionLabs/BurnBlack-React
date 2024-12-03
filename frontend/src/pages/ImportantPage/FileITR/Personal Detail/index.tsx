import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";
import ContactDetail from "../../../../ImportantComponent/PersonalDetailComponent/ContactDetail";
import PersonalDetail from "../../../../ImportantComponent/PersonalDetailComponent/PersonalDetail";
import AddressSection from "../../../../ImportantComponent/PersonalDetailComponent/AddresDetail";
import BankDetails from "../../../../ImportantComponent/PersonalDetailComponent/BankDetail";
import Sliderbar from "@/Layout/Sidebar";
import PanLinkingSection from "@/ImportantComponent/PersonalDetailComponent/PanDetail";

function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

   
    <div className="lg:col-span-2 space-y-4">
  <SectionNavigation />
  <PersonalDetail />
  <ContactDetail />
  <AddressSection />
  <BankDetails />
  <PanLinkingSection/>
</div>

      <div>
        <Sliderbar/>
      </div>
      </div>
    </>
  );
}

export default Main;
