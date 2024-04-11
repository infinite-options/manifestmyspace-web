class DataValidator {
  static ssn_validate(ssn) {
    // Implement SSN validation logic here
    // For example, a basic validation could be checking if the SSN is a 9-digit number
    const ssnRegex = /^\d{9}$/;
    return ssnRegex.test(ssn);
  }

  static phone_validate(phoneNumber) {
    // Implement phone number validation logic here
    // For example, a basic validation could be checking if the phone number is a valid US number
    // Valid US phone number example: (123)456-7890
    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    return phoneRegex.test(phoneNumber);
  }

  static email_validate(email) {
    // Implement email validation logic here
    // For example, a basic validation could be checking if the email has a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}

export default DataValidator;
