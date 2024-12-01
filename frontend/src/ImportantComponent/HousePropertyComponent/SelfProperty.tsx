import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import HouseAddresComponent from "./HouseAddressComponent";
import OwnerDetails from "./OwnerDetail";

// Other components
const TaxSavingsDetails: React.FC = () => (
  <div>
    <h3>Tax Savings for Home Loan (Interest Paid Details)</h3>
    <p>Enter the details of the tax savings for the home loan.</p>
    {/* Add form fields for tax savings */}
  </div>
);

const RentalIncomeDetails: React.FC = () => (
  <div>
    <h3>Rental Income and Property Tax Details</h3>
    <p>Enter the details of rental income and property tax.</p>
    {/* Add form fields for rental income and property tax */}
  </div>
);

const SelfProperty: React.FC = () => {
  const [propertyType, setPropertyType] = useState<string>("Self Occupied House Property");
  const [formData, setFormData] = useState({
    propertyType: "Self Occupied House Property",
    houseAddress: {
      flatNo: "",
      premiseName: "",
      roadStreet: "",
      areaLocality: "",
      pincode: "",
      country: "",
      state: "",
      city: "",
    },
    ownerDetails: {
      ownerName: "",
      ownerPan: "",
      ownerShare: 0,
      hasMultipleOwners: false,
      coOwners: [],
    },
  });
  const [loading, setLoading] = useState(true);

  // Fetch data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/getPropertyData`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          setFormData(response.data.data);
         console.log("respond",response.data.data);
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFormChange = (section: string, updatedData: any) => {
    setFormData((prev) => ({ ...prev, [section]: updatedData }));
  };

  const handlePropertyTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPropertyType(e.target.value);
    setFormData((prev) => ({ ...prev, propertyType: e.target.value }));
  };

  const saveDataToDatabase = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/v1/fillDetail/addPropertyData`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Data saved successfully");
    } catch (error) {
      console.error("Error saving data:", error);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      saveDataToDatabase();
    }, 1000); // Save after 1 second of inactivity
    return () => clearTimeout(debounce);
  }, [formData]);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>House Property Details</h1>

      {/* Dropdown for selecting property type */}
      <div>
        <label htmlFor="property-type">Your Property Type:</label>
        <select id="property-type" value={propertyType} onChange={handlePropertyTypeChange}>
          <option value="Self Occupied House Property">Self Occupied House Property</option>
          <option value="Deemed Let Out Property">Deemed Let Out Property</option>
        </select>
      </div>

      {/* Render components */}
      <div>
        <HouseAddresComponent
          data={formData.houseAddress}
          onChange={(updatedData: any) => handleFormChange("houseAddress", updatedData)}
        />
        <OwnerDetails
          data={formData.ownerDetails}
          onChange={(updatedData: any) => handleFormChange("ownerDetails", updatedData)}
        />
        <TaxSavingsDetails />
        {propertyType === "Deemed Let Out Property" && <RentalIncomeDetails />}
      </div>

      {/* Navigation links */}
      <div style={{ marginTop: "20px" }}>
        <Link to="/fileITR/self-occupied-property">Add Details for Self-Occupied Property</Link>
      </div>
    </div>
  );
};

export default SelfProperty;
