import React, { useEffect } from 'react'
import { StyleSheet, View, Pressable } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from 'react-native-reanimated'
import { BlurView } from 'expo-blur'

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView)

const LiquidGlassOrb = ({
  children,
  size = 160,
  intensity = 50,
  style,
  onPress,
}) => {
  const scale = useSharedValue(1)
  const rotate = useSharedValue(0)
  const shimmer = useSharedValue(0)

  // Continuously rotate the iridescent border
  useEffect(() => {
    rotate.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    )
    shimmer.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1500 }),
        withTiming(0.6, { duration: 1500 })
      ),
      -1,
      true
    )
  }, [])

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 12, stiffness: 200 })
  }
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 12, stiffness: 200 })
  }

  const animatedOrbStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  // The rotating ring uses a CSS-like trick: 
  // a larger circle behind the orb with a conic gradient border
  const animatedRingStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotate.value}deg` }],
    opacity: shimmer.value,
  }))

  const borderSize = size + 6

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress} style={style}>
      <Animated.View style={[{ width: size, height: size }, animatedOrbStyle]}>

        {/* Iridescent rotating ring behind orb */}
        <Animated.View
          style={[
            styles.ring,
            animatedRingStyle,
            {
              width: borderSize,
              height: borderSize,
              borderRadius: borderSize / 2,
              top: -3,
              left: -3,
            },
          ]}
        />

        {/* Chromatic aberration layers — offset colored glows */}
        <View
          style={[
            styles.aberrationRed,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />
        <View
          style={[
            styles.aberrationBlue,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        />

        {/* Main glass orb */}
        <AnimatedBlurView
          intensity={intensity}
          tint="light"
          style={[
            styles.orb,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          {/* Inner highlight — the "glare" streak */}
          <View style={styles.glare} />
          <View style={styles.content}>{children}</View>
        </AnimatedBlurView>

      </Animated.View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  ring: {
    position: 'absolute',
    borderWidth: 2,
    // Simulated conic gradient with alternating colors
    borderColor: 'transparent',
    // Use a gradient border trick via background
    backgroundColor: 'transparent',
    // On React Native we fake it with a colored shadow ring:
    shadowColor: '#a78bfa',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    // For the actual rainbow: layer multiple shadow colors isn't 
    // possible natively — use a LinearGradient border instead (see below)
  },
  aberrationRed: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 80, 80, 0.08)',
    transform: [{ translateX: 2 }, { translateY: -1 }],
  },
  aberrationBlue: {
    position: 'absolute',
    backgroundColor: 'rgba(80, 120, 255, 0.08)',
    transform: [{ translateX: -2 }, { translateY: 1 }],
  },
  orb: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  glare: {
    position: 'absolute',
    top: '10%',
    left: '15%',
    width: '45%',
    height: '25%',
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    transform: [{ rotate: '-20deg' }],
  },
  content: {
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

export default LiquidGlassOrb