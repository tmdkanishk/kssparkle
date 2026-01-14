import React, { useCallback, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, Animated, useWindowDimensions } from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import GlassContainer from "../components/customcomponents/GlassContainer";
import GlassButton from "../components/customcomponents/GlassButton";
// import Ionicons from "react-native-vector-icons/Ionicons";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import GlassmorphismButton from "../components/customcomponents/GlassmorphismButton";
import { Platform } from "react-native";
import { useCustomContext } from "../hooks/CustomeContext";
import { API_KEY, BASE_URL } from "../utils/config";
import { _retrieveData } from "../utils/storage";
import axios, { HttpStatusCode } from "axios";
import { checkAutoLogin } from "../utils/helpers";
import { useLanguageCurrency } from "../hooks/LanguageCurrencyContext";
import { addBillingAndShippingAddress } from "../services/addBillingAndShippingAddress";
import { getMyAddresses } from "../services/getMyAddresses";

const ChooseDeliveryAddress = () => {

    const defaultAddress = {
        id: 1,
        name: "Customer Name",
        tag: "Home",
        address: "123, MG Road, Mumbai, Maharashtra - 400001",
        mobile: "+91 9876543210",
    };

    const otherAddresses = [
        {
            id: 2,
            name: "Customer Name",
            tag: "Home",
            address: "456, Park Avenue, Pune, Maharashtra - 411001",
            mobile: "+91 9998887777",
        },
        {
            id: 3,
            name: "Customer Name",
            tag: "Home",
            address: "789, Lake View, Bangalore, Karnataka - 560001",
            mobile: "+91 9988776655",
        },
    ];


    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [differentShipping, setDifferentShipping] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectShippingAddress, setSelectShippingAddress] = useState();
    const [selectBillingAddress, setSelectBillingAddress] = useState();
    const [addressType, setAddressType] = useState();
    const [isAddressList, setAddressList] = useState();
    const [isDefaultAddress, setDefaultAddress] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;
    const navigation = useNavigation();
    const [selectedAddress, setSelectedAddress] = useState(1);
    const [screenLoading, setScreenLoading] = useState(false);

    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            checkUserLogin();
            fetchAllMyAddress();
            fetchCheckOutText();
        }, [language, currency, navigation])
    )

    const checkUserLogin = async () => {
        const data = await _retrieveData("CUSTOMER_ID");
        if (data == null) {
            navigation.replace('Login');
            return;
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value)
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const onChangeBilliingAddress = () => {
        setAddressType(1);
        setShowModal(true)
    }

    const onChangeShippinigAddress = () => {
        setAddressType(2)
        setShowModal(true)
    }

    const onSelectAddress = (selectedAddress) => {
        if (addressType === 1) {
            setSelectBillingAddress(selectedAddress);
            setShowModal(false);
        } else {
            setSelectShippingAddress(selectedAddress);
            setShowModal(false);
        }
    }

    const onClickCheckoutContinueBtn = async () => {
        try {
            // setLoading(true);
            const shippingAddressId = selectShippingAddress?.address_id
            const paymentAddressId = selectBillingAddress?.address_id
            const result = await addBillingAndShippingAddress(shippingAddressId, paymentAddressId, EndPoint?.checkout_Shippingandpaymentaddress);
            console.log("save shipping and billing address :", result);
            navigation.navigate('Payment');
        } catch (error) {
            console.log("error", error.response.data);
            alert(GlobalText?.extrafield_somethingwrong);
        } finally {
            setLoading(false);
        }
    }

    const fetchAllMyAddress = async () => {
        try {

            const result = await getMyAddresses(EndPoint?.address);
            console.log("result getMyAddresses:", result);
            setAddressList(result?.response);
            const addresses = result?.response;
            const defaultAddress = addresses.find(addr => addr.defaultaddrstatus === true);
            setDefaultAddress(defaultAddress);
            setSelectShippingAddress(defaultAddress);
            setSelectBillingAddress(defaultAddress);
        } catch (error) {
            console.log("error:", error.response.data);
        }
    }

    const fetchCheckOutText = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.checkout}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData('USER');
            const sessionId = await _retrieveData('SESSION_ID');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: 'en-gb',
                currency: cur?.code,
                customer_id: user ? user[0]?.customer_id : null,
                sessionid: sessionId
            }

            const response = await axios.post(url, body, { headers: headers });

            console.log("fetchCheckOutText response :", response?.data);

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data?.text);
            }

        } catch (error) {
            // console.log("errorxsacds", error.response.data);
            alert(GlobalText?.extrafield_somethingwrong);
        } finally {
            setLoading(false);
        }
    }


    return (
        <BackgroundWrapper>

            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20, marginTop: Platform.OS === "ios" ? 60 : 10 }}
                showsVerticalScrollIndicator={false}
            >
                <TouchableOpacity style={{ marginTop: 20, marginLeft: 10 }} onPress={() => navigation.goBack()}>
                    <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                </TouchableOpacity>
                {/* Header */}
                <View style={styles.header}>
                    {/* <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity> */}
                    <Text style={styles.title}>Choose Delivery Address</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('AddNewAddress') }} style={styles.addNewBtn}>
                        <Text style={styles.addNewText}>Add New</Text>
                    </TouchableOpacity>
                </View>

                {/* Default Address */}
                <Text style={styles.sectionTitle}>Default Address</Text>
                <GlassContainer style={styles.addressCard}>
                    <View style={styles.addressRow}>
                        <TouchableOpacity
                            onPress={() => setSelectedAddress(defaultAddress.id)}
                            style={styles.radioCircle}
                        >
                            {selectedAddress === defaultAddress.id && <View style={styles.radioInner} />}
                        </TouchableOpacity>
                        <Text style={styles.name}>{isDefaultAddress?.firstname}</Text>
                        <View style={styles.tagBox}>
                            <Text style={styles.tagText}>{defaultAddress.tag}</Text>
                        </View>
                    </View>

                    <Text style={styles.addressText}>{isDefaultAddress?.address_1} {isDefaultAddress?.address_2}</Text>
                    <Text style={styles.mobileText}>Mobile: {defaultAddress.mobile}</Text>

                    <View style={styles.btnRow}>
                        <TouchableOpacity style={styles.boxBtn}>
                            <Text style={styles.boxBtnText}>Remove</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.boxBtn}>
                            <Text style={styles.boxBtnText}>Edit</Text>
                        </TouchableOpacity>
                    </View>
                </GlassContainer>

                {/* Other Addresses */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Other Address</Text>
                {otherAddresses.map((item) => (
                    <GlassContainer key={item.id} style={styles.addressCard}>
                        <View style={styles.addressRow}>
                            <TouchableOpacity
                                onPress={() => setSelectedAddress(item.id)}
                                style={styles.radioCircle}
                            >
                                {selectedAddress === item.id && <View style={styles.radioInner} />}
                            </TouchableOpacity>
                            <Text style={styles.name}>{item.name}</Text>
                            <View style={styles.tagBox}>
                                <Text style={styles.tagText}>{item.tag}</Text>
                            </View>
                        </View>

                        <Text style={styles.addressText}>{item.address}</Text>
                        <Text style={styles.mobileText}>Mobile: {item.mobile}</Text>

                        <View style={styles.btnRow}>
                            <TouchableOpacity style={styles.boxBtn}>
                                <Text style={styles.boxBtnText}>Remove</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.boxBtn}>
                                <Text style={styles.boxBtnText}>Edit</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassContainer>
                ))}

                {/* Bottom Section */}
                <View style={styles.footer}>
                    <View style={styles.footerTopRow}>
                        <Text style={styles.pointsText}>Earn 157 Mokafaa Points</Text>
                        <View style={styles.horizontalLine} />
                    </View>

                    <GlassmorphismButton title="PROCEED" onPress={() => navigation.navigate("ChoosePaymentMethod")} />

                    <View style={styles.footerBottomRow}>
                        <Text style={styles.totalText}>₹16669.25</Text>
                        <Text style={styles.itemText}>1 Item</Text>
                    </View>
                </View>
            </ScrollView>

        </BackgroundWrapper>
    );
};

