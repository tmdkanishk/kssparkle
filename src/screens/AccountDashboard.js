import { View, Text, ScrollView, TouchableOpacity, Image, Modal, Share, Alert, Platform, useWindowDimensions, Animated } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopStatusBar from '../components/TopStatusBar'
import commonStyles from '../constants/CommonStyles'
import ImageContainer from '../components/ImageContainer'
import CardInfo from '../components/CardInfo'
import OrderFeatureCard from '../components/OrderFeatureCard'

import {
    IconComponentAddress,
    IconComponentClose,
    IconComponentCoin,
    IconComponentDocs,
    IconComponentDownload,
    IconComponentEdit,
    IconComponentHeart,
    IconComponentHelp,
    IconComponentImage,
    IconComponentLogout,
    IconComponentNotification,
    IconComponentPassword,
    IconComponentRate,
    IconComponentRupee,
    IconComponentSettings,
    IconComponentShare,
    IconComponentTrash,
    IconComponentUpload,
    IconComponentUser
} from '../constants/IconComponents'
import TitleBarComponent from '../components/TitleBarComponent'
import { useCustomContext } from '../hooks/CustomeContext'
import { API_KEY, BASE_URL } from '../utils/config'
import { _clearData, _retrieveData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import InputBox from '../components/InputBox'
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { getUserInfo } from '../services/getUserInfo'
import CustomActivity from '../components/CustomActivity'
import { updateUserInfomation } from '../services/updateUserInfomation'
import SuccessModal from '../components/SuccessModal'
import FailedModal from '../components/FailedModal'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { checkAutoLogin } from '../utils/helpers'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import { getCartItem } from '../services/getCartItem'
import { useCartCount } from '../hooks/CartContext'

const AccountDashboard = ({ navigation }) => {
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { updateCartCount } = useCartCount();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors, Features, EndPoint, GlobalText, SetLogin } = useCustomContext();
    const [notification, setNotification] = useState(true);
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [userInfoLabel, setUserInfoLabel] = useState();
    const [modalVisible, setModalVisible] = useState(false);
    const [enableUpdate, setEnableUpdate] = useState(false);
    const [orderStatus, setOrderStatus] = useState();
    const [userInfo, setUserInfo] = useState();
    const [isSuccessModal, setSuccessModal] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [totalCoins, setTotalCoins] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        telephone: '',
        image: ''
    });

    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            fetchUserInfo();
            fatchAccountDashboard();
        }, [language, currency])
    );

    const handleInputChange = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const fatchAccountDashboard = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.accountdashboard}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData('CUSTOMER_ID');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user,
                sessionid: sessionId,
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data.text);
                console.log("account dashboard", response.data.text);
                setOrderStatus(response.data?.orderstatusname);
                setTotalCoins(response.data?.coins_total.toString());
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const fetchUserInfo = async () => {
        try {
            const result = await getUserInfo(EndPoint?.accountdashboard_userdetailsedit);
            setUserInfo(result?.customer_info[0]);
            setFormData({
                email: result?.customer_info[0]?.email,
                firstname: result?.customer_info[0]?.firstname,
                lastname: result?.customer_info[0]?.lastname,
                telephone: result?.customer_info[0]?.telephone,
                image: result?.customer_info[0]?.image,
            })
            setUserInfoLabel(result?.text);
        } catch (error) {
            console.log('error', error.response.data);
        }
    }

    const pickImage = async () => {
        // Request permission to access the media library
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permissionResult.granted) {
            alert("Permission to access media library is required!");
            return;
        }

        // Open the image picker
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        if (!result.canceled) {
            handleInputChange('image', result.assets[0].uri);
        }
    };

    const shareContent = async () => {
        try {
            const result = await Share.share({
                message: 'https://play.google.com/store/apps/details?id=demo.opencart.android.app&pcampaignid=web_share',
                url: 'https://play.google.com/store/apps/details?id=demo.opencart.android.app&pcampaignid=web_share', // Optional, for sharing links
                title: 'Opencart App',  // Optional, for Android
            });

            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    console.log('Shared with activity type:', result.activityType);
                } else {
                    console.log('Shared successfully!');
                }
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed.');
            }
        } catch (error) {
            Alert.alert("", GlobalText?.extrafield_somethingwrong, [{ text: GlobalText?.extrafield_okbtn, onPress: () => { console.log('ok pressed!') } }]);
        }
    };

    const handleOnChangeLang = (value) => {
        changeLanguage(value)
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const onClickLogout = async () => {
        Alert.alert(
            GlobalText?.extrafield_logout,
            GlobalText?.extrafield_doyouwantlogout,
            [
                { text: GlobalText?.extrafield_cancelbtn, onPress: () => console.log('cancel pressed!') },
                { text: GlobalText?.extrafield_okbtn, onPress: () => onClickOkButton() }
            ]
        );
    }

    const onClickOkButton = async () => {
        await _clearData('USER');
        await logout(EndPoint?.logout);
        SetLogin(false);
        const cartresponse = await getCartItem(EndPoint?.cart_total);
        updateCartCount(cartresponse?.cartproductcount);
        navigation.navigate('Login');
    }

    const iconComponentnotification = () => {
        return (
            <View style={{ flexDirection: 'row' }}>
                <IconComponentNotification />
                {
                    notification ? (
                        <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary, marginLeft: -10, marginTop: 2 }} />
                    ) : null
                }
            </View>
        )
    }

    const onClickUpdateProfile = async () => {
        try {
            setLoading(true);
            const result = await updateUserInfomation(formData, EndPoint?.accountdashboard_userdetailseditValidation);
            setSuccessModal(true);
            setSuccessMgs(result?.success?.message);
            setTimeout(() => {
                onClickModalClose();
            }, 2000);
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true);
        } finally {
            setLoading(false);
            setEnableUpdate(false);
            setModalVisible(false);
        }
    }

    const onClickModalClose = () => {
        fetchUserInfo();
        setSuccessModal(false);
        setSuccessMgs();
    }

    const onClickErrorModalClose = () => {
        setErrorModal(false);
        setErrorMgs();
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
                            </View>
                            <TitleBarComponent titleName={isLabel?.acntdbpagename_label} onClickBackIcon={() => navigation.goBack()} Component1={iconComponentnotification} onClickIcon1={() => navigation.navigate('Notification')} />
                            <Animated.ScrollView
                                showsVerticalScrollIndicator={false}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: false }
                                )}
                                bounces={false}
                            >
                                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                                    <View style={{ paddingHorizontal: 12, marginBottom: 24 }}>
                                        <View style={{ alignItems: 'center', marginVertical: 20, gap: 10 }}>
                                            <ImageContainer img={{ uri: `${userInfo?.image}?t=${new Date().getTime()}` }} imgStatus={userInfo?.image ? true : false} />
                                            <View style={{ gap: 2, alignItems: 'center' }}>
                                                <Text style={commonStyles.smallHeading}>{`${userInfo?.firstname} ${userInfo?.lastname}`}</Text>
                                                <Text style={[commonStyles.text, { color: Colors.iconColor }]}>{userInfo?.telephone}</Text>
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                                            <CardInfo
                                                width={'48%'}
                                                heading={`${totalCoins} ${isLabel?.acntdbshopcoin_label}`}
                                                desc={isLabel?.acntdbshopcoin_heading}
                                                headingTextStyle={commonStyles.smallTextBlackBold}
                                                iconConWidth={40}
                                                iconConHeight={40}
                                                iconConRadius={20}
                                                desTextStyle={commonStyles.smallTextBlack}
                                                dissable={true}
                                            />

                                            <CardInfo
                                                width={'48%'}
                                                onClick={() => setModalVisible(true)}
                                                heading={isLabel?.acntdbuserdetails_label}
                                                desc={isLabel?.acntdbeditbtn_label}
                                                headingTextStyle={commonStyles.smallTextBlackBold}
                                                iconConWidth={40}
                                                iconConHeight={40}
                                                iconConRadius={20}
                                                backgroundColor={Colors.lightHoney} borderColor={Colors.wheat} iconConBgcolor={Colors.salmon}
                                                IconComponent={IconComponentUser} desTextStyle={commonStyles.smallTextBlack}
                                            />

                                        </View>

                                        <View style={{ width: '100%', borderWidth: 1, marginVertical: 24, borderRadius: 8, borderColor: Colors.gray, padding: 10 }}>
                                            <View style={{ borderBottomWidth: 1, borderColor: Colors.gray, height: 40, marginBottom: 20 }}>
                                                <Text style={commonStyles.smallHeading}>{isLabel?.acntdbmyorders_heading}</Text>
                                            </View>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                                                {
                                                    orderStatus?.length > 0 ? (
                                                        orderStatus.map((item, index) => (
                                                            <View key={index} style={{ width: '48%', borderWidth: 1, alignItems: 'center', padding: 10, borderRadius: 10, gap: 6, borderColor: Colors.gray }}>
                                                                <FontAwesome name={item?.icon ? item?.icon : 'file-image-o'} size={28} color="black" />
                                                                <Text style={{ fontSize: 18 }}>{item?.name}  {item?.orderscount ? item?.orderscount?.total : 0}</Text>
                                                            </View>
                                                        ))
                                                    ) : null

                                                }
                                            </View>
                                        </View>

                                        <View style={{ width: '100%', borderWidth: 1, marginVertical: 24, borderRadius: 8, borderColor: Colors.gray, padding: 10, gap: 10 }}>
                                            <OrderFeatureCard IconComponent={IconComponentHeart} borderBottomWidth={1}
                                                text={isLabel?.acntdbwishlist_label} onclick={() => navigation.navigate('Wishlist')} />
                                            <OrderFeatureCard IconComponent={IconComponentAddress} borderBottomWidth={1}
                                                text={isLabel?.acntdbmyaddrs_label} onclick={() => navigation.navigate('MyAddress')} />
                                            <OrderFeatureCard IconComponent={IconComponentPassword} borderBottomWidth={1} onclick={() => navigation.navigate('ChangePassword')}
                                                text={isLabel?.acntdbchngpsw_label} />
                                            <OrderFeatureCard IconComponent={IconComponentDownload} borderBottomWidth={1} onclick={() => navigation.navigate('Download')}
                                                text={isLabel?.acntdbdwnld_label} />
                                            <OrderFeatureCard IconComponent={IconComponentDocs} borderBottomWidth={1} onclick={() => navigation.navigate('OrderHistory')}
                                                text={isLabel?.acntdbmyorders_heading} />
                                            <OrderFeatureCard IconComponent={IconComponentTrash} borderBottomWidth={1} onclick={() => navigation.navigate('AccountDelete')}
                                                text={isLabel?.acntdbdelacnt_label} />
                                            <OrderFeatureCard IconComponent={IconComponentLogout} onclick={onClickLogout}
                                                text={isLabel?.acntdblogout_label} />
                                        </View>

                                        <View style={{ width: '100%', marginVertical: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                            <View>
                                                <OrderFeatureCard IconComponent={IconComponentHelp} flexDirection={'coloumn'}
                                                    text={isLabel?.acntdbhelp_label}
                                                    onclick={() => navigation.navigate('Contact')}
                                                />
                                            </View>
                                            <View>
                                                <OrderFeatureCard IconComponent={IconComponentShare} flexDirection={'coloumn'}
                                                    text={isLabel?.acntdbshare_label}
                                                    onclick={shareContent}
                                                />
                                            </View>
                                            <View>
                                                <OrderFeatureCard IconComponent={IconComponentRate} flexDirection={'coloumn'}
                                                    text={isLabel?.acntdbrate_label}
                                                    onclick={() => navigation.navigate('Rating')}
                                                />
                                            </View>

                                        </View>

                                    </View>

                                    <View style={{ height: 170, width: '100%', backgroundColor: Colors.primary, paddingVertical: 24, paddingHorizontal: 12, }}>
                                        <View style={{ width: '70%', height: 100, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' }}>
                                            <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ width: '100%', height: '100%' || 100, alignSelf: 'center' }}>
                                                {
                                                    Features?.menu_logo ? (
                                                        <Image source={{ uri: Features?.menu_logo }} style={{ resizeMode: 'contain', width: '100%', height: '100%', }} />
                                                    ) : <IconComponentImage />

                                                }
                                            </TouchableOpacity>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: '10%' }}>
                                            {/* <Text style={commonStyles.textWhite_lg}>{`App version ${appVersion}`}</Text> */}
                                            {/* <Text style={[commonStyles.heading, { color: Colors.white }]}>LEGAL</Text> */}
                                        </View>

                                    </View>

                                </ScrollView>
                            </Animated.ScrollView>
                        </View>

                        <Modal
                            animationType="fade"
                            transparent={true}
                            visible={modalVisible}
                            onRequestClose={() => setModalVisible(false)}
                        >
                            <View style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '90%', height: isLandscape && 350, backgroundColor: 'white', paddingHorizontal: 12, paddingBottom: isLandscape ? 10 : 30, borderRadius: 10, paddingTop: isLandscape && 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12, }}>
                                        <Text style={commonStyles.heading}>{userInfoLabel?.userdetailpersnl_label}</Text>
                                        <TouchableOpacity onPress={() => { setModalVisible(false); setEnableUpdate(false); }}>
                                            <IconComponentClose />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        {
                                            enableUpdate ? (
                                                <View style={{ gap: 10 }}>
                                                    <View style={{ marginTop: 1, flexDirection: 'row' }}>
                                                        <TouchableOpacity onPress={pickImage} style={{
                                                            width: 80, height: 80, borderRadius: 40, borderWidth: 1, alignItems: 'center', justifyContent: 'center', borderColor: Colors?.border_color,
                                                        }}>
                                                            {
                                                                formData?.image ? <Image source={{ uri: `${formData?.image}?t=${new Date().getTime()}` }} style={{ width: 80, height: 80, resizeMode: 'cover', borderRadius: 40 }} /> : <IconComponentImage />
                                                            }
                                                        </TouchableOpacity>

                                                        <View style={{ marginTop: 40, marginLeft: -12 }}>
                                                            <IconComponentEdit color={Colors?.primary} size={28} />
                                                        </View>
                                                    </View>

                                                    <InputBox label={userInfoLabel?.userdetailfname_label}
                                                        placeholder={userInfoLabel?.userdetailfname_label}
                                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                        InputType="text"
                                                        textVlaue={formData?.firstname}
                                                        onChangeText={(value) => handleInputChange('firstname', value)}
                                                        isRequired={true}
                                                    />
                                                    <InputBox label={userInfoLabel?.userdetaillname_label}
                                                        placeholder={userInfoLabel?.userdetaillname_label}
                                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                        InputType="text"
                                                        textVlaue={formData?.lastname}
                                                        onChangeText={(value) => handleInputChange('lastname', value)}
                                                        isRequired={true}
                                                    />
                                                    <InputBox label={userInfoLabel?.userdetailphn_label}
                                                        placeholder={userInfoLabel?.userdetailphn_label}
                                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                        InputType="numeric"
                                                        textVlaue={formData?.telephone}
                                                        onChangeText={(value) => handleInputChange('telephone', value)}
                                                    // isRequired={true}
                                                    />

                                                    <InputBox label={userInfoLabel?.userdetailemail_label}
                                                        placeholder={userInfoLabel?.userdetailemail_label}
                                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                        InputType="email"
                                                        textVlaue={formData?.email}
                                                        onChangeText={(value) => handleInputChange('email', value)}
                                                        isRequired={true}
                                                    />
                                                    <TouchableOpacity
                                                        onPress={() => onClickUpdateProfile()}
                                                        style={{ backgroundColor: Colors.primary, gap: 10, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: isLandscape && 50 }}>
                                                        <Text style={commonStyles.textWhite_lg}>{isLabel?.acntdbupdatebtn_label}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : <View style={{ gap: 10 }}>
                                                <ImageContainer img={{ uri: `${userInfo?.image}?t=${new Date().getTime()}` }} imgStatus={userInfo?.image ? true : false} />

                                                <View>
                                                    <Text style={commonStyles.text_lg}>{userInfo?.firstname} {userInfo?.lastname}</Text>
                                                    {userInfo?.telephone && <Text style={commonStyles.text_lg}>{userInfo?.telephone}</Text>}
                                                    <Text style={commonStyles.text_lg}>{userInfo?.email}</Text>
                                                </View>
                                                <TouchableOpacity
                                                    onPress={() => setEnableUpdate(true)}
                                                    style={{ backgroundColor: Colors.primary, gap: 10, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
                                                    <Text style={commonStyles.textWhite_lg}>{isLabel?.acntdbeditbtn_label}</Text>
                                                    <IconComponentEdit size={20} color={Colors.white} />
                                                </TouchableOpacity>

                                            </View>
                                        }
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>

                        <SuccessModal
                            isSuccessMessage={isSuccessMgs}
                            isModal={isSuccessModal}
                            onClickClose={() => onClickModalClose()}
                            handleCloseModal={() => onClickModalClose()}
                        />

                        <FailedModal
                            isModal={isErrorModal}
                            isSuccessMessage={isErrorMgs}
                            onClickClose={() => onClickErrorModalClose()}
                            handleCloseModal={() => onClickErrorModalClose()}
                        />
                        <NotificationAlert />
                    </>

                )
            }

        </>

    )
}

export default AccountDashboard