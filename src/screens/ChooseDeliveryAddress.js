import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert, Animated, useWindowDimensions, KeyboardAvoidingView, TextInput } from "react-native";
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
import { useLoading } from "../hooks/LoadingProvider";
import FailedModal from "../components/FailedModal";

const ChooseDeliveryAddress = () => {


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
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);
    const [otherAddresses, setOtherAddresses] = useState([]);
    const defaultAddressArray = isDefaultAddress
        ? [isDefaultAddress]
        : [];

    const { setGlobalLoading } = useLoading();
    const [isGiftWrap, setIsGiftWrap] = useState(false);
    const [giftDetails, setGiftDetails] = useState({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        postCode: '',
        message: ''
    });

    const [failedModal, setFailedModal] = useState(false);
    const [failedModalText, setFailedModalText] = useState(null);
    const [giftErrors, setGiftErrors] = useState({});

    const scrollRef = useRef(null);





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
            setGlobalLoading(true);

            await addBillingAndShippingAddress(
                selectedAddress,
                selectedAddress,
                EndPoint?.checkout_Shippingandpaymentaddress,
                isGiftWrap ? giftDetails : null
            );

            navigation.navigate('ShippingMethod');
        } catch (error) {
            const backendErrors = error.response?.data?.error;

            if (backendErrors) {
                setGiftErrors(backendErrors);
            } else {
                setFailedModalText(GlobalText?.extrafield_somethingwrong);
                setFailedModal(true);
            }
        } finally {
            setGlobalLoading(false);
        }
    };


    // useEffect(() => {
    //     if (isGiftWrap) {
    //         setSelectedAddress(null);
    //     }
    // }, [isGiftWrap]);



    const fetchAllMyAddress = async () => {
        try {

            const result = await getMyAddresses(EndPoint?.address);
            const addresses = result?.response || [];

            const defaultAddr = addresses.find(a => a.defaultaddrstatus);
            const others = addresses.filter(a => !a.defaultaddrstatus);

            setAddressList(addresses);
            setDefaultAddress(defaultAddr);
            setOtherAddresses(others);

            // pre-select default address
            if (defaultAddr) {
                setSelectedAddress(defaultAddr.address_id);
            }

            // if (defaultAddr && !isGiftWrap) {
            //     setSelectedAddress(defaultAddr.address_id);
            // }

            // if (defaultAddr && !selectedAddress && !isGiftWrap) {
            //     setSelectedAddress(defaultAddr.address_id);
            // }

            // console.log("defaultAddress", defaultAddress)
            // setDefaultAddress(defaultAddress);
            // setOtherAddresses(others);
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

    const onClickDeleteAddress = async (addressId) => {
        try {
            setGlobalLoading(true);
            const url = `${BASE_URL}${EndPoint?.address_validateAddressDelete}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
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
                sessionid: sessionId,
                address_id: addressId
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                await fetchAllMyAddress();
                // setAddressList(prev => prev.filter(item => item.address_id !== addressId));
            }
        } catch (error) {
            console.log("error delete address:", error.message);
        } finally {
            setGlobalLoading(false);
        }

    }


    const deleteConfirmationAlert = (addressId) => {
        Alert.alert(
            GlobalText?.text_chkout_delete_address, // Title
            GlobalText?.text_chkout_doyou_delete, // Message
            [
                {
                    text: GlobalText?.extrafield_cancelbtn,
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                },
                {
                    text: GlobalText?.extrafield_okbtn,
                    onPress: () => onClickDeleteAddress(addressId),
                },
            ]
        );
    };


    const closeFailedModal = () => {
        setFailedModal(false);
        setFailedModalText(null);
    }





    return (
        <>
        <BackgroundWrapper>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                {/* <View style={{ flex: 1 }}> */}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{
                        paddingHorizontal: 16,
                        paddingBottom: 20, // important for footer space
                        marginTop: Platform.OS === "ios" ? 60 : 10
                    }}
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





                    {defaultAddressArray.length > 0 && (
                        <>
                            <Text style={styles.sectionTitle}>Default Address</Text>

                            {defaultAddressArray.map(item => (
                                <GlassContainer
                                    key={item.address_id}
                                    style={styles.addressCard}
                                >
                                    <View style={styles.addressRow}>
                                        <TouchableOpacity
                                            onPress={() => setSelectedAddress(item.address_id)}
                                            style={styles.radioCircle}
                                        >
                                            {selectedAddress === item.address_id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </TouchableOpacity>

                                        <Text style={styles.name}>
                                            {item.firstname} {item.lastname}
                                        </Text>

                                        <View style={styles.tagBox}>
                                            <Text style={styles.tagText}>Default</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.addressText}>
                                        {item.address_1} {item.address_2}, {item.city}
                                    </Text>

                                    <View style={styles.btnRow}>
                                        {/* <TouchableOpacity onPress={()=>deleteConfirmationAlert(item?.address_id)} style={styles.boxBtn}>
                                            <Text style={styles.boxBtnText}>Remove</Text>
                                        </TouchableOpacity> */}

                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('EditAddress', { item })
                                            }
                                            style={styles.boxBtn}
                                        >
                                            <Text style={styles.boxBtnText}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </GlassContainer>
                            ))}
                        </>
                    )}


                    {otherAddresses.length > 0 && (
                        <>
                            <Text style={[styles.sectionTitle, { marginTop: 24 }]}>
                                Other Addresses
                            </Text>

                            {otherAddresses.map(item => (
                                <GlassContainer
                                    key={item.address_id}
                                    style={styles.addressCard}
                                >
                                    <View style={styles.addressRow}>
                                        <TouchableOpacity
                                            onPress={() => setSelectedAddress(item.address_id)}
                                            style={styles.radioCircle}
                                        >
                                            {selectedAddress === item.address_id && (
                                                <View style={styles.radioInner} />
                                            )}
                                        </TouchableOpacity>

                                        <Text style={styles.name}>
                                            {item.firstname} {item.lastname}
                                        </Text>

                                        <View style={styles.tagBox}>
                                            <Text style={styles.tagText}>Address</Text>
                                        </View>
                                    </View>

                                    <Text style={styles.addressText}>
                                        {item.address_1} {item.address_2}, {item.city}
                                    </Text>

                                    <View style={styles.btnRow}>
                                        <TouchableOpacity onPress={() => deleteConfirmationAlert(item?.address_id)} style={styles.boxBtn}>
                                            <Text style={styles.boxBtnText}>Remove</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() =>
                                                navigation.navigate('EditAddress', { item })
                                            }
                                            style={styles.boxBtn}
                                        >
                                            <Text style={styles.boxBtnText}>Edit</Text>
                                        </TouchableOpacity>
                                    </View>
                                </GlassContainer>
                            ))}
                        </>
                    )}

                    {/* <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                    >
                        <ScrollView
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ padding: 10 }}
                        > */}
                    {/* 🔹 Gift Section */}
                    <View style={styles.giftSection}>
                        <TouchableOpacity
                            style={styles.giftWrapRow}
                            activeOpacity={0.8}
                            // onPress={() => setIsGiftWrap(prev => !prev)}
                            onPress={() => {
                                setIsGiftWrap(prev => {
                                    const newValue = !prev;

                                    // if (newValue) {
                                    //     // If gift wrap is selected → unselect address
                                    //     setSelectedAddress(null);
                                    // }

                                    return newValue;
                                });
                            }}

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

                                <Text style={{ marginTop: 20, marginBottom: 20, color: "#fff", lineHeight: 25, }}>
                                    Want to make your order a gift?

                                    Activate this option and let us deliver the product to someone special in a beautiful way.

                                    This option is optional; if the order is for you, you can proceed without activating it.
                                </Text>


                                <Text style={styles.sectionSubtitle}>Recipient’s Details</Text>

                                <GlassContainer padding={4} borderRadius={10}>
                                    <TextInput
                                        placeholder="Full Name"
                                        placeholderTextColor="#fff"
                                        value={giftDetails.fullName}
                                        onChangeText={(text) => {
                                            setGiftDetails(prev => ({ ...prev, fullName: text }));
                                            setGiftErrors(prev => ({ ...prev, gift_name: null }));
                                        }}
                                        style={styles.input}
                                    />
                                </GlassContainer>

                                {giftErrors?.gift_name && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {GlobalText?.[giftErrors.gift_name] || giftErrors.gift_name}
                                    </Text>
                                )}

                                <GlassContainer padding={4} borderRadius={10}>
                                    <TextInput
                                        placeholder="Phone Number"
                                        placeholderTextColor="#fff"
                                        keyboardType="phone-pad"
                                        value={giftDetails.phone}
                                        onChangeText={(text) => {
                                            setGiftDetails(prev => ({ ...prev, phone: text }));
                                            setGiftErrors(prev => ({ ...prev, gift_phone: null }));
                                        }}

                                        style={styles.input}
                                    />
                                </GlassContainer>

                                {giftErrors?.gift_phone && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {GlobalText?.[giftErrors.gift_phone] || giftErrors.gift_phone}
                                    </Text>
                                )}


                                <GlassContainer padding={4} borderRadius={6} style={{}}>
                                    <TextInput
                                        placeholder="Address"
                                        placeholderTextColor="#fff"
                                        style={styles.input}
                                        value={giftDetails.address}
                                        onChangeText={(text) => {
                                            setGiftDetails(prev => ({ ...prev, address: text }));
                                            setGiftErrors(prev => ({ ...prev, gift_address_1: null }));
                                        }}

                                        multiline
                                    />
                                </GlassContainer>

                                {giftErrors?.gift_address_1 && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {GlobalText?.[giftErrors.gift_address_1] || giftErrors.gift_address_1}
                                    </Text>
                                )}


                                <GlassContainer padding={4} borderRadius={6}>
                                    <TextInput
                                        placeholder="City"
                                        placeholderTextColor="#fff"
                                        value={giftDetails.city}
                                        onChangeText={(text) => {
                                            setGiftDetails(prev => ({ ...prev, city: text }));
                                            setGiftErrors(prev => ({ ...prev, gift_city: null }));
                                        }}

                                        style={styles.input}
                                    />
                                </GlassContainer>

                                {giftErrors?.gift_city && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {GlobalText?.[giftErrors.gift_city] || giftErrors.gift_city}
                                    </Text>
                                )}


                                <GlassContainer padding={4} borderRadius={6}>
                                    <TextInput
                                        placeholder="Post Code"
                                        placeholderTextColor="#fff"
                                        value={giftDetails.postCode}
                                        onChangeText={(text) => {
                                            setGiftDetails(prev => ({ ...prev, postCode: text }));
                                            setGiftErrors(prev => ({ ...prev, gift_postcode: null }));
                                        }}

                                        keyboardType="numeric"
                                        style={styles.input}
                                    />
                                </GlassContainer>

                                {giftErrors?.gift_postcode && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {GlobalText?.[giftErrors.gift_postcode] || giftErrors.gift_postcode}
                                    </Text>
                                )}


                                <View style={{}}>
                                    <GlassContainer padding={4} borderRadius={10} style={{ height: 70 }}>
                                        <TextInput
                                            placeholder="Custom Message"
                                            placeholderTextColor="#fff"
                                            style={styles.input}
                                            value={giftDetails.message}
                                            onChangeText={(text) => {
                                                setGiftDetails(prev => ({ ...prev, message: text }));
                                                setGiftErrors(prev => ({ ...prev, gift_message: null }));
                                            }}
                                        />
                                    </GlassContainer>
                                </View>

                                {giftErrors?.gift_message && (
                                    <Text style={{ color: 'red', marginTop: 4 }}>
                                        {GlobalText?.[giftErrors.gift_message] || giftErrors.gift_message}
                                    </Text>
                                )}

                            </>
                        )}
                    </View>
                    {/* </ScrollView>
                    </KeyboardAvoidingView> */}




                </ScrollView>

                {/* Bottom Section */}
                    <View style={styles.footer}>
                        <View style={styles.footerTopRow}>
                            <Text style={styles.pointsText}>Earn 157 Mokafaa Points</Text>
                            <View style={styles.horizontalLine} />
                        </View>

                        <GlassmorphismButton
                            title="PROCEED"
                            // disabled={
                            //     isGiftWrap &&
                            //     (!giftDetails.fullName || !giftDetails.phone)
                            // }

                            onPress={() => onClickCheckoutContinueBtn()}

                        />

                        <View style={styles.footerBottomRow}>
                            <Text style={styles.totalText}>₹16669.25</Text>
                            <Text style={styles.itemText}>1 Item</Text>
                        </View>
                    </View>
                {/* </View> */}

                <FailedModal
                    isModal={failedModal}
                    isSuccessMessage={failedModalText}
                    onClickClose={closeFailedModal}
                    handleCloseModal={closeFailedModal}
                />
            </KeyboardAvoidingView>
        </BackgroundWrapper>
        </>
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
        // marginTop: 40,
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
    totalText: {
        color: "#fff",
        fontWeight: "600",
        marginLeft: 10
    },
    itemText: {
        color: "#fff",
        marginRight: 5
    },
    giftSection: {
        marginTop: 10,
        marginBottom: 10
    },
    giftWrapRow: {
        flexDirection: "row",
        alignItems: "center",
        // marginBottom: 30,
        marginLeft: 0
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
        fontSize: 19,
        marginLeft: 8,
        fontWeight: 'bold'
    },
    giftHeader: {
        flexDirection: "row",
        alignItems: "center",   // vertically center everything
        gap: 8,                 // cleaner spacing
        marginLeft: 0,
        marginTop: 20
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
});
