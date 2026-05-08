import React, { useState, memo, useEffect, useCallback, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    ScrollView,
    Image,
    Platform,
    Alert,
    KeyboardAvoidingView,
} from "react-native";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import GlassContainer from "../components/customcomponents/GlassContainer";
import GlassButton from "../components/customcomponents/GlassButton";
import GlassmorphismButton from "../components/customcomponents/GlassmorphismButton";
import GlassSwipeButton from "../components/customcomponents/GlassSwipeButton";
import MokaffaPoints from "../components/customcomponents/mokaffaPoints";
import { checkAutoLogin } from "../utils/helpers";
import { getShippingPaymentMehtod } from "../services/getShippingPaymentMehtod";
import { useCustomContext } from "../hooks/CustomeContext";
import { checkShippingAddress } from "../services/checkShippingAddress";
import { saveShippingPaymentMethod } from "../services/saveShippingPaymentMethod";
import { getShippingPoint } from "../services/getShippingPoint";
import { useFocusEffect } from "@react-navigation/native";
import { useLanguageCurrency } from "../hooks/LanguageCurrencyContext";
import { _retrieveData } from "../utils/storage";
import { useLoading } from "../hooks/LoadingProvider";
import FailedModal from "../components/FailedModal";
import PriceView from "../components/customcomponents/PriceView";
// import { ArrowLeft, ArrowRight, Gift } from "lucide-react-native";

