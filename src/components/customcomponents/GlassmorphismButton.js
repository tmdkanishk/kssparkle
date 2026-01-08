// import React, { useRef } from "react";
// import {
//   View,
//   Text,
//   Animated,
//   PanResponder,
//   StyleSheet,
//   TouchableOpacity
// } from "react-native";
// import LinearGradient from "react-native-linear-gradient";
// import Ionicons from "react-native-vector-icons/Ionicons";
// import { BlurView } from "@react-native-community/blur";

// const GlassmorphismButton = ({ title, arrow = false, onSlideComplete, onPress}) => {
//   const slideX = useRef(new Animated.Value(0)).current;

//   // Width of slider track after render
//   const trackWidth = useRef(0);
//   const knobWidth = 55; // width of arrow knob circle


//   const panResponder = arrow
//     ? PanResponder.create({
//       onMoveShouldSetPanResponder: () => true,
//       onPanResponderMove: (_, gesture) => {
//         slideX.setValue(
//           Math.min(Math.max(0, gesture.dx), trackWidth.current - knobWidth)
//         );
//       },
//       onPanResponderRelease: (_, gesture) => {
//         if (gesture.dx > trackWidth.current - knobWidth - 10) {
//           // Fully Slid
//           Animated.timing(slideX, {
//             toValue: trackWidth.current - knobWidth,
//             duration: 150,
//             useNativeDriver: false,
//           }).start(() => onSlideComplete && onSlideComplete());
//         } else {
//           // Reset Back
//           Animated.spring(slideX, {
//             toValue: 0,
//             useNativeDriver: false,
//           }).start();
//         }
//       },
//     })
//     : {};

//   // Background Color transition during slide
//   const maxVal = Math.max(0, trackWidth.current - knobWidth);

//   const backgroundColor = slideX.interpolate({
//     inputRange: [0, maxVal],
//     outputRange: ["rgba(255,255,255,0.15)", "rgba(0,0,0,0.65)"],
//   });

//   return (
//     <Animated.View
//       onLayout={e => (trackWidth.current = e.nativeEvent.layout.width)}
//       style={[
//         styles.track,
//         { backgroundColor },
//       ]}
//     >
//       {/* Blur Effect */}
//       <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={20} />

//       <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.buttonContainer}>
//       <LinearGradient
//         style={styles.gradient}
//         colors={[
//           'rgba(255,255,255,1)', // light glass area
//           'rgba(0,0,0,0.55)' // dark glass area
//         ]}
//         start={{ x: 0, y: 0 }}
//         end={{ x: 1, y: 0 }}
//       >
//         <Text style={styles.buttonText}>{title}</Text>
//       </LinearGradient>
//     </TouchableOpacity>

//       {arrow && (
//         <Animated.View
//           {...panResponder.panHandlers}
//           style={[
//             styles.knob,
//             { transform: [{ translateX: slideX }] },
//           ]}
//         >
//           <BlurView style={StyleSheet.absoluteFill} blurType="light" blurAmount={12} />
//           <Ionicons name="arrow-forward" size={22} color="#fff" />
//         </Animated.View>
//       )}
//     </Animated.View> 
//   );
// };

// export default GlassmorphismButton;

// const styles = StyleSheet.create({
//   track: {
//     height: 58,
//     borderRadius: 50,
//     // borderWidth: 1,
//     // borderColor: "rgba(255,255,255,0.35)",
//     overflow: "hidden",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 12,
//   },
//   title: {
//     position: "absolute",
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "600",
//   },
//   knob: {
//     width: 55,
//     height: 55,
//     borderRadius: 40,
//     backgroundColor: "rgba(255,255,255,0.25)",
//     position: "absolute",
//     justifyContent: "center",
//     alignItems: "center",
//     right: undefined,
//   },
//   buttonContainer: {
//     width: '98%',
//     height: 50,
//     borderRadius: 20,
//     borderWidth: 1,
//     borderColor: 'rgba(255,255,255,0.4)',
//     overflow: 'hidden',
//     alignSelf: 'center',
//   },
//   gradient: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderRadius: 15,
//     opacity: 0.9, // controls glass transparency
//   },
//   buttonText: {
//     fontSize: 15,
//     fontWeight: '400',
//     color: 'white',
//   },
// });







import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GlassmorphismButton = ({ 
  onPress, 
  title = "Send Code", 
  image,             // image prop
  showImage = false,  // 👈 default is false
  disabled
}) => {

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}   style={[styles.buttonContainer, disabled && { opacity: 0.5 }]} >
      <LinearGradient
        style={styles.gradient}
        colors={[
          'rgba(255,255,255,1)',
          'rgba(0,0,0,0.55)'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >

        {/* Show only if showImage = true AND image prop is provided */}
        {showImage && image && (
          <Image 
            source={image}
            style={styles.icon}
            resizeMode="contain"
          />
        )}

        <Text style={styles.buttonText}>{title}</Text>

      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 50,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  gradient: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    borderRadius: 15,
    opacity: 0.9,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '400',
    color: 'white',
  },
  icon: {
    width: 20,
    height: 20,
  },
});

export default memo(GlassmorphismButton);
