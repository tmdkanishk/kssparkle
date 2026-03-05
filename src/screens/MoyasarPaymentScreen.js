import React from 'react';
import { Platform, Pressable, View } from 'react-native';
import {
  CreditCard,
  PaymentResult,
  PaymentResponse,
  PaymentStatus,
  ApplePay,
} from 'react-native-moyasar-sdk';
import { IconComponentArrowBackSharp } from '../constants/IconComponents';

export default function MoyasarPaymentScreen({ route, navigation }) {
  const { paymentConfig, orderId, paymentType } = route.params;

  const onPaymentResult = (result) => {
    if (result instanceof PaymentResponse) {
      if (result.status === PaymentStatus.paid) {
        navigation.replace('OrderSuccessScreen');
      } else {
        navigation.goBack();
      }
    } else {
      console.log('Moyasar error', result);
      navigation.goBack();
    }
  };

  return (
    <View style={{ flex: 1, paddingTop: 16 }}>

      <Pressable
        hitSlop={30}
        style={{ margin: Platform.OS === "ios" ? 30 : 10 }}
        onPress={() => navigation.goBack()}
      >
        <IconComponentArrowBackSharp size={35} color="black" />
      </Pressable>

      {paymentType === "apple" && Platform.OS === "ios" ? (
        <ApplePay
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
        />
      ) : (
        <CreditCard
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
        />
      )}

    </View>
  );
}
