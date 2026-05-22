import React, { useCallback, useEffect, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, useWindowDimensions, Animated, Share, Alert, Modal, ImageBackground, KeyboardAvoidingView, Linking, I18nManager } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import GlassContainer from "../components/customcomponents/GlassContainer";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import { useCustomContext } from "../hooks/CustomeContext";
import { getCartItem } from "../services/getCartItem";
import { _clearData, _retrieveData, _storeData } from "../utils/storage";
import { logout } from "../services/logout";
import { useLanguageCurrency } from "../hooks/LanguageCurrencyContext";
import { useCartCount } from "../hooks/CartContext";
import { useFocusEffect } from "@react-navigation/native";
import { checkAutoLogin } from "../utils/helpers";
import { API_KEY, BASE_URL } from "../utils/config";
import axios, { HttpStatusCode } from "axios";
import * as ImagePicker from 'expo-image-picker';
import { getUserInfo } from "../services/getUserInfo";
import { IconComponentClose, IconComponentDelete, IconComponentEdit, IconComponentImage, IconComponentInstagram, IconComponentNotification, IconComponentSnapChat, IconComponentTikTok, IconComponentWhatsapp } from "../constants/IconComponents";
import { updateUserInfomation } from "../services/updateUserInfomation";
import InputBox from "../components/InputBox";
import ImageContainer from "../components/ImageContainer";
import commonStyles from "../constants/CommonStyles";
import { BlurView } from 'expo-blur';
import SuccessModal from "../components/SuccessModal";
import { useUser } from "../hooks/UserContext";
import TopStatusBar from '../components/TopStatusBar'
import { isLiquidGlassSupported, LiquidGlassView } from "@callstack/liquid-glass";
import RNRestart from "react-native-restart-newarch";

