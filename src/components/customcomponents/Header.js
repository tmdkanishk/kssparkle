import React, { memo, useEffect, useState } from "react";
import { View, Image, TouchableOpacity, StyleSheet, Text, Dimensions, Platform } from "react-native";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
import { useCartCount } from "../../hooks/CartContext";
import { useNavigation } from "@react-navigation/native";
import FailedModal from "../FailedModal";
import { _retrieveData } from "../../utils/storage";
import { IconComponentLogin } from "../../constants/IconComponents";
import SearchBarSection from "../SearchBarSection";
import CustomSearchBar from "../../screens/CustomSearchBar";
// import Ionicons from "react-native-vector-icons/Ionicons";

const { width } = Dimensions.get("window");

const Header = ({ onSearchPress, onProfilePress, onLogoPress, paddingHorizontal }) => {
  const { updateCartCount, cartCount } = useCartCount();
  const navigation = useNavigation();
  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorModalMgs, setErrorModalMgs] = useState();
  const [customerId, setCustomerId] = useState(null);
  // const [activeSeachingScreen, setActiveSeachingScreen] = useState(false);

  useEffect(() => {
    const loadCustomer = async () => {
      const user = await _retrieveData('CUSTOMER_ID');
      setCustomerId(user);
    };

    loadCustomer();
  }, []);

  const goToCheckoutPage = () => {
    if (cartCount <= 0) {
      setErrorModal(true);
      setErrorModalMgs('Please add item to cart');
      return;
    }
    navigation.navigate('ShoppingBag');
  };

  const goToProfilePage = () => {
    navigation.navigate('MyAccountScreen');
  };

  // if (activeSeachingScreen) {
  //       return (
  //           <CustomSearchBar setActiveSeachingScreen={setActiveSeachingScreen} />
  //       )
  //   }



  return (
    <>
      <View style={[styles.container, { paddingHorizontal: paddingHorizontal ? paddingHorizontal : width * 0.05 }]}>


        {/* App Logo */}
        <TouchableOpacity onPress={onLogoPress}>
          <Image
            source={require("./../../assets/images/sparklelogo.png")}
            style={styles.logo}
            resizeMode="contain"
          />
        </TouchableOpacity>
        {/* Search Box */}
        <TouchableOpacity
          style={styles.glassSearchBox}
          activeOpacity={0.8}
          onPress={onSearchPress}
        >
          <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={15} />

          <LinearGradient
            colors={["rgba(0,0,0,0.25)", "rgba(0,0,0,0.05)", "rgba(0,0,0,0.25)"]}
            style={StyleSheet.absoluteFill}
          />

          <Text style={{ color: "white", fontSize: 10, marginLeft: 3 }}>Search Product</Text>

          <View style={{ flexDirection: "row", alignItems: "center" }}>
   
          </View>
        </TouchableOpacity>

        {/* <SearchBarSection /> */}

        <TouchableOpacity onPress={() => goToCheckoutPage()} style={{}} activeOpacity={0.8}>
          <View style={styles.cartWrapper}>
            <Image
              source={require("../../assets/images/parcel.png")}
              style={styles.bagIcon}
              resizeMode="contain"
            />

            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>
                  {cartCount > 99 ? "99+" : cartCount}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>


        {/* Profile Icon */}
        {customerId ? (
          <TouchableOpacity onPress={goToProfilePage}>
            <Image
              source={require('./../../assets/images/profile.png')}
              style={{width: width * 0.1,  height: width * 0.1, borderRadius: (width * 0.1) / 2, marginLeft:Platform.OS === "android" ? 20 : 0}}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => navigation.replace('Login')}
            style={{ marginRight: Platform.OS === "ios" ? 5 : 0 }}
          >
            <IconComponentLogin />
          </TouchableOpacity>
        )}



      </View>

      <FailedModal
        isSuccessMessage={isErrorModalMgs}
        handleCloseModal={() => setErrorModal(false)}
        isModal={isErrorModal}
        onClickClose={() => setErrorModal(false)}
      />
    </>
  );
};




export default memo(Header);

const styles = StyleSheet.create({
  container: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // paddingHorizontal: width * 0.05,
  },
  logo: {
    width: width * 0.22, // 22% of screen width
    height: width * 0.22, // proportional height
  },
  glassSearchBox: {
    width: 110,    // fixed width
    height: width * 0.1,
    marginHorizontal: width * 0.01,
    borderRadius: width * 0.07,
    paddingHorizontal: width * 0.03,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 0.6,
    borderColor: "rgba(255,255,255,0.4)",
    overflow: "hidden",
    shadowColor: "#ffffff",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  profileIcon: {
    width: width * 0.1, // 10% of screen width
    height: width * 0.1,
    borderRadius: (width * 0.1) / 2,
  },
  cartWrapper: {
    position: "relative",
    width: width * 0.1,
    height: width * 0.1,
    alignItems: "center",
    justifyContent: "center",
  },

  bagIcon: {
    width: "70%",
    height: "70%",
  },

  cartBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#ff3b30", // iOS red
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

});
