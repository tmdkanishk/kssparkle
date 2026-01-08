import React, { useEffect, useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useCustomContext } from "../hooks/CustomeContext";
import CustomButton from "./CustomButton";
import InputBox from "./InputBox";
import { IconComponentNotification } from "../constants/IconComponents";
import { submitNotify } from "../services/submitNotify";

const NotifyModal = ({ visible, onClose, textLabel, productId }) => {
    const { Colors, EndPoint } = useCustomContext();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [contact, setContact] = useState('');
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);



    useEffect(() => {
        if (visible && textLabel) {
            setName(textLabel.awis_name || '');
            setEmail(textLabel.awis_email || '');
            setContact(textLabel.awis_telephone || '');
        }
    }, [visible, textLabel]);

    useEffect(() => {
        let timer;
        if (successMessage) {
            timer = setTimeout(() => {
                onClose();
                setSuccessMessage(null);
                setErrorMessage(null);
                setName('');
                setEmail('');
                setContact('');
            }, 3000);
        }
        return () => clearTimeout(timer);
    }, [successMessage]);

    const handleSend = () => {
        onSubmitNotify();
    };

    const onSubmitNotify = async () => {
        try {
            const response = await submitNotify(productId, name, email, contact, EndPoint?.awis_form);
            console.log('response:', response);
            if (response.error?.warning) {
                setErrorMessage(response.error?.warning);
                return;
            }

            if (response?.success) {
                setSuccessMessage(response?.success);
                setErrorMessage(response.error?.warning);
            }

        } catch (error) {
            console.log(error.response.data);
        }
    }

    return (
        <Modal
            transparent={true}
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalBox}>
                    <TouchableOpacity hitSlop={40} onPress={onClose} style={{ alignSelf: 'flex-end' }}>
                        <Text style={{ fontSize: 24, alignSelf: 'center', color: Colors.primary }}>x</Text>
                    </TouchableOpacity>

                    <View style={{ gap: 10, flexDirection: 'row', alignItems: 'center' }}>
                        <IconComponentNotification size={20} color={Colors.primary} />
                        <Text style={{ gap: 10, fontSize: 14, fontWeight: '400' }}>{textLabel?.text_form_title}</Text>
                    </View>
                    <View style={{ gap: 10 }}>
                        {successMessage && <Text style={{ gap: 10, fontSize: 14, fontWeight: '400', color: Colors.success }}>
                            {successMessage}
                        </Text>}

                        {errorMessage && <Text style={{ gap: 10, fontSize: 14, fontWeight: '400', color: 'red' }}>
                            {errorMessage}
                        </Text>}


                        <InputBox
                            onChangeText={(text) => setName(text)}
                            label={textLabel?.entry_name}
                            placeholder={textLabel?.entry_name}
                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                            isRequired={true}
                            textVlaue={name}

                        />

                        <InputBox
                            onChangeText={(text) => setEmail(text)}
                            label={textLabel?.entry_email}
                            placeholder={textLabel?.entry_email}
                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                            InputType={'email-address'}
                            isRequired={true}
                            textVlaue={email}


                        />

                        <InputBox
                            onChangeText={(text) => setContact(text)}
                            label={textLabel?.entry_telephone}
                            placeholder={textLabel?.entry_telephone}
                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                            InputType={'number'}
                            textVlaue={contact}

                        />

                        <CustomButton buttonStyle={{ w: 'auto', h: 50, backgroundColor: Colors.primary }} buttonText={textLabel?.button_send_request} OnClickButton={handleSend} />


                    </View>



                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.6)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalBox: {
        width: "85%",
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 15,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 10,
    },




});

export default NotifyModal;
