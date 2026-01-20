/**
 * Widget settings database utilities
 */
import prisma from "../db.server";

/**
 * Default widget settings
 */
export const DEFAULT_SETTINGS = {
  position: "bottom-right",
  phoneNumber: "",
  buttonText: "Chat with us",
  buttonColor: {
    hue: 142,
    saturation: 0.77,
    brightness: 0.75,
  },
};

/**
 * Get widget settings for a shop
 */
export async function getWidgetSettings(shopDomain) {
  return await prisma.widgetSettings.findUnique({
    where: { shopDomain },
  });
}

/**
 * Create default widget settings for a shop
 */
export async function createDefaultSettings(shopDomain) {
  return await prisma.widgetSettings.create({
    data: {
      shopDomain,
      ...DEFAULT_SETTINGS,
    },
  });
}

/**
 * Update widget settings for a shop
 */
export async function updateWidgetSettings(shopDomain, settingsData) {
  return await prisma.widgetSettings.upsert({
    where: { shopDomain },
    update: settingsData,
    create: {
      shopDomain,
      ...settingsData,
    },
  });
}
