import { authenticate } from "../shopify.server";
import {
  updateWidgetSettings,
} from "../utils/widgetSettings.server";
import { getShopId, updateWidgetMetafield } from "../utils/metafield.server";

/**
 * POST /api/settings - Save widget settings
 */
// export const action = async ({ request }) => {
//   // Only allow POST requests
//   if (request.method !== "POST") {
//     return Response.json({ error: "Method not allowed" }, { status: 405 });
//   }

//   console.log("=== API SETTINGS POST START ===");

//   try {
//     // Authenticate the request
//     const { session, admin } = await authenticate.admin(request);
//     console.log("✅ Session authenticated:", session.shop);

//     // Parse the request body
//     const body = await request.json();
//     console.log("📥 Request body:", body);

//     // Validate required fields
//     if (!body.position || !body.buttonText) {
//       return Response.json(
//         { success: false, error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     // Prepare settings data
//     const settingsData = {
//       position: body.position,
//       phoneNumber: body.phoneNumber || "",
//       buttonText: body.buttonText,
//       buttonColor: body.buttonColor,
//     };

//     console.log("💾 Saving settings:", settingsData);

//     // Save to database
//     const updatedSettings = await updateWidgetSettings(
//       session.shop,
//       settingsData
//     );
//     console.log("✅ Database updated successfully:", updatedSettings.id);

//     // Save to metafield
//     try {
//       console.log("🔄 Getting Shop ID...");
//       const shopId = await getShopId(admin);
//       console.log("✅ Shop ID:", shopId);

//       console.log("🔄 Updating metafield...");
//       await updateWidgetMetafield(admin, shopId, settingsData);
//       console.log("✅ Metafield updated successfully");
//     } catch (metafieldError) {
//       console.error("❌ Metafield error:", metafieldError);
//       // Return partial success
//       return Response.json({
//         success: true,
//         warning: "Settings saved to database but metafield update failed",
//         settings: updatedSettings,
//       });
//     }

//     console.log("=== API SETTINGS POST SUCCESS ===");

//     // Return success response
//     return Response.json({
//       success: true,
//       message: "Settings saved successfully",
//       settings: updatedSettings,
//     });
//   } catch (error) {
//     console.error("=== API SETTINGS POST ERROR ===");
//     console.error("Error:", error);

//     return Response.json(
//       {
//         success: false,
//         error: error.message || "Failed to save settings",
//       },
//       { status: 500 }
//     );
//   }
// };

export const action = async ({ request }) => {
  // Only allow POST requests
  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  console.log("=== API SETTINGS POST START ===");

  try {
    // IMPORTANT: Clone the request BEFORE authentication
    // because authenticate.admin() consumes the request body
    const requestClone = request.clone();
    
    // Authenticate the request
    const { session, admin } = await authenticate.admin(request);
    
    // Check if authentication was successful
    if (!session || !admin) {
      console.error("❌ Authentication failed - no session or admin");
      return Response.json(
        { success: false, error: "Authentication failed" },
        { status: 401 }
      );
    }
    
    console.log("✅ Session authenticated:", session.shop);

    // Parse the request body from the cloned request
    const body = await requestClone.json();
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

    // Handle specific authentication errors
    if (error.message?.includes("Session") || error.message?.includes("authentication")) {
      return Response.json(
        {
          success: false,
          error: "Session expired. Please refresh the page and try again.",
        },
        { status: 401 }
      );
    }

    return Response.json(
      {
        success: false,
        error: error.message || "Failed to save settings",
      },
      { status: 500 }
    );
  }
};
