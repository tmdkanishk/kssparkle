import React, { useState, memo, useEffect, useCallback } from "react";
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
// import { ArrowLeft, ArrowRight, Gift } from "lucide-react-native";

const ShippingMethod = ({ navigation }) => {
    const [selectedMethod, setSelectedMethod] = useState("Free Shipping");
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLabel, setLabel] = useState();
    const [loading, setLoading] = useState(false);
    const [isPaymentMethodList, setPaymentMethodList] = useState();
    const [isShippingMethodList, setShippingMethodList] = useState();
    const [isShippingMethodCode, setShippingMethodCode] = useState();
    const [isPaymentMethodCode, setPaymentMethodCode] = useState();
    const [isComment, setComment] = useState();
    const [isTC, setTC] = useState(false);
    const [isShippingPointModal, setShippingPointModal] = useState(false);
    const [isShippingPointUrl, setShippingPointUrl] = useState(null);
    const [loadingWebView, setLoadingWebView] = useState(false);
    const [screenLoading, setScreenLoading] = useState(false);
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const [scrollEnabled, setScrollEnabled] = useState(true);

    const shippingMethods = [
        { id: 1, title: "Free Shipping", price: "₹0.00" },
        { id: 2, title: "Fast Delivery ( 48H )", price: "₹50.00" },
    ];


    useFocusEffect(
        useCallback(() => {
            //   checkAutoLogin();
            checkUserLogin();
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
            setLoading(true);
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
                    error: value.error,
                    key,
                    quote: value.quote[key], // Extract the nested object directly
                    sort_order: value.sort_order,
                    title: value.title,
                })
            );

            console.log("shippingMethodsArray", shippingMethodsArray[0]?.key);
            setShippingMethodList(shippingMethodsArray);
        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
    };

    const onClickContinueOrder = async () => {
        setScreenLoading(true);
        if (isShippingMethodCode) {
            const response = await checkShippingAddress(isShippingMethodCode, EndPoint?.shippingerror);

            console.log("response shipping method ", response);

            if (response?.error) {
                Alert.alert(
                    '',
                    response?.error,
                    [
                        { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
                    ]
                );
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
                    navigation.navigate("OrderPlace");
                } catch (error) {
                    console.log("error", error.response.data);
                    Alert.alert("", GlobalText?.extrafield_somethingwrong, [{ text: GlobalText?.extrafield_okbtn }]);
                }
            } else {
                Alert.alert(
                    '',
                    isLabel?.selctpaymethod_label,
                    [
                        { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
                    ]
                );

            }

        } else {
            Alert.alert(
                '',
                isLabel?.selctshipmethod_label,
                [
                    { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
                ]
            );

        }
        setScreenLoading(false);
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
                <View style={styles.headerRow}>
                    <Text style={styles.headerTitle}>Choose Shipping Method</Text>
                </View>

                {/* 🔹 Shipping Options */}
                <View style={{ marginTop: 20 }}>
                    {shippingMethods.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            activeOpacity={0.8}
                            onPress={() => setSelectedMethod(method.title)}
                        >
                            <GlassContainer style={styles.shippingCard}>
                                <View>
                                    <Text style={styles.shippingTitle}>{method.title}</Text>
                                    <Text style={styles.shippingPrice}>{method.price}</Text>
                                </View>
                                <View
                                    style={[
                                        styles.radioOuter,
                                        selectedMethod === method.title && styles.radioOuterActive,
                                    ]}
                                >
                                    {selectedMethod === method.title && <View style={styles.radioInner} />}
                                </View>
                            </GlassContainer>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* 🔹 Gift Section */}
                <View style={styles.giftSection}>
                    <View style={styles.giftHeader}>
                        <Text style={styles.giftTitle}>Gift</Text>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/images/gift.png')} />
                    </View>
                    <Text style={styles.sectionSubtitle}>Recipient’s Details</Text>

                    {/* 🔹 Form Fields */}
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
                        />
                    </GlassContainer>

                    <View style={{ marginTop: 20 }}>
                        <GlassContainer padding={4} borderRadius={10} style={{ height: 70, }}>
                            <TextInput
                                placeholder="Custom Message"
                                placeholderTextColor="#fff"
                                style={styles.input}
                            />
                        </GlassContainer>
                    </View>


                    {/* 🔹 Gift Wrap Option */}
                    <TouchableOpacity style={styles.giftWrapRow}>
                        <View style={styles.radioOuterSmall}>
                            <View style={styles.radioInnerSmall} />
                        </View>
                        <Text style={styles.giftWrapText}>Gift Wrap</Text>
                    </TouchableOpacity>
                </View>

                {/* 🔹 Footer */}
                <View style={styles.footer}>

                    <MokaffaPoints />


                    {/* <GlassmorphismButton title="SLIDE TO ORDER" onPress={()=>navigation.navigate("ChooseDeliveryAddress")}/> */}
                    <GlassSwipeButton
                        title="SLIDE TO ORDER"
                        onSwipeStart={() => setScrollEnabled(false)}
                        onSwipeEnd={() => setScrollEnabled(true)}
                        onSwipeSuccess={() => navigation.navigate("ChooseDeliveryAddress")}
                    />

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
        padding: 10
        // color: "#fff",
        // fontSize: 14,
        // paddingHorizontal: 8,
        // paddingVertical: Platform.OS === "android" ? 4 : 4,
    },
    giftWrapRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 18,
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
        marginTop: 40,
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
});

export default memo(ShippingMethod);
