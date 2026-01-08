import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  Platform,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker"; // needed for both iOS + Android
import { useCustomContext } from "../hooks/CustomeContext";

const CustomDateTime = ({
  label,
  value,
  onChange,
  mode = "date", // 'date' | 'time' | 'datetime'
  required = false,
  containerStyle,
  labelStyle,
  fieldStyle,
  showError
}) => {
  const { Colors } = useCustomContext();
  const [touched, setTouched] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // const showError = required && touched && !value;

  const handleChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === "ios"); // keep open for iOS
    if (selectedDate) {
      setTouched(true);
      onChange(selectedDate);
    }
  };


  const formattedValue = value
    ? mode === "time"
      ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : mode === "datetime"
        ? value.toLocaleString([], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit"
        })
        : value.toLocaleDateString()
    : "-- Select --";

  // const formattedValue = value ? mode === "time" ? value.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : value.toLocaleDateString() : "-- Select --";

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

      <Pressable
        style={[
          styles.field,
          {
            backgroundColor: Colors?.inputFeildColor || "#fff",
            borderColor: showError ? "red" : Colors?.iconColor || "#ccc",
          },
          fieldStyle,
        ]}
        onPress={() => setShowPicker(true)}
      >
        <Text
          style={{
            color: value
              ? "#000"
              : Colors?.placeholderColor || "#999",
          }}
        >
          {formattedValue}
        </Text>
      </Pressable>

      {showError && (
        <Text style={[styles.errorText, { color: Colors?.errorColor || "red" }]}>
          {showError}
        </Text>
      )}

      {/* Picker */}
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode === "datetime" ? "date" : mode}
          display="default"
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default CustomDateTime;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "400",
  },
  field: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  errorText: {
    marginTop: 5,
  },
});
