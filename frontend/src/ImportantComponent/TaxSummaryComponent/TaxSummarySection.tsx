import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IndianRupee } from 'lucide-react'
import { fetchIncomeCal } from '@/api/calculateIncome';

const TaxSummarySection = () => {
  const [grossIncome, setGrossIncome] = useState("");
  const [taxableIncome, setTaxableIncome] = useState("");
  const [taxLiability, setTaxLiability] = useState("");
  const [taxPaid, setTaxPaid] = useState("");
  const [taxDue, setTaxDue] = useState("");

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
        setTaxableIncome(data.taxableIncome);
        setTaxLiability(data.taxLiability);
        setTaxPaid(data.taxPaid)
        setTaxDue(data.taxDue)
      }
      } catch (error) {
        console.error('Error fetching gross income:', error);
      }
    };

    fetchGrossIncome();
  }, []);

  const formatCurrency = (amount: string | number) => {
    if (!amount) return '₹ 0';
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹ ${num.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full bg-white rounded-lg p-6 border">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
          <IndianRupee className="w-4 h-4 text-blue-600" />
        </div>
        <h2 className="text-[#1f2937]">Your Tax Summary</h2>
      </div>

      {grossIncome ? (
        <>
          <div className="grid grid-cols-5 gap-x-4 mb-6">
            <div>
              <p className="text-gray-500 mb-1">Gross Income</p>
              <p className="text-[#1f2937]">{formatCurrency(grossIncome)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Taxable Income</p>
              <p className="text-[#1f2937]">{formatCurrency(taxableIncome)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Tax Liability</p>
              <p className="text-[#1f2937]">{formatCurrency(taxLiability)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Taxes Paid</p>
              <p className="text-[#1f2937]">{formatCurrency(taxPaid)}</p>
            </div>
            <div>
              <p className="text-gray-500 mb-1">Tax Due</p>
              <p className="text-[#1f2937]">{formatCurrency(taxDue)}</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              See Full Tax Break-up
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button> */}

            <div className="bg-blue-50 p-4 rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600" viewBox="0 0 24 24" fill="none">
                  <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-600">You have selected New Regime</span>
              </div>
              {/* <button className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
                Compare Regimes
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button> */}
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-4">
          <p className="text-gray-500">Gross Income: ₹0</p>
        </div>
      )}
    </div>
  )
}

export default TaxSummarySection

