/**
 * Form Validation Utilities
 * Comprehensive validation functions for user inputs
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate phone number (international format)
 * Accepts formats: +20 10 123 4567, +1-234-567-8900, etc.
 */
export const validatePhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim() === "") {
    return { isValid: false, error: "Phone number is required" };
  }

  // Remove spaces and dashes for validation
  const cleanPhone = phone.replace(/[\s-]/g, "");
  
  // Must start with + and have 10-15 digits
  const phoneRegex = /^\+?[1-9]\d{9,14}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return {
      isValid: false,
      error: "Please enter a valid international phone number (e.g., +20 10 123 4567)",
    };
  }

  return { isValid: true };
};

/**
 * Validate passport number
 * Most passports are 6-9 alphanumeric characters
 */
export const validatePassportNumber = (passport: string): ValidationResult => {
  if (!passport || passport.trim() === "") {
    return { isValid: false, error: "Passport number is required" };
  }

  const passportRegex = /^[A-Z0-9]{6,9}$/i;
  
  if (!passportRegex.test(passport.trim())) {
    return {
      isValid: false,
      error: "Passport number must be 6-9 alphanumeric characters",
    };
  }

  return { isValid: true };
};

/**
 * Validate passport expiry date
 * Must be in the future and at least 6 months from now
 */
export const validatePassportExpiry = (expiryDate: string): ValidationResult => {
  if (!expiryDate) {
    return { isValid: false, error: "Passport expiry date is required" };
  }

  const expiry = new Date(expiryDate);
  const today = new Date();
  const sixMonthsFromNow = new Date();
  sixMonthsFromNow.setMonth(today.getMonth() + 6);

  if (expiry <= today) {
    return { isValid: false, error: "Passport has expired" };
  }

  if (expiry < sixMonthsFromNow) {
    return {
      isValid: false,
      error: "Passport must be valid for at least 6 months",
    };
  }

  return { isValid: true };
};

/**
 * Validate date of birth
 * Must be at least 18 years old
 */
export const validateDateOfBirth = (dob: string): ValidationResult => {
  if (!dob) {
    return { isValid: false, error: "Date of birth is required" };
  }

  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  if (age < 18) {
    return { isValid: false, error: "You must be at least 18 years old" };
  }

  if (age > 120) {
    return { isValid: false, error: "Please enter a valid date of birth" };
  }

  return { isValid: true };
};

/**
 * Validate ZIP/Postal code
 * Flexible format for international codes
 */
export const validateZipCode = (zipCode: string): ValidationResult => {
  if (!zipCode || zipCode.trim() === "") {
    return { isValid: false, error: "ZIP/Postal code is required" };
  }

  // Allow alphanumeric with spaces and dashes, 3-10 characters
  const zipRegex = /^[A-Z0-9\s-]{3,10}$/i;
  
  if (!zipRegex.test(zipCode.trim())) {
    return {
      isValid: false,
      error: "Please enter a valid ZIP/Postal code",
    };
  }

  return { isValid: true };
};

/**
 * Validate name (first name or last name)
 * Must be at least 2 characters, only letters and spaces
 */
export const validateName = (name: string, fieldName: string = "Name"): ValidationResult => {
  if (!name || name.trim() === "") {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return {
      isValid: false,
      error: `${fieldName} must be at least 2 characters`,
    };
  }

  const nameRegex = /^[a-zA-Z\s'-]+$/;
  
  if (!nameRegex.test(name)) {
    return {
      isValid: false,
      error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`,
    };
  }

  return { isValid: true };
};

/**
 * Validate complete profile form data
 */
export const validateCompleteProfile = (formData: any): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate first name
  const firstNameResult = validateName(formData.firstName, "First name");
  if (!firstNameResult.isValid) {
    errors.firstName = firstNameResult.error!;
  }

  // Validate last name
  const lastNameResult = validateName(formData.lastName, "Last name");
  if (!lastNameResult.isValid) {
    errors.lastName = lastNameResult.error!;
  }

  // Validate phone
  const phoneResult = validatePhone(formData.phone);
  if (!phoneResult.isValid) {
    errors.phone = phoneResult.error!;
  }

  // Validate date of birth
  const dobResult = validateDateOfBirth(formData.dateOfBirth);
  if (!dobResult.isValid) {
    errors.dateOfBirth = dobResult.error!;
  }

  // Validate passport number
  const passportResult = validatePassportNumber(formData.passportNumber);
  if (!passportResult.isValid) {
    errors.passportNumber = passportResult.error!;
  }

  // Validate passport expiry
  const expiryResult = validatePassportExpiry(formData.passportExpiry);
  if (!expiryResult.isValid) {
    errors.passportExpiry = expiryResult.error!;
  }

  // Validate ZIP code
  const zipResult = validateZipCode(formData.zipCode);
  if (!zipResult.isValid) {
    errors.zipCode = zipResult.error!;
  }

  // Validate emergency contact phone
  const emergencyPhoneResult = validatePhone(formData.emergencyContactPhone);
  if (!emergencyPhoneResult.isValid) {
    errors.emergencyContactPhone = emergencyPhoneResult.error!;
  }

  // Simple required field validation
  const requiredFields = [
    { field: 'nationality', label: 'Nationality' },
    { field: 'address', label: 'Address' },
    { field: 'city', label: 'City' },
    { field: 'country', label: 'Country' },
    { field: 'emergencyContactName', label: 'Emergency contact name' },
  ];

  requiredFields.forEach(({ field, label }) => {
    if (!formData[field] || formData[field].trim() === '') {
      errors[field] = `${label} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
