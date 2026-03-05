import {
  PaymentConfig,
  ApplePayConfig,
} from 'react-native-moyasar-sdk';

export const buildApplePayConfig = ({
  amount,
  orderId,
  publishableKey,
}) => {
  return new PaymentConfig({
    publishableApiKey: publishableKey,
    amount: Math.round(amount * 100),
    description: `Order #${orderId}`,

    applePay: new ApplePayConfig({
      merchantId: "merchant.com.yourapp", // from Apple Developer
      label: "Your App Name",
      manual: false,
    }),
  });
};