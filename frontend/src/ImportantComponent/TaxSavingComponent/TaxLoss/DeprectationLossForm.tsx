import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { fetchDepLoss } from '@/api/taxSaving';
import { RootState } from '@/stores/store';
import { useSelector } from 'react-redux';

const DepreciationLossForm = () => {
  const [losses, setLosses] = useState([{ year: '', filingDate: '', category: '', amount: '' }]);
  const [depreciationLosses, setDepreciationLosses] = useState([{ year: '', amount: '' }]);
  const [hasDepreciationLoss, setHasDepreciationLoss] = useState(false);
  const selectIsUserLoggedIn = (state: RootState) => state.user.user !== null;
  const isUserLoggedIn = useSelector(selectIsUserLoggedIn);
  const [dataExist, setDataExist] = useState('');

  const sessionYears = [
    '2023-2024',
    '2022-2023',
    '2021-2022',
    '2020-2021',
    '2019-2020',
    '2018-2019',
    '2017-2018',
    '2016-2017',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      try {
        const response = await fetchDepLoss(token);
        if (response) {
          setDataExist(response);

          setLosses(response.losses);
          setDepreciationLosses(response.depreciationLosses);
          setHasDepreciationLoss(response.hasDepreciationLoss);
        }
      } catch (error) {
        console.error('Error fetching personal details:', error);
      }
    };

    if (isUserLoggedIn) {
      fetchData();
    }
  }, [isUserLoggedIn]);

  const handleLossChange = (
    index: number,
    field: keyof typeof losses[0],
    value: string
  ) => {
    const updatedLosses = [...losses];
    updatedLosses[index][field] = value; // TypeScript now knows `field` is a valid key
    setLosses(updatedLosses);
  };
  

  const handleAddLoss = () => {
    setLosses([...losses, { year: '', filingDate: '', category: '', amount: '' }]);
  };

  const handleDepreciationLossChange = (
    index: number,
    field: keyof typeof depreciationLosses[0],
    value: string
  ) => {
    const updatedDepreciationLosses = [...depreciationLosses];
    updatedDepreciationLosses[index][field] = value; // TypeScript now knows `field` is a valid key
    setDepreciationLosses(updatedDepreciationLosses);
  };
  const handleAddDepreciationLoss = () => {
    setDepreciationLosses([...depreciationLosses, { year: '', amount: '' }]);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const formData = {
      losses,
      hasDepreciationLoss,
      depreciationLosses: hasDepreciationLoss ? depreciationLosses : [],
    };
    const token = localStorage.getItem('token');

    const url = dataExist
      ? `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/updateDepLoss`
      : `${import.meta.env.VITE_BACKEND_URL}/api/v1/taxSaving/postDepLoss`;
    try {
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Form submitted successfully');
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit the form');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Previous Year Loss Adjustment</h2>

      <h3>Add details of previous year losses</h3>
      {losses.map((loss, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <label>
            Assessment Year of Loss:
            <select
              value={loss.year}
              onChange={(e) => handleLossChange(index, 'year', e.target.value)}
              required
            >
              <option value="">Select Year</option>
              {sessionYears.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </label>
          <label>
            Date of Filing ITR for AY:
            <input
              type="date"
              value={loss.filingDate}
              onChange={(e) => handleLossChange(index, 'filingDate', e.target.value)}
              required
            />
          </label>
          <label>
            Category of Loss:
            <select
              value={loss.category}
              onChange={(e) => handleLossChange(index, 'category', e.target.value)}
              required
            >
              <option value="">Select Category</option>
              <option value="Business Profit">Business Profit</option>
              <option value="Capital Gains">Capital Gains</option>
              <option value="Other Sources">Other Sources</option>
            </select>
          </label>
          <label>
            Loss Amount:
            <input
              type="number"
              value={loss.amount}
              onChange={(e) => handleLossChange(index, 'amount', e.target.value)}
              required
            />
          </label>
        </div>
      ))}
      <button type="button" onClick={handleAddLoss}>
        Add another loss
      </button>

      <h3>Do you have depreciation losses from previous year?</h3>
      <label>
        <input
          type="checkbox"
          checked={hasDepreciationLoss}
          onChange={(e) => setHasDepreciationLoss(e.target.checked)}
        />
        Yes
      </label>
      {hasDepreciationLoss &&
        depreciationLosses.map((loss, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <label>
              Assessment Year of Loss:
              <select
                value={loss.year}
                onChange={(e) => handleDepreciationLossChange(index, 'year', e.target.value)}
                required
              >
                <option value="">Select Year</option>
                {sessionYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Loss Amount:
              <input
                type="number"
                value={loss.amount}
                onChange={(e) => handleDepreciationLossChange(index, 'amount', e.target.value)}
                required
              />
            </label>
          </div>
        ))}
      {hasDepreciationLoss && (
        <button type="button" onClick={handleAddDepreciationLoss}>
          Add another depreciation loss
        </button>
      )}

      <button type="submit">Save & Proceed</button>
    </form>
  );
};

export default DepreciationLossForm;
