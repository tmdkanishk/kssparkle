import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'


const CustomButton = ({ buttonStyle, opacity, buttonText, OnClickButton, btnDisabled, btnTextStyle }) => {
  return (
    <TouchableOpacity
      style={[{
        width: buttonStyle.w ? buttonStyle.w : 'auto',
        height: buttonStyle.h,
        backgroundColor: buttonStyle.backgroundColor,
        borderRadius: buttonStyle.borderRadius,
        borderWidth: buttonStyle.borderWidth,
        borderColor: buttonStyle.borderColor,
        paddingVertical: buttonStyle.paddingVertical,
        paddingHorizontal: buttonStyle.paddingHorizontal,
        opacity: opacity ? opacity : null,
      }, styles.button]} onPress={() => OnClickButton()} disabled={btnDisabled}>
      <Text style={btnTextStyle ? btnTextStyle : commonStyles.textWhite_lg}>{buttonText}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default CustomButton