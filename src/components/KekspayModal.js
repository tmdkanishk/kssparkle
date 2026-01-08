import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image, Linking, Platform } from 'react-native';
import { useCustomContext } from '../hooks/CustomeContext';
import { IconComponentClose } from '../constants/IconComponents';
import { trackKekspayPayment } from '../services/trackKekspayPayment';
import { useNavigation } from '@react-navigation/native';
import { _storeData } from '../utils/storage';

const KekspayModal = ({ visible, onClose, data, order_id, paymentMethod, paymentTitle, totalAmount }) => {

    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const navigation = useNavigation();


    useEffect(() => {
        const interval = setInterval(() => {
            trackPaymentStatus()
        }, 3000); // every 3 seconds
        // Cleanup on component unmount
        return () => clearInterval(interval);

    }, [])



    const trackPaymentStatus = async () => {
        try {
            const response = await trackKekspayPayment(order_id, EndPoint?.payment_kekspay_check);
            console.log("response of tracking kkspay status:", response);
            if (response?.status == 1) {
                updateCartCount(0);
                // await _storeData("CART_PRODUCT_COUNT", 0);
                // await _storeData("CART_PRODUCT_AMOUNT", 0);

                onClose();
                navigation.navigate("OrderConfirmation", {
                    orderId: order_id,
                });


            }



        } catch (error) {
            console.log("error", error.response.data);
        }
    }



    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={{ backgroundColor: Colors?.primary, position: 'absolute', top: 0, right: 0, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 5, margin: 10 }} onPress={onClose}>
                        <IconComponentClose color={Colors?.white} size={24} />
                    </TouchableOpacity>
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: 150, height: 100 }}>

                        {/* Replace with actual QR Code Image */}
                        <Image
                            source={{ uri: data?.data?.logo }}
                            style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                        />
                    </View>
                    <Text style={styles.subtitle}>{data?.text?.paymeny_by}</Text>

                    <View style={styles.stepsContainer}>
                        <Text style={styles.step}>{data?.text?.open_kekspay}</Text>
                        <Text style={styles.step}>{data?.text?.press_keksicon}</Text>
                        <Text style={styles.step}>{data?.text?.press_scanqrcode}</Text>
                        <Text style={styles.step}>{data?.text?.scan_qrcode}</Text>
                    </View>

                    <View style={styles.qrBox}>
                        {/* Replace with actual QR Code Image */}
                        <Image
                            source={{ uri: data?.data?.qrcode }}
                            style={styles.qrImage}
                        />
                    </View>

                    <Text style={styles.step}>{data?.text?.donthave_kekspay_yet}</Text>

                    <TouchableOpacity onPress={() => Linking.openURL(Platform.OS === 'android' ? data?.text?.geton_googleplay_url : data?.text?.aviableon_appstore_url)} style={{ width: 200, height: 100, justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: Platform.OS === 'android' ? data?.text?.geton_googleplay_img : data?.text?.aviableon_appstore_img }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    </TouchableOpacity>


                    {/* <TouchableOpacity style={[styles.closeButton, { backgroundColor: Colors?.primary }]} onPress={onClose}>
                        <Text style={styles.closeText}>{GlobalText?.extrafield_closebtn}</Text>
                    </TouchableOpacity> */}
                </View>
            </View>
        </Modal>
    );
};

export default KekspayModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        width: '85%',
        alignItems: 'center',
        elevation: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
    stepsContainer: {
        alignSelf: 'stretch',
        marginBottom: 20,
    },
    step: {
        fontSize: 16,
        marginVertical: 2,
        color: '#444',
    },
    qrLabel: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
    },
    qrBox: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginBottom: 20,
    },
    qrImage: {
        width: 150,
        height: 150,
    },
    closeButton: {
        backgroundColor: '#0066cc',
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 8,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
    },
});
