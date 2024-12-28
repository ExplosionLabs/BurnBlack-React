import React, { ReactNode, useEffect, useState } from 'react';
import { fetchAllInterestData, fetchBondData, fetchCryptoAssestData, fetchDividendData, fetchForeignAssetsData, fetchGoldData, fetchLandFormData, fetchLongShortData, fetchStockMututalData, fetchStockRsuData } from '@/api/incomeSoucre';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
import { fetchLandPropertyData, fetchRentPropertyData } from '@/api/landProperty';
import { fetchBussinessData, fetchProfessionalData, fetchProfitLossData } from '@/api/professionalIncome';
import { fetchForm16, fetchIncomeCal } from '@/api/calculateIncome';
import { formatCurrency } from '@/helper/currentFormat';
interface InterestItem {
  fieldType?: string;
  name?: string;
  description?: string;
  amount: number;
}

interface InterestData {
  _id: string;
  type: string;
  data: InterestItem[];
}

interface ProfitData {
  assetType: ReactNode;
  name: string;
  totalProfit: number;
}

const IncomeSourceComponent = () => {
  const [grossIncome,setGrossIncome]=useState("");
  const [interestData, setInterestData] = useState<InterestData[]>([]);
  const [stockMutualData, setStockMutualData] = useState<ProfitData[]>([]);
  const [foreignAssetsData, setForeignAssetsData] = useState<any>(null); // Now a single object
  const [landFormData, setLandFormData] = useState<any>(null); // Now a single object
  const [stockRsuData, setStockRsuData] = useState<any>(null);
  const [bondData, setBondData] = useState<any>(null);
  const [goldData, setGoldData] = useState<any>(null);
  const [longTermData, setLongTermData] = useState<any>(null);
  const [shortTermData, setShortTermData] = useState<any>(null);
  const [dividendData, setDividendData] = useState<any>(null);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [virtualAssestsData, setVirtualAssestData] = useState<any>(null);
  const [profData, setProfData] = useState<any>(null);
  const [bussinessData,setBussiessData]=useState<any>(null);
  const [profitLossData,setProfitLossData]=useState<any>(null);
  const [rentPropertyData, setRentPropertyData] = useState<any>(null);
  const [form16Data, setForm16Data] = useState<any>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedProfitSections, setExpandedProfitSections] = useState<Record<string, boolean>>({});
  const [expandedLandsSections, setExpandedLandSections] = useState<Record<string, boolean>>({});
  const [expandedProfSections, setExpandedProfSections] = useState<Record<string, boolean>>({});
  const [expandedForm16Sections, setExpandedForm16Sections] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing from localStorage");
        }
       
  
        const interestResponse = await fetchAllInterestData(token);
        const stockMutualResponse = await fetchStockMututalData(token);
        const foreignAssetsResponse = await fetchForeignAssetsData(token); // Single object now
        const landFormResponse = await fetchLandFormData(token);
        const bondFormResponse = await fetchBondData(token);
        const goldFormResponse = await fetchGoldData(token);
        const stockRsuResponse = await fetchStockRsuData(token);
        const longShortResponse = await fetchLongShortData(token);
        const dividendDataResponse=await fetchDividendData(token);
        const propertyResponse=await fetchLandPropertyData(token);
        const rentPropertyResponse=await fetchRentPropertyData(token);
        const virtualAssestsResponse=await fetchCryptoAssestData(token);
        const profResponse=await fetchProfessionalData(token);
        const bussinessReponse=await fetchBussinessData(token);
        const profitLossResponse=await fetchProfitLossData(token);
        const form16Response=await fetchForm16(token);
        if (interestResponse?.data && Array.isArray(interestResponse.data)) {
          setInterestData(interestResponse.data);
        }
   if(dividendDataResponse){
    setDividendData(dividendDataResponse?.data);
   }
        if (stockMutualResponse) {
          setStockMutualData(stockMutualResponse);
        }
  
        if (foreignAssetsResponse) {
          setForeignAssetsData(foreignAssetsResponse); // Set as single object
        }
  
        if (landFormResponse) {
          setLandFormData(landFormResponse);
        }
  
        if (stockRsuResponse) {
          setStockRsuData(stockRsuResponse);
        }
  
        if (bondFormResponse) {
          setBondData(bondFormResponse);
        }
  
        if (goldFormResponse) {
          setGoldData(goldFormResponse);
        }
        if (longShortResponse) {
        
          setShortTermData(longShortResponse.shortTermDetails);
          setLongTermData(longShortResponse.longTermDetails);
        }
        if(propertyResponse){
          setPropertyData(propertyResponse.data);
        }
        if(rentPropertyResponse){
          setRentPropertyData(rentPropertyResponse.data);
        }
        if(virtualAssestsResponse && Array.isArray(virtualAssestsResponse)){
          const combinedTotalGain = virtualAssestsResponse.reduce((acc, item) => acc + (item.totalGains || 0), 0);
          setVirtualAssestData(combinedTotalGain);
        }
  
        if(profResponse){
          setProfData(profResponse.data.
            totalRevenue);
         
        }
        if(bussinessReponse){
        
          const {profitcash,profitMode,profitDigitalMode }=bussinessReponse.data;
          const sum=profitcash+profitMode+profitDigitalMode;
       
          setBussiessData(sum);
        }
        if(profitLossResponse){
          setProfitLossData(profitLossResponse.data);
        }
        if(form16Response){
          setForm16Data(form16Response);
        }
      } catch (err: any) {
        console.error("Error fetching data:", err.message);
      }
    };
  
    fetchData();
  }, []);
  
  const toggleSection = (id: string) => {
    setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleProfitSection = (id: string) => {
    setExpandedProfitSections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const togglePropertySection = (id: string) => {
    setExpandedLandSections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleProf = (id: string) => {
   setExpandedProfSections(prev => ({ ...prev, [id]: !prev[id] }));
  };
  const toggleForm16 = (id: string) => {
   setExpandedForm16Sections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalIncome = interestData.reduce(
    (sum, section) =>
      sum + section.data.reduce((sectionSum, item) => sectionSum + (item.amount || 0), 0),
    0
  );

    useEffect(() => {
      const fetchGrossIncome = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) {
            return;
          }
          const response = await fetchIncomeCal(token);
          const data = await response;
          if(data){
  
          
          setGrossIncome(data.grossIncome);
       
        }
        } catch (error) {
          console.error('Error fetching gross income:', error);
        }
      };
  
      fetchGrossIncome();
    }, []);
  const totalIncomeOther = totalIncome + (dividendData?.totalAmount || 0);
  const totalIncomeProff=(profData||0)  + (bussinessData || 0) +(profitLossData?.totalProfit|| 0);

  // const totalCapitalGain = stockMutualData.reduce((sum, item) => sum + item.totalProfit, 0);
  const totalIncomeLand=(propertyData? propertyData.netTaxableIncome :0)+(rentPropertyData? rentPropertyData.netTaxableIncome:0)
  

// Calculate total gross profit from all data sources
const totalGrossProfit =
  (stockMutualData?.reduce((sum, item) => sum + (item.totalProfit > 0 ? item.totalProfit : 0), 0) || 0) +
  (foreignAssetsData?.totalProfit > 0 ? foreignAssetsData.totalProfit : 0) +
  (landFormData?.totalProfit > 0 ? landFormData.totalProfit : 0) +
  (stockRsuData?.totalProfit > 0 ? stockRsuData.totalProfit : 0) +
  (bondData?.totalProfit > 0 ? bondData.totalProfit : 0) +
  (Number(shortTermData?.shortOtherAmountDeemed) > 0 ? Number(shortTermData?.shortOtherAmountDeemed) : 0) +
  (Number(longTermData?.longOtherAmountDeemed) > 0 ? Number(longTermData?.longOtherAmountDeemed) : 0);

  // Calculate Gross Income as the sum of Other Income and Gross Profit
  // const grossIncome =totalIncomeOther + totalGrossProfit+totalIncomeLand+virtualAssestsData +totalIncomeProff;

  return (

    <>
       
      <div className="mx-auto">
      <div className="bg-white rounded-md shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-md">
              <svg
                className="w-5 h-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Income Source</h1>
          </div>
          <button className="text-blue-500 hover:text-blue-600">
            <Pencil className="w-5 h-5" />
          </button>
        </div>


{rentPropertyData || propertyData ?
(
        <div className="mb-4">
        <button
    onClick={() => togglePropertySection('landIncome')}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">House Property</span>
    <div className="flex items-center gap-4">
      
      {expandedLandsSections['landIncome'] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
  </button>
  {expandedLandsSections['landIncome'] && (
    <>
    <div>


     <div className='text-base font-bold text-black'>1
     Property 1</div>
            <div className="pl-4 space-y-3 mb-4">
             

{propertyData && propertyData.netTaxableIncome
 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Rent
   </span>
   <span className="text-gray-900">₹{ formatCurrency( propertyData.rentalIncomeDetails.annualRent)

}</span>
 </div>
)}
{propertyData && propertyData.netTaxableIncome
 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Less: Municipal Tax
   </span>
   <span className="text-gray-900">₹{propertyData.rentalIncomeDetails.taxPaid

}</span>
 </div>
)}
{propertyData && propertyData.rentalIncomeDetails.taxPaid
 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Net Annual Rent (Less 30% of ₹ {propertyData.rentalIncomeDetails.annualRent

}-{propertyData.rentalIncomeDetails.taxPaid

})
   </span>
   <span className="text-gray-900">₹{propertyData.rentalIncomeDetails.
standardDeduction


}</span>
 </div>
)}
{propertyData && propertyData.netTaxableIncome
 && (
   <div  className="flex justify-between items-center">
   <span className="font-bold text-black">
   Income from House Property 1
   </span>
   <span className="text-gray-900">₹{propertyData.netTaxableIncome}</span>
 </div>
)}


            </div>
            </div>
    <div>


     <div className='text-base font-bold text-black'>2
     Property 2</div>
            <div className="pl-4 space-y-3 mb-4">
             

{rentPropertyData && rentPropertyData.netTaxableIncome
 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Rent
   </span>
   <span className="text-gray-900">{ formatCurrency(rentPropertyData.rentalIncomeDetails.annualRent)

}</span>
 </div>
)}
{rentPropertyData && rentPropertyData.netTaxableIncome
 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Less: Municipal Tax
   </span>
   <span className="text-gray-900">{  formatCurrency(rentPropertyData.rentalIncomeDetails.taxPaid)

}</span>
 </div>
)}
{rentPropertyData && rentPropertyData.rentalIncomeDetails.taxPaid
 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Net Annual Rent (Less 30% of  {  formatCurrency(rentPropertyData.rentalIncomeDetails.annualRent
   )
}-{  formatCurrency(rentPropertyData.rentalIncomeDetails.taxPaid)

})
   </span>
   <span className="text-gray-900">{  formatCurrency( rentPropertyData.rentalIncomeDetails.
standardDeduction)


}</span>
 </div>
)}
{rentPropertyData && rentPropertyData.netTaxableIncome
 && (
   <div  className="flex justify-between items-center">
   <span className="font-bold text-black">
   Income from House Property 2
   </span>
   <span className="text-gray-900">{  formatCurrency( rentPropertyData.netTaxableIncome)}</span>
 </div>
)}


            </div>
            </div>
            <div  className="flex justify-between items-center">
   <span className="font-bold text-black">
   Total Income from House Property
   </span>
   <span className="text-gray-900">{ formatCurrency(totalIncomeLand)}</span>
 </div>
            </>
          )}

  </div>
  ):(
    <>
    </>
  )}

        {/* Other Income Section */}
        <div className="mb-4">
  <button
    onClick={() => toggleSection('otherIncome')}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Other Income</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">{totalIncomeOther.toLocaleString()}</span>
      {expandedSections['otherIncome'] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
  </button>

  {expandedSections['otherIncome'] && (
    <div className="pl-4 space-y-3 mb-4">
      {interestData.map((section) => {
        const sectionTotal = section.data.reduce((sum, item) => sum + (item.amount || 0), 0);
        return (
          <div key={section._id} className="flex justify-between items-center">
            <span className="text-gray-600">{section.type}</span>
            <span className="text-gray-900">₹{sectionTotal.toLocaleString()}</span>
          </div>
        );
      })}
      {dividendData && dividendData.totalAmount && (
        <>
         <div  className="flex justify-between items-center">
            <span className="text-gray-600">Dividend Data</span>
            <span className="text-gray-900">₹{dividendData.totalAmount}</span>
          </div></>
      )}
    </div>

    
  )}
</div>


        {/* Capital Gain Section */}
        <div className="border-t border-gray-100">
          <button
           onClick={() => toggleProfitSection('grossProfit')}
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Gross Profit</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">₹{totalGrossProfit.toLocaleString()}</span>
              {expandedProfitSections['grossProfit']? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </div>
          </button>

       
          
          {expandedProfitSections['grossProfit'] && (
            <div className="pl-4 space-y-3 mb-4">
               {stockMutualData.map((item,index) => (
              item.totalProfit > 0 && (
              <div  key={index} className="flex justify-between items-center">
                <span className="text-gray-600">
                {item.assetType}
                </span>
                <span className="text-gray-900">₹{item.totalProfit.toLocaleString()}</span>
              </div>
               )
          ))}

{foreignAssetsData && foreignAssetsData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   {foreignAssetsData.assetSubType || 'Unknown Asset'}
   </span>
   <span className="text-gray-900">₹{foreignAssetsData.totalProfit.toLocaleString()}</span>
 </div>
)}
{landFormData && landFormData.totalProfit > 0  && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Land Form
   </span>
   <span className="text-gray-900">₹{landFormData.totalProfit.toLocaleString()}</span>
 </div>
)}
{stockRsuData && stockRsuData.totalProfit > 0 &&  (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Stock Form
   </span>
   <span className="text-gray-900">₹{stockRsuData.totalProfit.toLocaleString()}</span>
 </div>
)}
{goldData && goldData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Gold Data
   </span>
   <span className="text-gray-900">₹{goldData.totalProfit.toLocaleString()}</span>
 </div>
)}
{bondData && bondData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Bond Data
   </span>
   <span className="text-gray-900">₹{bondData.totalProfit.toLocaleString()}</span>
 </div>
)}
{shortTermData && shortTermData.shortOtherAmountDeemed > 0 &&  (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Short Term
   </span>
   <span className="text-gray-900">₹{shortTermData.shortOtherAmountDeemed.toLocaleString()}</span>
 </div>
)}
{longTermData && longTermData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Long Term
   </span>
   <span className="text-gray-900">₹{longTermData.longOtherAmountDeemed.toLocaleString()}</span>
 </div>
)}

            </div>
          )}



