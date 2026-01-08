import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCustomContext } from '../hooks/CustomeContext';


const CustomDropdown = ({alignItems,width, hidelable, borderRadius,label, items, borderWidth, borderColor, height, pickerHeight, pickerWidth, backgroundColor}) => {
  const {Colors} = useCustomContext();
  const [selectedValue, setSelectedValue] = useState();

  return (
    <View style={styles.container}>
      {
         hidelable ? (null):<Text style={[styles.label, {  color: Colors.iconColor,}]}>{label}</Text>
      }
      <View style={{
         borderWidth: borderWidth?borderWidth:1,      // Set border width here
         borderColor: borderColor?borderColor:Colors.iconColor, // Set border color here
         height: height?height:56,
         borderRadius:borderRadius?borderRadius:null,
         overflow: 'hidden',
         alignItems:alignItems?alignItems:null,
         width:width?width:null
      }}>
        <Picker
          selectedValue={selectedValue}
          style={{
            height: pickerHeight?pickerHeight:'100%',
            width: pickerWidth?pickerWidth:'100%',
            backgroundColor: backgroundColor?backgroundColor:Colors.inputFeildColor,
            borderRadius: borderRadius?borderRadius:null, 
            
          }}
          onValueChange={(itemValue) => setSelectedValue(itemValue)}
        >
          
          {items?.length > 0 ? (
             items.map((item, index) => (
              <Picker.Item key={index} label={item?.name} value={item?.customer_group_id} />
            ))

          ):<Picker.Item label={"N/A"} value={0} />
        }
         
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
    },
 
});

export default CustomDropdown;