const ShippingMethod = ({ navigation }) => {
    const [selectedMethod, setSelectedMethod] = useState("Free Shipping");
    const [selected, setSelected] = useState(null)
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLabel, setLabel] = useState();
    const [loading, setLoading] = useState(false);
    const [isPaymentMethodList, setPaymentMethodList] = useState();
    const [isShippingMethodList, setShippingMethodList] = useState();
    const [isShippingMethodCode, setShippingMethodCode] = useState();
    const [isPaymentMethodCode, setPaymentMethodCode] = useState();
    const [isComment, setComment] = useState("Test Comment");
    const [isTC, setTC] = useState(true);
    const [isShippingPointModal, setShippingPointModal] = useState(false);
    const [isShippingPointUrl, setShippingPointUrl] = useState(null);
    const [loadingWebView, setLoadingWebView] = useState(false);
    const [screenLoading, setScreenLoading] = useState(false);
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const { setGlobalLoading } = useLoading()
    const [isGiftWrap, setIsGiftWrap] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const swipeButtonRef = useRef(null);
    const [swipeKey, setSwipeKey] = useState(0);




    const shippingMethods = [
        { id: 1, title: "Free Shipping", price: "₹0.00" },
        { id: 2, title: "Fast Delivery ( 48H )", price: "₹50.00" },
    ];


    useFocusEffect(
        useCallback(() => {
            //   checkAutoLogin();
            checkUserLogin();
            setSwipeKey(prev => prev + 1);
            //   fetchAllMyAddress();
            //   fetchCheckOutText();
        }, [language, currency, navigation])

    )

    const checkUserLogin = async () => {
        const data = await _retrieveData("CUSTOMER_ID");
        if (data == null) {
            navigation.replace('Login');
            return;
        }
    }


    useEffect(() => {
        checkAutoLogin();
        fetchShippingPaymentMenthod();
    }, []);

    const fetchShippingPaymentMenthod = async () => {
        try {
            setGlobalLoading(true);
            const result = await getShippingPaymentMehtod(
                EndPoint?.checkout_Shippingandpaymentmethod
            );
            console.log("Shipping and payment method", result);
            setLabel(result?.text);
            const payment = result?.paymentmethod;

            const paymentArray = Object.keys(payment).map((key) => ({
                ...payment[key],
                id: key, // Optionally add the key as an `id` field
            }));
            setPaymentMethodList(paymentArray);
            const shippingmethod = result?.shippingmethod;
            const shippingMethodsArray = Object.entries(shippingmethod).map(
                ([key, value]) => ({
                    id: key,              // stable key for React
                    code: value.code,     // ✅ IMPORTANT
                    error: value.error,
                    quote: value.quote,
                    sort_order: value.sort_order,
                    title: value.title,
                })
            );

            setShippingMethodList(shippingMethodsArray);

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setGlobalLoading(false);
        }
    };

    const onClickContinueOrder = async () => {
        setGlobalLoading(true);
        if (isShippingMethodCode) {
            const response = await checkShippingAddress(isShippingMethodCode, EndPoint?.shippingerror);

            console.log("response shipping method ", response);

            if (response?.error) {
                // Alert.alert(
                //     '',
                //     response?.error,
                //     [
                //         { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
                //     ]
                // );

                setErrorMgs(GlobalText?.extrafield_okbtn);
                setErrorModal(true);
                setSwipeKey(prev => prev + 1);
                return;
            }

            if (isPaymentMethodCode) {
                try {
                    const result = await saveShippingPaymentMethod(
                        isShippingMethodCode,
                        isPaymentMethodCode,
                        isComment,
                        isTC,
                        EndPoint?.checkout_Shippingandpaymentmethodsave
                    );
                    navigation.navigate("OrderPlace")
                } catch (error) {
                    console.log("error", error.response.data);
                    setErrorMgs(GlobalText?.extrafield_okbtn);
                    setErrorModal(true);
                    setSwipeKey(prev => prev + 1);
                    // Alert.alert("", GlobalText?.extrafield_somethingwrong, [{ text: GlobalText?.extrafield_okbtn }]);
                }
            } else {
                // Alert.alert(
                //     '',
                //     isLabel?.selctpaymethod_label,
                //     [
                //         { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
                //     ]
                // );
                setErrorMgs(GlobalText?.extrafield_okbtn);
                setErrorModal(true);
                setSwipeKey(prev => prev + 1);
            }

        } else {
            // Alert.alert(
            //     '',
            //     isLabel?.selctshipmethod_label,
            //     [
            //         { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
            //     ]
            // );
            setErrorMgs(GlobalText?.extrafield_okbtn);
            setErrorModal(true);
            setSwipeKey(prev => prev + 1);

        }
        setGlobalLoading(false);
    };

    const onOpenShippingPoint = async () => {
        try {
            const response = await getShippingPoint(EndPoint?.shipping_gls_parcel);
            console.log("response", response?.url);
            setShippingPointUrl(response?.url);
            setShippingPointModal(true);
        } catch (error) {
            console.log(error.response.data);
        }
    }


    const handleWebViewMessage = (event) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);
            console.log('select pick up data message!', data);
            if (data?.value) {
                setShippingPointModal(false);
                fetchShippingPaymentMenthod();
                console.log('Clicked!', `You clicked on: ${data.value}`);
            }

        } catch (error) {
            console.log('error!', `You clicked on:`);
        }

    };

    const injectedJS = `
      (function() {
        const originalAlert = window.alert;
        window.alert = function(message) {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'alert', value: message }));
          // Optionally still show the original alert in browser:
          // originalAlert(message);
        };
      })();
      true;
    `;

    return (
        <>
            <BackgroundWrapper>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={[styles.container, { marginTop: Platform.OS === "ios" ? 60 : 10 }]}
                    scrollEnabled={scrollEnabled}
                >
                    <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.goBack()}>
                        <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                    </TouchableOpacity>
                    {/* 🔹 Header */}
                    {isShippingMethodList?.length > 0 && (
                        <>
                            <View style={styles.headerRow}>
                                <Text style={styles.headerTitle}>{isLabel?.selctshipmethod_label}</Text>
                            </View>

                            <View style={{ marginTop: 20 }}>
                                {isShippingMethodList.map((method) => (
                                    <TouchableOpacity
                                        key={method.id}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setSelectedMethod(method.code);
                                            setShippingMethodCode(method.code);
                                        }}
                                    >
                                        <GlassContainer style={styles.shippingCard}>
                                            <Text style={styles.shippingTitle}>{method.title}</Text>

                                            <View
                                                style={[
                                                    styles.radioOuter,
                                                    selectedMethod === method.code && styles.radioOuterActive,
                                                ]}
                                            >
                                                {selectedMethod === method.code && <View style={styles.radioInner} />}
                                            </View>
                                        </GlassContainer>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </>
                    )}



                    {isPaymentMethodList?.length > 0 && (
                        <>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginTop: 30 }}>
                                <Text style={[styles.title, { marginBottom: 10 }]}>{isLabel?.selctpaymethod_label}</Text>
                            </View>

                            {isPaymentMethodList.map((item) => (
                                <GlassContainer
                                    key={item?.code}
                                    style={[
                                        styles.paymentOption,
                                        selected === item?.code && {
                                            // borderColor: '#00E5FF',
                                            // // glow effect
                                            // shadowColor: '#00E5FF',
                                            // shadowOffset: { width: 0, height: 0 },
                                            // shadowOpacity: 1,
                                            // shadowRadius: 25,   // 👈 increase glow spread (iOS)

                                            // elevation: 15,      // 👈 increase glow spread (Android)
                                        }
                                    ]}
                                >
                                    <TouchableOpacity
                                        style={styles.paymentRow}
                                        activeOpacity={0.8}
                                        onPress={() => {
                                            setSelected(item?.code);
                                            setPaymentMethodCode(item?.code);
                                        }}
                                    >
                                        <View style={styles.iconRow}>
                                            {item?.code === 'tamarapay' ? (
                                                <>
                                                    <Image
                                                        source={require('../assets/images/tamara_logo.png')}
                                                        style={{ width: 45, height: 25, }}
                                                        resizeMode="contain"
                                                    />

                                                    <PriceView
                                                        priceHtml={item?.title}
                                                        textStyle={styles.paymentText}
                                                        width={60} // Adjust width to fit the Tamara badge
                                                        height={25}
                                                    />
                                                </>

                                            ) : item?.code === 'tabby_installments' ? (
                                                <>
                                                    <Image
                                                        source={require('../assets/images/tabby_logo.png')} // 👈 add this asset
                                                        style={{ width: 45, height: 25 }}
                                                        resizeMode="contain"
                                                    />

                                                    <View>
                                                        <Text style={styles.paymentText}>
                                                            {item?.title}
                                                        </Text>

                                                        {/* Installment Info */}
                                                        {/* {item?.price && item?.installments_count && (
                                                            <Text style={{ color: '#aaa', fontSize: 12 }}>
                                                                {`Pay ${item.installments_count} × ${(
                                                                    Number(item.price) / item.installments_count
                                                                ).toFixed(2)} ${item.currency}`}
                                                            </Text>
                                                        )} */}
                                                    </View>
                                                </>
                                            ) :

                                                (
                                                    <>
                                                        <Image
                                                            source={require('../assets/images/creditcard.png')}
                                                            style={styles.paymentIcon}
                                                        />
                                                        <Text style={styles.paymentText}>{item?.title}</Text>
                                                    </>
                                                )

                                            }
                                        </View>


                                        <View style={styles.radioCircle}>
                                            {selected === item?.code && <View style={styles.radioInner} />}
                                        </View>
                                    </TouchableOpacity>
                                </GlassContainer>
                            ))}
                        </>
                    )}


                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ paddingBottom: 40 }}
                        >
                            {/* 🔹 Gift Section */}
                            {/* <View style={styles.giftSection}>
                            <TouchableOpacity
                                style={styles.giftWrapRow}
                                activeOpacity={0.8}
                                onPress={() => setIsGiftWrap(prev => !prev)}
                                hitSlop={20}
                            >
                                <View style={styles.radioOuterSmall}>
                                    {isGiftWrap && <View style={styles.radioInnerSmall} />}
                                </View>

                                <Text style={styles.giftWrapText}>Gift Wrap</Text>
                            </TouchableOpacity>

                            {isGiftWrap && (
                                <>
                                    <View style={styles.giftHeader}>
                                        <Text style={styles.giftTitle}>Gift</Text>
                                        <Image
                                            style={{ width: 30, height: 30 }}
                                            source={require('../assets/images/gift.png')}
                                        />
                                    </View>

                                    <Text style={styles.sectionSubtitle}>Recipient’s Details</Text>

                                    <GlassContainer padding={4} borderRadius={10}>
                                        <TextInput
                                            placeholder="Full Name"
                                            placeholderTextColor="#fff"
                                            style={styles.input}
                                        />
                                    </GlassContainer>

                                    <GlassContainer padding={4} borderRadius={10}>
                                        <TextInput
                                            placeholder="Phone Number"
                                            placeholderTextColor="#fff"
                                            keyboardType="phone-pad"
                                            style={styles.input}
                                        />
                                    </GlassContainer>

                                    <GlassContainer padding={4} borderRadius={10} style={{ height: 70 }}>
                                        <TextInput
                                            placeholder="Address"
                                            placeholderTextColor="#fff"
                                            style={styles.input}
                                            multiline
                                        />
                                    </GlassContainer>

                                    <View style={{ marginTop: 20 }}>
                                        <GlassContainer padding={4} borderRadius={10} style={{ height: 70 }}>
                                            <TextInput
                                                placeholder="Custom Message"
                                                placeholderTextColor="#fff"
                                                style={styles.input}
                                                multiline
                                            />
                                        </GlassContainer>
                                    </View>
                                </>
                            )}
                        </View> */}
                        </ScrollView>
                    </KeyboardAvoidingView>




                </ScrollView>

                {/* 🔹 Footer */}
                <View style={styles.footer}>

                    {/* <MokaffaPoints /> */}


                    {/* <GlassmorphismButton title="SLIDE TO ORDER" onPress={()=>navigation.navigate("ChooseDeliveryAddress")}/> */}
                    {/* <GlassSwipeButton
                    title="SLIDE TO ORDER"
                    onSwipeStart={() => setScrollEnabled(false)}
                    onSwipeEnd={() => setScrollEnabled(true)}
                    onSwipeSuccess={() => onClickContinueOrder()}
                /> */}

                    <GlassSwipeButton
                        key={swipeKey}
                        title={isLabel?.slidetocontinue}
                        onSwipeStart={() => setScrollEnabled(false)}
                        onSwipeEnd={() => setScrollEnabled(true)}
                        onSwipeSuccess={() => onClickContinueOrder()}
                    />




                    {/* <View style={styles.footerBottomRow}>
                        <Text style={styles.totalText}>₹16669.25</Text>
                        <Text style={styles.itemText}>1 Item</Text>
                    </View> */}
                </View>

                <FailedModal
                    isSuccessMessage={isErrorMgs}
                    handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
                    isModal={isErrorModal}
                    onClickClose={() => { setErrorModal(false); setErrorMgs() }}
                />

            </BackgroundWrapper>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        paddingBottom: 80,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    headerTitle: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
    },
    shippingCard: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        borderRadius: 44,
        // paddingHorizontal: 20,
        // paddingVertical: 14,
        // marginBottom: 12,
    },
    shippingTitle: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "600",
    },
    shippingPrice: {
        color: "#fff",
        fontSize: 13,
        marginTop: 4,
    },
    radioOuter: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    radioOuterActive: {
        borderColor: "#fff",
    },
    radioInner: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    giftSection: {
        marginTop: 30,
    },
    giftHeader: {
        flexDirection: "row",
        alignItems: "center",   // vertically center everything
        gap: 8,                 // cleaner spacing
        marginLeft: 15,
    },

    giftTitle: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
    },
    sectionSubtitle: {
        color: "#fff",
        fontWeight: "600",
        fontSize: 14,
        marginTop: 10,
        marginBottom: 10,
    },
    inputContainer: {
        borderRadius: 5,
        marginBottom: 12,
    },
    input: {
        // borderWidth:1,
        // borderColor:'white',
        padding: 10,
        color: "#fff",
        // fontSize: 14,
        // paddingHorizontal: 8,
        // paddingVertical: Platform.OS === "android" ? 4 : 4,
    },
    giftWrapRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 30,
        marginLeft: 10
    },
    radioOuterSmall: {
        width: 18,
        height: 18,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
    radioInnerSmall: {
        width: 9,
        height: 9,
        borderRadius: 5,
        backgroundColor: "#fff",
    },
    giftWrapText: {
        color: "#fff",
        fontSize: 14,
        marginLeft: 8,
    },
    footer: {
        marginBottom: 10,
        paddingBottom: 20,
        padding: 15
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
    slideButton: {
        width: "100%",
        paddingVertical: 14,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    slideText: {
        fontSize: 14,
        fontWeight: "700",
        color: "#fff",
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
    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 10
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
        // paddingHorizontal: 10,
        borderRadius: 20,
        marginTop: 5,
        width: '100%'
    },
    paymentOptionActive: {
        borderColor: '#00E5FF',

        // iOS glow
        shadowColor: '#00E5FF',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 12,

        // Android glow
        elevation: 8,
    },
    paymentRow: {
        flexDirection: "row",
        // justifyContent: "space-between",
        alignItems: "center",
    },
    iconRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        flex: 1,
        // backgroundColor:'red',
        marginLeft: -10
    },
    paymentIcon: {
        width: 38,
        height: 38,
        resizeMode: "contain",
        // marginLeft: -20
    },
    paymentText: {
        color: "#fff",
        fontSize: 15,
        width: '70%',
        marginLeft: 10

    },
    radioCircle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor:'green'
    },
    radioInner: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
});

export default memo(ShippingMethod);
