import { AnalyticsEvent } from './eventMap';
import {
  buildCommerceParams,
  mapProductToItem,
  mapProductsToItems,
  parseNumericPrice,
} from './productMapper';
import { claimPurchaseTrack } from './purchaseDedup';
import {
  getPendingPurchase,
  setPendingPurchase,
  clearPendingPurchase,
} from './pendingPurchase';
import {
  initFirebaseAnalytics,
  setFirebaseUserId,
  trackFirebaseEvent,
} from './providers/firebase';
import {
  initMetaAnalytics,
  setMetaUserId,
  trackMetaEvent,
} from './providers/meta';
import {
  initTikTokAnalytics,
  setTikTokUserId,
  trackTikTokEvent,
} from './providers/tiktok';
import { _retrieveData } from '../../utils/storage';

let initialized = false;

/**
 * Initialize Firebase, Meta, and TikTok analytics SDKs.
 * Safe to call once from App.js; Meta/TikTok no-op if credentials are empty.
 */
export const initAnalytics = async () => {
  if (initialized) return;
  initialized = true;
  await Promise.all([
    initFirebaseAnalytics(),
    initMetaAnalytics(),
    initTikTokAnalytics(),
  ]);

  try {
    const customerId = await _retrieveData('CUSTOMER_ID');
    if (customerId) {
      await setAnalyticsUserId(customerId);
    }
  } catch (e) {
    // ignore
  }
};

export const setAnalyticsUserId = async (userId, profile = {}) => {
  await Promise.all([
    setFirebaseUserId(userId),
    setMetaUserId(userId),
    setTikTokUserId(userId, profile),
  ]);
};

/**
 * Low-level: fan out one GA4-named event to all providers.
 */
export const trackEvent = async (eventName, params = {}) => {
  await Promise.all([
    trackFirebaseEvent(eventName, params),
    trackMetaEvent(eventName, params),
    trackTikTokEvent(eventName, params),
  ]);
};

const resolveCurrency = async (currency) => {
  if (currency) return currency;
  try {
    const cur = await _retrieveData('SELECT_CURRENCY');
    return cur?.code || 'SAR';
  } catch (e) {
    return 'SAR';
  }
};

const resolveUserId = async () => {
  try {
    return (await _retrieveData('CUSTOMER_ID')) || undefined;
  } catch (e) {
    return undefined;
  }
};

export const trackViewItem = async (product, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const item = mapProductToItem(product, extras);
  const params = buildCommerceParams({
    items: [item],
    currency,
    value: item.price * item.quantity,
    screenName: extras.screenName || 'ProductDetail',
    userId,
  });
  await trackEvent(AnalyticsEvent.VIEW_ITEM, params);
};

export const trackViewItemList = async (products, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const items = mapProductsToItems(products);
  const params = buildCommerceParams({
    items,
    currency,
    itemListName: extras.itemListName || 'Product List',
    screenName: extras.screenName,
    userId,
  });
  await trackEvent(AnalyticsEvent.VIEW_ITEM_LIST, params);
};

export const trackSearch = async (searchTerm, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const items = mapProductsToItems(extras.products || []);
  const params = buildCommerceParams({
    items,
    currency,
    searchTerm,
    screenName: extras.screenName || 'Search',
    userId,
  });
  await trackEvent(AnalyticsEvent.SEARCH, params);
};

export const trackAddToCart = async (product, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const item = mapProductToItem(product, extras);
  const params = buildCommerceParams({
    items: [item],
    currency,
    value: item.price * item.quantity,
    screenName: extras.screenName || 'ProductDetail',
    userId,
  });
  await trackEvent(AnalyticsEvent.ADD_TO_CART, params);
};

export const trackAddToWishlist = async (productOrId, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const product =
    typeof productOrId === 'object' && productOrId
      ? productOrId
      : { product_id: productOrId };
  const item = mapProductToItem(product, extras);
  const params = buildCommerceParams({
    items: [item],
    currency,
    value: item.price * item.quantity,
    screenName: extras.screenName || 'Wishlist',
    userId,
  });
  await trackEvent(AnalyticsEvent.ADD_TO_WISHLIST, params);
};

export const trackBeginCheckout = async (products, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const items = mapProductsToItems(products);
  const params = buildCommerceParams({
    items,
    currency,
    value: extras.value,
    screenName: extras.screenName || 'ShippingMethod',
    userId,
  });
  await trackEvent(AnalyticsEvent.BEGIN_CHECKOUT, params);
};

export const trackAddPaymentInfo = async (products, extras = {}) => {
  const currency = await resolveCurrency(extras.currency);
  const userId = await resolveUserId();
  const items = mapProductsToItems(products);
  const params = buildCommerceParams({
    items,
    currency,
    value: extras.value,
    paymentType: extras.paymentType,
    screenName: extras.screenName || 'OrderPlace',
    userId,
  });
  await trackEvent(AnalyticsEvent.ADD_PAYMENT_INFO, params);
};

/**
 * Purchase with order_id deduplication. Safe to call from OrderSuccess and WebView fallbacks.
 * Merges any pending checkout snapshot (products/value/currency) when extras are incomplete.
 */
export const trackPurchase = async ({
  orderId,
  products = [],
  value,
  currency: currencyOverride,
  paymentType,
  screenName = 'OrderSuccessScreen',
} = {}) => {
  if (orderId == null || orderId === '') {
    console.warn('[analytics] purchase skipped — missing orderId');
    return false;
  }

  const shouldTrack = await claimPurchaseTrack(orderId);
  if (!shouldTrack) {
    if (__DEV__) {
      console.log('[analytics] purchase already tracked for order', orderId);
    }
    return false;
  }

  const pending = (await getPendingPurchase()) || {};
  const mergedProducts =
    products?.length > 0 ? products : pending.products || [];
  const mergedValue = value != null ? value : pending.value;
  const mergedPaymentType = paymentType || pending.paymentType;
  const currency = await resolveCurrency(
    currencyOverride || pending.currency
  );
  const userId = await resolveUserId();
  const items = mapProductsToItems(mergedProducts);
  const params = buildCommerceParams({
    items,
    currency,
    value: mergedValue != null ? mergedValue : undefined,
    transactionId: orderId,
    paymentType: mergedPaymentType,
    screenName,
    userId,
  });

  await trackEvent(AnalyticsEvent.PURCHASE, params);
  await clearPendingPurchase();
  return true;
};

export const saveCheckoutForPurchase = async (payload) => {
  await setPendingPurchase(payload);
};

export const trackCompleteRegistration = async (extras = {}) => {
  const userId = extras.userId || (await resolveUserId());
  if (userId) {
    await setAnalyticsUserId(userId, extras.profile || {});
  }
  await trackEvent(AnalyticsEvent.COMPLETE_REGISTRATION, {
    method: extras.method || 'email',
    screen_name: extras.screenName || 'Register',
    ...(userId ? { user_id: String(userId) } : {}),
  });
};

export {
  mapProductToItem,
  mapProductsToItems,
  parseNumericPrice,
  claimPurchaseTrack,
  setPendingPurchase,
  getPendingPurchase,
  clearPendingPurchase,
};

export { AnalyticsEvent };
