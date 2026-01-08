import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { IconComponentImage } from '../constants/IconComponents'

const ProductColorCard = ({disabled,width, height, borderWidth, borderColor, borderRadius, imageresizeMode, imageWidth, img, onClick}) => {
    return (

        <TouchableOpacity 

        disabled={disabled}
        
        style={{
            width: width ? width : 60,
            height: height ? height : 60,
            borderWidth: borderWidth ? borderWidth : 1,
            borderColor: borderColor ? borderColor : Colors.gray,
            borderRadius: borderRadius ? borderRadius : 8,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
            padding: 5
        }} onPress={onClick}>
            {
                img ? (<Image source={{ uri: img }} style={{
                    resizeMode: imageresizeMode ? imageresizeMode : 'contain',
                    width: imageWidth ? imageWidth : '100%',
                    height: '100%'
                }} />) : (<IconComponentImage />)
            }

        </TouchableOpacity>


    )
}

export default ProductColorCard