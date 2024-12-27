import { useState } from 'react';
import { ChevronDown, Share2, Menu, Wallet } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '@/stores/userSlice';
import mainlogo from '@/assets/images/burnblacklogo.png';

const Navbar = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const navigate=useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
    const selectUserData = (state: RootState) => state.user.user;
    const userData=useSelector(selectUserData);
    const dispatch = useDispatch();


    const handleLogout = () => {
        dispatch(logout());
        alert("Logout Successfully");
      };
    const getInitials = (name: string | undefined) => {
        if (!name) return '';
        return name
          .split(' ')
          .map(word => word[0]?.toUpperCase())
          .join('');
      };
    return (
      <nav className="border-b bg-white shadow-sm">
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-semibold text-gray-700">
              <img src={mainlogo} alt="Logo" className="h-8 w-auto" />
              </Link>
            </div>
  
            {/* Center Menu */}
            <div className="hidden md:block">
              {isUserLoggedIn ? (   
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Filing for: {userData?.name}
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isDropdownOpen && (
                  <div className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Option 1
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Option 2
                      </a>
                    </div>
                  </div>
                )}
              </div>
              ):(
   <div className="flex gap-8 text-left">
   <h1  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Products </h1>
   <h1  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Resources  </h1>
   <h1  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Company  </h1>
 </div>
                )}
           
            </div>
  

       {isUserLoggedIn ? (
  <div className="hidden md:flex md:items-center md:space-x-4">
  <button className="inline-flex items-center gap-x-2 rounded-md bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100">
    <Wallet className="h-4 w-4" />
    Wallet Balance : ₹9823 
  </button>

  <div className="relative">
    <div className="flex col-span-1 items-center gap-2"  onClick={() => setIsProfileOpen(!isProfileOpen)}>

    <button
     
      className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700"
    >
   {getInitials(userData?.name)} 
    </button>
    {userData?.name}

    </div>
    

    {isProfileOpen && (
      <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
        <div
        
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Your Profile
        </div>
        <div
          
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Settings
        </div>
        <div
          onClick={handleLogout}
          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Sign out
        </div>
      </div>
    )}
  </div>
</div>
       ):(
<>
<button onClick={()=>
    {
        navigate("/register")
    }
} className='inline-flex items-center gap-x-1 bg-blue-700 border rounded-md px-3 py-2 text-sm font-medium text-white hover:bg-blue-900'>Get Started</button>
</>
       )}
          
  
            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
  
        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden">{
            isUserLoggedIn ? (
<div className="space-y-1 px-2 pb-3 pt-2">
              <button className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
              Filing for: {userData?.name}
              </button>
              <button className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-100">
                <Wallet className="h-4 w-4" />
                Wallet Balance : ₹9823
              </button>
              <button className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Your Profile
              </button>
              <button className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Settings
              </button>
              <button   onClick={handleLogout} className="block w-full rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:bg-gray-100">
                Sign out
              </button>
            </div>
            ):(
<div className="space-y-1 px-2 pb-3 pt-2">
<div className="flex gap-4 text-center">
   <h1  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Products </h1>
   <h1  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Resources  </h1>
   <h1  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Company  </h1>
 </div>
              
            </div>
            )
          }
            
          </div>
        )}
      </nav>
  );
};

export default Navbar;
