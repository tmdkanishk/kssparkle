
import { BlurView } from '@react-native-community/blur';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
import React, { memo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';


const { width } = Dimensions.get("window");


const CategoryItem = memo(({ item }) => {

  const navigation = useNavigation();
    const handlePress = () => {
    navigation.navigate('Category');
  };
  
  return(
  <TouchableOpacity onPress={handlePress} style={styles.categoryContainer}>
    <View style={styles.circle}>

      {/* Background blur behind */}
      <BlurView
        blurType="light"
        blurAmount={6}
        style={StyleSheet.absoluteFill}
        reducedTransparencyFallbackColor="transparent"
      />

      {/* ✅ Vertical top/bottom shadow (not left/right) */}
      <LinearGradient
        colors={[
          "rgba(0,0,0,0.18)",
          "transparent",
          "rgba(0,0,0,0.18)"
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.shadowGradient}
      />

      <Image
        source={{uri:item?.thumb}}
        style={styles.image}
      />
    </View>

    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>)



});

const styles = StyleSheet.create({
  categoryContainer: {
    width: width / 4,
    alignItems: "center",
    marginHorizontal: 15,
    marginBottom:10
  },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.03)", // ✅ subtle transparency
  },

  shadowGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 40,
    zIndex: 1,
  },

  image: {
    width: 48,
    height: 48,
    zIndex: 2, // ✅ on top of blur + gradient
  },


  categoryName: {
    marginTop: 6,
    fontSize: 14,
    color: "#FFFFFF",
    fontWeight: "500",
    textAlign: "center",
  },

});

export default memo(CategoryItem);
