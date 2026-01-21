/**
 * Preview Template Generator
 * Creates the HTML for the widget preview iframe
 */

/**
 * Generate preview HTML with injected widget script
 * @param {string} widgetScript - The widget bundle JavaScript code
 * @returns {string} Complete HTML document
 */
export function generatePreviewHTML(widgetScript) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Widget Preview</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      overflow: hidden;
    }
    .preview-container {
      width: 100%;
      max-width: 400px;
      height: 100%;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      position: relative;
      overflow: hidden;
    }
    .preview-header {
      background: #f7f7f7;
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
      text-align: center;
    }
    .preview-header h3 {
      font-size: 14px;
      color: #666;
      font-weight: 500;
    }
    .preview-content {
      height: calc(100% - 50px);
      background: white;
      position: relative;
    }
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-header">
      <h3>Live Widget Preview</h3>
    </div>
    <div class="preview-content"></div>
  </div>

  <!-- Widget Bundle -->
  <script>${widgetScript}</script>
  
  <!-- Preview Controller -->
  <script>
    console.log('[Preview] Widget loaded:', !!window.RecoveryCartWidget);

    // Listen for config updates from parent
    window.addEventListener('message', function(event) {
      if (event.data?.type === 'WIDGET_CONFIG_UPDATE') {
        const config = event.data.config;
        
        // Ensure defaults for preview
        if (!config.phoneNumber?.trim()) {
          config.phoneNumber = '+1234567890';
        }
        
        // Set global config
        window.__recovery_cart_config__ = {
          shop: 'preview.myshopify.com',
          isActive: true,
          widgetSettings: config
        };
        
        // Remove old widget
        const old = document.getElementById('recovery-cart-widget');
        if (old) old.remove();
        
        // Reinitialize
        setTimeout(() => {
          if (window.RecoveryCartWidget?.init) {
            window.RecoveryCartWidget.init();
            console.log('[Preview] Widget updated');
          }
        }, 50);
      }
    });

    // Notify parent iframe is ready
    window.addEventListener('load', () => {
      if (window.parent !== window) {
        window.parent.postMessage({ type: 'IFRAME_READY' }, '*');
      }
    });
  </script>
</body>
</html>`;
}
