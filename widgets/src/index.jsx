import { render } from 'solid-js/web';
import WhatsAppButton from './components/WhatsAppButton';
import { WIDGET_NAMESPACE } from './config/defaults';

/**
 * Recovery Cart WhatsApp Widget
 * Simple, modular implementation
 */

// Demo config for development
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
      brightness: 0.75,
    },
    chatText: 'Hi! I need help.',
  },
};

/**
 * Check if running in development
 */
const isDev = () => {
  return (
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1'
  );
};

/**
 * Initialize widget
 */
function init() {
  console.log('init');
  try {
    // Use demo config in development if config not found
    if (!window[WIDGET_NAMESPACE] && isDev()) {
      console.warn('[Recovery Cart] Using demo config for development');
      window[WIDGET_NAMESPACE] = DEMO_CONFIG;
    }

    // Check if config exists
    if (!window[WIDGET_NAMESPACE]) {
      console.error('[Recovery Cart] Config not found. Add app embed to theme.');
      return;
    }

    // Create container
    const container = document.createElement('div');
    container.id = 'recovery-cart-widget';
    document.body.appendChild(container);

    // Render widget
    render(() => <WhatsAppButton />, container);
  } catch (err) {
    console.error('[Recovery Cart] Init failed:', err);
  }
}

// Auto-init when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

export { init };
