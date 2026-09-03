import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY = 'ANALYTICS_PENDING_PURCHASE';

/**
 * Store checkout snapshot so OrderSuccess / payment WebViews can fire purchase
 * with full line items even when route params only include orderId.
 */
export const setPendingPurchase = async (payload = {}) => {
  try {
    await AsyncStorage.setItem(
      KEY,
      JSON.stringify({
        ...payload,
        savedAt: Date.now(),
      })
    );
  } catch (e) {
    // ignore
  }
};

export const getPendingPurchase = async () => {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
};

export const clearPendingPurchase = async () => {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch (e) {
    // ignore
  }
};
