import { View, Text, SafeAreaView, Platform } from 'react-native'
import React, { useState } from 'react'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext';
import TitleBarName from '../components/TitleBarName';
import NotificationAlert from '../components/NotificationAlert';

const UserDetail = ({ navigation }) => {
    const { Colors, EndPoint } = useCustomContext();
    const [islogin, setLogin] = useState(false);

    return (
        <SafeAreaView style={{ backgroundColor: Platform.OS==='ios' ? Colors.primary:null}}>
            <View style={commonStyles.bodyConatiner}>
                <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={'User Detail'} />
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ paddingHorizontal: 12, marginBottom: 100 }}>
                        <View style={{ marginVertical: 20 }}>
                            <Text style={commonStyles.heading}>User Detail</Text>
                        </View>
                        <View style={{ marginVertical: 20, gap: 20 }}>

                        </View>
                    </View>
                </ScrollView>
            </View>
            <NotificationAlert />
        </SafeAreaView>
    )
}

export default UserDetail