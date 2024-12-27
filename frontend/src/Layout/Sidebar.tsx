import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { ArrowRight, CheckCircle, MessageCircle, PlayCircle, Shield } from 'lucide-react'
function Sliderbar() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4 sm:p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <MessageCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        <div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Chat on Whatsapp</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">ask Neha for ITR doubts and queries</p>
        <button className="text-blue-500 font-medium flex items-center text-xs sm:text-sm">
          Chat Now <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </button>
        </div>
      </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-green-500" />
        <div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">We&apos;ve got you covered</h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">File your taxes confidently with 100% accuracy</p>
        <button className="text-blue-500 font-medium flex items-center text-xs sm:text-sm">
          Learn More <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </button>
        </div>
      </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        <div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Step by step guide for ITR filing</h3>
        <button className="text-blue-500 font-medium flex items-center mt-2 sm:mt-3 text-xs sm:text-sm">
          View Guide <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </button>
        </div>
      </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div className="flex items-start gap-4">
        <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" />
        <div>
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Book consultation with authorised CA</h3>
        <button className="text-blue-500 font-medium flex items-center mt-2 sm:mt-3 text-xs sm:text-sm">
          View Guide <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1" />
        </button>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}

export default Sliderbar;
