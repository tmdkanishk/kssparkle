/**
 * Normalize OpenCart product / cart / order payloads into GA4-style item params.
 * item_id always uses OpenCart product_id for cross-platform catalog matching.
 */

export const parseNumericPrice = (value) => {
  if (value == null) return 0;
  if (typeof value === 'number' && !Number.isNaN(value)) return value;
  const cleaned = String(value)
    .replace(/<[^>]*>/g, '')
    .replace(/,/g, '')
    .replace(/[^\d.-]/g, '');
  const match = cleaned.match(/-?\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 0;
};

export const mapProductToItem = (product = {}, overrides = {}) => {
  const itemId = String(
    product.product_id ?? product.item_id ?? product.id ?? overrides.item_id ?? ''
  );
  const quantity = Number(
    overrides.quantity ?? product.quantity ?? product.qty ?? 1
  );
  const price = parseNumericPrice(
    overrides.price ?? product.special ?? product.price ?? product.price_raw ?? 0
  );

  return {
    item_id: itemId,
    item_name:
      product.heading_title ||
      product.name ||
      product.product_name ||
      overrides.item_name ||
      '',
    item_category:
      product.category ||
      product.category_name ||
      product.manufacturer ||
      product.manufacturers_data?.manufacturer_name ||
      '',
    item_variant: overrides.item_variant || product.variant || product.option || '',
    price,
    quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
  };
};

export const mapProductsToItems = (products = [], overrides = {}) => {
  if (!Array.isArray(products)) return [];
  return products
    .map((p) => mapProductToItem(p, overrides))
    .filter((item) => item.item_id);
};

export const buildCommerceParams = ({
  items = [],
  currency = 'SAR',
  value,
  transactionId,
  paymentType,
  searchTerm,
  itemListName,
  screenName,
  userId,
} = {}) => {
  const computedValue =
    value != null
      ? parseNumericPrice(value)
      : items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);

  const params = {
    currency: currency || 'SAR',
    value: computedValue,
    items,
  };

  if (transactionId != null && transactionId !== '') {
    params.transaction_id = String(transactionId);
  }
  if (paymentType) params.payment_type = paymentType;
  if (searchTerm) params.search_term = String(searchTerm);
  if (itemListName) params.item_list_name = String(itemListName);
  if (screenName) params.screen_name = String(screenName);
  if (userId != null && userId !== '') params.user_id = String(userId);

  return params;
};
