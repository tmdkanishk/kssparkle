import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useCustomContext } from "../hooks/CustomeContext";
import CustomActivity from "../components/CustomActivity";
import TitleBarName from "../components/TitleBarName";
import commonStyles from "../constants/CommonStyles";
import CustomButton from "../components/CustomButton";
import {
  IconComponentImage,
  IconComponentLocation,
} from "../constants/IconComponents";
import { getOrderSummaries } from "../services/getOrderSummaries";
import { onPlaceOrder } from "../services/onPlaceOrder";
import { _retrieveData, _storeData } from "../utils/storage";
import {
  captureOrder,
  createPayPalOrder,
  getOrderId,
} from "../utils/paypalPayment";
import WebView from "react-native-webview";
import RazorpayCheckout from "react-native-razorpay";
import { getPaymentDetail } from "../services/getPaymentDetail";
import FailedModal from "../components/FailedModal";
import { genrateOrderId } from "../services/genrateOrderId";
import { confirmRazorPayPayment } from "../services/confirmRazorPayPayment";
import SuccessModal from "../components/SuccessModal";
import { confirmPaypalPaymment } from "../services/confirmPaypalPaymment";
import { openPaymentGetway } from "../services/openPaymentGetway";
import PaymentUrlModal from "../components/PaymentUrlModal";
import { getOrderStatus } from "../services/getOrderStatus";
import { checkAutoLogin } from "../utils/helpers";
import NotificationAlert from "../components/NotificationAlert";
import { getKekspayPaymentGatway } from "../services/getKekspayPaymentGatway";
import KekspayModal from "../components/KekspayModal";
import { getCorvuspayPaymentGateway } from "../services/getCorvuspayPaymentGateway";
import { getPayPalStandardGatewayUrl } from "../services/getPayPalStandardGatewayUrl";
import { useCartCount } from "../hooks/CartContext";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import CustomHeader from "../components/customcomponents/CustomHeader";
import { useLoading } from "../hooks/LoadingProvider";
import GlassContainer from "../components/customcomponents/GlassContainer";
import { Tabby, TabbyPaymentWebView } from "tabby-react-native-sdk";
import PriceView from "../components/customcomponents/PriceView";
import { buildMoyasarConfig } from "../utils/buildMoyasarConfig";

