import React from "react";

interface FormProps {
  shortTermData: any;
  longTermData: any;
  step: number;
  handleShortTermInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => void;
  handleLongTermInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index?: number) => void;
  handleNext: () => void;
  handleBack: () => void;
  handleSubmit: () => void;
  addShortTermEntry: () => void;
  addLongTermEntry: () => void;

}

const LongShortTerm: React.FC<FormProps> = ({
  shortTermData,
  longTermData,
  step,
  handleShortTermInputChange,
  handleLongTermInputChange,
  handleNext,
  handleBack,
  handleSubmit,
  addShortTermEntry,
  addLongTermEntry,
}) => {
  
  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-4">Short Term Capital Gains</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Short Term Capital Gain *</label>
          <select
            name="shortTermCapitalGain"
            onChange={handleShortTermInputChange}
            value={shortTermData.shortTermCapitalGain}
            className="w-full border rounded px-3 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>

        {shortTermData.shortTermCapitalGain === "yes" && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700">Any other amount deemed to be short term capital gain</label>
              <input
                type="number"
                name="shortOtherAmountDeemed"
                onChange={handleShortTermInputChange}
                value={shortTermData.shortOtherAmountDeemed || ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total amount deemed to be short term capital gains</label>
              <input
                type="number"
                name="shortTotalAmountDeemed"
                onChange={handleShortTermInputChange}
                value={shortTermData.shortTotalAmountDeemed || ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Whether any amount of unutilized capital gain on asset transferred during previous years was deposited
                in the Capital Gains Accounts Scheme within due date for that year?
              </label>
              <select
                name="shortUnutilizedCapitalGain"
                onChange={handleShortTermInputChange}
                value={shortTermData.shortUnutilizedCapitalGain || ""}
                className="w-full border rounded px-3 py-2"
              >
                <option value="notApplicable">Not Applicable</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {shortTermData.shortUnutilizedCapitalGain === "yes" && (
  <>
    {shortTermData.shortEntries.map((entry, index) => (
      <div key={index} className="mb-4 border rounded p-4">
        <h3 className="font-bold">Entry {index + 1}</h3>
        <div className="mb-2">
          <label className="block text-gray-700">Prev. Year in which asset transferred</label>
          <input
            type="number"
            name={`shortPrevYear_${index}`}  // Dynamic name
            onChange={(e) => handleShortTermInputChange(e, "shortTerm", index)} // Pass index to the handler
            value={entry.shortPrevYear || ""}  // Ensure correct value mapping
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Section under which deduction claimed</label>
          <select
            name={`shortSection_${index}`}  // Dynamic name
            onChange={(e) => handleShortTermInputChange(e, "shortTerm", index)} // Pass index to the handler
            value={entry.shortSection || ""}  // Ensure correct value mapping
            className="w-full border rounded px-3 py-2"
          >
            <option value="54">54</option>
            <option value="54B">54B</option>
            <option value="54D">54D</option>
            <option value="54F">54F</option>
            <option value="54G">54G</option>
            <option value="54GA">54GA</option>
            <option value="54GB">54GB</option>
          </select>
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Year in which new asset acquired/constructed</label>
          <input
            type="number"
            name={`shortYearNewAsset_${index}`}  // Dynamic name
            onChange={(e) => handleShortTermInputChange(e, "shortTerm", index)} // Pass index to the handler
            value={entry.shortYearNewAsset|| ""}  // Ensure correct value mapping
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Amount utilised out of capital Gains Account</label>
          <input
            type="number"
            name={`shortAmountUtilised_${index}`}  // Dynamic name
            onChange={(e) => handleShortTermInputChange(e, "shortTerm", index)} // Pass index to the handler
            value={entry.shortAmountUtilised || ""}  // Ensure correct value mapping
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="mb-2">
          <label className="block text-gray-700">Amount not used for new assets</label>
          <input
            type="number"
            name={`shortAmountNotUsed_${index}`}  // Dynamic name
            onChange={(e) => handleShortTermInputChange(e, "shortTerm", index)} // Pass index to the handler
            value={entry.shortAmountNotUsed || ""}  // Ensure correct value mapping
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>
    ))}
    <button
      onClick={() =>  addShortTermEntry()}
      className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
    >
      Add Entry
    </button>
  </>
)}


          </>
        )}
      </div>
      <div>
        <h2 className="text-lg font-bold mb-4">Long Term Capital Gains</h2>
        {/* Long Term Section */}
        <div className="mb-4">
          <label className="block text-gray-700">Long Term Capital Gain *</label>
          <select
            name="longTermCapitalGain"
            onChange={handleLongTermInputChange}
            value={longTermData.longTermCapitalGain}
            className="w-full border rounded px-3 py-2"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </div>
        {longTermData.longTermCapitalGain === "yes" && (
            <>
            <div className="mb-4">
              <label className="block text-gray-700">Any other amount deemed to be short term capital gain</label>
              <input
                type="number"
                name="longOtherAmountDeemed"
                onChange={handleLongTermInputChange}
                value={longTermData.longOtherAmountDeemed || ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Total amount deemed to be short term capital gains</label>
              <input
                type="number"
                name="longTotalAmountDeemed"
                onChange={handleLongTermInputChange}
                value={longTermData.longTotalAmountDeemed || ""}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">
                Whether any amount of unutilized capital gain on asset transferred during previous years was deposited
                in the Capital Gains Accounts Scheme within due date for that year?
              </label>
              <select
                name="unutilizedCapitalGain"
                onChange={handleLongTermInputChange}
                value={longTermData.unutilizedCapitalGain || ""}
                className="w-full border rounded px-3 py-2"
              >
                <option value="notApplicable">Not Applicable</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>

            {longTermData.unutilizedCapitalGain === "yes" && (
              <>
                {longTermData.longEntries.map((entry,index) => (
                  <div key={index} className="mb-4 border rounded p-4">
                    <h3 className="font-bold">Entry {index + 1}</h3>
                    <div className="mb-2">
                      <label className="block text-gray-700">Prev. Year in which asset transferred</label>
                      <input
                        type="number"
                        name={`longPrevYear_${index}`}
                        onChange={(e) => handleLongTermInputChange(e, "longTerm", index)}
                        value={entry.longPrevYear || ""}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700">Section under which deduction claimed</label>
                      <select
                        name={`longSection_${index}`}
                        onChange={(e) => handleLongTermInputChange(e, "longTerm", index)}
                        value={entry.longSection || ""}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="54">54</option>
                        <option value="54B">54B</option>
                        <option value="54D">54D</option>
                        <option value="54F">54F</option>
                        <option value="54G">54G</option>
                        <option value="54GA">54GA</option>
                        <option value="54GB">54GB</option>
                      </select>
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700">Year in which new asset acquired/constructed</label>
                      <input
                        type="number"
                        name={`longYearNewAsset_${index}`}
                        onChange={(e) => handleLongTermInputChange(e, "longTerm", index)}
                        value={entry.longYearNewAsset || ""}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700">Amount utilised out of capital Gains Account</label>
                      <input
                        type="number"
                        name={`longAmountUtilised_${index}`}
                        onChange={(e) => handleLongTermInputChange(e, "longTerm", index)}
                        value={entry.longAmountUtilised || ""}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div className="mb-2">
                      <label className="block text-gray-700">Amount not used for new assets</label>
                      <input
                        type="number"
                        name={`longAmountNotUsed_${index}`}
                        onChange={(e) => handleLongTermInputChange(e, "longTerm", index)}
                        value={entry.longAmountNotUsed || ""}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>
                ))}
                <button
                  onClick={() => addLongTermEntry()}
                  className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                >
                  Add Entry
                </button>
              </>
            )}
          </>
        )}
        </div>
      <div>
     <button onClick={handleSubmit}>   {shortTermData && longTermData
              ? "Edit Details"
              : "Add Details"}</button>
        {/* Repeat the above structure for Long Term Capital Gains with `longTerm` fields */}
      </div>

     
    </>
  );
};

export default LongShortTerm;
