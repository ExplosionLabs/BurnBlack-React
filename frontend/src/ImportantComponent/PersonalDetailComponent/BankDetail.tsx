import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import axios from "axios";

type BankDetail = {
  accountNo: string;
  ifscCode: string;
  bankName: string;
  type: string;
};

const BankDetails: React.FC = () => {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([
    { accountNo: "", ifscCode: "", bankName: "", type: "" },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bank details from the backend
  useEffect(() => {
    const fetchBankDetails = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getBankDetails`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBankDetails(response.data.data.bankDetails || []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load bank details.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchBankDetails();
  }, []);

  // Debounced function to save data to the database
  const autoSave = debounce(async (details: BankDetail[]) => {
    const token = localStorage.getItem("token");
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateBankDetails`,
        { bankDetails: details },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Bank details saved successfully:", details);
    } catch (error) {
      console.error("Error saving bank details:", error);
    }
  }, 300);

  // Handle input change
  const handleChange = (index: number, field: keyof BankDetail, value: string) => {
    const updatedDetails = [...bankDetails];
    updatedDetails[index][field] = value;
    setBankDetails(updatedDetails);
    autoSave(updatedDetails); // Trigger debounce save
  };

  // Add a new account
  const addAccount = () => {
    setBankDetails([...bankDetails, { accountNo: "", ifscCode: "", bankName: "", type: "" }]);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2 className="text-3xl font-bold">Bank Details</h2>
      {bankDetails.map((detail, index) => (
        <div key={index} style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "10px" }}>
          <label>
            Account No:
            <input
              type="text"
              value={detail.accountNo}
              onChange={(e) => handleChange(index, "accountNo", e.target.value)}
              required
            />
          </label>
          <label>
            IFSC Code:
            <input
              type="text"
              value={detail.ifscCode}
              onChange={(e) => handleChange(index, "ifscCode", e.target.value)}
              required
            />
          </label>
          <label>
            Bank Name:
            <input
              type="text"
              value={detail.bankName}
              onChange={(e) => handleChange(index, "bankName", e.target.value)}
              required
            />
          </label>
          <label>
            Type:
            <select
              value={detail.type}
              onChange={(e) => handleChange(index, "type", e.target.value)}
            >
              <option value="">Select Type</option>
              <option value="CASH CREDIT">CASH CREDIT</option>
              <option value="CURRENT">CURRENT</option>
              <option value="SAVINGS">SAVINGS</option>
              <option value="OVER DRAFT">OVER DRAFT</option>
              <option value="NON RESIDENT">NON RESIDENT</option>
              <option value="OTHER">OTHER</option>
            </select>
          </label>
        </div>
      ))}
      <button type="button" onClick={addAccount}>
        Add Another Account
      </button>
    </div>
  );
};

export default BankDetails;
