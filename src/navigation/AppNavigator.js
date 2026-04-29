import React, { useEffect, useRef, useState } from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import Home from '../screens/Home';
import Splash from '../screens/Splash';
import SideBar from '../components/SideBar';
import Login from '../screens/Login';
import Register from '../screens/Register';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import ForgetPassword from '../screens/ForgetPassword';
import Product from '../screens/Product';
import Review from '../screens/Review';
import AccountDashboard from '../screens/AccountDashboard';
import CartScreen from '../screens/CartScreen';
import Checkout from '../screens/Checkout';
import OrderConfirmation from '../screens/OrderConfirmation';
import OrderHistory from '../screens/OrderHistory';
import OrderView from '../screens/OrderView';
import Category from '../screens/Category';
import Contact from '../screens/Contact';
import Search from '../screens/Search';
import AllCategoryView from '../screens/AllCategoryView';
import CategoryView from '../screens/CategoryView';
import { ImageBackground, Platform, StatusBar, useWindowDimensions, View, StyleSheet, Dimensions } from 'react-native';
import { useCustomContext } from '../hooks/CustomeContext';
import ChooseLanguage from '../screens/ChooseLanguage';
import ChooseCurrency from '../screens/ChooseCurrency';
import ResetPassword from '../screens/ResetPassword';
import Wishlist from '../screens/Wishlist';
import MyAddress from '../screens/MyAddress';
import UserDetail from '../screens/UserDetail';
import Rating from '../screens/Rating';
import Download from '../screens/Download';
import ChangePassword from '../screens/ChangePassword';
import Compare from '../screens/Compare';
import Payment from '../screens/Payment';
import OrderPlace from '../screens/OrderPlace';
import Notification from '../screens/Notification';
import ReturnOrder from '../screens/ReturnOrder';
import AddNewAddress from '../screens/AddNewAddress';
import EditAddress from '../screens/EditAddress';
import SpecialProducts from '../screens/SpecialProducts';
import LatestCategoryView from '../screens/LatestCategoryView';
import AccountDelete from '../screens/AccountDelete';
import AccountDeleteReview from '../screens/AccountDeleteReview';
import Brands from '../screens/Brands';
import Products from '../screens/Products';
import { SafeAreaView } from 'react-native-safe-area-context';
import VerificationCode from '../screens/VerificationCode';
import ProductDetail from '../screens/ProductDetail';
import ShoppingBag from '../screens/ShoppingBag';
import ShippingMethod from '../screens/ShippingMethod';
import ChooseDeliveryAddress from '../screens/ChooseDeliveryAddress';
import ChoosePaymentMethod from '../screens/ChoosePaymentMethod';
import MyAccountScreen from '../screens/MyAccountPage';
import MyOrderScreen from '../screens/MyOrderScreen';
import OrderDetailsScreen from '../screens/OrderDetailScreen';
import TrackingDetails from '../screens/TrackingDetails';
import SparkleScreen from '../screens/SparkleScreen';
import OrderSuccessScreen from '../screens/OrderSuccessScreen';
import SubCategory from '../screens/SubCategory';
import TabbyCheckoutScreen from '../screens/TabbyCheckoutScreen';
import PromoWebViewScreen from '../screens/PromoWebViewScreen';
import MoyasarPaymentScreen from '../screens/MoyasarPaymentScreen';
import ProductSearchScreen from '../screens/ProductSearchScreen';
import ReviewMediaScreen from '../screens/ReviewMediaScreen';
import GlobalPopup from '../components/GlobalPopup';
import { navigationRef } from '../utils/navigationService';
import { getGlobalPopupData } from '../services/getGlobalPopupData';
import { shouldShowPopup } from '../utils/shouldShowPopup';
import { isAppReady } from '../utils/appState';
import TamaraPaymentScreen from '../screens/TamaraPaymentScreen';
import GlassTestScreen from '../screens/GlassTestScreen';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';

// const EXCLUDED_SCREENS = ["Splash", "Login", "VerificationCode", "Register", "ChooseLanguage", "ChooseCurrency"];



const Stack = createStackNavigator();

