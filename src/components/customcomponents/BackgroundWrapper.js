import React, { useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";

export default function BackgroundWrapper({ children, backgroundColor }) {
  const [loaded, setLoaded] = useState(false);

  return (
    <ImageBackground
      source={require("../../assets/images/backgroundimage.png")}
      style={styles.bg}
      resizeMode="cover"
      onLoadEnd={() => setLoaded(true)}
    >
      {/* Overlay with dynamic background color */}
      <View
        style={[
          styles.overlay,
          { backgroundColor: backgroundColor || "rgba(0,0,0,0.4)" },
        ]}
      />

      {/* Your app content */}
      {loaded && children}
    </ImageBackground>
  );
}


const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Covers the whole image
  },
});
