import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet, Platform } from "react-native";
// import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import GlassContainer from "../components/customcomponents/GlassContainer";
import GlassButton from "../components/customcomponents/GlassButton";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import LinearGradient from "react-native-linear-gradient";
import ShoppingBagProductCard from "../components/customcomponents/ShoppingBagProductCard";
import GlassmorphismButton from "../components/customcomponents/GlassmorphismButton";
import GlassSwipeButton from "../components/customcomponents/GlassSwipeButton";
import MokaffaPoints from "../components/customcomponents/mokaffaPoints";

const paymentOptions = [
    { id: 1, name: "UPI (Pay via any App)", icon: require("../assets/images/upi.png") },
    { id: 2, name: "Credit/Debit Card", icon: require("../assets/images/creditcard.png") },
    { id: 3, name: "Pay Later", icon: require("../assets/images/paylater.png") },
    { id: 4, name: "Wallets", icon: require("../assets/images/wallet.png") },
    { id: 5, name: "EMI", icon: require("../assets/images/emi.png") },
    { id: 6, name: "Net Banking", icon: require("../assets/images/netbanking.png") },
];

const ChoosePaymentMethod = () => {
    const navigation = useNavigation();
    const [selected, setSelected] = useState(1);
     const [scrollEnabled, setScrollEnabled] = useState(true);
    

    return (
        <BackgroundWrapper>


            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40, marginTop: Platform.OS === "ios" ? 60 : 10 }}
                showsVerticalScrollIndicator={false}
                scrollEnabled={scrollEnabled}
            >

                <TouchableOpacity style={{ marginTop: 20, marginLeft: 12 }} onPress={() => navigation.goBack()}>
                    <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                </TouchableOpacity>

                <View style={[styles.header]}>
                    <Text style={styles.title}>Choose Payment Method</Text>
                    <View style={{ width: 24 }} />
                </View>

                <Text style={styles.sectionTitle}>Online Payment Methods</Text>
                {paymentOptions.map((item) => (
                    <GlassContainer key={item.id} style={styles.paymentOption}>
                        <TouchableOpacity
                            style={styles.paymentRow}
                            onPress={() => setSelected(item.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.iconRow}>
                                <Image source={item.icon} style={styles.paymentIcon} />
                                <Text style={styles.paymentText}>{item.name}</Text>
                            </View>
                            <View style={styles.radioCircle}>
                                {selected === item.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    </GlassContainer>
                ))}


                <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Offline Payment Methods</Text>
                <GlassContainer style={styles.paymentOption}>
                    <TouchableOpacity
                        style={styles.paymentRow}
                        onPress={() => setSelected(7)}
                        activeOpacity={0.8}
                    >
                        <View style={styles.iconRow}>
                            {/* <Ionicons name="cash-outline" size={20} color="#fff" /> */}
                            <Image source={require('../assets/images/cashupi.png')} style={styles.paymentIcon} />
                            <Text style={styles.paymentText}>Cash on Delivery (Cash/UPI)</Text>
                        </View>
                        <View style={styles.radioCircle}>
                            {selected === 7 && <View style={styles.radioInner} />}
                        </View>
                    </TouchableOpacity>
                </GlassContainer>


                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Delivery Estimate</Text>
                {/* <GlassContainer style={styles.deliveryCard}>
          <View style={styles.productRow}>
            <LinearGradient
                colors={["#505050", "#808080"]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={styles.imageContainer}
            >
                <FastImage source={require("../assets/images/headphones.png")}   style={styles.productImage}/>
            </LinearGradient>

            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.productName}>
                Beats Studio3 Wireless Headphones
              </Text>
              <Text style={styles.productDesc}>Size: 4   Qty: 1   9 left</Text>
              <View style={styles.priceRow}>
                <Text style={styles.finalPrice}>₹14,495</Text>
                <Text style={styles.oldPrice}>₹17,934</Text>
                <Text style={styles.discount}>20% OFF</Text>
              </View>
              <Text style={styles.returnText}>↩️ 7 days return available</Text>
              <Text style={styles.estimateText}>
                Estimate Delivery by <Text style={{ fontWeight: "600" }}>7 Oct 2025</Text>
              </Text>
            </View>
          </View>
        </GlassContainer> */}
                <View style={{ padding: 10 }}>
                    <ShoppingBagProductCard

                        item={{
                            name: "Beats Studio3 Wireless Headphones",
                            model: "MX3X2LL/A, MQ562PA/A, MX3X2ZM/A",
                            seller: "Beats",
                            image: require("../assets/images/headphones.png"),
                            price: "₹14,495",
                            oldPrice: "₹17,934",
                            discount: "20% OFF",
                        }}
                    />
                </View>



                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Price Details</Text>
                <GlassContainer style={styles.priceContainer}>
                    <Text style={styles.priceHeader}>PRICE DETAILS (1 Item)</Text>
                    <View style={styles.priceRowItem}>
                        <Text style={styles.priceLabel}>Total MRP</Text>
                        <Text style={styles.priceValue}>₹17,934</Text>
                    </View>
                    <View style={styles.priceRowItem}>
                        <Text style={styles.priceLabel}>Discount on MRP</Text>
                        <Text style={styles.priceValue}>- ₹2,899</Text>
                    </View>
                    <View style={styles.priceRowItem}>
                        <Text style={styles.priceLabel}>Platform + Event Fee</Text>
                        <Text style={styles.priceValue}>₹20</Text>
                    </View>
                    <View style={styles.priceRowItem}>
                        <Text style={styles.priceLabel}>Taxes 15%</Text>
                        <Text style={styles.priceValue}>₹2174.25</Text>
                    </View>
                    <View style={styles.priceRowItem}>
                        <Text style={styles.priceLabel}>Free Shipping</Text>
                        <Text style={styles.priceValue}>₹0.00</Text>
                    </View>

                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total Amount</Text>
                        <Text style={styles.totalValue}>₹16669.25</Text>
                    </View>
                </GlassContainer>

                <View style={styles.footer}>
                    <MokaffaPoints />

                    {/* <GlassmorphismButton title="SLIDE TO ORDER" onPress={() => navigation.navigate("MyOrderScreen")} /> */}

                     <GlassSwipeButton
                        title="SLIDE TO ORDER"
                        onSwipeStart={() => setScrollEnabled(false)}
                        onSwipeEnd={() => setScrollEnabled(true)}
                        onSwipeSuccess={() => navigation.navigate("MyOrderScreen")}
                    />

                    <GlassSwipeButton
                        title="Go To Order Detail Screen"
                        onSwipeStart={() => setScrollEnabled(false)}
                        onSwipeEnd={() => setScrollEnabled(true)}
                        onSwipeSuccess={() => navigation.navigate("OrderDetailsScreen")}
                    />

                    {/* <GlassSwipeButton title="Go To Order Detail Screen" onSwipeSuccess={() => navigation.navigate("OrderDetailsScreen")} /> */}

                    <View style={styles.footerBottomRow}>
                        <Text style={styles.totalText}>₹16669.25</Text>
                        <Text style={styles.itemText}>1 Item</Text>
                    </View>
                </View>
            </ScrollView>


            {/* <View style={styles.bottomSection}>
                <Text style={styles.rewardText}>Earn 157 Mokafaa Points</Text>
                <View style={{ flex: 1 }}>
                    <GlassButton title="SLIDE TO ORDER" icon="arrow-forward" onPress={() => { }} />
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomAmount}>₹16669.25</Text>
                    <Text style={styles.bottomItems}>1 Item</Text>
                </View>
            </View> */}
        </BackgroundWrapper>
    );
};

