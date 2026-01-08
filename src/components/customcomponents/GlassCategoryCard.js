import React, { memo } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { BlurView } from "@react-native-community/blur";
import LinearGradient from "react-native-linear-gradient";

const GlassCategoryCard = ({ item, onPress, fullWidth }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={[styles.wrapper, fullWidth && { flexBasis: "100%" }]}
    >
      {/* Outer Glow Gradient */}
      <LinearGradient
        colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.05)"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientBorder}
      >
        {/* Glass effect container */}
        <BlurView
          style={[styles.glassContainer, fullWidth && { height: 180 }]}
          blurType="light"
          blurAmount={12}
          reducedTransparencyFallbackColor="rgba(255,255,255,0.1)"
        >
          {/* Category Image */}
          <Image
            source={item.image}
            style={[styles.image, fullWidth && { width: 100, height: 100 }]}
          />

          {/* Category Title */}
          <View style={styles.textWrapper}>
            <Text
              style={[
                styles.text,
                fullWidth ? styles.fullText : styles.normalText,
              ]}
              numberOfLines={1}
            >
              {item.name}
            </Text>
          </View>
        </BlurView>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 6,
  },
  gradientBorder: {
    borderRadius: 20,
    padding: 2,
  },
  glassContainer: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    height: 160,
  },
  image: {
    width: 70,
    height: 70,
    resizeMode: "contain",
    marginBottom: 10,
  },
  textWrapper: {
    alignItems: "center",
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
  fullText: {
    fontSize: 14,
  },
  normalText: {
    fontSize: 12,
  },
});

export default memo(GlassCategoryCard);
