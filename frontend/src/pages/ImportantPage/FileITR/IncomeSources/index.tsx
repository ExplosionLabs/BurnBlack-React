import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";
import Form16Main from "@/ImportantComponent/IncomeSourcesComponent/Form16Main";
import InterestIncomeMain from "@/ImportantComponent/IncomeSourcesComponent/InterestIncomeMain";
import CapitalGainMain from "@/ImportantComponent/CaptialGainComponent/CaptialGainMain";
import HousePropComponent from "@/ImportantComponent/HousePropertyComponent/HousePropComponent";

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
   <SectionNavigation/>
   <div className="flex flex-col">
    Salary Income
    
    <Form16Main/>
    <InterestIncomeMain/>
    <CapitalGainMain/>
  <HousePropComponent/>
   </div>
    </>
  );
}

export default Main;
