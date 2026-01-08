import React, { memo, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import GlassButton from "./GlassButton";
// import Icon from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import { launchImageLibrary } from "react-native-image-picker";

const ReviewSections = () => {
  const [showVideos, setShowVideos] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const [videoList, setVideoList] = useState([
    require("../../assets/images/headphones.png"),
    require("../../assets/images/headphonesblack.png"),
  ]);
  const [imageList, setImageList] = useState([
    require("../../assets/images/headphones.png"),
    require("../../assets/images/headphonesblack.png"),
  ]);

  // 📸 Pick image from gallery
  const handleAddImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const newImage = { uri: response.assets[0].uri };
        setImageList((prev) => [...prev, newImage]);
      }
    });
  };

  // 🎥 Pick video from gallery
  const handleAddVideo = () => {
    launchImageLibrary({ mediaType: "video" }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const newVideo = { uri: response.assets[0].uri };
        setVideoList((prev) => [...prev, newVideo]);
      }
    });
  };

  return (
    <View style={{ marginTop: 20 }}>
      {/* 🔹 Reviews with Videos */}
      <View style={{ marginTop: 0 }}>
        <GlassButton
          title="Reviews with videos"
          onPress={() => setShowVideos(!showVideos)}
        />
        {showVideos && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Reviews with videos</Text>
            <View style={styles.grid}>
              {videoList.map((item, index) => (
                <LinearGradient
                  key={index}
                  colors={["#505050", "#808080"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.card}
                >
                  <Image source={item} style={styles.image} />
                  {/* <Icon
                    name="play-circle-outline"
                    size={32}
                    color="#fff"
                    style={styles.playIcon}
                  /> */}
                </LinearGradient>
              ))}

              {/* Add Video */}
              <TouchableOpacity
                style={[styles.card, styles.addCard]}
                onPress={handleAddVideo}
              >
                {/* <Icon name="add" size={28} color="#fff" /> */}
                <Text style={styles.addText}>Add Video</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* 🔹 Reviews with Images */}
      <View style={{ marginTop: 15 }}>
        <GlassButton
          title="Reviews with images"
          onPress={() => setShowImages(!showImages)}
        />
        {showImages && (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.sectionTitle}>Reviews with images</Text>
            <View style={styles.grid}>
              {imageList.map((item, index) => (
                <View key={index} style={styles.imageCard}>
                  <Image source={item} style={styles.image} />
                  {/* <View style={styles.overlay}>
                    <Text style={styles.reviewText}>
                      These headphones have completely transformed my listening
                      experience. The sound quality is phenomenal — rich, deep
                      bass that doesn't distort.
                    </Text>
                  </View> */}
                </View>
              ))}

              {/* Add Image */}
              <TouchableOpacity
                style={[styles.card, styles.addCard]}
                onPress={handleAddImage}
              >
                {/* <Icon name="add" size={28} color="#fff" /> */}
                <Text style={styles.addText}>Add Image</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 12,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 10,
  },
  card: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  imageCard: {
    width: "30%",
    aspectRatio: 1,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  playIcon: {
    position: "absolute",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
  },
  reviewText: {
    fontSize: 10,
    color: "#fff",
    lineHeight: 12,
  },
  addCard: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
  },
  addText: {
    color: "#fff",
    fontSize: 13,
    marginTop: 4,
    textDecorationLine: "underline",
  },
});

export default memo(ReviewSections);
