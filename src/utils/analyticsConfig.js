/**
 * Analytics / ads SDK configuration.
 * Replace empty Meta/TikTok values with credentials from:
 * - Meta: Facebook Developers / Events Manager
 * - TikTok: TikTok Events Manager
 *
 * Leave Meta/TikTok fields empty to skip those providers (Firebase still runs).
 * After setting Meta credentials, add the react-native-fbsdk-next plugin to
 * app.json (see src/services/analytics/TESTING.md) and rebuild native apps.
 */

export const ANALYTICS_CONFIG = {
  // Meta (Facebook) App Events
  meta: {
    appId: '', // e.g. '123456789012345'
    clientToken: '', // e.g. 'abcdef0123456789'
    displayName: 'Sparkle',
  },

  // TikTok Business SDK
  tiktok: {
    // Use bundle id / package name as appId
    appId: 'com.ksasparkle',
    tiktokAppId: '', // from TikTok Events Manager
    accessToken: '', // from TikTok Events Manager
    debug: typeof __DEV__ !== 'undefined' ? __DEV__ : false,
  },

  // Firebase Analytics is enabled via google-services / GoogleService-Info.plist
  firebase: {
    enabled: true,
  },
};

export const isMetaConfigured = () =>
  Boolean(ANALYTICS_CONFIG.meta?.appId && ANALYTICS_CONFIG.meta?.clientToken);

export const isTikTokConfigured = () =>
  Boolean(
    ANALYTICS_CONFIG.tiktok?.appId &&
      ANALYTICS_CONFIG.tiktok?.tiktokAppId &&
      ANALYTICS_CONFIG.tiktok?.accessToken
  );
