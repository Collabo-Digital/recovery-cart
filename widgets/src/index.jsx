import { render } from 'solid-js/web';
import WhatsAppWidget from './WhatsAppWidget';

/**
 * Demo/Fallback configuration for development
 * This is used when running the widget standalone (npm run dev)
 */
const DEMO_CONFIG = {
  shop: 'demo-store.myshopify.com',
  isActive: true,
  widgetSettings: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us on WhatsApp',
    buttonColor: {
      hue: 142,
      saturation: 0.77,
      brightness: 0.75
    }
  }
};

/**
 * Initialize the Recovery Cart WhatsApp Widget
 * This function is called from the Liquid template
 */
function initRecoveryCartWidget() {
  // Check if config exists, otherwise use demo config
  if (!window.__recovery_cart_config__) {
    console.warn('Recovery Cart Widget: Config not found. Using demo config for development.');
    console.warn('Make sure app-config block/snippet is added to theme in production.');
    
    // Use demo config for development/testing
    window.__recovery_cart_config__ = DEMO_CONFIG;
  }

  // Check if widget is active
  if (!window.__recovery_cart_config__.isActive) {
    console.log('Recovery Cart Widget: Widget is disabled');
    return;
  }

  // Check if widget settings exist
  if (!window.__recovery_cart_config__.widgetSettings) {
    console.error('Recovery Cart Widget: Widget settings not found in config');
    return;
  }

  // Create container for the widget
  const container = document.createElement('div');
  container.id = 'recovery-cart-widget-root';
  document.body.appendChild(container);

  // Render the SolidJS widget
  render(() => <WhatsAppWidget />, container);

  console.log('Recovery Cart Widget: Initialized successfully');
  console.log('Config:', window.__recovery_cart_config__);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initRecoveryCartWidget);
} else {
  initRecoveryCartWidget();
}

// Export for manual initialization if needed
export { initRecoveryCartWidget, WhatsAppWidget };
