import { Modal, View, Text, Button, StyleSheet, Pressable } from 'react-native';
import React, { useState } from 'react'
import WebView from 'react-native-webview';


const PaymentUrlModal = ({url,modalVisible, setModalVisible, handleNavigationChange}) => {

  return (
      <View style={styles.container}>
      <Button title="Open WebView" onPress={() => setModalVisible(true)} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.header}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>Close</Text>
              </Pressable>
            </View>

            <WebView
              source={{ uri: url }}
              style={styles.webview}
              startInLoadingState = {true}
              onNavigationStateChange={handleNavigationChange}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
  
}

export default PaymentUrlModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
  },
  modalContent: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden'
  },
  header: {
    padding: 10,
    backgroundColor: '#f2f2f2',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  closeButton: {
    paddingHorizontal: 10,
    paddingVertical: 5
  },
  closeText: {
    color: 'black',
    fontWeight: 'bold'
  },
  webview: {
    flex: 1
  }
});