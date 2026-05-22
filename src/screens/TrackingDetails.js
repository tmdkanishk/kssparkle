// import React, { useEffect, useState } from "react";
// import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform } from "react-native";
// import GlassContainer from "../components/customcomponents/GlassContainer";
// import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
// import { useNavigation } from "@react-navigation/native";
// import { Dimensions } from 'react-native';
// import { getTrackingInfo } from "../services/getTrackingInfo";
// import { useCustomContext } from "../hooks/CustomeContext";
// import { useLoading } from "../hooks/LoadingProvider";
// import StepIndicator from 'react-native-step-indicator';




// const TrackingDetails = ({ navigation, route }) => {
//     // const navigation = useNavigation();
//     const screenWidth = Dimensions.get('window').width;
//     const screenHeight = Dimensions.get('window').height;
//     const { Colors, EndPoint, GlobalText } = useCustomContext();
//     const { setGlobalLoading } = useLoading();
//     const { orderId } = route?.params;
//     const [trackingData, setTrackingData] = useState([]);
//     const [currentStep, setCurrentStep] = useState(0);
//     const [trackingDetails, setTrackingDetails] = useState();

//     useEffect(() => {
//         fetchTrackingData()
//     }, [])

//     const parseSMSADate = (dateStr) => {
//         if (!dateStr) return 0;

//         const months = {
//             Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
//             Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
//         };

//         const parts = dateStr.split(" ");
//         // ["15", "Mar", "2026", "21:57"]

//         const day = parseInt(parts[0]);
//         const month = months[parts[1]];
//         const year = parseInt(parts[2]);

//         const [hour, minute] = parts[3].split(":").map(Number);

//         return new Date(year, month, day, hour, minute).getTime();
//     };

//     // ✅ NORMALIZE DATA (KEY FIX)
//     const normalizeTrackingData = (result) => {
//         const shippingCode = result?.shipping_code;

//         console.log("SHIPPING CODE:", shippingCode);

//         // ✅ ARAMEX
//         if (shippingCode === "aramex.aramex") {
//             const events = result?.response?.TrackingResults?.[0]?.Value || [];

//             return events.map(item => ({
//                 status: item.UpdateCode,
//                 description: item.UpdateDescription,
//                 date: parseInt(item.UpdateDateTime.match(/\d+/)[0]),
//             }));
//         }

//         // ✅ SMSA
//         if (shippingCode === "smsa.smsa_5") {
//             const events = result?.response?.Tracking || [];

//             return events.map(item => ({
//                 status: item.Activity,
//                 description: item.Details,
//                 date: parseSMSADate(item.Date),
//             }));
//         }

//         return [];
//     };


//     const fetchTrackingData = async () => {
//         try {
//             setGlobalLoading(true);

//             const result = await getTrackingInfo(
//                 EndPoint?.tracking_info,
//                 orderId
//             );

//             console.log("API RESULT:", result);
//             setTrackingDetails(result)

//             const normalizedEvents = normalizeTrackingData(result);

//             console.log("NORMALIZED EVENTS:", normalizedEvents);

//             setTrackingData(normalizedEvents);



//             // const events =
//             //     result?.response?.TrackingResults?.[0]?.Value || [];

//             // setTrackingData(events);

//             // const step = getStepIndex(events);
//             // setCurrentStep(step);

//         } catch (error) {
//             console.log("error", error?.response?.data);
//         } finally {
//             setGlobalLoading(false);
//         }
//     };


//     // ✅ GET LATEST EVENT (WORKS FOR ALL COURIERS)
//     const getLatestEvent = (events) => {
//         if (!events?.length) return null;

//         return [...events].sort((a, b) => b.date - a.date)[0];
//     };

//     // ✅ STEP MAPPING (BOTH COURIERS)
//     const getStepIndex = (events) => {

//         console.log("EVENTS:", events);

//         const latestEvent = getLatestEvent(events);

//         console.log("LATEST EVENT:", latestEvent);

//         const status = latestEvent?.status;

//         console.log("LATEST STATUS:", status);

//         if (!status) return 0;

