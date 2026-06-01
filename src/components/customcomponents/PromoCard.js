import React from "react";
import { View, Text, Image, StyleSheet, Platform, Dimensions, Linking, TouchableOpacity, I18nManager } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Header from "./Header";
import Video from "react-native-video";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { LiquidGlassView } from "@callstack/liquid-glass";
import { scaleFont, scaleH, scaleW } from "../../utils/scale";

const width = Dimensions.get('window')
const PromoCard = ({ onSearchPress, textInfo, specialInfo, specialInfo_2, specialInfo_3, specialInfo_4, specialInfo_5 }) => {
  const navigation = useNavigation();
  return (
    <LinearGradient
      colors={["#505050", "#808080"]} // ✅ Light → lighter bottom gradient
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.card}
    >

      <View style={styles.videoWrapper}>

        {Platform.OS === 'ios' ? (
          <Video
            source={require("../../assets/videowork.mp4")}
            style={styles.video}
            resizeMode="contain"
            repeat
            muted
            isLooping={true}
          />
        ) : (
          <LottieView
            source={require("../../assets/videowork_android_lottie.json")}
            autoPlay
            loop
            resizeMode="contain"
            style={styles.video}
          />
        )}

      </View>



      {/* ✅ Header inside card */}
      <Header
        noBackground={true}
        paddingHorizontal={Platform.OS === "ios" ? width * 0.05 : width}
        onSearchPress={onSearchPress}
      // onProfilePress={()=>{navigation.navigate("MyAccountScreen")}}
      />


      {/* ✅ Sale Text Row */}
      <View style={styles.textRow}>
        <View style={{ marginLeft: I18nManager.isRTL ? 20 : null, }}>
          <Text style={styles.mainTitle}>{specialInfo}</Text>
          <Text style={[styles.mainTitle, { fontSize: scaleFont(24) }]}>{specialInfo_2}</Text>
          <Text style={[styles.mainTitle, { fontSize: scaleFont(24) }]}>{specialInfo_3}</Text>
        </View>

        <View style={{ alignItems: "flex-end", flexDirection: 'row', marginRight: Platform.OS === "ios" ? 15 : 0 }}>
          <Text style={styles.subTitle}>{specialInfo_4}</Text>
          <Text style={styles.percent}>{specialInfo_5}</Text>
        </View>
      </View>


      {/* ✅ Floating Bubble */}
      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => Linking.openURL('https://sparkleksa.com/عروضنا-المميزه')}
      > */}
      <LiquidGlassView
        effect="clear"
        interactive
        style={{
          position: "absolute",
          right: scaleW(Platform.OS === "ios" ? 47 : 7),
          bottom: scaleH(40),
          paddingVertical: scaleH(5),
          paddingHorizontal: scaleW(12),
          maxWidth: scaleW(150),
          borderRadius: scaleW(18),
          zIndex: 2,
        }}
      >
        <TouchableOpacity onPress={() => navigation.navigate("Category")}>
          <Text style={styles.infoText}>{textInfo} </Text>
        </TouchableOpacity>
      </LiquidGlassView>
      {/* </TouchableOpacity> */}

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    height: scaleH(480),       // 👈 scales with screen height
    borderRadius: scaleW(35),
    padding: scaleW(13),
    overflow: "hidden",
    marginTop: scaleH(10),
  },

  headerInside: {
    marginTop: 0,
    marginBottom: 10,
  },

  textRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: scaleH(12),
    paddingHorizontal: scaleW(5),
    zIndex: 2,
  },

  mainTitle: {
    fontSize: scaleFont(32),   // 👈 scales with screen width
    fontWeight: "700",
    color: "#FFFFFF",
  },

  subTitle: {
    fontSize: scaleFont(18),
    color: "#FFFFFF",
    marginBottom: scaleH(14),
    marginLeft: I18nManager.isRTL ? 10 : null,
  },

  percent: {
    fontSize: scaleFont(35),
    fontWeight: "800",
    color: "#FFFFFF",
    // marginLeft:I18nManager.isRTL ?10 : null,
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
    right: Platform.OS === "ios" ? 47 : 7,
    bottom: 40,
    paddingVertical: 5,
    paddingHorizontal: 12,
    maxWidth: 150,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    borderWidth: 0.4,
    borderColor: "rgba(255,255,255,0.4)",
    backdropFilter: "blur(6px)", // iOS only, optional
    zIndex: 2
  },

  infoText: {
    fontSize: scaleFont(10),
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
    zIndex: 1,
  },

  video: {
    width: scaleW(300),        // 👈 scales with screen width
    height: scaleH(300),
  },

});

export default React.memo(PromoCard);
