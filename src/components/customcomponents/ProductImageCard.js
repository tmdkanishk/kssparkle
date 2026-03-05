import React, { useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
  Image,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import PriceView from "./PriceView";
// import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';


const { width } = Dimensions.get("window");

const DEFAULT_IMAGE = require("../../assets/images/headphones.png");

const ProductImageCard = ({ headingTitle, images = [], price }) => {
  console.log("ProductImageCard price", price)
  const [activeIndex, setActiveIndex] = useState(0);
  // const [imageLoading, setImageLoading] = useState(true);


  const safeImages =
    images && images.length > 0 ? images : [{ popup: null }];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const ImageItem = React.memo(({ uri }) => {
    return (
      <Image
        source={uri ? { uri } : DEFAULT_IMAGE}
        style={styles.image}
        resizeMode="contain"
        fadeDuration={200}   // 👈 Native smooth fade (Android) 
      />
    );
  });




  return (
    <LinearGradient
      colors={["#505050", "#808080"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.mainTitle}>{headingTitle}</Text>
      <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
        {/* <Text style={{color:'white', fontSize:25}}>Price:  </Text> */}
        <PriceView
          priceHtml={price}
          textStyle={styles.price}
          width={30}
          height={30}
        />
      </View>


      <FlatList
        data={safeImages}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={styles.imageWrapper}>
            <View style={styles.imageContainer}>
              <ImageItem uri={item?.popup} />
            </View>
          </View>
        )}

        removeClippedSubviews={false}
        windowSize={5}
        initialNumToRender={images.length}
        maxToRenderPerBatch={images.length}

      />

      {safeImages.length > 1 && (
        <View style={styles.dotsContainer}>
          {safeImages.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                activeIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
      )}


    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 520,
    borderRadius: 35,
    padding: 15,
    overflow: "hidden",
    marginTop: 10,
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 25,
    width: "90%",
    alignSelf: "center",
    marginRight: 15
  },

imageWrapper: {
  width: width - 36,
  height: 400,
  justifyContent: "center",
  alignItems: "center",
},

  // image: {
  //   width: '100%',
  //   height: 260,
  // },


  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },

  activeDot: {
    backgroundColor: "#FFFFFF",
    width: 10,
    height: 10,
  },
  price: {
    fontSize: 31,
    fontWeight: "700",
    color: "white",
    marginLeft: 'auto', // Push to right
  },
  imageContainer: {
    width: '100%',
    height: 360,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red'
  },

  shimmer: {
    position: 'absolute',
    width: '80%',
    height: 260,
    borderRadius: 16,
  },

  image: {
    width: '100%',
    height: "100%",
  },


});

export default React.memo(ProductImageCard);
