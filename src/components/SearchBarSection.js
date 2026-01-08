import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native'
import React from 'react'
import Searchbar from './Searchbar'
import Cart from './Cart'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useNavigation } from '@react-navigation/native';
import { useCustomContext } from '../hooks/CustomeContext';

const SearchBarSection = ({ onClickSearch, query, isCartAnimation }) => {
  const { Colors, LogoChar } = useCustomContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const navigation = useNavigation();

  const handleGoBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.replace('Home');
    }
  }

  return (
    <View>

      {/* <TouchableOpacity onPress={() => handleGoBack()}>
        <FontAwesome6 name="arrow-left-long" size={24} color={Colors.black} />
      </TouchableOpacity> */}
      <Searchbar w={isLandscape ? '80%' : '60%'} h={46} iconSize={18} onClickSearch={(query) => onClickSearch(query)} query={query} />
      {/* <Cart isCartAnimation={isCartAnimation} /> */}
    </View>
    
  )
}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    height: 70,
    borderRadius: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4, // Adjust this for bottom shadow
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    justifyContent: 'space-between'
  },
  customIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginRight: 8
  }
})

export default SearchBarSection