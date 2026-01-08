import React from "react";
import { View, Text, Image, StyleSheet, Platform, Dimensions } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Header from "./Header";
import Video from "react-native-video";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";

const width = Dimensions.get('window') 
const PromoCard = ({onSearchPress}) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={["#505050", "#808080"]} // ✅ Light → lighter bottom gradient
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.card}
    >

      <View style={styles.videoWrapper}>
        <Video
          source={require("../../assets/videowork.mp4")}
          style={styles.video}
          resizeMode="contain"
          repeat
          muted
          isLooping={true}
        />
      </View>



      {/* ✅ Header inside card */}
      <Header
        noBackground={true}
      paddingHorizontal={width * 0.05}
      onSearchPress={onSearchPress}
      // onProfilePress={()=>{navigation.navigate("MyAccountScreen")}}
      />

      {/* ✅ Sale Text Row */}
      <View style={styles.textRow}>
        <View>
          <Text style={styles.mainTitle}>Super Sale</Text>
          <Text style={[styles.mainTitle, { fontSize: 24 }]}>Discount</Text>
        </View>

        <View style={{ alignItems: "flex-end", flexDirection: 'row', marginRight:Platform.OS === "ios" ? 15 : 0}}>
          <Text style={styles.subTitle}>Up to</Text>
          <Text style={styles.percent}>50%</Text>
        </View>
      </View>


      {/* ✅ Floating Bubble */}
      <View style={styles.infoBubble}>
        <Text style={styles.infoText}>
          Accounting a new product or free shipping{"\n"}
          for a certain quantity. Subject to change
        </Text>
      </View>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: 440,
    borderRadius: 35,
    padding: 15,
    overflow: "hidden",
    marginTop: 10,
  },

  headerInside: {
    marginTop: 0,
    marginBottom: 10,
  },

  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    paddingHorizontal: 5,
    zIndex: 2, // ⬅️ ensures text stays visible
  },


  mainTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    marginBottom: 14,
  },

  percent: {
    fontSize: 40,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  imageWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginRight: 100
  },

  image: {
    width: 220,
    height: 220,
  },

  infoBubble: {
    position: "absolute",
    right: Platform.OS === "ios" ? 47: 7,
    bottom: 50,
    paddingVertical: 5,
    paddingHorizontal: 12,
    maxWidth: 150,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 0.4,
    borderColor: "rgba(255,255,255,0.4)",
    backdropFilter: "blur(6px)", // iOS only, optional
    zIndex:2
  },

  infoText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "400",
    textAlign: "left",
  },

  videoWrapper: {
    position: "absolute",
    top: "25%",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 1, // ⬅️ behind text
  },

  video: {
    width: 300,
    height: 300,
  },

});

export default React.memo(PromoCard);
