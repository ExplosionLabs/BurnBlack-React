import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";

function Form16Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
   <SectionNavigation/>
   <div>
    Add manually
   </div>
   <div>
    
    <Link to="/fileITR/uploadForm16">
    Upload Form 16
    </Link>
   </div>
    </>
  );
}

export default Form16Main;
