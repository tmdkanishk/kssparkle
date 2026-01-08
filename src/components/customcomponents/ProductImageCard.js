import React, { useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  Dimensions,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import PriceView from "./PriceView";
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';


const { width } = Dimensions.get("window");

const DEFAULT_IMAGE = require("../../assets/images/headphones.png");

const ProductImageCard = ({ headingTitle, images = [], price }) => {
  console.log("ProductImageCard price", price)
  const [activeIndex, setActiveIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);


  const safeImages =
    images && images.length > 0 ? images : [{ popup: null }];

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems?.length > 0) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

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
              {/* Skeleton */}
              {imageLoading && (
                <ShimmerPlaceHolder
                  LinearGradient={LinearGradient}
                  shimmerColors={['#3A3A3A', '#4A4A4A', '#3A3A3A']}
                  style={styles.shimmer}
                />
              )}

              {/* Actual Image */}
              <Image
                source={item?.popup ? { uri: item.popup } : DEFAULT_IMAGE}
                style={styles.image}
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
              />
            </View>

          </View>

        )}
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
    height: 350,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    aspectRatio: 1,
    // backgroundColor:'green',
  },

  image: {
    width: '100%',
    height: 260,
  },


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
    height: 260,
    justifyContent: 'center',
    alignItems: 'center',
  },

  shimmer: {
    position: 'absolute',
    width: '80%',
    height: 260,
    borderRadius: 16,
  },

  image: {
    width: '100%',
    height: 260,
  },

});

export default React.memo(ProductImageCard);
