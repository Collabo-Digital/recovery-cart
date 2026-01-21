/**
 * Sanitize user input to prevent XSS and ensure clean data
 */

/**
 * Remove any HTML tags and dangerous characters from text input
 * @param {string} input - The input string to sanitize
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} - Sanitized string
 */
export function sanitizeText(input, maxLength = 500) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove HTML tags
  let sanitized = input.replace(/<[^>]*>/g, '');
  
  // Remove script-related content
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=/gi, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Limit length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize phone number input
 * @param {string} input - The phone number string
 * @returns {string} - Sanitized phone number (only digits, +, -, spaces, parentheses)
 */
export function sanitizePhoneNumber(input) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Only allow digits, +, -, spaces, and parentheses
  const sanitized = input.replace(/[^\d+\-\s()]/g, '');
  
  // Limit to reasonable length for phone numbers
  return sanitized.substring(0, 20);
}

/**
 * Sanitize all form data before submission
 * @param {Object} formData - Form data object
 * @returns {Object} - Sanitized form data
 */
export function sanitizeFormData(formData) {
  return {
    position: formData.position, // Select field, no sanitization needed
    phoneNumber: sanitizePhoneNumber(formData.phoneNumber),
    buttonText: sanitizeText(formData.buttonText, 50),
    chatText: sanitizeText(formData.chatText, 200),
    buttonColor: formData.buttonColor, // Color object, no sanitization needed
  };
}
