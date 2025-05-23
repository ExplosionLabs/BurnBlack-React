import { Link, useNavigate } from "react-router-dom";
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
import { VirtualAssestMain } from "@/ImportantComponent/VirtualAsssetComponent/VirtualAssestMain";
import { OtherIncome } from "@/ImportantComponent/HousePropertyComponent/OtherIncomeComponent/OtherIncome";
import { ArrowLeft, VerifiedIcon, Trash2Icon, SaveIcon, MoveRightIcon } from "lucide-react";
import TopUserDetail from "@/utils/TopUserDetail";

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const navigate = useNavigate();
  return (
    <>

<div className="lg:col-span-2">
      
      <div className="mx-auto p-3 lg:p-5">
      <TopUserDetail backLink="/fileITR/personalDetail" nextLink="/tax-saving" />



        <div className="bg-white px-4 py-4 rounded-md shadow-sm mb-4">


   <SectionNavigation/>
   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
   <div className="row-span-1"> 
    <Form16Main/>
    <div className="my-2"></div>
    <InterestIncomeMain/>
    </div>
    <div className="row-span-1">
    <CapitalGainMain/>
    <div className="my-2"></div>
  <HousePropComponent/>
  </div>
  <div className="row-span-1">
   <DividentComponent/>
   <div className="my-2"></div>
  <ProBussinesIncome/>
  </div>
  <div className="row-span-1">
<VirtualAssestMain/>
<div className="my-2"></div>
<OtherIncome/>
</div>
  </div>
      

  </div>
  

     
   
    </div>

    </div>

    </>
  );
}

export default Main;
