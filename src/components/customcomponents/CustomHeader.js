import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'

const CustomHeader = ({ pageName }) => {
    const navigation = useNavigation();
    return (
        <View style={{ width: '100%', paddingHorizontal: 12, gap: 10 }}>
            <TouchableOpacity hitSlop={40} style={{ marginTop: 20, marginLeft: 10 }} onPress={() => navigation.goBack()}>
                <Image source={require("../../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
            </TouchableOpacity>
            <Text style={{
                color: "#fff",
                fontSize: 18,
                fontWeight: "700",
            }}>{pageName}</Text>
        </View>
    )
}

export default CustomHeader