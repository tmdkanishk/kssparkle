import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { BlurView } from "@react-native-community/blur";
import GlassContainer from "../components/customcomponents/GlassContainer";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import { useNavigation } from "@react-navigation/native";
import { Dimensions } from 'react-native';



const OrderDetailsScreen = () => {
    const navigation = useNavigation();
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    return (
        // <LinearGradient
        //   colors={["#101010", "#1C1C1C"]}
        //   style={styles.background}
        // >
        <BackgroundWrapper>
            <ScrollView contentContainerStyle={[styles.container, {marginTop: Platform.OS === "ios" ? 40 : 10}]}>
                <View style={{ marginTop: 10, marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image source={require("../assets/images/back.png")} style={{ width: 22, height: 22, tintColor: "#fff", }} />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.deliveredText}>Delivered on</Text>
                        <Text style={styles.dateText}>Thursday, 2nd Oct, 12:00 PM</Text>
                    </View>
                    <View style={{ width: 24 }} />
                </View>


                {/* Delivered Address */}
                <GlassContainer style={{ marginTop: 20 }}>
                    <Text style={styles.sectionTitle}>Delivered address</Text>
                    <Text style={styles.addressText}>
                        53, Amber Society, Balewadi, Near IT Park, Pune{"\n"}
                        53, Amber Society, Balewadi, Near IT Park, Pune{"\n"}
                        53, Amber Society, Balewadi, Near IT Park, Pune
                    </Text>
                    <Text style={styles.verifiedText}>
                        <Text style={{ color: "#31d36c", fontWeight: "bold" }}>Verified </Text>
                        +966–53–9235210
                    </Text>
                </GlassContainer>

                <GlassContainer>


                    {/* Share Experience */}
                    <View style={{ marginTop: 25 }}>
                        <Text style={styles.sectionTitle}>Share your experience</Text>
                        <GlassContainer style={{ height: 40, }}></GlassContainer>
                        {/* <GlassContainer style={styles.experienceBox}> */}
                        <View style={styles.row}>
                            <GlassContainer padding={10} style={{ width: Platform.OS === "android" ? screenWidth * 0.33 : screenWidth * 0.35, alignItems: "center", justifyContent: "center", }}>
                                <TouchableOpacity style={{ alignItems: "center" }}>
                                    <GlassContainer padding={10} borderRadius={60} style={styles.iconContainer}>
                                        <Image source={require("../assets/images/thumb.png")} style={styles.icon} />
                                    </GlassContainer>
                                    <Text style={styles.cardTitle}>Review Product</Text>
                                    <Text style={styles.cardSubText}>Help others to know what to buy</Text>
                                </TouchableOpacity>
                            </GlassContainer>


                            <GlassContainer padding={10} style={{ width: Platform.OS === "android" ? screenWidth * 0.33 : screenWidth * 0.35, alignItems: "center", justifyContent: "center", }}>
                                <TouchableOpacity style={{ alignItems: "center" }}>
                                    <GlassContainer padding={6} borderRadius={60} style={styles.iconContainer}>
                                        <Image source={require("../assets/images/truck.png")} style={{ width: 40, height: 40, borderColor: 'black', resizeMode: 'contain' }} />
                                    </GlassContainer>
                                    <Text style={styles.cardTitle}>Review Delivery</Text>
                                    <Text style={styles.cardSubText}>Review how the delivery went</Text>
                                </TouchableOpacity>
                            </GlassContainer>
                        </View>
                        {/* </GlassContainer> */}
                    </View>

                </GlassContainer>

                {/* View Order Summary */}
                <GlassContainer style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
                    <View style={{ width: '92%' }}>
                        <Text style={styles.sectionTitle}>View order/invoice summary</Text>
                        <Text style={styles.subText}>Find invoice, shipping details here</Text>
                    </View>
                    <Image source={require("../assets/images/arrowright.png")} style={styles.arrowIcon} />
                </GlassContainer>

                {/* Item Summary */}
                <TouchableOpacity style={{ marginTop: 15 }} onPress={() => { navigation.navigate('TrackingDetails') }}>
                    <GlassContainer style={{}} padding={12}>
                        <Text style={styles.sectionTitle}>Items summary</Text>
                        <View style={styles.itemRow}>
                            {/* <Image source={require("../assets/images/headphones.png")} style={styles.productImage} /> */}
                            <LinearGradient
                                colors={["#505050", "#808080"]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.productImage}
                            >
                                <Image source={require("../assets/images/headphones.png")} style={styles.productImage} />
                            </LinearGradient>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={styles.itemTitle}>Beats</Text>
                                <Text style={styles.itemDesc}>
                                    Beats Studio3 Wireless Headphones{"\n"}MX3X2LL/A, MQ562PA/A, MX3X2ZM/A
                                </Text>
                                <Text style={styles.priceText}>₹16669.25</Text>
                            </View>
                        </View>
                    </GlassContainer>
                </TouchableOpacity>

                {/* Help Button */}
                <TouchableOpacity style={styles.helpBtn}>
                    <Image source={require("../assets/images/help.png")} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            </ScrollView>
        </BackgroundWrapper>
        // </LinearGradient>
    );
};

export default OrderDetailsScreen;

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        padding: 16,
        paddingBottom: 80,
    },
    glassWrapper: {
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 0.5,
        borderColor: "rgba(255, 255, 255, 0.15)",
        position: "relative",
    },
    blurLayer: {
        ...StyleSheet.absoluteFillObject,
    },
    deliveredText: {
        color: "#fff",
        fontSize: 15,
        textAlign: "center",
        opacity: 0.8,
    },
    dateText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    sectionTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 16,
        marginBottom: 6,
    },
    addressText: {
        color: "#fff",
        fontSize: 13,
        lineHeight: 20,
    },
    verifiedText: {
        color: "#fff",
        fontSize: 13,
        marginTop: 5,
    },
    experienceBox: {
        marginTop: 40,
        padding: 15,
    },
    row: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 35,
        width: "100%",
        gap: 32
        // justifyContent: "center",
    },
    experienceCard: {
        width: "48%",
        alignItems: "center",
        padding: 10,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // marginBottom: 8,
    },
    icon: {
        width: 32,
        height: 32,
        tintColor: "#fff",
    },
    cardTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
    },
    cardSubText: {
        color: "#fff",
        fontSize: 12,
        textAlign: "center",
        marginTop: 4,
    },
    subText: {
        color: "#fff",
        fontSize: 13,
    },
    arrowIcon: {
        width: 18,
        height: 18,
        tintColor: "#fff",
    },
    itemRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 12,
    },
    productImage: {
        width: 100,
        height: 120,
        borderRadius: 16,
    },
    itemTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
    },
    itemDesc: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 18,
        marginTop: 2,
        width: "95%"
    },
    priceText: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "bold",
        marginTop: 4,
    },
    helpBtn: {
        position: "absolute",
        bottom: 35,
        right: 25,
        backgroundColor: "rgba(255,255,255,0.1)",
        padding: 10,
        borderRadius: 25,
    },
});
