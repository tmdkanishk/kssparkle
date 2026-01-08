import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const TouchableButton = ({padding,borderWidth,borderColor,borderRadius, btnText, onclick}) => {
    return (
        <TouchableOpacity onPress={onclick} style={{ 
            padding: padding?padding:8, 
            borderWidth: borderWidth?borderWidth:1, 
            borderColor:borderColor?borderColor: Colors.lightGray, 
            borderRadius:borderRadius?borderRadius: 5 
            }}>
            <Text>{btnText?btnText:'Text'}</Text>
        </TouchableOpacity>
    )
}

export default TouchableButton