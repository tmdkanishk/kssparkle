import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    ImageBackground,
    Dimensions,
} from 'react-native';
import React from 'react';
import commonStyles from '../constants/CommonStyles';
import { IconComponentFalse } from '../constants/IconComponents';
import { useCustomContext } from '../hooks/CustomeContext';
import { BlurView } from '@react-native-community/blur';

const FailedModal = ({
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
            {/* BACKDROP */}
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
                {/* PREVENT CLOSE ON CARD PRESS */}
                <TouchableOpacity activeOpacity={1}>
                    <ImageBackground
                        source={require('../assets/images/backgroundimage.png')}
                        resizeMode="cover"
                        style={{
                            width: width * 0.8,
                            borderRadius: 16,
                            overflow: 'hidden',
                        }}
                    >
                        {/* GLASS OVERLAY */}
                        <View
                            style={{
                                padding: 24,
                                backgroundColor: 'rgba(0,0,0,0.45)',
                            }}
                        >
                            <View style={{ alignItems: 'center', gap: 20 }}>
                                <IconComponentFalse size={90} color={Colors.error} />

                                <Text
                                    style={{
                                        fontSize: 26,
                                        color: Colors.error,
                                        fontWeight: '600',
                                        textAlign: 'center',
                                    }}
                                >
                                    {GlobalText?.extrafield_sorry}
                                </Text>

                                <Text
                                    style={{
                                        fontSize: 16,
                                        color: '#fff',
                                        textAlign: 'center',
                                    }}
                                >
                                    {isSuccessMessage ||
                                        GlobalText?.extrafield_somethingwrong}
                                </Text>
                            </View>

                            <TouchableOpacity
                                onPress={onClickClose}
                                style={{
                                    alignSelf: 'center',
                                    borderRadius: 20,
                                    backgroundColor: Colors.error,
                                    paddingHorizontal: 40,
                                    paddingVertical: 12,
                                    marginTop: 24,
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
        </Modal>
    );
};

export default FailedModal;
