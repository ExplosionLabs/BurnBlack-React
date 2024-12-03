import React, { useEffect } from "react";
const RentalIncomeDetails: React.FC<{
  data: any;
  onChange: (data: any) => void;
}> = ({ data, onChange }) => {
 
  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };
  useEffect(() => {
    const standardDeduction =
      0.3 * (data.annualRent || 0)- (data.taxPaid || 0);
    handleChange("standardDeduction", standardDeduction);
  }, [data.annualRent, data.taxPaid]);
  useEffect(() => {
    const netIncome =
     (data.annualRent || 0)- (data.taxPaid || 0) - (data.standardDeduction|| 0);
    handleChange("netIncome",netIncome );
  }, [data.annualRent, data.taxPaid,data.standardDeduction]);
  return (
    <>
    <div>
    <div>
        <label htmlFor="annualRent">
          A. Home Loan Interest Paid During Construction:
        </label>
        <input
          type="number"
          id="annualRent"
          value={data.annualRent || ""}
          onChange={(e) =>
            handleChange("annualRent", Number(e.target.value))
          }
          placeholder="Enter interest paid during construction"
        />
      </div>

      {/* Home loan interest paid after construction */}
      <div>
        <label htmlFor="taxPaid">
          B. Home Loan Interest Paid After Construction Completion:
        </label>
        <input
          type="number"
          id="taxPaid"
          value={data.taxPaid || ""}
          onChange={(e) =>
            handleChange("taxPaid", Number(e.target.value))
          }
          placeholder="Enter interest paid after completion"
        />
      </div>

      {/* Total Deduction */}
      <div>
        <label htmlFor="standardDeduction">C. Standard Deduction u/s 24a(30% of (A - B)):</label>
        <input
          type="number"
          id="standardDeduction"
          value={data.standardDeduction || ""}
          readOnly
          placeholder="0"
          disabled
        />
      </div>
      <div>
        <label htmlFor="netIncome">Net Income (A - B - C)

</label>
        <input
          type="number"
          id="netIncome"
          value={data.netIncome || ""}
          readOnly
          placeholder="0"
          disabled
        />
      </div>
    </div>
    </>
  )
};

export default RentalIncomeDetails;
