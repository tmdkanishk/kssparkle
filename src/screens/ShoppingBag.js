import React, { useCallback, useRef, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, useWindowDimensions, FlatList, Pressable, Share, KeyboardAvoidingView } from "react-native";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import GlassContainer from "../components/customcomponents/GlassContainer";
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
import { checkAutoLogin, isRTLText } from "../utils/helpers";
import { IconComponentcheckboxsharp, IconComponentHeart, IconComponentShare, IconComponentSquare, IconComponentTrash } from "../constants/IconComponents";
import { removeAllProductFromCart } from "../services/removeAllProductFromCart";
import { useWishlist } from "../hooks/WishlistContext";
import SuccessModal from "../components/SuccessModal";
import CustomCouponSection from "../components/customcomponents/CustomCouponSection";
import CustomVoucherSection from "../components/customcomponents/CustomVoucherSection";
import { shareAllUrlProdcuts } from "../services/shareAllUrlProdcuts";
import { useLoading } from "../hooks/LoadingProvider";


const ShoppingBag = ({ navigation }) => {
    const { setGlobalLoading } = useLoading();
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { success, setSuccess, handleAllWishlistToggle } = useWishlist();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { updateCartCount, cartCount } = useCartCount();
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

    const [isCouponSuccess, setCouponSuccess] = useState(null);
    const [isVoucherSuccess, setVoucherSuccess] = useState(null);

    // const scrollY = useRef(new Animated.Value(0)).current;


    // multi selection
    const [cartItem, setCartItem] = useState([]);

    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            // checkUserLogin();
            fetchCartData();
        }, [language, currency, cartCount])
    );

    const checkUserLogin = async () => {
        const data = await _retrieveData("CUSTOMER_ID");
        if (data != null) {
            navigation.navigate("ChooseDeliveryAddress");
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
                setGlobalLoading(true);
                setIntitalCall(false);
            }

            const url = `${BASE_URL}${EndPoint?.cart}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            // const user = await _retrieveData('USER');
            const user = await _retrieveData("CUSTOMER_ID");
            const sessionId = await _retrieveData('SESSION_ID');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user,
                sessionid: sessionId
            }

            // console.log("fetchCartData", url, body)

            const response = await axios.post(url, body, { headers: headers });
            // console.log("response", response.data);
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
            setGlobalLoading(false);
        }
    }

    const removeAllProduct = async () => {
        try {
            setGlobalLoading(true);
            const cartIds = cartItem.map(item => item.cart_id);
            const response = await removeAllProductFromCart(cartIds, EndPoint?.cart_remove);
            console.log("removeAllProductFromCart response ", response)
            updateCartCount(response?.cartproductcount);
            setCartItem([]);

        } catch (error) {

        } finally {
            setGlobalLoading(false);
        }
    }


    const applyVoucherCode = async (voucher) => {
        try {
            setGlobalLoading(true);
            const response = await applyVoucher(voucher, EndPoint?.cart_voucher);
            console.log("response", response);
            console.log("applyCouponCode response : ", response);
            if (response?.success) {
                setVoucherSuccess(response?.success);
                setGiftError(null);
                fetchCartData();
            }
        } catch (error) {
            if (error.response.data?.error) {
                setGiftError(error.response.data?.error);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setGlobalLoading(false);
        }
    }

    const applyCouponCode = async (coupon) => {
        try {
            setGlobalLoading(true);
            const response = await appyCoupon(coupon, EndPoint?.cart_coupon);
            console.log("applyCouponCode response : ", response);
            if (response?.success) {
                setCouponSuccess(response?.success);
                setCouponError(null);
                fetchCartData();
            }
        } catch (error) {
            console.log("applyCouponCode error : ", error.response.data);
            if (error.response.data?.error) {
                setCouponError(error.response.data?.error);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setCouponSuccess(null);
            setGlobalLoading(false);
        }
    }

    const onClickSuccessModal = () => {
        setSuccessMgs(null)
        setSuccessModal(false);
        fetchCartData();
    }



    const toggleCart = (item) => {
        setCartItem(prev =>
            prev.includes(item)
                ? prev.filter(id => id?.cart_id !== item?.cart_id) // remove
                : [...prev, item]               // add
        );
    };

    const toggleSelectAll = () => {
        if (cartItem?.length === isCartProducts?.length) {
            // Unselect all
            setCartItem([]);
        } else {
            // Select all
            setCartItem(isCartProducts);
        }
    };

    const addAllWishList = () => {
        try {
            const productIds = [...new Set(
                cartItem.map(item => item?.product_id)
            )]; // find  unique productIds

            handleAllWishlistToggle(productIds);


            // console.log("productIds", productIds);

            // const productIds = cartItem.map(item => item.product_id);

        } catch (error) {

        }
    }


    const shareAllProduct = async () => {
        try {
            setGlobalLoading(true);
            const productIds = [...new Set(
                cartItem.map(item => item?.product_id)
            )]; // find  unique productIds

            if (productIds?.length == 0) {
                return;
            }
            const response = await shareAllUrlProdcuts(productIds, EndPoint?.share)

            console.log("response", response?.responses);

            if (response?.responses) {
                const message = response?.responses
                    .map(item => item)
                    .join(', ');

                const result = await Share.share({
                    message: message,
                });
                if (result.action === Share.sharedAction) {
                    if (result.activityType) {
                        console.log("Shared with activity type:", result.activityType);
                    } else {
                        console.log("Shared successfully!");
                    }
                } else if (result.action === Share.dismissedAction) {
                    console.log("Share dismissed.");
                }
            }
            console.log("response shareAllProduct", response);
        } catch (error) {
            console.log("error share product", error.response.data);
        } finally {
            setGlobalLoading(false);
        }
    }

    return (
        <BackgroundWrapper>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, marginTop: Platform.OS === "ios" ? 40 : 0, opacity: screenLoader ? 0.5 : 1 }}>
                    {/* Header */}
                    <Header onLogoPress={() => { navigation.navigate("Home") }} />

                    {/* Selected Info */}
                    <View style={{ paddingTop: 20, paddingBottom: 10, paddingHorizontal: 10 }}>
                        <TouchableOpacity style={{ marginBottom: 15 }} onPress={() => navigation.goBack()}>
                            <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                        </TouchableOpacity>

                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
                            <Text style={{ color: "#fff", fontSize: 22, fontWeight: "700" }}>{isLabel?.cartshoping_heading}</Text>

                            {/* <Text style={{
                            color: "#fff", fontSize: 22, fontWeight: "700", textAlign: isRTLText(isLabel?.cartshoping_heading) ? 'right' : 'left',
                            writingDirection: isRTLText(isLabel?.cartshoping_heading) ? 'rtl' : 'ltr',
                        }}>{isLabel?.cartshoping_heading}</Text> */}

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
                            marginTop: 20,
                        }}>
                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10
                            }}>
                                <Pressable hitSlop={40} onPress={toggleSelectAll} style={{}}>
                                    {cartItem?.length === isCartProducts?.length && isCartProducts?.length > 0 ? <IconComponentcheckboxsharp color={'#fff'} size={20} /> : <IconComponentSquare color={'#fff'} size={20} />}
                                </Pressable>

                                <Text style={{
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: "600",
                                }}>{cartItem?.length}/{isCartProducts?.length} ITEMS SELECTED</Text>
                            </View>

                            <View style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 14,
                            }}>

                                <TouchableOpacity onPress={shareAllProduct}>
                                    <IconComponentShare color={'#fff'} size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={removeAllProduct}>
                                    <IconComponentTrash color={'#fff'} size={24} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={addAllWishList}>
                                    <IconComponentHeart color={'#fff'} size={24} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Product Card */}

                    {
                        isCartProducts?.length ?
                            (isCartProducts?.map((item, index) => (
                                <ShoppingBagProductCard item={item} key={index} toggleCart={(item) => toggleCart(item)} cartItems={cartItem} />
                            ))) : null
                    }

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

                    {/* coupon section */}
                    <CustomCouponSection
                        onClickApply={(coupon) => applyCouponCode(coupon)}
                        error={isCouponError}
                        success={isCouponSuccess}
                    />

                    {/* voucher section */}
                    <CustomVoucherSection
                        onVoucherApply={(voucher) => applyVoucherCode(voucher)}
                        error={isGiftError}
                        success={isVoucherSuccess}

                    />



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

                        <GlassmorphismButton title="PROCEED" onPress={() => checkUserLogin()} />

                        <View style={styles.footerBottomRow}>
                            <Text style={styles.totalText}>₹16669.25</Text>
                            <Text style={styles.itemText}>1 Item</Text>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <SuccessModal
                handleCloseModal={() => setSuccess('')}
                isModal={success ? true : false}
                isSuccessMessage={success}
                onClickClose={() => setSuccess('')}
            />

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
