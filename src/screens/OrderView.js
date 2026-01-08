import { View, Text, ScrollView, Alert, Platform, useWindowDimensions, Animated } from 'react-native'
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
    const scrollY = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            fetchOrderInformationTextAndInformation();
        }, [language, currency])
    );

    const fetchOrderInformationTextAndInformation = async () => {
        try {
            setLoading(true);
            const result = await getOrderStatus(orderId, EndPoint?.order_orderinformation);
            console.log("response my ", result);
            setLabel(result?.text);
            setOrderInfo(result);
        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
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
            const user = await _retrieveData("USER");
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user ? user[0]?.customer_id : null,
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

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) :
                    <>
                        <View style={[commonStyles.bodyConatiner,]}>
                            <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                                <TopStatusBar
                                    onChangeCurren={handleOnChangeCurrency}
                                    onChangeLang={handleOnChangeLang}
                                    scrollY={scrollY}
                                />
                            </View>
                            <TitleBarSearchComponent titleName={isLabel?.orderinfopagename_label} Component1={CartButton} onClickBackIcon={() => handleGoBack()} />
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
                                                onClickCancelBtn={(productId) => navigation.navigate('ReturnOrder', { productId: productId, orderId: isOrderInfo?.order_id })} />
                                            <PaymentSummary label={isLabel} data={isOrderInfo?.totals} />
                                            <PaymentInformation label={isLabel} data={isOrderInfo} />
                                            <ShippingAddress label={isLabel} data={isOrderInfo} />
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <View>
                                                    <Text style={commonStyles.smallTextBlackBold}>{isLabel?.orderinfoorderstatus_label}: {isOrderInfo?.status}</Text>
                                                </View>
                                            </View>

                                        </View>
                                    </View>
                                </ScrollView>
                            </Animated.ScrollView>

                        </View>
                        <BottomBar />

                        <SuccessModal
                            handleCloseModal={closeSuccessModal}
                            isModal={showModal}
                            isSuccessMessage={isMessage}
                            onClickClose={closeSuccessModal}
                        />
                        <NotificationAlert />
                    </>
            }

        </>
    )
}

export default OrderView