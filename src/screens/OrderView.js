import { View, Text, ScrollView, Alert, Platform, useWindowDimensions, Animated, Modal, TouchableOpacity, Image, ImageBackground, StyleSheet, FlatList } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopStatusBar from '../components/TopStatusBar'
import TitleBarSearchComponent from '../components/TitleBarSearchComponent'
import BottomBar from '../components/BottomBar'
import commonStyles from '../constants/CommonStyles'
import Cart from '../components/Cart'
import DowloadInvoiceCard from '../components/DowloadInvoiceCard'
import OrderSummary from '../components/OrderSummary'
import PaymentSummary from '../components/PaymentSummary'
import PaymentInformation from '../components/PaymentInformation'
import ShippingAddress from '../components/ShippingAddress'
import { useCustomContext } from '../hooks/CustomeContext'
import { _clearData, _retrieveData, _storeData } from '../utils/storage'
import { useFocusEffect } from '@react-navigation/native'
import CustomActivity from '../components/CustomActivity'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import SuccessModal from '../components/SuccessModal'
import { checkAutoLogin, openInChrome } from '../utils/helpers'
import { getOrderStatus } from '../services/getOrderStatus'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import { useCartCount } from '../hooks/CartContext'
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper'
import CustomHeader from '../components/customcomponents/CustomHeader'
import { useLoading } from '../hooks/LoadingProvider'
import ReviewModal from '../components/ReviewModal'
import Video from 'react-native-video'

const OrderView = ({ navigation, route }) => {
    const { orderId } = route.params;
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint } = useCustomContext();
    const { updateCartCount } = useCartCount();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [isOrderInfo, setOrderInfo] = useState(null);
    const [showModal, setModal] = useState(false);
    const [isMessage, setMessage] = useState();
    const [isCartAnimation, setCartAnimation] = useState(false);
    const [isAddCartLoading, setAddCartLoading] = useState(false);
    const [reviewModal, setReviewModal] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const { setGlobalLoading } = useLoading();
    const [selectedOrderData, setSelectedOrderData] = useState(null);



    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            fetchOrderInformationTextAndInformation();
            // productDetailOrderReview(973);
        }, [language, currency])
    );


    const fetchOrderInformationTextAndInformation = async () => {
        try {
            setGlobalLoading(true);
            const result = await getOrderStatus(orderId, EndPoint?.order_orderinformation);
            console.log("response my ", result);
            setLabel(result?.text);
            setOrderInfo(result);
        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setGlobalLoading(false);
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value)
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const onClickReorderProduct = async (orderProductId) => {
        try {
            setAddCartLoading(true);
            const url = `${BASE_URL}${EndPoint?.order_reorder}`;
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
                order_id: orderId,
                order_product_id: orderProductId,
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                updateCartCount(response.data?.cartproductcount)
                setMessage(response.data?.success);
                setModal(true);
                setCartAnimation(true);
                setTimeout(() => {
                    closeSuccessModal();
                }, 2000)
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setAddCartLoading(false);
        }

    }

    const onClickDownloadInvoice = async (url) => {
        openInChrome(url);
    };

    const CartButton = () => {
        return (
            <Cart isCartAnimation={isCartAnimation} />
        )
    }

    const handleGoBack = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            navigation.replace('Home');
        }
    }

    const closeSuccessModal = () => {
        setModal(false);
        setMessage();
        setCartAnimation(false)
    }

    const handleTriggerReview = (orderData) => {
        console.log(orderData)
        setSelectedOrderData(orderData);
        setReviewModal(true);
    };

