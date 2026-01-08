import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GlassContainer from './GlassContainer'; // 👈 import your existing one

const TopHighlights = ({ details = [] }) => {
  return (
    <GlassContainer title="Top highlights">
      <View style={{ padding: 20 }}>

        {/* Key-Value Highlights */}
        {details.map((item, index) => {
          // Skip empty values
          if (!item?.value) return null;

          return (
            <View style={styles.row} key={index}>
              <Text style={styles.label}>
                {item.text?.trim()}
              </Text>
              <Text style={styles.value}>
                {item.value}
              </Text>
            </View>
          );
        })}

      </View>
    </GlassContainer>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  label: {
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '800',
    fontSize: 13,
  },
  value: {
    color: '#fff',
    fontWeight: '400',
    fontSize: 13,
  },
  bulletsContainer: {
    marginTop: 8,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 20,
    marginRight: 6,
  },
  bulletText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },
  seeMore: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: '600',
    fontSize: 13,
    marginTop: 4,
  },
});

export default TopHighlights;
