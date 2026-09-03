import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'ANALYTICS_PURCHASE_ORDER_IDS';

const readIds = async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch (e) {
    return [];
  }
};

const writeIds = async (ids) => {
  try {
    // Keep last 200 order IDs to avoid unbounded growth
    const trimmed = ids.slice(-200);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch (e) {
    // ignore storage errors
  }
};

/**
 * Returns true if this order_id has already been used for a purchase event.
 */
export const hasTrackedPurchase = async (orderId) => {
  if (orderId == null || orderId === '') return false;
  const ids = await readIds();
  return ids.includes(String(orderId));
};

/**
 * Marks an order_id as purchase-tracked. Returns true if newly marked, false if already tracked.
 */
export const markPurchaseTracked = async (orderId) => {
  if (orderId == null || orderId === '') return false;
  const id = String(orderId);
  const ids = await readIds();
  if (ids.includes(id)) return false;
  ids.push(id);
  await writeIds(ids);
  return true;
};

/**
 * Atomically checks and marks. Returns true if purchase should be fired.
 */
export const claimPurchaseTrack = async (orderId) => {
  if (orderId == null || orderId === '') return false;
  const id = String(orderId);
  const ids = await readIds();
  if (ids.includes(id)) return false;
  ids.push(id);
  await writeIds(ids);
  return true;
};
