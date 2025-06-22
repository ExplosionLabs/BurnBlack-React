import React, { useEffect, useState } from 'react';
import { ChevronDown, Share2, Menu, Wallet, X, Shield } from 'lucide-react'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '@/stores/userSlice';
import mainlogo from '@/assets/images/burnblacklogo.png';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

interface WalletData {
  balance: number;
}

const navigation = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '/about' },
  { name: 'Help', href: '/help' },
];

const userNavigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'File ITR', href: '/fileITR' },
  { name: 'Documents', href: '/documents' },
  { name: 'Settings', href: '/settings' },
];

const adminNavigation = [
  { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Shield },
  { name: 'User Management', href: '/admin/users' },
  { name: 'GST Management', href: '/admin/gst' },
];

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const selectUserData = (state: RootState) => state.user.user;
  const userData = useSelector(selectUserData);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [wallet, setWallet] = useState<WalletData | null>(null);

  const isAdmin = userData?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isUserLoggedIn) {
      fetchWallet();
    }
  }, [isUserLoggedIn]);

  const fetchWallet = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/wallet/getWallet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setWallet(response.data);
    } catch (error) {
      console.error('Error fetching wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0]?.toUpperCase())
      .join('');
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src={mainlogo} alt="BurnBlack Logo" className="h-8 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {isUserLoggedIn ? (
              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="inline-flex items-center gap-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Filing for: {userData?.name}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                    >
                      <div className="py-1">
                        {userNavigation.map((item) => (
                          <Link
                            key={item.name}
                            to={item.href}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        {isAdmin && (
                          <>
                            <div className="border-t border-gray-100 my-1" />
                            {adminNavigation.map((item) => (
                              <Link
                                key={item.name}
                                to={item.href}
                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                onClick={() => setIsDropdownOpen(false)}
                              >
                                <div className="flex items-center gap-2">
                                  {item.icon && <item.icon className="h-4 w-4" />}
                                  {item.name}
                                </div>
                              </Link>
                            ))}
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex gap-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`text-sm font-medium transition-colors ${
                      isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-gray-900 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {isUserLoggedIn ? (
              <>
                <button className="inline-flex items-center gap-x-2 rounded-md bg-blue-50 px-3.5 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-100">
                  <Wallet className="h-4 w-4" />
                  Wallet Balance: ₹{wallet?.balance?.toFixed(2) || '0.00'}
                </button>

                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-x-2 text-sm font-medium text-gray-900 hover:text-blue-600 focus:outline-none"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-medium text-gray-700">
                      {getInitials(userData?.name)}
                    </div>
                    <span>{userData?.email}</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  <AnimatePresence>
                    {isProfileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                      >
                        <div className="py-1">
                          {userNavigation.map((item) => (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              {item.name}
                            </Link>
                          ))}
                          {isAdmin && (
                            <>
                              <div className="border-t border-gray-100 my-1" />
                              {adminNavigation.map((item) => (
                                <Link
                                  key={item.name}
                                  to={item.href}
                                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                  onClick={() => setIsProfileOpen(false)}
                                >
                                  <div className="flex items-center gap-2">
                                    {item.icon && <item.icon className="h-4 w-4" />}
                                    {item.name}
                                  </div>
                                </Link>
                              ))}
                            </>
                          )}
                          <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`text-sm font-medium transition-colors ${
                    isScrolled ? 'text-gray-900 hover:text-blue-600' : 'text-gray-900 hover:text-blue-600'
                  }`}
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-900 hover:text-blue-600 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {isUserLoggedIn ? (
                <>
                  <div className="px-3 py-2 text-base font-medium text-gray-900">
                    Filing for: {userData?.name}
                  </div>
                  <button className="flex w-full items-center gap-x-2 rounded-md px-3 py-2 text-base font-medium text-blue-600 hover:bg-gray-100">
                    <Wallet className="h-4 w-4" />
                    Wallet Balance: ₹{wallet?.balance?.toFixed(2) || '0.00'}
                  </button>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAdmin && (
                    <>
                      <div className="border-t border-gray-100 my-1" />
                      {adminNavigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="flex items-center gap-2">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <>
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  <Link
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-medium bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
