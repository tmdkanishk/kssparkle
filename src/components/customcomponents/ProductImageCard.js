import React, { useRef, useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Animated,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import PriceView from "./PriceView";
import { Image } from "expo-image";

const { width } = Dimensions.get("window");

// Image area height — same fixed approach as working reference
const IMAGE_HEIGHT = 380;

// =====================
// Shimmer Placeholder
// =====================
const ShimmerPlaceholder = () => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();

    return () => shimmerAnim.stopAnimation();
  }, []);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-width, width],
  });

  return (
    <View style={styles.shimmerWrapper}>
      <View style={styles.shimmerBase} />
      <Animated.View
        style={[styles.shimmerHighlight, { transform: [{ translateX }] }]}
      />
    </View>
  );
};

// =====================
// Lazy Image Item
// =====================
const LazyImageItem = React.memo(({ uri, isVisible }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Latch: once visible, always load
  if (isVisible && !shouldLoad) {
    setShouldLoad(true);
  }

  return (
    // Full-width fixed-height box — exactly like the reference.
    // contentFit="contain" handles every image shape automatically:
    // portrait, landscape, tiny, huge — all centred, none overflow.
    <View style={styles.imageBox}>
      {!isLoaded && <ShimmerPlaceholder />}

      {shouldLoad && (
        <Image
          source={uri ? { uri: decodeURI(uri) } : null}
          style={[styles.image, !isLoaded && styles.hiddenImage]}
          contentFit="contain"
          fadeDuration={200}
          onLoad={() => setIsLoaded(true)}
        />
      )}
    </View>
  );
});

// =====================
// Main Component
// =====================
const ProductImageCard = ({ headingTitle, images = [], price }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const safeImages =
    images?.filter((item) => item?.popup) || [{ popup: null }];

  // Mirror the reference: derive active index from scroll offset
  const handleScroll = useCallback(
    (event) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / width);
      setActiveIndex(index);
      scrollX.setValue(offsetX);
    },
    [scrollX]
  );

  const isSlideVisible = useCallback(
    (index) =>
      index === activeIndex ||
      index === activeIndex - 1 ||
      index === activeIndex + 1,
    [activeIndex]
  );

  const renderItem = useCallback(
    ({ item, index }) => (
      // Each slide = full screen width, identical to reference renderItem
      <View style={styles.slide}>
        <LazyImageItem uri={item?.popup} isVisible={isSlideVisible(index)} />
      </View>
    ),
    [isSlideVisible]
  );

  return (
    <LinearGradient
      colors={["#505050", "#808080"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.card}
    >
      <Text style={styles.mainTitle}>{headingTitle}</Text>

      <View style={styles.priceRow}>
        <PriceView
          priceHtml={price}
          textStyle={styles.price}
          width={30}
          height={30}
        />
      </View>

      {/*
        FlatList is edge-to-edge — no horizontal padding here.
        pagingEnabled snaps by full `width`, same as reference.
      */}
      <FlatList
        data={safeImages}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={renderItem}
        removeClippedSubviews
        windowSize={3}
        initialNumToRender={1}
        maxToRenderPerBatch={2}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
      />

      {safeImages.length > 1 && (
        <View style={styles.dotsContainer}>
          {safeImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, activeIndex === index && styles.activeDot]}
            />
          ))}
        </View>
      )}
    </LinearGradient>
  );
};

// =====================
// Styles
// =====================
const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 520,
    borderRadius: 35,
    overflow: "hidden",
    marginTop: 10,
    paddingTop: 15,
  },

  mainTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 25,
    width: "90%",
    alignSelf: "center",
    paddingHorizontal: 15,
  },

  priceRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    paddingHorizontal: 15,
  },

  price: {
    fontSize: 31,
    fontWeight: "700",
    color: "white",
    marginLeft: "auto",
  },

  // Each FlatList page = full screen width (reference pattern)
  slide: {
    width: width,
    alignItems: "center",
    justifyContent: "center",
  },

  // Fixed width + height + contentFit="contain" = the reference approach.
  // Works for any image shape: tall, wide, tiny, square.
  imageBox: {
    width: width,
    height: IMAGE_HEIGHT,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  hiddenImage: {
    opacity: 0,
    position: "absolute",
  },

  // ---- Shimmer ----
  shimmerWrapper: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  shimmerBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  shimmerHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.18)",
    width: "50%",
  },

  // ---- Dots ----
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 25,
    marginTop: 6,
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
});

export default React.memo(ProductImageCard);