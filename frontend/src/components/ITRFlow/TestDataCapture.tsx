import React from 'react';
import { useITRFlow } from '../../contexts/ITRFlowContext';

// Test component to verify data capture in development
const TestDataCapture: React.FC = () => {
  const { data, getTotalIncome, getTotalDeductions } = useITRFlow();

  const generateTestJSON = () => {
    const testJson = {
      TestResults: {
        PersonalDetailsCapture: {
          Name: data.personalDetails.name || 'NOT_CAPTURED',
          PAN: data.personalDetails.pan || 'NOT_CAPTURED',
          Aadhaar: data.personalDetails.aadhaar || 'NOT_CAPTURED',
          Email: data.personalDetails.email || 'NOT_CAPTURED',
          Mobile: data.personalDetails.mobile || 'NOT_CAPTURED',
          Address: data.personalDetails.address || 'NOT_CAPTURED'
        },
        IncomeCapture: {
          TotalIncome: getTotalIncome(),
          SalaryIncome: data.incomeDetails.salary || 'NOT_CAPTURED',
          InterestIncome: data.incomeDetails.interest || 'NOT_CAPTURED',
          DividendIncome: data.incomeDetails.dividend || 'NOT_CAPTURED',
          CapitalGains: data.incomeDetails.capitalGains || 'NOT_CAPTURED',
          HouseProperty: data.incomeDetails.houseProperty || 'NOT_CAPTURED',
          BusinessIncome: data.incomeDetails.business || 'NOT_CAPTURED',
          ProfessionalIncome: data.incomeDetails.professional || 'NOT_CAPTURED',
          OtherIncome: data.incomeDetails.otherIncome || 'NOT_CAPTURED'
        },
        DeductionCapture: {
          TotalDeductions: getTotalDeductions(),
          Section80C: data.deductionDetails.section80C || 'NOT_CAPTURED',
          Section80D: data.deductionDetails.section80D || 'NOT_CAPTURED',
          Section80E: data.deductionDetails.section80E || 'NOT_CAPTURED',
          Section80G: data.deductionDetails.section80G || 'NOT_CAPTURED',
          AllDeductions: data.deductionDetails || 'NOT_CAPTURED'
        },
        TaxCalculationCapture: {
          GrossTotalIncome: data.taxCalculation.grossTotalIncome || 'NOT_CAPTURED',
          TaxableIncome: data.taxCalculation.taxableIncome || 'NOT_CAPTURED',
          TaxLiability: data.taxCalculation.taxLiability || 'NOT_CAPTURED',
          RefundOrDemand: data.taxCalculation.refundOrDemand || 'NOT_CAPTURED',
          Regime: data.taxCalculation.regime || 'NOT_CAPTURED'
        },
        GeneralCapture: {
          ITRType: data.itrType || 'NOT_CAPTURED',
          AssessmentYear: data.assessmentYear || 'NOT_CAPTURED',
          CompletedSteps: data.completedSteps || [],
          CurrentStep: data.currentStep || 'NOT_CAPTURED'
        }
      }
    };

    console.log('=== ITR DATA CAPTURE TEST ===');
    console.log(JSON.stringify(testJson, null, 2));

    // Download test JSON
    const blob = new Blob([JSON.stringify(testJson, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ITR_Test_Capture_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Only show in development mode
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <button
        onClick={generateTestJSON}
        className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 text-sm"
        title="Download test JSON to verify data capture"
      >
        🧪 Test JSON Download
      </button>
    </div>
  );
};

export default TestDataCapture;