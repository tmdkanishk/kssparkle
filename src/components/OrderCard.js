import { View, Text,Image } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles';

const OrderCard = ({
    width, 
    height, 
    borderWidth, 
    borderColor, 
    borderRadius, 
    alignItems, 
    justifyContent,
    gap,
    img,
    imgConWidth,
    imgConHeight,
    text,
    textStyle
}) => {
  const source = typeof img === 'string' ? { uri: img } : img;
  return (
    <View style={{
            width:width?width:'48%', 
            height:height?height:80, 
            borderWidth:borderWidth?borderWidth:1, 
            borderColor:borderColor?borderColor:Colors.gray, 
            borderRadius:borderRadius?borderRadius:5, 
            alignItems:alignItems?alignItems:'center', 
            justifyContent:justifyContent?justifyContent:'center',
            gap:gap?gap:5
            
        }}>
        <View style={{
          width:imgConWidth?imgConWidth:40, 
          height:imgConHeight?imgConHeight:40
          }}>
            <Image source={source} style={{resizeMode:'contain', width:'100%', height:'100%'}}/>
        </View>
        <Text style={textStyle?textStyle:commonStyles.text_lg}>{text?text:'Text'}</Text>
    </View>
  )
}

export default OrderCard