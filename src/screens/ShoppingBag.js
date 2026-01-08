import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, useWindowDimensions, FlatList } from "react-native";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import GlassContainer from "../components/customcomponents/GlassContainer";
import GlassButton from "../components/customcomponents/GlassButton";
// import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Header from "../components/customcomponents/Header";
import GlassmorphismButton from "../components/customcomponents/GlassmorphismButton";
import LinearGradient from "react-native-linear-gradient";
import ShoppingBagProductCard from "../components/customcomponents/ShoppingBagProductCard";
import MokaffaPoints from "../components/customcomponents/mokaffaPoints";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguageCurrency } from "../hooks/LanguageCurrencyContext";
import { useCustomContext } from "../hooks/CustomeContext";
import { useCartCount } from "../hooks/CartContext";
import { _retrieveData } from "../utils/storage";
import { API_KEY, BASE_URL } from "../utils/config";
import axios, { HttpStatusCode } from "axios";
import { editProductQty } from "../services/editProductQty";
import { applyVoucher } from "../services/applyVoucher";
import { appyCoupon } from "../services/appyCoupon";
import { checkAutoLogin } from "../utils/helpers";


const ShoppingBag = ({ navigation }) => {
    const item = {
        name: "Beats Studio3 Wireless Headphones",
        model: "MX3X2LL/A, MQ562PA/A, MX3X2ZM/A",
        price: "₹14,495",
        oldPrice: "₹17,934",
        discount: "20% OFF",
        image: require("../assets/images/headphones.png"),
    };

    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { updateCartCount } = useCartCount();
    const size = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const [isLogin, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [isTotal, setTotal] = useState();
    const [isCartProducts, setCartProducts] = useState();
    const [isCouponData, setCouponData] = useState(false);
    const [isGiftData, setGiftData] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isSuccessModal, setSuccessModal] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [isCartAnimation, setCartAnimation] = useState(false);
    const [isQtyModal, setQtyModal] = useState(false);
    const [isCartID, setCartID] = useState(null);
    const [isCouponError, setCouponError] = useState(null);
    const [isGiftError, setGiftError] = useState(null);
    const [intitalCall, setIntitalCall] = useState(true);
    const [screenLoader, setScreenLoader] = useState(false);
    const [showCouponOption, setShowCouponOption] = useState(false);
    const [showGiftOption, setShowGiftOption] = useState(false);
    // const scrollY = useRef(new Animated.Value(0)).current;


    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            // checkUserLogin();
            fetchCartData();
        }, [language, currency])
    );

    const checkUserLogin = async () => {
        const data = await _retrieveData("CUSTOMER_ID");
        if (data != null) {
            navigation.navigate("ShippingMethod")
        } else {
            navigation.navigate("Login")
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const fetchCartData = async () => {
        try {
            if (intitalCall) {
                setLoading(true);
                setIntitalCall(false);
            }

            const url = `${BASE_URL}${EndPoint?.cart}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData('USER');
            const sessionId = await _retrieveData('SESSION_ID');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user ? user[0].customer_id : null,
                sessionid: sessionId
            }

            console.log("fetchCartData", url, body)

            const response = await axios.post(url, body, { headers: headers });
            console.log("response", response.data);
            if (response.status === HttpStatusCode.Ok) {
                setShowCouponOption(response.data?.applycoupon_status);
                setShowGiftOption(response.data?.applyvoucher_status);
                setLabel(response.data?.text);
                setTotal(response.data?.totals);
                setCartProducts(response.data?.products);
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false)
        }
    }

    const removeProduct = async (cartId) => {
        try {
            setScreenLoader(true);
            const response = await removeProductFromCart(cartId, EndPoint?.cart_remove);
            updateCartCount(response?.cartproductcount);
            fetchCartData();
        } catch (error) {
            console.log("error", error.message);
        } finally {
            setScreenLoader(false);
        }
    }

    const onChangeQty = async (cartId, selectedQty) => {
        try {
            setScreenLoader(true);
            const result = await editProductQty(cartId, selectedQty, EndPoint?.cart_edit);
            console.log(result);
            updateCartCount(result?.cartproductcount);
            setCartAnimation(true);
            setSuccessMgs(result?.success);
            setSuccessModal(true);

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setScreenLoader(false);
        }

    }

    const applyVoucherCode = async (voucher) => {
        try {
            setScreenLoader(true);
            const result = await applyVoucher(voucher, EndPoint?.cart_voucher);
            setSuccessMgs(result?.success);
            setSuccessModal(true);
        } catch (error) {
            if (error.response.data?.error) {
                setGiftError(error.response.data?.error);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setScreenLoader(false);
        }
    }

    const applyCouponCode = async (coupon) => {
        try {
            setScreenLoader(true);
            const result = await appyCoupon(coupon, EndPoint?.cart_coupon);
            setSuccessMgs(result?.success);
            setSuccessModal(true);
        } catch (error) {
            console.log("error", error.response.data);
            if (error.response.data?.error) {
                setCouponError(error.response.data?.error);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setScreenLoader(false);
        }
    }

    const onClickSuccessModal = () => {
        setSuccessMgs(null)
        setSuccessModal(false);
        fetchCartData();
    }

    return (
        <BackgroundWrapper>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, marginTop: Platform.OS === "ios" ? 40 : 0 }}>
                {/* Header */}
                <Header onLogoPress={() => { navigation.navigate("Home") }} />

                {/* Selected Info */}
                <View style={{ paddingHorizontal: 16, paddingTop: 20, paddingBottom: 10, }}>
                    <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => navigation.goBack()}>
                        <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                    </TouchableOpacity>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700", }}>{isLabel?.cartshoping_heading}</Text>
                        <TouchableOpacity style={{
                            borderWidth: 1,
                            borderColor: "#fff",
                            borderRadius: 8,
                            paddingVertical: 6,
                            paddingHorizontal: 12,
                        }}>
                            <Text style={{
                                color: "#fff",
                                fontSize: 12,
                                fontWeight: "600",
                            }}>ENTER PIN CODE</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{
                        color: "#fff",
                        fontSize: 14,
                        marginTop: 6,
                    }}>Check delivery time & services</Text>

                    {/* Selected Items Section */}
                    <View style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 20
                    }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                        }}>
                            <Image
                                source={require("../assets/images/checkbox.png")} // white tick image
                                style={{
                                    width: 18,
                                    height: 18,
                                    marginRight: 8,
                                }}
                            />
                            <Text style={{
                                color: "#fff",
                                fontSize: 14,
                                fontWeight: "600",
                            }}>1/1 ITEMS SELECTED (₹14,495)</Text>
                        </View>

                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}>
                            <TouchableOpacity>
                                <Image source={require("../assets/images/share.png")} style={{
                                    width: 13,
                                    height: 13,
                                    tintColor: "#fff",
                                }} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require("../assets/images/delete.png")} style={{
                                    width: 13,
                                    height: 13,
                                    tintColor: "#fff",
                                }} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={require("../assets/images/heart.png")} style={{
                                    width: 13,
                                    height: 13,
                                    tintColor: "#fff",
                                }} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Product Card */}
                <FlatList
                    data={isCartProducts}
                    keyExtractor={(item) => item.cart_id}
                    contentContainerStyle={{ gap: 16, paddingVertical: 10 }}
                    renderItem={({ item }) => (
                        <ShoppingBagProductCard item={item} />
                    )}
                />

                {/* Available Offers */}
                <GlassContainer>
                    <View style={styles.offerRow}>
                        {/* <Icon name="tag-outline" size={18} color="#fff" /> */}
                        <Image
                            source={require("../assets/images/discount.png")} // white tick image
                            style={{
                                width: 18,
                                height: 18,
                                marginRight: 8,
                            }}
                        />
                        <Text style={styles.offerTitle}>Available Offers</Text>
                    </View>
                    <Text style={styles.offerText}>
                        10% Instant Discount on HDFC Bank Credit Card, Credit Card EMI & Debit Card EMI on a min spend of ₹3,500.
                    </Text>
                    <Text style={styles.showMore}>▼ Show more</Text>
                </GlassContainer>

                {/* Price Details */}
                <GlassContainer>
                    <Text style={styles.sectionTitle}>
                        PRICE DETAILS ({isCartProducts?.length || 0} Items)
                    </Text>

                    {isTotal?.map((item, index) => {
                        const isFinal = index === isTotal.length - 1;

                        return (
                            <View
                                key={index}
                                style={[
                                    styles.priceLine,
                                    isFinal && { marginTop: 8 }
                                ]}
                            >
                                <Text style={isFinal ? styles.totalLabel : styles.label}>
                                    {item.title}
                                </Text>

                                <Text style={isFinal ? styles.totalValue : styles.value}>
                                    {item.text}
                                </Text>
                            </View>
                        );
                    })}
                </GlassContainer>


                {/* Bottom Section */}
                {/* <Text style={styles.pointsText}>Earn 157 Mokafaa Points</Text>
                <GlassmorphismButton onPress={() => { navigation.navigate("ShippingMethod") }} title="PROCEED" /> */}

                <View style={styles.footer}>

                    <MokaffaPoints />

                    <GlassmorphismButton title="PROCEED" onPress={() =>checkUserLogin()} />

                    <View style={styles.footerBottomRow}>
                        <Text style={styles.totalText}>₹16669.25</Text>
                        <Text style={styles.itemText}>1 Item</Text>
                    </View>
                </View>
            </ScrollView>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({
    heading: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
    },
    subHeading: {
        color: "#fff",
        marginTop: 6,
    },
    pinButton: {
        alignSelf: "flex-end",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginTop: -28,
    },
    pinText: {
        color: "#fff",
        fontSize: 12,
    },
    selectedText: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
    productImage: {
        width: 70,
        height: 70,
        resizeMode: "contain",
    },
    productTitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 13,
    },
    productSub: {
        color: "#aaa",
        fontSize: 11,
        marginBottom: 6,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        flexWrap: "wrap", // helps on smaller screens
        gap: 8,
        marginTop: 4,
    },
    miniButton: {
        paddingVertical: 3,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    miniText: {
        fontSize: 10,
    },
    stockText: {
        color: "#fff",
        fontSize: 10,
        opacity: 0.8,
    },
    priceRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 6,
        gap: 8,
    },
    price: {
        color: "#fff",
        fontWeight: "700",
    },
    oldPrice: {
        color: "#999",
        textDecorationLine: "line-through",
        fontSize: 12,
    },
    discount: {
        color: "#ff4d4d",
        fontWeight: "700",
        fontSize: 12,
    },
    returnText: {
        color: "#fff",
        opacity: 0.7,
        fontSize: 11,
        marginTop: 4,
    },
    offerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 6,
    },
    offerTitle: {
        color: "#fff",
        fontWeight: "600",
    },
    offerText: {
        color: "#fff",
        fontSize: 12,
        lineHeight: 18,
    },
    showMore: {
        color: "#fff",
        fontSize: 11,
        marginTop: 4,
    },
    sectionTitle: {
        color: "#fff",
        fontWeight: "600",
        marginBottom: 10,
    },
    priceLine: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 6,
    },
    label: {
        color: "#fff",
    },
    value: {
        color: "#fff",
    },
    totalLabel: {
        color: "#fff",
        fontWeight: "700",
    },
    totalValue: {
        color: "#fff",
        fontWeight: "700",
    },
    footer: {
        marginTop: 10,
    },
    footerTopRow: {
        flexDirection: "row",       // ← align text + line horizontally
        alignItems: "center",       // ← vertically center both
        justifyContent: "flex-end", // ← move both to the right
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

export default ShoppingBag;
