/**
 * Canonical GA4 event names used internally by the analytics service.
 * Mapped to Meta and TikTok event names per the tracking document.
 */

export const AnalyticsEvent = {
  VIEW_ITEM: 'view_item',
  VIEW_ITEM_LIST: 'view_item_list',
  SEARCH: 'search',
  ADD_TO_CART: 'add_to_cart',
  ADD_TO_WISHLIST: 'add_to_wishlist',
  BEGIN_CHECKOUT: 'begin_checkout',
  ADD_PAYMENT_INFO: 'add_payment_info',
  PURCHASE: 'purchase',
  COMPLETE_REGISTRATION: 'complete_registration',
};

/** Meta App Events / Pixel-equivalent names */
export const META_EVENT_MAP = {
  [AnalyticsEvent.VIEW_ITEM]: 'ViewContent',
  [AnalyticsEvent.SEARCH]: 'Search',
  [AnalyticsEvent.ADD_TO_CART]: 'AddToCart',
  [AnalyticsEvent.ADD_TO_WISHLIST]: 'AddToWishlist',
  [AnalyticsEvent.BEGIN_CHECKOUT]: 'InitiateCheckout',
  [AnalyticsEvent.ADD_PAYMENT_INFO]: 'AddPaymentInfo',
  [AnalyticsEvent.PURCHASE]: 'Purchase',
  [AnalyticsEvent.COMPLETE_REGISTRATION]: 'CompleteRegistration',
  // view_item_list has no direct Meta standard event — skipped for Meta
};

/** TikTok content / standard event keys (SDK enums resolved in provider) */
export const TIKTOK_CONTENT_EVENTS = {
  [AnalyticsEvent.VIEW_ITEM]: 'VIEW_CONTENT',
  [AnalyticsEvent.ADD_TO_CART]: 'ADD_TO_CART',
  [AnalyticsEvent.ADD_TO_WISHLIST]: 'ADD_TO_WISHLIST',
  [AnalyticsEvent.BEGIN_CHECKOUT]: 'INITIATE_CHECKOUT',
  [AnalyticsEvent.ADD_PAYMENT_INFO]: 'ADD_PAYMENT_INFO',
  [AnalyticsEvent.PURCHASE]: 'PURCHASE',
};

export const TIKTOK_STANDARD_EVENTS = {
  [AnalyticsEvent.SEARCH]: 'SEARCH',
  [AnalyticsEvent.COMPLETE_REGISTRATION]: 'REGISTRATION',
};
