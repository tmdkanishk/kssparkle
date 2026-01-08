import { View, Text } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import Colors from '../constants/Colors';
import { IconComponentLocation } from '../constants/IconComponents';

const ShippingAddress = ({label, data}) => {
  return (
    <View style={{ padding: 12, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 8 }}>
            <View style={{ height: 40, borderBottomWidth: 1, borderColor: Colors.lightGray }}>
                <Text style={commonStyles.smallHeading}>{label?.orderinfoshipaddr_heading}</Text>
            </View>
            <View style={{ gap: 5 , paddingVertical:12}}>
                <View style={{flexDirection:'row', gap:5, alignItems:'center'}}>
                   <IconComponentLocation size={24} color={Colors.primary} />
                    <Text style={commonStyles.smallTextBlackBold}>{label?.orderinfoshipaddr_label}</Text>
                </View>
                <Text style={commonStyles.text}>{data?.shipping_address}</Text>
            </View>
        </View>
  )
}

export default ShippingAddress