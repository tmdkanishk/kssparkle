// import React, { memo } from "react";
// import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
// import { BlurView } from "@react-native-community/blur";
// import LinearGradient from "react-native-linear-gradient";

// const GlassButton = ({ title = "Add To Cart", onPress, style }) => {
//   return (
//     <TouchableOpacity
//       onPress={onPress}
//       activeOpacity={0.8}
//       style={[styles.glowWrapper, style]}
//     >
//       {/* Outer glow border */}
//       <LinearGradient
//         colors={[
//           "rgba(255,255,255,0.25)",
//           "rgba(255,255,255,0.05)",
//           "rgba(255,255,255,0.25)",
//         ]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 1 }}
//         style={styles.borderGlow}
//       />

//       {/* Main wrapper */}
//       <View style={styles.wrapper}>
//         {/* Frosted glass effect */}
//         <BlurView
//           style={StyleSheet.absoluteFill}
//           blurType="light"
//           blurAmount={20}
//           reducedTransparencyFallbackColor="white"
//         />

//         {/* Soft dark center gradient */}
//         <LinearGradient
//           colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0.15)", "rgba(0,0,0,0.35)"]}
//           start={{ x: 0, y: 0.5 }}
//           end={{ x: 1, y: 0.5 }}
//           style={StyleSheet.absoluteFill}
//         />

//         <Text style={styles.text}>{title}</Text>
//       </View>
//     </TouchableOpacity>
//   );
// };

// const styles = StyleSheet.create({
//   glowWrapper: {
//     height: 50,
//     borderRadius: 20,
//     overflow: "hidden",
//     shadowColor: "#ffffff",
//     shadowOffset: { width: 0, height: 0 },
//     shadowOpacity: 0.35,
//     shadowRadius: 10,
//     elevation: 8,
//   },

//   borderGlow: {
//     ...StyleSheet.absoluteFillObject,
//     borderRadius: 30,
//   },

//   wrapper: {
//     flex: 1,
//     borderRadius: 20,
//     overflow: "hidden",
//     backgroundColor: "rgba(255,255,255,0.05)",
//     borderWidth: 0.6,
//     borderColor: "rgba(255,255,255,0.8)",
//     justifyContent: "center",
//     alignItems: "center",
//   },

//   text: {
//     color: "#fff",
//     fontWeight: "700",
//     fontSize: 17,
//     letterSpacing: 0.5,
//   },
// });

// export default memo(GlassButton);


import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GlassButton = ({ title, onPress, style, textStyle, innerStyle }) => {
  const Content = () => (
    <Text style={[styles.text, textStyle]}>{title}</Text>
  );

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.wrapper, style]}
    >
      {Platform.OS === 'android' ? (
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.25)',
            'rgba(255,255,255,0.05)',
            'rgba(255,255,255,0.25)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.inner, innerStyle]}
        >
          <Content />
        </LinearGradient>
      ) : (
        <View style={[styles.inner, styles.iosGlass, innerStyle]}>
          <Content />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
  },

  inner: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    // borderWidth: 0.6,
  },

  iosGlass: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderColor: 'rgba(255,255,255,0.35)',

    // iOS shadow
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
  },

  text: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default memo(GlassButton);


