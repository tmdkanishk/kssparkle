import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import GlassContainer from "../components/customcomponents/GlassContainer";
import { Dimensions } from 'react-native';

const MyOrderScreen = ({ navigation }) => {
    const orders = [
        {
            id: "NSAHA0097433507",
            image: require("../assets/images/headphones.png"),
            title: "Beats Studio3 Wireless Headphones MX3X2LL/A, MQ562PA/A, MX3X2ZM/A",
            status: "Delivered",
            date: "Thursday, 2nd Oct, 12:00 PM",
        },
        {
            id: "NSAHA0097433508",
            image: require("../assets/images/headphones.png"),
            title: "Beats Studio3 Wireless Headphones MX3X2LL/A, MQ562PA/A, MX3X2ZM/A",
            status: "Delivered",
            date: "Thursday, 2nd Oct, 12:00 PM",
        },
        {
            id: "NSAHA0097433509",
            image: require("../assets/images/headphones.png"),
            title: "Beats Studio3 Wireless Headphones MX3X2LL/A, MQ562PA/A, MX3X2ZM/A",
            status: "Delivered",
            date: "Thursday, 2nd Oct, 12:00 PM",
        },
    ];

    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;


    return (
        // <LinearGradient colors={["#2b2b2b", "#0e0e0e"]} style={styles.container}>
        <BackgroundWrapper>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
            >

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => { navigation.goBack() }}>
                        <Image source={require("../assets/images/back.png")} style={styles.backIcon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>My Order</Text>
                    <View style={{ width: 24 }} />
                </View>


                <View style={styles.filters}>

                    <GlassContainer
                        style={{ flexDirection: "row" }}
                        borderRadius={12}
                    >
                        <Image source={require("../assets/images/dropdown.png")} style={styles.dropdownIcon} />
                        <Text style={styles.filterText}>Last 3 months</Text>
                    </GlassContainer>

                    <GlassContainer
                        style={{
                            flexDirection: "row",
                            width: screenWidth * 0.45,
                         
                            justifyContent: "flex-end",
                            alignItems: "center",
                        }}
                        borderRadius={12}
                    >
                        <Text style={styles.filterText}>Find Items</Text>
                        <Image source={require("../assets/images/search.png")} style={styles.dropdownIcon} />
                    </GlassContainer>

                </View>



                <Text style={styles.sectionTitle}>Completed</Text>


                {orders.map((order, index) => (
                    <GlassContainer key={index} style={styles.orderCard}>
                        <Text style={styles.orderId}>Order ID {order.id}</Text>

                        <View style={styles.productRow}>
                            {/* <Image source={order.image} style={styles.productImage} /> */}
                            {/* LEFT IMAGE */}
                            <LinearGradient
                                colors={["#505050", "#808080"]}
                                start={{ x: 0.5, y: 0 }}
                                end={{ x: 0.5, y: 1 }}
                                style={styles.productImage}
                            >
                                <Image source={order.image} style={styles.productImage} />
                            </LinearGradient>
                            <View style={styles.productDetails}>
                                <Text style={styles.productTitle} numberOfLines={2}>{order.title}</Text>

                                <Text style={styles.status}>{order.status}</Text>
                                <Text style={styles.deliveryDate}>on {order.date}</Text>
                                <Text style={styles.shareText}>Share your experience</Text>
                            </View>

                            <TouchableOpacity>
                                <Image
                                    source={require("../assets/images/back.png")}
                                    style={styles.arrowIcon}
                                />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.actionRow}>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionText}>Return</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionText}>Replace</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.actionButton}>
                                <Text style={styles.actionText}>Delivered</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassContainer>
                ))}
            </ScrollView>
        </BackgroundWrapper>
        // </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        marginTop: 60,
        marginHorizontal: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    backIcon: {
        width: 22,
        height: 22,
        tintColor: "#fff",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    filters: {
        // marginTop: 20,
        // marginHorizontal: 20,
        // flexDirection: "row",
        // marginLeft: 20,
        flexDirection: "row",
        gap:40,
        alignItems: "center",
        width: "100%",
        marginLeft:20


        // justifyContent: "space-between",
    },
    filterBox: {
        // width: "47%",
        flexDirection: "row",
        // minWidth: '30%',
        // justifyContent: "space-between",
        // alignItems: "center",
        // paddingHorizontal: 12,
        // paddingVertical: 10,
    },
    filterText: {
        color: "#fff",
        fontSize: 13,
        marginLeft: 3,
    },
    dropdownIcon: {
        width: 10,
        height: 10,
        tintColor: "#fff",
        marginTop: 3
    },
    searchInput: {
        color: "#fff",
        fontSize: 13,
        // flex: 1,
    },
    searchIcon: {
        width: 14,
        height: 14,
        tintColor: "#fff",
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        marginTop: 25,
        marginLeft: 22,
    },
    orderCard: {
        marginHorizontal: 0,
        maxWidth: '93%',
        marginLeft: 12
        // marginTop: 15,
        // padding: 14,
    },
    orderId: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "600",
        marginBottom: 10,
    },
    productRow: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    productImage: {
        width: 100,
        height: 120,
        borderRadius: 10,
    },
    productDetails: {
        flex: 1,
        marginLeft: 12,
    },
    productTitle: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
        marginBottom: 6,
    },
    status: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 13,
    },
    deliveryDate: {
        color: "#ccc",
        fontSize: 12,
        marginVertical: 2,
    },
    shareText: {
        color: "#bbb",
        fontSize: 11,
    },
    arrowIcon: {
        width: 14,
        height: 14,
        tintColor: "#fff",
        marginTop: 40,
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 12,
    },
    actionButton: {
        flex: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        marginHorizontal: 4,
        borderRadius: 10,
        paddingVertical: 8,
        alignItems: "center",
    },
    actionText: {
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
    },
});

export default MyOrderScreen;
