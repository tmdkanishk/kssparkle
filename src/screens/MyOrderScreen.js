import React, { useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, TextInput, FlatList, useWindowDimensions, Animated, ActivityIndicator } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import GlassContainer from "../components/customcomponents/GlassContainer";
import { Dimensions } from 'react-native';
import { checkAutoLogin } from "../utils/helpers";
import { useLanguageCurrency } from "../hooks/LanguageCurrencyContext";
import { useCustomContext } from "../hooks/CustomeContext";
import { getOrderHistoryAndText } from "../services/getOrderHistoryAndText";
import { _retrieveData } from "../utils/storage";
import PriceView from "../components/customcomponents/PriceView";
import CustomHeader from "../components/customcomponents/CustomHeader";

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

    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLogin, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [orderHistoryData, setOrderHistoryData] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [page, setPage] = useState(1);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [activeSeachingScreen, setActiveSeachingScreen] = useState(false);

    useEffect(() => {
        checkAutoLogin();
        checkUserLogin();
        fetchOrderHistoryTextAndHistory();
    }, [language, currency, page]);



    const fetchOrderHistoryTextAndHistory = async () => {
        console.log("im calling");
        try {
            if (page == 1) {
                setLoading(true);
            }
            setLoadingMore(true)
            const result = await getOrderHistoryAndText(page, EndPoint?.order_orderhistory);
            console.log("my order result", result)
            setLabel(result?.text);
            setOrderHistoryData((prevData) => {
                const existingIds = new Set(prevData.map(item => item.order_id));
                const newOrders = result?.orders?.filter(order => !existingIds.has(order.order_id));
                console.log("newOrders", newOrders);

                return [...prevData, ...newOrders];
            });

            if (page >= result?.pages) {
                setHasMoreData(false);
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
            setLoadingMore(false)
        }

    }

    const handleLoadMore = () => {
        if (!loadingMore && hasMoreData) {
            setPage((prevPage) => prevPage + 1);
        }
    };


    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator size="large" color={Colors?.primary} />;
    };

    const checkUserLogin = async () => {
        const data = await _retrieveData("CUSTOMER_ID");
        if (data != null) {
            setLogin(true);
        } else {
            setLogin(false);
            navigation.replace('Login');
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);

    }


    const handleSearch = async (query) => {
        try {
            setLoading(true);
            navigation.navigate('Search', { query: query })
        } catch (error) {
            console.log('Search results:', error.response.data);
        } finally {
            setLoading(false);
        }
    }


    const renderOrderItem = ({ item }) => (
        <GlassContainer style={styles.orderCard}>

            {/* ORDER ID */}
            <Text style={styles.orderId}>
                {isLabel?.orderhstryorderid_label} {item.order_id}
            </Text>

            <View style={styles.productRow}>

                {/* STATIC IMAGE (API doesn't give image) */}
                <LinearGradient
                    colors={["#505050", "#808080"]}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={styles.productImage}
                >
                    <Image
                        source={require("../assets/images/headphones.png")}
                        style={styles.productImage}
                    />
                </LinearGradient>

                <View style={styles.productDetails}>

                    {/* CUSTOMER NAME */}
                    <Text style={styles.productTitle} numberOfLines={2}>
                        {item.name}
                    </Text>

                    {/* STATUS (Arabic from API) */}
                    <Text style={styles.status}>
                        {item.status}
                    </Text>

                    {/* DATE */}
                    <Text style={styles.deliveryDate}>
                        {item.date_added}
                    </Text>

                    {/* PRODUCTS COUNT */}
                    <Text style={styles.shareText}>
                        {item.products} product(s)
                    </Text>

                    <Text style={[styles.shareText]}>
                        {
                            item?.total ? <PriceView priceHtml={item?.total} textStyle={{}} /> : ""
                        }
                    </Text>

                </View>

                <TouchableOpacity>
                    <Image
                        source={require("../assets/images/back.png")}
                        style={styles.arrowIcon}
                    />
                </TouchableOpacity>
            </View>

            {/* ACTIONS */}
            <View style={styles.actionRow}>
                {/* <TouchableOpacity  style={styles.actionButton}>
                    <Text style={styles.actionText}>Return</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Replace</Text>
                </TouchableOpacity> */}

                <TouchableOpacity onPress={() => { navigation.navigate("OrderView", { orderId: item?.order_id }) }} style={styles.actionButton}>
                    <Text style={styles.actionText}>{isLabel?.orderhstryorderdetailbtn_label}</Text>
                </TouchableOpacity>

                {item?.tracking === "1" ? <TouchableOpacity onPress={() => { navigation.navigate("TrackingDetails", {orderId: item?.order_id})}} style={styles.actionButton}>
                    <Text style={styles.actionText}>{"Track"}</Text>
                </TouchableOpacity> : <></>}

                

                <View style={styles.actionButton}>
                    <Text style={styles.actionText}>{item?.status}</Text>
                </View>
            </View>
        </GlassContainer>
    );


    return (
        <>
            <BackgroundWrapper>
                <FlatList
                    data={orderHistoryData}
                    keyExtractor={(item) => item.order_id.toString()}
                    renderItem={renderOrderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.6}
                    ListFooterComponent={renderFooter}

                    ListHeaderComponent={
                        <>
                            {/* HEADER */}
                            <View style={styles.header}>
                                <TouchableOpacity onPress={() => navigation.goBack()}>
                                    <Image
                                        source={require("../assets/images/back.png")}
                                        style={styles.backIcon}
                                    />
                                </TouchableOpacity>
                                <Text style={styles.headerTitle}>{isLabel?.orderhstrypagename_label}</Text>
                                <View style={{ width: 24 }} />
                            </View>

                            {/* <View style={{ marginTop: 50, marginLeft:5 }}>
                            <CustomHeader pageName={"My Order"} />
                        </View> */}


                            {/* FILTERS */}
                            {/* <View style={styles.filters}>

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

                        </View> */}

                            {/* SECTION TITLE */}
                            {/* <Text style={styles.sectionTitle}>Completed</Text> */}
                        </>
                    }
                />
            </BackgroundWrapper>
        </>
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
        gap: 40,
        alignItems: "center",
        width: "100%",
        marginLeft: 20


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
        gap: 5
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
        color: "#fff",
        fontSize: 12,
        marginVertical: 2,
    },
    shareText: {
        color: "#fff",
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
