import { View, Text, Modal, TouchableOpacity } from 'react-native'
import React from 'react'
import { IconComponentClose } from '../constants/IconComponents';
import commonStyles from '../constants/CommonStyles';
import { useCustomContext } from '../hooks/CustomeContext';

const CustomModal = ({ isModalVisibal, messagteTextColor, buttonName, messageText, handleCloseModal, onClickButton,  }) => {
    const { Colors } = useCustomContext();
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isModalVisibal}
            onRequestClose={() => handleCloseModal()}
        >
            <View style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '80%', height: 'auto', backgroundColor: 'white', borderRadius: 10, padding: 20, gap: 20 }}>
                    <View style={{ alignItems: 'flex-end', width: '100%' }}>
                        <TouchableOpacity onPress={() => handleCloseModal()}>
                            <IconComponentClose />
                        </TouchableOpacity>
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={[{ color: messagteTextColor?messagteTextColor:Colors.success }]}> {messageText?messageText:'Message'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => onClickButton()} style={{ alignSelf: 'center', borderRadius: 10, backgroundColor: Colors?.btnBgColor, padding: 12 }}>
                        <Text style={[commonStyles.textWhite_lg, Colors?.btnText]}>{buttonName ? buttonName : 'OK'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    )
}

export default CustomModal