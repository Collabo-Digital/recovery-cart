// /**
//  * Metafield utilities for managing shop metafields
//  */

// /**
//  * Get Shop GID from Shopify Admin API
//  */
// export async function getShopId(admin) {
//   const response = await admin.graphql(`
//     query GetShopId {
//       shop {
//         id
//       }
//     }
//   `);
//   const data = await response.json();
//   return data.data.shop.id;
// }

// /**
//  * Update shop metafield with widget settings
//  */
// export async function updateWidgetMetafield(admin, shopId, settings) {
//   const metafieldValue = JSON.stringify({
//     position: settings.position,
//     phoneNumber: settings.phoneNumber,
//     buttonText: settings.buttonText,
//     buttonColor: settings.buttonColor,
//   });

//   const mutation = `
//     mutation StoreWidgetSettings($metafields: [MetafieldsSetInput!]!) {
//       metafieldsSet(metafields: $metafields) {
//         metafields {
//           id
//           namespace
//           key
//           value
//         }
//         userErrors {
//           field
//           message
//         }
//       }
//     }
//   `;

//   const response = await admin.graphql(mutation, {
//     variables: {
//       metafields: [
//         {
//           ownerId: shopId,
//           key: "widget_settings",
//           type: "json",
//           value: metafieldValue,
//         },
//       ],
//     },
//   });

//   const result = await response.json();

//   // Check for errors
//   if (result.data?.metafieldsSet?.userErrors?.length > 0) {
//     throw new Error(
//       `Metafield update failed: ${result.data.metafieldsSet.userErrors.map(e => e.message).join(", ")}`
//     );
//   }

//   return result;
// }


/**
 * Metafield utilities for managing shop metafields
 */

// Metafield configuration constants (matches shopify.app.toml)
// Using $app namespace for app-owned metafields (GraphQL syntax)
// This corresponds to "app" namespace in shopify.app.toml
const METAFIELD_NAMESPACE = "$app";
const METAFIELD_KEY = "settings";

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
          namespace: METAFIELD_NAMESPACE,  // ✅ Added namespace
          key: METAFIELD_KEY,               // ✅ Updated key to match TOML
          type: "json",
          value: metafieldValue,
        },
      ],
    },
  });

  const result = await response.json();

  // Check for errors
  if (result.data?.metafieldsSet?.userErrors?.length > 0) {
    const errors = result.data.metafieldsSet.userErrors
      .map(e => `${e.field}: ${e.message}`)
      .join(", ");
    throw new Error(`Metafield update failed: ${errors}`);
  }

  return result;
}

/**
 * Get widget settings from metafield
 */
export async function getWidgetMetafield(admin) {
  const query = `
    query GetWidgetSettings {
      shop {
        metafield(namespace: "${METAFIELD_NAMESPACE}", key: "${METAFIELD_KEY}") {
          id
          namespace
          key
          value
          type
        }
      }
    }
  `;

  const response = await admin.graphql(query);
  const data = await response.json();

  const metafield = data.data?.shop?.metafield;

  if (!metafield || !metafield.value) {
    return null;
  }

  try {
    return JSON.parse(metafield.value);
  } catch (error) {
    console.error("Failed to parse metafield value:", error);
    return null;
  }
}

/**
 * Delete widget settings metafield
 */
export async function deleteWidgetMetafield(admin, shopId) {
  const mutation = `
    mutation DeleteWidgetSettings($metafields: [MetafieldsDeleteInput!]!) {
      metafieldsDelete(metafields: $metafields) {
        deletedMetafields {
          ownerId
          namespace
          key
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
          namespace: METAFIELD_NAMESPACE,
          key: METAFIELD_KEY,
        },
      ],
    },
  });

  const result = await response.json();

  if (result.data?.metafieldsDelete?.userErrors?.length > 0) {
    const errors = result.data.metafieldsDelete.userErrors
      .map(e => `${e.field}: ${e.message}`)
      .join(", ");
    throw new Error(`Metafield deletion failed: ${errors}`);
  }

  return result;
}