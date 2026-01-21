/**
 * Validation utilities for widget configuration
 */

// Validation rules
export const RULES = {
  PHONE_MIN_DIGITS: 7,
  PHONE_MAX_DIGITS: 15,
  TEXT_MAX_LENGTH: 100,
  POSITIONS: ['bottom-left', 'bottom-right'],
};

/**
 * Validate phone number
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Phone number required' };
  }

  const digits = phone.replace(/[^0-9]/g, '');

  if (digits.length < RULES.PHONE_MIN_DIGITS || digits.length > RULES.PHONE_MAX_DIGITS) {
    return { valid: false, error: `Phone must be ${RULES.PHONE_MIN_DIGITS}-${RULES.PHONE_MAX_DIGITS} digits` };
  }

  return { valid: true };
};

/**
 * Validate button text
 */
export const validateText = (text) => {
  if (!text || !text.trim()) {
    return { valid: false, error: 'Button text required' };
  }

  if (text.length > RULES.TEXT_MAX_LENGTH) {
    return { valid: false, error: `Text too long (max ${RULES.TEXT_MAX_LENGTH})` };
  }

  return { valid: true };
};

/**
 * Validate position
 */
export const validatePosition = (position) => {
  if (!RULES.POSITIONS.includes(position)) {
    return { valid: false, error: `Position must be: ${RULES.POSITIONS.join(' or ')}` };
  }
  return { valid: true };
};

/**
 * Validate color (HSB format)
 */
export const validateColor = (color) => {
  if (!color || typeof color !== 'object') {
    return { valid: false, error: 'Color required' };
  }

  const { hue, saturation, brightness } = color;

  if (typeof hue !== 'number' || hue < 0 || hue > 360) {
    return { valid: false, error: 'Hue must be 0-360' };
  }

  if (typeof saturation !== 'number' || saturation < 0 || saturation > 1) {
    return { valid: false, error: 'Saturation must be 0-1' };
  }

  if (typeof brightness !== 'number' || brightness < 0 || brightness > 1) {
    return { valid: false, error: 'Brightness must be 0-1' };
  }

  return { valid: true };
};

/**
 * Validate complete config
 * Note: buttonText and chatText are optional fields
 */
export const validateConfig = (config) => {
  if (!config) {
    return { valid: false, errors: ['Config missing'] };
  }

  const errors = [];

  // Required: Phone number
  const phoneCheck = validatePhone(config.phoneNumber);
  if (!phoneCheck.valid) errors.push(phoneCheck.error);

  // Optional: Button text (if empty, widget shows icon only)
  // Optional: Chat text (if empty, WhatsApp opens without pre-filled message)

  // Required: Position
  const posCheck = validatePosition(config.position);
  if (!posCheck.valid) errors.push(posCheck.error);

  // Required: Button color
  const colorCheck = validateColor(config.buttonColor);
  if (!colorCheck.valid) errors.push(colorCheck.error);

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : null,
  };
};
