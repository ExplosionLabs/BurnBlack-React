import React, { ReactNode, useEffect, useState } from 'react';
import { fetchAllInterestData, fetchBondData, fetchDividendData, fetchForeignAssetsData, fetchGoldData, fetchLandFormData, fetchLongShortData, fetchStockMututalData, fetchStockRsuData } from '@/api/incomeSoucre';
import { ChevronDown, ChevronUp, Pencil } from 'lucide-react'
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
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [expandedProfitSections, setExpandedProfitSections] = useState<Record<string, boolean>>({});

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

  const totalIncome = interestData.reduce(
    (sum, section) =>
      sum + section.data.reduce((sectionSum, item) => sectionSum + (item.amount || 0), 0),
    0
  );

  const totalIncomeOther = totalIncome + (dividendData?.totalAmount || 0);

  const totalCapitalGain = stockMutualData.reduce((sum, item) => sum + item.totalProfit, 0);

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
  const grossIncome =totalIncomeOther + totalGrossProfit;

  return (

    <>
       
      <div className="mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
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

        {/* Other Income Section */}
        <div className="mb-4">
  <button
    onClick={() => toggleSection('otherIncome')}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Other Income</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">₹{totalIncomeOther.toLocaleString()}</span>
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
   <span className="text-gray-900">₹{shortTermData.shortOtherAmountDeemed}</span>
 </div>
)}
{longTermData && longTermData.totalProfit > 0 && (
   <div  className="flex justify-between items-center">
   <span className="text-gray-600">
   Long Term
   </span>
   <span className="text-gray-900">₹{longTermData.longOtherAmountDeemed}</span>
 </div>
)}

            </div>
          )}

          
        </div>

        {/* Gross Total Income */}
        <div className="mt-4 bg-gray-50 -mx-6 -mb-6 p-4 rounded-b-lg">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-900">
              Gross Total Income
            </span>
            <span className="font-semibold text-gray-900">₹{grossIncome.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div></>
  );
};

export default IncomeSourceComponent;
