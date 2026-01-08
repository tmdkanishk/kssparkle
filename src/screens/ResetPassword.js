import { View, Text, SafeAreaView, Image, ScrollView, TouchableOpacity, Platform, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity'
import TitleBarSkip from '../components/TitleBarSkip'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'
import InputBox from '../components/InputBox'
import CustomButton from '../components/CustomButton'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'
import FailedModal from '../components/FailedModal'
import SuccessModal from '../components/SuccessModal'
import NotificationAlert from '../components/NotificationAlert'

const ResetPassword = ({ navigation }) => {
    const { Colors, Features, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [isLabel, setLabel] = useState();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState();
    const [password, setPassword] = useState();
    const [confirm, setConfirm] = useState();
    const [isError, setError] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isSuccess, setSuccess] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [codeError, setCodeError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [cPasswordError, setCPasswordError] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);

    useEffect(() => {
        fatchResetText();
    }, [])

    const fatchResetText = async () => {
        try {
            setScreenLoading(true);
            const url = `${BASE_URL}${EndPoint?.login_Resetpassword}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId
            }
            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                console.log(response.data?.text);
                setLabel(response.data.text);
            }


        } catch (error) {
            console.log("error currency:", error.message);
        } finally {
            setScreenLoading(false);
        }
    }

    const onClickResetBtn = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.login_ResetpasswordValidation}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId,
                fpswcode: code,
                password: password,
                confirm: confirm
            }
            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setSuccessMgs(response.data?.success?.message);
                setSuccess(true);
            }
        } catch (error) {
            if (error?.response.data?.error) {
                if (error?.response.data?.error?.fpswcode) {
                    setCodeError(error?.response.data?.error?.fpswcode);
                } else {
                    setCodeError(null);
                }

                if (error?.response.data?.error?.password) {
                    setPasswordError(error?.response.data?.error?.password);
                } else {
                    setPasswordError(null);
                }

                if (error?.response.data?.error?.confirm) {
                    setCPasswordError(error?.response.data?.error?.confirm);
                } else {
                    setCPasswordError(null);
                }
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setError(true);
            }

        } finally {
            setLoading(false);
        }
    }

    const onChangeCode = (text) => {
        setCode(text);
    }

    const onChangePassword = (text) => {
        setPassword(text);
    }

    const onChangeConfirmPassword = (text) => {
        setConfirm(text);
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
                                <ScrollView showsVerticalScrollIndicator={false} style={{}}>
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
                                        <Text style={commonStyles.heading_lg}>{isLabel?.resetpsw_heading}</Text>
                                    </View>
                                    <View style={{ marginTop: 40, gap: 20 }}>
                                        <InputBox label={isLabel?.resetpswcode_label}
                                            placeholder={isLabel?.resetpswcode_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            InputType="text"
                                            onChangeText={(text) => { onChangeCode(text); setCodeError(null) }}
                                            textVlaue={code}
                                            isRequired={true}
                                            borderColor={codeError ? 'red' : null}
                                            ErrorMessage={codeError}
                                        />

                                        <InputBox label={isLabel?.resetpswpsw_label}
                                            placeholder={isLabel?.resetpswpsw_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            InputType={'text'}
                                            onChangeText={(text) => { onChangePassword(text); setPasswordError(null) }}
                                            textVlaue={password}
                                            isRequired={true}
                                            borderColor={passwordError ? 'red' : null}
                                            ErrorMessage={passwordError}
                                        />

                                        <InputBox label={isLabel?.resetpswcpsw_label}
                                            placeholder={isLabel?.resetpswcpsw_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            InputType={'text'}
                                            onChangeText={(text) => { onChangeConfirmPassword(text); setCPasswordError(null) }}
                                            textVlaue={confirm}
                                            isRequired={true}
                                            borderColor={cPasswordError ? 'red' : null}
                                            ErrorMessage={cPasswordError}
                                        />

                                    </View>
                                    <View style={{ marginTop: 40 }}>
                                        <CustomButton btnDisabled={loading} OnClickButton={onClickResetBtn} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary }} buttonText={isLabel?.resetpswcntbtn_label} />
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        <FailedModal
                            isModal={isError}
                            isSuccessMessage={isErrorMgs}
                            onClickClose={() => { setError(false); setErrorMgs() }}
                            handleCloseModal={() => { setError(false); setErrorMgs() }}
                        />
                        <SuccessModal
                            isModal={isSuccess}
                            isSuccessMessage={isSuccessMgs}
                            handleCloseModal={() => { setSuccess(false); setSuccessMgs(); navigation.navigate('Login'); }}
                            onClickClose={() => { setSuccess(false); setSuccessMgs(); navigation.navigate('Login'); }}
                        />
                        <NotificationAlert />
                    </>
                )
            }

        </>
    )
}

export default ResetPassword