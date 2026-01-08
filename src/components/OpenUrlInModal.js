import React, { useState } from "react";
import {
  Modal,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { WebView } from "react-native-webview";
import { IconComponentClose } from "../constants/IconComponents";

const OpenUrlInModal = ({ url, modalVisible, setModalVisible }) => {
 return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <TouchableOpacity
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "white",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(false)}
        >
          <IconComponentClose size={32} />
        </TouchableOpacity>
        <View style={{ width: "90%", height: "50%", backgroundColor: "white" }}>
          <WebView source={{ uri: url }} style={styles.webview} />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    height: "100%",
    width: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  webview: {
    flex: 1,
  },
});

export default OpenUrlInModal;
