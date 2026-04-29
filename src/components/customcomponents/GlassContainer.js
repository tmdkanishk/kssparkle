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
import { requireNativeViewManager } from 'expo-modules-core';
import { Host } from '@expo/ui/swift-ui'; // 1. Import Host

const NativeView = requireNativeViewManager('LiquidGlassViewModule');


const GlassContainer = ({ title, children, style, padding, borderRadius }) => {
  const radius = borderRadius || 18;
  const [ready, setReady] = useState(false);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (mountedRef.current) return; // Only run once per mount
    mountedRef.current = true;

    const timer = setTimeout(() => setReady(true), 50);
    return () => clearTimeout(timer);
  }, []); // ← empty deps, no isFocused dependency

if (Platform.OS === 'ios') {
    return (
    <View style={[styles.glowWrapper, style]}>

      {/* --- Liquid Glass Layer (NEW) --- */}

      <Host >
        <NativeView style={{ borderRadius: radius, opacity: ready ? 1 : 0 }}>


          <View
            style={[
              styles.wrapper,
              {
                padding: padding || 14,
                borderRadius: radius,
                backgroundColor: "transparent",
              },
            ]}
          >


            {title && <Text style={styles.title}>{title}</Text>}
            <View style={[styles.content, style]}>{children}</View>

          </View>


        </NativeView>

      </Host>

    </View>
  );
  
}

  return (
<View style={[{  borderRadius: 18,
    marginVertical: 8,

    // iOS shadow (floating depth)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20, }, style]}>

      {/* --- Liquid Glass Layer (NEW) --- */}
{/* 
      <Host >
        <NativeView style={{ borderRadius: radius, opacity: ready ? 1 : 0 }}> */}


          <View
            style={[
              styles.wrapper,
              {
                padding: padding || 14,
                borderRadius: radius,
                backgroundColor: "transparent",
              },
            ]}
          >


            {title && <Text style={styles.title}>{title}</Text>}
            <View style={[styles.content, style]}>{children}</View>

          </View>


        {/* </NativeView>

      </Host> */}

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

    androidWrapper: {
    marginVertical: 8,
    backgroundColor: 'transparent',
    borderRadius:10,
    borderWidth:1.5,
    // borderColor:'white'
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