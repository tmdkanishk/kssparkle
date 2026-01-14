import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient'; // npm install react-native-linear-gradient

const GlassTestContainer = ({ title = 'Custom Message', style }) => {
  return (
    <ImageBackground
      source={{ uri: 'YOUR_BACKGROUND_IMAGE_URI' }}
      style={styles.container}
      blurRadius={0} // We'll use BlurView instead
    >
      <View style={[styles.wrapper, style]}>
        {/* Outer shadow container */}
        <View style={styles.outerShadow}>
          {/* Inner shadow container */}
          <View style={styles.innerShadowContainer}>
            {/* Gradient border */}
            <LinearGradient
              colors={[
                'rgba(255, 255, 255, 0.8)',
                'rgba(255, 255, 255, 0)',
                'rgba(255, 255, 255, 0.8)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              angle={131.83}
              style={styles.gradientBorder}
            >
              {/* Inner content container with blur */}
              <View style={styles.innerContent}>
                <BlurView
                  style={styles.absoluteFill}
                  blurType="light"
                  blurAmount={10}
                  reducedTransparencyFallbackColor="rgba(255,255,255,0.1)"
                />
                <View style={styles.contentWrapper}>
                  <Text style={styles.text}>{title}</Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

export default GlassTestContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrapper: {
    width: '95%',
    maxWidth: 400,
  },
  outerShadow: {
    // Outer shadow: 0px 3px 8px 3px rgba(53, 53, 53, 0.1)
    borderRadius: 12,
    shadowColor: '#353535',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8, // Android shadow
  },
innerShadowContainer: {
  borderRadius: 12,
  shadowColor: '#ffffff',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.35,
  shadowRadius: 14,
  backgroundColor: 'rgba(255, 255, 255, 0.05)',
},
  gradientBorder: {
    borderRadius: 12,
    padding: 0.64, // Border width
  },
  innerContent: {
    borderRadius: 11.36, // Slightly less than outer to account for border
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.005)',
    minHeight: 100,
  },
  absoluteFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  contentWrapper: {
    padding: 24.64,
    justifyContent: 'center',
    minHeight: 100,
  },
  text: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});