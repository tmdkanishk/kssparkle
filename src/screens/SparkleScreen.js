import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, FlatList, Dimensions, Platform } from "react-native";
import GlassContainer from "../components/customcomponents/GlassContainer";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import BottomNav from "../components/customcomponents/BottomNav";


const SparkleScreen = ({navigation}) => {
    const [activeTab, setActiveTab] = useState("credits");
    const [activeFilter, setActiveFilter] = useState("pending");
    const screenWidth = Dimensions.get('window').width;
    const screenHeight = Dimensions.get('window').height;

    const data = [
        { title: "Order Fee", date: "Oct, 25 2025", amount: "-₹162.25" },
        { title: "Cashback", date: "Oct, 25 2025", amount: "+₹200.25" },
        { title: "Cashback", date: "Oct, 25 2025", amount: "+₹200.25" },
        { title: "Cashback", date: "Oct, 25 2025", amount: "+₹200.25" },
        { title: "Cashback", date: "Oct, 25 2025", amount: "+₹200.25" },
    ];

    return (
        <ScrollView>
            <BackgroundWrapper>

                {/* Header */}
                <View style={{ marginTop: 40, marginHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: Platform.OS === "ios" ? 60 : 30 }}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                    </TouchableOpacity>
                    <Text style={{
                        color: "#fff",
                        fontSize: 16,
                        fontWeight: "400",
                    }}>Sparkle</Text>
                    <View style={{ width: 4 }} />
                </View>


                {/* Balance Card */}
                <GlassContainer style={{ marginTop: 10, padding: Platform.OS === "ios" ? 23 : 20, width:'97%' }} padding={0.1}>
                    <Text style={{ color: "#fff", fontSize: 15 }}>Available Balance</Text>
                    <Text style={{ color: "#fff", fontSize: 17, fontWeight: "700", }}>₹0.00</Text>
                </GlassContainer>

                {/* Redeem Section */}
                <GlassContainer style={{ flexDirection: "row", justifyContent: 'space-evenly', alignItems:"center", width: screenWidth * 0.82, marginLeft:20 }} padding={0.1}>

                    <TouchableOpacity onPress={()=>{navigation.navigate("OrderSuccessScreen")}} style={{ alignItems: "center", paddingTop: 0 }}>
                        <GlassContainer style={{ width: 60, height: 60, justifyContent: "center", alignItems: "center" }} borderRadius={90} padding={1}>
                            <Image
                                source={require("../assets/images/mokafaa.png")}
                                style={{ width: 40, height: 25, resizeMode: "contain" }}  // 👈 IMPORTANT
                            />
                        </GlassContainer>

                        <Text style={{ color: "#fff", fontSize: 12, textAlign: "center", marginTop: 0 }}>
                            Redeem{"\n"}Mokafaa Points
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={{ alignItems: "center", padding: 10, paddingTop: 20, }}>
                        <GlassContainer style={{ width: 32, height: 32, justifyContent: "center", alignItems: "center" }} borderRadius={40} padding={15}>
                            <Image source={require("../assets/images/giftcard.png")} style={{ width: 25, height: 25 }} />
                        </GlassContainer>
                        <Text style={{ color: "#fff", fontSize: 12, marginTop: 10, textAlign: 'center' }}>Redeem Gift{"\n"}Card</Text>
                    </TouchableOpacity>

                </GlassContainer>

                <GlassContainer style={{ paddingVertical: 6, width: '88%', alignSelf: 'center' }} padding={0.1}>

                    {/* Top Tabs */}
                    <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10, marginTop: 10, width: '60%', alignItems: 'center', alignSelf: 'center' }}>
                        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>Transfers</Text>
                        <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500" }}>Credits</Text>
                    </View>

                    {/* Divider Line - STRETCHES NOW */}
                    <View style={{ height: 1.8, backgroundColor: "#fff", opacity: 0.7, borderRadius: 10 }} />

                    {/* Filters */}
                    <View style={{ flexDirection: "row", gap: 10, marginTop: 8 }}>
                        <GlassContainer borderRadius={30} paddingVertical={8} paddingHorizontal={16}>
                            <Text style={{ color: "#fff", fontSize: 14 }}>Pending & Expiring</Text>
                        </GlassContainer>
                        <GlassContainer borderRadius={15} paddingVertical={5} paddingHorizontal={6}>
                            <Text style={{ color: "#fff", fontSize: 14 }}>All</Text>
                        </GlassContainer>
                    </View>

                    <View style={{ marginTop: 18, width: "100%" }}>
                        <FlatList
                            data={data}
                            scrollEnabled={false}
                            ItemSeparatorComponent={() => <View style={{ height: 12 }} />} // spacing between cards
                            renderItem={({ item }) => <>

                                <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                                    {/* Left side */}
                                    <View>
                                        <Text style={{ color: "#fff", fontSize: 17, fontWeight: "500" }}>{item.title}</Text>
                                        <Text style={{ color: "#ddd", fontSize: 13, marginTop: 2 }}>{item.date}</Text>
                                    </View>

                                    {/* Right side */}
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                                        <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>{item.amount}</Text>
                                        <Image source={require("../assets/images/dropdown.png")} style={{ width: 14, height: 14, tintColor: "#fff" }} />
                                    </View>

                                </View>

                            </>}
                        />
                    </View>

                </GlassContainer>


                <View style={{padding:10}}>
                    {/* Footer Note */}
                <Text style={{ color: "#aaa", fontSize: 12, lineHeight: 18, marginLeft:25, width:"90%", color:'#fff'}}>
                    In order to view your historical noonpay transactions, please visit https://account.noon.com/credits
                </Text>

                <TouchableOpacity style={{ alignSelf: "flex-end", marginTop: 10, marginRight:20 }}>
                    <Text style={{ color: "#fff", fontWeight: "600" }}>DISMISS</Text>
                </TouchableOpacity>
                </View>



                <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <BottomNav navigation={navigation} />
                </View>


            </BackgroundWrapper>
        </ScrollView>
    );
};

export default SparkleScreen;
