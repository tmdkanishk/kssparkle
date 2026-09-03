import { ANALYTICS_CONFIG } from '../../../utils/analyticsConfig';

let analyticsInstance = null;
let logEventFn = null;
let setUserIdFn = null;
let setAnalyticsCollectionEnabledFn = null;

const loadFirebase = () => {
  if (analyticsInstance) return true;
  try {
    // eslint-disable-next-line global-require
    const mod = require('@react-native-firebase/analytics');
    if (typeof mod.getAnalytics === 'function') {
      analyticsInstance = mod.getAnalytics();
      logEventFn = mod.logEvent
        ? (name, params) => mod.logEvent(analyticsInstance, name, params)
        : (name, params) => analyticsInstance.logEvent(name, params);
      setUserIdFn = mod.setUserId
        ? (id) => mod.setUserId(analyticsInstance, id)
        : (id) => analyticsInstance.setUserId(id);
      setAnalyticsCollectionEnabledFn = mod.setAnalyticsCollectionEnabled
        ? (enabled) => mod.setAnalyticsCollectionEnabled(analyticsInstance, enabled)
        : (enabled) => analyticsInstance.setAnalyticsCollectionEnabled?.(enabled);
    } else {
      analyticsInstance = mod.default();
      logEventFn = (name, params) => analyticsInstance.logEvent(name, params);
      setUserIdFn = (id) => analyticsInstance.setUserId(id);
      setAnalyticsCollectionEnabledFn = (enabled) =>
        analyticsInstance.setAnalyticsCollectionEnabled?.(enabled);
    }
    return true;
  } catch (e) {
    console.warn('[analytics:firebase] module unavailable', e?.message || e);
    return false;
  }
};

export const initFirebaseAnalytics = async () => {
  if (!ANALYTICS_CONFIG.firebase?.enabled) return;
  try {
    if (!loadFirebase()) return;
    if (setAnalyticsCollectionEnabledFn) {
      await setAnalyticsCollectionEnabledFn(true);
    }
    if (__DEV__) {
      console.log('[analytics:firebase] collection enabled');
    }
  } catch (e) {
    console.warn('[analytics:firebase] init failed', e?.message || e);
  }
};

export const setFirebaseUserId = async (userId) => {
  try {
    if (!loadFirebase() || !setUserIdFn) return;
    await setUserIdFn(userId ? String(userId) : null);
  } catch (e) {
    console.warn('[analytics:firebase] setUserId failed', e?.message || e);
  }
};

export const trackFirebaseEvent = async (eventName, params = {}) => {
  if (!ANALYTICS_CONFIG.firebase?.enabled) return;
  try {
    if (!loadFirebase() || !logEventFn) return;

    const cleaned = { ...params };
    delete cleaned.user_id;

    if (__DEV__) {
      console.log('[analytics:firebase]', eventName, cleaned);
    }
    await logEventFn(eventName, cleaned);
  } catch (e) {
    console.warn('[analytics:firebase] logEvent failed', eventName, e?.message || e);
  }
};
