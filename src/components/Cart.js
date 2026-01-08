import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Feather from '@expo/vector-icons/Feather';
import commonStyles from '../constants/CommonStyles';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCustomContext } from '../hooks/CustomeContext';
import { _retrieveData } from '../utils/storage';
import LottieView from 'lottie-react-native';
import { useCartCount } from '../hooks/CartContext';

const Cart = ({ isCartAnimation }) => {
  const { cartCount } = useCartCount();
  const [isCartCount, setCartCount] = useState(0);
  const [isCartAmount, setCartAmount] = useState(0);
  const { Colors } = useCustomContext();
  const navigate = useNavigation();
  const animationRef = useRef(null);

  // useEffect(() => {
  //   onPlayEffect();
  // }, [cartCount]);

  // useFocusEffect(
  //   useCallback(() => {
  //     // onPlayEffect();
  //     // getUserCartInfo();
  //   }, [])
  // );


  // const getUserCartInfo = async () => {
  //   const cartCount = await _retrieveData("CART_PRODUCT_COUNT");
  //   const cartAmount = await _retrieveData("CART_PRODUCT_AMOUNT");
  //   setCartCount(cartCount);
  //   setCartAmount(cartAmount);
  // }

  const onPlayEffect = () => {
    animationRef.current.play();
  }

  return (
    <TouchableOpacity style={[styles.cartContainer, { backgroundColor: Colors.primary }]} onPress={() => navigate.navigate('CartScreen')}>
      <View style={{ position: 'relative', width: '100%', height: '100%', alignContent: 'center', justifyContent: 'center' }}>
        <LottieView
          ref={animationRef}
          source={require("../assets/animation/congeffect.json")}
          autoPlay={false}
          loop={false}
          style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1, bottom: 20, }}
        />
        <View style={{ zIndex: 1, flexDirection: 'row', gap: 10, alignContent: 'center', justifyContent: 'center' }}>
          <Feather name="shopping-cart" size={24} color={Colors.white} />
          <Text style={{ fontSize: 18, color: Colors?.white }}>{cartCount}</Text>
        </View>

      </View>


    </TouchableOpacity>
  )
}

export default Cart

const styles = StyleSheet.create({
  cartContainer: {
    paddingHorizontal: 5,
    borderRadius: 4,
    opacity: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: 80
  }

})