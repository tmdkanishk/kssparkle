import { ANALYTICS_CONFIG, isTikTokConfigured } from '../../../utils/analyticsConfig';
import { TIKTOK_CONTENT_EVENTS, TIKTOK_STANDARD_EVENTS } from '../eventMap';

let TikTokBusiness = null;
let TikTokContentEventName = null;
let TikTokEventName = null;
let TikTokContentEventParameter = null;
let TikTokContentEventContentsParameter = null;
let loaded = false;
let initialized = false;

const loadTikTokSdk = () => {
  if (loaded) return Boolean(TikTokBusiness);
  loaded = true;
  try {
    // eslint-disable-next-line global-require
    const sdk = require('react-native-tiktok-business-sdk');
    TikTokBusiness = sdk.TikTokBusiness;
    TikTokContentEventName = sdk.TikTokContentEventName;
    TikTokEventName = sdk.TikTokEventName;
    TikTokContentEventParameter = sdk.TikTokContentEventParameter;
    TikTokContentEventContentsParameter = sdk.TikTokContentEventContentsParameter;
    return true;
  } catch (e) {
    console.warn('[analytics:tiktok] SDK not installed', e?.message || e);
    return false;
  }
};

export const initTikTokAnalytics = async () => {
  if (!isTikTokConfigured()) {
    if (__DEV__) {
      console.log('[analytics:tiktok] skipped — set tiktokAppId/accessToken in analyticsConfig.js');
    }
    return;
  }
  if (!loadTikTokSdk()) return;

  try {
    const { appId, tiktokAppId, accessToken, debug } = ANALYTICS_CONFIG.tiktok;
    await TikTokBusiness.initializeSdk(appId, tiktokAppId, accessToken, Boolean(debug));
    initialized = true;
    if (__DEV__) console.log('[analytics:tiktok] SDK initialized');
  } catch (e) {
    console.warn('[analytics:tiktok] init failed', e?.message || e);
  }
};

export const setTikTokUserId = async (userId, profile = {}) => {
  if (!isTikTokConfigured() || !loadTikTokSdk() || !initialized) return;
  try {
    if (!userId) {
      await TikTokBusiness.logout?.();
      return;
    }
    await TikTokBusiness.identify(
      String(userId),
      profile.userName || String(userId),
      profile.phone || '',
      profile.email || ''
    );
  } catch (e) {
    console.warn('[analytics:tiktok] identify failed', e?.message || e);
  }
};

const buildContents = (items = []) => {
  if (!TikTokContentEventContentsParameter) return [];
  return items.map((item) => ({
    [TikTokContentEventContentsParameter.CONTENT_ID]: String(item.item_id),
    [TikTokContentEventContentsParameter.CONTENT_NAME]: item.item_name || '',
    [TikTokContentEventContentsParameter.PRICE]: Number(item.price) || 0,
    [TikTokContentEventContentsParameter.QUANTITY]: Number(item.quantity) || 1,
    ...(item.item_category
      ? { [TikTokContentEventContentsParameter.BRAND]: item.item_category }
      : {}),
  }));
};

export const trackTikTokEvent = async (gaEventName, params = {}) => {
  if (!isTikTokConfigured() || !loadTikTokSdk() || !initialized) return;

  try {
    const contentKey = TIKTOK_CONTENT_EVENTS[gaEventName];
    const standardKey = TIKTOK_STANDARD_EVENTS[gaEventName];

    if (contentKey && TikTokContentEventName?.[contentKey]) {
      const payload = {
        [TikTokContentEventParameter.CURRENCY]: params.currency || 'SAR',
        [TikTokContentEventParameter.VALUE]: String(params.value ?? 0),
        [TikTokContentEventParameter.CONTENT_TYPE]: 'product',
        [TikTokContentEventParameter.CONTENTS]: buildContents(params.items || []),
      };
      if (params.transaction_id) {
        payload[TikTokContentEventParameter.DESCRIPTION] = `order_${params.transaction_id}`;
      }
      if (__DEV__) console.log('[analytics:tiktok]', contentKey, payload);
      await TikTokBusiness.trackContentEvent(
        TikTokContentEventName[contentKey],
        payload
      );
      return;
    }

    if (standardKey && TikTokEventName?.[standardKey]) {
      const props = {};
      if (params.search_term) props.query = params.search_term;
      if (__DEV__) console.log('[analytics:tiktok]', standardKey, props);
      await TikTokBusiness.trackEvent(TikTokEventName[standardKey], undefined, props);
    }
  } catch (e) {
    console.warn('[analytics:tiktok] track failed', gaEventName, e?.message || e);
  }
};
