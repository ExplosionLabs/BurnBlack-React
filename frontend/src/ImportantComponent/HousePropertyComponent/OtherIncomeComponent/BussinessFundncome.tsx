import { fetchBussinessFundData } from "@/api/incomeSoucre";
import axios from "axios";
import React, { useEffect, useState } from "react";

const BussinessFundIncome = () => {
  const [selectedSection, setSelectedSection] = useState("House Property");
  const [formData,setFormData]=useState(null);
  const [formValues, setFormValues] = useState({
    section: selectedSection,
    entityType: "",
    entityName: "",
    entityPAN: "",
    incomeShare: "",
    lossShare: "",
    tdsAmount: "",
    incomeNature: "",
    receiptPeriod: "",
    descriptionCode: "",
  });

  // Handle input changes
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  // Handle section change
  const handleSectionChange = (section: string) => {
    setSelectedSection(section);
    setFormValues((prevValues) => ({
      ...prevValues,
      section: section,  // Update the section field in formValues
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
  
        const data = await fetchBussinessFundData(token, selectedSection);
  
        console.log("data", data);
  
        if (data && Object.keys(data).length > 0) {
          // Check if data is not null or empty
          setFormData(data);
          setFormValues(data);
        } else {
          // Reset form values if data is null or empty
          setFormData(null);
          setFormValues({
            section: selectedSection,
            entityType: "",
            entityName: "",
            entityPAN: "",
            incomeShare: "",
            lossShare: "",
            tdsAmount: "",
            incomeNature: "",
            receiptPeriod: "",
            descriptionCode: "",
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Reset form values in case of an error
        setFormValues({
          section: selectedSection,
          entityType: "",
          entityName: "",
          entityPAN: "",
          incomeShare: "",
          lossShare: "",
          tdsAmount: "",
          incomeNature: "",
          receiptPeriod: "",
          descriptionCode: "",
        });
      }
    };
  
    fetchData();
  }, [selectedSection]);
  
  // Handle form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    
    // Create FormData object
    const url = formData? `${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updatebussinessFund`:`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addbussinessFund`;
    // Use Axios to send the formData to the API
    const response = await axios
      .post(url, formValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Form submitted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error submitting form:", error.response || error.message);
      });
  };

  const renderFormFields = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Select the Entity Type</label>
        <select
          name="entityType"
          value={formValues.entityType}
          onChange={handleInputChange}
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select</option>
          <option value="115UA- Business Trust">115UA- Business Trust</option>
          <option value="115UB- Investment Fund">115UB- Investment Fund</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Name of the Entity</label>
        <input
          type="text"
          name="entityName"
          value={formValues.entityName}
          onChange={handleInputChange}
          placeholder="Enter name"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">PAN of the Entity</label>
        <input
          type="text"
          name="entityPAN"
          value={formValues.entityPAN}
          onChange={handleInputChange}
          placeholder="Enter PAN"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Current Year Share of Income</label>
        <input
          type="number"
          name="incomeShare"
          value={formValues.incomeShare}
          onChange={handleInputChange}
          placeholder="Enter share of income"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Current Year Share of Loss</label>
        <input
          type="number"
          name="lossShare"
          value={formValues.lossShare}
          onChange={handleInputChange}
          placeholder="Enter share of loss"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Amount of TDS</label>
        <input
          type="number"
          name="tdsAmount"
          value={formValues.tdsAmount}
          onChange={handleInputChange}
          placeholder="Enter TDS amount"
          className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      {["Other Sources", "Capital Gains"].includes(selectedSection) && (
        <>
          <div>
            <label className="block text-sm font-medium">Nature of Income</label>
            <select
              name="incomeNature"
              value={formValues.incomeNature}
              onChange={handleInputChange}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select Option</option>
              <option value="OtherSourceDividendIncome">OS- Dividend Income</option>
              <option value="OtherSourceInterestIncome">OS- Interest Income</option>
              <option value="Source_5ACA1a">PTI- 115ACA(1)(a)- Income from GDR purchased in foreign currency- resident</option>
              <option value="Source_5BBF">PTI- 115BBF Tax on Income from Patent</option>
              <option value="Source_5BBD">PTI-115BBD- Tax on dividend received by an Indian company from specified foreign company</option>
              <option value="Source_5A1aiiac">PTI- 115A(1)(a)(iiac)- Interest as per sec 194LBA</option>
              <option value="Source_5AD1i">PTI-115AD(1)(i) -Income (other than dividend) received by an FII in respect of securities (other than units as per Sec 115AB)</option>
              <option value="Source_5AD1iP">PTI- 115AD(1)(i)- Income received by FII in respect of Bond or government securities as per sec 194LD</option>
              <option value="Source_5BBG">PTI- 115BBG- Tax on income from transfer of carbon credits</option>
              <option value="Source_FA">PTI_FA : PTI-Para E II of Part I of Ist Sch of FA - Income from royalty or technical services - Non-domestic company</option>
            </select>
          </div>
          {selectedSection === "Capital Gains" && (
            <div>
              <label className="block text-sm font-medium">Period of Receipt</label>
              <select
                name="receiptPeriod"
                value={formValues.receiptPeriod}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select Option</option>
                <option value="AprilToMidJune">April to mid June</option>
                <option value="MidJuneToMidSept">Mid June to mid September</option>
                <option value="MidSeptToMidDec">Mid September to mid December</option>
                <option value="MidDecToMidMarch">Mid December to Mid March</option>
                <option value="MidMarchOnwards">Mid March onwards</option>
              </select>
            </div>
          )}
        </>
      )}
      {selectedSection === "Exempt Income" && (
        <div>
          <label className="block text-sm font-medium">Description Code</label>
          <input
            type="text"
            name="descriptionCode"
            value={formValues.descriptionCode}
            onChange={handleInputChange}
            placeholder="Enter description code"
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto p-6 bg-white border rounded-lg shadow-md"
    >
      <div className="flex border-b">
        {["House Property", "Other Sources", "Capital Gains", "Exempt Income"].map((section) => (
          <button
            key={section}
            type="button"
            onClick={() => handleSectionChange(section)}  // Use the updated handler
            className={`flex-1 py-2 px-4 text-sm font-semibold text-center ${
              selectedSection === section
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            {section.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="mt-6">{renderFormFields()}</div>
      <div className="flex justify-end space-x-4 mt-6">
        <button
          type="button"
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default BussinessFundIncome;
