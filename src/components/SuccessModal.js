import { View, Text, TouchableOpacity, Modal, ImageBackground } from 'react-native';
import React from 'react';
import { IconComponentCheck } from '../constants/IconComponents';
import { useCustomContext } from '../hooks/CustomeContext';
import commonStyles from '../constants/CommonStyles';
import { Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';


const SuccessModal = ({
    isModal,
    onClickClose,
    handleCloseModal,
    isSuccessMessage,
    btnName,
}) => {
    const { Colors, GlobalText } = useCustomContext();

    const { width } = Dimensions.get('window');
    return (
        <Modal
            animationType="fade"
            transparent
            visible={isModal}
            onRequestClose={() => handleCloseModal()}
        >
            <View style={{ flex: 1 }}>
                {/* OVERLAY */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => handleCloseModal()}
                    style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >


                    <BlurView
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        blurType="dark"     // light | dark | extraDark
                        blurAmount={15}     // intensity
                        reducedTransparencyFallbackColor="rgba(0,0,0,0.6)"
                    />

                    {/* STOP CLOSING WHEN CLICKING CARD */}
                    <TouchableOpacity activeOpacity={1}>
                        <ImageBackground
                            source={require('../assets/images/backgroundimage.png')}
                            resizeMode="cover"
                            style={{
                                width: width * 0.80,   // 👈 THIS FIXES IT
                                borderRadius: 16,
                                overflow: 'hidden',
                            }}
                        >

                            {/* AL DARK OVERLAY */}
                            <View
                                style={{
                                    padding: 24,
                                    backgroundColor: 'rgba(0,0,0,0.35)',
                                }}
                            >
                                <View style={{ alignItems: 'center', gap: 20 }}>
                                    <IconComponentCheck size={100} color={Colors.success} />

                                    <Text
                                        style={{
                                            fontSize: 26,
                                            color: Colors.success,
                                            fontWeight: '600',
                                        }}
                                    >
                                        {GlobalText?.extrafield_success}!
                                    </Text>

                                    <Text
                                        style={{
                                            fontSize: 16,
                                            color: '#fff',
                                            textAlign: 'center',
                                        }}
                                    >
                                        {isSuccessMessage || 'text messages'}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={onClickClose}
                                    style={{
                                        alignSelf: 'center',
                                        borderRadius: 20,
                                        backgroundColor: Colors.primary,
                                        paddingHorizontal: 40,
                                        paddingVertical: 12,
                                        marginTop: 20,
                                    }}
                                >
                                    <Text style={[commonStyles.textWhite_lg, Colors?.btnText]}>
                                        {btnName || GlobalText?.extrafield_okbtn}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </TouchableOpacity>

            </View>

        </Modal>
    );
};

export default SuccessModal;