const handleTriggerViewReview = async (productId) => {
    const data = await productDetailOrderReview(productId);

    if (data) {
        navigation.navigate("ReviewMediaScreen", {
            images: data?.existing_review_images || [],
            videos: data?.existing_review_videos || []
        });
    }
};


    const productDetailOrderReview = async (productId) => {
        try {
            setGlobalLoading(true);
            const url = `${BASE_URL}${EndPoint?.productdetails_OrderReviews}`;
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
                order_id: orderId,
                product_id: productId || ""
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                console.log("RESPONSE OF PRODUCT DETAIL ORDER REVI", response.data)
                return response.data;
            }
            return null; // Return null if status is not Ok

        } catch (error) {
            console.log("error", error.response?.data);
            return null; // Return null on error
        } finally {
            setGlobalLoading(false);
        }
    }
    return (
        <>

            <>
                <BackgroundWrapper>
                    {/* <View style={[commonStyles.bodyConatiner,]}> */}

                    <View style={{ marginTop: 50 }}>
                        <CustomHeader pageName={isLabel?.orderinfoordersumry_heading} />
                    </View>



                    <Animated.ScrollView
                        showsVerticalScrollIndicator={false}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                    >
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ paddingHorizontal: 12, marginBottom: 100, opacity: isAddCartLoading ? 0.5 : 1 }}>
                                <View style={{ marginVertical: 24, gap: 24 }}>
                                    <DowloadInvoiceCard label={isLabel} onClickDownload={() => onClickDownloadInvoice('enter-url')} data={isOrderInfo} />
                                    <OrderSummary label={isLabel} data={isOrderInfo}
                                        onClickReorderBtn={(orderProductId) => onClickReorderProduct(orderProductId)}
                                        onClickCancelBtn={(productId) => navigation.navigate('ReturnOrder', { productId: productId, orderId: isOrderInfo?.order_id })}
                                        onTriggerReview={() => handleTriggerReview(isOrderInfo)}
                                        onTriggerViewReview={(productId) => handleTriggerViewReview(productId)}
                                    />
                                    <PaymentSummary label={isLabel} data={isOrderInfo?.totals} />
                                    <PaymentInformation label={isLabel} data={isOrderInfo} />
                                    <ShippingAddress label={isLabel} data={isOrderInfo} />
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <View>
                                            <Text style={commonStyles.textWhiteBold}>{isLabel?.orderinfoorderstatus_label}: {isOrderInfo?.status}</Text>
                                        </View>
                                    </View>

                                </View>
                            </View>
                        </ScrollView>
                    </Animated.ScrollView>

                    {/* </View> */}
                </BackgroundWrapper>

              



                <SuccessModal
                    handleCloseModal={closeSuccessModal}
                    isModal={showModal}
                    isSuccessMessage={isMessage}
                    onClickClose={closeSuccessModal}
                />
                <ReviewModal
                    visible={reviewModal}
                    onClose={() => setReviewModal(false)}
                    orderId={selectedOrderData?.order_id} // Pass the ID dynamically
                    productId={selectedOrderData?.products?.[0]?.product_id}
                // onReviewSuccess={fetchProductDetail} 
                />
                <NotificationAlert />
            </>


        </>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        height: '70%', // Shortened height as requested
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        padding: 15,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 10,
        borderBottomWidth: 1,
        borderColor: '#eee',
    },
    tab: {
        paddingVertical: 8,
        paddingHorizontal: 20,
    },
    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: 'blue',
    },
    reviewImage: {
        width: '30%',
        height: 100,
        margin: '1.5%',
        borderRadius: 8,
    },
    videoCard: {
        width: '100%',
        height: 200,
        backgroundColor: '#000',
        borderRadius: 10,
        marginBottom: 15,
        overflow: 'hidden',
    },
    videoPlayer: {
        width: '100%',
        height: '100%',
    },
    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIconText: {
        color: 'white',
        fontSize: 40,
    },
    modalImage: {
    width: '90%',
    height: 350,
},

videoPlayer: {
    width: '100%',
    height: '100%',
},

closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
},

playOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
},

playIconText: {
    color: 'white',
    fontSize: 40,
},

imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
},

videoModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
},

videoModalContainer: {
    width: '90%',
    height: 250,
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
},
header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
},
});


export default OrderView