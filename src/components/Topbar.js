import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React from 'react'
import Feather from '@expo/vector-icons/Feather';
import Cart from '../components/Cart';
import { useCustomContext } from '../hooks/CustomeContext';
import { IconComponentImage } from '../constants/IconComponents';

const Topbar = ({ toggleSidebar, isCartAnimation }) => {
  const { Colors, Features } = useCustomContext();
  return (
    <View style={[styles.topBarContainer,]}>
      <TouchableOpacity onPress={toggleSidebar}>
        <Feather name="menu" size={36} color={Colors.primary} />
      </TouchableOpacity>
      <View style={{ alignSelf: 'center', width: "50%", justifyContent: 'center', alignItems: 'center', height: 60,}}>
        {
          Features?.header_logo ? (
            <Image source={{ uri: Features?.header_logo }} style={{ resizeMode: 'contain', width: '100%', height: '100%' }} />
          ) : null
        }
      </View>
      <Cart isCartAnimation={isCartAnimation} />
    </View>
  )
}

const styles = StyleSheet.create({
  topBarContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
  }
})

export default Topbar

