import { ANALYTICS_CONFIG, isMetaConfigured } from '../../../utils/analyticsConfig';
import { META_EVENT_MAP } from '../eventMap';

let AppEventsLogger = null;
let Settings = null;
let loaded = false;

const loadMetaSdk = () => {
  if (loaded) return Boolean(AppEventsLogger);
  loaded = true;
  try {
    // eslint-disable-next-line global-require
    const sdk = require('react-native-fbsdk-next');
    AppEventsLogger = sdk.AppEventsLogger;
    Settings = sdk.Settings;
    return true;
  } catch (e) {
    console.warn('[analytics:meta] SDK not installed', e?.message || e);
    return false;
  }
};

export const initMetaAnalytics = async () => {
  if (!isMetaConfigured()) {
    if (__DEV__) {
      console.log('[analytics:meta] skipped — set appId/clientToken in analyticsConfig.js');
    }
    return;
  }
  if (!loadMetaSdk()) return;

  try {
    Settings.setAppID(ANALYTICS_CONFIG.meta.appId);
    if (ANALYTICS_CONFIG.meta.clientToken) {
      Settings.setClientToken?.(ANALYTICS_CONFIG.meta.clientToken);
    }
    Settings.initializeSDK();
    Settings.setAutoLogAppEventsEnabled(true);
    Settings.setAdvertiserIDCollectionEnabled(true);
    if (__DEV__) console.log('[analytics:meta] SDK initialized');
  } catch (e) {
    console.warn('[analytics:meta] init failed', e?.message || e);
  }
};

export const setMetaUserId = async (userId) => {
  if (!isMetaConfigured() || !loadMetaSdk()) return;
  try {
    if (userId) {
      AppEventsLogger.setUserID(String(userId));
    } else {
      AppEventsLogger.clearUserID?.();
    }
  } catch (e) {
    console.warn('[analytics:meta] setUserId failed', e?.message || e);
  }
};

const buildMetaParams = (params = {}) => {
  const items = params.items || [];
  const contentIds = items.map((i) => String(i.item_id)).filter(Boolean);
  const contents = items.map((i) => ({
    id: String(i.item_id),
    quantity: Number(i.quantity) || 1,
    item_price: Number(i.price) || 0,
  }));

  const metaParams = {
    fb_currency: params.currency || 'SAR',
    _valueToSum: Number(params.value) || 0,
    fb_content_type: 'product',
  };

  if (contentIds.length) {
    metaParams.fb_content_id = contentIds.length === 1 ? contentIds[0] : JSON.stringify(contentIds);
    metaParams.fb_content_ids = JSON.stringify(contentIds);
  }
  if (contents.length) {
    metaParams.fb_contents = JSON.stringify(contents);
  }
  if (params.search_term) metaParams.fb_search_string = params.search_term;
  if (params.transaction_id) metaParams.fb_order_id = String(params.transaction_id);
  if (params.payment_type) metaParams.fb_payment_info_available = 1;

  const numItems = items.reduce((n, i) => n + (Number(i.quantity) || 1), 0);
  if (numItems) metaParams.fb_num_items = numItems;

  return metaParams;
};

export const trackMetaEvent = async (gaEventName, params = {}) => {
  const metaName = META_EVENT_MAP[gaEventName];
  if (!metaName) return; // e.g. view_item_list
  if (!isMetaConfigured() || !loadMetaSdk()) return;

  try {
    const metaParams = buildMetaParams(params);
    if (__DEV__) {
      console.log('[analytics:meta]', metaName, metaParams);
    }

    if (metaName === 'Purchase') {
      AppEventsLogger.logPurchase(
        Number(params.value) || 0,
        params.currency || 'SAR',
        metaParams
      );
    } else {
      AppEventsLogger.logEvent(metaName, Number(params.value) || 0, metaParams);
    }
  } catch (e) {
    console.warn('[analytics:meta] track failed', gaEventName, e?.message || e);
  }
};
