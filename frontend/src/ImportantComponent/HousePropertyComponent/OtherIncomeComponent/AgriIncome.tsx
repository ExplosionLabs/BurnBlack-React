import React, { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import { fetchAgriAssestData } from '@/api/incomeSoucre';


const AgriIncome = () => {

    const [generalDetails, setGeneralDetails] = useState({
        grossReceipt: '',
        expenditure: '',
        loss: '',
      });
    
      const [landDetails, setLandDetails] = useState([
        { district: '', pincode: '', measurement: '', ownership: '', waterSource: '' },
      ]);

      useEffect(() => {
        const token = localStorage.getItem("token");
        
        if (!token) {
          console.error("No token found in localStorage");
        
          return;
        }
        const fetchData = async () => {
          try {
            const data = await fetchAgriAssestData(token);
            if (data) {
              setGeneralDetails(data.generalDetails || {});
              setLandDetails(data.landDetails || []);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);
    
    
      // Debounced function for autosaving data
      const debouncedSave = useCallback(
        debounce(async (data) => {
          try {
            const token = localStorage.getItem("token");
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addagri-income`, data,        {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
            console.log('Autosaved successfully');
          } catch (error) {
            console.error('Autosave failed:', error);
          }
        }, 500),
        []
      );
    
      const handleGeneralChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        const updatedDetails = { ...generalDetails, [name]: value };
        setGeneralDetails(updatedDetails);
        debouncedSave({ generalDetails: updatedDetails, landDetails });
      };
    
      const handleLandDetailChange = (index: number, e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        const updatedLandDetails = landDetails.map((detail, i) =>
          i === index ? { ...detail, [name]: value } : detail
        );
        setLandDetails(updatedLandDetails);
        debouncedSave({ generalDetails, landDetails: updatedLandDetails });
      };
    
      const addLandDetail = () => {
        setLandDetails([...landDetails, { district: '', pincode: '', measurement: '', ownership: '', waterSource: '' }]);
      };
    
  return (
    <div>
    <h1>Agriculture Form</h1>

    <h2>General Agriculture Details</h2>
    <form>
      <div>
        <label>Gross Agriculture Receipt:</label>
        <input
          type="text"
          name="grossReceipt"
          value={generalDetails.grossReceipt}
          onChange={handleGeneralChange}
        />
      </div>
      <div>
        <label>Expenditure On Agriculture:</label>
        <input
          type="text"
          name="expenditure"
          value={generalDetails.expenditure}
          onChange={handleGeneralChange}
        />
      </div>
      <div>
        <label>Unabsorbed Agriculture Loss:</label>
        <input
          type="text"
          name="loss"
          value={generalDetails.loss}
          onChange={handleGeneralChange}
        />
      </div>
    </form>

    <h2>Agriculture Land Details</h2>
    {landDetails.map((detail, index) => (
      <div key={index}>
        <form>
          <div>
            <label>Name of District:</label>
            <input
              type="text"
              name="district"
              value={detail.district}
              onChange={(e) => handleLandDetailChange(index, e)}
            />
          </div>
          <div>
            <label>Pincode:</label>
            <input
              type="text"
              name="pincode"
              value={detail.pincode}
              onChange={(e) => handleLandDetailChange(index, e)}
            />
          </div>
          <div>
            <label>Measurement (Acres):</label>
            <input
              type="text"
              name="measurement"
              value={detail.measurement}
              onChange={(e) => handleLandDetailChange(index, e)}
            />
          </div>
          <div>
            <label>Ownership Status:</label>
            <select
              name="ownership"
              value={detail.ownership}
              onChange={(e) => handleLandDetailChange(index, e)}
            >
              <option value="">Select</option>
              <option value="Owned">Owned</option>
              <option value="Leased">Leased</option>
            </select>
          </div>
          <div>
            <label>Water Source:</label>
            <select
              name="waterSource"
              value={detail.waterSource}
              onChange={(e) => handleLandDetailChange(index, e)}
            >
              <option value="">Select</option>
              <option value="Irrigated">Well</option>
          
              <option value="Rain-fed">Rain-fed</option>
            </select>
          </div>
        </form>
      </div>
    ))}
    <button onClick={addLandDetail}>Add More</button>
  </div>
  )
}

export default AgriIncome