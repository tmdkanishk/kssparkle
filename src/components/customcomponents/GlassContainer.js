import React, { memo } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GlassContainer = ({ title, children, style, padding, borderRadius }) => {
  return (
    <View style={[styles.glowWrapper, style]}>
      <View style={[styles.wrapper, {padding: padding ? padding : 14,  borderRadius: borderRadius ? borderRadius : 18}]}>
        <LinearGradient
          colors={[
            'rgba(255,255,255,0.2)',
            'rgba(255,255,255,0.1)',
            'rgba(255,255,255,0.15)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        {title && <Text style={styles.title}>{title}</Text>}
        <View style={[styles.content, style]}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 18,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginVertical: 8,
  },
  wrapper: {
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.8)',
 backgroundColor: Platform.OS === 'ios'  ? 'transparent'    : 'rgba(255,255,255,0.08)',
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
});

export default memo(GlassContainer);
