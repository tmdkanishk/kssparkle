import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, StyleSheet, Image, Animated, TouchableOpacity, Pressable } from 'react-native';
import commonStyles from '../constants/CommonStyles';
import AntDesign from '@expo/vector-icons/AntDesign';
import Octicons from '@expo/vector-icons/Octicons';
import Entypo from '@expo/vector-icons/Entypo';
import { useCustomContext } from '../hooks/CustomeContext';
import { IconComponentHeartFill, IconComponentImage } from '../constants/IconComponents';
import { useWishlist } from '../hooks/WishlistContext';
import { _retrieveData } from '../utils/storage';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const ProductCarusal = ({ data, lowestTag, totalReview, totalRating, handleShareBtn, handleCompareBtn, itemdetail, isLoading, productid }) => {
    const navigation = useNavigation();
    const { Colors } = useCustomContext();
    const flatListRef = useRef(null);  // To control FlatList scroll
    const scrollX = new Animated.Value(0);  // For pagination indicator
    const [currentIndex, setCurrentIndex] = useState(0);
    const { wishlist, handleWishlistToggle, wishlistloading } = useWishlist();
    const isWishlisted = wishlist.includes(productid);

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);  // Determine which slide is in focus
        setCurrentIndex(index);
        scrollX.setValue(contentOffsetX);  // Update animation value for pagination
    };


    const onToggleWishlist = async (productid) => {
        try {
            const data = await _retrieveData("USER");
            if (!data) {
                return navigation.navigate('Login');
            } else {
                handleWishlistToggle(productid);
            }
        } catch (error) {
            console.log("error:", error);
        }
    }

    const renderItem = ({ item }) => (
        <View style={{ width: width }}>
            <View style={[styles.carousalContainer]}>
                <View style={{ width: '100%', height: 450, zIndex: -1, backgroundColor: Colors?.imgContainerBgColor, }}>
                    {
                        item?.popup ? (<Image source={{ uri: item?.popup }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />) : (<IconComponentImage size={30} />)
                    }
                </View>
            </View>
        </View>
    );

    const pagination = () => {
        return (
            <View style={styles.pagination}>

                {
                    data?.length > 1 ? (
                        data.map((v, i) => {
                            const dotColor = i === currentIndex ? Colors.primary : '#ccc'; //
                            return <Animated.View key={i} style={[styles.dot, { backgroundColor: dotColor }]} />;
                        })
                    ) : null

                }
            </View>
        );
    };

    return (
        <View style={[styles.container, { width: width, opacity: isLoading || wishlistloading ? 0.5 : 1 }]}>
            <View style={{ position: 'absolute', zIndex: 1, width: '100%', top: 20, paddingHorizontal: 12, flexDirection: 'row', justifyContent: 'space-between' }}>

                <View style={{ gap: 5 }}>

                    {lowestTag && <View style={[styles.tagContainer, { backgroundColor: Colors.primary }]}>
                        <Text style={[commonStyles.textwhite, { fontSize: 14 }]}>{lowestTag}</Text>
                    </View>}

                    {itemdetail?.discount_labels?.latest && <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: '#4A90E2', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: Colors?.white, fontSize: 14, fontWeight: '600' }}>{itemdetail?.discount_labels?.latest}</Text>
                    </View>}

                    {itemdetail?.discount_labels?.sale && <View style={{ height: 60, width: 60, borderRadius: 30, backgroundColor: '#EA2349', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: Colors?.white, fontSize: 14, fontWeight: '600' }}>{itemdetail?.discount_labels?.sale}</Text>
                    </View>}

                </View>



                <View style={{ gap: 8 }}>

                    <Pressable
                        disabled={wishlistloading == itemdetail?.product_id ? true : false}
                        onPress={() => onToggleWishlist(productid)}
                        style={[styles.iconContainer, { borderColor: Colors?.border_color, backgroundColor: Colors?.surface_color }]}>
                        {isWishlisted ? < IconComponentHeartFill size={24} color={Colors.primary} /> : <AntDesign name="hearto" size={24} color={Colors.primary} />}
                    </Pressable>

                    <TouchableOpacity onPress={() => handleCompareBtn()} style={[styles.iconContainer, { borderColor: Colors?.border_color, backgroundColor: Colors?.surface_color }]}>
                        <Octicons name="git-compare" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleShareBtn()} style={[styles.iconContainer, { borderColor: Colors?.border_color, backgroundColor: Colors?.surface_color }]}>
                        <AntDesign name="sharealt" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </View>
            </View>
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
            {totalRating !== 0 && <View style={{ marginVertical: 24, alignSelf: 'flex-start', marginLeft: 12 }}>
                <Text style={commonStyles.textDescription}>{totalRating}<Entypo name="star" size={16} color={Colors.iconColor1} /> /5 ({totalReview})</Text>
            </View>}
            {data?.length > 0 ? pagination() : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    slide: {
        borderRadius: 4,
    },
    image: {
        width: '100%',
        height: 200,
        resizeMode: 'cover',
    },
    title: {
        fontSize: 18,
        marginTop: 10,
    },
    pagination: {
        flexDirection: 'row',
        alignSelf: 'center',
        bottom: 5,


    },
    dot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 8,

    },

    iconContainer: {
        width: 34,
        height: 34,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 4
    },
    carousalContainer: {
        height: 'auto',
        width: '100%',
        // padding: 12,
        marginVertical: 12,
        position: 'relative'
    },

    tagContainer: {
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 16,
        borderBottomEndRadius: 30,
        borderTopEndRadius: 6,
        borderBottomStartRadius: 4,
        borderTopStartRadius: 4
    },






});


export default ProductCarusal