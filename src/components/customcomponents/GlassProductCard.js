import React, { memo } from "react";
import { View, Image, StyleSheet } from "react-native";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";
const GlassProductCard = ({ imageSource }) => {
  return (
    <View style={styles.cardContainer}>
      {/* Outer glow border */}
      <LinearGradient
        colors={[
          "rgba(255,255,255,0.25)",
          "rgba(255,255,255,0.05)",
          "rgba(255,255,255,0.25)",
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGlow}
      />

      {/* Frosted glass layer */}
      <View style={styles.glassWrapper}>
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={20}
          reducedTransparencyFallbackColor="white"
        />

        {/* Subtle transparent dark gradient for depth */}
        <LinearGradient
          colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.1)", "rgba(0,0,0,0.3)"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Product Image */}
        <Image source={imageSource} style={styles.image}  />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: 65,
    height: 65,
    borderRadius: 20,
    overflow: "hidden",
    marginHorizontal: 12,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },

  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
  },

  glassWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 0.6,
    borderColor: "rgba(255,255,255,0.7)",
  },

  image: {
    width: "75%",
    height: "75%",
    alignSelf: "center",
    marginTop: "12%",
  },
});

export default memo(GlassProductCard);
