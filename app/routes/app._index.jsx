import { useState, useEffect, useRef } from "react";
import { useLoaderData, useActionData, useNavigation, Form } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { boundary } from "@shopify/shopify-app-react-router/server";
import {
  Page,
  Layout,
  Card,
  FormLayout,
  Select,
  TextField,
  ColorPicker,
  BlockStack,
  Text,
  Banner,
  Box,
} from "@shopify/polaris";
import { authenticate } from "../shopify.server";
import {
  DEFAULT_SETTINGS,
  getWidgetSettings,
  createDefaultSettings,
  updateWidgetSettings,
} from "../utils/widgetSettings.server";
import { getShopId, updateWidgetMetafield } from "../utils/metafield.server";

// Loader: Fetch existing widget settings
export const loader = async ({ request }) => {
  console.log("=== LOADER START ===");
  
  try {
    const { session, admin } = await authenticate.admin(request);
    console.log("Session authenticated:", session.shop);

    // Get or create widget settings
    let widgetSettings = await getWidgetSettings(session.shop);

    if (!widgetSettings) {
      console.log("No settings found, creating defaults");
      widgetSettings = await createDefaultSettings(session.shop);

      // Also create default metafield
      try {
        const shopId = await getShopId(admin);
        await updateWidgetMetafield(admin, shopId, DEFAULT_SETTINGS);
        console.log("Default metafield created");
      } catch (metafieldError) {
        console.error("Error creating default metafield:", metafieldError);
        // Don't fail the loader if metafield creation fails
      }
    }

    console.log("Returning settings:", widgetSettings);
    return {
      settings: widgetSettings,
      shop: session.shop,
    };
  } catch (error) {
    console.error("Loader error:", error);
    throw error;
  }
};

// Action: Save widget settings
export const action = async ({ request }) => {
  console.log("=== ACTION START ===");
  
  try {
    const { session, admin } = await authenticate.admin(request);
    console.log("✅ Session authenticated:", session.shop);

    const formData = await request.formData();
    console.log("📥 Form data received");

    const settingsData = {
      position: formData.get("position"),
      phoneNumber: formData.get("phoneNumber") || "",
      buttonText: formData.get("buttonText"),
      buttonColor: JSON.parse(formData.get("buttonColor")),
    };

    console.log("💾 Saving settings:", settingsData);

    // Update database
    const updatedSettings = await updateWidgetSettings(session.shop, settingsData);
    console.log("✅ Database updated successfully:", updatedSettings.id);

    // Update metafield
    try {
      const shopId = await getShopId(admin);
      await updateWidgetMetafield(admin, shopId, settingsData);
      console.log("✅ Metafield updated successfully");
    } catch (metafieldError) {
      console.error("❌ Metafield error:", metafieldError);
      return {
        success: true,
        warning: "Settings saved but metafield update failed",
        settings: updatedSettings,
      };
    }

    console.log("=== ACTION SUCCESS ===");
    return {
      success: true,
      message: "Settings saved successfully",
      settings: updatedSettings,
    };
  } catch (error) {
    console.error("=== ACTION ERROR ===");
    console.error("Error:", error);
    return {
      success: false,
      error: error.message || "Failed to save settings",
    };
  }
};

