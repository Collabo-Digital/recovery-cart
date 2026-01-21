/**
 * Color Utility Functions
 * Handles color conversions for the widget
 */

/**
 * Convert HSB (Hue, Saturation, Brightness) to Hex color
 * @param {Object} hsb - Color in HSB format
 * @param {number} hsb.hue - Hue (0-360)
 * @param {number} hsb.saturation - Saturation (0-1)
 * @param {number} hsb.brightness - Brightness (0-1)
 * @returns {string} Hex color string (e.g., "#25d366")
 */
export function hsbToHex(hsb) {
  const { hue, saturation, brightness } = hsb;
  const h = hue;
  const s = saturation;
  const v = brightness;
  
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  
  let r, g, b;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  const toHex = (val) => {
    const hex = Math.round((val + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };
  
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}
