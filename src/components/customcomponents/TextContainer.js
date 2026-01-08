import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React, { memo } from 'react';
import LinearGradient from 'react-native-linear-gradient';

const TextContainer = () => {
  return (
    <View style={styles.glowWrapper}>
      {/* Subtle white glow around border */}
      {/* <LinearGradient
        colors={[
          'rgba(255,255,255,0.25)',
          'rgba(255,255,255,0.08)',
          'rgba(255,255,255,0.25)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.borderGlow}
      /> */}

      <View style={styles.wrapper}>
        {/* ✅ Lighter glass gradient */}
        {/* <LinearGradient
          colors={[
            'rgba(255,255,255,0.25)',
            'rgba(255,255,255,0.15)',
            'rgba(255,255,255,0.25)',
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={StyleSheet.absoluteFill}
        /> */}

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.mainText}>
            ₹14,495{' '}
            <Text style={styles.subText}>
              Payments of 30r divide your bill by
            </Text>
          </Text>

          <Text style={styles.secondaryText}>
            No late fees, compliant with Islamic law
          </Text>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <View style={styles.leftRow}>
              <TouchableOpacity activeOpacity={0.7}>
                <Text style={styles.knowMore}>I know more</Text>
              </TouchableOpacity>

              {/* Gradient Pills next to “I know more” */}
              <View style={styles.brandsContainer}>
  <View style={styles.brandPill}>
    <Text style={styles.brandText}>Tabby</Text>
  </View>

  <View style={styles.brandPill}>
    <Text style={styles.brandText}>Tamari</Text>
  </View>
</View>

            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 15,
    height: 120,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },

  wrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.9)',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  mainText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  subText: {
    fontWeight: '400',
    color: '#fff',
  },

  secondaryText: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },

  bottomRow: {
    marginTop: 10,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // ✅ Keeps “I know more” and pills close
  },

  knowMore: {
    fontWeight: '700',
    fontSize: 14,
    color: '#fff',
    textDecorationLine: 'underline',
  },

  brandsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  brandPill: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,

    // Solid + slight glass feel
    backgroundColor: 'rgba(0, 181, 91, 0.9)',

    // Optional glass border
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.5)',

    // Subtle shadow
    shadowColor: '#00B55B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },



  brandText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default memo(TextContainer);
