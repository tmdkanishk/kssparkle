import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, Dimensions, BackHandler, useWindowDimensions } from "react-native";
import GlassContainer from "../components/customcomponents/GlassContainer";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import CustomActivity from "../components/CustomActivity";
import { useCustomContext } from "../hooks/CustomeContext";
import { API_KEY, BASE_URL } from "../utils/config";
import { _retrieveData } from "../utils/storage";
import axios, { HttpStatusCode } from "axios";
import { checkAutoLogin } from "../utils/helpers";
import NotificationAlert from "../components/NotificationAlert";
import InAppReview from "react-native-in-app-review"; // 👈 Handles both iOS & Android automatically
import { trackPurchase } from "../services/analytics";

const OrderSuccessScreen = ({ navigation, route }) => {
    const { orderId, orderStatusId } = route.params;
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors, EndPoint, GlobalText } = useCustomContext();

    const [loading, setLoading] = useState();
    const [isLabel, setLabel] = useState();
    // const [feedbackScanner, setFeedbackScanner] = useState();

    useEffect(() => {
        checkAutoLogin();
        fetchOrderConfirmationText();
        if (orderId) {
            trackPurchase({
                orderId,
                screenName: 'OrderSuccessScreen',
            }).catch(() => {});
        }
    }, []);

    useEffect(() => {
        const backAction = () => {
            navigation.navigate("Home");
            return true;
        };
        const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
        return () => backHandler.remove();
    }, [navigation]);

     // 👈 Created a separate function to safely handle store reviews
    const triggerStoreReviewFlow = async () => {
        const isAvailable = InAppReview.isAvailable();
        
        if (!isAvailable) {
            console.log("In-app review not supported on this device/environment.");
            return;
        }

        try {
            const hasFlowFinishedSuccessfully = await InAppReview.RequestInAppReview();
            console.log("In-App Review triggered successfully:", hasFlowFinishedSuccessfully);
        } catch (error) {
            console.error("In-App Review Error:", error);
        }
    };

    const fetchOrderConfirmationText = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.order}`;
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
                customer_id: user ? user : null,
                sessionid: sessionId,
                ...(orderStatusId && { order_status_id: Number(orderStatusId) }), // 👈 cast to number
                ...(orderId && { order_id: Number(orderId) }),                     // 👈 cast to number
            };

            const response = await axios.post(url, body, { headers });

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response?.data?.text);
                // setFeedbackScanner(response?.data?.forea_review_qr_image);
                 // 👈 Triggers immediately after your successful API call finishes
                triggerStoreReviewFlow(); 
            }
        } catch (error) {
            alert(GlobalText?.extrafield_somethingwrong);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <CustomActivity />;

    return (
        <>
            <BackgroundWrapper>
                <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>

                    <View style={{ marginVertical: 10 }}>
                        <Text style={{
                            color: "#fff",
                            fontSize: 20,
                            fontWeight: "400",
                            textAlign: 'center'
                        }}>
                            {isLabel?.orderconfirmpagename_label || "Order Successful"}
                        </Text>
                    </View>

                    {/* Main Success Card */}
                    <GlassContainer>
                        <View
                            borderRadius={30}
                            paddingVertical={35}
                            paddingHorizontal={25}
                            style={{
                                width: "100%",
                                alignSelf: "center",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            {/* Success Icon */}
                            <View borderRadius={25} padding={35} style={{ marginBottom: 25 }}>
                                <Image
                                    source={require("../assets/images/success_tick.png")}
                                    style={{ width: 280, height: 280 }}
                                    resizeMode="contain"
                                />
                            </View>

                            {/* Heading */}
                            <Text style={{
                                color: "#fff",
                                fontSize: 22,
                                fontWeight: "600",
                                textAlign: "center",
                                marginTop: 10,
                            }}>
                                {isLabel?.orderconfirmthankyou_label || "Thank you for Ordering!"}
                            </Text>

                            {/* Order ID */}
                            <Text style={{
                                color: "#fff",
                                fontSize: 15,
                                textAlign: "center",
                                marginTop: 8,
                            }}>
                                {isLabel?.orderconfirmorderno_label || "Order No"}: {orderId}
                            </Text>

                            {/* Subtitle */}
                            {/* <Text style={{
                                color: "#fff",
                                fontSize: 15,
                                textAlign: "center",
                                marginTop: 8,
                                lineHeight: 22,
                            }}>
                                Your order has been placed!{"\n"}
                                You will receive an email shortly.
                            </Text> */}
                        </View>
                    </GlassContainer>

                    <View style={{ marginTop: 15 }} />

                    {/* Continue Shopping Button */}
                    <GlassContainer
                        borderRadius={15}
                        padding={0.1}
                        style={{ width: "100%", alignSelf: "center", alignItems: "center" }}
                    >
                        <TouchableOpacity
                            onPress={() => navigation.replace("Home")}
                            style={{ width: width * 0.9, alignItems: "center", justifyContent: 'center', padding: 12 }}
                        >
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "300", textAlign: "center" }}>
                                {isLabel?.orderconfirmcntbtn_label || "Continue Shopping"}
                            </Text>
                        </TouchableOpacity>
                    </GlassContainer>

                    {/* Feedback QR */}
                    {/* {feedbackScanner && (
                        <View style={{ width: '100%', height: 150, marginVertical: 20 }}>
                            <Image
                                source={{ uri: feedbackScanner }}
                                style={{ width: '100%', height: '100%', resizeMode: 'contain' }}
                            />
                        </View>
                    )} */}

                </View>
            </BackgroundWrapper>
            <NotificationAlert />
        </>
    );
};

export default OrderSuccessScreen;