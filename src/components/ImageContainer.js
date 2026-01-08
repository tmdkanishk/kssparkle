import { View, Text, Image } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import { IconComponentImage } from '../constants/IconComponents';

const ImageContainer = ({ img, width, height, borderRadius, resizeMode, imgWidth, imgHeight, imgStatus }) => {
  const { Colors } = useCustomContext();
  const source = typeof img === 'string' ? { uri: img } : img;
  return (
    <View style={{
      width: width ? width : 100,
      height: height ? height : 100,
      borderRadius: borderRadius ? borderRadius : 50,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: Colors?.border_color == '#ffffff' ? '#D9D9D9' : Colors?.border_color
    }}>
      {
        imgStatus ? (<Image source={source} style={{
          resizeMode: resizeMode ? resizeMode : 'cover',
          width: imgWidth ? imgWidth : 100,
          height: imgHeight ? imgHeight : 100,
          borderRadius: borderRadius ? borderRadius : 50,
        }} />
        ) : <IconComponentImage />
      }

    </View>
  )
}

export default ImageContainer