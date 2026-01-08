import React from "react";
import {
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  View,
} from "react-native";
import Colors from "../../constants/Colors";

const OptionCard = ({ item, selected, onPress }) => {
  const imageSource = item?.image
    ? { uri: item.image }
    : require("../../assets/images/headphonesblack.png");

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.optionCard,
        selected && styles.optionCardSelected,
      ]}
    >
      <Image
        source={imageSource}
        style={styles.optionImage}
      />

      <Text style={styles.optionLabel}>{item?.name}</Text>
    </TouchableOpacity>
  );
};



const styles = StyleSheet.create({
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionCard: {
    width: 90,
    padding: 8,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  optionImage: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  optionFallback: {
    width: 60,
    height: 60,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  optionLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'center',
  },
});


export default OptionCard
