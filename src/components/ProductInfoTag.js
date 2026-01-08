import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import Colors from '../constants/Colors'

const ProductInfoTag = ({ heading, value, valueColor }) => {
  return (
    <View style={styles.featureContainer}>
      <Text style={[commonStyles.text_lg, { width: '48%' }]}>{heading}:</Text>
      <Text style={[commonStyles.text_lg, { color: valueColor ? valueColor : Colors.black, textAlign: 'right', width: '48%' }]}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  featureContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    height: 'auto',
    paddingHorizontal: 12,
    paddingVertical: 10,
  }

})

export default ProductInfoTag