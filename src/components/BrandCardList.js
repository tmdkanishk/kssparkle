import { View, Text, FlatList, useWindowDimensions, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useRef, useState } from 'react'
import BrandCard from './BrandCard'
import { useCustomContext } from '../hooks/CustomeContext';
import Ionicons from '@expo/vector-icons/Ionicons';

const BrandCardList = ({ data }) => {
    const { Colors } = useCustomContext();
    const flatListRef = useRef(null);
    const { width } = useWindowDimensions();
    const [scrollX, setScrollX] = useState(0);
    const [contentWidth, setContentWidth] = useState(0);


    const handleScroll = (event) => {
        setScrollX(event.nativeEvent.contentOffset.x);
    };

    const scrollRight = () => {
        flatListRef.current?.scrollToOffset({
            offset: scrollX + width * 0.5,
            animated: true,
        });
    };

    const scrollLeft = () => {
        flatListRef.current?.scrollToOffset({
            offset: Math.max(0, scrollX - width * 0.5),
            animated: true,
        });
    };


    const renderItem = ({ item }) => (
        <BrandCard width={120} item={item} />
    )

    return (
        <View style={{ width: '100%' }}>
            {/* Left Arrow */}
            {scrollX > 0 && (
                <TouchableOpacity style={styles.leftArrow} onPress={scrollLeft}>
                    <Ionicons name="chevron-back" size={28} color={Colors?.primary} />
                </TouchableOpacity>
            )}
            <FlatList
                ref={flatListRef}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                onContentSizeChange={(w) => setContentWidth(w)}
                data={data}
                keyExtractor={item => item?.manufacturer_id}
                renderItem={renderItem}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
            />
            {/* Right Arrow */}
            {scrollX + width < contentWidth && (
                <TouchableOpacity style={styles.rightArrow} onPress={scrollRight}>
                    <Ionicons name="chevron-forward" size={28} color={Colors?.primary} />
                </TouchableOpacity>
            )}
        </View>

    )
}


const styles = StyleSheet.create({
    leftArrow: {
        position: 'absolute',
        left: 0,
        top: '25%',
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
    rightArrow: {
        position: 'absolute',
        right: 0,
        top: '25%',
        zIndex: 1,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 5,
        elevation: 5,
    },
});

export default BrandCardList