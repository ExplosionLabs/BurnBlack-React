const ContactDetail = require('../models/ContactDetail');
const User = require('../models/User');
const AppError = require('../utils/appError');

class ContactDetailService {
  // Create or update contact details
  static async upsertContactDetails(userId, data) {
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Check for duplicate Aadhar/PAN
      if (data.aadharNumber) {
        const existingAadhar = await ContactDetail.findOne({
          aadharNumber: data.aadharNumber,
          userId: { $ne: userId }
        });
        if (existingAadhar) {
          throw new AppError('Aadhar number already registered', 400);
        }
      }

      if (data.panNumber) {
        const existingPan = await ContactDetail.findOne({
          panNumber: data.panNumber,
          userId: { $ne: userId }
        });
        if (existingPan) {
          throw new AppError('PAN number already registered', 400);
        }
      }

      // Find and update or create new
      const contactDetail = await ContactDetail.findOneAndUpdate(
        { userId },
        { ...data, userId },
        { 
          new: true,
          runValidators: true,
          upsert: true
        }
      );

      return contactDetail;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }

  // Get contact details by user ID
  static async getContactDetails(userId) {
    const contactDetail = await ContactDetail.findOne({ userId });
    if (!contactDetail) {
      throw new AppError('Contact details not found', 404);
    }
    return contactDetail;
  }

  // Delete contact details
  static async deleteContactDetails(userId) {
    const contactDetail = await ContactDetail.findOneAndDelete({ userId });
    if (!contactDetail) {
      throw new AppError('Contact details not found', 404);
    }
    return contactDetail;
  }

  // Update verification status
  static async updateVerificationStatus(userId, field, status) {
    const validFields = ['aadhar', 'pan', 'mobile', 'email'];
    if (!validFields.includes(field)) {
      throw new AppError('Invalid verification field', 400);
    }

    const updateField = `is${field.charAt(0).toUpperCase() + field.slice(1)}Verified`;
    const contactDetail = await ContactDetail.findOneAndUpdate(
      { userId },
      { [updateField]: status },
      { new: true, runValidators: true }
    );

    if (!contactDetail) {
      throw new AppError('Contact details not found', 404);
    }

    return contactDetail;
  }

  // Check if contact details are complete
  static async isProfileComplete(userId) {
    const contactDetail = await ContactDetail.findOne({ userId });
    if (!contactDetail) {
      return false;
    }

    // Check if all required fields are filled and verified
    const requiredFields = ['aadharNumber', 'panNumber', 'mobileNumber', 'email'];
    const requiredVerifications = ['isAadharVerified', 'isPanVerified', 'isMobileVerified', 'isEmailVerified'];

    const hasAllFields = requiredFields.every(field => contactDetail[field]);
    const isAllVerified = requiredVerifications.every(field => contactDetail[field]);

    return hasAllFields && isAllVerified;
  }
}

module.exports = ContactDetailService; 