import React from 'react';
import { Platform, Pressable, ScrollView, View } from 'react-native';
import {
  ApplePay,
  PaymentResponse,
  PaymentStatus,
  StcPay,
} from 'react-native-moyasar-sdk';
import { IconComponentArrowBackSharp } from '../constants/IconComponents';
import FailedModal from '../components/FailedModal';

export default function MoyasarPaymentScreen({ route, navigation }) {
  const { paymentConfig, orderId, orderStatusId } = route.params;

  // your existing states
  const [isErrorModal, setErrorModal] = React.useState(false);
  const [isErrorMgs, setErrorMgs] = React.useState('');

  // -----------------------------
  // ERROR TRANSLATION
  // -----------------------------
const getUserMessage = (error) => {
  const msg = error?.message || '';
  const lowerMsg = msg.toLowerCase();

  // User cancelled — silent
  if (error?.name === 'AbortError' || lowerMsg.includes('abort')) {
    return null;
  }

  // --- STC Pay mobile number errors (initiation) ---
  if (msg.includes('not registered to use the STC Pay service')) {
    return 'This mobile number is not registered with STC Pay.';
  }
  if (msg.includes('update your information using the STC Pay app')) {
    return 'Please update your information in the STC Pay app before paying.';
  }
  if (msg.includes('account status is invalid')) {
    return 'Your STC Pay account status is invalid. Please contact STC Pay support.';
  }
  if (msg.includes('exhausted your OTP attempts')) {
    return 'Too many OTP attempts. Please wait 15 minutes and try again.';
  }
  if (msg.includes('wait 60 seconds')) {
    return 'Please wait 60 seconds before trying a new payment.';
  }

  // --- STC Pay OTP errors ---
  if (msg.includes('Insufficient Balance')) {
    return 'Your STC Pay balance is insufficient to complete this payment.';
  }
  if (msg.includes('daily transaction limit')) {
    return 'You have exceeded your daily transaction limit on STC Pay.';
  }
  if (msg.includes('maximum allowed transaction amount')) {
    return 'This payment exceeds the maximum allowed transaction amount on STC Pay.';
  }
  if (msg.includes('Connection timed out') || msg.includes('timed out')) {
    return 'Connection timed out while contacting STC Pay. Please try again.';
  }
  if (msg.includes('Invalid OTP')) {
    return 'The OTP you entered is incorrect. Please try again.';
  }

  // --- General errors ---
  if (msg.includes('M076')) {
    return 'This payment method is currently not available. Please try another method.';
  }
  if (lowerMsg.includes('network') || msg.includes('400') || msg.includes('500')) {
    return 'Payment failed due to a network issue. Please try again.';
  }

  return 'Payment could not be completed. Please try again.';
};

  // -----------------------------
  // PAYMENT HANDLER
  // -----------------------------
  const onPaymentResult = (result) => {
  if (result instanceof PaymentResponse) {
    if (result.status === PaymentStatus.paid) {
      // const orderId = result?.metadata?.order_id;
      navigation.replace('OrderSuccessScreen', { orderId,  orderStatusId});
    } else {
      // STC OTP failures return as PaymentResponse with failed status
      const failMessage = result?.message || result?.source?.message || '';
      const knownStcError = getUserMessage({ message: failMessage });

      if (knownStcError) {
        setErrorMgs(knownStcError);
        setErrorModal(true);
      } else {
        navigation.goBack();
      }
    }
    return;
  }

  // SDK-level errors (network, abort, config issues)
  console.error('Moyasar error:', result);
  const message = getUserMessage(result);
  if (message) {
    setErrorMgs(message);
    setErrorModal(true);
  }
};

  return (
    <View style={{ flex: 1, paddingTop: 60 }}>
      {/* YOUR EXISTING MODAL */}
      <FailedModal
        isSuccessMessage={isErrorMgs}
        handleCloseModal={() => {
          setErrorModal(false);
          setErrorMgs('');
        }}
        isModal={isErrorModal}
        onClickClose={() => {
          setErrorModal(false);
          setErrorMgs('');
        }}
      />

      {/* BACK BUTTON */}
      <Pressable
        hitSlop={30}
        style={{ margin: Platform.OS === 'ios' ? 30 : 10 }}
        onPress={() => navigation.goBack()}
      >
        <IconComponentArrowBackSharp size={35} color="black" />
      </Pressable>

      {/* PAYMENT METHODS */}
      <ScrollView>
        {Platform.OS === 'ios' && (
          <ApplePay
            paymentConfig={paymentConfig}
            onPaymentResult={onPaymentResult}
            style={{ buttonType: 'buy' }}
          />
        )}

        <StcPay
          paymentConfig={paymentConfig}
          onPaymentResult={onPaymentResult}
          style={{
            textInputs: {
              borderWidth: 1.25,
              color: 'white',
            },
          }}
          theme={{
            placeholderColor: 'white',
          }}
        />
      </ScrollView>
    </View>
  );
}