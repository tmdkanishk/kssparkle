import React from "react";
import { View, ActivityIndicator, Alert, TouchableOpacity, Image } from "react-native";
import { WebView } from "react-native-webview";
import { trackPurchase } from "../services/analytics";

const TamaraPaymentScreen = ({ route, navigation }) => {
    const { checkoutUrl, orderId, orderStatusId } = route.params || {};

    const handleNavigation = (navState) => {
        const { url } = navState;
        if (!url) return;

        console.log("Current URL:", url);

        // Success — fire purchase (deduped) then navigate
        if (url.includes("success")) {
            trackPurchase({
                orderId,
                screenName: "TamaraPaymentScreen",
                paymentType: "tamarapay",
            }).catch(() => {});
            navigation.replace("OrderSuccessScreen", { orderId, orderStatusId });
            return;
        }

        // Failure
        if (url.includes("fail")) {
            navigation.goBack();

            setTimeout(() => {
                Alert.alert("Payment Failed", "Your payment could not be completed. Please try again.");
            }, 300);
            return;
        }

        // Cancel
        if (url.includes("cancel")) {
            navigation.goBack();
        }
    };

    return (
        <View style={{ flex: 1, marginTop: 70, backgroundColor: "white", marginBottom: 70 }}>
            <TouchableOpacity
                style={{ padding: 25 }}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            >
                <Image
                    source={require("../assets/images/back.png")}
                    style={{ width: 24, height: 24, tintColor: "black" }}
                />
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
