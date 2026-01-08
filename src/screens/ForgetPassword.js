import { View, Text, ScrollView, Image, Alert, TouchableOpacity, Platform, useWindowDimensions } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleBarSkip from '../components/TitleBarSkip'
import commonStyles from '../constants/CommonStyles'
import InputBox from '../components/InputBox'
import CustomButton from '../components/CustomButton'
import { useCustomContext } from '../hooks/CustomeContext'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import CustomActivity from '../components/CustomActivity'
import { _retrieveData } from '../utils/storage'
import SuccessModal from '../components/SuccessModal'
import { checkAutoLogin } from '../utils/helpers'
import NotificationAlert from '../components/NotificationAlert'

const ForgetPassword = ({ navigation }) => {
    const { Colors, Features, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [email, setEmail] = useState();
    const [isSuccess, setSuccess] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [notfoundEmailError, setNotfoundEmailError] = useState();
    const [screenLoading, setScreenLoading] = useState(false);

    useEffect(() => {
        checkAutoLogin();
        fatchForgotText();
    }, [])

    const fatchForgotText = async () => {
        try {
            setScreenLoading(true);
            const url = `${BASE_URL}${EndPoint?.login_forgotpassword}`; // Replace with your endpoint
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData('USER');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId,
                customer_id: user ? user[0]?.customer_id : null
            }
            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data.text);
            }

        } catch (error) {
            console.log("error currency:", error.message);
        } finally {
            setScreenLoading(false);
        }
    }

    const onClickForgot = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.login_forgotpasswordvalidate}`; // Replace with your endpoint
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData('USER');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId,
                customer_id: user ? user[0]?.customer_id : null,
                email: email
            }
            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                setSuccessMgs(response.data?.success?.message);
                setSuccess(true);
            }
        } catch (error) {
            if (error?.response.data?.error?.notfound) {
                setNotfoundEmailError(error?.response.data?.error?.notfound);
            } else {
                alert(GlobalText?.extrafield_somethingwrong);
            }

        } finally {
            setLoading(false);
        }
    }

    const onchangeText = (text) => {
        setEmail(text);
    }

    return (
        <>
            {
                screenLoading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={commonStyles.bodyConatiner}>
                            <TitleBarSkip onClickBackIcon={() => navigation.goBack()} isDisableSkipBtn={true} />
                            <View style={{ marginHorizontal: 12, opacity: loading ? 0.5 : 1, paddingBottom: isLandscape && 100 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>

                                    <View style={{ marginHorizontal: 12, marginBottom: 10 }}>
                                        <TouchableOpacity onPress={() => navigation.navigate('Home')} style={{ alignItems: 'center', marginTop: 12, width: Features?.menu_logo_width || 200, height: Features?.menu_logo_height || 100, alignSelf: 'center' }}>
                                            {
                                                Features?.menu_logo ? (
                                                    <Image source={{ uri: Features.menu_logo }} style={{ resizeMode: 'cover', width: '100%', height: '100%', }} />
                                                ) : <IconComponentImage />
                                            }
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{ marginHorizontal: '10%', alignItems: 'center', gap: 8 }}>
                                        <Text style={commonStyles.heading_lg}>{isLabel?.fpsw_heading}</Text>
                                        <Text style={[commonStyles.text_lg, { textAlign: 'center', }]}>{isLabel?.fpswtxt_label}</Text>
                                    </View>
                                    <View style={{ marginTop: 40 }}>
                                        <InputBox label={isLabel?.fpswemail_label}
                                            placeholder={isLabel?.fpswemail_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            InputType={'email-address'}
                                            onChangeText={(text) => { onchangeText(text); setNotfoundEmailError(null) }}
                                            textVlaue={email}
                                            isRequired={true}
                                            borderColor={notfoundEmailError ? 'red' : null}
                                        />
                                        {
                                            notfoundEmailError ? <Text style={{ color: 'red' }}>{notfoundEmailError}</Text> : null
                                        }

                                    </View>
                                    <View style={{ marginTop: 40 }}>
                                        <CustomButton OnClickButton={onClickForgot}
                                            btnDisabled={loading}
                                            buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary }}
                                            buttonText={isLabel?.fpswforgotbtn_label}
                                        />
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        <SuccessModal
                            isModal={isSuccess}
                            isSuccessMessage={isSuccessMgs}
                            handleCloseModal={() => { setSuccess(false); navigation.navigate('ResetPassword'); }}
                            onClickClose={() => { setSuccess(false); navigation.navigate('ResetPassword'); }}
                        />
                        <NotificationAlert />
                    </>
                )
            }

        </>

    )
}

export default ForgetPassword