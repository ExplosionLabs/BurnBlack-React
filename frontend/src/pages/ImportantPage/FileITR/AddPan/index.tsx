import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
    <div>
   Add Pan Details
   <div>
    <Link to="/fileITR/uploadForm16">
    Skip</Link>
   </div>
    </div>
    </>
  );
}

export default Main;
