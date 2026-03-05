import React, { memo } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Platform,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';

const GlassButton = ({ title, onPress, style, textStyle, innerStyle }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[styles.wrapper, style]}
    >
      <LiquidGlassView
        style={styles.liquid}
        effect="clear"
        interactive
      >
        <View
          style={[
            styles.inner,
            {
              backgroundColor:
                !isLiquidGlassSupported && Platform.OS === 'android'
                  ? 'rgba(255,255,255,0.08)'
                  : 'transparent',
            },
            innerStyle,
          ]}
        >
          {/* Tint layer (important for glass visibility) */}
          {/* <LinearGradient
            colors={[
              'rgba(255,255,255,0.35)',
              'rgba(255,255,255,0.08)',
              'rgba(255,255,255,0.25)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
            pointerEvents="none"
          /> */}

          <Text style={[styles.text, textStyle]}>{title}</Text>
        </View>
      </LiquidGlassView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 12,
  },

  liquid: {
    borderRadius: 12,
  },

  inner: {
    paddingVertical: 10,
    paddingHorizontal: 22,
    borderRadius: 12,
    overflow: 'hidden',

    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.45)',

    // Lift effect
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },

  text: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default memo(GlassButton);