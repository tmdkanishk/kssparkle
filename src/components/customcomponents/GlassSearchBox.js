import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
// import Feather from 'react-native-vector-icons/Feather';

const GlassSearchBox = ({
  h,
  w,
  openModal,
  iconSize = 24,
  placeholder,
  Colors,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={openModal}
      style={[
        styles.glassSearchBox,
        {
          height: h,
          width: w,
          borderColor: Colors?.border_color,
        },
      ]}
    >
      {/* Blur Layer */}
      <BlurView
        style={StyleSheet.absoluteFill}
        blurType="light"
        blurAmount={15}
      />

      {/* Glass Gradient */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.25)',
          'rgba(255,255,255,0.1)',
          'rgba(255,255,255,0.25)',
        ]}
        style={StyleSheet.absoluteFill}
      />

      {/* Content */}
      <View style={styles.content}>
        {/* <Feather
          name="search"
          size={iconSize}
          color="white"
        /> */}
        <Text style={styles.placeholderText}>
          {placeholder || 'Search Product'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  glassSearchBox: {
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 0.6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    paddingHorizontal: 16,

    // Glow
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  placeholderText: {
    color: 'white',
    fontSize: 14,
    opacity: 0.9,
  },
});


export default GlassSearchBox;
