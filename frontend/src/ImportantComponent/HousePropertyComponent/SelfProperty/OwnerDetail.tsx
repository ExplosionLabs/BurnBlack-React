import { ChevronDown, MapPin, PersonStanding } from "lucide-react";
import React, { useState } from "react";

const OwnerDetails: React.FC<{ data: any; onChange: (data: any) => void }> = ({
  data,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [hasMultipleOwners, setHasMultipleOwners] = useState<boolean>(false);

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
    const updatedCoOwners = data.coOwners.filter((_: any, i: number) => i !== index);
    onChange({ ...data, coOwners: updatedCoOwners });
  };

  const handleOwnerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasMultipleOwners(e.target.value === "yes");
    if (e.target.value === "no") {
      onChange({ ...data, coOwners: [] });
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PersonStanding className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-medium">Owner Details</h3>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <ChevronDown className={`w-5 h-5 text-gray-400 ${isExpanded ? "transform rotate-180" : ""}`} />
          </button>
        </div>

        {isExpanded && (
          <form className="space-y-6">
            <div>
              <label htmlFor="ownerName" className="text-gray-600">Name of Owner</label>
              <input
                name="ownerName"
                value={data.ownerName}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label htmlFor="ownerPan" className="text-gray-600">PAN of Owner</label>
              <input
                type="text"
                id="ownerPan"
                name="ownerPan"
                value={data.ownerPan}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div>
              <label htmlFor="ownerShare" className="text-gray-600">% Share</label>
              <input
                type="number"
                id="ownerShare"
                name="ownerShare"
                value={data.ownerShare}
                onChange={handleChange}
                required
                className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
              />
            </div>
            <div className="space-y-4">
              <p className="text-gray-600">Does the property have more than one owner?</p>
              <div className="flex items-center gap-4">
                <label>
                  <input
                    type="radio"
                    name="multipleOwners"
                    value="yes"
                    onChange={handleOwnerChange}
                    className="text-gray-600"
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
                    className="text-gray-600"
                  />
                  No
                </label>
              </div>
            </div>

            {hasMultipleOwners && (
              <div>
                <p className="text-gray-600">Please enter details for additional owners:</p>
                {data.coOwners.map((coOwner: any, index: number) => (
                  <div key={index} className="space-y-4">
                    <div>
                      <label htmlFor={`coOwnerName-${index}`} className="text-gray-600">Name of Co-Owner</label>
                      <input
                        type="text"
                        id={`coOwnerName-${index}`}
                        name="coOwnerName"
                        value={coOwner.coOwnerName}
                        onChange={(e) => handleCoOwnerChange(index, e)}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor={`coOwnerPan-${index}`} className="text-gray-600">PAN of Co-Owner</label>
                      <input
                        type="text"
                        id={`coOwnerPan-${index}`}
                        name="coOwnerPan"
                        value={coOwner.coOwnerPan}
                        onChange={(e) => handleCoOwnerChange(index, e)}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <div>
                      <label htmlFor={`coOwnerShare-${index}`} className="text-gray-600">% Share</label>
                      <input
                        type="number"
                        id={`coOwnerShare-${index}`}
                        name="coOwnerShare"
                        value={coOwner.coOwnerShare}
                        onChange={(e) => handleCoOwnerChange(index, e)}
                        className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-gray-300"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeCoOwner(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove Co-Owner
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCoOwner}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Add Another Co-Owner
                </button>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};

export default OwnerDetails;