{(profData || bussinessData) && (
  <button
  onClick={() => toggleProf('profSection')}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Business and Profession</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">₹{totalIncomeProff.toLocaleString()}</span>
      {expandedSections['profSection'] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
  </button>
)}
         
  
         {expandedProfSections['profSection'] && (
            <div className="pl-4 space-y-3 mb-4">
              {profData > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Proffesional income
   </span>
   <span className="text-gray-900">₹{profData.toLocaleString()}</span>
 </div>
)}
              {bussinessData > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Bussiness Income
   </span>
   <span className="text-gray-900">₹{bussinessData.toLocaleString()}</span>
 </div>
)}
              { profitLossData && profitLossData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
  Profit & Loss
   </span>
   <span className="text-gray-900">₹{profitLossData.
totalProfit.toLocaleString()
}</span>
 </div>
)}
              { profitLossData && profitLossData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
  Profit & Loss
   </span>
   <span className="text-gray-900">₹{profitLossData.
totalProfit.toLocaleString()
}</span>
 </div>
)}
           </div>

          )}
{virtualAssestsData &&(
<button
          
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Virtual Assest Profit</span>
            <div className="flex items-center gap-4 mr-9">
              <span className="text-gray-900">₹{virtualAssestsData.toLocaleString()}</span>
            
            </div>
          </button>
          )}


        </div>

        {form16Data &&(
<button
         onClick={() => toggleForm16('form16Section')}   
            className="w-full flex items-center justify-between py-2"
          >
            <span className="text-indigo-600 font-medium">Salary Income</span>
            <div className="flex items-center gap-4">
              <span className="text-gray-900">₹{form16Data.balance-50000 -(form16Data.incomeClaimed
?form16Data.incomeClaimed
:0) -(form16Data.excemptAllowanceV ?form16Data.excemptAllowanceV :0) }</span>
              {expandedForm16Sections['form16Section'] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
            </div>
          </button>
          )}
{expandedForm16Sections['form16Section']&& (
            <div className="pl-4 space-y-3 mb-4">
              {form16Data && (
                <>
             
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Gross Salary
   </span>
   <span className="text-gray-900">₹{form16Data.balance}</span>
 </div>
 
 {form16Data.incomeClaimed&& (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Less: Income claimed for relief u/s 89A
   </span>
   <span className="text-gray-900">₹{form16Data.incomeClaimed}</span>
 </div>
 ) }
 {form16Data.incomeClaimed&& (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Net Salary
   </span>
   <span className="text-gray-900">₹{form16Data.balance-form16Data.incomeClaimed}</span>
 </div>
 ) }
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Standard Deduction
   </span>
   <span className="text-gray-900">₹50000</span>
 </div>
 </>
)}
  
           </div>

          )}

        {/* Gross Total Income */}
        <div className="mt-4 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">
              Gross Total Income
            </span>
            <span className="font-semibold text-gray-900">₹{grossIncome?grossIncome:0}</span>
          </div>
        </div>
     
      </div>
    </div></>
  );
};

export default IncomeSourceComponent;
