import { View, Text, Modal, Button, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'

const Model = () => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <View style={styles.container}>
            <Modal
                animationType="slide"         // Options: 'slide', 'fade', or 'none'
                transparent={true}            // Makes the background transparent
                visible={modalVisible}        // Controls visibility of the modal
                onRequestClose={() => {       // Handle Android's back button
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalText}>Hello, I am a modal!</Text>
                        <Button title="Close Modal" onPress={() => setModalVisible(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',  // semi-transparent overlay
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        marginBottom: 15,
        fontSize: 18,
    },
});

export default Model