//         // ✅ ARAMEX
//         if (status === "SH006") return 4;
//         if (["SH110", "SH533", "SH164"].includes(status)) return 3;
//         if (["SH022", "SH001", "SH047"].includes(status)) return 2;
//         if (["SH012", "SH314"].includes(status)) return 1;
//         if (status === "SH014") return 0;

//         // ✅ SMSA (TEXT BASED)
//         const upperStatus = status.toUpperCase();

//         if (upperStatus.includes("DELIVERED") || upperStatus.includes("PROOF")) return 4;
//         if (upperStatus.includes("OUT") || upperStatus.includes("AWAITING")) return 3;
//         if (upperStatus.includes("HUB") || upperStatus.includes("DEPARTED")) return 2;
//         if (upperStatus.includes("PICKED")) return 1;
//         if (upperStatus.includes("DATA")) return 0;

//         return 0;
//     };

//     // ✅ UPDATE STEP WHEN DATA CHANGES
//     useEffect(() => {
//         if (trackingData?.length) {
//             console.log("USE EFFECT RUNNING");

//             const step = getStepIndex(trackingData);

//             console.log("FINAL STEP:", step);

//             setCurrentStep(step);
//         }
//     }, [trackingData]);

//     const labels = [
//         trackingDetails?.created,
//         trackingDetails?.pickup,
//         trackingDetails?.intransit,
//         trackingDetails?.out_of_delivery,
//          trackingDetails?.delivered
//     ];


//     //     useEffect(() => {
//     //           console.log("USE EFFECT RUNNING");
//     //         if (trackingData.length) {
//     //             const step = getStepIndex(trackingData);
//     //             setCurrentStep(step);

//     //             console.log("trackingData", trackingData);
//     // console.log("currentStep", currentStep);
//     //         }
//     //     }, [trackingData]);



//     // const labels = [
//     //     "Created",
//     //     "Picked Up",
//     //     "In Transit",
//     //     "Out for Delivery",
//     //     "Delivered"
//     // ];

//     //     const getLatestEvent = (events) => {
//     //     if (!events?.length) return null;

//     //     return [...events].sort((a, b) => {
//     //         const dateA = parseInt(a.UpdateDateTime.match(/\d+/)[0]);
//     //         const dateB = parseInt(b.UpdateDateTime.match(/\d+/)[0]);
//     //         return dateB - dateA; // latest first
//     //     })[0];
//     // };

//     // const getStepIndex = (events) => {
//     // console.log("EVENTS BEFORE:", events);
//     // const latestEvent = getLatestEvent(events);
//     // console.log("LATEST EVENT:", latestEvent);
//     //     const latestCode = latestEvent?.UpdateCode;

//     //     console.log("LATEST CODE:", latestCode);

//     //     switch (latestCode) {
//     //         case "SH014":
//     //             return 0;

//     //         case "SH012":
//     //         case "SH314":
//     //             return 1;

//     //         case "SH022":
//     //         case "SH001":
//     //         case "SH047":
//     //             return 2;

//     //         case "SH110":
//     //         case "SH533":
//     //         case "SH164":
//     //             return 3;

//     //         case "SH006":
//     //             return 4;

//     //         default:
//     //             return 0;
//     //     }
//     // };

//     const customStyles = {
//         stepIndicatorSize: 25,
//         currentStepIndicatorSize: 30,
//         labelSize: 13,
//         labelColor: "#fff",
//         //   currentStepLabelColor: "#2E86DE",
//         separatorStrokeWidth: 2,
//         stepStrokeWidth: 2,
//         stepStrokeCurrentColor: "#27AE60",
//         stepStrokeFinishedColor: "#27AE60",
//         stepStrokeUnFinishedColor: "#aaaaaa",
//         separatorFinishedColor: "#27AE60",
//         separatorUnFinishedColor: "#aaaaaa",
//         stepIndicatorFinishedColor: "#27AE60",
//         stepIndicatorUnFinishedColor: "#ffffff",
//         stepIndicatorCurrentColor: "#ffffff",
//     };

    




