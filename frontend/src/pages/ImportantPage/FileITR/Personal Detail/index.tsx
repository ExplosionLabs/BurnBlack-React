import React, { useState, useEffect } from "react";
import axios from "axios";
import debounce from "lodash.debounce";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";
import ContactDetail from "./Section/ContactDetail";
import PersonalDetail from "./Section/PersonalDetail";
import AddressSection from "./Section/AddresDetail";
import BankDetails from "./Section/BankDetail";

function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
      <div className="flex flex-col gap-8">
        <SectionNavigation />
       <PersonalDetail/>
       <ContactDetail/>
       <AddressSection/>
       <BankDetails/>
      </div>
    </>
  );
}

export default Main;
