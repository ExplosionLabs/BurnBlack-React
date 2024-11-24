import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";

function Main() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const selectUserName = (state: RootState) => state.user.user?.name;
    const userName = useSelector(selectUserName);

  return (
    <>
    <div>
        Home Page



        {isUserLoggedIn?(<><div>
          Hello {userName}
          </div></>):(
            <div>


            <div>
                <Link to="/login">
               
                Login
                </Link>
            </div>
            <div>
                <Link to="/register">
                
                Register
                </Link>
            </div>
    
            <div>
            </div>
    
   
            </div>
          )}

<Link to="fileITR">
                File ITR
                </Link>
    </div>
    </>
  );
}

export default Main;