//     return (
//         // <LinearGradient
//         //   colors={["#101010", "#1C1C1C"]}
//         //   style={styles.background}
//         // >
//         <BackgroundWrapper>
//             <ScrollView contentContainerStyle={[styles.container, { marginTop: Platform.OS === "ios" ? 40 : 10 }]}>
//                 <View style={{ marginTop: 10, marginHorizontal: Platform.OS === "ios" ? 20 : 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                         <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
//                     </TouchableOpacity>
//                     <Text style={{ color: "#fff", fontSize: 16, fontWeight: "400" }}>{trackingDetails?.trackingdetail}</Text>
//                     <View style={{ width: 4 }} />
//                 </View>


//                 <GlassContainer>
//                     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", }}>
//                         <Text style={{ color: "#fff", fontSize: 14, fontWeight: "500", }}>{trackingDetails?.orderid} {orderId}</Text>
//                         <TouchableOpacity style={{ padding: 6, borderRadius: 8, backgroundColor: "rgba(255,255,255,0.1)", }}>
//                             <Image
//                                 source={require("../assets/images/copy.png")}
//                                 style={{ width: 18, height: 18, tintColor: "#fff", }}
//                             />
//                         </TouchableOpacity>
//                     </View>
//                 </GlassContainer>

//                 <View style={{ marginTop: 20 }}>

//                     <StepIndicator
//                         customStyles={customStyles}
//                         currentPosition={currentStep}
//                         stepCount={labels.length}
//                         labels={labels}
//                     />

//                 </View>

//                 {/* Delivery Status */}
//                 <View style={{
//                     flexDirection: "row",
//                     alignItems: "center",
//                     gap: 10,
//                     marginTop: 16,
//                 }}>
//                     <Image
//                         source={require("../assets/images/delivered.png")}
//                         style={{
//                             width: 40,
//                             height: 40,
//                             tintColor: "#fff",
//                             // backgroundColor:'red'
//                         }}
//                     />
//                     <View style={{ marginLeft: -15 }}>
//                         <Text style={{
//                             color: "#fff",
//                             fontSize: 15,
//                             fontWeight: "600",
//                         }}>{labels[currentStep]}</Text>
//                         <Text style={{
//                             color: "#ccc",
//                             fontSize: 13,
//                             marginTop: 2,
//                         }}>Thursday, 2nd Oct, 12:00 PM</Text>
//                     </View>
//                 </View>


//                 {/* Issue Section */}
//                 {/* <GlassContainer padding={0.1} style={{ padding: 1, paddingHorizantal: 5 }}>
//                     <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
//                         <Text style={{ color: "#fff", fontSize: Platform.OS === "android" ? 12 : 15, marginLeft: Platform.OS === "ios" ? 10 : 0 }}>Got an issue with this item?</Text>
//                         <GlassContainer style={{ marginRight: 7 }}>
//                             <TouchableOpacity>
//                                 <Text style={{ color: "#fff", fontSize: 12, fontWeight: "600", }}>Submit return</Text>
//                             </TouchableOpacity>
//                         </GlassContainer>
//                     </View>

//                 </GlassContainer> */}

//                 {/* Delivered Address */}
//                 <View style={{ marginTop: 20 }}>

// {/* 
//                     <GlassContainer style={{}}>
//                         <Text style={styles.sectionTitle}>Delivered address</Text>
//                         <Text style={styles.addressText}>
//                             53, Amber Society, Balewadi, Near IT Park, Pune{"\n"}
//                             53, Amber Society, Balewadi, Near IT Park, Pune{"\n"}
//                             53, Amber Society, Balewadi, Near IT Park, Pune
//                         </Text>
//                         <Text style={styles.verifiedText}>
//                             <Text style={{ color: "#31d36c", fontWeight: "bold" }}>Verified </Text>
//                             +966–53–9235210
//                         </Text>
//                     </GlassContainer> */}

//                 </View>

//                 {/* <GlassContainer>

//                     <View style={{ marginTop: 25 }}>
//                         <Text style={styles.sectionTitle}>Share your experience</Text>
//                         <GlassContainer style={{ height: 40, }}></GlassContainer>
                       
