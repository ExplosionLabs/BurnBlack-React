import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/stores/store";
import SectionNavigation from "@/utils/SectionNavigation";
import ContactDetail from "../../../../ImportantComponent/PersonalDetailComponent/ContactDetail";
import PersonalDetail from "../../../../ImportantComponent/PersonalDetailComponent/PersonalDetail";
import AddressSection from "../../../../ImportantComponent/PersonalDetailComponent/AddresDetail";
import BankDetails from "../../../../ImportantComponent/PersonalDetailComponent/BankDetail";
import Sliderbar from "@/Layout/Sidebar";
import PanLinkingSection from "@/ImportantComponent/PersonalDetailComponent/PanDetail";
import { ArrowLeft, MoveRightIcon, Trash2Icon, VerifiedIcon } from "lucide-react";
import { motion } from "framer-motion";

function Main() {
    const navigate = useNavigate();
    const selectUserData = (state: RootState) => state.user.user;
    const userData = useSelector(selectUserData);
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <div className="lg:col-span-2">
            <div className="mx-auto p-3 lg:p-5">
                <div className="flex items-center justify-between gap-3 mb-3">
                    <button
                        className="flex bg-gray-200 p-1 hover:bg-gray-300 border border-gray-300 rounded-full items-center gap-2 text-gray-600 pr-3"
                        onClick={() => navigate("/fileITR/uploadForm16")}
                    >
                        <ArrowLeft className="pl-2 w-5 h-5 text-gray-600" /> Back
                    </button>
                    <div className="flex flex-row items-center gap-2">
                        <motion.button
                        className="hidden sm:flex p-1 bg-gradient-to-r from-green-700 to-green-500 rounded-full items-center gap-2 text-white pr-3 font-medium"
                        whileHover={{ boxShadow: "0px 0px 8px rgba(0, 255, 0, 0.8)" }}
                        animate={{ boxShadow: ["0px 0px 8px rgba(0, 255, 0, 0.8)", "0px 0px 0px rgba(0, 255, 0, 0)"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                        >
                        <VerifiedIcon className="ml-1 w-5 h-5" /> Certified Confidently by BurnBlack
                        </motion.button>
                      <VerifiedIcon className="sm:hidden p-1 text-green-500" />
                    </div>

                    <div className="ml-auto flex">
                        <p className="flex text-gray-400 text-sm font-medium bg-white border rounded-md py-2 px-4 hover:bg-red-500 hover:text-white mr-2">
                            <Trash2Icon className="pr-2 w-5 h-5" />
                            Cancel
                        </p>
                        <p className="flex text-white text-sm hover:bg-blue-900 font-medium bg-dark border rounded-md py-2 px-4">
                            Next
                            <MoveRightIcon className="pl-2 w-5 h-5 text-white" />
                        </p>
                    </div>
                </div>

                {/* <div className="bg-gradient-to-r from-indigo-700 to-blue-900 p-4 rounded-md shadow-sm mb-8 hidden sm:block"> */}
                    <motion.div
                      className="bg-gradient-to-r from-indigo-700 to-blue-900 p-4 rounded-md shadow-sm mb-4 hidden sm:block"
                      animate={{
                      backgroundPosition: ["0% 50%", "100% 50%"],
                      }}
                      transition={{
                      duration: 10,
                      ease: "linear",
                      repeat: Infinity,
                      }}
                    >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">Filing Name:</h3>
                            <p className="text-sm font-semibold text-white">{userData?.name} (AY 2024-25)</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">Email:</h3>
                            <p className="text-sm font-semibold text-white">{userData?.email}</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">Phone:</h3>
                            <p className="text-sm font-semibold text-white">+91489615668</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">Tax Regime:</h3>
                            <p className="text-sm font-semibold text-white">New (2018)</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">City:</h3>
                            <p className="text-sm font-semibold text-white">New Delhi</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">PAN:</h3>
                            <p className="text-sm font-semibold text-white">CFUS241SV</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">Total Taxable Income</h3>
                            <p className="text-sm font-semibold text-white">₹0/-</p>
                        </div>
                        <div>
                            <h3 className="text-xs font-medium text-gray-200">Total Tax Rebate</h3>
                            <p className="text-sm font-semibold text-white">₹9823</p>
                        </div>
                    </div>
                </motion.div>

                <div className="sm:hidden 4">
                    <button
                        className="w-full bg-gradient-to-r from-indigo-700 to-blue-900 p-2 rounded-md mb-2 text-white"
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                        {isDropdownOpen ? "Hide Filing Details -" : "Show Filing Details +"}
                    </button>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="bg-gradient-to-r from-indigo-700 to-blue-900 p-4 rounded-md shadow-sm "
                        >
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">Filing Name:</h3>
                                    <p className="text-sm font-semibold text-white">{userData?.name} (AY 2024-25)</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">Email:</h3>
                                    <p className="text-sm font-semibold text-white">{userData?.email}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">Phone:</h3>
                                    <p className="text-sm font-semibold text-white">+91489615668</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">Tax Regime:</h3>
                                    <p className="text-sm font-semibold text-white">New (2018)</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">City:</h3>
                                    <p className="text-sm font-semibold text-white">New Delhi</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">PAN:</h3>
                                    <p className="text-sm font-semibold text-white">CFUS241SV</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">Total Taxable Income</h3>
                                    <p className="text-sm font-semibold text-white">₹0/-</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-medium text-gray-200">Total Tax Rebate</h3>
                                    <p className="text-sm font-semibold text-white">₹9823</p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>

                <div className="bg-white px-4 py-4 rounded-md shadow-sm mb-4">
                    <SectionNavigation />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                        <div className="row-span-1">
                            <PersonalDetail />
                            <div className="my-2"></div>
                            <AddressSection />
                        </div>
                        <div className="row-span-1">
                            <ContactDetail />
                            <div className="my-2"></div>
                            <BankDetails />
                        </div>
                    </div>
                </div>

                {/* Mobile Dropdown for User Details */}
                
            </div>
        </div>
    );
}

export default Main;
