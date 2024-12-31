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
import TopUserDetail from "@/utils/TopUserDetail";

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
            <TopUserDetail backLink="/fileITR/uploadForm16" nextLink="/fileITR/incomeSources" />


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
