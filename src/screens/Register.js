import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Platform, Modal, Pressable, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyles from '../constants/CommonStyles'
import InputBox from '../components/InputBox'
import CustomDropdown from '../components/CustomDropdown'
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import CustomButton from '../components/CustomButton'
import { useCustomContext } from '../hooks/CustomeContext'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData, _storeData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'
import CustomActivity from '../components/CustomActivity'
import AlertModal from '../components/AlertModal'
import FailedModal from '../components/FailedModal'
import TitleBarName from '../components/TitleBarName'
import SuccessModal from '../components/SuccessModal'
import { login } from '../services/login'
import { IconComponentCheckSquare, IconComponentClose, IconComponentImage, IconComponentSquare } from '../constants/IconComponents'
import NotificationAlert from '../components/NotificationAlert'
import { getCustomFields } from '../services/getCustomFields'
import CustomInput from '../customFields/CustomInput'
import CustomTextArea from '../customFields/CustomTextArea'
import CustomCheckbox from '../customFields/CustomCheckbox'
import CustomSelect from '../customFields/CustomSelect'
import CustomDateTime from '../customFields/CustomDateTime'
import CustomUpload from '../customFields/CustomUpload'
import CustomRadio from '../customFields/CustomRadio'
import BottomBar from '../components/BottomBar'
import { getCartItem } from '../services/getCartItem'
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper'
import GlassmorphismInput from '../components/customcomponents/GlassmorphismInput'
import GlassmorphismButton from '../components/customcomponents/GlassmorphismButton'