const OrderPlace = ({ navigation }) => {
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { updateCartCount } = useCartCount();
  const [isProductInfo, setProductInfo] = useState();
  const [isTotalsInfo, setTotalsInfo] = useState();
  const [isOtherInfo, setOtherInfo] = useState();
  const [isLabel, setLabel] = useState();
  const [loading, setLoading] = useState(false);
  const [isPaypalModal, setPaypalModal] = useState(false);
  const [paypalUrl, setPaypalUrl] = useState(null);
  const [isTotalPrice, setTotalPrice] = useState(0);
  const [isErrorModal, setErrorModal] = useState(false);
  const [isError, setError] = useState();
  const [isRazorPayData, setRazorPayData] = useState();
  const [isRazorPayDataModal, setRazorPayDataModal] = useState(false);
  const [isRazorPayCredential, setRazorPayCredential] = useState();
  const [isPayPalData, setPayPalData] = useState();
  const [isPaypalSuccessMgsModal, setPaypalSuccessMgsModal] = useState(false);
  const [isPaypalSuccessMgs, setPaypalSuccessMgs] = useState();
  const [isPaypalCaptureData, setPaypalCaptureData] = useState();
  const [isPaymentUrlModal, setPaymentUrlModal] = useState(false);
  const [isPaymentUrl, setPaymentUrl] = useState(null);
  const [isKekspayModal, setKekspayModal] = useState(false);
  const [isKekspayData, setKekspayData] = useState(null);
  const [screenLoading, setScreenLoading] = useState(false);
  const { setGlobalLoading } = useLoading();
  const [screenLoader, setScreenLoader] = useState(false);
  const [showTabbyModal, setShowTabbyModal] = useState(false);
  const [tabbyCheckoutUrl, setTabbyCheckoutUrl] = useState()
  const [showTabby, setShowTabby] = useState(false)
  const [tabbyUrl, setTabbyUrl] = useState()



  useEffect(() => {
    checkAutoLogin();
    fetchAllOrderSummary();
  }, []);

  const fetchAllOrderSummary = async () => {
    try {
      setGlobalLoading(true);
      const result = await getOrderSummaries(EndPoint?.confirm);
      console.log("result in fetchAllOrderSummary", result);
      console.log("confirm api response", result?.totalsprice);
      setProductInfo(result?.products);
      setTotalsInfo(result?.totals);
      setOtherInfo(result);
      setLabel(result?.text);
      setTotalPrice(result?.totalsprice);
    } catch (error) {
      alert(GlobalText?.extrafield_somethingwrong);
    } finally {
      setGlobalLoading(false);
    }
  };



  const onClickPlaceOrder = async () => {
    console.log("onClickPlaceOrder")
    try {
      setGlobalLoading(true);
      const user = await _retrieveData("CUSTOMER_ID");
      const cur = await _retrieveData("SELECT_CURRENCY");
      switch (isOtherInfo?.payment_method?.code) {
        case "pp_pro":
          // Code to run if expression === value1
          const payalData = await getPaymentDetail(
            isOtherInfo?.payment_method?.code,
            EndPoint?.payment_information
          );
          await onClickPaypalButton(
            payalData?.payment_pp_pro_username,
            payalData.payment_pp_pro_password,
            cur,
            user
          );

          break;
        case "razorpay":
          // Code to run if expression === value2
          const razorpayData = await getPaymentDetail(isOtherInfo?.payment_method?.code, EndPoint?.payment_information);
          setRazorPayCredential(razorpayData);
          const orderId = await genrateOrderId(razorpayData?.payment_razorpay_key_id, razorpayData?.payment_razorpay_key_secret, cur?.code, EndPoint?.payment_razorpay);
          await onClickRazorPayButton(razorpayData?.payment_razorpay_key_id, isTotalPrice, cur?.code, user, orderId?.razorpay_order_id);
          break;

        case 'kekspay':
          const kekspayData = await getKekspayPaymentGatway(isOtherInfo?.order_id, EndPoint?.payment_kekspay);
          console.log("kekspayData", kekspayData);
          if (kekspayData) {
            setKekspayData(kekspayData);
            setKekspayModal(true);
          }

          break;

        case "corvuspay":
          // Code to run if expression === value3
          const corvuspayData = await getCorvuspayPaymentGateway(isOtherInfo?.order_id, EndPoint?.payment_corvuspay_newcorvous);
          console.log("corvuspayData", corvuspayData);
          setPaymentUrl(corvuspayData?.redirect_url);
          setPaymentUrlModal(true);
          break;

        case "pp_standard":
          const ppStatandData = await getPayPalStandardGatewayUrl(isOtherInfo?.order_id, EndPoint?.payment_pp_standard);

          let firstDecode = decodeURIComponent(ppStatandData?.paypal_redirect_url);
          console.log("ppStatandData", firstDecode);
          setPaymentUrl(firstDecode);
          setPaymentUrlModal(true);
          break;
        case "cod":
          const result = await onPlaceOrder(EndPoint?.success);
          console.log("result susuccess 1: ", result);
          updateCartCount(0);
          navigation.navigate("OrderConfirmation", {
            orderId: isOtherInfo?.order_id,
          });

        case "tabby_installments":
          console.log("tabby_installments")
          await createCheckoutSession();
          break;

        case "moyasar3":
          console.log("hit moyasar3")
          const moyasarConfig = buildMoyasarConfig({
            amount:  1000,
            orderId: isOtherInfo?.order_id,
            publishableKey: "pk_live_Mijc7Htr4NhyQG27DUdp9DgALzzWSN4yhXS5eH8M",
          });

          navigation.navigate("MoyasarPayment", {
            paymentConfig: moyasarConfig,
            orderId: isOtherInfo?.order_id,
          });

          break;

        default:
          // Code to run if no case matches
          return;

      }
    } catch (error) {
      console.log("error : ", error.response.data);
    } finally {
      setGlobalLoading(false);
    }
  };
  const paymentData = {
    amount: "340",
    currency: "AED",
    description: "tabby Store Order #3",
    buyer: {
      email: "successful.payment@tabby.ai",
      phone: "500000001",
      name: "Yazan Khalid",
      // ... other buyer details
    },
    order: {
      reference_id: "#xxxx-xxxxxx-xxxx",
      items: [
        {
          description: "Jersey",
          product_url: "https://tabby.store/p/SKU123",
          quantity: 1,
          reference_id: "SKU123",
          title: "Pink jersey",
          unit_price: "300",
          category: "Clothes"
        }
      ],
      // ... shipping and tax details
    },
    // ... other optional fields like buyer_history, shipping_address etc.
  };

  // const createCheckoutSession = async () => {
  //   try {
  //     const session = await Tabby.createSession(paymentData);

  //     if (session.availableProducts.length > 0) {
  //       console.log("if statement works")
  //       // Navigate to a WebView screen with the provided URL
  //       // navigation.navigate('TabbyWebViewScreen', { url: session.availableProducts[0].webUrl });
  //     }
  //   } catch (error) {
  //     console.error('Error creating Tabby checkout session', error);
  //     // Handle the error appropriately
  //   }
  // };

  const createCheckoutSession = async () => {
    try {
      const payload = {
        merchant_code: "sa",
        lang: "en",
        payment: {
          amount: "100.00",
          currency: "SAR",
          buyer: {
            email: "successful.payment@tabby.ai",
            phone: "+966500000001",
            name: "Test User",
          },
        },
      };

      const { availableProducts } = await Tabby.createSession(payload);

      const installments = availableProducts.find(
        p => p.type === "installments"
      );

      navigation.navigate("TabbyCheckoutScreen", {
        url: installments.webUrl,
      });
    } catch (e) {
      console.log("Tabby FAILED →", e);
    }
  };



  //  const createCheckoutSession = async () => {
  //   console.log("function got hit")
  //   try {
  //     const payload = {
  //       merchant_code: "sa", // REAL merchant code
  //       lang: "en",
  //       payment: {
  //         amount: "340.00",
  //         currency: "SAR",
  //         buyer: {
  //           email: "successful.payment@tabby.ai",
  //           phone: "+966500000001",
  //           name: "Test User",
  //         },
  //       },
  //     };

  //     console.log("Creating Tabby session...", payload);

  //     const { availableProducts } = await Tabby.createSession(payload);

  //     console.log("Tabby success:", availableProducts);
  //   } catch (error) {
  //     console.log("Tabby FAILED:", error?.message || error);
  //   }
  // };



  const startTabbyPayment = async (payload) => {
    try {
      console.log("startTabbyPayment functions getting hit", payload)
      const { availableProducts } = await Tabby.createSession(payload);

      const installmentsProduct = availableProducts.find(
        p => p.type === "installments"
      );



      setTabbyUrl(installmentsProduct.web_url);
      setShowTabby(true); // 👉 THIS opens the UI
    } catch (e) {
      console.log("Tabby error", e);
    }
  };



  const handleTabbyPayment = async () => {
    try {
      const user = await _retrieveData("CUSTOMER_ID");
      const payload = buildTabbyPayload(user); // map order → tabby

      const {
        sessionId,
        paymentId,
        availableProducts
      } = await Tabby.createSession(payload);

      // Pick installments product
      const tabbyUrl = availableProducts.installments?.[0]?.web_url;

      if (!tabbyUrl) {
        throw new Error("Tabby installments not available");
      }

      setTabbyCheckoutUrl(tabbyUrl);
      setShowTabbyModal(true); // open WebView modal
    } catch (err) {
      console.log("Tabby error", err);
      Alert.alert("Payment failed", "Tabby is not available right now");
    }
  };


  const buildTabbyPayload = ({
    user,
    cartProducts,
    orderId,
    amount,
    currency = "SAR",
    lang = "ar",
  }) => ({
    merchant_code: "",
    lang,
    payment: {
      amount: amount.toFixed(2),
      currency,
      buyer: {
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        name: user?.name ?? "",
      },
      order: {
        reference_id: String(orderId),
        tax_amount: "0.00",
        shipping_amount: "0.00",
        discount_amount: "0.00",
        items: cartProducts.map(item => ({
          title: item.name,
          description: item.model,
          quantity: Number(item.quantity),
          unit_price: String(item.price).replace('$', ''),
          reference_id: String(item.product_id),
          category: "product",
        })),
      },
    },
  });




  const onClickPaypalButton = async (clientId, secretKey, currencyType, user) => {
    try {
      setPaypalModal(true);
      const orderid = await getOrderId(EndPoint?.payment_pp_pro);
      console.log("orderId", orderid);
      const order = await createPayPalOrder(clientId, secretKey, isTotalPrice, currencyType, orderid?.paypal_order_id, user);
      if (order && order.links) {
        const approveLink = order.links.find((link) => link.rel === "approve");
        if (approveLink) {
          console.log("orders", approveLink.href);
          setPaypalUrl(approveLink.href);
        }
      }
    } catch (error) {
      setError(`${error.response.data?.message} | ${error.response.data?.details[0]?.issue}`);
      setErrorModal(true);
      setPaypalModal(false);
    }
  };

  const handleNavigationChange = async (event) => {
    if (event.url.includes("success")) {
      const urlParams = new URLSearchParams(event.url.split("?")[1]);
      const orderID = urlParams.get("token");
      console.log("orderID:", orderID);
      try {
        const captureResponse = captureOrder(
          orderID,
          isPayPalData?.payment_pp_pro_username,
          isPayPalData?.payment_pp_pro_password
        );
        // const captureResponse = await axios.post("http://your-backend-url.com/paypal.php?action=capture_order", { orderID });
        setPaypalCaptureData(captureResponse?.data);
        setPaypalSuccessMgs(
          "Payment Successful",
          `Transaction ID: ${captureResponse?.data?.id}`
        );
        setPaypalModal(false);
        setPaypalUrl(null);
        setPaypalSuccessMgsModal(true);
      } catch (error) {
        Alert.alert("Payment Failed", "Could not capture payment.");
      }
    }
  };

  const onClickRazorPayButton = async (
    razorpayKeyId,
    totalAmount,
    currencyType,
    user,
    orderId
  ) => {
    const total = totalAmount * 100;
    console.log("total", total);
    var options = {
      description: "Buy Product",
      image: "",
      currency: currencyType,
      key: razorpayKeyId,
      amount: total,
      name: "TMD Fashion",
      order_id: orderId,
      prefill: {
        email: user ? user[0]?.email : null,
        contact: user ? user[0]?.phoneno : null,
        name: user ? `${user[0]?.firstname} ${user[0]?.lastname}` : null,
      },
      theme: { color: "#F37254" },
    };

    console.log("options", options);

    RazorpayCheckout.open(options)
      .then((data) => {
        // handle success
        console.log("on success payment", data);
        setRazorPayData(data);
        setRazorPayDataModal(true);
      })
      .catch((error) => {
        // handle failure
        // console.log(error.response.data);
        alert(`Error: ${error.code} | ${error.description}`);
      });
  };

  const confirmRazorPay = async () => {
    try {
      setScreenLoading(true);
      setRazorPayDataModal(false);
      setRazorPayData();
      const confirmresult = await confirmRazorPayPayment(
        isRazorPayCredential,
        isRazorPayData,
        EndPoint?.payment_razorpay_callback
      );
      const result = await onPlaceOrder(EndPoint?.success);
      updateCartCount(0)
      navigation.navigate("OrderConfirmation", {
        orderId: isOtherInfo?.order_id,
      });
    } catch (error) {
      console.log("error confirm ", error.response.data);
    } finally {
      setScreenLoading(false);
    }
  };

  const confirmPaypalPayment = async () => {
    try {
      setScreenLoading(true);
      setPaypalSuccessMgsModal(false);
      setPaypalSuccessMgs();
      const confirmresult = await confirmPaypalPaymment(
        isPaypalCaptureData?.status,
        isPaypalCaptureData?.id,
        EndPoint?.payment_pp_pro_callback
      );
      const result = await onPlaceOrder(EndPoint?.success);
      updateCartCount(0);
      navigation.navigate("OrderConfirmation", {
        orderId: isOtherInfo?.order_id,
      });
    } catch (error) {
      alert(GlobalText?.extrafield_somethingwrong);
    } finally {
      setScreenLoading(false);
    }
  };

  const openPaymentGetwayScreen = async () => {
    try {
      const response = await openPaymentGetway(isOtherInfo?.order_id, isOtherInfo?.payment_method?.code, EndPoint?.payment_mollie_pay_order);
      console.log("response get way", response?.paymentredirect);
      setPaymentUrl(response?.paymentredirect);
      setPaymentUrlModal(true);
    } catch (error) {
      console.log("error", error.response.data);
    }

  }

  const handleNavigationPaymentChange = async (event) => {
    try {
      const result = await getOrderStatus(isOtherInfo?.order_id, EndPoint?.order_orderinformation);
      console.log("response my ", result?.status);
      if (result?.status) {
        setPaymentUrlModal(false);
        setPaymentUrl(null);
        const result = await onPlaceOrder(EndPoint?.success);
        updateCartCount(0);
        navigation.navigate("OrderConfirmation", {
          orderId: isOtherInfo?.order_id,
        });
      }

    } catch (error) {
      console.log("error", error.response.data);
    }


  };

  return (

    <>
      <View style={{ flex: 1 }}>
        <BackgroundWrapper>
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* <TitleBarName
                  onClickBackIcon={() => navigation.goBack()}
                  titleName={isLabel?.placeorderpagename_label}
                /> */}
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 5, gap: 16, marginTop: Platform.OS === "ios" ? 40 : 0, opacity: screenLoader ? 0.5 : 1 }}>
              <View style={{ marginTop: 30, marginLeft: 10 }}>
                <CustomHeader pageName={isLabel?.placeordersummary_heading} />
              </View>

              <View style={{ marginBottom: 0 }}></View>
              <View style={{ paddingHorizontal: 12 }}>
                <View style={{ width: "100%" }}>
                  <View style={{ gap: 10 }}>
                    <View
                      style={{
                        padding: 12,
                        // borderWidth: 1,
                        borderColor: Colors?.lightGray,
                        borderRadius: 8,
                      }}
                    >


                      {/* <View style={{ height: 40 }}>
                            <Text style={commonStyles.smallHeading}>
                              {isLabel?.placeordersummary_heading}
                            </Text>
                          </View> */}

                      {isProductInfo?.length > 0
                        ? isProductInfo?.map((item, index) => (
                          <GlassContainer
                            key={index}
                            style={{
                              // borderTopWidth: 1,
                              paddingVertical: 5,
                              borderColor: Colors?.lightGray,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: 10,
                              }}
                            >
                              <TouchableOpacity onPress={() => navigation.navigate("Product", { productId: item?.product_id, })}
                                style={{
                                  width: 80,
                                  height: 80,
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {item?.image ? (
                                  <Image
                                    source={{ uri: item?.image }}
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      resizeMode: "contain",
                                    }}
                                  />
                                ) : (
                                  <IconComponentImage size={36} />
                                )}
                              </TouchableOpacity>

                              <View style={{ width: '60%', gap: 6 }}>
                                <TouchableOpacity
                                  onPress={() =>
                                    navigation.navigate("Product", {
                                      productId: item?.product_id,
                                    })
                                  }
                                  style={{ width: '100%' }}
                                >
                                  <Text style={commonStyles.smallHeading}>
                                    {item?.name}
                                  </Text>
                                </TouchableOpacity>

                                <View style={{
                                  width: '100%', flexDirection: 'row', justifyContent: "space-between",
                                  alignItems: "center",
                                }}>
                                  <View style={{ gap: 5, width: "40%", }}>
                                    <Text style={commonStyles.text}>
                                      {isLabel?.placeorderquantity_label}:{" "}
                                    </Text>
                                    <Text style={commonStyles.text}>
                                      {isLabel?.placeorderprice_label}:{" "}
                                    </Text>
                                    <Text style={commonStyles.text}>
                                      {isLabel?.placeordertotal_label}:{" "}
                                    </Text>
                                  </View>

                                  <View
                                    style={{
                                      alignItems: "flex-end",
                                      gap: 5,
                                      width: "50%",
                                    }}
                                  >
                                    <Text style={commonStyles.text}>
                                      {item?.quantity}
                                    </Text>


                                    <Text style={commonStyles.text}>
                                      {item.price && (
                                        <PriceView
                                          priceHtml={item.price}
                                          textStyle={{ fontWeight: '700' }}
                                        />
                                      )}
                                    </Text>
                                    <Text style={commonStyles.text}>
                                      {item?.total && (
                                        <PriceView
                                          priceHtml={item?.total}
                                          textStyle={{ fontWeight: '700' }}
                                        />
                                      )}
                                    </Text>
                                  </View>

                                </View>



                              </View>




                            </View>
                          </GlassContainer>
                        ))
                        : null}
                    </View>

                    <GlassContainer
                      style={{
                        padding: 10,
                        // borderWidth: 1,
                        borderColor: Colors.lightGray,
                        borderRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          borderBottomWidth: 1,
                          borderColor: Colors.lightGray,
                        }}
                      >
                        <Text style={commonStyles.smallHeading}>
                          {isLabel?.placeorderpaysumary_heading}
                        </Text>
                      </View>
                      {isTotalsInfo?.length > 0
                        ? isTotalsInfo?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              paddingVertical: 5,
                            }}
                          >
                            <View style={{ width: '70%' }}>
                              <Text style={commonStyles.text}>
                                {item?.title}:
                              </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                              <Text style={commonStyles.text}>
                                {item?.text && (
                                  <PriceView
                                    priceHtml={item?.text}
                                    textStyle={{ fontWeight: '700' }}
                                  />
                                )}
                              </Text>
                            </View>
                          </View>
                        ))
                        : null}
                    </GlassContainer>

                    <GlassContainer
                      style={{
                        padding: 10,
                        // borderWidth: 1,
                        borderColor: Colors.lightGray,
                        borderRadius: 8,
                      }}
                    >
                      <View
                        style={{
                          height: 40,
                          borderBottomWidth: 1,
                          borderColor: Colors.lightGray,
                        }}
                      >
                        <Text style={commonStyles.smallHeading}>
                          {isLabel?.placeorderpayinfo_heading}
                        </Text>
                      </View>
                      <View style={{ gap: 5, paddingVertical: 12 }}>
                        <Text style={commonStyles.text}>
                          {isLabel?.placeorderpaymethod_label}
                        </Text>
                        <Text style={commonStyles.smallHeading}>
                          {isOtherInfo?.payment_method?.title}
                        </Text>
                      </View>
                    </GlassContainer>

