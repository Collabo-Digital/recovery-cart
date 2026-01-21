import { useRef, useEffect, useState } from "react";
import { Card, BlockStack, Text, Box } from "@shopify/polaris";

/**
 * Widget Preview Component
 * Shows a live preview of the WhatsApp widget in an iframe
 * Updates in real-time when settings change
 */
export function WidgetPreview({ config, colorHex }) {
  const iframeRef = useRef(null);
  const [iframeReady, setIframeReady] = useState(false);

  // Listen for iframe ready message
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data?.type === 'IFRAME_READY') {
        console.log('[Preview] Iframe is ready');
        setIframeReady(true);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Send config updates to iframe
  useEffect(() => {
    if (iframeReady && iframeRef.current?.contentWindow) {
      console.log('[Preview] Sending config:', config);
      
      try {
        iframeRef.current.contentWindow.postMessage(
          {
            type: 'WIDGET_CONFIG_UPDATE',
            config,
          },
          '*'
        );
      } catch (error) {
        console.error('[Preview] Failed to send config:', error);
      }
    }
  }, [config, iframeReady]);

  return (
    <Card>
      <BlockStack gap="400">
        <Text variant="headingMd" as="h2">
          Live Preview
        </Text>
        
        <Box 
          borderRadius="200" 
          overflow="hidden"
          style={{
            border: '1px solid #e0e0e0',
            height: '300px',
            position: 'relative'
          }}
        >
          <iframe
            ref={iframeRef}
            src="/widget-preview"
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block'
            }}
            title="Widget Preview"
          />
        </Box>
        
        <Text variant="bodySm" as="p" tone="subdued">
          Changes update in real-time • Color: {colorHex}
        </Text>
      </BlockStack>
    </Card>
  );
}