const AppNavigator = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState(null);

  console.log("POPUP VISIBLE:", popupVisible); // ✅ ADD HERE

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { Colors, EndPoint } = useCustomContext();
  const popupTimerRef = useRef(null);
  const hasScheduledPopup = useRef(false);

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: "transparent",
    },
  };



  // useEffect(() => {
  //   let timer;

  //   const initPopup = async () => {
  //     try {
  //       const result = await getGlobalPopupData(EndPoint?.global_popup);

  //       console.log("STEP 1 API RESULT:", result);

  //       const data = result;

  //       console.log("STEP 2 DATA:", data);

  //       const shouldShow = await shouldShowPopup(data);

  //       console.log("STEP 3 SHOULD SHOW:", shouldShow);

  //       if (data && shouldShow) {
  //         const delay = parseInt(data?.time || "0");

  //         console.log("STEP 4 DELAY:", delay);

  //         setTimeout(() => {
  //           console.log("🔥 STEP 5 SETTING POPUP TRUE");
  //           setPopupData(data);
  //           setPopupVisible(true);
  //         }, delay);
  //       }

  //     } catch (e) {
  //       console.log("ERROR:", e);
  //     }
  //   };

  //   initPopup();

  //   return () => {
  //     if (timer) clearTimeout(timer);
  //   };
  // }, []);

  const handleClose = () => {
    console.log("❌ Parent handleClose triggered");
    if (popupTimerRef.current) {
      console.log("🧹 Clearing timer");
      clearTimeout(popupTimerRef.current);
    }

    setPopupVisible(false);

    console.log("📴 Popup hidden");

  };
  return (
    <>
      <NavigationContainer theme={navTheme} ref={navigationRef}>
        <ImageBackground
          source={require("../assets/images/backgroundimage.png")}
          style={{ flex: 1, }}
          resizeMode="cover"
          imageStyle={{
            left: -30,  // move image left
          }}

        >

          <View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFillObject,
              { backgroundColor: "rgba(0,0,0,0.4)" },
            ]}
          />
          <StatusBar hidden={isLandscape ? true : false} />
          <SafeAreaView style={{ height: "100%", backgroundColor: "transparent", paddingVertical: Platform.OS === 'ios' ? height * 0.05 : height * 0.0001 }}>
            <Stack.Navigator screenOptions={{
              headerShown: false,
              cardStyle: { backgroundColor: "rgba(0,0,0,0.01)" },
              ...TransitionPresets.ModalFadeTransition,
              detachPreviousScreen: true,  // ✅ ADD THIS
            }}>
              <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition, }} />
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Login" component={Login} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Register" component={Register} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="VerificationCode" component={VerificationCode} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Product" component={Product} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ProductSearchScreen" component={ProductSearchScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ShoppingBag" component={ShoppingBag} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ShippingMethod" component={ShippingMethod} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ChoosePaymentMethod" component={ChoosePaymentMethod} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ChooseDeliveryAddress" component={ChooseDeliveryAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="TrackingDetails" component={TrackingDetails} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="SparkleScreen" component={SparkleScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ReviewMediaScreen" component={ReviewMediaScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Review" component={Review} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="AccountDashboard" component={AccountDashboard} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="OrderView" component={OrderView} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Category" component={Category} />
              <Stack.Screen name="SubCategory" component={SubCategory} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Contact" component={Contact} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Search" component={Search} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="AllCategoryView" component={AllCategoryView} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="CategoryView" component={CategoryView} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ChooseLanguage" component={ChooseLanguage} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ChooseCurrency" component={ChooseCurrency} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ResetPassword" component={ResetPassword} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Wishlist" component={Wishlist} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="MyAddress" component={MyAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="UserDetail" component={UserDetail} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Rating" component={Rating} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Download" component={Download} options={{ headerShown: false }} />
              <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Compare" component={Compare} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Payment" component={Payment} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="OrderPlace" component={OrderPlace} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="TabbyCheckoutScreen" component={TabbyCheckoutScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="ReturnOrder" component={ReturnOrder} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="AddNewAddress" component={AddNewAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="EditAddress" component={EditAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="SpecialProducts" component={SpecialProducts} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="TamaraPaymentScreen" component={TamaraPaymentScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="LatestCategoryView" component={LatestCategoryView} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="AccountDelete" component={AccountDelete} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="AccountDeleteReview" component={AccountDeleteReview} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Brands" component={Brands} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="Products" component={Products} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen name="GlassTestScreen" component={GlassTestScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
              <Stack.Screen
                name="PromoWebView"
                component={PromoWebViewScreen}
                // options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition,  title: route.params?.title || 'Payment Details'}}
                options={({ route }) => ({
                  title: route.params?.title || 'Payment Details',
                  headerShown: false, ...TransitionPresets.ModalFadeTransition,
                })}
              />
              <Stack.Screen name="MoyasarPayment" component={MoyasarPaymentScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />

            </Stack.Navigator>
          </SafeAreaView>
        </ImageBackground>
      </NavigationContainer>
      {/* 
<GlobalPopup
  visible={popupVisible}
  data={popupData}
  onClose={handleClose}
/> */}
    </>
  )
}

export default AppNavigator