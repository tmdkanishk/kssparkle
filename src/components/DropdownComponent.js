import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCustomContext } from '../hooks/CustomeContext';

const data = [{ label: '1', value: '1' },
{ label: '2', value: '2' },
{ label: '3', value: '3' },
{ label: '4', value: '4' },
{ label: '5', value: '5' },
{ label: '6', value: '6' },
{ label: '7', value: '7' },
{ label: '8', value: '8' },
{ label: '9', value: '9' },
{ label: '10', value: '10' },
{ label: '11', value: '11' },
{ label: '12', value: '12' },
{ label: '13', value: '13' },
{ label: '14', value: '14' },
{ label: '15', value: '15' },
{ label: '16', value: '16' },
{ label: '17', value: '17' },
{ label: '18', value: '18' },
{ label: '19', value: '19' },
{ label: '20', value: '20' },

]

const DropdownComponent = ({ setQtySize, isQtySize }) => {
  const { Colors, } = useCustomContext();
  const [value, setValue] = useState(isQtySize);
  const [isFocus, setIsFocus] = useState(false);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && { color: Colors?.primary }]}>
          Select
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {renderLabel()}
      <Dropdown
        style={[styles.dropdown, isFocus && { borderColor: Colors?.primary }]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={data}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={value && !isFocus ? value : '...'}
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          setQtySize(item.value)
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  icon: {
    marginRight: 5,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});