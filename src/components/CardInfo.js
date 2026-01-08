import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import commonStyles from '../constants/CommonStyles';
import { useCustomContext } from '../hooks/CustomeContext';

const CardInfo = ({
    width,
    height,
    padding,
    backgroundColor,
    borderColor,
    borderWidth,
    gap,
    heading,
    desc,
    headingTextStyle,
    desTextStyle,
    iconConWidth,
    iconConHeight,
    iconConBgcolor,
    iconConRadius,
    iconSize,
    IconComponent,
    onClick,
    dissable
}) => {
    const { Colors } = useCustomContext();
    return (
        <TouchableOpacity
            disabled={dissable ? dissable : false}
            onPress={onClick}
            style={{
                width: width ? width : '100%',
                height: height ? height : 80,
                padding: 10,
                backgroundColor: backgroundColor ? backgroundColor : Colors.lightGreen,
                borderRadius: padding ? padding : 12,
                borderColor: borderColor ? borderColor : Colors.shadeGreen,
                borderWidth: borderWidth ? borderWidth : 1,
                gap: gap ? gap : 10,
                flexDirection: 'row',
                alignItems: 'center',
            }}>

            <View style={{
                width: iconConWidth ? iconConWidth : 50,
                height: iconConHeight ? iconConHeight : 50,
                borderRadius: iconConRadius ? iconConRadius : 25,
                backgroundColor: iconConBgcolor ? iconConBgcolor : Colors.primary,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {
                    IconComponent ? (
                        <IconComponent />
                    ) : <FontAwesome5 name="coins" size={iconSize ? iconSize : 22} color="#E1C602" />
                }

            </View>

            <View style={{flex: 1}}>
                <Text style={headingTextStyle ? headingTextStyle : commonStyles.smallHeading}>{heading ? heading : "heading"}</Text>
                <Text style={desTextStyle ? desTextStyle : commonStyles.text}>{desc ? desc : 'description'}</Text>
            </View>
        </TouchableOpacity>
    )
}

export default CardInfo