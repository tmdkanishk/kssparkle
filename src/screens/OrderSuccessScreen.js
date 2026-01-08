import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import GlassContainer from "../components/customcomponents/GlassContainer"; // adjust import
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";

const OrderSuccessScreen = ({ navigation }) => {
    return (
        <BackgroundWrapper>
            <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 20 }}>

                <View style={{ marginTop: 0, marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                    </TouchableOpacity>
                    <Text style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "400",
                    }}>Order Sucessfull</Text>
                    <View style={{ width: 4 }} />
                </View>


                {/* Main Success Card */}
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
                    <View
                        borderRadius={25}
                        padding={35}
                        style={{ marginBottom: 25 }}
                    >
                        <Image
                            source={require("../assets/images/success_tick.png")} // your green tick icon
                            style={{ width: 280, height: 280 }}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Heading */}
                    <Text
                        style={{
                            color: "#fff",
                            fontSize: 22,
                            fontWeight: "600",
                            textAlign: "center",
                            marginTop: 10,
                        }}
                    >
                        Thankyou for Ordering!
                    </Text>

                    {/* Subtitle */}
                    <Text
                        style={{
                            color: "#ddd",
                            fontSize: 15,
                            textAlign: "center",
                            marginTop: 8,
                            lineHeight: 22,
                            color:'#fff'
                        }}
                    >
                        Your order has been placed!
                        {"\n"}
                        You will receive an email shortly.
                    </Text>

                    {/* Order Tracking Link */}
                    <TouchableOpacity
                        onPress={() => navigation.navigate("OrderTracking")}
                        style={{ marginTop: 28 }}
                    >
                        <Text
                            style={{
                                color: "#fff",
                                fontSize: 16,
                                textDecorationLine: "underline",
                            }}
                        >
                            Order Tracking
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Continue Shopping Button */}
                <GlassContainer
                    borderRadius={15}
                    padding={0.1}
                    // paddingVertical={18}
                    style={{
                        width: "100%",
                        alignSelf: "center",
                        //   marginTop: 24,
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity onPress={() => navigation.navigate("Home")} style={{ width: 300, alignItems: "center", justifyContent: 'center', padding: 12 }}>
                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "300", textAlign: "center " }}>
                            Continue Shopping
                        </Text>
                    </TouchableOpacity>
                </GlassContainer>
            </View>
        </BackgroundWrapper>
    );
};

export default OrderSuccessScreen;
