import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, Image, Animated, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useCustomContext } from '../hooks/CustomeContext';
import { useNavigation } from '@react-navigation/native'
import { openInChrome } from '../utils/helpers';



const Carousel = ({ data }) => {
  const { Colors } = useCustomContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const flatListRef = useRef(null);  // To control FlatList scroll
  const scrollX = new Animated.Value(0);  // For pagination indicator
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigation = useNavigation();

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    console.log("contentOffsetX", contentOffsetX);
    const index = Math.round(contentOffsetX / width);  // Determine which slide is in focus
    setCurrentIndex(index);
    scrollX.setValue(contentOffsetX);  // Update animation value for pagination
  };

  const renderItem = ({ item }) => (

    <TouchableOpacity disabled={item?.product_id != 0 || item?.category_id != 0 || item?.linktype != '' ? false : true} onPress={async () => {
      if (item?.linktype?.includes('product') && item?.product_id != 0) {
        navigation.navigate('Product', { productId: item?.product_id })
      } else if (item?.linktype?.includes('category') && item?.category_id != 0) {
        navigation.navigate('CategoryView', { subCategoryId: item?.category_id });
      } else if (item?.linktype?.includes('manufacturer') && item?.manufacturer_id != 0) {
        navigation.navigate('Products', { id: item?.manufacturer_id, titleName: item?.title });
      } else if (item?.linktype?.includes('latestproduct')) {
        navigation.navigate('LatestCategoryView');
      } else if (item?.linktype?.includes('specialproduct')) {
        navigation.navigate('SpecialProducts');
      }
      else {
        openInChrome(item?.link);
        return;
      }
    }
    } style={[styles.slide, { width: width, height: isLandscape ? 450 : 200,}]} >
      <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
    </TouchableOpacity >
  );

  const pagination = () => {
    return (
      <View style={styles.pagination}>
        {data.map((v, i) => {
          const dotColor = i === currentIndex ? Colors.primary : '#FFF'; //
          return <Animated.View key={i} style={[styles.dot, { backgroundColor: dotColor, borderColor: Colors.primary }]} />;
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { width: width, marginTop: 12 }]}>
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(item, index) => index}
        renderItem={renderItem}
        horizontal
        pagingEnabled  // Enables snapping to each page
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}  // Ensures smooth animation

      />
      {pagination()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: '100%',
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  slide: {
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },

  title: {
    fontSize: 18,
    marginTop: 10,
  },
  pagination: {
    flexDirection: 'row',
    position: 'absolute',
    alignSelf: 'center',
    bottom: 10,
  },
  dot: {
    height: 16,
    width: 16,
    borderRadius: 8,
    marginHorizontal: 8,
    borderWidth: 1
  },
});

export default Carousel;
