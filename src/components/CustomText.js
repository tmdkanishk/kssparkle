import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'

const CustomText = ({text, textStyle, containerStyles }) => {
  return (
    <View style={containerStyles?containerStyles:styles.container}>
      <Text style={textStyle?textStyle:commonStyles.text}>{text?text:''}</Text>
    </View>
  )
}

const styles =  StyleSheet.create({
  container:{
    width:'100%',
    height:24,
    justifyContent:'center',
  }
})

export default CustomText