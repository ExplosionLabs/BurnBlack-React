import { useState, useEffect } from 'react';
import { fetchIncomeCal } from './calculateIncome';

export function useTaxData() {
  const [grossIncome, setGrossIncome] = useState(null);
  const [taxableIncome, setTaxableIncome] = useState(null);
  const [taxLiability, setTaxLiability] = useState(null);
  const [taxPaid, setTaxPaid] = useState(null);
  const [taxDue, setTaxDue] = useState(null);
  const [incomeTaxAtNormalRates,setIncomeTaxAtNormalRates]=useState("");
  const [healthAndEducationCess,setHealthAndEducationCess]=useState("");
  const [totalTaxI,setTotalTaxI]=useState("");
 const [itrType,setITRType]=useState("");
 const [totalDeduction,setTotalDeduction]=useState("");
  useEffect(() => {
    const fetchGrossIncome = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          return;
        }
        const response = await fetchIncomeCal(token);
        const data = await response;
        if (data) {
          setGrossIncome(data.grossIncome);
          setTaxableIncome(data.taxableIncome);
          setTaxLiability(data.taxLiability);
          setTaxPaid(data.taxPaid);
          setTaxDue(data.taxDue);
          setIncomeTaxAtNormalRates(data.incomeTaxAtNormalRates);
          setHealthAndEducationCess(data.healthAndEducationCess);
          setTotalTaxI(data.totalTaxI);
          setITRType(data.itrType);
          setTotalDeduction(data.totalDeductions);
        }
      } catch (error) {
        console.error('Error fetching gross income:', error);
      }
    };

    fetchGrossIncome();
  }, []);

  return { grossIncome, taxableIncome, taxLiability, taxPaid, taxDue ,incomeTaxAtNormalRates,healthAndEducationCess,totalTaxI,itrType,totalDeduction};
}
