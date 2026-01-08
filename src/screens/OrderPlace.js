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



  useEffect(() => {
    checkAutoLogin();
    fetchAllOrderSummary();
  }, []);

  const fetchAllOrderSummary = async () => {
    try {
      setLoading(true);
      const result = await getOrderSummaries(EndPoint?.confirm);
      console.log("confirm api response", result?.totalsprice);
      setProductInfo(result?.products);
      setTotalsInfo(result?.totals);
      setOtherInfo(result);
      setLabel(result?.text);
      setTotalPrice(result?.totalsprice);
    } catch (error) {
      alert(GlobalText?.extrafield_somethingwrong);
    } finally {
      setLoading(false);
    }
  };



  const onClickPlaceOrder = async () => {
    try {
      setScreenLoading(true);
      const user = await _retrieveData("USER");
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
            cur?.code,
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

        default:
          // Code to run if no case matches
          return;

      }
    } catch (error) {
      console.log("error : ", error.response.data);
    } finally {
      setScreenLoading(false);
    }
  };

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
      {loading ? (
        <CustomActivity />
      ) : (
        <>
          <View style={commonStyles.bodyConatiner}>
            <TitleBarName
              onClickBackIcon={() => navigation.goBack()}
              titleName={isLabel?.placeorderpagename_label}
            />
            <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
              <View style={{ paddingHorizontal: 12 }}>
                <View style={{ width: "100%", marginVertical: 12 }}>
                  <View style={{ gap: 10 }}>
                    <View
                      style={{
                        padding: 12,
                        borderWidth: 1,
                        borderColor: Colors?.lightGray,
                        borderRadius: 8,
                      }}
                    >
                      <View style={{ height: 40 }}>
                        <Text style={commonStyles.smallHeading}>
                          {isLabel?.placeordersummary_heading}
                        </Text>
                      </View>

                      {isProductInfo?.length > 0
                        ? isProductInfo?.map((item, index) => (
                          <View
                            key={index}
                            style={{
                              borderTopWidth: 1,
                              paddingVertical: 12,
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
                                      {item?.price}
                                    </Text>
                                    <Text style={commonStyles.text}>
                                      {item?.total}
                                    </Text>
                                  </View>

                                </View>



                              </View>




                            </View>
                          </View>
                        ))
                        : null}
                    </View>

                    <View
                      style={{
                        padding: 12,
                        borderWidth: 1,
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
                                {item?.text}
                              </Text>
                            </View>
                          </View>
                        ))
                        : null}
                    </View>

                    <View
                      style={{
                        padding: 12,
                        borderWidth: 1,
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
                    </View>

                    <View
                      style={{
                        padding: 12,
                        borderWidth: 1,
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
                          {isLabel?.placeorderpayshipaddres_heading}
                        </Text>
                      </View>
                      <View style={{ gap: 5, paddingVertical: 12 }}>
                        {!isOtherInfo?.sameaddrssstatus ? (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 5,
                                alignItems: "center",
                              }}
                            >
                              <IconComponentLocation
                                size={24}
                                color={Colors.primary}
                              />
                            </View>
                            <Text style={commonStyles.text}>
                              {isOtherInfo?.payment_address}
                            </Text>
                          </>
                        ) : null}
                        <View
                          style={{
                            flexDirection: "row",
                            gap: 5,
                            alignItems: "center",
                          }}
                        >
                          <IconComponentLocation
                            size={24}
                            color={Colors.primary}
                          />
                        </View>
                        <Text style={commonStyles.text}>
                          {isOtherInfo?.shipping_address}
                        </Text>
                      </View>
                    </View>
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

            </ScrollView>
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

          <PaymentUrlModal url={isPaymentUrl} modalVisible={isPaymentUrlModal} setModalVisible={setPaymentUrlModal} handleNavigationChange={handleNavigationPaymentChange} />
          {isKekspayModal && <KekspayModal visible={isKekspayModal} onClose={() => setKekspayModal(false)} data={isKekspayData} order_id={isOtherInfo?.order_id} paymentMethod={isOtherInfo?.payment_method?.code} paymentTitle={isOtherInfo?.payment_method?.title} totalAmount={isTotalPrice} />}

          <NotificationAlert />
        </>
      )}
    </>
  );
};

export default OrderPlace;