//                         <View style={styles.row}>
//                             <GlassContainer padding={10} style={{ width: Platform.OS === "android" ? screenWidth * 0.33 : screenWidth * 0.35, alignItems: "center", justifyContent: "center", }}>
//                                 <TouchableOpacity style={{ alignItems: "center" }}>
//                                     <GlassContainer padding={10} borderRadius={60} style={styles.iconContainer}>
//                                         <Image source={require("../assets/images/thumb.png")} style={styles.icon} />
//                                     </GlassContainer>
//                                     <Text style={styles.cardTitle}>Review Product</Text>
//                                     <Text style={styles.cardSubText}>Help others to know what to buy</Text>
//                                 </TouchableOpacity>
//                             </GlassContainer>

//                             <GlassContainer padding={10} style={{ width: Platform.OS === "android" ? screenWidth * 0.33 : screenWidth * 0.35, alignItems: "center", justifyContent: "center", }}>
//                                 <TouchableOpacity style={{ alignItems: "center" }}>
//                                     <GlassContainer padding={6} borderRadius={60} style={styles.iconContainer}>
//                                         <Image source={require("../assets/images/truck.png")} style={{ width: 40, height: 40, borderColor: 'black', resizeMode: 'contain' }} />
//                                     </GlassContainer>
//                                     <Text style={styles.cardTitle}>Review Delivery</Text>
//                                     <Text style={styles.cardSubText}>Review how the delivery went</Text>
//                                 </TouchableOpacity>
//                             </GlassContainer>
//                         </View>
                 
//                     </View>

//                 </GlassContainer> */}

//                 {/* View Order Summary */}
//                 {/* <GlassContainer style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", }}>
//                     <View style={{ width: '92%' }}>
//                         <Text style={styles.sectionTitle}>View order/invoice summary</Text>
//                         <Text style={styles.subText}>Find invoice, shipping details here</Text>
//                     </View>
//                     <Image source={require("../assets/images/arrowright.png")} style={styles.arrowIcon} />
//                 </GlassContainer> */}

//                 {/* Item Summary */}
//                 {/* <TouchableOpacity style={{}} onPress={() => { navigation.navigate('TrackingDetails') }}>
//                     <GlassContainer style={{}} padding={12}>
//                         <Text style={styles.sectionTitle}>Items summary</Text>
//                         <View style={styles.itemRow}>
//                             <LinearGradient
//                                 colors={["#505050", "#808080"]}
//                                 start={{ x: 0.5, y: 0 }}
//                                 end={{ x: 0.5, y: 1 }}
//                                 style={styles.productImage}
//                             >
//                                 <Image source={require("../assets/images/headphones.png")} style={styles.productImage} />
//                             </LinearGradient>
//                             <View style={{ marginLeft: 10 }}>
//                                 <Text style={styles.itemTitle}>Beats</Text>
//                                 <Text style={styles.itemDesc}>
//                                     Beats Studio3 Wireless Headphones{"\n"}MX3X2LL/A, MQ562PA/A, MX3X2ZM/A
//                                 </Text>
//                                 <Text style={styles.priceText}>₹16669.25</Text>
//                             </View>
//                         </View>
//                         <View style={{ marginTop: 30 }}>
//                             <TouchableOpacity onPress={() => { navigation.navigate("SparkleScreen") }} style={styles.helpBtn}>
//                                 <Image source={require("../assets/images/help.png")} style={{ width: 20, height: 20 }} />
//                                 <Text style={{ color: '#fff', marginLeft: 1 }}>Need Help?</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </GlassContainer>
//                 </TouchableOpacity> */}

//                 {/* Help Button */}

//             </ScrollView>
//         </BackgroundWrapper>
//         // </LinearGradient>
//     );
// };

// export default TrackingDetails;