export default ChoosePaymentMethod;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "transparent",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingTop: 10,
        marginBottom: 10,
    },
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        // marginVertical: 8,
        marginLeft: 20,
        marginBottom: Platform.OS === "ios" ? 10 : 0
    },
    paymentOption: {
        marginVertical: 4,
        paddingVertical: 2,
        paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: 5
    },
    paymentRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    iconRow: {
        flexDirection: "row",
        // justifyContent:'space-between',
        alignItems: "center",
        gap: 15,
    },
    paymentIcon: {
        width: 38,
        height: 38,
        resizeMode: "contain",
        marginLeft: -20
    },
    paymentText: {
        color: "#fff",
        fontSize: 15,
    },
    radioCircle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    radioInner: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    deliveryCard: {
        flexDirection: "row",
        alignItems: "center",
        padding: 14,
        borderRadius: 20,
    },
    productRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    productImage: {
        width: 70,
        height: 70,
        borderRadius: 14,
    },
    productName: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    productDesc: {
        color: "#bbb",
        fontSize: 12,
        marginTop: 4,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
        gap: 6,
    },
    finalPrice: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },
    oldPrice: {
        color: "#999",
        fontSize: 12,
        textDecorationLine: "line-through",
    },
    discount: {
        color: "#f66",
        fontSize: 12,
        fontWeight: "700",
    },
    returnText: {
        color: "#ddd",
        fontSize: 12,
        marginTop: 4,
    },
    estimateText: {
        color: "#fff",
        fontSize: 12,
        marginTop: 2,
    },
    priceContainer: {
        padding: 16,
        borderRadius: 20,
    },
    priceHeader: {
        color: "#fff",
        fontSize: 14,
        marginBottom: 8,
    },
    priceRowItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    priceLabel: {
        color: "#ccc",
        fontSize: 13,
    },
    priceValue: {
        color: "#fff",
        fontSize: 13,
    },
    totalRow: {
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.2)",
        marginTop: 8,
        paddingTop: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    totalLabel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    totalValue: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "700",
    },
    bottomSection: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
        paddingBottom: 20,
        gap: 6,
    },
    rewardText: {
        color: "#fff",
        fontSize: 13,
        textAlign: "right",
        marginBottom: 4,
    },
    bottomRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 4,
    },
    bottomAmount: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
    },
    bottomItems: {
        color: "#fff",
        fontSize: 13,
    },
    footer: {
        marginTop: 40,
    },
    footerTopRow: {
        alignItems: "flex-end",
    },
    pointsText: {
        color: "#fff",
        fontSize: 13,
        // marginBottom: 10,
    }, footerBottomRow: {
        marginTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    horizontalLine: {
        height: 1,
        width: 50,
        backgroundColor: "#fff",
        marginLeft: 8,
        marginBottom: -10,
        marginRight: 10
    },
    totalText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 10
    },
    itemText: {
        color: "#fff",
        marginRight: 5
    },
});
