import { View, Text, Modal, TouchableOpacity, Image, Touchable } from 'react-native'
import React from 'react'
import { IconComponentClose } from '../constants/IconComponents'
import { useCustomContext } from '../hooks/CustomeContext';
import { useNavigation } from '@react-navigation/native';


const NotificationAlert = () => {
    const { Colors, NotificationModal, NotificationSetModal, NotificationModalData, NotificationSetModalData, GlobalText } = useCustomContext();
    const navigation = useNavigation();

    const onClickOkBtn = () => {
        try {
        
            if (NotificationModalData?.data?.screen) {
                if (NotificationModalData?.data?.screen === 'Product') {
                  navigation.navigate(NotificationModalData?.data?.screen, { productId: NotificationModalData?.data?.id });
                } else if (NotificationModalData?.data?.screen === 'OrderView') {
                    navigation.navigate(NotificationModalData?.data?.screen, { orderId: NotificationModalData?.data?.id });
                } else if (NotificationModalData?.data?.screen === 'AllCategoryView') {
                    navigation.navigate(NotificationModalData?.data?.screen, { path: NotificationModalData?.data?.id });
                }
                else {
                    navigation.navigate(NotificationModalData?.data?.screen);
                }
            }
            NotificationSetModal(false);
            NotificationSetModalData(null);
        } catch (error) {
            console.log("error", error);
        }
    }



    return (
        <Modal
            transparent={true}
            visible={NotificationModal}
            animationType="fade"
            onRequestClose={() => { NotificationSetModal(false); NotificationSetModalData(null) }}>

            <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: '80%', height: 'auto', backgroundColor: 'white', padding: 10, borderRadius: 12, gap: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ textTransform: 'capitalize', fontSize: 20, fontWeight: '600' }}>{`ZaanseBedden`}</Text>
                        <TouchableOpacity onPress={() => NotificationSetModal(false)}>
                            <IconComponentClose size={32} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{ textTransform: 'capitalize', fontSize: 20, fontWeight: '600' }}>{NotificationModalData?.notification?.title}</Text>
                    <Text style={{ textTransform: 'capitalize', fontSize: 18, fontWeight: '400', flexWrap: 'wrap' }}>{NotificationModalData?.notification?.title}</Text>
                    {NotificationModalData?.notification?.android?.imageUrl &&
                        <View style={{ width: '100%', height: 100 }}>
                            <Image source={{ uri: NotificationModalData?.notification?.android?.imageUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                        </View>}


                    <TouchableOpacity onPress={()=>onClickOkBtn()} style={{ width: '50%', alignSelf: 'center', alignItems: 'center', padding: 10, borderRadius: 10, backgroundColor: Colors.primary }}>
                        <Text style={{ fontSize: 16, color: 'white', fontWeight: '600' }}>{GlobalText?.extrafield_okbtn}</Text>
                    </TouchableOpacity>



                </View>
            </View>

        </Modal>
    )
}

export default NotificationAlert