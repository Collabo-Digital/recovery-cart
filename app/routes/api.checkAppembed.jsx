import { authenticate } from "../shopify.server";

const APP_API_KEY = process.env.SHOPIFY_API_KEY || "";
const APP_EMBED_HANDLE = "app_config";

function buildDeepLinkUrl(shop) {
  return `https://${shop}/admin/themes/current/editor?context=apps&template=index&activateAppId=${APP_API_KEY}/${APP_EMBED_HANDLE}`;
}

/**
 * POST /api/checkAppembed - Check if app embed is enabled on the main theme
 */
export const action = async ({ request }) => {
  try {
    const { session, admin } = await authenticate.admin(request);

    if (!session) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Unauthorized",
          appEmbedEnabled: false,
        }),
        { status: 401 }
      );
    }

    const deepLinkUrl = buildDeepLinkUrl(session.shop);

    console.log("✅ Checking app embed status for:", session.shop);

    // 1. Get the main (published) theme via GraphQL (your existing logic, slightly cleaned up)
    const mainThemeResponse = await admin.graphql(`
      #graphql
      query MainTheme {
        themes(first: 1, roles: [MAIN]) {
          edges {
            node {
              id
              name
              role
            }
          }
        }
      }
    `);

    const mainThemeData = await mainThemeResponse.json();
    const mainTheme = mainThemeData.data?.themes?.edges?.[0]?.node;

    if (!mainTheme) {
      console.log("❌ No main theme found");
      return new Response(
        JSON.stringify({
          disabled: true,
          deepLinkUrl,
          error: "No main theme found",
        }),
        { status: 404 }
      );
    }

    console.log("✅ Main theme found:", {
      id: mainTheme.id,
      name: mainTheme.name,
      role: mainTheme.role,
    });

    // mainTheme.id is a GID like "gid://shopify/Theme/123456789"
    const themeId = mainTheme.id.split("/").pop();

    // 2. Use REST Admin API via fetch to get config/settings_data.json
    const settingsUrl = `https://${session.shop}/admin/api/2024-10/themes/${themeId}/assets.json?asset[key]=config/settings_data.json`;

    let settingsResponse;
    try {
      settingsResponse = await fetch(settingsUrl, {
        method: "GET",
        headers: {
          "X-Shopify-Access-Token": session.accessToken,
          "Content-Type": "application/json",
        },
      });
    } catch (e) {
      console.error("❌ Network error fetching settings_data.json:", e);
      return new Response(
        JSON.stringify({
          disabled: true,
          deepLinkUrl,
          error: "Network error fetching settings_data.json",
        }),
        { status: 500 }
      );
    }

    if (!settingsResponse.ok) {
      console.error(
        "❌ Shopify API error fetching settings_data.json:",
        settingsResponse.status,
        await settingsResponse.text()
      );
      return new Response(
        JSON.stringify({
          disabled: true,
          deepLinkUrl,
          error: `Shopify API error ${settingsResponse.status}`,
        }),
        { status: 500 }
      );
    }

    const settingsJson = await settingsResponse.json();
    const asset = settingsJson.asset;

    if (!asset || !asset.value) {
      console.log("❌ settings_data.json has no value");
      return new Response(
        JSON.stringify({
          disabled: true,
          deepLinkUrl,
          error: "settings_data.json missing or empty",
        }),
        { status: 200 }
      );
    }

    // 3. Parse settings_data.json and detect your app embed block(s)
    let settingsData;
    try {
      settingsData = JSON.parse(asset.value);
    } catch (parseError) {
      console.error("❌ Error parsing settings_data.json:", parseError);
      return new Response(
        JSON.stringify({
          disabled: true,
          deepLinkUrl,
          error: "Failed to parse settings_data.json",
        }),
        { status: 500 }
      );
    }

    const blocks = settingsData?.current?.blocks || {};

    let disabled = true; // Default to true (disabled/not found)

    // Find our recovery-cart app_config block
    for (const [blockId, block] of Object.entries(blocks)) {
      const type = block.type;

      if (typeof type !== "string") continue;

      // Check if the block type matches our app embed
      if (type.startsWith("shopify://apps/recovery-cart/blocks/app_config/")) {
        console.log("📊 Found app embed block:", {
          blockId,
          type,
          disabled: block.disabled,
        });
        
        // Return the actual disabled value from the block
        // block.disabled can be true, false, or undefined
        // If undefined or not explicitly false, consider it disabled
        disabled = block.disabled !== false;
        break; // Use the first matching block
      }
    }

    console.log("✅ Final disabled status:", disabled);

    return new Response(
      JSON.stringify({
        disabled,
        deepLinkUrl,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error checking app embed:", error);
    return new Response(
      JSON.stringify({
        disabled: true,
        error: error.message || "Unknown error",
      }),
      { status: 500 }
    );

  }
};