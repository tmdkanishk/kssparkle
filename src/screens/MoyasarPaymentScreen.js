import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  ApplePay,
  CreditCard,
  PaymentResponse,
  PaymentStatus,
  StcPay,
} from 'react-native-moyasar-sdk';
import { IconComponentArrowBackSharp } from '../constants/IconComponents';
import FailedModal from '../components/FailedModal';
import { trackPurchase } from '../services/analytics';

export default function MoyasarPaymentScreen({ route, navigation }) {
  const { paymentConfig, orderId, orderStatusId } = route.params;

  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorMgs, setErrorMgs] = useState('');

  const getUserMessage = (error) => {
    const msg = error?.message || '';
    const lowerMsg = msg.toLowerCase();

    if (error?.name === 'AbortError' || lowerMsg.includes('abort')) return null;
    if (msg.includes('not registered to use the STC Pay service'))
      return 'This mobile number is not registered with STC Pay.';
    if (msg.includes('update your information using the STC Pay app'))
      return 'Please update your information in the STC Pay app before paying.';
    if (msg.includes('account status is invalid'))
      return 'Your STC Pay account status is invalid. Please contact STC Pay support.';
    if (msg.includes('exhausted your OTP attempts'))
      return 'Too many OTP attempts. Please wait 15 minutes and try again.';
    if (msg.includes('wait 60 seconds'))
      return 'Please wait 60 seconds before trying a new payment.';
    if (msg.includes('Insufficient Balance'))
      return 'Your STC Pay balance is insufficient to complete this payment.';
    if (msg.includes('daily transaction limit'))
      return 'You have exceeded your daily transaction limit on STC Pay.';
    if (msg.includes('maximum allowed transaction amount'))
      return 'This payment exceeds the maximum allowed transaction amount on STC Pay.';
    if (msg.includes('Connection timed out') || msg.includes('timed out'))
      return 'Connection timed out while contacting STC Pay. Please try again.';
    if (msg.includes('Invalid OTP'))
      return 'The OTP you entered is incorrect. Please try again.';
    if (msg.includes('M076'))
      return 'This payment method is currently not available. Please try another method.';
    if (lowerMsg.includes('network') || msg.includes('400') || msg.includes('500'))
      return 'Payment failed due to a network issue. Please try again.';

    return 'Payment could not be completed. Please try again.';
  };

  const onPaymentResult = (result) => {
    if (result instanceof PaymentResponse) {
      if (result.status === PaymentStatus.paid) {
        trackPurchase({
          orderId,
          screenName: 'MoyasarPaymentScreen',
          paymentType: 'moyasar3',
        }).catch(() => {});
        navigation.replace('OrderSuccessScreen', { orderId, orderStatusId });
      } else {
        const failMessage = result?.message || result?.source?.message || '';
        const knownError = getUserMessage({ message: failMessage });
        if (knownError) {
          setErrorMgs(knownError);
          setErrorModal(true);
        } else {
          navigation.goBack();
        }
      }
      return;
    }
    const message = getUserMessage(result);
    if (message) {
      setErrorMgs(message);
      setErrorModal(true);
    }
  };

  return (
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    >
    <View style={styles.container}>
      <FailedModal
        isSuccessMessage={isErrorMgs}
        handleCloseModal={() => { setErrorModal(false); setErrorMgs(''); }}
        isModal={isErrorModal}
        onClickClose={() => { setErrorModal(false); setErrorMgs(''); }}
      />

      {/* BACK BUTTON */}
      <Pressable
        hitSlop={30}
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <IconComponentArrowBackSharp size={26} color="#fff" />
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >

        {/* APPLE PAY — glass card, iOS only */}
        {Platform.OS === 'ios' && (
          <View style={[styles.glassCard, {padding:20}]}>
            <ApplePay
              paymentConfig={paymentConfig}
              onPaymentResult={onPaymentResult}
              style={{ buttonType: 'buy' }}
            />
           </View>
        )}

         {/* STC PAY — glass card */}
        <View style={styles.glassCard}>
          <View style={styles.dividerRow}>
            {/* <View style={styles.dividerLine} /> */}
            {/* <Text style={styles.dividerLabel}>📱  STC Pay</Text> */}
            {/* <View style={styles.dividerLine} /> */}
          </View>
          <StcPay
            paymentConfig={paymentConfig}
            onPaymentResult={onPaymentResult}
            style={{
              textInputs: {
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.35)',
                color: '#fff',
                borderRadius: 10,
                backgroundColor: 'rgba(255,255,255,0.08)',
              },
            }}
            theme={{ placeholderColor: 'rgba(255,255,255,0.5)' }}
          />
        </View>

        {/* CREDIT CARD — glass card */}
        <View style={styles.glassCard}>
          <View style={styles.dividerRow}>
            {/* <View style={styles.dividerLine} /> */}
            {/* <Text style={styles.dividerLabel}>💳  Card</Text> */}
            {/* <View style={styles.dividerLine} /> */}
          </View>
          <CreditCard
            paymentConfig={paymentConfig}
            onPaymentResult={onPaymentResult}
          />
        </View>

       

        

      </ScrollView>
    </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'ios' ? 100 : 40,
  },

  backButton: {
    marginHorizontal: 20,
    marginBottom: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // Frosted glass card
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    padding: 0,
    // shadow for depth
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    // elevation: 6,
  },

  // Divider with label
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dividerLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    fontWeight: '600',
    marginHorizontal: 10,
    letterSpacing: 0.4,
  },
});