import { authenticate } from "../shopify.server";
import {
  updateWidgetSettings,
} from "../utils/widgetSettings.server";
import { getShopId, updateWidgetMetafield } from "../utils/metafield.server";

/**
 * POST /api/settings - Save widget settings
 */
export const action = async ({ request }) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  console.log("=== API SETTINGS POST START ===");

  try {
    // Authenticate the request
    const { session, admin } = await authenticate.admin(request);
    console.log("✅ Session authenticated:", session.shop);

    // Parse the request body
    const body = await request.json();
    console.log("📥 Request body:", body);

    // Validate required fields
    if (!body.position || !body.buttonText) {
      return Response.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Prepare settings data
    const settingsData = {
      position: body.position,
      phoneNumber: body.phoneNumber || "",
      buttonText: body.buttonText,
      buttonColor: body.buttonColor,
    };

    console.log("💾 Saving settings:", settingsData);

    // Save to database
    const updatedSettings = await updateWidgetSettings(
      session.shop,
      settingsData
    );
    console.log("✅ Database updated successfully:", updatedSettings.id);

    // Save to metafield
    try {
      console.log("🔄 Getting Shop ID...");
      const shopId = await getShopId(admin);
      console.log("✅ Shop ID:", shopId);

      console.log("🔄 Updating metafield...");
      await updateWidgetMetafield(admin, shopId, settingsData);
      console.log("✅ Metafield updated successfully");
    } catch (metafieldError) {
      console.error("❌ Metafield error:", metafieldError);
      // Return partial success
      return Response.json({
        success: true,
        warning: "Settings saved to database but metafield update failed",
        settings: updatedSettings,
      });
    }

    console.log("=== API SETTINGS POST SUCCESS ===");

    // Return success response
    return Response.json({
      success: true,
      message: "Settings saved successfully",
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("=== API SETTINGS POST ERROR ===");
    console.error("Error:", error);

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to save settings",
      },
      { status: 500 }
    );
  }
};
