import { View, Text, ScrollView, TouchableOpacity, Platform, Image, BackHandler, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyles from '../constants/CommonStyles'
import TitleBarName from '../components/TitleBarName'
import CustomButton from '../components/CustomButton'
import { useCustomContext } from '../hooks/CustomeContext'
import CustomActivity from '../components/CustomActivity'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'
import LottieView from 'lottie-react-native'
import { checkAutoLogin } from '../utils/helpers'
import NotificationAlert from '../components/NotificationAlert'

const OrderConfirmation = ({ navigation, route }) => {
    const { orderId } = route.params;
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState();
    const [isLabel, setLabel] = useState();
    const [feedbackScanner, setFeedbackScanner] = useState();

    useEffect(() => {
        checkAutoLogin();
        fetchOrderConfirmationText();
    }, []);


    useEffect(() => {
        const backAction = () => {
            navigation.navigate("Home"); // 👈 Navigate to Home screen
            return true; // prevent default back behavior
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [navigation]);


    const fetchOrderConfirmationText = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.order}`;
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
            }

            const response = await axios.post(url, body, { headers: headers });

            console.log("response order confirmation", response?.data);

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response?.data?.text);
                setFeedbackScanner(response?.data?.forea_review_qr_image);

            }

        } catch (error) {
            alert(GlobalText?.extrafield_somethingwrong);
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={commonStyles.bodyConatiner}>
                            <TitleBarName onClickBackIcon={() => navigation.navigate('Home')} titleName={isLabel?.orderconfirmpagename_label} />
                            <ScrollView showsVerticalScrollIndicator={false} >
                                <View style={{ marginTop: isLandscape ? 0 : 100, alignItems: 'center', justifyContent: 'center', width: 200, height: 200, alignSelf: 'center', }}>
                                    <LottieView
                                        source={require("../assets/animation/success.json")}
                                        autoPlay={true}
                                        loop={false}
                                        style={{ width: '100%', height: '100%', position: 'absolute', zIndex: -1, }}
                                    />
                                </View>

                                <View style={{ alignItems: 'center', gap: 10, marginVertical: 20, marginHorizontal: 12 }}>
                                    <Text style={commonStyles.text_lg}>{isLabel?.orderconfirmorderno_label}: {orderId}</Text>
                                    <Text style={commonStyles.text_lg}>{isLabel?.orderconfirmthankyou_label}</Text>
                                    <View style={{ width: '100%', marginTop: 20 }}>
                                        <CustomButton buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary }} buttonText={isLabel?.orderconfirmvieworderbtn_label} OnClickButton={() => navigation.navigate('OrderView', { orderId: orderId })} />
                                    </View>
                                </View>
                                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                                    <Text style={{ fontSize: 16, color: Colors.primary, fontWeight: '500', alignSelf: 'center' }}>{isLabel?.orderconfirmcntbtn_label}</Text>
                                </TouchableOpacity>

                                {feedbackScanner && <View style={{ width: '100%', height: 150, marginVertical: 20 }}>
                                    <Image source={{ uri: feedbackScanner }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                </View>}
                                <View style={{ marginBottom: 20 }} />
                            </ScrollView>
                        </View >
                        <NotificationAlert />
                    </ >

                )
            }
        </>

    )
}

export default OrderConfirmation