// const styles = StyleSheet.create({
//     background: {
//         flex: 1,
//     },
//     container: {
//         padding: 16,
//         paddingBottom: 80,
//     },
//     glassWrapper: {
//         borderRadius: 20,
//         overflow: "hidden",
//         backgroundColor: "rgba(255, 255, 255, 0.08)",
//         borderWidth: 0.5,
//         borderColor: "rgba(255, 255, 255, 0.15)",
//         position: "relative",
//     },
//     blurLayer: {
//         ...StyleSheet.absoluteFillObject,
//     },
//     deliveredText: {
//         color: "#fff",
//         fontSize: 15,
//         textAlign: "center",
//         opacity: 0.8,
//     },
//     dateText: {
//         color: "#fff",
//         fontSize: 18,
//         fontWeight: "bold",
//         textAlign: "center",
//     },
//     sectionTitle: {
//         color: "#fff",
//         fontWeight: "600",
//         fontSize: 16,
//         marginBottom: 6,
//     },
//     addressText: {
//         color: "#fff",
//         fontSize: 13,
//         lineHeight: 20,
//     },
//     verifiedText: {
//         color: "#fff",
//         fontSize: 13,
//         marginTop: 5,
//     },
//     experienceBox: {
//         marginTop: 40,
//         padding: 15,
//     },
//     row: {
//         flexDirection: "row",
//         alignItems: 'center',
//         justifyContent: 'space-evenly',
//         marginTop: 35,
//         gap: 15,
//         // justifyContent: "space-between",
//     },
//     experienceCard: {
//         width: "48%",
//         alignItems: "center",
//         padding: 10,
//     },
//     iconContainer: {
//         alignItems: 'center',
//         justifyContent: 'center',
//         // marginBottom: 8,
//     },
//     icon: {
//         width: 32,
//         height: 32,
//         tintColor: "#fff",
//     },
//     cardTitle: {
//         color: "#fff",
//         fontWeight: "600",
//         fontSize: 14,
//     },
//     cardSubText: {
//         color: "#fff",
//         fontSize: 12,
//         textAlign: "center",
//         marginTop: 4,
//     },
//     subText: {
//         color: "#fff",
//         fontSize: 13,
//     },
//     arrowIcon: {
//         width: 18,
//         height: 18,
//         tintColor: "#fff",
//     },
//     itemRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         marginTop: 12,
//     },
//     productImage: {
//         width: 100,
//         height: 120,
//         borderRadius: 16,
//     },
//     itemTitle: {
//         color: "#fff",
//         fontWeight: "600",
//         fontSize: 15,
//     },
//     itemDesc: {
//         color: "#fff",
//         fontSize: 12,
//         lineHeight: 18,
//         marginTop: 2,
//     },
//     priceText: {
//         color: "#fff",
//         fontSize: 15,
//         fontWeight: "bold",
//         marginTop: 4,
//     },
//     helpBtn: {
//         position: "absolute",
//         bottom: 0,
//         right: 0,
//         backgroundColor: "rgba(255,255,255,0.1)",
//         padding: 10,
//         borderRadius: 25,
//         flexDirection: 'row',
//     },
// });



import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import GlassContainer from "../components/customcomponents/GlassContainer";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import { Dimensions } from "react-native";
import { getTrackingInfo } from "../services/getTrackingInfo";
import { useCustomContext } from "../hooks/CustomeContext";
import { useLoading } from "../hooks/LoadingProvider";

