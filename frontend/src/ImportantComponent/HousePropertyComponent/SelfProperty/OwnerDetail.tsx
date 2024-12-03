import React, { useState } from "react";

const OwnerDetails: React.FC<{ data: any; onChange: (data: any) => void }> = ({
  data,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  const handleCoOwnerChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    const updatedCoOwners = [...data.coOwners];
    updatedCoOwners[index] = { ...updatedCoOwners[index], [name]: value };
    onChange({ ...data, coOwners: updatedCoOwners });
  };

  const addCoOwner = () => {
    const updatedCoOwners = [...data.coOwners, { coOwnerName: "", coOwnerPan: "", coOwnerShare: 0 }];
    onChange({ ...data, coOwners: updatedCoOwners });
  };

  const removeCoOwner = (index: number) => {
    const updatedCoOwners = data.coOwners.filter((_, i) => i !== index);
    onChange({ ...data, coOwners: updatedCoOwners });
  };

  const [hasMultipleOwners, setHasMultipleOwners] = useState<boolean>(false);

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasMultipleOwners(e.target.value === "yes");
    if (e.target.value === "no") {
      onChange({ ...data, coOwners: [] });
    }
  };

  return (
    <div>
      <h3>Owner Details</h3>
      <form>
        <div>
          <label htmlFor="ownerName">Name of Owner</label>
          <input
            name="ownerName"
            value={data.ownerName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ownerPan">PAN of Owner</label>
          <input
            type="text"
            id="ownerPan"
            name="ownerPan"
            value={data.ownerPan}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="ownerShare">% Share</label>
          <input
            type="number"
            id="ownerShare"
            name="ownerShare"
            value={data.ownerShare}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <p>Does the property have more than one owner?</p>
          <label>
            <input
              type="radio"
              name="multipleOwners"
              value="yes"
              onChange={handleOwnerChange}
            />
            Yes
          </label>
          <label>
            <input
              type="radio"
              name="multipleOwners"
              value="no"
              onChange={handleOwnerChange}
              defaultChecked
            />
            No
          </label>
        </div>

        {hasMultipleOwners && (
          <div>
            <p>Please enter details for additional owners:</p>
            {data.coOwners.map((coOwner: any, index: number) => (
              <div key={index}>
                <div>
                  <label htmlFor={`coOwnerName-${index}`}>Name of Co-Owner</label>
                  <input
                    type="text"
                    id={`coOwnerName-${index}`}
                    name="coOwnerName"
                    value={coOwner.coOwnerName}
                    onChange={(e) => handleCoOwnerChange(index, e)}
                  />
                </div>
                <div>
                  <label htmlFor={`coOwnerPan-${index}`}>PAN of Co-Owner</label>
                  <input
                    type="text"
                    id={`coOwnerPan-${index}`}
                    name="coOwnerPan"
                    value={coOwner.coOwnerPan}
                    onChange={(e) => handleCoOwnerChange(index, e)}
                  />
                </div>
                <div>
                  <label htmlFor={`coOwnerShare-${index}`}>% Share</label>
                  <input
                    type="number"
                    id={`coOwnerShare-${index}`}
                    name="coOwnerShare"
                    value={coOwner.coOwnerShare}
                    onChange={(e) => handleCoOwnerChange(index, e)}
                  />
                </div>
                <button type="button" onClick={() => removeCoOwner(index)}>
                  Remove Co-Owner
                </button>
              </div>
            ))}
            <button type="button" onClick={addCoOwner}>
              Add Another Co-Owner
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default OwnerDetails;