export default function WidgetSettings() {
  const { settings: initialSettings, shop } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();
  const shopify = useAppBridge();
  const formRef = useRef(null);

  // Form state
  const [position, setPosition] = useState(initialSettings.position);
  const [phoneNumber, setPhoneNumber] = useState(initialSettings.phoneNumber || "");
  const [buttonText, setButtonText] = useState(initialSettings.buttonText);
  const [buttonColor, setButtonColor] = useState(initialSettings.buttonColor);

  const isLoading = navigation.state === "submitting";

  // Position options for dropdown
  const positionOptions = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
  ];

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitting");
    // The form will submit automatically via React Router Form
  };

  // Handle form reset (discard)
  const handleReset = (event) => {
    console.log("Form resetting");
    setPosition(initialSettings.position);
    setPhoneNumber(initialSettings.phoneNumber || "");
    setButtonText(initialSettings.buttonText);
    setButtonColor(initialSettings.buttonColor);
  };

  // Handle action result (success/error messages)
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        shopify.toast.show(actionData.message || "Settings saved successfully");
        // Reset form state to match saved data
        if (actionData.settings) {
          setPosition(actionData.settings.position);
          setPhoneNumber(actionData.settings.phoneNumber || "");
          setButtonText(actionData.settings.buttonText);
          setButtonColor(actionData.settings.buttonColor);
        }
      } else if (actionData.error) {
        shopify.toast.show(actionData.error, { isError: true });
      }
    }
  }, [actionData, shopify]);

  // Convert HSB to hex for preview
  const hsbToHex = (hsb) => {
    const { hue, saturation, brightness } = hsb;
    const h = hue;
    const s = saturation;
    const v = brightness;

    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;

    let r, g, b;
    if (h < 60) {
      [r, g, b] = [c, x, 0];
    } else if (h < 120) {
      [r, g, b] = [x, c, 0];
    } else if (h < 180) {
      [r, g, b] = [0, c, x];
    } else if (h < 240) {
      [r, g, b] = [0, x, c];
    } else if (h < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }

    const toHex = (val) => {
      const hex = Math.round((val + m) * 255).toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  return (
    <Page
      title="WhatsApp Widget Settings"
      subtitle={`Shop: ${shop}`}
    >
      <Form 
        method="post" 
        data-save-bar
        data-discard-confirmation
        onSubmit={handleSubmit}
        onReset={handleReset}
        ref={formRef}
      >
        <BlockStack gap="400">
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Widget Configuration
                  </Text>

                  <FormLayout>
                    <input type="hidden" name="position" value={position} />
                    <input type="hidden" name="phoneNumber" value={phoneNumber} />
                    <input type="hidden" name="buttonText" value={buttonText} />
                    <input type="hidden" name="buttonColor" value={JSON.stringify(buttonColor)} />

                    <Select
                      label="Widget Position"
                      options={positionOptions}
                      value={position}
                      onChange={setPosition}
                      helpText="Choose where the WhatsApp button appears on your store"
                      disabled={isLoading}
                    />

                    <TextField
                      label="WhatsApp Phone Number"
                      type="tel"
                      value={phoneNumber}
                      onChange={setPhoneNumber}
                      placeholder="+1234567890"
                      helpText="Include country code (e.g., +1 for US, +91 for India)"
                      autoComplete="tel"
                      disabled={isLoading}
                    />

                    <TextField
                      label="Button Text"
                      value={buttonText}
                      onChange={setButtonText}
                      placeholder="Chat with us"
                      helpText="Text displayed on the widget button"
                      autoComplete="off"
                      disabled={isLoading}
                    />

                    <Box>
                      <BlockStack gap="200">
                        <Text variant="bodyMd" as="p" fontWeight="medium">
                          Button Color
                        </Text>
                        <ColorPicker
                          onChange={setButtonColor}
                          color={buttonColor}
                          disabled={isLoading}
                        />
                        <Text variant="bodySm" as="p" tone="subdued">
                          Choose a color for your WhatsApp button
                        </Text>
                      </BlockStack>
                    </Box>
                  </FormLayout>
                </BlockStack>
              </Card>
            </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Preview
                  </Text>

                  <Box
                    padding="400"
                    background="bg-surface-secondary"
                    borderRadius="200"
                    minHeight="200px"
                    position="relative"
                  >
                    <Box
                      position="absolute"
                      insetBlockEnd="400"
                      insetInlineEnd={
                        position === "bottom-right" ? "400" : undefined
                      }
                      insetInlineStart={
                        position === "bottom-left" ? "400" : undefined
                      }
                      padding="300"
                      background="bg-fill"
                      borderRadius="full"
                      shadow="md"
                    >
                      <Text as="span" tone="magic">
                        {buttonText || "Chat with us"}
                      </Text>
                    </Box>
                  </Box>

                  <Text variant="bodySm" as="p" tone="subdued">
                    Color: {hsbToHex(buttonColor)}
                  </Text>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">
                    Setup Guide
                  </Text>
                  <Text variant="bodySm" as="p">
                    1. Add your WhatsApp Business number
                  </Text>
                  <Text variant="bodySm" as="p">
                    2. Choose the widget position
                  </Text>
                  <Text variant="bodySm" as="p">
                    3. Customize the button appearance
                  </Text>
                  <Text variant="bodySm" as="p">
                    4. Click Save to apply changes
                  </Text>
                </BlockStack>
              </Card>

              <Banner tone="info">
                <Text variant="bodySm" as="p">
                  The widget will appear on your storefront after you save these
                  settings and install the theme extension.
                </Text>
              </Banner>

              {isLoading && (
                <Banner tone="warning">
                  <Text variant="bodySm" as="p">
                    Saving settings...
                  </Text>
                </Banner>
              )}
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Form>
    </Page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
