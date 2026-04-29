import React from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function BackgroundWrapper({ children, backgroundColor }) {
  return (
    <ImageBackground
      source={require("../../assets/images/backgroundimage.png")}
      style={styles.bg}
      resizeMode="cover"
    >
      {/* IMPORTANT: pointerEvents none */}
      <View
        pointerEvents="none"
        style={[
          styles.overlay,
          { backgroundColor: backgroundColor || "rgba(0,0,0,0.4)" },
        ]}
      />

      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});