// Import necessary modules
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';
import { ArrowLeft, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { fetchForm16 } from '@/api/calculateIncome';
import { Link } from 'react-router-dom';
const  Form16Manually = () => {
  const [formData, setFormData] = useState({
    employerName: '',
    employerTAN: '',
    employerCategory: 'Private',
    totalTax: '',
    grossSalary: '',
    salaryBreakup: [
        { type: 'Basic Pay', amount: '' },
        { type: 'House Rent Allowance', amount: '' },
        { type: 'LTA Allowance', amount: '' },
      ],
      perquisitesAmount:"",
    perquisites: [{ description: '', amount: '' }],
    profitAmount:"",
    profitsInLieu: [{ description: '', amount: '' }],
    notifiedIncome:'',
    notifiedCountry: [{ description: '', amount: '' }],
    notifiedIncomeOtherCountry:"",
    previousYearIncomeTax:"",
    exemptAllowance:"",
    exemptAllowancereakup: [
      { type: 'House Rent Exemption', amount: '' },
      { type: 'LTA Exemption', amount: '' },
    ],
    standardDeduction:"",
    professionalTax:"",
    reliefUnder89:"",
    incomeClaimed:"",
     balance: '',
     pincode: "",
    addressLine: "",
    country: "",
    state: "",
    city: "",

  });
  const [isBreakupOpen, setIsBreakupOpen] = useState(true)
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn)
  const [saving, setSaving] = useState(false);

  // Debounce function
  const useDebounce = (value: unknown, delay: number) => {
    const [debouncedValue, setDebouncedValue] = useState(value);
  
    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
  
      return () => clearTimeout(handler);
    }, [value, delay]);
  
    return debouncedValue;
  };

  const debouncedFormData = useDebounce(formData, 500);

  useEffect(() => {
    if (saving) {
      saveForm();
    }
  }, [debouncedFormData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>,
    field: string,
    index?: number,
    section?: keyof typeof formData
  ) => {
    if (section && Array.isArray(formData[section])) {
      const updatedSection = formData[section].map((item, i) =>
        i === index ? { ...item, [field]: e.target.value } : item
      ) as typeof formData[typeof section]; // Type assertion
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
    setSaving(true);
  };
  

  const saveForm = async () => {
    try {
        const token = localStorage.getItem("token")
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/updateForm16`, formData,
        {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      setSaving(false);
    } catch (error) {
      console.error('Error saving form', error);
    }
  };
  const calculateBalance = () => {
    const {
      grossSalary,
      perquisitesAmount,
      profitAmount,
      notifiedIncome,
      notifiedIncomeOtherCountry,
    } = formData;

    const parseOrZero = (value: string) => (isNaN(parseFloat(value)) ? 0 : parseFloat(value));

    return (
      parseOrZero(grossSalary) +
      parseOrZero(perquisitesAmount) +
      parseOrZero(profitAmount) +
      parseOrZero(notifiedIncome) +
      parseOrZero(notifiedIncomeOtherCountry)
    ).toFixed(2); // Ensure two decimal places
  };
  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      balance: calculateBalance(),
    }));
  }, [
    formData.grossSalary,
    formData.perquisitesAmount,
    formData.profitAmount,
    formData.notifiedIncome,
    formData.notifiedIncomeOtherCountry,
  ]);
  useEffect(() => {
    const fetchDetail = async () => {
      const token = localStorage.getItem("token");
      if(!token){
        return ;
      }
      try {
        const response = await fetchForm16(token);
      if(response){
        setFormData(response)

      }
      } catch (error) {
        console.error("Error fetching personal details:", error)
      }
    }

    if (isUserLoggedIn) {
      fetchDetail()
    }
  }, [isUserLoggedIn])

  const addMoreItems = (section: keyof typeof formData) => {
    if (Array.isArray(formData[section])) {
      setFormData({
        ...formData,
        [section]: [
          ...formData[section],
          { description: '', amount: '' },
        ] as typeof formData[typeof section], // Type assertion
      });
      setSaving(true);
    }
  };
  
  
  const addMoreBreakup = () => {
    setFormData({
      ...formData,
      salaryBreakup: [...formData.salaryBreakup, { type: 'Other Allowance', amount: '' }],
    });
    setSaving(true);
  };
  return (
    <>
    <div className="flex items-center gap-4 mb-4">
          <Link to="/fileITR/incomeSources" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
          <h1 className="text-2xl font-semibold">View / Edit Salary</h1>
                </div>
        </div>
    <div className="max-w-4xl mx-auto p-4 sm:p-6 bg-gray-50">

    <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800">Form 16 Manual Entry</h1>

    <div className="space-y-6 sm:space-y-8">
      {/* Employer & TDS Details */}
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">Employer & TDS Details</h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="employerName">
              Employer Name*
            </label>
            <input
              id="employerName"
              type="text"
              placeholder="Search for Employer Name"
              value={formData.employerName}
              onChange={(e) => handleChange(e, 'employerName')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="employerTAN">
              Employer TAN*
              <span className="text-sm text-blue-600 ml-2 cursor-pointer hover:underline">Sample</span>
            </label>
            <input
              id="employerTAN"
              type="text"
              value={formData.employerTAN}
              onChange={(e) => handleChange(e, 'employerTAN')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="employerCategory">
              Employer Category*
            </label>
            <select
              id="employerCategory"
              value={formData.employerCategory}
              onChange={(e) => handleChange(e, 'employerCategory')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Private">Private</option>
              <option value="Public">Public</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="totalTax">
              Total tax deducted at source*
              <span className="text-sm text-blue-600 ml-2 cursor-pointer hover:underline">Sample</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                id="totalTax"
                type="text"
                value={formData.totalTax}
                onChange={(e) => handleChange(e, 'totalTax')}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Salary Breakup */}
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">Salary Breakup</h2>

        <div className="space-y-4 sm:space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-medium text-gray-800">1. Gross Salary</h3>
              <button className="text-blue-600 text-sm underline">Read More</button>
            </div>
            
            <div className="flex items-center gap-2 mb-2">
              <h4 className="text-base text-gray-700">1(a). Salary as per section 17(1)*</h4>
              <button className="text-blue-600 text-sm underline">Sample</button>
            </div>
            
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                value={formData.grossSalary}
                onChange={(e) => handleChange(e, 'grossSalary')}
                className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <div 
              className="flex items-center justify-between bg-gray-100 p-3 rounded-md cursor-pointer"
              onClick={() => setIsBreakupOpen(!isBreakupOpen)}
            >
              <h3 className="text-lg font-medium text-gray-800">Break up of salary as per section 17(1)</h3>
              {isBreakupOpen ? (
                <ChevronUp className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-600" />
              )}
            </div>

            {isBreakupOpen && (
              <div className="mt-4 bg-gray-50 p-4 sm:p-6 rounded-md space-y-4">
                <div className="flex justify-end">
                  <button className="text-blue-600 text-sm font-medium">
                    Auto-fill Salary Breakup
                  </button>
                </div>
                
                {formData.salaryBreakup.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium text-gray-700">{item.type}</label>
                      {(item.type === 'House Rent Allowance' || item.type === 'LTA Allowance') && (
                        <button className="text-blue-600 text-sm underline">Sample</button>
                      )}
                    </div>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                      <input
                        type="text"
                        placeholder="Enter amount"
                        value={item.amount}
                        onChange={(e) => handleChange(e, 'amount', index, 'salaryBreakup')}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                ))}
                
                <button
                  onClick={addMoreBreakup}
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add more items
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Perquisites */}
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">1(b) Perquisites under section 17(2)*</h2>
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.perquisitesAmount}
              onChange={(e) => handleChange(e, 'perquisitesAmount')}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-4">Perquisites</h3>
          {formData.perquisites.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
              <select
                value={item.description}
                onChange={(e) => handleChange(e, 'description', index, 'perquisites')}
                className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Perquisite</option>
                <option value="Accommodation">Accommodation</option>
                <option value="Car or Automotive">Car or Automotive</option>
                <option value="Credit Card Expenses">Credit Card Expenses</option>
                <option value="Club Expenses">Club Expenses</option>
              </select>
              <div className="relative w-full sm:w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="text"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleChange(e, 'amount', index, 'perquisites')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addMoreItems('perquisites')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add More
          </button>
        </div>
      </div>

      {/* Profits in lieu of salary */}
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">1(c) Profits in lieu of salary under section 17(3)*</h2>
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.profitAmount}
              onChange={(e) => handleChange(e, 'profitAmount')}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-4">Profits in lieu of Salary</h3>
          {formData.profitsInLieu.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
              <select
                value={item.description}
                onChange={(e) => handleChange(e, 'description', index, 'profitsInLieu')}
                className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Profit Type</option>
                <option value="Compensation due/received by an assessee from his employer">Compensation due/received by an assessee from his employer</option>
                <option value="Any payment due/received by an assessee from his employer">Any payment due/received by an assessee from his employer</option>
                <option value="Any amount due/received by an assessee from any person">Any amount due/received by an assessee from any person</option>
                <option value="Other">Other</option>
              </select>
              <div className="relative w-full sm:w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="text"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleChange(e, 'amount', index, 'profitsInLieu')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addMoreItems('profitsInLieu')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add More
          </button>
        </div>
      </div>

      {/* Income under section 89A - notified country */}
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">Income under section 89A - notified country</h2>
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="text"
              placeholder="Enter amount"
              value={formData.notifiedIncome}
              onChange={(e) => handleChange(e, 'notifiedIncome')}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mt-4">Break up of section 89A - notified country</h3>
          {formData.notifiedCountry.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
              <select
                value={item.description}
                onChange={(e) => handleChange(e, 'description', index, 'notifiedCountry')}
                className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Canada">Canada</option>
              </select>
              <div className="relative w-full sm:w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="text"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleChange(e, 'amount', index, 'notifiedCountry')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addMoreItems('notifiedCountry')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add More
          </button>
        </div>
      </div>

      {/* Income under section 89A - other than notified country */}
      <div className="bg-white rounded-md shadow-md p-4 flex justify-between items-center">
        <h2 className="font-semibold  text-gray-700">1(e) Income under section 89A - other than notified country</h2>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={formData.notifiedIncomeOtherCountry}
            onChange={(e) => handleChange(e, 'notifiedIncomeOtherCountry')}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Income taxable during the previous year */}
      <div className="bg-white rounded-md shadow-md p-4 flex justify-between items-center">
        <h2 className="font-semibold text-gray-700">1(f) Income taxable during the previous year on which relief u/s 89A was claimed in any earlier previous year</h2>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={formData.previousYearIncomeTax}
            onChange={(e) => handleChange(e, 'previousYearIncomeTax')}
            className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Exempt allowances under section 10 */}
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">2. Exempt allowances under section 10*</h2>
        <div className="space-y-4">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={formData.exemptAllowance}
              onChange={(e) => handleChange(e, 'exemptAllowance')}
              className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {formData.exemptAllowancereakup.map((item, index) => (
            <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-4 mb-4">
              <select
                value={item.type}
                onChange={(e) => handleChange(e, 'type', index, 'exemptAllowancereakup')}
                className="w-full sm:w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Exemption Type</option>
                <option value="House Rent Exemption">House Rent Exemption</option>
                <option value="LTA Exemption">LTA Exemption</option>
                <option value="Remuneration received as an official of an embassy, high commission Sec 10(6)">Remuneration received as an official of an embassy, high commission Sec 10(6)</option>
                <option value="Allowance or perquisites paid by the government to a citizen of India for rendering service outside India Sec 10(7)">Allowance or perquisites paid by the government to a citizen of India for rendering service outside India Sec 10(7)</option>
                <option value="Death-Retirement gratuity Sec 10(10)">Death-Retirement gratuity Sec 10(10)</option>
                <option value="Commuted value of pension Sec 10(10A)">Commuted value of pension Sec 10(10A)</option>
              </select>
              <div className="relative w-full sm:w-1/2">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                <input
                  type="text"
                  placeholder="Amount"
                  value={item.amount}
                  onChange={(e) => handleChange(e, 'amount', index, 'exemptAllowancereakup')}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => addMoreItems('exemptAllowancereakup')}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium text-sm mt-2"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add More Breakup
          </button>
        </div>
      </div>

      {/* Balance */}
      <div className="flex justify-between bg-white rounded-md shadow-md p-4 items-center">
        <h2 className="font-semibold text-gray-700">Balance (1 - 2)</h2>
        <div className="">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
          <input
            type="number"
            value={formData.balance}
            readOnly
            className="w-full pl-8 pr-4 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-700 font-medium"
          />
        </div>
      </div>
      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">4. Deductions and Relief</h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="standardDeduction">
            Standard Deductions 16(ia)
            </label>
            <input
              id="standardDeduction"
              type="number"
              placeholder=""
              value={50000}
              readOnly
              onChange={(e) => handleChange(e, 'standardDeduction')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="professionalTax">
            Professional tax under section 16(iii)
              <span className="text-sm text-blue-600 ml-2 cursor-pointer hover:underline">Sample</span>
            </label>
            <input
              id="professionalTax"
              type="number"
              value={formData.professionalTax}
              onChange={(e) => handleChange(e, 'professionalTax')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="reliefUnder89">
            4B Relief under section 89
            </label>
            <input
              id="reliefUnder89"
              type="number"
              value={formData.reliefUnder89}
              onChange={(e) => handleChange(e, 'reliefUnder89')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="totalTax">
            4C Income claimed for relief under section 89A
              <span className="text-sm text-blue-600 ml-2 cursor-pointer hover:underline">Sample</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-500">₹</span>
              <input
                id="incomeClaimed"
                type="number"
                value={formData.incomeClaimed}
                onChange={(e) => handleChange(e, 'incomeClaimed')}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-md shadow-md p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-gray-700">Employer & TDS Details</h2>
        <div className="space-y-4 sm:space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="pincode">
            Pincode*
            </label>
            <input
              id="pincode"
              type="number"
              placeholder=""
              value={formData.pincode}
              onChange={(e) => handleChange(e, 'pincode')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="professionalTax">
            Address Line*

            </label>
            <input
              id="addressLine"
              type="text"
              value={formData.addressLine}
              onChange={(e) => handleChange(e, 'addressLine')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="country">
            Country
            </label>
            <input
              id="country"
              type="text"
              value={formData.country}
              onChange={(e) => handleChange(e, 'country')}
              className="w-full px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="state">
            State 
            </label>
            <div className="relative">

              <input
                id="state"
                type="text"
                value={formData.state}
                onChange={(e) => handleChange(e, 'state')}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="city">
            City 
            </label>
            <div className="relative">

              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => handleChange(e, 'city')}
                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    {saving && (
      <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg">
        Saving...
      </div>
    )}
  </div>
  </>
  );
};

export default Form16Manually;
