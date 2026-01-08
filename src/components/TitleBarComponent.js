import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useCustomContext } from '../hooks/CustomeContext';

const TitleBarComponent = ({ titleName, onClickBackIcon, Component1, Component2, onClickIcon1, onClickIcon2 }) => {
  const { Colors } = useCustomContext();
  return (
    <View style={{
      backgroundColor: '#f5f5f5',
      paddingBottom: 5
    }}>
      <View style={[styles.titleBarConatiner, {backgroundColor: Colors.headerBgColor}]}>
        <View style={{ flexDirection: 'row', gap: 20,  width:'50%'}}>
          <TouchableOpacity onPress={onClickBackIcon}>
            <FontAwesome6 name="arrow-left-long" size={24} color="black" />
          </TouchableOpacity>
          <Text style={commonStyles.smallHeading}>{titleName}</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10, justifyContent:'flex-end',}}>
          {
            Component1 ? (
              <TouchableOpacity onPress={onClickIcon1}>
                <Component1 />
              </TouchableOpacity>
            ) : null

          }

          {
            Component2 ? (
              <TouchableOpacity onPress={onClickIcon2}>
                <Component2 />
              </TouchableOpacity>
            ) : null
          }

        </View>

      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  titleBarConatiner: {
    width: '100%',
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: 'center',
    height: 70,
    borderRadius: 1,
    shadowColor: '#000',
    justifyContent: 'space-between',
    shadowOffset: {
      width: 0,
      height: 4, // Adjust this for bottom shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
})

export default TitleBarComponent