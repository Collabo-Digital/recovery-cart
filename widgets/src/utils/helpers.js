/**
 * Helper utilities for widget
 */

/**
 * Sanitize phone number - remove all except digits and +
 */
export const sanitizePhone = (phone) => {
  if (!phone) return '';

  let clean = phone.replace(/[^0-9+]/g, '');

  // Keep + only at start
  if (clean.includes('+')) {
    clean = '+' + clean.replace(/\+/g, '');
  }

  return clean;
};

/**
 * Convert HSB color to RGB
 */
export const hsbToRgb = (hsb) => {
  try {
    const { hue, saturation, brightness } = hsb;
    const h = Math.max(0, Math.min(360, hue));
    const s = Math.max(0, Math.min(1, saturation));
    const v = Math.max(0, Math.min(1, brightness));

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r, g, b;
    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else[r, g, b] = [c, 0, x];

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  } catch (err) {
    // WhatsApp green fallback
    return { r: 37, g: 211, b: 102 };
  }
};

/**
 * Check if current page is a product page
 * @returns {boolean}
 */
const isProductPage = () => {
  // Check if we're on Shopify product page
  // Common patterns: /products/, /collections/.../products/
  const path = window.location.pathname;
  return path.includes('/products/');
};

/**
 * Build WhatsApp URL
 * @param {string} phone - Sanitized phone number
 * @param {string} message - Optional chat text (can be empty/null)
 * @returns {string} WhatsApp URL
 */
export const buildWhatsAppUrl = (phone, message = '') => {
  let url = `https://wa.me/${phone}`;

  // Build the message text
  let messageText = '';

  // Add custom message if provided
  if (message && typeof message === 'string' && message.trim().length > 0) {
    messageText = message.trim();
  }

  // If on product page, append the product URL
  if (isProductPage()) {
    const productUrl = window.location.href;

    if (messageText) {
      // Add product URL after the custom message
      messageText += `\n\nProduct: ${productUrl}`;
    } else {
      // Just send the product URL
      messageText = `${productUrl}`;
    }
  }

  // Add text parameter if we have a message
  if (messageText) {
    url += `?text=${encodeURIComponent(messageText)}`;
  }

  return url;
};

/**
 * Safe logger - only logs in development
 */
export const log = (type, message, data) => {
  const prefix = '[Recovery Cart]';
  const isDev = window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  // Always log errors and warnings
  if (type === 'error' || type === 'warn') {
    console[type](`${prefix} ${message}`, data || '');
    return;
  }

  // Only log info in development
  if (isDev && type === 'log') {
    console.log(`${prefix} ${message}`, data || '');
  }
};
