import { View, ScrollView, Image, Platform, Linking, KeyboardAvoidingView, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TitleBarName from '../components/TitleBarName'
import commonStyles from '../constants/CommonStyles'
import ContactInformation from '../components/ContactInformation'
import BottomBar from '../components/BottomBar'
import ContactForm from '../components/ContactForm'
import { useCustomContext } from '../hooks/CustomeContext'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'
import CustomActivity from '../components/CustomActivity'
import FailedModal from '../components/FailedModal'
import SuccessModal from '../components/SuccessModal'
import NotificationAlert from '../components/NotificationAlert'

const Contact = ({ navigation }) => {
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLabel, setLabel] = useState();
    const [loading, setLoading] = useState(false);
    const [isName, setName] = useState();
    const [isEmail, setEmail] = useState();
    const [isEnquiry, setEnquiry] = useState();
    const [isErrorModal, setErrorModal] = useState(false);
    const [isError, setError] = useState();
    const [isSuccessModal, setSuccessModal] = useState(false);
    const [isSuccess, setSuccess] = useState();
    const [isNameError, setNameError] = useState(null);
    const [isEmailError, setEmailError] = useState(null);
    const [isEnquiryError, setEnquiryError] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);

    useEffect(() => {
        fetchContact();
    }, []);

    const fetchContact = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.contactus}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId
            }
            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                console.log(response.data);
                setLabel(response.data);
            }
        } catch (error) {
            console.log("error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const onSubmitEnquiry = async () => {
        try {
            setScreenLoading(true);
            const url = `${BASE_URL}${EndPoint?.contactus_add}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                name: isName,
                email: isEmail,
                enquiry: isEnquiry
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setSuccessModal(true);
                setSuccess(response.data?.success);
                setName();
                setEmail();
                setEnquiry();
            }
        } catch (error) {
            if (error?.response.data?.error) {
                if (error?.response.data?.error?.name) {
                    setNameError(error?.response.data?.error?.name);
                } else {
                    setNameError(null);
                }

                if (error?.response.data?.error?.email) {
                    setEmailError(error?.response.data?.error?.email);
                } else {
                    setEmailError(null);
                }

                if (error?.response.data?.error?.enquiry) {
                    setEnquiryError(error?.response.data?.error?.enquiry);
                } else {
                    setEnquiryError(null);
                }
            } else {
                setError(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setScreenLoading(false);
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
                            <TitleBarName onClickBackIcon={() => navigation.navigate('Home')} titleName={isLabel?.text?.contactuspagename} />
                            <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
                                <View style={{ paddingHorizontal: 12, marginBottom: 300 }}>
                                    <View style={{ marginTop: 32, alignItems: 'center', justifyContent: 'center', width: '70%', height: 200, alignSelf: 'center', }}>
                                        <Image source={require('../assets/images/logo/contact.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                    </View>
                                    <View style={{ marginTop: 32, gap: 24 }}>
                                        <ContactInformation text={isLabel?.text} textValue={isLabel} />

                                        <ContactForm text={isLabel?.text}
                                            setName={setName}
                                            setEmail={setEmail}
                                            setEnquiry={setEnquiry}
                                            onsubmit={onSubmitEnquiry}
                                            name={isName}
                                            email={isEmail}
                                            enquiry={isEnquiry}
                                            nameError={isNameError}
                                            emailError={isEmailError}
                                            enquiryError={isEnquiryError}
                                            setNameError={setNameError}
                                            setEmailError={setEmailError}
                                            setEnquiryError={setEnquiryError}
                                        />

                                    </View>
                                </View>
                                <FailedModal
                                    isModal={isErrorModal}
                                    isSuccessMessage={isError}
                                    onClickClose={() => { setErrorModal(false); setError() }}
                                    handleCloseModal={() => { setErrorModal(false); setError() }}
                                />
                                <SuccessModal
                                    isModal={isSuccessModal}
                                    isSuccessMessage={isSuccess}
                                    onClickClose={() => { setSuccessModal(false); setSuccess() }}
                                    handleCloseModal={() => { setSuccessModal(false); setSuccess() }}
                                />
                            </ScrollView>
                        </View >
                        <BottomBar />
                        <NotificationAlert />
                    </ >

                )
            }
        </>
    )
}

export default Contact