const Register = ({ navigation, route }) => {
    const { Colors, Features, EndPoint, GlobalText } = useCustomContext();
    const { telephone = '' } = route.params || {};
    const [isShow, setShow] = useState(true);
    const [isCShow, setCShow] = useState(true);
    const [isCheck, setCheck] = useState(true);
    const [isGroups, setGroups] = useState();
    const [isText, setText] = useState();
    const [informationId, setInformationId] = useState();
    const [isSubscription, setSubscription] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isError, setError] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [isSuccess, setSuccess] = useState(false);
    const [fisrtnameError, setFisrtnameError] = useState(null);
    const [lastnameError, setLastnameError] = useState(null);
    const [emailError, setEmailError] = useState(null);
    const [telephoneError, setTelephoneError] = useState(null);
    const [passwordError, setPasswordError] = useState(null);
    const [confrimPasswordError, setConfrimPasswordError] = useState(null);
    const [exitEmailError, setExitEmailError] = useState(null);
    const [loginAlertErrorMgs, setLoginAlertErrorMgs] = useState(null);
    const [loginAlertErrorModal, setLoginAlertErrorModal] = useState(false);
    const [isGroupModal, setGroupModal] = useState(false);
    const [isGroupName, setGroupName] = useState(null);

    // custome field data
    const [customFieldList, setCustomFieldList] = useState([]);
    const [customFormData, setcustomFormData] = useState({});
    const [customFieldErrors, setCustomFieldErrors] = useState({});
    const [screenLoading, setScreenLoading] = useState(false);



    // 🔹 Generic update handler
    const handleChange = (fieldId, value) => {
        setcustomFormData(prev => ({
            ...prev,
            [fieldId]: value
        }));


        // clear only that field's error
        setCustomFieldErrors(prev => {
            if (!prev[fieldId]) return prev; // no error → do nothing
            const updated = { ...prev };
            delete updated[fieldId];
            return updated;
        });
    };

    // 🔹 Checkbox toggle handler
    const handleCheckboxChange = (fieldId, optionId) => {
        setcustomFormData(prev => {
            const existing = prev[fieldId] || [];
            if (existing.includes(optionId)) {
                return { ...prev, [fieldId]: existing.filter(id => id !== optionId) };
            } else {
                return { ...prev, [fieldId]: [...existing, optionId] };
            }
        });

        // clear only that field's error
        setCustomFieldErrors(prev => {
            if (!prev[fieldId]) return prev; // no error → do nothing
            const updated = { ...prev };
            delete updated[fieldId];
            return updated;
        });
    };

    // custome field data

    const [formData, setFormData] = useState({
        // groupId: '',
        firstname: '',
        lastname: '',
        email: '',
        telephone: telephone,
        password: '',
        confirm: '',
    });

    const [loading, setLoading] = useState(false);
    const [dob, setDob] = useState(null);
    const [time, setTime] = useState(null);

    const openEyesIcon = <Entypo name="eye" size={24} color={Colors.iconColor} />;
    const closeEyesIcon = <Entypo name="eye-with-line" size={24} color={Colors.iconColor} />;

    useEffect(() => {
        const getRegisterPageText = async () => {
            try {
                setScreenLoading(true);
                const url = `${BASE_URL}${EndPoint?.register_registerdetail}`;
                // const lang = await _retrieveData('SELECT_LANG');
                // const cur = await _retrieveData('SELECT_CURRENCY');
                console.log(url)
                const sessionId = await _retrieveData('SESSION_ID');

                // console.log('lang', lang);
                const headers = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Key: API_KEY,
                };
                const body = {
                    // code: lang?.code,
                    // currency: cur?.code,
                    sessionId: sessionId
                }
                console.log(body)
                const response = await axios.post(url, body, { headers: headers });

                if (response.status === HttpStatusCode.Ok) {
                    console.log("response.data?.text", response.data?.text);
                    setText(response.data?.text);
                    // console.log("response.data?.customer_groups", response.data?.customer_groups);
                    // setGroups(response.data?.customer_groups);
                    // setInformationId(response.data?.information_id);
                }

            } catch (error) {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setError(true);
            } finally {
                setScreenLoading(false);
            }

        }
        getRegisterPageText();
        fetchCustomFeilds();
    }, [])

    const onClickEyesIcon = () => {
        setShow(!isShow);
    }
    const onClickCEyesIcon = () => {
        setCShow(!isCShow);
    }

    const onClickCheckBox = () => {
        setCheck(!isCheck);
    }

    const handleInputChange = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };

    const onRegister = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.register}`;
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            // formData["custom_field"] = customFormData;


            const body = formData;

            console.log("body", body, url);
            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                console.log("register account ", response?.data);
                setSuccessMgs(response.data?.success);
                setSuccess(true);
                navigation.replace("Home");
                if (response.data.customer_id) {
                    await _storeData("CUSTOMER_ID", response.data.customer_id)
                }
            }
        }
        catch (error) {
            console.log("error", error.response.data?.error);
            if (error.response.data?.error) {
                if (error.response.data?.error?.firstname) {
                    setFisrtnameError(error.response.data?.error?.firstname);
                } else {
                    setFisrtnameError(null);
                }

                if (error.response.data?.error?.lastname) {
                    setLastnameError(error.response.data?.error?.lastname);
                } else {
                    setLastnameError(null);
                }

                if (error.response.data?.error?.email) {
                    setEmailError(error.response.data?.error?.email);
                } else {
                    setEmailError(null);
                }

                if (error.response.data?.error?.telephone) {
                    setTelephoneError(error.response.data?.error?.telephone);
                } else {
                    setTelephoneError(null);
                }

                if (error.response.data?.error?.password) {
                    setPasswordError(error.response.data?.error?.password);
                } else {
                    setPasswordError(null);
                }

                if (error.response.data?.error?.confirm) {
                    setConfrimPasswordError(error.response.data?.error?.confirm);
                } else {
                    setConfrimPasswordError(null);
                }

                if (error.response.data?.error?.emailexist) {
                    setExitEmailError(error.response.data?.error?.emailexist);
                } else {
                    setExitEmailError(null);
                }

                if (error.response.data?.error?.custom_field) {
                    setCustomFieldErrors(error.response.data?.error?.custom_field);
                } else {
                    setCustomFieldErrors(null);
                }


            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setError(true);
            }
        }
        finally {
            setLoading(false);
        }
    }

    const onClickOkButton = async () => {
        try {
            setLoading(true);
            const result = await login(formData.email, formData.password, EndPoint?.login);
            if (result?.error?.nomatch) {
                setErrorMgs(result?.error?.nomatch);
                setError(true);
                return;
            }
            console.log("result", result);
            await _storeData("USER", result?.response);
            const cartresponse = await getCartItem(EndPoint?.cart_total);
            await _storeData("CART_PRODUCT_COUNT", cartresponse?.cartproductcount);
            await _storeData("CART_PRODUCT_AMOUNT", cartresponse?.cartproducttotal);
            navigation.navigate('Home');
        } catch (error) {
            if (error.response.data?.error?.approved) {
                setLoginAlertErrorMgs(error.response.data?.error?.approved);
                setLoginAlertErrorModal(true);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setError(true);
            }

        } finally {
            setLoading(false);
            setSuccess(false);
        }
    }

    const onClickSubScrible = () => {
        if (isSubscription) {
            handleInputChange('subscribe', 'No');
            setSubscription(false)
        } else {
            handleInputChange('subscribe', 'Yes');
            setSubscription(true)
        }
    }

    const fetchCustomFeilds = async () => {
        try {
            const response = await getCustomFields(EndPoint?.address_customFields);
            setCustomFieldList(response?.custom_fields)
        } catch (error) {
            console.log("error", error.response.data);
        }
    }



    return (

        <>
            <BackgroundWrapper>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={{ justifyContent: "center", alignItems: 'center', flex: 1 }}>


                        <View style={{ width: "90%" }}>
                            
                            <TouchableOpacity style={{ marginBottom: 10 }} onPress={() => navigation.goBack()}>
                                <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                            </TouchableOpacity>

                            <View style={{ marginTop: 10, marginBottom: 30, alignItems: 'flex-start', gap: 10 }}>
                                <Text style={{ fontSize: 24, fontWeight: '400', color: 'white', textAlign: "left" }}>{isText?.regpage_heading}</Text>
                                <Text style={{ fontSize: 14, fontWeight: '500', color: Colors.white, textAlign: 'left' }}>{isText?.regyourself_label}</Text>
                            </View>
                            <View style={{ gap: 30 }}>
                                <View style={{ flexDirection: "row" }}>
                                    <View style={{ width: "48%" }}>
                                        <GlassmorphismInput
                                            placeholder={isText?.regpage_firstname_label}
                                            value={formData.firstname}
                                            onChangeText={(text) => handleInputChange("firstname", text)}
                                        />
                                        {fisrtnameError ? (
                                            <Text style={styles.errorText}>{fisrtnameError}</Text>
                                        ) : null}
                                    </View>

                                    <View style={{ width: "48%", marginLeft: 15 }}>
                                        <GlassmorphismInput
                                            placeholder={isText?.regpage_lastname_label}
                                            value={formData.lastname}
                                            onChangeText={(text) => handleInputChange("lastname", text)}
                                        />
                                        {lastnameError ? (
                                            <Text style={styles.errorText}>{lastnameError}</Text>
                                        ) : null}
                                    </View>

                                </View>



                                <GlassmorphismInput
                                    placeholder={isText?.regpage_telephone_label}
                                    value={formData.telephone}
                                    onChangeText={(text) => handleInputChange("telephone", text)}
                                    keyboardType="phone-pad"
                                />
                                {telephoneError ? (
                                    <Text style={styles.errorText}>{telephoneError}</Text>
                                ) : null}



                                <View>
                                    <GlassmorphismInput
                                        placeholder={isText?.regpage_email_label}
                                        value={formData.email}
                                        onChangeText={(text) => handleInputChange("email", text)}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {emailError ? (
                                        <Text style={styles.errorText}>{emailError}</Text>
                                    ) : null}

                                    {exitEmailError ? (
                                        <Text style={styles.errorText}>{exitEmailError}</Text>
                                    ) : null}

                                </View>

                                <View>

                                    <GlassmorphismInput
                                        placeholder={isText?.regpage_pasword_label}
                                        secureTextEntry
                                        value={formData.password}
                                        onChangeText={(text) => { handleInputChange("password", text); handleInputChange("confirm", text) }}
                                    />
                                    {passwordError ? (
                                        <Text style={styles.errorText}>{passwordError}</Text>
                                    ) : null}
                                </View>

                            </View>



                            <View style={{ marginTop: 24 }}>
                                <GlassmorphismButton
                                    title="Sign Up"
                                    onPress={() => onRegister()}
                                />
                            </View>


                        </View>

                        {/* <Text onPress={() => { navigation.navigate("Login") }} style={{ fontSize: 14, color: 'white', textAlign: 'left', marginTop: 40 }}>
                            <Text style={{ fontWeight: '300' }}>{isText?.alreadyaccount_label} </Text>
                            <Text style={{ fontWeight: '400', textDecorationLine: 'underline' }} onPress={() => { navigation.navigate("Login") }} > Login</Text>
                        </Text> */}
                    </View>
                </KeyboardAvoidingView>
            </BackgroundWrapper>

            {/* failed case */}
            {/* <FailedModal
                isSuccessMessage={isErrorMgs}
                handleCloseModal={() => { setError(false); setErrorMgs() }}
                isModal={isError}
                onClickClose={() => { setError(false); setErrorMgs() }}
            /> */}

            <SuccessModal
                isSuccessMessage={isSuccessMgs}
                isModal={isSuccess}
                onClickClose={() => onClickOkButton()}
                handleCloseModal={() => onClickOkButton()}
            />

            {/* warning */}
            <AlertModal
                isModal={loginAlertErrorModal}
                handleCloseModal={() => { setLoginAlertErrorModal(false); setLoginAlertErrorMgs(null); navigation.navigate('Home'); }}
                isSuccessMessage={loginAlertErrorMgs}
                onClickClose={() => { setLoginAlertErrorModal(false); setLoginAlertErrorMgs(null); navigation.navigate('Home'); }}
            />
            <NotificationAlert />
        </>


    )
}


const styles = StyleSheet.create({
    halfInputField: {
        height: 50,
        borderWidth: 1,
        paddingHorizontal: 20
    },
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        gap: 20, // spacing between the two inputs
    },
    halfInput: {
        flex: 1, // take 50% of the row each
    },
    errorText: {
        color: "red",
        fontSize: 12,
        marginTop: 6,
        marginLeft: 6,
    },
})

export default Register