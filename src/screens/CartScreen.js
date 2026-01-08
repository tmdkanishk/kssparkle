import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Platform, Modal, useWindowDimensions, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyles from '../constants/CommonStyles'
import Cart from '../components/Cart'
import BottomBar from '../components/BottomBar';
import TopStatusBar from '../components/TopStatusBar'
import { IconComponentImage, IconComponentTrash } from '../constants/IconComponents'
import Coupon from '../components/Coupon'
import CustomText from '../components/CustomText'
import CustomButton from '../components/CustomButton'
import TitleBarSearchComponent from '../components/TitleBarSearchComponent'
import { useCustomContext } from '../hooks/CustomeContext'
import { useFocusEffect } from '@react-navigation/native'
import { _clearData, _retrieveData, _storeData } from '../utils/storage'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import CustomActivity from '../components/CustomActivity'
import { removeProductFromCart } from '../services/removeProductFromCart'
import { Picker } from '@react-native-picker/picker';
import { editProductQty } from '../services/editProductQty'
import { applyVoucher } from '../services/applyVoucher'
import { appyCoupon } from '../services/appyCoupon'
import FailedModal from '../components/FailedModal'
import SuccessModal from '../components/SuccessModal'
import { checkAutoLogin } from '../utils/helpers'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import { useCartCount } from '../hooks/CartContext'



