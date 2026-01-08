import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native'
import React, { memo } from 'react'
import GlassContainer from './GlassContainer'
import LinearGradient from 'react-native-linear-gradient'
import { Dimensions } from 'react-native'

const ShoppingBagProductCard = ({ item }) => {
    const screenWidth = Dimensions.get('window').width;

    return (
        <GlassContainer
            padding={0.1}
            style={{
                flexDirection: "row",
                alignItems: "center",
                height: 220,
                width: screenWidth * 0.9,
            }}
        >
            {/* LEFT IMAGE */}
            <LinearGradient
                colors={["#505050", "#808080"]}
                style={{
                    width: screenWidth * 0.35,
                    height: 220,
                    borderRadius: 16,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Image
                    source={
                        item.thumb
                            ? { uri: item.thumb }
                            : require("../../assets/images/headphones.png")
                    }
                    style={styles.image}
                />
            </LinearGradient>

            {/* RIGHT CONTENT */}
            <View style={{ marginLeft: 10, marginTop: 20, flex: 1 }}>
                <Text style={styles.title} numberOfLines={2}>
                    {item.name}
                </Text>

                <Text style={styles.subText}>{item.model}</Text>

                {/* <View style={styles.row}>
                    <TouchableOpacity style={styles.optionBox}>
                        <Text style={styles.optionText}>Size: 4</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.optionBox}>
                        <Text style={styles.optionText}>Qty: 1</Text>
                    </TouchableOpacity>
                    <Text style={styles.stockText}>9 left</Text>
                </View> */}

                <View style={styles.row}>

                    <TouchableOpacity style={styles.optionBox}>
                        <Text style={styles.optionText}>Size: 4</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.optionBox}>
                        <Text style={styles.optionText}>
                            Qty: {item.quantity}
                        </Text>
                    </TouchableOpacity>

                    <Text style={styles.stockText}>9 left</Text>

                    {!item.stock && (
                        <Text style={{ color: "#ff4d4d" }}>Out of stock</Text>
                    )}
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.total}</Text>
                    <Text style={styles.oldPrice}>{item.price}</Text>
                </View>

                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <View style={styles.returnIcon}>
                        <Image
                            source={require("../../assets/images/keyboard_return.png")}
                            style={{ width: 14, height: 14 }}
                        />
                    </View>
                    <Text style={styles.returnText}>7 days return available</Text>
                </View>
            </View>
        </GlassContainer>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        // width: screenWidth,
        // height: 220,
        // borderRadius: 16,
        // justifyContent: "center",
        // alignItems: "center",
        // overflow: "hidden",
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: "contain",
    },
    title: {
        color: "#fff",
        fontWeight: "400",
        fontSize: 13,
        width: "90%"
    },
    subText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 2,
        width: "70%"
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        gap: 8,
    },
    optionBox: {
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 10,
        paddingVertical: 4,
        paddingHorizontal: 12,
    },
    optionText: {
        color: "#fff",
        fontSize: 14,
    },
    stockText: {
        color: "#fff",
        fontSize: 14,
        opacity: 0.8,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 10,
        gap: 8,
    },
    price: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    oldPrice: {
        color: "#fff",
        textDecorationLine: "line-through",
        fontSize: 13,
    },
    discount: {
        color: "#ff4d4d",
        fontWeight: "700",
        fontSize: 13,
    },
    returnText: {
        color: "#fff",
        opacity: 0.8,
        fontSize: 12,
        marginTop: 3,
        marginLeft: 10
    },
});

export default memo(ShoppingBagProductCard);