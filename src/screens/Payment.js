import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomActivity from "../components/CustomActivity";
import TitleBarName from "../components/TitleBarName";
import { useCustomContext } from "../hooks/CustomeContext";
import commonStyles from "../constants/CommonStyles";
import {
  IconComponentCheckSquare,
  IconComponentSquare,
} from "../constants/IconComponents";
import CustomButton from "../components/CustomButton";
import { getShippingPaymentMehtod } from "../services/getShippingPaymentMehtod";
import { saveShippingPaymentMethod } from "../services/saveShippingPaymentMethod";
import { autoLogin } from "../services/autoLogin";
import { checkAutoLogin } from "../utils/helpers";
import NotificationAlert from "../components/NotificationAlert";
import { getShippingPoint } from "../services/getShippingPoint";
import OpenUrlInModal from "../components/OpenUrlInModal";
import WebView from "react-native-webview";
import { checkShippingAddress } from "../services/checkShippingAddress";

const Payment = ({ navigation }) => {
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
      console.log("Shipping and payment method", result?.text);
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
    <>
      {loading ? (
        <CustomActivity />
      ) : (
        <>
          <View style={commonStyles.bodyConatiner}>
            <TitleBarName
              onClickBackIcon={() => navigation.goBack()}
              titleName={isLabel?.shipandpaymethod_pagename}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
              <View style={{ marginHorizontal: 12, marginBottom: 100, }}>
                <View style={{ gap: 10, marginVertical: 12, borderWidth: 1, padding: 10, borderRadius: 10, borderColor: Colors?.gray }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', borderBottomWidth: 1, borderColor: Colors?.gray, paddingBottom: 6 }}>{isLabel?.selctshipmethod_label}</Text>
                  <View style={{ gap: 10 }}>
                    {isShippingMethodList?.length > 0
                      ? isShippingMethodList?.map((item, index) => (
                        <View style={{ gap: 10 }} key={index}>
                          <Text style={[commonStyles.smallHeading, { width: '95%', fontWeight: '600', color: item?.key == 'free' ? '#FF0000' : null }]}>
                            {item?.title}
                          </Text>
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 10,
                              alignItems: "center",
                            }}
                          >
                            <TouchableOpacity
                              onPress={() =>
                                setShippingMethodCode(item?.quote?.code)
                              }
                              style={{
                                height: 20,
                                width: 20,
                                borderRadius: 10,
                                borderWidth: 1,
                                backgroundColor:
                                  item?.quote?.code === isShippingMethodCode
                                    ? Colors?.primary
                                    : null,
                              }}
                            />
                            <Text style={{ width: '95%' }}>
                              {item.quote.title} {item.quote.text}
                            </Text>

                          </View>
                          {
                            item.quote.code == 'gls_ps.gls_ps' && <TouchableOpacity style={{ marginLeft: 12 }} onPress={() => onOpenShippingPoint()}><Text style={{ fontSize: 16, color: Colors?.primary, fontWeight: '600', textDecorationLine: 'underline', marginLeft: 12 }}>{'- ODABERI PAKETOMAT'}</Text></TouchableOpacity>
                          }
                        </View>
                      ))
                      : null}
                  </View>
                </View>


                <View style={{ gap: 10, marginVertical: 12, borderWidth: 1, padding: 10, borderRadius: 10, borderColor: Colors?.gray }}>
                  <Text style={{ fontSize: 18, fontWeight: '600', borderBottomWidth: 1, borderColor: Colors?.gray, paddingBottom: 6 }}>{isLabel?.selctpaymethod_label}</Text>
                  <View style={{ gap: 10 }}>
                    {isPaymentMethodList?.length > 0
                      ? isPaymentMethodList?.map((item, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            gap: 10,
                            alignItems: "center",
                          }}
                        >
                          <TouchableOpacity
                            onPress={() => setPaymentMethodCode(item?.code)}
                            style={{
                              height: 20,
                              width: 20,
                              borderRadius: 10,
                              borderWidth: 1,
                              backgroundColor:
                                isPaymentMethodCode === item?.code
                                  ? Colors?.primary
                                  : null,
                            }}
                          />
                          <Text style={{ width: '95%' }}>{item?.title}</Text>
                        </View>
                      ))
                      : null}
                  </View>
                </View>

                <View style={{ gap: 10 }}>
                  <Text style={commonStyles.smallHeading}>
                    {isLabel?.payaddcoment_label}
                  </Text>
                  <TextInput
                    onChangeText={(text) => setComment(text)}
                    style={{
                      width: "100%",
                      height: 100,
                      borderWidth: 1,
                      padding: 12,
                      borderRadius: 10,
                      borderColor: Colors?.gray,
                    }}
                    textAlignVertical="top"
                    multiline={true}
                  />
                </View>



                <View
                  style={{
                    flexDirection: "row",
                    width: "100%",
                    borderWidth: 1,
                    gap: 10,
                    borderColor: "white",
                    alignItems: "center",
                  }}
                >
                  <TouchableOpacity onPress={() => setTC(!isTC)}>
                    {isTC ? (
                      <IconComponentCheckSquare />
                    ) : (
                      <IconComponentSquare />
                    )}
                  </TouchableOpacity>
                  <Text>{isLabel?.payprivacypolicy_label}</Text>

                </View>

                <View style={{ marginTop: 12 }}>
                  <CustomButton
                    btnDisabled={!isTC || screenLoading}
                    OnClickButton={() => onClickContinueOrder()}
                    buttonStyle={{
                      w: "100%",
                      h: 50,
                      backgroundColor: Colors.primary,
                      borderRadius: 12,
                    }}
                    buttonText={isLabel?.chkoutshipmethodcontinuebtn_label}
                    opacity={isTC ? 1 : 0.5}
                  />
                </View>
              </View>
            </ScrollView>
          </View>

          <Modal
            transparent={true}
            visible={isShippingPointModal}
            animationType="slide"
            onRequestClose={() => setShippingPointModal(false)}
          >
            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)', }}>
              <Button title="Close" onPress={() => setShippingPointModal(false)} />

              <View style={{ width: '100%', height: '60%', }}>
                <WebView
                  originWhitelist={['*']}
                  source={{ uri: isShippingPointUrl }}
                  style={{ flex: 1 }}
                  onLoadStart={() => setLoadingWebView(true)}
                  onLoadEnd={() => setLoadingWebView(false)}
                  // domStorageEnabled={true}
                  javaScriptEnabled={true}
                  injectedJavaScript={injectedJS}
                  onMessage={handleWebViewMessage}
                />

                {loadingWebView &&
                  <View style={{ position: 'absolute', alignSelf: 'center', top: '50%' }}>
                    <CustomActivity />
                  </View>
                }

              </View>
            </View>
          </Modal>
          <NotificationAlert />

        </>
      )}
    </>
  );
};

export default Payment;
