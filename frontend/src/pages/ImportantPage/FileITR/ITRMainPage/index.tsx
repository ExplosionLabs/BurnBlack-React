import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
    <div>
    ITR Main page
    <div>
    <Link to="/fileITR/addPanCardDetail">Fill Details</Link>
    </div>
        
    </div>
    </>
  );
}

export default Main;
