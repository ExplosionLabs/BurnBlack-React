import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from "@/stores/store";
import { ArrowRight, CheckCircle, MessageCircle, PlayCircle, Shield } from 'lucide-react'
function Sliderbar() {
    const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
    const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  return (
    <>
    <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Live Support</h3>
                  <p className="text-sm text-gray-600 mb-3">ask Neha for ITR doubts and queries</p>
                  <button className="text-blue-500 font-medium flex items-center">
                    Chat Now <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-8 h-8 text-green-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">We&apos;ve got you covered</h3>
                  <p className="text-sm text-gray-600 mb-3">File your taxes confidently with 100% accuracy</p>
                  <button className="text-blue-500 font-medium flex items-center">
                    Learn More <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-start gap-4">
                <PlayCircle className="w-8 h-8 text-blue-500" />
                <div>
                  <h3 className="font-semibold text-gray-900">Step by step guide for ITR filing</h3>
                  <button className="text-blue-500 font-medium flex items-center mt-3">
                    View Guide <ArrowRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
    </>
  );
}

export default Sliderbar;
