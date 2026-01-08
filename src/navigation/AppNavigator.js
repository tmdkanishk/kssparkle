import React, { useEffect, useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';
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
import {Platform, StatusBar, useWindowDimensions } from 'react-native';
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




const Stack = createStackNavigator();

const AppNavigator = () => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { Colors } = useCustomContext();

  return (
    <NavigationContainer>
      <StatusBar hidden={isLandscape ? true : false} />
      <SafeAreaView style={{ flex: 1, backgroundColor: isLandscape ? null : "grey", }}>
        <Stack.Navigator>
          <Stack.Screen name="Splash" component={Splash} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition, }} />
          <Stack.Screen name="Home" component={Home} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition, gestureEnabled: false }} />
          <Stack.Screen name="SideBar" component={SideBar} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Login" component={Login} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Register" component={Register} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="VerificationCode" component={VerificationCode} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ForgetPassword" component={ForgetPassword} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Product" component={Product} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ShoppingBag" component={ShoppingBag} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ShippingMethod" component={ShippingMethod} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ChoosePaymentMethod" component={ChoosePaymentMethod} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ChooseDeliveryAddress" component={ChooseDeliveryAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="MyAccountScreen" component={MyAccountScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="MyOrderScreen" component={MyOrderScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="TrackingDetails" component={TrackingDetails} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="SparkleScreen" component={SparkleScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
           <Stack.Screen name="OrderSuccessScreen" component={OrderSuccessScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Review" component={Review} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="AccountDashboard" component={AccountDashboard} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="CartScreen" component={CartScreen} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Checkout" component={Checkout} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="OrderConfirmation" component={OrderConfirmation} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="OrderHistory" component={OrderHistory} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="OrderView" component={OrderView} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Category" component={Category} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
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
          <Stack.Screen name="Notification" component={Notification} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="ReturnOrder" component={ReturnOrder} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="AddNewAddress" component={AddNewAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="EditAddress" component={EditAddress} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="SpecialProducts" component={SpecialProducts} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="LatestCategoryView" component={LatestCategoryView} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="AccountDelete" component={AccountDelete} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="AccountDeleteReview" component={AccountDeleteReview} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Brands" component={Brands} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
          <Stack.Screen name="Products" component={Products} options={{ headerShown: false, ...TransitionPresets.ModalFadeTransition }} />
        </Stack.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  )
}

export default AppNavigator