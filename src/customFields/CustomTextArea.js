import { View, TextInput, Text, StyleSheet } from "react-native";
import React, { useState } from 'react'
import { useCustomContext } from '../hooks/CustomeContext';

const CustomTextArea = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  numberOfLines = 4,
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
        <Text
          style={[
            styles.label,
            labelStyle,
            { color: Colors?.iconColor || "#333" },
          ]}
        >
          {required && <Text style={{ color: "red" }}>*</Text>} {label}
        </Text>
      )}

      <TextInput
        style={[
          styles.textarea,
          {
            backgroundColor: Colors?.inputFeildColor || "#fff",
            borderColor: showError ? "red" : Colors?.iconColor || "#ccc",
            color: "#000",
            height: numberOfLines * 24, // control height dynamically
          },
          inputStyle,
        ]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={true}
        numberOfLines={numberOfLines}
        textAlignVertical="top" // important for Android textarea
        placeholderTextColor={Colors?.placeholderColor || "#999"}
        onBlur={() => setTouched(true)}
      />

      {showError && (
        <Text style={[styles.errorText, { color: Colors?.errorColor || "red" }]}>
          {showError}
        </Text>
      )}
    </View>
  );
};

export default CustomTextArea

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "400",
  },
  textarea: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  errorText: {
    marginTop: 5,
  },
});

