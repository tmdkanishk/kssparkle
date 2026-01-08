import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Colors from '../constants/Colors';
import commonStyles from '../constants/CommonStyles';

const OrderFeatureCard = ({
    width, 
    height, 
    borderBottomWidth, 
    borderColor, 
    flexDirection, 
    gap, 
    alignItems,
    text, 
    textStyle,
    IconComponent,
    onclick
}) => {
    return (
        <TouchableOpacity 
            
            style={{ 
            width: width?width:'100%', 
            height: height?height:40, 
            borderBottomWidth: borderBottomWidth?borderBottomWidth:null, 
            borderColor: borderColor?borderColor:Colors.gray, 
            flexDirection: flexDirection?flexDirection:'row', 
            gap: gap?gap:10, 
            alignItems: alignItems?alignItems:'center' 
            }}
         onPress={onclick}>
                {
                    IconComponent ? (
                       <IconComponent />
                    ): <Ionicons name="heart-outline" size={26} color={Colors.jetBlack} />
                }
            <Text style={[textStyle?textStyle:commonStyles.text_lg]}>{text?text:"Text"}</Text>
        </TouchableOpacity>
    )
}

export default OrderFeatureCard