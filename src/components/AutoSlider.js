import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet, Image, TouchableOpacity, Linking, useWindowDimensions } from 'react-native';
import { openInChrome } from '../utils/helpers';

const AutoSlider = ({ data }) => {
    const navigation = useNavigation();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    // const width = Dimensions.get('window').width;
    const scrollViewRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            let nextIndex = (currentIndex + 1) % data?.length;
            setCurrentIndex(nextIndex);
            scrollViewRef.current?.scrollTo({
                x: nextIndex * width,
                animated: true,
            });
        }, 3000); // Auto-scroll interval (in ms)

        return () => clearInterval(interval); // Cleanup on unmount
    }, [currentIndex]);

    // const openInChrome = (url) => {
    //     Linking.openURL(url).catch((err) =>
    //       console.error("Failed to open URL:", err)
    //     );
    //   };

    return (
        <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            ref={scrollViewRef}
            onMomentumScrollEnd={(event) => {
                const offsetX = event.nativeEvent.contentOffset.x;
                const index = Math.floor(offsetX / width);
                setCurrentIndex(index);
            }}
        >
            {
                data?.length > 0 ? (
                    data?.map((item, index) => (
                        <TouchableOpacity disabled={item?.product_id != 0 || item?.category_id != 0 || item?.linktype != '' ? false : true} onPress={() => {
                            if (item?.linktype?.includes('product') && item?.product_id != 0) {
                                navigation.navigate('Product', { productId: item?.product_id })
                            } else if (item?.linktype?.includes('category') && item?.category_id != 0) {
                                navigation.navigate('CategoryView', { subCategoryId: item?.category_id });
                            } else if (item?.linktype?.includes('latestproduct')) {
                                navigation.navigate('LatestCategoryView');
                            } else if (item?.linktype?.includes('specialproduct')) {
                                navigation.navigate('SpecialProducts');
                            }
                            else {
                                openInChrome(item?.link);
                                return;
                            }
                        }}
                            key={index}
                            style={[styles.slide, { width, height: isLandscape ? 450 : 200, }]}>
                            <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                        </TouchableOpacity>
                    ))
                ) : null
            }


        </ScrollView>
    )
}

const styles = StyleSheet.create({
    slide: {
       justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default AutoSlider