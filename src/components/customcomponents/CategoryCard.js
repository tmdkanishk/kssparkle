import React from "react";
import { View, Image, TouchableOpacity, Dimensions } from "react-native";
import GlassContainer from "./GlassContainer";
import GlassButton from "./GlassButton";

const screenWidth = Dimensions.get("window").width;

const CategoryCard = ({ item, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={{ width: "48%", alignItems: "center", marginBottom: 20 }}
    >
      <GlassContainer
        style={{
          width: screenWidth * 0.4,
          height: 220,
          justifyContent: "center",
          alignItems: "center",
          padding: 0,
        }}
        padding={0.1}
      >
        {/* IMAGE */}
        <View
          style={{
            width: "100%",
            height: "65%",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Image
            source={{ uri: item.image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="contain"
          />
        </View>

        {/* BUTTON */}
        <GlassButton
          title={item.name}
          textStyle={{ fontSize: 10, fontWeight: "600" }}
          style={{ paddingVertical: 8 , width:130}}
          innerStyle={{ }}
        />
      </GlassContainer>
    </TouchableOpacity>
  );
};

export default CategoryCard;
