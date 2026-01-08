import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { IconComponentRadioBtn, IconComponentRadioBtnActive } from '../constants/IconComponents'
import { useCustomContext } from '../hooks/CustomeContext';

const CustomRadio = ({ data, containerStyle, labelStyle, label, required, selected, onPress, showError }) => {
  const { Colors } = useCustomContext();
  return (
    <View style={[{ gap: 10, }, containerStyle]}>
      <Text style={labelStyle}> {required && <Text style={{ color: "red" }}>*</Text>}{label}</Text>
      {
        data?.map((item, index) => (
          <View key={index} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
            <Pressable onPress={() => onPress(item?.custom_field_value_id)}>
              {selected === item?.custom_field_value_id ? <IconComponentRadioBtnActive /> : <IconComponentRadioBtn />}
            </Pressable>

            <Text style={labelStyle}>{item?.name}</Text>
          </View>
        ))
      }

      {showError && (
        <Text style={{ color: Colors?.errorColor || "red",  marginTop: 5 }}>
          {showError}
        </Text>
      )}
    </View>
  )
}

export default CustomRadio