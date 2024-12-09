import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";
import Form16Main from "@/ImportantComponent/IncomeSourcesComponent/Form16Main";
import InterestIncomeMain from "@/ImportantComponent/IncomeSourcesComponent/InterestIncomeMain";
import CapitalGainMain from "@/ImportantComponent/CaptialGainComponent/CaptialGainMain";
import HousePropComponent from "@/ImportantComponent/HousePropertyComponent/HousePropComponent";
import DividentComponent from "@/ImportantComponent/HousePropertyComponent/DividentComponent";
import ProBussinesIncome from "@/ImportantComponent/ProfessionBussinessIncome/ProBussinnessIncome";
import Sliderbar from "@/Layout/Sidebar";
import FinancialParticular from "@/ImportantComponent/FinancialParticular/FinancialParticular";

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
<div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
  <div className="lg:col-span-3 space-y-4 overflow-y-auto h-screen scrollbar-hide">

   <SectionNavigation/>
    <div className="flex flex-col gap-4">
      
    
    <Form16Main/>
    <InterestIncomeMain/>
    <CapitalGainMain/>
  <HousePropComponent/>
  <DividentComponent/>
  <ProBussinesIncome/>
  <FinancialParticular/>
  </div>
      

  </div>
  <div className="lg:col-span-1">
        <div className="sticky top-0">
          <Sliderbar />
        </div>
      </div>

     
   
    </div>
    </>
  );
}

export default Main;