export default ChooseDeliveryAddress;

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
        marginTop: Platform.OS === "ios" ? 15 : 0
    },
    title: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "700",
    },
    addNewBtn: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    addNewText: {
        color: "#fff",
        fontSize: 13,
    },
    sectionTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 8,
        marginLeft: 15
    },
    addressCard: {
        padding: 16,
        marginTop: 6,
        borderRadius: 20,
    },
    addressRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 8,
    },
    radioCircle: {
        height: 18,
        width: 18,
        borderRadius: 9,
        borderWidth: 1.5,
        borderColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
    radioInner: {
        height: 8,
        width: 8,
        borderRadius: 4,
        backgroundColor: "#fff",
    },
    name: {
        color: "#fff",
        fontWeight: "600",
        flex: 1,
    },
    tagBox: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    tagText: {
        color: "#fff",
        fontSize: 12,
    },
    addressText: {
        color: "#ddd",
        fontSize: 13,
        marginBottom: 4,
    },
    mobileText: {
        color: "#ddd",
        fontSize: 13,
    },
    btnRow: {
        flexDirection: "row",
        gap: 10,
        marginTop: 10,
    },
    boxBtn: {
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 6,
        paddingHorizontal: 16,
        paddingVertical: 4,
    },
    boxBtnText: {
        color: "#fff",
        fontSize: 13,
    },
    bottomSection: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    priceText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    itemCount: {
        color: "#fff",
        fontSize: 12,
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