const CartScreen = ({ navigation }) => {
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { updateCartCount } = useCartCount();
    const size = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const [isLogin, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [isTotal, setTotal] = useState();
    const [isCartProducts, setCartProducts] = useState();
    const [isCouponData, setCouponData] = useState(false);
    const [isGiftData, setGiftData] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isSuccessModal, setSuccessModal] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [isCartAnimation, setCartAnimation] = useState(false);
    const [isQtyModal, setQtyModal] = useState(false);
    const [isCartID, setCartID] = useState(null);
    const [isCouponError, setCouponError] = useState(null);
    const [isGiftError, setGiftError] = useState(null);
    const [intitalCall, setIntitalCall] = useState(true);
    const [screenLoader, setScreenLoader] = useState(false);
    const [showCouponOption, setShowCouponOption] = useState(false);
    const [showGiftOption, setShowGiftOption] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;


    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            checkUserLogin();
            fetchCartData();
        }, [language, currency])
    );

    const checkUserLogin = async () => {
        const data = await _retrieveData("USER");
        if (data != null) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const fetchCartData = async () => {
        try {
            if (intitalCall) {
                setLoading(true);
                setIntitalCall(false);
            }

            const url = `${BASE_URL}${EndPoint?.cart}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData('USER');
            const sessionId = await _retrieveData('SESSION_ID');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user ? user[0].customer_id : null,
                sessionid: sessionId
            }

            const response = await axios.post(url, body, { headers: headers });
            console.log("response", response.data);
            if (response.status === HttpStatusCode.Ok) {
                setShowCouponOption(response.data?.applycoupon_status);
                setShowGiftOption(response.data?.applyvoucher_status);
                setLabel(response.data?.text);
                setTotal(response.data?.totals);
                setCartProducts(response.data?.products);
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false)
        }
    }

    const removeProduct = async (cartId) => {
        try {
            setScreenLoader(true);
            const response = await removeProductFromCart(cartId, EndPoint?.cart_remove);
            updateCartCount(response?.cartproductcount);
            fetchCartData();
        } catch (error) {
            console.log("error", error.message);
        } finally {
            setScreenLoader(false);
        }
    }

    const onChangeQty = async (cartId, selectedQty) => {
        try {
            setScreenLoader(true);
            const result = await editProductQty(cartId, selectedQty, EndPoint?.cart_edit);
            console.log(result);
            updateCartCount(result?.cartproductcount);
            setCartAnimation(true);
            setSuccessMgs(result?.success);
            setSuccessModal(true);

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setScreenLoader(false);
        }

    }

    const applyVoucherCode = async (voucher) => {
        try {
            setScreenLoader(true);
            const result = await applyVoucher(voucher, EndPoint?.cart_voucher);
            setSuccessMgs(result?.success);
            setSuccessModal(true);
        } catch (error) {
            if (error.response.data?.error) {
                setGiftError(error.response.data?.error);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setScreenLoader(false);
        }
    }

    const applyCouponCode = async (coupon) => {
        try {
            setScreenLoader(true);
            const result = await appyCoupon(coupon, EndPoint?.cart_coupon);
            setSuccessMgs(result?.success);
            setSuccessModal(true);
        } catch (error) {
            console.log("error", error.response.data);
            if (error.response.data?.error) {
                setCouponError(error.response.data?.error);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setScreenLoader(false);
        }
    }

    const onClickSuccessModal = () => {
        setSuccessMgs(null)
        setSuccessModal(false);
        fetchCartData();
    }

    const CartButton = () => {
        return (
            <Cart isCartAnimation={isCartAnimation} />
        )
    }

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={[commonStyles.bodyConatiner]}>
                            <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                                <TopStatusBar scrollY={scrollY} onChangeCurren={handleOnChangeCurrency} onChangeLang={handleOnChangeLang} />
                            </View >
                            <TitleBarSearchComponent titleName={isLabel?.cartpagename_label} Component1={CartButton} onClickBackIcon={() => navigation.goBack()} />

                            {isCartProducts?.length > 0 ? (
                                <Animated.ScrollView
                                    showsVerticalScrollIndicator={false}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                        { useNativeDriver: false }
                                    )}
                                >
                                    <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoader ? 0.5 : 1, }}>
                                        <View style={{ paddingHorizontal: isLandscape ? 30 : 12, marginBottom: 100 }}>
                                            <View style={{ marginVertical: 12 }}>
                                                <Text style={commonStyles.heading}>{isLabel?.cartshoping_heading}</Text>
                                            </View>
                                            {
                                                isCartProducts?.length > 0 ? (
                                                    isCartProducts?.map((item, index) => (
                                                        <View key={index} style={{ borderWidth: 1, borderColor: Colors.gray, height: 'auto', borderRadius: 5, padding: 10, marginTop: 12, }}>
                                                            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                                                <TouchableOpacity disabled={screenLoader} onPress={() => navigation.navigate({
                                                                    name: 'Product',
                                                                    key: `ProductDetail-${item?.product_id}`,
                                                                    params: { productId: item?.product_id }
                                                                })} style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center' }}>
                                                                    {
                                                                        item?.thumb ? (
                                                                            <Image source={{ uri: item?.thumb }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                                                        ) : (
                                                                            <IconComponentImage size={36} />
                                                                        )
                                                                    }
                                                                </TouchableOpacity>
                                                                <View style={{ width: '60%' }}>
                                                                    <View>
                                                                        <TouchableOpacity disabled={screenLoader} onPress={() => navigation.navigate({
                                                                            name: 'Product',
                                                                            key: `ProductDetail-${item?.product_id}`,
                                                                            params: { productId: item?.product_id }
                                                                        })}>
                                                                            <Text style={commonStyles.smallHeading}>{item?.name}</Text>
                                                                        </TouchableOpacity>
                                                                        <Text style={commonStyles.text}>{item?.reward ? item?.reward + " | " : null}{isLabel?.cartmodel_label}: {item?.model}</Text>
                                                                        {
                                                                            item?.option?.length > 0 ? (
                                                                                item?.option?.map((optItem, index) => (
                                                                                    <Text key={index} style={commonStyles.text}>{optItem?.name} : {optItem?.value}</Text>
                                                                                ))
                                                                            ) : null
                                                                        }

                                                                        {/* <View style={{ flexDirection: 'row', gap: 5 }}>
                                                                        <Text style={commonStyles.smallHeading}>{item?.special !== false ? item?.special : item?.price}</Text>
                                                                        {
                                                                            item?.special != false ? (
                                                                                <View style={{ justifyContent: 'flex-end' }}>
                                                                                    <Text style={{ color: Colors.iconColor, fontSize: 13, textDecorationLine:'line-through' }}>{item?.price}</Text>
                                                                                </View>
                                                                            ) : null
                                                                        }
                                                                    </View> */}
                                                                    </View>
                                                                </View>
                                                                <TouchableOpacity disabled={screenLoader} onPress={() => removeProduct(item?.cart_id)} style={{ width: '10%', }}>
                                                                    <IconComponentTrash color={Colors.error} />
                                                                </TouchableOpacity>

                                                            </View>
                                                            <View style={{ marginVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                                                                {
                                                                    Platform.OS === 'ios' ?
                                                                        <View style={{ width: '30%', position: 'relative' }}>
                                                                            <TouchableOpacity disabled={screenLoader} onPress={() => { setQtyModal(true); setCartID(item?.cart_id) }} style={{ borderWidth: 1, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                                                <Text>{item?.quantity}</Text>
                                                                            </TouchableOpacity>
                                                                        </View>
                                                                        :
                                                                        <View style={{ borderWidth: 1, width: '30%', height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Picker
                                                                                selectedValue={`${item?.quantity}`}
                                                                                onValueChange={(itemValue) => onChangeQty(item?.cart_id, itemValue)}
                                                                                style={{ width: '100%', height: 50, }}
                                                                            >
                                                                                {
                                                                                    size.map((item, index) => (
                                                                                        <Picker.Item key={index} label={item} value={`${item}`} style={{ height: 10 }} />
                                                                                    ))
                                                                                }
                                                                            </Picker>

                                                                        </View>

                                                                }


                                                                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                                                                    <View style={{ alignItems: 'flex-end' }}>
                                                                        <Text style={commonStyles.smallHeading}>{item?.total}</Text>
                                                                    </View>
                                                                    <View />

                                                                </View>
                                                            </View>
                                                        </View>
                                                    ))
                                                ) : null
                                            }

                                            {(showCouponOption || showGiftOption) && <View style={{ marginVertical: 24, gap: 10, zIndex: -1 }}>
                                                <Text style={commonStyles.heading}>{isLabel?.cartwhtnext_heading}</Text>
                                                <Text style={commonStyles.text}>
                                                    {isLabel?.cartchosediscnt_label}
                                                </Text>
                                            </View>}
                                            <View style={{ zIndex: -1, gap: 12 }}>
                                                {showCouponOption && <Coupon
                                                    headingText={isLabel?.cartcupon_heading}
                                                    btnText={isLabel?.cartcuponbtn_label}
                                                    placeholder={isLabel?.cartcupon_label}
                                                    onApplyDiscountCoupon={(text) => applyCouponCode(text)}
                                                    isShowData={isCouponData}
                                                    onClickIcon={() => setCouponData(!isCouponData)}
                                                    errorMessage={isCouponError}
                                                    setErrorMessage={setCouponError}
                                                    dissabled={screenLoader}
                                                />}


                                                {showGiftOption && <Coupon
                                                    headingText={isLabel?.cartgiftvoucher_heading}
                                                    btnText={isLabel?.cartgiftvoucherbtn_label}
                                                    placeholder={isLabel?.cartgiftvoucher_label}
                                                    onApplyDiscountCoupon={(text) => applyVoucherCode(text)}
                                                    isShowData={isGiftData}
                                                    onClickIcon={() => setGiftData(!isGiftData)}
                                                    errorMessage={isGiftError}
                                                    setErrorMessage={setGiftError}
                                                    dissabled={screenLoader}
                                                />}

                                            </View>

                                            <View style={{ borderWidth: 1, borderColor: Colors.lightGray, marginVertical: 24, borderRadius: 4 }}>

                                                {isTotal?.length > 0 ? isTotal?.map((item, index) => (
                                                    <View key={index} style={{ width: "100%", flexDirection: "row", }}>
                                                        <View style={{ borderRightWidth: 1, borderColor: Colors.gray, width: "60%", }}>
                                                            <View style={{ flex: 1, borderColor: Colors.gray, borderBottomWidth: isTotal?.length - 1 === index ? 0 : 1, justifyContent: "center", paddingLeft: 12, }}>
                                                                <Text style={commonStyles.smallHeading}>
                                                                    {item?.title}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                        <View style={{ width: "40%" }}>
                                                            <View style={{ flex: 1, borderColor: Colors.gray, borderBottomWidth: isTotal?.length - 1 === index ? 0 : 1, justifyContent: "center", paddingRight: 12, paddingVertical: 10, alignItems: 'flex-end' }}>
                                                                <Text style={[commonStyles.textPrimary, { color: Colors.primary, },]}>{item?.text}</Text>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                                    : null}
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                                <CustomButton btnDisabled={screenLoader} buttonStyle={{ w: '40%', h: 50, backgroundColor: Colors?.cartBtnBgColor, borderRadius: 8, }} buttonText={isLabel?.cartcontinueshopingbtn_label} btnTextStyle={{ color: Colors.cartBtnText }} OnClickButton={() => navigation.navigate('Home')} />
                                                <CustomButton btnDisabled={screenLoader} buttonStyle={{ w: '55%', h: 50, backgroundColor: Colors?.primary, borderRadius: 8 }} buttonText={isLabel?.cartcheckoutbtn_label} OnClickButton={() => isLogin ? navigation.navigate('Checkout') : navigation.navigate('Login')} />
                                            </View>
                                        </View>

                                    </ScrollView >
                                </Animated.ScrollView>

                            ) : (
                                <View style={{ width: '100%', height: 'auto', alignItems: 'center', justifyContent: 'center' }}>
                                    <View style={{ width: 200, height: 300, alignSelf: 'center' }}>
                                        <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                                    </View>
                                    <Text style={{ textAlign: 'center', marginHorizontal: 20, marginTop: 10, fontSize: 20, fontWeight: '600' }}>{GlobalText?.extrafield_emptycart_label}</Text>
                                </View>
                            )
                            }


                        </View >
                        <BottomBar tab={4} />


                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={isQtyModal}
                            onRequestClose={() => setQtyModal(false)} // For Android back button
                        >

                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', backgroundColor: '#rgba(0,0,0,0.5)' }}>
                                <View style={{ width: '80%', maxHeight: 300, paddingHorizontal: 12, alignSelf: 'center', backgroundColor: 'white' }}>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {
                                            size.map((item, index) => (
                                                <TouchableOpacity onPress={() => { setQtyModal(false); onChangeQty(isCartID, item); }} key={index} style={{ paddingVertical: 12 }}>
                                                    <Text>{item}</Text>
                                                </TouchableOpacity>
                                            ))
                                        }
                                    </ScrollView>
                                </View>

                            </View>
                        </Modal>

                        <FailedModal
                            isModal={isErrorModal}
                            isSuccessMessage={isErrorMgs}
                            onClickClose={() => { setErrorModal(false); setErrorMgs() }}
                            handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}

                        />

                        <SuccessModal
                            isModal={isSuccessModal}
                            isSuccessMessage={isSuccessMgs}
                            handleCloseModal={() => onClickSuccessModal()}
                            onClickClose={() => onClickSuccessModal()}
                        />


                        <NotificationAlert />
                    </ >

                )
            }

        </>

    )
}

export default CartScreen