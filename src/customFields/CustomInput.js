import React, { useState } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { useCustomContext } from "../hooks/CustomeContext";

const CustomInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = "default",
  required = false,
  containerStyle,
  inputStyle,
  labelStyle,
  showError
}) => {
  const { Colors } = useCustomContext();
  const [touched, setTouched] = useState(false);

  // const showError = required && touched && !value;

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle, { color: Colors?.iconColor }]}>
          {required && <Text style={{ color: "red" }}>*</Text>}{label}
        </Text>
      )}
      <TextInput
        style={[styles.input, { backgroundColor: Colors?.inputFeildColor, borderColor: Colors.iconColor }, inputStyle, showError ? styles.errorInput : null]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        placeholderTextColor="#999"
        onBlur={() => setTouched(true)}
      />
      {showError && <Text style={styles.errorText}>{showError}</Text>}
    </View>
  );
};

export default CustomInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,

  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "400",
  },
  input: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    height:50
  },
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    marginTop: 5,
  },
});
