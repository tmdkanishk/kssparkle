import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Modal, Alert, Platform, useWindowDimensions, Animated } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import TopStatusBar from '../components/TopStatusBar'
import BottomBar from '../components/BottomBar'
import commonStyles from '../constants/CommonStyles'
import Cart from '../components/Cart'
import { IconComponentClose, } from '../constants/IconComponents'
import TitleBarSearchComponent from '../components/TitleBarSearchComponent'
import { useCustomContext } from '../hooks/CustomeContext'
import { _clearData, _retrieveData, _storeData } from '../utils/storage'
import CustomActivity from '../components/CustomActivity'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import { useFocusEffect } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import { getMyAddresses } from '../services/getMyAddresses'
import { addBillingAndShippingAddress } from '../services/addBillingAndShippingAddress'
import NotificationAlert from '../components/NotificationAlert'
import { checkAutoLogin } from '../utils/helpers'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'


const Checkout = ({ navigation }) => {
  const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [loading, setLoading] = useState(false);
  const [isLabel, setLabel] = useState();
  const [differentShipping, setDifferentShipping] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectShippingAddress, setSelectShippingAddress] = useState();
  const [selectBillingAddress, setSelectBillingAddress] = useState();
  const [addressType, setAddressType] = useState();
  const [isAddressList, setAddressList] = useState();
  const [isDefaultAddress, setDefaultAddress] = useState(null);
  const scrollY = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      checkAutoLogin();
      checkUserLogin();
      fetchAllMyAddress();
      fetchCheckOutText();
    }, [language, currency, navigation])
  )

  const checkUserLogin = async () => {
    const data = await _retrieveData("USER");
    if (data == null) {
      navigation.replace('Login');
      return;
    }
  }

  const handleOnChangeLang = (value) => {
    changeLanguage(value)
  }

  const handleOnChangeCurrency = (value) => {
    changeCurrency(value);
  }

  const onChangeBilliingAddress = () => {
    setAddressType(1);
    setShowModal(true)
  }

  const onChangeShippinigAddress = () => {
    setAddressType(2)
    setShowModal(true)
  }

  const onSelectAddress = (selectedAddress) => {
    if (addressType === 1) {
      setSelectBillingAddress(selectedAddress);
      setShowModal(false);
    } else {
      setSelectShippingAddress(selectedAddress);
      setShowModal(false);
    }
  }

  const onClickCheckoutContinueBtn = async () => {
    try {
      // setLoading(true);
      const shippingAddressId = selectShippingAddress?.address_id
      const paymentAddressId = selectBillingAddress?.address_id
      const result = await addBillingAndShippingAddress(shippingAddressId, paymentAddressId, EndPoint?.checkout_Shippingandpaymentaddress);
      console.log("save shipping and billing address :", result);
      navigation.navigate('Payment');
    } catch (error) {
      console.log("error", error.response.data);
      alert(GlobalText?.extrafield_somethingwrong);
    } finally {
      setLoading(false);
    }
  }

  const fetchAllMyAddress = async () => {
    try {
      setLoading(true);
      const result = await getMyAddresses(EndPoint?.address);
      setAddressList(result?.response);
      const addresses = result?.response;
      const defaultAddress = addresses.find(addr => addr.defaultaddrstatus === true);
      setDefaultAddress(defaultAddress);
      setSelectShippingAddress(defaultAddress);
      setSelectBillingAddress(defaultAddress);
    } catch (error) {
      alert(GlobalText?.extrafield_somethingwrong);
    } finally {
      setLoading(false);
    }
  }

  const fetchCheckOutText = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}${EndPoint?.checkout}`;
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
        customer_id: user ? user[0]?.customer_id : null,
        sessionid: sessionId
      }

      const response = await axios.post(url, body, { headers: headers });

      console.log("respomnse of checkout :", response?.data);

      if (response.status === HttpStatusCode.Ok) {
        setLabel(response.data?.text);
      }

    } catch (error) {
      // console.log("errorxsacds", error.response.data);
      alert(GlobalText?.extrafield_somethingwrong);
    } finally {
      setLoading(false);
    }
  }

  const CartButton = () => {
    return (
      <Cart />
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
                <TopStatusBar
                  scrollY={scrollY}
                  onChangeCurren={handleOnChangeCurrency}
                  onChangeLang={handleOnChangeLang}
                />
              </View>
              <TitleBarSearchComponent titleName={isLabel?.chkoutpagename_label} Component1={CartButton} onClickBackIcon={() => navigation.goBack()} />
              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ paddingHorizontal: 12, marginBottom: 100 }}>
                    <View style={{ gap: 12, marginTop: 12 }}>
                      <Text style={commonStyles.smallHeading}>{isLabel?.shipandpayaddress_heading}</Text>
                      {
                        isDefaultAddress ? (
                          <>
                            <View style={{ width: '100%', borderWidth: 1, borderColor: Colors.gray, borderRadius: 10, gap: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                              <View style={{ gap: 3, width: '60%' }}>
                                <Text style={commonStyles.smallHeading}>{selectBillingAddress?.firstname} {selectBillingAddress?.lastname}</Text>
                                {selectBillingAddress?.company && <Text>{selectBillingAddress?.company}</Text>}
                                {selectBillingAddress?.company && <Text>{selectBillingAddress?.address_1}</Text>}
                                {selectBillingAddress?.address_2 && <Text>{selectBillingAddress?.address_2}</Text>}
                                {(selectBillingAddress?.city || selectBillingAddress?.zone || selectBillingAddress?.postcode) && <Text>{selectBillingAddress?.city}, {selectBillingAddress?.zone}, {selectBillingAddress?.postcode}</Text>}
                                {selectBillingAddress?.country && <Text>{selectBillingAddress?.country}</Text>}
                              </View>
                              <View style={{ width: '30%' }}>
                                <CustomButton OnClickButton={() => onChangeBilliingAddress()} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary, borderRadius: 12 }} buttonText={isLabel?.addresschangebtn_label} />
                              </View>
                            </View>
                            <TouchableOpacity onPress={() => setDifferentShipping(!differentShipping)} style={{ padding: 12, flexDirection: 'row', gap: 12 }}>
                              <View style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 10, backgroundColor: differentShipping ? Colors?.primary : null }} />
                              <Text>{isLabel?.usedifershipaddress_label}</Text>
                            </TouchableOpacity>

                            {
                              differentShipping ? (
                                <View style={{ width: '100%', borderWidth: 1, borderColor: Colors.gray, borderRadius: 10, gap: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                                  <View style={{ gap: 3, width: '60%' }}>
                                    <Text style={commonStyles.smallHeading}>{selectShippingAddress?.firstname} {selectShippingAddress?.lastname}</Text>
                                    {selectShippingAddress?.company && <Text>{selectShippingAddress?.company}</Text>}
                                    {selectShippingAddress?.address_1 && <Text>{selectShippingAddress?.address_1}</Text>}
                                    {selectShippingAddress?.address_2 && <Text>{selectShippingAddress?.address_2}</Text>}
                                    {(selectShippingAddress?.city || selectShippingAddress?.zone || selectShippingAddress?.postcode) && <Text>{selectShippingAddress?.city}, {selectShippingAddress?.zone}, {selectShippingAddress?.postcode}</Text>}
                                    {selectShippingAddress?.country && <Text>{selectShippingAddress?.country}</Text>}
                                  </View>
                                  <View style={{ width: '30%' }}>
                                    <CustomButton OnClickButton={() => onChangeShippinigAddress()} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary, borderRadius: 12 }} buttonText={isLabel?.addresschangebtn_label} />
                                  </View>
                                </View>
                              ) : null
                            }
                            <CustomButton OnClickButton={() => onClickCheckoutContinueBtn()} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary, borderRadius: 12 }} buttonText={isLabel?.addresscntbtn_label} />
                          </>
                        ) : (
                          <CustomButton OnClickButton={() => navigation.replace('MyAddress')} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary, borderRadius: 12 }} buttonText={'Dodaj adresu'} />
                        )
                      }
                    </View>
                  </View>

                </ScrollView>
              </Animated.ScrollView>

            </View>
            <BottomBar />
            <Modal
              animationType="fade"
              transparent={true}
              visible={showModal}
              onRequestClose={() => setShowModal(false)}
            >

              <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '90%', maxHeight: isLandscape ? 350 : 600, backgroundColor: 'white', borderRadius: 10, padding: 20 }}>
                  <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={commonStyles.smallHeading}>{isLabel?.addresselectaddr_heading}</Text>
                    <TouchableOpacity onPress={() => setShowModal(false)}>
                      <IconComponentClose />
                    </TouchableOpacity>
                  </View>
                  <ScrollView showsVerticalScrollIndicator={false}>

                    {
                      isAddressList?.length > 0 && (
                        isAddressList?.map((item, index) => (
                          <View key={index} style={{ marginTop: 20, width: '100%', borderWidth: 1, borderColor: Colors.gray, borderRadius: 10, gap: 10, padding: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ gap: 3, width: '60%' }}>
                              <Text style={commonStyles.smallHeading}>{item?.firstname} {item?.lastname}</Text>
                              {item?.company && <Text>{item?.company}</Text>}
                              {item?.address_1 && <Text>{item?.address_1}</Text>}
                              {item?.address_2 && <Text>{item?.address_2}</Text>}
                              {(item?.city || item?.zone || item?.postcode) && <Text>{item?.city}, {item?.zone}, {item?.postcode}</Text>}
                              {item?.country && <Text>{item?.country}</Text>}
                            </View>
                            <View style={{ width: '30%', alignItems: 'flex-end', paddingTop: 12 }}>
                              <TouchableOpacity onPress={() => onSelectAddress(item)} style={{
                                width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: Colors.gray,
                              }} />
                            </View>
                          </View>
                        ))
                      )
                    }

                    <TouchableOpacity onPress={() => { setShowModal(false); navigation.navigate('AddNewAddress'); }} style={{ padding: 12, flexDirection: 'row', gap: 12 }}>
                      <View style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 10 }} />
                      <Text>{isLabel?.addreswanttoaddnewaddrs_label}</Text>
                    </TouchableOpacity>
                  </ScrollView>

                </View>
              </View>

            </Modal>
            < NotificationAlert />
          </>
        )
      }

    </>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },

});

export default Checkout