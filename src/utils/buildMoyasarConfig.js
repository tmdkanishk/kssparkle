import { PaymentConfig, CreditCardConfig } from 'react-native-moyasar-sdk';

export const buildMoyasarConfig = ({
  amount,
  orderId,
  publishableKey,
}) => {
  return new PaymentConfig({
    publishableApiKey: publishableKey,
    amount: Math.round(amount * 100), // SAR → Halalas
    description: `Order #${orderId}`,
    creditCard: new CreditCardConfig({
      manual: false,
      saveCard: false,
    }),
  });
};
