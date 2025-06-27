const PersonalDetail = require('../models/PersonalDetail');
const User = require('../models/User');
const AppError = require('../utils/appError');

class PersonalDetailService {
  // Create or update personal details
  static async upsertPersonalDetails(userId, data) {
    try {
      // Check if user exists
      const user = await User.findById(userId);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      // Find and update or create new
      const personalDetail = await PersonalDetail.findOneAndUpdate(
        { userId },
        { ...data, userId },
        { 
          new: true,
          runValidators: true,
          upsert: true
        }
      );

      return personalDetail;
    } catch (error) {
      if (error.name === 'ValidationError') {
        throw new AppError(error.message, 400);
      }
      throw error;
    }
  }

  // Get personal details by user ID
  static async getPersonalDetails(userId) {
    const personalDetail = await PersonalDetail.findOne({ userId });
    if (!personalDetail) {
      throw new AppError('Personal details not found', 404);
    }
    return personalDetail;
  }

  // Delete personal details
  static async deletePersonalDetails(userId) {
    const personalDetail = await PersonalDetail.findOneAndDelete({ userId });
    if (!personalDetail) {
      throw new AppError('Personal details not found', 404);
    }
    return personalDetail;
  }

  // Check if personal details are complete
  static async isProfileComplete(userId) {
    const personalDetail = await PersonalDetail.findOne({ userId });
    if (!personalDetail) {
      return false;
    }

    // Check if all required fields are filled
    const requiredFields = ['firstName', 'lastName', 'dob', 'gender', 'maritalStatus'];
    return requiredFields.every(field => personalDetail[field]);
  }

  // Validate Personal Details
  validatePersonalDetails(personalData) {
    const errors = [];

    if (!personalData.firstName?.trim()) {
      errors.push('First name is required');
    }

    if (!personalData.lastName?.trim()) {
      errors.push('Last name is required');
    }

    if (!personalData.dob) {
      errors.push('Date of birth is required');
    } else {
      const dob = new Date(personalData.dob);
      if (isNaN(dob.getTime())) {
        errors.push('Invalid date of birth');
      }
    }

    if (!personalData.gender?.trim()) {
      errors.push('Gender is required');
    }

    if (!personalData.maritalStatus?.trim()) {
      errors.push('Marital status is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

module.exports = PersonalDetailService; 