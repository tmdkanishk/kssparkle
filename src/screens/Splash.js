import { View, Image, StyleSheet, PermissionsAndroid, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { _retrieveData, _storeData } from '../utils/storage'
import { useCustomContext } from '../hooks/CustomeContext'
import { getApp, initializeApp } from '@react-native-firebase/app';
import {
    AuthorizationStatus,
    getMessaging,
    getToken,
    registerDeviceForRemoteMessages,
} from '@react-native-firebase/messaging';
import { saveFCMToken } from '../services/saveFCMToken';
import { checkAutoLogin } from '../utils/helpers';
import { getAnalytics } from '@react-native-firebase/analytics';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';
import Video from 'react-native-video';
import { setAppReady } from '../utils/appState';

const Splash = ({ navigation }) => {

    console.log("SPLASH SCREEN LOADED")
    // const { Colors, Features, EndPoint, GlobalText } = useCustomContext();
      const { Colors, EndPoint, GlobalText } = useCustomContext();

    const [isWidth, setWidth] = useState(200);
    const [isHeight, setHeight] = useState(200);

    useEffect(() => {
        if (Platform.OS === 'android') {
            requestAndroidUserPermission();
        } else {
            requestIOSUserPermission();
        }


        /*         getMessaging(getApp()).onNotificationOpenedApp(remoteMessage => {
                    console.log("remote Message background 1", remoteMessage);
                    if (remoteMessage?.data?.screen) {
                        if (remoteMessage?.data?.screen === 'Product') {
                            navigation.replace(remoteMessage?.data?.screen, { productId: remoteMessage?.data?.id });
                        } else if (remoteMessage?.data?.screen === 'OrderView') {
                            navigation.replace(remoteMessage?.data?.screen, { orderId: remoteMessage?.data?.id });
                        } else if (remoteMessage?.data?.screen === 'AllCategoryView') {
                            navigation.replace(remoteMessage?.data?.screen, { path: remoteMessage?.data?.id });
                        }
                        else {
                            navigation.replace(remoteMessage?.data?.screen);
                        }
                    }
                }); */

                
        // getMessaging(getApp()).onMessage(async (remoteMessage) => {
        //     console.log("remote Message foreground 2", remoteMessage);
        //     Alert.alert(
        //         remoteMessage.notification.title,
        //         remoteMessage.notification.body,
        //         [
        //             { text: "CANCEL", onPress: () => console.log('cancel pressed!') },
        //             {
        //                 text: 'OK', onPress: () => {
        //                     if (remoteMessage?.data?.screen) {
        //                         if (remoteMessage?.data?.screen === 'Product') {
        //                             navigation.replace(remoteMessage?.data?.screen, { productId: remoteMessage?.data?.id });
        //                         } else if (remoteMessage?.data?.screen === 'OrderView') {
        //                             navigation.replace(remoteMessage?.data?.screen, { orderId: remoteMessage?.data?.id });
        //                         } else if (remoteMessage?.data?.screen === 'AllCategoryView') {
        //                             navigation.replace(remoteMessage?.data?.screen, { path: remoteMessage?.data?.id });
        //                         }
        //                         else {
        //                             navigation.replace(remoteMessage?.data?.screen);
        //                         }
        //                     }
        //                 }
        //             }
        //         ]
        //     );
        // });


        async function checkInitialNotification() {
            const initialNotification = await getMessaging(getApp()).getInitialNotification();
            // console.log("initialNotification app killed ", initialNotification);
            if (initialNotification?.data?.screen) {
                if (initialNotification?.data?.screen === 'Product') {
                    navigation.replace(initialNotification?.data?.screen, { productId: initialNotification?.data?.id });
                } else if (initialNotification?.data?.screen === 'OrderView') {
                    navigation.replace(initialNotification?.data?.screen, { orderId: initialNotification?.data?.id });
                } else if (initialNotification?.data?.screen === 'AllCategoryView') {
                    navigation.replace(initialNotification?.data?.screen, { path: initialNotification?.data?.id });
                }
                else {
                    navigation.replace(initialNotification?.data?.screen);
                }
            }
        }

        checkInitialNotification();

    }, [])



    const getUser = async () => {
        const user = await _retrieveData('USER');
        console.log("user :", user);
        getAnalytics().logEvent('Active User', { data: user[0]?.firstname + " " + user[0]?.lastname || "Unknown User" });
    }

    useEffect(() => {
        let isMounted = true;

        const initializeApp = async () => {
            try {
                checkAutoLogin();
                getSplaceWidthAndHeight();

                // Splash delay
                await new Promise(resolve => setTimeout(resolve, 5500));

                const isLanguageAndCurrency = await checkLanguageandCurrency();
                const customerId = await _retrieveData('CUSTOMER_ID');
                const skipLogin = await _retrieveData('SKIP_LOGIN');

                if (!isMounted) return;

                // 🔥 MARK APP READY HERE (before navigation)
                 setAppReady(true);

                // 🔥 Decision Logic
                if (!isLanguageAndCurrency) {
                    navigation.replace('ChooseLanguage');
                    return;
                }

                if (customerId || skipLogin === 'true') {
                    navigation.replace('Home');
                } else {
                    navigation.replace('Login');
                }

            } catch (error) {
                navigation.replace('Login');
            }
        };

        initializeApp();

        return () => {
            isMounted = false;
        };
    }, []);


    // useEffect(() => {
    //     let isMounted = true;

    //     const checkAuth = async () => {
    //         try {
    //             const customerId = await _retrieveData('CUSTOMER_ID');
    //             const skipLogin = await _retrieveData('SKIP_LOGIN');

    //             if (!isMounted) return;

    //             if (customerId || skipLogin === 'true') {
    //                 navigation.replace('Home');
    //             } else {
    //                 navigation.replace('Login');
    //             }
    //         } catch (error) {
    //             navigation.replace('Login');
    //         }
    //     };

    //     checkAuth();

    //     return () => {
    //         isMounted = false;
    //     };
    // }, []);


    // useEffect(() => {
    //     checkAutoLogin();
    //     getSplaceWidthAndHeight();

    //     const timer = setTimeout(async () => {
    //         const isLanguage_and_currency = await checkLanguageandCurrency();
    //         if (isLanguage_and_currency === true) {
    //             console.log("true case works")
    //             navigation.replace('Home');
    //         } else {
    //             navigation.replace('ChooseLanguage');
    //         }

    //     }, 3000);
    //     return () => {
    //         clearTimeout(timer);
    //     };
    // }, []);





    const setDefaultLanguageAndCurrency = async () => {
        await _storeData('SELECT_LANG', { code: 'en-gb' });
        await _storeData('SELECT_CURRENCY', { code: 'EUR' });
    }

    const checkLanguageandCurrency = async () => {
        const language = await _retrieveData('SELECT_LANG');
        const currency = await _retrieveData('SELECT_CURRENCY');

        console.log(language, currency);

        if (language != null && currency != null) {
            return true;
        } else {
            return false;
        }

    }



    const getSplaceWidthAndHeight = async () => {
        const width = await _retrieveData('SPLACE_WIDTH');
        const height = await _retrieveData('SPLACE_HEIGHT');
        setHeight(height);
        setWidth(width);
    }

    // Get FCM Token
    const getFCMToken = async () => {
        console.log("FCM Token Function runs")
        try {
            const messaging = getMessaging(getApp());
            // iOS requires APNs registration before getToken() (otherwise messaging/unregistered).
            if (Platform.OS === 'ios') {
                await registerDeviceForRemoteMessages(messaging);
            }
            const token = await getToken(messaging);
            console.log("FCM Token: ", token);

            if (token) {
                await saveFCMToken(token, EndPoint?.pushnotification);
                console.log('FCM token saved to backend.');
            } else {
                console.warn("FCM Token was null or undefined after getToken() call.");
            }
            return token;
        } catch (error) {
            console.error('Error fetching FCM Token:', error.message);
            if (error.code === 'messaging/unregistered') {
                Alert.alert(
                    'FCM Registration Error',
                    'Failed to register for remote messages. Ensure Push Notifications are enabled in iOS settings and check native configuration (APNs setup in Firebase & Xcode). This app may not receive notifications correctly.',
                    [{ text: 'OK' }]
                );
            }
        }
    };

    const requestAndroidUserPermission = async () => {
        if (Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log('Notification permission granted.');
                await getFCMToken();
            } else {
                console.log('Notification permission denied');
            }

        } else {
            await getFCMToken();
        }
    };


    // Request permissions on iOS
    const requestIOSUserPermission = async () => {
        const messaging = getMessaging(getApp());
        console.log("requestIOSUserPermission")
        const authStatus = await messaging.requestPermission();
        const enabled =
            authStatus === AuthorizationStatus.AUTHORIZED ||
            authStatus === AuthorizationStatus.PROVISIONAL;
        if (enabled) {
            console.log('Authorization status:', enabled);
            await getFCMToken();// make sure this function is defined
        } else {
            Alert.alert('Push Notification Permission Denied');
        }
    };

    return (

      
<View style={styles.container}>
  <Image
    source={require('../assets/sparkle_logo.gif')}
    style={styles.gif}
    resizeMode="cover"
  />

  <View style={styles.overlay} />
</View>

    )
}

export default Splash


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  gif: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)', // adjust darkness here
  },
});
