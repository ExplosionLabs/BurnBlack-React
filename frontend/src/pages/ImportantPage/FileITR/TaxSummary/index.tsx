import IncomeSourceComponent from '@/ImportantComponent/TaxSummaryComponent/IncomeSourceComponent';
import PersonalDetailComponent from '@/ImportantComponent/TaxSummaryComponent/PersonalDetailComponent';
import TaxPaidComponent from '@/ImportantComponent/TaxSummaryComponent/TaxPaidComponent';
import TaxPayableComponent from '@/ImportantComponent/TaxSummaryComponent/TaxPayableComponent';
import TaxSaving from '@/ImportantComponent/TaxSummaryComponent/TaxSaving';
import TaxSummarySection from '@/ImportantComponent/TaxSummaryComponent/TaxSummarySection';
import Sliderbar from '@/Layout/Sidebar';
import { RootState } from '@/stores/store';
import SectionNavigation from '@/utils/SectionNavigation'
import TopUserDetail from '@/utils/TopUserDetail';
import React from 'react'
import { useSelector } from 'react-redux';


function Main() {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  return (
    <div  className="lg:col-span-2">
           <div className="mx-auto p-3 lg:p-5">
    <TopUserDetail backLink="/tax-saving" nextLink="/tax-saving" />
      <div className="bg-white px-4 py-4 rounded-md shadow-sm mb-4">
        <SectionNavigation />
      <div>

     
      <TaxSummarySection/>
        <PersonalDetailComponent/>
        <IncomeSourceComponent/>
        <TaxSaving/>
        <TaxPayableComponent/>
        <TaxPaidComponent/>
        
        {/* Download JSON Button */}
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              // Create a form data object with relevant information
              const formData = {
                timestamp: new Date().toISOString(),
                userInfo: {
                  // Include basic user information if available
                  loggedIn: isUserLoggedIn
                },
                formData: {
                  // This should be replaced with the actual form data from your application
                  // You could either collect it from Redux or create a ref-based approach
                  version: "1.0"
                }
              };
              
              // Create a blob with the JSON data
              const blob = new Blob([JSON.stringify(formData, null, 2)], { type: 'application/json' });
              
              // Create a download link
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = 'tax-form-data.json';
              
              // Trigger download
              document.body.appendChild(link);
              link.click();
              
              // Cleanup
              URL.revokeObjectURL(url);
              document.body.removeChild(link);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
            </svg>
            Download Form Data (JSON)
          </button>
        </div>
        </div>
      </div>
     
      </div>
     
   
    </div>
  );
}

export default Main;

