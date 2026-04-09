import React, { memo, useRef, useState, useEffect } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { View, Text, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import LottieView from 'lottie-react-native';
import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import { InteractionManager } from 'react-native';

const GlassContainer = ({ title, children, style, padding, borderRadius }) => {
  // const [ready, setReady] = useState(false);

  // useEffect(() => {
  //   const task = InteractionManager.runAfterInteractions(() => {
  //     setReady(true);
  //   });

  //   return () => task.cancel();
  // }, []);

  // const isFocused = useIsFocused();
  // const [ready, setReady] = useState(false);

  // useEffect(() => {
  //   if (isFocused) {
  //     const id = setTimeout(() => setReady(true), 40);
  //     return () => clearTimeout(id);
  //   } else {
  //     setReady(false);
  //   }
  // }, [isFocused]);


  const radius = borderRadius ? borderRadius : 18;
    const isFocused = useIsFocused(); // Crucial for navigation stability
  const [layoutReady, setLayoutReady] = useState(false);

    // If navigation is "freezing" the view, this key change forces a native re-mount
  const navigationKey = Platform.OS === 'ios' ? `glass-${isFocused}` : 'glass-static';



  return (
    <View  style={[styles.glowWrapper, style]}>

      {/* --- Liquid Glass Layer (NEW) --- */}

        <LiquidGlassView
         key={navigationKey} // Forces re-init when screen is focused
          style={[{ borderRadius: radius, }, !isLiquidGlassSupported && { backgroundColor: 'transparent' }]}
          interactive
          effect="clear"
        >

          <View
            style={[
              styles.wrapper,
              {
                padding: padding ? padding : 14,
                borderRadius: radius,
                // Ensure background is transparent so glass can be seen
              backgroundColor: !isLiquidGlassSupported ? 'rgba(255,255,255,0.08)' : 'transparent',

                // backgroundColor: !isLiquidGlassSupported ? Platform.OS === 'ios' ? 'transparent' : 'rgba(255,255,255,0.08)'  : 'transparent',
              },
            ]}
          >


            {/* Glass Tint */}
            {/* Glass Tint (existing) */}
            {/* <LinearGradient
              colors={[
                'rgba(255,255,255,0.2)',
                'rgba(255,255,255,0.1)',
                'rgba(255,255,255,0.15)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
              pointerEvents="none"
            /> */}

            {/* ---- EDGE LIGHT (NEW) ---- */}


            {/* <LinearGradient
              colors={['rgba(255,255,255,0.55)', 'transparent']}
              style={[styles.edge, styles.top]}
              pointerEvents="none"
            />

            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.45)']}
              style={[styles.edge, styles.bottom]}
              pointerEvents="none"
            />


            <LinearGradient
              colors={['rgba(255,255,255,0.55)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.edgeVertical, styles.left]}
              pointerEvents="none"
            />


            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.45)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.edgeVertical, styles.right]}
              pointerEvents="none"
            /> */}

            {title && <Text style={styles.title}>{title}</Text>}
            <View style={[styles.content, style]}>{children}</View>

          </View>
        </LiquidGlassView>

    </View>
  );
};

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 18,
    marginVertical: 8,

    // iOS shadow (floating depth)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,

    // Android elevation
    // elevation: 12,
  },
  wrapper: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  content: {
    gap: 4,
  },
  edge: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 5,   // thickness of top/bottom highlight
  },

  edgeVertical: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 5,   // thickness of left/right highlight
  },

  top: {
    top: 0,
  },

  bottom: {
    bottom: 0,
  },

  left: {
    left: 0,
  },

  right: {
    right: 0,
  },
});

export default memo(GlassContainer);




// const rippleRef = useRef(null);

// const triggerRipple = () => {
//   rippleRef.current?.reset();
//   rippleRef.current?.play();
// };

// onTouchStart={triggerRipple}

{/* Ripple */ }
{/* <LottieView
              ref={rippleRef}
              source={require("../../assets/animation/ripple.json")}
              autoPlay={false}
              loop={false}
              style={[StyleSheet.absoluteFill, { transform: [{ scale: 2.5 }] }]}
              pointerEvents="none"
            /> */}