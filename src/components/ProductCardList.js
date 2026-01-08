import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity, useWindowDimensions } from 'react-native'
import React, { useRef, useState } from 'react'
import ProductCard from './ProductCard'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useCustomContext } from '../hooks/CustomeContext';


const ProductCardList = ({ ContainerWidth, data }) => {
    const { Colors } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const scrollRef = useRef(null);
    const [scrollX, setScrollX] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);


    const handleScroll = (event) => {
        setScrollX(event.nativeEvent.contentOffset.x)
    }

    const scrollRight = () => {
        scrollRef.current?.scrollTo({ x: scrollX + width * 0.5, animated: true })
    }

    const scrollLeft = () => {
        scrollRef.current?.scrollTo({ x: scrollX - width * 0.5, animated: true })
    }

    return (
        <View>
            {scrollX > 0 && (
                <TouchableOpacity style={styles.leftArrow} onPress={scrollLeft}>
                    <Ionicons name="chevron-back" size={28} color={Colors?.primary} />
                </TouchableOpacity>
            )}
            <ScrollView
                ref={scrollRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onContentSizeChange={(w) => setContentWidth(w)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {
                    data?.map((itemdata, index) => (
                        <View style={[styles.box, { width: isLandscape ? width * 0.22 : width * 0.45, }]} key={index}>
                            <ProductCard
                                ContainerWidth={ContainerWidth}
                                itemdetail={itemdata}
                            />

                        </View>
                    ))}
            </ScrollView>
            {scrollX + width < contentWidth && (
                <TouchableOpacity style={styles.rightArrow} onPress={scrollRight}>
                    <Ionicons name="chevron-forward" size={28} color={Colors?.primary} />
                </TouchableOpacity>
            )}
        </View>
    )
}

const styles = StyleSheet.create({

    scrollContainer: {
        alignItems: 'center', // Center items vertically
    },
    box: {
        // 48% of screen width
        height: 'auto',  // Full height
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10, // Spacing between items
        borderRadius: 10,
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    leftArrow: {
        position: 'absolute',
        left: 0,
        top: '40%',
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        elevation: 5
    },
    rightArrow: {
        position: 'absolute',
        right: 0,
        top: '40%',
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        elevation: 5
    }
});

export default ProductCardList