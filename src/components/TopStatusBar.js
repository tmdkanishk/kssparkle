import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ScrollView, Alert, Animated, ImageBackground, Dimensions } from 'react-native'
import React, { memo, useCallback, useEffect, useRef, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { IconComponentClose, IconComponentLogin, IconComponentLogout, IconComponentLogOut, IconComponentTruck } from '../constants/IconComponents';
import { useCustomContext } from '../hooks/CustomeContext';
import commonStyles from '../constants/CommonStyles';
import { _clearData, _retrieveData, _storeData } from '../utils/storage';
import { API_KEY, BASE_URL } from '../utils/config';
import axios, { HttpStatusCode } from 'axios';
import { getAdvertisementAlert } from '../services/getAdvertisementAlert';
import { useCartCount } from '../hooks/CartContext';
import { logout } from '../services/logout';
import { getCartItem } from '../services/getCartItem';
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext';
import BackgroundWrapper from './customcomponents/BackgroundWrapper';
import { BlurView } from '@react-native-community/blur';


const TopStatusBar = ({ onChangeLang, onChangeCurren, scrollY }) => {
    const navigation = useNavigation();
    const { Colors, Features, EndPoint, SetAppLanguage, GlobalText, SetLogin } = useCustomContext();
    const { language, currency } = useLanguageCurrency();
    const { updateCartCount } = useCartCount();
    const [isPickerVisible, setPickerVisible] = useState(false);
    const [languageList, setlanguageList] = useState();
    const [isVisibleCurrency, setVisibleCurrency] = useState(false);
    const [curencyList, setCurrencyList] = useState();
    const [isSelectedCurrency, setSelectedCurrency] = useState(null);
    const [isSelectedLanguage, setSelectedLanguage] = useState(null);
    const [isLogin, setLogin] = useState(false);
    const { width } = Dimensions.get('window');
    



    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100], // scroll distance
        outputRange: [50, 0], // from 60 height → 0 height
        extrapolate: "clamp",
    });


    useFocusEffect(
        useCallback(() => {
            checkUserLogin();
            getLanguageAndCurrency();
            fetchLanguageData();
            fetchCurrencyData();
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

    const fetchLanguageData = async () => {
        try {
            const url = `${BASE_URL}${EndPoint?.languages}`;
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };
            const body = {
            }
            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                setlanguageList(response.data?.languages);
            } else {
                alert('something went worng!');
            }

        } catch (error) {
            console.log("error _lang_top:", error.message)
        }
    };

    const fetchCurrencyData = async () => {
        try {
            const url = `${BASE_URL}${EndPoint?.currency}`; // Replace with your endpoint
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
            }
            const response = await axios.post(url, body, { headers: headers });
            if (response.status == HttpStatusCode.Ok) {
                setCurrencyList(response.data);
            } else {
                alert('something went wrong!');
            }
        } catch (error) {
            console.log("error currency:", error.message)
        }
    };

    const onChangeLanguage = async (language) => {
        setPickerVisible(false);
        onChangeLang(language);
        SetAppLanguage(language?.code);
        await _storeData('SELECT_LANG', language);
    }

    const onChangeCurrency = async (currency) => {
        setVisibleCurrency(false);
        onChangeCurren(currency);
        await _storeData('SELECT_CURRENCY', currency);
    }

    const getLanguageAndCurrency = async () => {
        const lang = await _retrieveData('SELECT_LANG');
        const cur = await _retrieveData('SELECT_CURRENCY');
        setSelectedLanguage(lang?.code);
        setSelectedCurrency(cur?.code);
    }


    const onClickLogin = () => {
        navigation.navigate('Login');
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
        await logout(EndPoint?.logout);
        await _clearData('USER');
        SetLogin(false);
        const cartresponse = await getCartItem(EndPoint?.cart_total);
        updateCartCount(cartresponse?.cartproductcount);
        navigation.navigate('Login');
    }

    return (
        <Animated.View style={[{ height: headerHeight, }]}>
            <View>
                <View style={styles.statusbarContainer}>
                    <View style={{ width: 'auto', flexDirection: 'row', gap: 20, }}>
                        {
                            Features?.header_langstatus === true ? (<TouchableOpacity onPress={() => setPickerVisible(true)}>
                                <FontAwesome name="language" size={24} color={Colors.white} />
                            </TouchableOpacity>) : null
                        }

                        {
                            Features?.header_currencystatus === true && (
                                <TouchableOpacity onPress={() => setVisibleCurrency(true)}>
                                    <MaterialIcons name="currency-exchange" size={24} color={Colors.white} />
                                </TouchableOpacity>
                            )
                        }

                    </View>

                    {/* <View style={{ width: 'auto', flexDirection: 'row', alignSelf: 'flex-end', gap: 20, justifyContent: 'flex-end', alignItems: 'center', }}>

                        {
                            Features?.header_contactstatus === true ? (
                                <TouchableOpacity onPress={() => navigation.navigate('Contact')}>
                                    <Ionicons name="call-outline" size={24} color={Colors.topIcon} />
                                </TouchableOpacity>
                            ) : null
                        }


                        {
                            isLogin ? (<>
                                <TouchableOpacity onPress={() => navigation.navigate('AccountDashboard')}>
                                    <FontAwesome name="user-o" size={24} color={Colors.topIcon} />
                                </TouchableOpacity>
                            </>) : null
                        }

                        {
                            Features?.header_wishliststatus === true ? (
                                <TouchableOpacity onPress={isLogin ? () => navigation.navigate('Wishlist') : () => navigation.navigate('Login')}>
                                    <FontAwesome name="heart-o" size={24} color={Colors.topIcon} />
                                </TouchableOpacity>) : null
                        }

                        {
                            isLogin ? (
                                <TouchableOpacity onPress={onClickLogout}>
                                    <IconComponentLogOut size={24} color={Colors.topIcon} />
                                </TouchableOpacity>

                            ) : (<TouchableOpacity onPress={onClickLogin}>
                                <IconComponentLogin size={24} color={Colors.topIcon} />
                            </TouchableOpacity>)
                        }

                    </View> */}

                    {/* language Modal */}
                    <Modal
                        transparent={true}
                        animationType="slide"
                        visible={isPickerVisible}
                        onRequestClose={() => setPickerVisible(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setPickerVisible(false)}
                            style={{
                                flex: 1,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            {/* Blur Background */}
                            <BlurView
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                }}
                                blurType="dark"
                                blurAmount={15}
                                reducedTransparencyFallbackColor="rgba(0,0,0,0.6)"
                            />

                            {/* Prevent close when pressing inside */}
                            <TouchableOpacity activeOpacity={1}>
                                <ImageBackground
                                    source={require('../assets/images/backgroundimage.png')}
                                    resizeMode="cover"
                                    style={{
                                          width: width * 0.8,
                                        borderRadius: 16,
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Glass Overlay */}
                                    <View
                                        style={{
                                            padding: 20,
                                            backgroundColor: 'rgba(0,0,0,0.45)',
                                        }}
                                    >

                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={[commonStyles.heading]}>Select Language</Text>
                                            <TouchableOpacity onPress={() => setPickerVisible(false)}>
                                                <IconComponentClose />
                                            </TouchableOpacity>
                                        </View>


                                        <View style={{ marginVertical: 20 }}>
                                            <ScrollView showsVerticalScrollIndicator={false}>
                                                {
                                                    languageList?.length > 0 ? (

                                                        languageList?.map((item, intex) => (
                                                            <TouchableOpacity key={intex}
                                                                onPress={() => onChangeLanguage(item)}
                                                                // languageList?.length - 1 === intex ? 0 :
                                                                style={{ backgroundColor: isSelectedLanguage == item?.code ? Colors?.primary : null, width: '100%', borderBottomWidth: 1, borderColor: Colors?.border_color, height: 40, flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, borderRadius: 10 }}
                                                            >
                                                                <View style={{ width: 16, height: 11, backgroundColor: Colors?.white, borderRadius: 2 }}>
                                                                    <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', resizeMode: 'Cover' }} />
                                                                </View>
                                                                <Text style={{ color: isSelectedLanguage == item?.code ? Colors?.white : null }}>{item.name}</Text>
                                                            </TouchableOpacity>
                                                        ))
                                                    ) : null
                                                }
                                            </ScrollView>

                                        </View>
                                    </View>
                                </ImageBackground>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </Modal>

                    {/* currency Modal */}
<Modal
  transparent={true}
  animationType="slide"
  visible={isVisibleCurrency}
  onRequestClose={() => setVisibleCurrency(false)}
>
  <TouchableOpacity
    activeOpacity={1}
    onPress={() => setVisibleCurrency(false)}
    style={{
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    }}
  >
    {/* Blur Background */}
    <BlurView
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      blurType="dark"
      blurAmount={15}
      reducedTransparencyFallbackColor="rgba(0,0,0,0.6)"
    />

    {/* Prevent close when pressing inside */}
    <TouchableOpacity activeOpacity={1}>
      <ImageBackground
        source={require('../assets/images/backgroundimage.png')}
        resizeMode="cover"
        style={{
           width: width * 0.8,
          borderRadius: 16,
          overflow: 'hidden',
        }}
      >
        {/* Glass Overlay */}
        <View
          style={{
            padding: 20,
            backgroundColor: 'rgba(0,0,0,0.45)',
          }}
        >
          {/* ===== YOUR EXISTING CONTENT STARTS HERE ===== */}

          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={[commonStyles.heading]}>Select Currency</Text>
            <TouchableOpacity onPress={() => setVisibleCurrency(false)}>
              <IconComponentClose />
            </TouchableOpacity>
          </View>

          <View style={{ marginVertical: 20 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {
                curencyList?.currencies?.length > 0 ? (
                  curencyList?.currencies?.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => onChangeCurrency(item)}
                      style={{
                        backgroundColor: isSelectedCurrency == item?.code ? Colors?.primary : null,
                        width: '100%',
                        borderBottomWidth: 1,
                        borderColor: Colors?.border_color,
                        height: 40,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        borderRadius: 10,
                        paddingHorizontal: 20
                      }}
                    >
                      <View style={{ width: 28, height: 24, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{
                          fontSize: 20,
                          fontWeight: 'bold',
                          color: isSelectedCurrency == item?.code ? Colors?.white : null,
                        }}>
                          {item.symbol_left || item.symbol_right}
                        </Text>
                      </View>

                      <Text style={{
                        color: isSelectedCurrency == item?.code ? Colors?.white : null,
                      }}>
                        {item.title}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : null
              }
            </ScrollView>
          </View>

          {/* ===== YOUR EXISTING CONTENT ENDS HERE ===== */}

        </View>
      </ImageBackground>
    </TouchableOpacity>
  </TouchableOpacity>
</Modal>

                </View>
            </View>
        </Animated.View>

    )
}


const styles = StyleSheet.create({
    statusbarContainer: {
        width: '100%',
        flexDirection: 'row',
        paddingVertical: 10,
        justifyContent: 'space-between',
        opacity: 1,
    }
})

export default TopStatusBar;