const MyAccountScreen = ({ navigation }) => {


  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;
  const didUpdateRef = useRef(false);


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
  const [errors, setErrors] = useState({});
  const [helplineNumber, setHelplineNumber] = useState('')
  const [registrationNumber, setRegistrationNumber] = useState('')
  const [storeAddress, setStoreAddress] = useState('');
  const [taxNumber, setTaxNumber] = useState('');
  const { refreshUser, profileImg } = useUser();


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
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // 🔥 clear error as user types
    if (errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: null,
      }));
    }
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
        code: lang?.code || null,
        currency: cur?.code || null,
        customer_id: user || null,
        sessionid: sessionId,
      }

      const response = await axios.post(url, body, { headers: headers });

      console.log("body of fatchAccountDashboard", body, url)

      if (response.status === HttpStatusCode.Ok) {
        console.log("response data of fetchaccountdashboard", response.data)
        setHelplineNumber(response?.data?.helplineno)
        // response.data.helplineno
        // helplineno
        setLabel(response.data.text);
        console.log("account dashboard", response.data.text);
        setTaxNumber(response?.data?.taxno)
        setStoreAddress(response?.data?.storeaddress)
        setRegistrationNumber(response?.data?.registerno)


        setOrderStatus(response.data?.orderstatusname);
        setTotalCoins(response.data?.coins_total.toString());
      }

    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!modalVisible && didUpdateRef.current) {
      fetchUserInfo();
      didUpdateRef.current = false;
    }
  }, [modalVisible]);


  const fetchUserInfo = async () => {
    try {
      const result = await getUserInfo(EndPoint?.accountdashboard_userdetailsedit);
      console.log("fetchUserInfo", result)
      const user = result?.customer_info?.[0];

      setUserInfo(user);

      const fullname = `${user?.firstname || ""} ${user?.lastname || ""}`;
      const email = user?.email || "";

      let telephone = user?.telephone || "";

      console.log("getting values before saving the info", fullname, email, telephone)

      await _storeData("full_name", fullname);
      await _storeData("email", email);
      await _storeData("telephone", telephone);
      setFormData({
        email: result?.customer_info[0]?.email,
        firstname: result?.customer_info[0]?.firstname,
        lastname: result?.customer_info[0]?.lastname,
        telephone: result?.customer_info[0]?.telephone,
        image: result?.customer_info[0]?.image,
      })
      setUserInfoLabel(result?.text);
      await refreshUser()
    } catch (error) {
      console.log('error', error.message);
    }
  }

  const pickImage = async () => {
    // Request permission to access the media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      // Do not prompt user to reconsider - simply inform them and return
      Alert.alert(
        "Photo Access Required",
        "Photo library access is needed to upload a profile picture."
      );
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

  // const handleOnChangeLang = async (value) => {
  //     // 1. Change the translation locale immediately (e.g., using i18next)
  //     await changeLanguage(value);
  //     console.log("language getting changed",value)

  //     // const isArabic = value === 'ar';
  //     // const isCurrentRTL = I18nManager.isRTL;

  //     // // 2. Check if the layout direction needs to change
  //     // if (isArabic !== isCurrentRTL) {
  //     //     // Set new direction
  //     //     I18nManager.allowRTL(isArabic);
  //     //     I18nManager.forceRTL(isArabic);

  //     //     // 3. Restart to apply the LTR layout for English
  //     //     setTimeout(() => {
  //     //         RNRestart.Restart();
  //     //     }, 150);
  //     // }
  // };

  const handleOnChangeLang = async (value) => {
    // 1. Save the choice to storage so it persists after restart
    await _storeData('SELECT_LANG', value);

    // 2. Change the translation locale (i18next or similar)
    await changeLanguage(value);

    const isArabic = value.code === 'ar';
    const isCurrentRTL = I18nManager.isRTL;

    // 3. If direction changed, restart is MANDATORY
    if (isArabic !== isCurrentRTL) {
      I18nManager.allowRTL(isArabic);
      I18nManager.forceRTL(isArabic);

      setTimeout(() => {
        RNRestart.Restart();
      }, 150);
    }
  };



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
      console.log("onClickUpdateProfile function got hit");
      setLoading(true);

      const result = await updateUserInfomation(
        formData,
        EndPoint?.accountdashboard_userdetailseditValidation
      );

      didUpdateRef.current = true; // ✅ mark update success
      setModalVisible(false);
      console.log("onClickUpdateProfile", result?.success?.message)
      // setSuccessModal(true);
      // setSuccessMgs(result?.success?.message);

      setErrors({});
    } catch (error) {
      console.log("error onClickUpdateProfile", error?.response?.data?.error);

      if (error?.response?.data?.error) {
        setErrors(error.response.data.error);
        return; // ✅ modal stays open
      }

      setErrorMgs(GlobalText?.extrafield_somethingwrong);
      setErrorModal(true);

    } finally {
      setLoading(false); // ✅ safe to keep
    }
  };


  const onClickModalClose = () => {
    fetchUserInfo();
    setSuccessModal(false);
    setSuccessMgs();
  }

  const onClickErrorModalClose = () => {
    setErrorModal(false);
    setErrorMgs();
  }


  const onClickOkButton = async () => {
    await logout(EndPoint?.logout);
    await _clearData('CUSTOMER_ID');
    await _clearData('SKIP_LOGIN');
    await _clearData('full_name');
    await _clearData('email');
    await _clearData('telephone');
    SetLogin(false);
    //  const cartresponse = await getCartItem(EndPoint?.cart_total);
    //  updateCartCount(cartresponse?.cartproductcount);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  }

  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Can't open URL:", url);
    }
  };

  const openWhatsApp = async () => {

    if (!helplineNumber) return;
    console.log("open whatssapp")
    // remove leading 0 and spaces
    const formatted = helplineNumber.replace(/^0/, '').replace(/\s/g, '');

    const url = `https://wa.me/966${formatted}`;

    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Can't open URL:", url);
    }
  };


  return (
    <>



      <BackgroundWrapper>


        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: Platform.OS === "ios" ? 60 : 40,
            paddingHorizontal: 20,
          }}
        >
          {/* HOME BUTTON */}
          <TouchableOpacity
            onPress={() => navigation.replace("Home")}
            style={{ width: "45%" }}
            activeOpacity={0.9}
          >
            {/* <LiquidGlassView
              style={styles.liquid}
              effect="clear"
              interactive
            > */}
            <GlassContainer padding={0.1}>
              <View
                style={[
                  styles.inner,
                  {
                    backgroundColor:
                      !isLiquidGlassSupported && Platform.OS === "android"
                        ? "transparent"
                        : "transparent",
                  },
                ]}
              >

                <Text style={styles.text}>{isLabel?.go_to_home}</Text>
              </View>
            </GlassContainer>
            {/* </LiquidGlassView> */}
          </TouchableOpacity>

          {/* EDIT BUTTON */}
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            style={{ width: "45%" }}
            activeOpacity={0.9}
          >

            <GlassContainer padding={0.1}>
              <View
                style={[
                  styles.inner,
                  {
                    backgroundColor:
                      !isLiquidGlassSupported && Platform.OS === "android"
                        ? "rgba(255,255,255,0.08)"
                        : "transparent",
                  },
                ]}
              >


                <Text style={styles.text}>{isLabel?.acntdbeditbtn_label}</Text>
              </View>
            </GlassContainer>



          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={{
          borderWidth: 1,
          padding: 10,
          width: "40%",
          alignItems: "center",
          borderRadius: 12,
          alignSelf: "flex-end",
          marginTop: 12,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderWidth: 0.6,
          borderColor: 'rgba(255,255,255,0.35)',
          marginRight: 20,
          marginTop: Platform.OS === "ios" ? 60 : 40
        }}
      >
        <Text style={{ color: "white" }}>Go To Home Page</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={{
          borderWidth: 1,
          padding: 10,
          width: "30%",
          alignItems: "center",
          borderRadius: 12,
          alignSelf: "flex-end",
          marginTop: 12,
          backgroundColor: 'rgba(255,255,255,0.15)',
          borderWidth: 0.6,
          borderColor: 'rgba(255,255,255,0.35)',
          marginRight: 20,
          marginTop: Platform.OS === "ios" ? 60 : 40
        }}
      >
        <Text style={{ color: "white" }}>Edit Account</Text>
      </TouchableOpacity> */}

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>


          {/* Header */}
          <View style={styles.header}>


            <View>

              <Text style={styles.headerTitle}>{isLabel?.acntdbpagename_label}</Text>
            </View>

            <View style={{ flexDirection: 'row', gap: 30 }}>
              {/* <View style={{borderWidth:1, borderColor:'white'}}> */}
              <TopStatusBar scrollY={scrollY} onChangeCurren={handleOnChangeCurrency} onChangeLang={handleOnChangeLang} />
              {/* </View> */}



              <Image
                source={
                  profileImg
                    ? { uri: `${profileImg}?t=${Date.now()}` }
                    : require('../assets/images/profile.png')
                }
                style={styles.profileImage}
              />
            </View>


          </View>

          {/* Row 1 */}
          <GlassContainer padding={0.1} style={{ marginHorizontal: 20, marginTop: 20 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 20 }}>
              <TouchableOpacity onPress={() => navigation.navigate('MyOrderScreen')}>
                <AccountItem image={require("../assets/images/track.png")} label={isLabel?.track} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Alert.alert(isLabel?.readytogo, "This feature is coming soon!")}>
                <AccountItem image={require("../assets/images/ready.png")} label={isLabel?.readytogo} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { navigation.navigate("OrderHistory") }}>
                <AccountItem image={require("../assets/images/preparing.png")} label={isLabel?.preparing} />
              </TouchableOpacity>
            </View>
          </GlassContainer>

          {/* Row 2 */}
          <GlassContainer style={styles.section}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

              <TouchableOpacity onPress={() => navigation.navigate('OrderHistory')}>
                <GlassContainer style={{ width: 90, height: 100, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../assets/images/return.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="contain"
                  />
                  <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500", textAlign: "center" }} >
                    {isLabel?.return}
                  </Text>
                </GlassContainer>
              </TouchableOpacity>

              {/* ORDER */}
              <TouchableOpacity onPress={() => { navigation.navigate("MyOrderScreen") }} style={{ alignItems: "center" }}>
                <GlassContainer style={{ width: 90, height: 100, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../assets/images/order.png")}
                    style={{ width: "80%", height: "80%" }}
                    resizeMode="contain"
                  />

                  <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500", textAlign: "center" }} >
                    {isLabel?.acntdbmyorders_heading}
                  </Text>
                </GlassContainer>
              </TouchableOpacity>

            </View>
            {/* <View style={styles.row}>
            <AccountItem image={require("../assets/images/wishlist.png")} label="Wishlist" />
            <AccountItem image={require("../assets/images/more.png")} label="More" />
          </View> */}

            <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

              <TouchableOpacity onPress={() => { navigation.navigate("Wishlist") }} style={{ alignItems: "center" }}>
                <GlassContainer style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../assets/images/wishlist.png")}
                    style={{ width: "90%", height: "90%" }}
                    resizeMode="contain"
                  />
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 15,
                      fontWeight: "500",
                      textAlign: "center",
                    }}
                  >
                    {isLabel?.acntdbwishlist_label}
                  </Text>
                </GlassContainer>

              </TouchableOpacity>

              {/* ORDER */}
              {/* <View style={{ alignItems: "center" }}>
              <GlassContainer style={{ width: 90, height: 100, justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/order.png")}
                  style={{ width: "80%", height: "80%" }}
                  resizeMode="contain"
                />

              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", textAlign: "center"}} >
                More
              </Text>
              </GlassContainer>
            </View> */}

              <TouchableOpacity onPress={() => Alert.alert(isLabel?.more, "This feature is coming soon!")}>
                <GlassContainer style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center" }}>
                  <Image
                    source={require("../assets/images/more.png")}
                    style={{ width: "70%", height: "70%" }}
                    resizeMode="contain"
                  />

                  <Text style={{ color: "#fff", fontSize: 15, fontWeight: "500", textAlign: "center" }} >
                    {isLabel?.more}
                  </Text>
                </GlassContainer>
              </TouchableOpacity>


            </View>

          </GlassContainer>

          {/* Row 3 */}

          <View style={styles.row}>
            <TouchableOpacity onPress={() => { navigation.navigate("Notification") }}>
              <AccountItem image={require("../assets/images/notification.png")} label={isLabel?.notification} />
            </TouchableOpacity>
            {/* 
            <TouchableOpacity onPress={() => { navigation.navigate("ChooseDeliveryAddress") }}>
              <AccountItem image={require("../assets/images/address.png")} label={isLabel?.acntdbmyaddrs_label} />
            </TouchableOpacity> */}

            <TouchableOpacity onPress={() => { navigation.navigate("OrderHistory") }}>
              <AccountItem image={require("../assets/images/wallet.png")} label={isLabel?.preparing} />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => openWhatsApp()}
          >
            <GlassContainer
              style={{
                borderRadius: 5,
                marginBottom: 12,
                flexDirection: 'row',
                minWidth: '80%',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '85%',
              }}
              padding={1}
            >
              <Text style={styles.supportText}>
                {isLabel?.acntdbhelp_label}
              </Text>

              <Image
                source={require("../assets/images/support.png")}
                style={styles.supportIcon}
              />
            </GlassContainer>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => navigation.navigate("AccountDelete")}>
            <GlassContainer style={{
              borderRadius: 5,
              marginBottom: 12,
              marginTop: 5,
              flexDirection: 'row',
              minWidth: '85%',
              alignItems: 'center',
              justifyContent: 'center'
            }} padding={8}>
              <Text style={{
                color: "#fff",
                fontWeight: "600",
                fontSize: 20,
                textAlign: 'center',
                paddingTop: 0
              }}>{isLabel?.acntdbdelacnt_label}</Text>
              <IconComponentDelete color={'#ff4444'} size={30} />
              {/* <Image source={require("../assets/images/logout.png")} style={{ width: 28, height: 28, tintColor: "#ff4444", marginTop: 10 }} /> */}
            </GlassContainer>
          </TouchableOpacity>

          <TouchableOpacity style={{ marginTop: 10 }} onPress={() => onClickOkButton()}>
            <GlassContainer style={{
              borderRadius: 5,
              marginBottom: 12,
              marginTop: 0,
              // padding: 10,
              flexDirection: 'row',
              minWidth: '85%',
              alignItems: 'center',
              justifyContent: 'center'
            }} padding={8}>
              <Text style={styles.signOutText}>{isLabel?.acntdblogout_label}</Text>
              <Image source={require("../assets/images/logout.png")} style={{ width: 28, height: 28, tintColor: "#fff", marginTop: 10 }} />
            </GlassContainer>
          </TouchableOpacity>




          {/* Sign Out */}
          {/* <GlassContainer style={styles.signOut} padding={10}>
          <Text style={styles.signOutText}>Sign Out</Text>
          <Image source={require("../assets/images/logout.png")} style={{ width: 28, height: 28, tintColor: "#fff", }} />
        </GlassContainer> */}

          {/* Footer */}
          <GlassContainer style={styles.footer}>
            <Text style={styles.footerTitle}>{isLabel?.sellus}</Text>
            <View style={styles.socialRow}>
              {/* <Image source={require("../assets/images/linkedin.png")} style={styles.socialIcon} />
              <Image source={require("../assets/images/instagram.png")} style={styles.socialIcon} />
              <Image source={require("../assets/images/x.png")} style={styles.socialIcon} />
              <Image source={require("../assets/images/facebook.png")} style={styles.socialIcon} /> */}

              <TouchableOpacity onPress={() => openLink('https://www.tiktok.com/@sparkle_ksa1?_r=1&_t=ZS-941mQj9tRKL')}>
                <IconComponentTikTok size={26} color={'white'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openLink('https://instagram.com/sparkle_ph?igshid=MzRlODBiNWFlZA==')}>
                <IconComponentInstagram size={26} color={'white'} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openLink('https://www.snapchat.com/add/sparkle_ksa1')}>
                <IconComponentSnapChat size={26} color={'white'} />
              </TouchableOpacity>
            </View>
            <Text style={styles.footerLinks}>
              <Text onPress={() => openLink('https://sparkleksa.com/index.php?route=information/information/agree&information_id=3')}>
                {isLabel?.privacy_policy}
              </Text>
              {/* {"   ·   "}
  <Text onPress={() => openLink('https://yourdomain.com/terms-of-sale')}>
    {isLabel?.terms_of_sale}
  </Text>
  {"  ·  "}
  <Text onPress={() => openLink('https://yourdomain.com/terms-of-use')}>
    {isLabel?.term_of_use}
  </Text> */}
            </Text>

            <Text style={styles.footerLinks}>
              <Text onPress={() => openLink('https://sparkleksa.com/index.php?route=information/contact')}>
                {isLabel?.customer_happines_center}
              </Text>
              {"  ·  "}
              <Text onPress={() => openLink('https://sparkleksa.com/%D8%B3%D9%8A%D8%A7%D8%B3%D8%A7%D8%AA-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B1%D8%AC%D8%A7%D8%B9-%D9%88%D9%84%D8%A7%D8%B3%D8%AA%D8%A8%D8%AF%D8%A7%D9%84')}>
                {isLabel?.return_policy}
              </Text>
              {"  ·  "}
              <Text onPress={() => openLink('https://sparkleksa.com/%D8%B3%D9%8A%D8%A7%D8%B3%D8%A7%D8%AA-%D8%A7%D9%84%D8%A7%D8%B3%D8%AA%D8%B1%D8%AC%D8%A7%D8%B9-%D9%88%D9%84%D8%A7%D8%B3%D8%AA%D8%A8%D8%AF%D8%A7%D9%84')}>
                {isLabel?.warranty_policy}
              </Text>
            </Text>
          </GlassContainer>


          <View style={{ width: '80%', alignSelf: 'center' }}>
            <Text style={styles.footerSub}>{storeAddress}</Text>
            <Text style={styles.footerSub}>{taxNumber}</Text>
            <Text style={styles.footerSub}>{registrationNumber}</Text>
          </View>


        </ScrollView>



        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >

          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >

            <View style={{ flex: 1 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => { setModalVisible(false); setEnableUpdate(false); }}
                style={{
                  flex: 1,
                  backgroundColor: 'rgba(0,0,0,0.6)',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >

                <BlurView
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                  tint="dark"      // Matches blurType="dark"
                  intensity={75}   // Roughly matches blurAmount={15}. Adjust between 60-90 to taste.
                />

                <TouchableOpacity activeOpacity={1}>
                  <ImageBackground
                    source={require('../assets/images/backgroundimage.png')}
                    resizeMode="cover"
                    style={{
                      width: width * 0.80,   // 👈 THIS FIXES IT
                      borderRadius: 16,
                      overflow: 'hidden',
                    }}
                  >

                    <View style={{ width: '100%', height: isLandscape && 350, paddingHorizontal: 12, paddingBottom: isLandscape ? 10 : 30, borderRadius: 10, paddingTop: isLandscape && 10, backgroundColor: "rgba(0,0,0,0.5)" }}>
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
                                inputStyle={{ w: '100%', h: 50, ph: 20, }}
                                InputType="text"
                                textVlaue={formData?.firstname}
                                onChangeText={(value) => handleInputChange('firstname', value)}
                                isRequired={true}
                                ErrorMessage={errors?.firstname}
                              />
                              <InputBox label={userInfoLabel?.userdetaillname_label}
                                placeholder={userInfoLabel?.userdetaillname_label}
                                inputStyle={{ w: '100%', h: 50, ph: 20, }}
                                InputType="text"
                                textVlaue={formData?.lastname}
                                onChangeText={(value) => handleInputChange('lastname', value)}
                                isRequired={true}
                                ErrorMessage={errors?.lastname}
                              />
                              <InputBox label={userInfoLabel?.userdetailphn_label}
                                placeholder={userInfoLabel?.userdetailphn_label}
                                inputStyle={{ w: '100%', h: 50, ph: 20, }}
                                InputType="numeric"
                                textVlaue={formData?.telephone}
                                onChangeText={(value) => handleInputChange('telephone', value)}
                                //  ErrorMessage={errors?.telephone}
                                editable={false}

                              // isRequired={true}
                              />

                              <InputBox label={userInfoLabel?.userdetailemail_label}
                                placeholder={userInfoLabel?.userdetailemail_label}
                                inputStyle={{ w: '100%', h: 50, ph: 20, }}
                                InputType="email"
                                textVlaue={formData?.email}
                                onChangeText={(value) => handleInputChange('email', value)}
                                isRequired={true}
                                ErrorMessage={errors?.email}
                              />
                              <TouchableOpacity
                                onPress={() => onClickUpdateProfile()}
                                style={{ backgroundColor: Colors.primary, gap: 10, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', height: isLandscape && 50 }}>
                                <Text style={commonStyles.textWhite_lg}>{isLabel?.acntdbupdatebtn_label}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : <View style={{ gap: 10, }}>
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
                  </ImageBackground>
                </TouchableOpacity>

              </TouchableOpacity>
            </View>

          </KeyboardAvoidingView>


        </Modal>

      </BackgroundWrapper>
      <SuccessModal
        isSuccessMessage={isSuccessMgs}
        isModal={isSuccessModal}
        onClickClose={() => onClickOkButton()}
        handleCloseModal={() => onClickOkButton()}
      />
    </>
  );
};
const AccountItem = ({ image, label }) => (
  <View
    style={{
      alignItems: "center",
      gap: 6,
      width: 80, // container size stays the same
    }}
  >
    <GlassContainer>
      <Image
        source={image}
        resizeMode="contain"
        style={{
          width: 46,   // increased from 36 → 46
          height: 46,  // increased from 36 → 46
        }}
      />
    </GlassContainer>

    <Text
      style={{
        color: "#fff",
        fontSize: 13,
        fontWeight: "500",
        textAlign: "center",
      }}
    >
      {label}
    </Text>
  </View>
);


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginTop: 30,
    marginHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconSmall: {
    width: 22,
    height: 22,
    tintColor: "#fff",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",

  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  section: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  iconBox: {
    alignItems: "center",
    gap: 6,
    width: 80,
  },
  iconImage: {
    width: 36,
    height: 36,
  },
  iconLabel: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    textAlign: "center",
  },
  support: {
    // marginHorizontal: 20,
    // marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 70
  },
  supportText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
    textAlign: "center",
    paddingTop: 10
  },
  supportIcon: {
    width: 24,
    height: 24,
    tintColor: "#fff",
    marginTop: 10
  },
  signOut: {
    marginHorizontal: 70,
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  signOutText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 20,
    textAlign: 'center',
    paddingTop: 10
  },
  footer: {
    marginHorizontal: 20,
    // marginTop: 30,
    alignItems: "center",
    paddingVertical: 20,
  },
  footerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    gap: 32,
    marginVertical: 12,
  },
  socialIcon: {
    width: 26,
    height: 26,
    tintColor: "#fff",
  },
  footerLinks: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginVertical: 2,
  },
  footerSub: {
    color: "#fff",
    fontSize: 13,
    textAlign: "center",
    marginTop: 2,
    lineHeight: 30,
    fontWeight: '700'
  },
  liquid: {
    borderRadius: 12,
  },

  inner: {
    padding: 10,
    alignItems: "center",
    borderRadius: 12,
    overflow: "hidden",

    borderWidth: 0.6,
    borderColor: "rgba(255,255,255,0.5)",

    /* floating glass */
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    // elevation: 8,
  },

  text: {
    color: "white",
  },
});

export default MyAccountScreen;
