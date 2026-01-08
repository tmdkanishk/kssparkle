import React, { memo, useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import LinearGradient from 'react-native-linear-gradient';
import { Image } from 'react-native';
// import Ionicons from 'react-native-vector-icons/Ionicons';

const GlassmorphismInput = ({ placeholder, style, secureTextEntry = false, value, onChangeText, ...props }) => {
const width = Dimensions.get("window").width;
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);




  return (
    <View style={styles.glowWrapper}>
      {/* Gradient Border Glow */}
      <LinearGradient
        colors={[
          'rgba(255,255,255,0.25)',
          'rgba(255,255,255,0)',
          'rgba(255,255,255,0.25)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGlow}
      />

      <View style={styles.wrapper}>
        {/* Blur layer */}
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="light"
          blurAmount={15}
          reducedTransparencyFallbackColor="white"
        />

        {/* Dark Center Gradient */}
        <LinearGradient
          colors={[
            'rgba(0,0,0,0.3)',
            'rgba(0,0,0,0.1)',
            'rgba(0,0,0,0.3)',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        />

        {/* Input with icon */}
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, style]}
            {...props}
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.7)"
            secureTextEntry={secureTextEntry && !isPasswordVisible}
             value={value}                 // ✅ IMPORTANT
            onChangeText={onChangeText}   // ✅ IMPORTANT
          />

          {secureTextEntry && (
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              activeOpacity={0.7}
              style={styles.iconContainer}
            >
              <Image style={{width:15, height:15, paddingHorizontal:11, zIndex:1}} source={require('../../assets/images/eye_close.png')} />
              {/* <Ionicons
                name={isPasswordVisible ? 'eye' : 'eye-off'}
                size={20}
                color="rgba(255,255,255,0.8)"
              /> */}
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glowWrapper: {
    height: 49,
    borderRadius: 15,
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    width: "100%",
  },
  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },
  wrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 0.4,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    flex: 1,
    paddingHorizontal: 20,
    color: '#FFFFFF',
    fontSize: 16,
    
  },
  iconContainer: {
    paddingRight: 15,
  },
});

export default memo(GlassmorphismInput);
