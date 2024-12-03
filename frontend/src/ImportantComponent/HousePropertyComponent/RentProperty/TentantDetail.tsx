import React from "react";

interface TenantDetails {
  name: string;
  panOrTan: string;
  aadhaar: string;
}

const TenantDetailsComponent: React.FC<{
  data: TenantDetails[];
  onChange: (data: TenantDetails[]) => void;
}> = ({ data, onChange }) => {
  // Handle change for individual tenant details
  const handleChange = (
    index: number,
    field: keyof TenantDetails,
    value: string
  ) => {
    const updatedData = [...data];
    updatedData[index][field] = value;
    onChange(updatedData);
  };

  // Add a new tenant detail
  const handleAddTenant = () => {
    const newTenant = { name: "", panOrTan: "", aadhaar: "" };
    onChange([...data, newTenant]);
  };

  // Remove a tenant detail
  const handleRemoveTenant = (index: number) => {
    const updatedData = data.filter((_, i) => i !== index);
    onChange(updatedData);
  };

  return (
    <div>
      <h3>Tenant Details</h3>
      {data.map((tenant, index) => (
        <div
          key={index}
          style={{
            marginBottom: "16px",
            border: "1px solid #ccc",
            padding: "16px",
          }}
        >
          <h4>Tenant {index + 1}</h4>
          <div>
            <label htmlFor={`tenant-name-${index}`}>Name of the Tenant*</label>
            <input
              type="text"
              id={`tenant-name-${index}`}
              value={tenant.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor={`tenant-pan-${index}`}>PAN/TAN of the Tenant*</label>
            <input
              type="text"
              id={`tenant-pan-${index}`}
              value={tenant.panOrTan}
              onChange={(e) => handleChange(index, "panOrTan", e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor={`tenant-aadhaar-${index}`}>
              Aadhaar of the Tenant*
            </label>
            <input
              type="text"
              id={`tenant-aadhaar-${index}`}
              value={tenant.aadhaar}
              onChange={(e) => handleChange(index, "aadhaar", e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="button"
              onClick={() => handleRemoveTenant(index)}
              disabled={data.length === 1}
            >
              Remove Tenant
            </button>
          </div>
        </div>
      ))}
      <button type="button" onClick={handleAddTenant}>
        Add More
      </button>
    </div>
  );
};

export default TenantDetailsComponent;
