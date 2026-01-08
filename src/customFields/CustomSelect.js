import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useCustomContext } from "../hooks/CustomeContext";

const CustomSelect = ({
  label,
  selectedValue,
  onValueChange,
  options = [], // [{label: 'Option 1', value: '1'}]
  required = false,
  containerStyle,
  labelStyle,
  selectStyle,
  optionStyle,
  showError

}) => {
  const { Colors } = useCustomContext();
  const [touched, setTouched] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // const showError = required && touched && !selectedValue;

  const handleSelect = (val) => {
    setTouched(true);
    onValueChange(val);
    setModalVisible(false);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle, { color: Colors?.iconColor || "#333" }]}>
          {required && <Text style={{ color: "red" }}>*</Text>} {label}
        </Text>
      )}

      {/* Select Box */}
      <Pressable
        style={[styles.selectBox, { backgroundColor: Colors?.inputFeildColor || "#fff", borderColor: showError ? "red" : Colors?.iconColor || "#ccc" }, selectStyle]}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={{
            color: selectedValue ? "#000" : Colors?.placeholderColor || "#999",
          }}
        >
          {selectedValue ? options.find((o) => o.custom_field_value_id === selectedValue)?.name : "-- Select --"}
        </Text>
      </Pressable>

      {/* Error */}
      {showError && (
        <Text style={[styles.errorText, { color: Colors?.errorColor || "red" }]}>
          {showError}
        </Text>
      )}

      {/* Modal Dropdown */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <Pressable style={styles.overlay} onPress={() => setModalVisible(false)}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: Colors?.inputFeildColor || "#fff" },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[styles.option, optionStyle]}
                  onPress={() => handleSelect(item.custom_field_value_id)}
                >
                  <Text style={{ color: Colors?.iconColor || "#000" }}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default CustomSelect;

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontWeight: "400",
  },
  selectBox: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  errorText: {
    marginTop: 5,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    borderRadius: 8,
    paddingVertical: 10,
    elevation: 5,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
});
