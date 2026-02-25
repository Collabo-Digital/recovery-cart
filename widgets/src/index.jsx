import { render } from 'solid-js/web';
import { createSignal, onMount, Show } from 'solid-js';
import WhatsAppButton from './components/WhatsAppButton';
import { WIDGET_NAMESPACE } from './config/defaults';

const CONFIG_READY_EVENT = 'RECOVERY_CART_CONFIG_LOADED';

const DEMO_CONFIG = {
  shop: 'demo-store.myshopify.com',
  isActive: true,
  widgetSettings: {
    position: 'bottom-right',
    phoneNumber: '+1234567890',
    buttonText: 'Chat with us on WhatsApp',
    buttonColor: { hue: 142, saturation: 0.77, brightness: 0.75 },
    chatText: 'Hi! I need help.',
  },
};

const isDev = () =>
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1';

/**
 * Root: wait for config (already on window or via event), then render widget.
 * Like a useEffect that watches for config and then renders.
 */
function RecoveryCartRoot() {
  const [configReady, setConfigReady] = createSignal(!!window[WIDGET_NAMESPACE]);

  onMount(() => {
    if (configReady()) return;

    if (isDev()) {
      window[WIDGET_NAMESPACE] = DEMO_CONFIG;
      setConfigReady(true);
      return;
    }

    const onReady = () => {
      window.removeEventListener(CONFIG_READY_EVENT, onReady);
      setConfigReady(true);
    };
    window.addEventListener(CONFIG_READY_EVENT, onReady);
  });

  return (
    <Show when={configReady()} fallback={null}>
      <WhatsAppButton />
    </Show>
  );
}

function init() {
  try {
    if (document.getElementById('recovery-cart-widget')) return;
    const container = document.createElement('div');
    container.id = 'recovery-cart-widget';
    document.body.appendChild(container);
    render(() => <RecoveryCartRoot />, container);
  } catch (err) {
    console.error('[Recovery Cart] Init failed:', err);
  }
}

function runWhenReady(fn) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', fn);
  } else {
    fn();
  }
}

runWhenReady(init);

export { init }; 