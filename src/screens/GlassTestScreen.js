import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LiquidGlassView, LiquidGlassContainerView, isLiquidGlassSupported } from '@callstack/liquid-glass';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';
import GlassContainer from '../components/customcomponents/GlassContainer';

export default function GlassTestScreen({navigation}) {
  return (
    <BackgroundWrapper>
                   <TouchableOpacity onPress={()=>navigation.goBack()} style={{alignItems:"center", justifyContent:'center', flex:0.5}}>
                       <Text>Back Button</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={()=>navigation.navigate("GlassTest")} style={{alignItems:"center", justifyContent:'center', flex:1}}>
                       <GlassContainer>
                   <Text>Testing Glass Test Screen</Text>
                       </GlassContainer>
   
                   </TouchableOpacity>
   
                    
   
               </BackgroundWrapper>
  );
}