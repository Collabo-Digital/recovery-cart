import { createSignal, onMount, Show } from 'solid-js';
import { validateConfig } from '../utils/validation';
import { sanitizePhone, hsbToRgb, buildWhatsAppUrl, log } from '../utils/helpers';
import { DEFAULT_CONFIG, WIDGET_NAMESPACE } from '../config/defaults';
import './WhatsAppButton.css';

/**
 * WhatsApp Widget Button Component
 */
function WhatsAppButton() {
  const [config, setConfig] = createSignal(null);
  const [visible, setVisible] = createSignal(false);

  // Initialize on mount
  onMount(() => {
    try {
      console.log('[WhatsAppButton] Starting mount...');
      // Get config from window
      const appConfig = window[WIDGET_NAMESPACE];
      console.log('[WhatsAppButton] appConfig:', appConfig);
      
      if (!appConfig) {
        log('error', 'Config not found');
        console.log('[WhatsAppButton] No config found');
        return;
      }


      // Check settings exist
      if (!appConfig.widgetSettings) {
        log('error', 'Settings missing');
        console.log('[WhatsAppButton] Settings missing');
        return;
      }

      // Validate
      const validation = validateConfig(appConfig.widgetSettings);
      console.log('[WhatsAppButton] Validation result:', validation);
      if (!validation.valid) {
        log('error', 'Invalid config', validation.errors.join(', '));
        console.log('[WhatsAppButton] Invalid config:', validation.errors);
        return;
      }

      // Merge with defaults
      const finalConfig = {
        ...DEFAULT_CONFIG,
        ...appConfig.widgetSettings,
      };
      console.log('[WhatsAppButton] Final config:', finalConfig);

      setConfig(finalConfig);
      setVisible(true);
      console.log('[WhatsAppButton] Config and visible set to true');
      log('log', 'Widget ready');
    } catch (err) {
      console.error('[WhatsAppButton] Init error:', err);
      log('error', 'Init failed', err.message);
    }
  });

  // Get button background color
  const getButtonStyle = () => {
    const cfg = config();
    if (!cfg?.buttonColor) {
      return { 'background-color': 'rgb(37, 211, 102)' };
    }

    const { r, g, b } = hsbToRgb(cfg.buttonColor);
    return { 'background-color': `rgb(${r}, ${g}, ${b})` };
  };

  // Handle click - open WhatsApp
  const handleClick = () => {
    const cfg = config();
    if (!cfg?.phoneNumber) return;

    try {
      const phone = sanitizePhone(cfg.phoneNumber);
      const url = buildWhatsAppUrl(phone, cfg.chatText);
      
      const newWindow = window.open(url, '_blank');
      
      if (!newWindow) {
        window.location.href = url;
      }

      log('log', 'WhatsApp opened');
    } catch (err) {
      log('error', 'Open failed', err.message);
    }
  };

  // Check if button text exists
  const hasButtonText = () => {
    const cfg = config();
    return cfg?.buttonText && cfg.buttonText.trim().length > 0;
  };
  
  return (
    <Show when={ config()}>
      <div className="recovery-cart">
        <button
          className={`whatsapp-widget ${config().position} ${!hasButtonText() ? 'icon-only' : ''}`}
          style={getButtonStyle()}
          onClick={handleClick}
          aria-label={hasButtonText() ? config().buttonText : 'Chat on WhatsApp'}
          title={hasButtonText() ? config().buttonText : 'Chat on WhatsApp'}
          type="button"
        >
          <svg
            className="whatsapp-icon"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"
              fill="white"
            />
          </svg>
          <Show when={hasButtonText()}>
            <span className="whatsapp-text">{config().buttonText}</span>
          </Show>
        </button>
      </div>
    </Show>
  );
}

export default WhatsAppButton;
