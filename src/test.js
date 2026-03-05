// import React from "react";
// import { View, StyleSheet, Text } from "react-native";
// import {
//   Canvas,
//   RoundedRect,
//   LinearGradient,
//   vec,
//   useImage,
//   ImageShader,
//   Group,
//   Paint,
//   Blur,
// } from "@shopify/react-native-skia";

// const CARD_WIDTH = 150;
// const CARD_HEIGHT = 120;
// const BORDER_RADIUS = 24;

// const BoxWithShadow = ({ backgroundSource }) => {
//   const image = useImage(backgroundSource);

//   if (!image) return null;

//   return (
//     <View style={styles.wrapper}>
//       <Canvas style={StyleSheet.absoluteFill}>

//         {/* -------- REAL GLASS BLUR -------- */}
//         <Group
//           clip={{
//             x: 0,
//             y: 0,
//             width: CARD_WIDTH,
//             height: CARD_HEIGHT,
//             r: BORDER_RADIUS,
//           }}
//           layer={
//             <Paint>
//               {/* Increase this value for stronger blur */}
//               <Blur blur={25} />
//             </Paint>
//           }
//         >
//           <ImageShader
//             image={image}
//             x={0}
//             y={0}
//             width={CARD_WIDTH}
//             height={CARD_HEIGHT}
//             fit="cover"
//           />
//         </Group>

//         {/* -------- GLASS TINT -------- */}
//         <RoundedRect
//           x={0}
//           y={0}
//           width={CARD_WIDTH}
//           height={CARD_HEIGHT}
//           r={BORDER_RADIUS}
//         >
//           <LinearGradient
//             start={vec(0, 0)}
//             end={vec(CARD_WIDTH, CARD_HEIGHT)}
//             colors={[
//               "rgba(255,255,255,0.25)",
//               "rgba(255,255,255,0.08)",
//               "rgba(255,255,255,0.02)",
//             ]}
//           />
//         </RoundedRect>

//       </Canvas>

//       {/* -------- CONTENT -------- */}
//       <View style={styles.content}>
//         <Text style={styles.text}>Test</Text>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   wrapper: {
//     width: CARD_WIDTH,
//     height: CARD_HEIGHT,
//     borderRadius: BORDER_RADIUS,
//     overflow: "hidden",

//     // Outer glow
//     shadowColor: "#fff",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 12,
//     elevation: 8,
//   },
//   content: {
//     ...StyleSheet.absoluteFillObject,
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   text: {
//     color: "white",
//     fontSize: 16,
//     fontWeight: "600",
//   },
// });

// export default BoxWithShadow;



// import React, { Component } from "react";
// import { View, Image, Text, StyleSheet } from "react-native";
// import { BlurView } from "@react-native-community/blur";

// export default function BoxWithShadow() {
//   return (
//     <View style={styles.container}>
//       {/* <Image
//         key={'blurryImage'}
//          source={require('')}
//         style={styles.absolute}
//       /> */}
//       <Text style={styles.absolute}>Hi, I am some blurred text</Text>
//       {/* in terms of positioning and zIndex-ing everything before the BlurView will be blurred */}
//       <BlurView
//         style={styles.absolute}
//         blurType="light"
//         blurAmount={1}
//         reducedTransparencyFallbackColor="white"
//       />
//       <Text>I'm the non blurred text because I got rendered on top of the BlurView</Text>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     justifyContent: "center",
//     alignItems: "center"
//   },
//   absolute: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0
//   }
// });


// import React from 'react';
// import { View, StyleSheet, Text } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
// import { BlurView } from '@react-native-community/blur';

// const BoxWithShadow = () => {
//   return (
//     <View style={styles.card}>

//       {/* Blur background */}
//       <BlurView
//         style={styles.absolute}
//         blurType="light"
//         blurAmount={2}
//         reducedTransparencyFallbackColor="white"
//       />

//       {/* TOP */}
//       <LinearGradient
//         colors={['rgba(255,255,255,0.55)', 'transparent']}
//         style={[styles.edge, styles.top]}
//       />

//       {/* BOTTOM */}
//       <LinearGradient
//         colors={['transparent', 'rgba(255,255,255,0.45)']}
//         style={[styles.edge, styles.bottom]}
//       />

//       {/* LEFT */}
//       <LinearGradient
//         colors={['rgba(255,255,255,0.55)', 'transparent']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={[styles.edgeVertical, styles.left]}
//       />

//       {/* RIGHT */}
//       <LinearGradient
//         colors={['transparent', 'rgba(255,255,255,0.45)']}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//         style={[styles.edgeVertical, styles.right]}
//       />

//       {/* Content (NOT blurred) */}
//       <Text style={styles.text}>Test</Text>

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   card: {
//     width: 150,
//     height: 120,
//     borderRadius: 20,
//     borderWidth: 0.5,
//     borderColor: 'rgba(255,255,255,0.35)',
//     overflow: 'hidden',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },

//   text: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: '600',
//   },

//   edge: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     height: 3,
//   },

//   edgeVertical: {
//     position: 'absolute',
//     top: 0,
//     bottom: 0,
//     width: 3,
//   },
//   absolute: {
//     position: "absolute",
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0
//   },

//   top: { top: 0 },
//   bottom: { bottom: 0 },
//   left: { left: 0 },
//   right: { right: 0 },
// });

// export default BoxWithShadow;


import React from 'react';
import { Platform, StyleSheet, Text } from 'react-native';
// import LinearGradient from 'react-native-linear-gradient';
import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';

const BoxWithShadow = () => {
  return (
     <LiquidGlassView
      style={[
        { width: 200, height: 100, borderRadius: 20 },
        // !isLiquidGlassSupported && {  backgroundColor:
        //       Platform.OS === 'ios'
        //         ? 'transparent'
        //         : 'rgba(255,255,255,0.08)', },
      ]}
      interactive
      effect="clear"
    >
      <Text>Hello World</Text>
    </LiquidGlassView>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 150,
    height: 120,
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.35)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },

  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 3,
  },

  edgeVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 3,
  },

  top: { top: 0 },
  bottom: { bottom: 0 },
  left: { left: 0 },
  right: { right: 0 },
});

export default BoxWithShadow;