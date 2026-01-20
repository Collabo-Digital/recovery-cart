/**
 * Metafield utilities for managing shop metafields
 */

/**
 * Get Shop GID from Shopify Admin API
 */
export async function getShopId(admin) {
  const response = await admin.graphql(`
    query GetShopId {
      shop {
        id
      }
    }
  `);
  const data = await response.json();
  return data.data.shop.id;
}

/**
 * Update shop metafield with widget settings
 */
export async function updateWidgetMetafield(admin, shopId, settings) {
  const metafieldValue = JSON.stringify({
    position: settings.position,
    phoneNumber: settings.phoneNumber,
    buttonText: settings.buttonText,
    buttonColor: settings.buttonColor,
  });

  const mutation = `
    mutation StoreWidgetSettings($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const response = await admin.graphql(mutation, {
    variables: {
      metafields: [
        {
          ownerId: shopId,
          key: "widget_settings",
          type: "json",
          value: metafieldValue,
        },
      ],
    },
  });

  const result = await response.json();
  
  // Check for errors
  if (result.data?.metafieldsSet?.userErrors?.length > 0) {
    throw new Error(
      `Metafield update failed: ${result.data.metafieldsSet.userErrors.map(e => e.message).join(", ")}`
    );
  }

  return result;
}
