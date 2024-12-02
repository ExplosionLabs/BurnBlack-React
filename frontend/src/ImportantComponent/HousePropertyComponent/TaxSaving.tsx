import React, { useEffect } from "react";

interface TaxSavingsDetailsProps {
  data: {
    constructionYear: string;
    interestDuringConstruction: number;
    interestAfterCompletion: number;
    totalDeduction: number;
  };
  onChange: (updatedData: any) => void;
}

const TaxSavingsDetails: React.FC<TaxSavingsDetailsProps> = ({ data, onChange }) => {
  const years = [
    "2022 - 2023",
    "2021 - 2022",
    "2020 - 2021",
    "2019 - 2020",
    "2018 - 2019",
  ];

  const handleChange = (field: string, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Auto-calculate Total Deduction when relevant fields change
  useEffect(() => {
    const totalDeduction =
      0.2 * (data.interestDuringConstruction || 0) + (data.interestAfterCompletion || 0);
    handleChange("totalDeduction", totalDeduction);
  }, [data.interestDuringConstruction, data.interestAfterCompletion]);

  return (
    <div>
      <h3>Tax Savings for Home Loan (Interest Paid Details)</h3>

      {/* Dropdown for year selection */}
      <div>
        <label htmlFor="construction-year">
          Year previous to completion of construction:
        </label>
        <select
          id="construction-year"
          value={data.constructionYear}
          onChange={(e) => handleChange("constructionYear", e.target.value)}
        >
          <option value="">Select Year</option>
          {years.map((year, index) => (
            <option key={index} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* Home loan interest paid during construction */}
      <div>
        <label htmlFor="interest-during-construction">
          A. Home Loan Interest Paid During Construction:
        </label>
        <input
          type="number"
          id="interest-during-construction"
          value={data.interestDuringConstruction || ""}
          onChange={(e) =>
            handleChange("interestDuringConstruction", Number(e.target.value))
          }
          placeholder="Enter interest paid during construction"
        />
      </div>

      {/* Home loan interest paid after construction */}
      <div>
        <label htmlFor="interest-after-completion">
          B. Home Loan Interest Paid After Construction Completion:
        </label>
        <input
          type="number"
          id="interest-after-completion"
          value={data.interestAfterCompletion || ""}
          onChange={(e) =>
            handleChange("interestAfterCompletion", Number(e.target.value))
          }
          placeholder="Enter interest paid after completion"
        />
      </div>

      {/* Total Deduction */}
      <div>
        <label htmlFor="total-deduction">C. Total Deduction (20% of A + B):</label>
        <input
          type="number"
          id="total-deduction"
          value={data.totalDeduction || ""}
          readOnly
          placeholder="Auto-calculated"
        />
      </div>
    </div>
  );
};

export default TaxSavingsDetails;
