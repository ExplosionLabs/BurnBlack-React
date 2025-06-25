import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, User, CreditCard, Phone, MapPin, Calendar } from 'lucide-react';
import { useITRFlow } from '../../../contexts/ITRFlowContext';
import { useAuth } from '../../../contexts/SupabaseAuthContext';
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const SmartPersonalDetails: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data, updatePersonalDetails, markStepCompleted } = useITRFlow();
  const [formData, setFormData] = useState({
    name: data.personalDetails.name || '',
    pan: data.personalDetails.pan || '',
    aadhaar: data.personalDetails.aadhaar || '',
    dateOfBirth: data.personalDetails.dateOfBirth || '',
    email: data.personalDetails.email || user?.email || '',
    mobile: data.personalDetails.mobile || '',
    gender: data.personalDetails.gender || '',
    address: {
      line1: data.personalDetails.address?.line1 || '',
      line2: data.personalDetails.address?.line2 || '',
      city: data.personalDetails.address?.city || '',
      state: data.personalDetails.address?.state || '',
      pincode: data.personalDetails.address?.pincode || '',
      country: data.personalDetails.address?.country || 'India'
    },
    status: data.personalDetails.status || 'Individual',
    residentialStatus: data.personalDetails.residentialStatus || 'Resident'
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Update form data when context data changes
    setFormData({
      name: data.personalDetails.name || '',
      pan: data.personalDetails.pan || '',
      aadhaar: data.personalDetails.aadhaar || '',
      dateOfBirth: data.personalDetails.dateOfBirth || '',
      email: data.personalDetails.email || user?.email || '',
      mobile: data.personalDetails.mobile || '',
      gender: data.personalDetails.gender || '',
      address: {
        line1: data.personalDetails.address?.line1 || '',
        line2: data.personalDetails.address?.line2 || '',
        city: data.personalDetails.address?.city || '',
        state: data.personalDetails.address?.state || '',
        pincode: data.personalDetails.address?.pincode || '',
        country: data.personalDetails.address?.country || 'India'
      },
      status: data.personalDetails.status || 'Individual',
      residentialStatus: data.personalDetails.residentialStatus || 'Resident'
    });
  }, [data.personalDetails, user]);

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    
    if (!formData.pan?.trim()) {
      newErrors.pan = 'PAN is required';
    } else if (!formData.pan.match(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)) {
      newErrors.pan = 'Invalid PAN format (e.g., ABCDE1234F)';
    }
    
    if (!formData.aadhaar?.trim()) {
      newErrors.aadhaar = 'Aadhaar is required';
    } else if (!formData.aadhaar.match(/^\d{4}\s\d{4}\s\d{4}$/)) {
      newErrors.aadhaar = 'Invalid Aadhaar format (use XXXX XXXX XXXX)';
    }
    
    if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Invalid email format';
    }
    
    if (!formData.mobile?.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (formData.mobile.length < 12) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.address.line1?.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.address.city?.trim()) newErrors.city = 'City is required';
    if (!formData.address.state?.trim()) newErrors.state = 'State is required';
    
    if (!formData.address.pincode?.trim()) {
      newErrors.pincode = 'Pincode is required';
    } else if (!formData.address.pincode.match(/^\d{6}$/)) {
      newErrors.pincode = 'Invalid pincode (6 digits required)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // Save data to context
      updatePersonalDetails({
        name: formData.name,
        pan: formData.pan.toUpperCase(),
        aadhaar: formData.aadhaar,
        dateOfBirth: formData.dateOfBirth,
        email: formData.email,
        mobile: formData.mobile,
        gender: formData.gender as 'M' | 'F',
        address: formData.address,
        status: formData.status as any,
        residentialStatus: formData.residentialStatus as any
      });
      
      // Mark step as completed
      markStepCompleted('personal');
      
      // Navigate to next step
      navigate('/fileITR/smart-flow/income');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    let formattedValue = value;
    
    // Format specific fields
    if (field === 'aadhaar') {
      // Remove all non-digits and limit to 12 digits
      const digits = value.replace(/\D/g, '').slice(0, 12);
      // Format as XXXX XXXX XXXX
      formattedValue = digits.replace(/(\d{4})(\d{4})(\d{4})/, '$1 $2 $3').trim();
    } else if (field === 'pan') {
      // Auto-uppercase PAN and limit to 10 characters
      formattedValue = value.toUpperCase().slice(0, 10);
    } else if (field === 'address.pincode') {
      // Only allow 6 digits for pincode
      formattedValue = value.replace(/\D/g, '').slice(0, 6);
    }
    
    if (field.startsWith('address.')) {
      const addressField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: { ...prev.address, [addressField]: formattedValue }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: formattedValue }));
    }
    
    // Clear error when user starts typing
    const errorKey = field.replace('address.', '');
    if (errors[errorKey]) {
      setErrors(prev => ({ ...prev, [errorKey]: '' }));
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({ ...prev, mobile: value }));
    
    // Clear error when user starts typing
    if (errors.mobile) {
      setErrors(prev => ({ ...prev, mobile: '' }));
    }
  };

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli',
    'Daman and Diu', 'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep',
    'Puducherry'
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Personal Details
          </h1>
          <p className="text-gray-600">
            Please provide your personal information for ITR filing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8"
        >
          <div className="space-y-6">
            
            {/* Basic Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PAN Number *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.pan}
                      onChange={(e) => handleInputChange('pan', e.target.value.toUpperCase())}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.pan ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter PAN number"
                      maxLength={10}
                    />
                  </div>
                  {errors.pan && <p className="text-red-500 text-sm mt-1">{errors.pan}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Aadhaar Number *
                  </label>
                  <input
                    type="text"
                    value={formData.aadhaar}
                    onChange={(e) => handleInputChange('aadhaar', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.aadhaar ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                  />
                  {errors.aadhaar && <p className="text-red-500 text-sm mt-1">{errors.aadhaar}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date of Birth *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Residential Status *
                  </label>
                  <select
                    value={formData.residentialStatus}
                    onChange={(e) => handleInputChange('residentialStatus', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Resident">Resident</option>
                    <option value="Non-Resident">Non-Resident</option>
                    <option value="Not Ordinary Resident">Not Ordinary Resident</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                Contact Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number *
                  </label>
                  <PhoneInput
                    country="in"
                    value={formData.mobile}
                    onChange={handlePhoneChange}
                    inputClass={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.mobile ? 'border-red-300' : 'border-gray-300'
                    }`}
                    containerClass="w-full"
                    buttonClass="border-gray-300"
                  />
                  {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Address Information
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={formData.address.line1}
                    onChange={(e) => handleInputChange('address.line1', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.addressLine1 ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="House/Flat number, Street name"
                  />
                  {errors.addressLine1 && <p className="text-red-500 text-sm mt-1">{errors.addressLine1}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={formData.address.line2}
                    onChange={(e) => handleInputChange('address.line2', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Area, Landmark (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => handleInputChange('address.city', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.city ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <select
                      value={formData.address.state}
                      onChange={(e) => handleInputChange('address.state', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.state ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select State</option>
                      {indianStates.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pincode *
                    </label>
                    <input
                      type="text"
                      value={formData.address.pincode}
                      onChange={(e) => handleInputChange('address.pincode', e.target.value)}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.pincode ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Enter pincode"
                      maxLength={6}
                    />
                    {errors.pincode && <p className="text-red-500 text-sm mt-1">{errors.pincode}</p>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleContinue}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
            >
              Continue to Income Details
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartPersonalDetails;