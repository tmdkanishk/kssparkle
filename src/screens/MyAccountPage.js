import React, { useCallback, useRef, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, Platform, Dimensions, useWindowDimensions, Animated, Share, Alert, Modal, ImageBackground, KeyboardAvoidingView } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import GlassContainer from "../components/customcomponents/GlassContainer";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import { useCustomContext } from "../hooks/CustomeContext";
import { getCartItem } from "../services/getCartItem";
import { _clearData, _retrieveData } from "../utils/storage";
import { logout } from "../services/logout";
import { useLanguageCurrency } from "../hooks/LanguageCurrencyContext";
import { useCartCount } from "../hooks/CartContext";
import { useFocusEffect } from "@react-navigation/native";
import { checkAutoLogin } from "../utils/helpers";
import { API_KEY, BASE_URL } from "../utils/config";
import axios, { HttpStatusCode } from "axios";
import * as ImagePicker from 'expo-image-picker';
import { getUserInfo } from "../services/getUserInfo";
import { IconComponentClose, IconComponentEdit, IconComponentImage, IconComponentNotification } from "../constants/IconComponents";
import { updateUserInfomation } from "../services/updateUserInfomation";
import InputBox from "../components/InputBox";
import ImageContainer from "../components/ImageContainer";
import commonStyles from "../constants/CommonStyles";
import { BlurView } from "@react-native-community/blur";
import SuccessModal from "../components/SuccessModal";

const MyAccountScreen = ({ navigation }) => {


  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

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
      console.log("fetchUserInfo", result)
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
      console.log('error', error.message);
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
    console.log("onClickUpdateProfile", result?.success?.message)
    // setSuccessModal(true);
    // setSuccessMgs(result?.success?.message);

    setErrors({});

    setTimeout(() => {
      setModalVisible(false)
    }, 1000);

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
    SetLogin(false);
    //  const cartresponse = await getCartItem(EndPoint?.cart_total);
    //  updateCartCount(cartresponse?.cartproductcount);
    navigation.navigate('Login');
  }
  return (
    <>
    
    

    <BackgroundWrapper>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: Platform.OS === 'ios' ? 60 : 40,
          paddingHorizontal: 20,
        }}
      >


        <TouchableOpacity
          onPress={() => navigation.replace("Home")}
          style={{
            padding: 10,
            width: '45%',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderWidth: 0.6,
            borderColor: 'rgba(255,255,255,0.35)',
          }}
        >
          <Text style={{ color: 'white' }}>Go To Home Page</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            padding: 10,
            width: '45%',
            alignItems: 'center',
            borderRadius: 12,
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderWidth: 0.6,
            borderColor: 'rgba(255,255,255,0.35)',
          }}
        >
          <Text style={{ color: 'white' }}>Edit Account</Text>
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
            {/* <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ marginBottom: 20 }}>
              <Image source={require("../assets/images/back.png")} style={styles.iconSmall} />
            </TouchableOpacity> */}

            <Text style={styles.headerTitle}>{isLabel?.acntdbpagename_label}</Text>
          </View>


          <Image
            source={require("../assets/images/profile.png")}
            style={styles.profileImage}
          />
        </View>

        {/* Row 1 */}
        <GlassContainer padding={0.1} style={{ marginHorizontal: 20, marginTop: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-evenly", marginBottom: 20 }}>
            <AccountItem image={require("../assets/images/track.png")} label="Track" />
            <AccountItem image={require("../assets/images/ready.png")} label="Ready to go" />
            <AccountItem image={require("../assets/images/preparing.png")} label="Preparing" />
          </View>
        </GlassContainer>

        {/* Row 2 */}
        <GlassContainer style={styles.section}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

            <View style={{ alignItems: "center" }}>
              <GlassContainer style={{ width: 90, height: 100, justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/return.png")}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="contain"
                />
                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", textAlign: "center" }} >
                  Return
                </Text>
              </GlassContainer>


            </View>

            {/* ORDER */}
            <View style={{ alignItems: "center" }}>
              <GlassContainer style={{ width: 90, height: 100, justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/order.png")}
                  style={{ width: "80%", height: "80%" }}
                  resizeMode="contain"
                />

                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", textAlign: "center" }} >
                  {isLabel?.acntdbmyorders_heading}
                </Text>
              </GlassContainer>
            </View>

          </View>
          {/* <View style={styles.row}>
            <AccountItem image={require("../assets/images/wishlist.png")} label="Wishlist" />
            <AccountItem image={require("../assets/images/more.png")} label="More" />
          </View> */}

          <View style={{ flexDirection: "row", justifyContent: "space-between", marginVertical: 10, }}>

            <View style={{ alignItems: "center" }}>
              <GlassContainer style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/wishlist.png")}
                  style={{ width: "90%", height: "90%" }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 18,
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Wishlist
                </Text>
              </GlassContainer>

            </View>

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

            <View style={{ alignItems: "center" }}>
              <GlassContainer style={{ width: 90, height: 90, justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/images/more.png")}
                  style={{ width: "70%", height: "70%" }}
                  resizeMode="contain"
                />

                <Text style={{ color: "#fff", fontSize: 18, fontWeight: "500", textAlign: "center" }} >
                  More
                </Text>
              </GlassContainer>
            </View>

          </View>

        </GlassContainer>

        {/* Row 3 */}

        <View style={styles.row}>
          <AccountItem image={require("../assets/images/notification.png")} label="Notification" />
          <AccountItem image={require("../assets/images/address.png")} label={isLabel?.acntdbmyaddrs_label} />
          <AccountItem image={require("../assets/images/wallet.png")} label="Wallet" />
        </View>

        <GlassContainer style={{
          borderRadius: 5,
          marginBottom: 12,
          // padding: 10,
          flexDirection: 'row',
          minWidth: '80%',
          alignItems: 'center',
          justifyContent: 'center'
        }} padding={1}>
          <Text style={styles.supportText}>{isLabel?.acntdbhelp_label}</Text>
          <Image source={require("../assets/images/support.png")} style={styles.supportIcon} />
        </GlassContainer>

        <TouchableOpacity onPress={() => onClickOkButton()}>
          <GlassContainer style={{
            borderRadius: 5,
            marginBottom: 12,
            // padding: 10,
            flexDirection: 'row',
            minWidth: '80%',
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
          <Text style={styles.footerTitle}>Sell with us</Text>
          <View style={styles.socialRow}>
            <Image source={require("../assets/images/linkedin.png")} style={styles.socialIcon} />
            <Image source={require("../assets/images/instagram.png")} style={styles.socialIcon} />
            <Image source={require("../assets/images/x.png")} style={styles.socialIcon} />
            <Image source={require("../assets/images/facebook.png")} style={styles.socialIcon} />
          </View>

          <Text style={styles.footerLinks}>
            Privacy Policy   ·   Terms Of Sale   ·   Terms Of Use
          </Text>
          <Text style={styles.footerLinks}>
            Customer Happiness Center  ·  Return Policy  ·  Warranty Policy
          </Text>
        </GlassContainer>

        <View>
          <Text style={styles.footerSub}>Noon E Commerce Solutions One Person LLC</Text>
          <Text style={styles.footerSub}>
            VAT No. 3020046552 10003 | CR No. 10 10703009
          </Text>
          <Text style={styles.footerSub}>Version v4.76 (10325)</Text>
          <Text style={styles.footerSub}>© 2025 noon.com. All rights reserved.</Text>
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
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                blurType="dark"     // light | dark | extraDark
                blurAmount={15}     // intensity
                reducedTransparencyFallbackColor="rgba(0,0,0,0.6)"
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

        {/* <View style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
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
        </View> */}
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
    gap: 18,
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
    fontSize: 11,
    textAlign: "center",
    marginTop: 2,
    lineHeight: 30
  },
});

export default MyAccountScreen;
