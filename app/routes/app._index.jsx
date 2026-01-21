import { useState, useEffect } from "react";
import { useLoaderData, useActionData, useNavigation, useSubmit } from "react-router";
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
  Button,
  InlineStack,
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
  try {
    const { session, admin } = await authenticate.admin(request);
    let widgetSettings = await getWidgetSettings(session.shop);

    if (!widgetSettings) {
      widgetSettings = await createDefaultSettings(session.shop);
      try {
        const shopId = await getShopId(admin);
        await updateWidgetMetafield(admin, shopId, DEFAULT_SETTINGS);
      } catch (metafieldError) {
        console.error("Error creating default metafield:", metafieldError);
      }
    }

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
  try {
    const { session, admin } = await authenticate.admin(request);
    const formData = await request.formData();

    const settingsData = {
      position: formData.get("position"),
      phoneNumber: formData.get("phoneNumber") || "",
      buttonText: formData.get("buttonText"),
      buttonColor: JSON.parse(formData.get("buttonColor")),
      chatText: formData.get("chatText"),
    };

    const updatedSettings = await updateWidgetSettings(session.shop, settingsData);

    try {
      const shopId = await getShopId(admin);
      await updateWidgetMetafield(admin, shopId, settingsData);
    } catch (metafieldError) {
      return {
        success: true,
        warning: "Settings saved but metafield update failed",
        settings: updatedSettings,
      };
    }

    return {
      success: true,
      message: "Settings saved successfully",
      settings: updatedSettings,
    };
  } catch (error) {
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
  const submit = useSubmit();

  // Form state
  const [position, setPosition] = useState(initialSettings.position);
  const [phoneNumber, setPhoneNumber] = useState(initialSettings.phoneNumber || "");
  const [buttonText, setButtonText] = useState(initialSettings.buttonText);
  const [buttonColor, setButtonColor] = useState(initialSettings.buttonColor);
  const [chatText, setChatText] = useState(initialSettings.chatText);

  const isLoading = navigation.state === "submitting";

  const positionOptions = [
    { label: "Bottom Right", value: "bottom-right" },
    { label: "Bottom Left", value: "bottom-left" },
  ];

  // Correct way to handle submission in Remix/React Router
  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("position", position);
    formData.append("phoneNumber", phoneNumber);
    formData.append("buttonText", buttonText);
    formData.append("buttonColor", JSON.stringify(buttonColor));
    formData.append("chatText", chatText);

    // This calls the 'action' function above
    submit(formData, { method: "POST" });
  };

  const handleReset = () => {
    setPosition(initialSettings.position);
    setPhoneNumber(initialSettings.phoneNumber || "");
    setButtonText(initialSettings.buttonText);
    setButtonColor(initialSettings.buttonColor);
    setChatText(initialSettings.chatText);
  };

  // Listen for action results
  useEffect(() => {
    if (actionData) {
      if (actionData.success) {
        shopify.toast.show(actionData.message || "Settings saved successfully");
      } else if (actionData.error) {
        shopify.toast.show(actionData.error, { isError: true });
      } else if (actionData.warning) {
        shopify.toast.show(actionData.warning);
      }
    }
  }, [actionData, shopify]);

  const hsbToHex = (hsb) => {
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
  };

  return (
    <Page title="WhatsApp Widget Settings">
      <BlockStack gap="400">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">Widget Configuration</Text>
                <FormLayout>
                  <Select
                    label="Widget Position"
                    options={positionOptions}
                    value={position}
                    onChange={setPosition}
                    disabled={isLoading}
                  />
                  <TextField
                    label="WhatsApp Phone Number"
                    type="tel"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    placeholder="+1234567890"
                    autoComplete="tel"
                    disabled={isLoading}
                  />
                  <TextField
                    label="Button Text"
                    value={buttonText}
                    onChange={setButtonText}
                    placeholder="Chat with us"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  <TextField
                    label="Chat Text"
                    value={chatText}
                    onChange={setChatText}
                    placeholder="I'm interested in the product"
                    autoComplete="off"
                    disabled={isLoading}
                  />
                  <Box>
                    <BlockStack gap="200">
                      <Text variant="bodyMd" as="p" fontWeight="medium">Button Color</Text>
                      <ColorPicker onChange={setButtonColor} color={buttonColor} />
                    </BlockStack>
                  </Box>
                </FormLayout>

                <InlineStack gap="300" align="end">
                  <Button onClick={handleReset} disabled={isLoading}>Discard</Button>
                  <Button variant="primary" onClick={handleSubmit} loading={isLoading}>
                    Save Settings
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          <Layout.Section variant="oneThird">
            <BlockStack gap="400">
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">Preview</Text>
                  <Box padding="400" background="bg-surface-secondary" borderRadius="200" minHeight="150px" position="relative">
                    <Box
                      position="absolute"
                      insetBlockEnd="400"
                      insetInlineEnd={position === "bottom-right" ? "400" : undefined}
                      insetInlineStart={position === "bottom-left" ? "400" : undefined}
                      padding="200"
                      style={{ backgroundColor: hsbToHex(buttonColor), borderRadius: '20px', color: 'white' }}
                    >
                      <Text as="span">{buttonText || "Chat with us"}</Text>
                    </Box>
                  </Box>
                  <Text variant="bodySm" as="p" tone="subdued">Color: {hsbToHex(buttonColor)}</Text>
                </BlockStack>
              </Card>

              <Card>
                <BlockStack gap="200">
                  <Text variant="headingMd" as="h2">Setup Guide</Text>
                  <Text variant="bodySm" as="p">1. Add your WhatsApp number</Text>
                  <Text variant="bodySm" as="p">2. Choose position and text</Text>
                  <Text variant="bodySm" as="p">3. Save and check your storefront</Text>
                </BlockStack>
              </Card>

              <Banner tone="info">
                <Text variant="bodySm" as="p">
                  Ensure the "App Embed" is enabled in your Theme Editor for the widget to appear.
                </Text>
              </Banner>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </BlockStack>
    </Page>
  );
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};