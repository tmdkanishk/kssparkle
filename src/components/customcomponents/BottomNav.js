import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import GlassContainer from "./GlassContainer";

const BottomNav = ({ navigation }) => {
  const tabs = [
    { label: "Cart", icon: require("../../assets/images/cart.png"), screen: "Cart" },
    { label: "Account", icon: require("../../assets/images/account.png"), screen: "Account" },
    { label: "Deals", icon: require("../../assets/images/deals.png"), screen: "Deals" },
    { label: "Categories", icon: require("../../assets/images/categories.png"), screen: "Categories" },
    { label: "Home", icon: require("../../assets/images/home.png"), screen: "Home" },
  ];

  return (
    <GlassContainer
      borderRadius={20}
      padding={1}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "92%",
        alignSelf: "center",
        marginBottom: 24,
        marginLeft:15
      }}
    >
      {tabs.map((tab, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => navigation.navigate(tab.screen)}
          style={{ alignItems: "center", justifyContent: "center" , marginTop:20}}
        >
          <Image
            source={tab.icon}
            style={{ width: 28, height: 28, tintColor: "#fff" }}
            resizeMode="contain"
          />
          <Text style={{ color: "#fff", fontSize: 13, marginTop: 3 }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </GlassContainer>
  );
};

export default BottomNav;
