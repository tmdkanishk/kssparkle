import React from "react";
import { View, StyleSheet } from "react-native";
import { TabbyPaymentWebView } from "tabby-react-native-sdk";

const TabbyCheckoutScreen = ({ route, navigation }) => {
  const { url } = route.params;

  const handleResult = (result) => {
    console.log("Tabby result:", result);

    switch (result) {
      case "authorized":
        // ✅ Payment approved
        // call backend verify / place order
        navigation.replace("OrderConfirmation");
        break;

      case "rejected":
        alert("Tabby payment was rejected");
        navigation.goBack();
        break;

      case "close":
        navigation.goBack();
        break;

      case "expired":
        alert("Session expired, please try again");
        navigation.goBack();
        break;

      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      <TabbyPaymentWebView
        url={url}
        onBack={() => navigation.goBack()}
        onResult={handleResult}
      />
    </View>
  );
};

export default TabbyCheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop:40
  },
});
