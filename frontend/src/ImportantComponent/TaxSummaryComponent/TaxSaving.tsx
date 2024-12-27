import { fetchContriPartyData, fetchLoanData, fetchMedical80D, fetchOtherDeductionData, fetchRuralDonationData, fetchTaxDonation80GData, fetchTaxInvestData } from '@/api/taxSaving';
import { ChevronDown, ChevronUp, Pencil, Sun } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const TaxSaving = () => {
  const [savingInvest, setSavingInvest] = useState(null);
  const [totalSum, setTotalSum] = useState(0);
  const [donationCharitySum,setDonationCharitySum]=useState(0);
  const [contriParty,setContriParty]=useState(0);
const [donationRurual,setDonationRurual]=useState(0);
const [totalDonation, setTotalDonation] = useState(0);
const [medical80d,setMedical80d] = useState(0);
const [totalLoans,setTotalLoans]=useState(0);
const [otherDeduction,setOtherDeduction]=useState(0);
const [isExpanded, setIsExpanded] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token is missing from localStorage");
        }

        const savingInvestResponse = await fetchTaxInvestData(token);
        const donationResponse=await fetchTaxDonation80GData(token);
        const contriPartyResponse=await fetchContriPartyData(token);
        const donationRurualResponse=await fetchRuralDonationData(token);
        const medicalRespone80d=await fetchMedical80D(token);
        const loansReponse=await fetchLoanData(token);
        const otherDeductionResponse=await fetchOtherDeductionData(token);
        if (savingInvestResponse) {
        
          setSavingInvest(savingInvestResponse);

          // Calculate the total sum
          const { section80C, savingsInterest80TTA, pensionContribution80CCC, npsEmployeeContribution, npsEmployerContribution } = savingInvestResponse;
          const sum = section80C + savingsInterest80TTA + pensionContribution80CCC + npsEmployeeContribution + npsEmployerContribution;
          setTotalSum(sum);
        }
        if(donationResponse){
      
const {cashAmount,nonCashAmount}=donationResponse;
const sum=cashAmount+nonCashAmount;
setDonationCharitySum(sum);
        }
        if(contriPartyResponse){
const {cashAmount,nonCashAmount}=contriPartyResponse;
const sum=cashAmount+nonCashAmount;
setContriParty(sum);
        }
        if(donationRurualResponse){
const {cashAmount,nonCashAmount}=donationRurualResponse;
const sum=cashAmount+nonCashAmount;
setDonationRurual(sum);
        }
        if(medicalRespone80d){
          const { selfAndFamily, parents } = medicalRespone80d;
          const totalSelf = 
            (Number(selfAndFamily.premium) || 0) +
            (Number(selfAndFamily.healthCheckup) || 0) +
            (Number(selfAndFamily.medicalExpenditure) || 0);

          const totalParents = 
            (Number(parents.premium) || 0) +
            (Number(parents.healthCheckup) || 0) +
            (Number(parents.medicalExpenditure) || 0);

          const total = totalSelf + totalParents;
          setMedical80d(total);
        }

        if(loansReponse){
          const {eduLoans,homeLoans1617,homeLoans1922    ,electricVehicle        }=loansReponse;
          const sum=eduLoans+homeLoans1617+homeLoans1922+electricVehicle;
          setTotalLoans(sum);
        }
        if(otherDeductionResponse){
          const {copyRightFee,patentIncome,bioWasteIncome,agniPathContri,rentPerMonth,noOFMonth}=otherDeductionResponse;
          const sum=copyRightFee+patentIncome+bioWasteIncome+agniPathContri+(rentPerMonth*noOFMonth);
          setOtherDeduction(sum);
        }
      } catch (err:any) {
        console.error("Error fetching data:", err.message);
      }
    };


    fetchData();
  }, []);


  useEffect(() => {
    
    const total = donationCharitySum + contriParty + donationRurual;
    setTotalDonation(total);
  }, [donationCharitySum, contriParty, donationRurual]);
  const totalDeduction = totalSum + totalDonation + medical80d + totalLoans + otherDeduction;
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
            <h1 className="text-xl font-semibold text-gray-900">Tax Saving</h1>
          </div>
          <button className="text-blue-500 hover:text-blue-600">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        {/* <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Tax Deduction</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">₹{totalDeduction.toLocaleString()}</span>
      {isExpanded ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </div>
  </button>
  
        {isExpanded && (
          <>
      
        {totalSum > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Saving</span>
            <span className="text-gray-900">₹{totalSum}</span>
          </div>
        )}
  
        {totalDonation > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Donation</span>
            <span className="text-gray-900">₹{totalDonation}</span>
          </div>
        )}
  
        {medical80d > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Medical Expense</span>
            <span className="text-gray-900">₹{medical80d}</span>
          </div>
        )}
  
        {totalLoans > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Loans</span>
            <span className="text-gray-900">₹{totalLoans}</span>
          </div>
        )}
  
        {otherDeduction > 0 && (
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Other Deduction</span>
            <span className="text-gray-900">₹{otherDeduction}</span>
          </div>
        )}
                  </>
        )} */}
  <button
    onClick={() => setIsExpanded(!isExpanded)}
    className="w-full flex items-center justify-between py-2"
  >
    <span className="text-indigo-600 font-medium">Tax Deduction</span>
    <div className="flex items-center gap-4">
      <span className="text-gray-900">0</span>
     
    </div>
  </button>
      </div>
    </div>
  </>
  
  );
};

export default TaxSaving;
