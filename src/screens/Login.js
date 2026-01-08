import { View, Text, TouchableOpacity, Image, ScrollView, Platform, ImageBackground, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyles from '../constants/CommonStyles'
import TitleBarSkip from '../components/TitleBarSkip';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import { IconComponentEyes, IconComponentEyesLine, IconComponentImage } from '../constants/IconComponents';
import { _retrieveData, _storeData } from '../utils/storage';
import { useCustomContext } from '../hooks/CustomeContext';
import { API_KEY, BASE_URL } from '../utils/config';
import axios, { HttpStatusCode } from 'axios';
import CustomActivity from '../components/CustomActivity';
import { login } from '../services/login';
import FailedModal from '../components/FailedModal';
import NotificationAlert from '../components/NotificationAlert';
import { getCartItem } from '../services/getCartItem';
import BottomBar from '../components/BottomBar';
import { useCartCount } from '../hooks/CartContext';
import GlassmorphismInput from '../components/customcomponents/GlassmorphismInput';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';
import GlassmorphismButton from '../components/customcomponents/GlassmorphismButton';
import GlassSwipeButton from '../components/customcomponents/GlassSwipeButton';


const Login = ({ navigation }) => {
    const { Colors, Features, EndPoint, GlobalText, SetLogin } = useCustomContext();
    const { updateCartCount } = useCartCount();
    const [isShow, setShow] = useState(true);
    const [isEmail, setEmail] = useState('');
    const [isPassword, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [screenLoader, setScreenLoader] = useState(false);
    const [isLabel, setLabel] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorModalMgs, setErrorModalMgs] = useState();
    const [isLastScreen, setLastScreen] = useState(null);
    const [mobileNumber, setMobileNumber] = useState('');


    useEffect(() => {
        fectchLoginText();

        const unsubscribe = navigation.addListener('state', () => {
            const routes = navigation.getState().routes;
            const lastScreen = routes?.[routes.length - 2]?.name;
            setLastScreen(lastScreen)
        });

        return unsubscribe;
    }, [navigation]);

    const fectchLoginText = async () => {
        const user = await _retrieveData("CUSTOMER_ID");
        console.log("customer_id", user)
        try {
            setScreenLoader(true);
            const url = `${BASE_URL}${EndPoint?.login_logindetail}`; // Replace with your endpoint
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
                // currency: cur?.code,
                // customer_id: user ? user[0]?.customer_id : null,
                sessionid: sessionId,
            }
            const response = await axios.post(url, body, { headers: headers });

            if (response.status == HttpStatusCode.Ok) {
                console.log("otp restapi/login/verficationpage", response?.data)
                setLabel(response?.data);
            }

        } catch (error) {
            console.log("error_login_text:", error.response.data);
        } finally {
            setScreenLoader(false);
        }
    }

    const onClickEyesIcon = () => {
        setShow(!isShow);
    }

    const onClickOnLogin = async () => {
        try {
            setLoading(true);
            console.log("isEmail, isPassword, EndPoint?.login", isPassword, EndPoint?.login)
            const result = await login(EndPoint?.login, mobileNumber);
            console.log("result of send code button", result);
            if (result?.error) {
                setErrorModal(true);
                setErrorModalMgs(result?.error);
                return;
            }
            navigation.navigate("VerificationCode", { otp: result?.otp, telephone: result?.telephone })
            // if (result?.error?.nomatch) {
            //     setErrorModal(true);
            //     setErrorModalMgs(result?.error?.nomatch);
            //     return;
            // }
            // await _storeData("USER", result?.response);
            // SetLogin(true);
            // const cartresponse = await getCartItem(EndPoint?.cart_total);
            // updateCartCount(cartresponse?.cartproductcount);
            // if (isLastScreen === 'Home') {
            //     navigation.replace('AccountDashboard');
            // } else {
            //     navigation.goBack();
            // }
        } catch (error) {
            if (error?.response.data?.error?.attempt) {
                setErrorModal(true);
                setErrorModalMgs(error?.response.data?.error);
            } if (error?.response.data?.error?.approved) {
                setErrorModal(true);
                setErrorModalMgs(error?.response.data?.error?.approved);
            } else {
                setErrorModal(true);
                setErrorModalMgs(GlobalText?.extrafield_somethingwrong);
            }
        } finally {
            setLoading(false);
        }
    }

    const openEyesIcon = <IconComponentEyes color={Colors.iconColor} />;
    const closeEyesIcon = <IconComponentEyesLine color={Colors.iconColor} />;

    const handleSkipLogin = async () => {
        await _storeData('SKIP_LOGIN', 'true');
        navigation.replace('Home');
    };


    return (

        <>
            <BackgroundWrapper>


                <TouchableOpacity
                    onPress={handleSkipLogin}
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
                    <Text style={{ color: "white" }}>Skip Login</Text>
                </TouchableOpacity>
                <View style={{ backgroundColor: "transparent", justifyContent: "center", alignItems: 'center', flex: 1 }}>



                    <View style={{ marginHorizontal: 12, marginBottom: 100, opacity: loading ? 0.5 : 1, width: "85%" }}>


                        <View style={{ marginTop: 10, alignItems: 'flex-start', gap: 10 }}>
                            <Text onPress={() => navigation.navigate("Home")} style={{ fontSize: 24, fontWeight: '400', color: 'white', textAlign: "left" }}>{isLabel?.text_heading || "Test heading"}</Text>
                            <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.white, textAlign: 'left' }}>{isLabel?.text_description}</Text>
                        </View>
                        <View style={{ marginTop: 24 }}>

                            <GlassmorphismInput
                                placeholder={isLabel?.text_enter_number}
                                value={mobileNumber}
                                onChangeText={setMobileNumber}
                                keyboardType="number-pad"
                            />

                        </View>

                        <View style={{ marginTop: 24 }}>
                            <GlassmorphismButton
                                title={isLabel?.text_submitbtn}
                                onPress={() => onClickOnLogin()}
                            // arrow={true}
                            />

                        </View>


                    </View>

                    {/* <Text onPress={() =>  navigation.navigate("Register")} style={{ fontSize: 14, color: 'white', textAlign: 'left' }}><Text style={{ fontWeight: '300' }}>{isLabel?.text_signup || "skndvknkd"}</Text> </Text> */}

                    {/* <Text style={{ fontWeight: '400', textDecorationLine: 'underline' }} onPress={() => { navigation.navigate("Register") }} > Register</Text> */}
                </View>

            </BackgroundWrapper>
            <FailedModal
                isSuccessMessage={isErrorModalMgs}
                handleCloseModal={() => setErrorModal(false)}
                isModal={isErrorModal}
                onClickClose={() => setErrorModal(false)}
            />

            <NotificationAlert />
        </>

    )
}

export default Login



