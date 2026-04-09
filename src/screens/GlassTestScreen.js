import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LiquidGlassView, LiquidGlassContainerView, isLiquidGlassSupported } from '@callstack/liquid-glass';

export default function GlassTestScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'blue' }}>
      <LiquidGlassContainerView style={{ flex: 1 }}>
        
        <Text style={{ color: 'white', margin: 20, fontSize: 18 }}>
          Supported: {String(isLiquidGlassSupported)}
        </Text>

        <LiquidGlassView
          style={{
            height: 120,
            margin: 20,
            borderRadius: 18,
            borderWidth:1
          }}
          effect="regular"
        >
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: 'white', fontSize: 16 }}>GLASS VIEW</Text>
          </View>
        </LiquidGlassView>

      </LiquidGlassContainerView>
    </View>
  );
}