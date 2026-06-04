import React from "react";
import { View, ActivityIndicator, Alert, TouchableOpacity, Image } from "react-native";
import { WebView } from "react-native-webview";
import CustomHeader from "../components/customcomponents/CustomHeader";

const TamaraPaymentScreen = ({ route, navigation }) => {
    const { checkoutUrl, orderId, orderStatusId } = route.params;

    const handleNavigation = (navState) => {
        const { url } = navState;

        console.log("Current URL:", url);

        // ✅ Success
        if (url.includes("success")) {
            navigation.replace("OrderSuccessScreen", { orderId, orderStatusId });
        }

        // ❌ Failure
        if (url.includes("fail")) {
            navigation.goBack();

            setTimeout(() => {
                Alert.alert("Payment Failed", "Your payment could not be completed. Please try again.");
            }, 300); // slight delay to avoid navigation conflict
        }

        // ⚠️ Cancel
        if (url.includes("cancel")) {
            navigation.goBack();
        }
    };

    return (
        <View style={{ flex: 1, marginTop: 70, backgroundColor: 'white', marginBottom: 70 }}>
            <TouchableOpacity style={{ padding: 25 }} onPress={() => navigation.goBack()} hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}>
                <Image source={require("../assets/images/back.png")} style={{ width: 24, height: 24, tintColor: "black", }} />
            </TouchableOpacity>
            <WebView
                source={{ uri: checkoutUrl }}
                onNavigationStateChange={handleNavigation}
                startInLoadingState
                renderLoading={() => <ActivityIndicator style={{ flex: 1 }} />}
            />
        </View>
    );
};

export default TamaraPaymentScreen;