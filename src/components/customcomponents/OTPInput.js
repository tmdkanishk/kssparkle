import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from "react-native";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";

const OTPInput = ({ length = 6, value = "", onChange }) => {
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const otpArray = value.split("");

    otpArray[index] = text;
    const newOtp = otpArray.join("");

    onChange?.(newOtp);

    if (text && index < length - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace") {
      const otpArray = value.split("");
      otpArray[index] = "";

      onChange?.(otpArray.join(""));

      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };


  return (
    <View style={styles.container}>
      {Array.from({ length }).map((_, index) => (
        <View key={index} style={styles.glowWrapper}>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.25)",
              "rgba(255,255,255,0)",
              "rgba(255,255,255,0.25)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.borderGlow}
          />

          <View style={styles.wrapper}>
            <BlurView
              style={StyleSheet.absoluteFill}
              blurType="light"
              blurAmount={15}
            />

            <TextInput
              ref={(ref) => (inputs.current[index] = ref)}
              style={styles.input}
              keyboardType="number-pad"
              maxLength={1}
              value={value[index] || ""}
              onChangeText={(text) => handleChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              textContentType="oneTimeCode"   // ✅ iOS
              autoComplete="sms-otp"          // ✅ Android (RN ≥ 0.70)
              importantForAutofill="yes"      // Android fallback
            />
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    gap: 11
  },
  glowWrapper: {
    width: 45,
    height: 44,
    borderRadius: 12,
    shadowColor: "#ffffff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 12,
  },
  wrapper: {
    flex: 1,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 0.4,
    borderColor: "rgba(255,255,255,0.5)",
  },
  input: {
    flex: 1,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
});

export default OTPInput;
