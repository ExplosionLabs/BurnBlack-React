const mongoose = require("mongoose");

const gstDataSchema = new mongoose.Schema(
  {
    contact_details: {
      principal: {
        address: { type: String, required: true },
        email: { type: String, required: true },
        mobile: { type: String, required: true },
        nature_of_business: { type: String, required: true },
      },
      additional: { type: [String], default: [] },
    },
    promoters: { type: [String], default: [] },
    annual_turnover: { type: String, required: true },
    annual_turnover_fy: { type: String, required: true },
    percentage_in_cash_fy: { type: String, default: "" },
    percentage_in_cash: { type: String, default: "NA" },
    aadhaar_validation: { type: String, required: true },
    aadhaar_validation_date: { type: Date },
    address_details: { type: Object, default: {} },
    liability_percentage_details: { type: Object, default: {} },
    less_info: { type: Boolean, default: false },
    einvoice_status: { type: Boolean, required: true },
    client_id: { type: String, required: true },
    gstin: { type: String, required: true },
    pan_number: { type: String, required: true },
    business_name: { type: String, required: true },
    legal_name: { type: String, required: true },
    center_jurisdiction: { type: String, required: true },
    state_jurisdiction: { type: String, required: true },
    date_of_registration: { type: Date, required: true },
    constitution_of_business: { type: String, required: true },
    taxpayer_type: { type: String, required: true },
    gstin_status: { type: String, required: true },
    date_of_cancellation: { type: Date, default: "1800-01-01" },
    field_visit_conducted: { type: String, default: "No" },
    nature_bus_activities: { type: [String], default: [] },
    nature_of_core_business_activity_code: { type: String, required: true },
    nature_of_core_business_activity_description: {
      type: String,
      required: true,
    },
    filing_status: { type: [String], default: [] },
    address: { type: String, default: null },
    hsn_info: { type: Object, default: {} },
    filing_frequency: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("GSTData", gstDataSchema);