<GlassContainer
  style={{
    padding: 12,
    borderColor: Colors.lightGray,
    borderRadius: 8,
  }}
>
  {/* HEADER */}
  <View
    style={{
      height: 40,
      borderBottomWidth: 1,
      borderColor: Colors.lightGray,
      justifyContent: "center",
    }}
  >
    <Text style={commonStyles.smallHeading}>
      {isLabel?.placeorderpayshipaddres_heading}
    </Text>
  </View>

  {/* BODY */}
  <View style={{ gap: 12, paddingVertical: 12 }}>
    {/* PAYMENT ADDRESS */}
    {!isOtherInfo?.sameaddrssstatus && (
      <View
        style={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 8,
        }}
      >
        <IconComponentLocation
          size={20}
          color={Colors.primary}
          style={{ marginTop: 2 }}
        />
        <Text
          style={{
            flex: 1,
            color: "#fff",
            lineHeight: 18,
          }}
        >
          {isOtherInfo?.payment_address}
        </Text>
      </View>
    )}

    {/* SHIPPING ADDRESS */}
    <View
      style={{
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      <IconComponentLocation
        size={20}
        color={Colors.primary}
        style={{ marginTop: 2 }}
      />
      <Text
        style={{
          flex: 1,
          color: "#fff",
          lineHeight: 18,
        }}
      >
        {isOtherInfo?.shipping_address}
      </Text>
    </View>
  </View>
</GlassContainer>


                    {/* <TouchableOpacity onPress={createCheckoutSession}>
                      <Text>testing payment method</Text>
                    </TouchableOpacity> */}

                    <View style={{ marginBottom: 30, marginTop: 30, paddingHorizontal: 14 }}>
                      <CustomButton
                        btnDisabled={screenLoading}
                        OnClickButton={() => onClickPlaceOrder()}
                        // OnClickButton={() => openPaymentGetwayScreen()}

                        buttonStyle={{
                          w: "100%",
                          h: 50,
                          backgroundColor: Colors.primary,
                          borderRadius: 12,
                        }}
                        buttonText={isLabel?.confirmorderbtn_label}
                      />
                    </View>



                  </View>
                </View>
              </View>

            </ScrollView>
          </KeyboardAvoidingView>
        </BackgroundWrapper>
      </View>

      {/*paypal modal */}

      <Modal
        visible={isPaypalModal}
        transparent={true}
        animationType={"slide"}
        onRequestClose={() => {
          setPaypalModal(false);
          setPaypalUrl(null);
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
            justifyContent: "center",
          }}
        >
          {!paypalUrl ? (
            <ActivityIndicator size="large" color="blue" />
          ) : (
            <WebView
              source={{ uri: paypalUrl }}
              onNavigationStateChange={
                handleNavigationChange
                //     navState => {
                //     if (navState.url.includes('return_url')) {
                //         // Handle success
                //         navigation.goBack();
                //     } else if (navState.url.includes('cancel_url')) {
                //         // Handle cancel
                //         navigation.goBack();
                //     }
                // }
              }
            />
          )}
        </View>
      </Modal>

      <FailedModal
        isModal={isErrorModal}
        isSuccessMessage={isError}
        handleCloseModal={() => {
          setErrorModal(false);
          setError();
        }}
        onClickClose={() => {
          setErrorModal(false);
          setError();
        }}
      />

      {/* razorpay modal */}
      <SuccessModal
        isModal={isRazorPayDataModal}
        isSuccessMessage={`Transaction id : ${isRazorPayData?.razorpay_payment_id}`}
        onClickClose={confirmRazorPay}
        handleCloseModal={confirmRazorPay}
      />

      {/* paypal modal */}

      <SuccessModal
        isModal={isPaypalSuccessMgsModal}
        isSuccessMessage={isPaypalSuccessMgs}
        onClickClose={confirmPaypalPayment}
        handleCloseModal={confirmPaypalPayment}
      />

      {/* {showTabbyModal && (
        <TabbyPaymentWebView
          url={tabbyCheckoutUrl}
          onBack={() => setShowTabbyModal(false)}
          onResult={(status) => {
            if (status === 'authorized') {
              setShowTabbyModal(false);
              updateCartCount(0);
              navigation.replace("OrderConfirmation", {
                orderId: isOtherInfo?.order_id,
              });
            }

            if (status === 'rejected') {
              Alert.alert("Payment Rejected", "Tabby rejected the payment");
            }

            if (status === 'close') {
              setShowTabbyModal(false);
            }

            if (status === 'expired') {
              handleTabbyPayment(); // recommended by Tabby
            }
          }}
        />
      )} */}


      {showTabby && (
        <Modal visible animationType="slide">
          <TabbyPaymentWebView
            url={tabbyUrl}
            onBack={() => setShowTabby(false)}
            onResult={(result) => {
              console.log("Tabby result:", result);

              if (result === "authorized") {
                // ✅ Payment approved
                // → call your placeOrder API
              }

              if (result === "rejected") {
                // ❌ Show failure message
              }

              if (result === "close") {
                // User closed Tabby
              }

              if (result === "expired") {
                // Create new session
              }

              setShowTabby(false);
            }}
          />
        </Modal>
      )}

      {/* <PaymentUrlModal url={isPaymentUrl} modalVisible={isPaymentUrlModal} setModalVisible={setPaymentUrlModal} handleNavigationChange={handleNavigationPaymentChange} />
          {isKekspayModal && <KekspayModal visible={isKekspayModal} onClose={() => setKekspayModal(false)} data={isKekspayData} order_id={isOtherInfo?.order_id} paymentMethod={isOtherInfo?.payment_method?.code} paymentTitle={isOtherInfo?.payment_method?.title} totalAmount={isTotalPrice} />} */}

      <NotificationAlert />
    </>

  );
};

export default OrderPlace;
