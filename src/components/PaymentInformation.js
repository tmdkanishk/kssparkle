import { View, Text } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'

const PaymentInformation = ({label, data}) => {
    return (
        <View style={{ padding: 12, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 8 }}>
            <View style={{ height: 40, borderBottomWidth: 1, borderColor: Colors.lightGray }}>
                <Text style={commonStyles.smallHeading}>{label?.orderinfopayinfo_heading}</Text>
            </View>
            <View style={{ gap: 5 , paddingVertical:12}}>
                <Text style={commonStyles.text}>{label?.orderinfopaymethod_label}</Text>
                <Text style={commonStyles.smallHeading}>{data?.payment_method}</Text>
            </View>
        </View>
    )
}

export default PaymentInformation