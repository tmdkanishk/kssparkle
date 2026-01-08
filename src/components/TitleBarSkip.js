import { View, Text, StyleSheet, TouchableOpacity, } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useCustomContext } from '../hooks/CustomeContext';


const TitleBarSkip = ({ onClickBackIcon, onClickSkip, isDisableSkipBtn}) => {
  const { Colors } = useCustomContext();
  return (
    <View style={{
      backgroundColor: '#f5f5f5',
      paddingBottom: 5
    }}>
      <View style={styles.titleBarConatiner}>
        <TouchableOpacity onPress={onClickBackIcon}>
          <FontAwesome6 name="arrow-left-long" size={24} color="black" />
        </TouchableOpacity>

        {
          !isDisableSkipBtn ? (
            <TouchableOpacity>
              <Text style={[commonStyles.textPrimary, { color: Colors.primary }]} onPress={onClickSkip}>Skip</Text>
            </TouchableOpacity>
          ) : null
        }

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
    justifyContent: 'space-between',
    borderRadius: 1,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Adjust this for bottom shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  }
})

export default TitleBarSkip