const TrackingDetails = ({ navigation, route }) => {
  const screenWidth = Dimensions.get("window").width;
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { setGlobalLoading } = useLoading();
  const { orderId } = route?.params;

  const [trackingData, setTrackingData] = useState([]);
  const [trackingDetails, setTrackingDetails] = useState();

  useEffect(() => {
    fetchTrackingData();
  }, []);

  // ─── Date parsers ──────────────────────────────────────────────────────────

  const parseSMSADate = (dateStr) => {
    if (!dateStr) return 0;
    const months = {
      Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
      Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
    };
    const parts = dateStr.split(" ");
    const day = parseInt(parts[0]);
    const month = months[parts[1]];
    const year = parseInt(parts[2]);
    const [hour, minute] = parts[3].split(":").map(Number);
    return new Date(year, month, day, hour, minute).getTime();
  };

  const getAramexTime = (str) => {
    if (!str) return 0;
    const m = String(str).match(/\d+/);
    return m ? parseInt(m[0], 10) : 0;
  };

  // ─── Normalize ────────────────────────────────────────────────────────────

  const normalizeTrackingData = (result) => {
    const shippingCode = result?.shipping_code;

    // ARAMEX
    if (shippingCode === "aramex.aramex") {
      const events = result?.response?.TrackingResults?.[0]?.Value || [];
      return events
        .map((item) => ({
          time: getAramexTime(item.UpdateDateTime),
          date: new Date(getAramexTime(item.UpdateDateTime)).toLocaleString(),
          status: (item.UpdateDescription || "").trim(),
          location: item.UpdateLocation || "",
        }))
        .filter((ev) => ev.status)
        .sort((a, b) => b.time - a.time);
    }

    // SMSA
    if (shippingCode === "smsa.smsa_5") {
      const events = result?.response?.Tracking || [];
      return events
        .map((item) => {
          const t = parseSMSADate(item.Date);
          return {
            time: t,
            date: item.Date,
            status: (item.Activity || "").trim(),
            location: item.Details || "",
          };
        })
        .filter((ev) => ev.status)
        .sort((a, b) => b.time - a.time);
    }

    return [];
  };

  // ─── Fetch ────────────────────────────────────────────────────────────────

  const fetchTrackingData = async () => {
    try {
      setGlobalLoading(true);
      const result = await getTrackingInfo(EndPoint?.tracking_info, orderId);
      setTrackingDetails(result);
      const normalized = normalizeTrackingData(result);
      setTrackingData(normalized);
    } catch (error) {
      console.log("error", error?.response?.data);
    } finally {
      setGlobalLoading(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────

const getLatestEvent = () => {
  if (!trackingData?.length) return null;

  // newest item is now first
  return trackingData[0];
};

  const latestEvent = getLatestEvent();

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <BackgroundWrapper>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { marginTop: Platform.OS === "ios" ? 70 : 10 },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/images/back.png")}
              style={styles.backIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {trackingDetails?.trackingdetail}
          </Text>
          <View style={{ width: 18 }} />
        </View>

        {/* Order ID card */}
        <GlassContainer>
          <View style={styles.orderRow}>
            <View>
              <Text style={styles.labelSmall}>
                {trackingDetails?.orderid}
              </Text>
              <Text style={styles.orderIdText}>{orderId}</Text>
            </View>
            <TouchableOpacity style={styles.copyBtn}>
              <Image
                source={require("../assets/images/copy.png")}
                style={styles.copyIcon}
              />
            </TouchableOpacity>
          </View>
        </GlassContainer>

        {/* Shipment header row (mirrors website .track-header) */}
        {trackingData.length > 0 && (
          <GlassContainer style={{ marginTop: 12 }}>
            <View style={styles.shipmentHeader}>
              <View style={styles.shipmentBlock}>
                <Text style={styles.shipmentLabel}>{trackingDetails?.shipmentno}</Text>
                <View style={styles.shipmentValueRow}>
                  <Text style={styles.shipmentValue}>
                    {trackingDetails?.tracking_number || orderId}
                  </Text>
                  <Image
                    source={require("../assets/images/truck.png")}
                    style={styles.truckIcon}
                  />
                </View>
              </View>
              <View style={[styles.shipmentBlock, { alignItems: "flex-end" }]}>
                <Text style={styles.shipmentLabel}>{trackingDetails?.lastupdate}</Text>
                <Text style={styles.shipmentValue}>
                  {latestEvent?.date || "—"}
                </Text>
              </View>
            </View>
          </GlassContainer>
        )}

        {/* ── Vertical Timeline (mirrors buildTrackTimeline) ── */}
        {trackingData.length > 0 ? (
          <View style={styles.timeline}>
{trackingData.map((ev, index) => {
  const isLatest = index === 0;
  const isLast = index === trackingData.length - 1;

  return (
    <View key={index} style={styles.timelineItem}>
      
      {/* Left: line + dot */}
      <View style={styles.timelineLeft}>

        {/* top line */}
        {!isLatest && (
          <View
            style={[
              styles.lineTop,
              styles.lineCompleted,
            ]}
          />
        )}

        {/* green dot */}
        <View
          style={[
            styles.dot,
            styles.dotCompleted,
          ]}
        />

        {/* bottom line */}
        {!isLast && (
          <View
            style={[
              styles.lineBottom,
              styles.lineCompleted,
            ]}
          />
        )}
      </View>

      {/* Right content */}
      <View
        style={[
          styles.timelineContent,
          styles.timelineContentCompleted,
        ]}
      >
        <Text style={styles.eventDate}>
          {ev.date}
        </Text>

        <Text
          style={[
            styles.eventStatus,
            styles.eventStatusCompleted,
          ]}
        >
          {ev.status}
        </Text>

        {!!ev.location && (
          <Text style={styles.eventLocation}>
            {ev.location}
          </Text>
        )}
      </View>
    </View>
  );
})}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>{trackingDetails?.notrackingfound}</Text>
          </View>
        )}
      </ScrollView>
    </BackgroundWrapper>
  );
};

export default TrackingDetails;
const ACCENT = "#27AE60";
const LINE_COLOR = "rgba(255,255,255,0.18)";

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 80,
  },

  // ── Header ──
  header: {
    marginTop: 10,
    marginHorizontal: Platform.OS === "ios" ? 4 : 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  backIcon: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "400",
  },

  // ── Order Card ──
  orderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  labelSmall: {
    color: "white",
    fontSize: 11,
    marginBottom: 2,
  },

  orderIdText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  copyBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
  },

  copyIcon: {
    width: 18,
    height: 18,
    tintColor: "#fff",
  },

  // ── Shipment Header ──
  shipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  shipmentBlock: {
    flex: 1,
  },

  shipmentLabel: {
    color: "white",
    fontSize: 11,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  shipmentValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  shipmentValue: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    flexShrink: 1,
  },

  truckIcon: {
    width: 16,
    height: 16,
    tintColor: ACCENT,
    resizeMode: "contain",
  },

  // ── Timeline ──
  timeline: {
    marginTop: 16,
    paddingLeft: 8,
  },

  timelineItem: {
    flexDirection: "row",
    minHeight: 90,
  },

  // Left Rail
  timelineLeft: {
    width: 28,
    alignItems: "center",
  },

  lineTop: {
    width: 2,
    flex: 1,
    backgroundColor: LINE_COLOR,
    marginBottom: -1,
  },

  lineBottom: {
    width: 2,
    flex: 1,
    backgroundColor: LINE_COLOR,
    marginTop: -1,
  },

  lineCompleted: {
    backgroundColor: ACCENT,
  },

  // Dot
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    zIndex: 1,
  },

  dotCompleted: {
    backgroundColor: ACCENT,
    borderColor: ACCENT,

    shadowColor: ACCENT,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 6,

    elevation: 4,
  },

  // Timeline Content Card
  timelineContent: {
    flex: 1,
    marginLeft: 12,
    marginBottom: 16,

    paddingVertical: 12,
    paddingHorizontal: 14,

    borderRadius: 14,

    backgroundColor: "rgba(255,255,255,0.06)",

    borderWidth: 0.5,
    borderColor: "rgba(255,255,255,0.1)",
  },

  timelineContentCompleted: {
    backgroundColor: "rgba(39,174,96,0.10)",
    borderColor: "rgba(39,174,96,0.35)",
  },

  // Event Texts
  eventDate: {
    color: "white",
    fontSize: 11,
    marginBottom: 6,
    opacity: 0.7,
  },

  eventStatus: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },

  eventStatusCompleted: {
    color: "#4ade80",
    fontWeight: "600",
  },

  eventLocation: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },

  // Empty State
  emptyState: {
    marginTop: 40,
    alignItems: "center",
  },

  emptyText: {
    color: "rgba(255,255,255,0.4)",
    fontSize: 14,
  },
});