import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext';

const CustomeButtonWithIcon = ({ IconComponent,
    width,
    height,
    bgColor,
    gap,
    borderRadius,
    buttonText,
    textColor,
    fontSize,
    fontWeight,
    onClick,
    btnDisabled,
    opacity

}) => {
    const { Colors } = useCustomContext();
    return (
        <TouchableOpacity style={[styles.btnContainer, {
            width: width ? width : '48%',
            height: height ? height : 46,
            backgroundColor: bgColor ? bgColor : Colors.skyblue,
            gap: gap ? gap : 10,
            borderRadius: borderRadius ? borderRadius : 8,
            opacity: opacity
        }]} onPress={onClick} disabled={btnDisabled}>
            {
                IconComponent ? (
                    <IconComponent />
                ) : <Text>Icon</Text>
            }

            <Text style={{
                fontSize: fontSize ? fontSize : 16,
                color: textColor ? textColor : Colors.white,
                fontWeight: fontWeight ? fontWeight : '400'

            }}>{buttonText ? buttonText : "Add To Cart"}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default CustomeButtonWithIcon