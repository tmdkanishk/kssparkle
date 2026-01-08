import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { IconComponentCheckSquare, IconComponentSquare } from '../constants/IconComponents'

const CustomCheckbox = ({ data, labelStyle, containerStyle, label, required, selected, onPress, showError }) => {
  return (
    <View style={[{ gap: 10, }, containerStyle]}>
      <Text style={labelStyle}> {required && <Text style={{ color: "red" }}>*</Text>}{label}</Text>
      {
        data?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Pressable onPress={() => onPress(item?.custom_field_value_id)}>
              {selected?.includes(item?.custom_field_value_id) ? <IconComponentCheckSquare /> : <IconComponentSquare />}
            </Pressable>
            <Text style={labelStyle}>{item?.name}</Text>
          </View>
        ))
      }

      {showError && (
        <Text style={{ color: Colors?.errorColor || "red", marginTop: 5 }}>
          {showError}
        </Text>
      )}
    </View>

  )
}

export default CustomCheckbox