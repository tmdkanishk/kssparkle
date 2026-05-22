import {
  PaymentConfig,
  ApplePayConfig,
  CreditCardConfig,
} from 'react-native-moyasar-sdk';

export function buildUnifiedPaymentConfig({ amount, orderId, publishableKey, merchantId, storeName }) {

  console.log("buildUnifiedPaymentConfig", amount, orderId, publishableKey, merchantId, storeName )

  return new PaymentConfig({
    publishableApiKey: publishableKey,
    amount: amount, // already in halalas
    currency: 'SAR',
    merchantCountryCode: 'SA',
    description: `order #${orderId}`,
    metadata: { order_id: orderId },
    supportedNetworks: ['mada', 'visa', 'mastercard', 'amex'],
    creditCard: new CreditCardConfig({
      saveCard: false,
      manual: false,
    }),
    applePay: new ApplePayConfig({
      merchantId: merchantId,       // e.g. 'merchant.com.yourapp'
      label: storeName,             // e.g. 'My Store'
      manual: false,
      saveCard: false,
    }),
  });
}