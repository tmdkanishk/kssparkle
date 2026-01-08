import { View, Text } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import Colors from '../constants/Colors'

const SizeCard = ({pedding, borderColor, borderWidth, borderRadius, sizeText, leftProduct}) => {
    return (
        <View style={{ alignItems: 'center', gap: 5 }}>
            <View style={{
                 padding: pedding ? pedding:10, 
                 borderColor: borderColor ? borderColor : Colors.primary, 
                 borderWidth: borderWidth ? borderWidth:1, 
                 borderRadius: borderRadius ? borderRadius : 4 
                 }}>
                <Text>{sizeText?sizeText:'UK6'}</Text>
            </View>
            <Text style={commonStyles.textPrimary}>{leftProduct?leftProduct:'3 Left'}</Text>
        </View>
    )
}

export default SizeCard