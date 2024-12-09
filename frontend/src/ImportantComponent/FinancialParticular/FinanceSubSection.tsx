import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { RootState } from "@/stores/store";
import { useSelector } from "react-redux";
import _ from "lodash";
const FinanceSubSection: React.FC = () => {
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);

  const [formData, setFormData] = useState({
    unsettledPayables: "",
    outstandingPrincipalSecured: "",
    outstandingPrincipalUnsecured: "",
    advances: "",
    amountsReceivedInAdvance: "",
    capitalInvestment: "",
    otherLiabilities: "",
    uncollectedReceivables: "",
    totalInventoryValue: "",
    fixedAssets: "",
    closingBalanceWithBanks: "",
    loandAdvance:"",
    otherAssets: "",
  });

  useEffect(() => {
    const fetchFinanceData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getFinanceParticularData`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = response.data.data;
        setFormData({
          ...formData,
          ...data,
        });
      } catch (error) {
        console.error("Error fetching finance data:", error);
      }
    };

    if (isUserLoggedIn) {
      fetchFinanceData();
    }
  }, [isUserLoggedIn]);

  const debouncedSaveData = useCallback(
    _.debounce(async (updatedData) => {
      const token = localStorage.getItem("token");
      try {
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addFinanceParticularData`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } catch (err) {
        console.error("Error saving finance data:", err);
      }
    }, 300), // 300ms debounce
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedFormData);

    debouncedSaveData(updatedFormData); // Debounced autosave
  };

  return (
    <div>
      <h1>Finance Sub-Section</h1>
      <form>
        <h2>Add details of Liabilities</h2>

        <label>Unsettled Payables</label>
        <input
          type="number"
          name="unsettledPayables"
          value={formData.unsettledPayables}
          onChange={handleChange}
        />

        <label>Outstanding Principal - Secured Loans</label>
        <input
          type="number"
          name="outstandingPrincipalSecured"
          value={formData.outstandingPrincipalSecured}
          onChange={handleChange}
        />

        <label>Outstanding Principal - Unsecured Loans</label>
        <input
          type="number"
          name="outstandingPrincipalUnsecured"
          value={formData.outstandingPrincipalUnsecured}
          onChange={handleChange}
        />

        <label>Advances</label>
        <input
          type="number"
          name="advances"
          value={formData.advances}
          onChange={handleChange}
        />

        <label>Amounts Received in Advance</label>
        <input
          type="number"
          name="amountsReceivedInAdvance"
          value={formData.amountsReceivedInAdvance}
          onChange={handleChange}
        />

        <label>Capital Investment</label>
        <input
          type="number"
          name="capitalInvestment"
          value={formData.capitalInvestment}
          onChange={handleChange}
        />

        <label>Other Liabilities</label>
        <input
          type="number"
          name="otherLiabilities"
          value={formData.otherLiabilities}
          onChange={handleChange}
        />

        <h2>Add details of Assets</h2>

        <label>Uncollected Receivables</label>
        <input
          type="number"
          name="uncollectedReceivables"
          value={formData.uncollectedReceivables}
          onChange={handleChange}
        />

        <label>Total Inventory Value</label>
        <input
          type="number"
          name="totalInventoryValue"
          value={formData.totalInventoryValue}
          onChange={handleChange}
        />

        <label>Fixed Assets</label>
        <input
          type="number"
          name="fixedAssets"
          value={formData.fixedAssets}
          onChange={handleChange}
        />

        <label>Closing Balance With Banks</label>
        <input
          type="number"
          name="closingBalanceWithBanks"
          value={formData.closingBalanceWithBanks}
          onChange={handleChange}
        />

        <label>Loans And Advances</label>
        <input
          type="number"
          name="loandAdvance"
          value={formData.loandAdvance}
          onChange={handleChange}
        />

        <label>Other Assets</label>
        <input
          type="number"
          name="otherAssets"
          value={formData.otherAssets}
          onChange={handleChange}
        />
      </form>
    </div>
  );
};

export default FinanceSubSection;
