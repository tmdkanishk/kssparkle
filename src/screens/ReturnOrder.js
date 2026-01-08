import { View, Text, ScrollView, TouchableOpacity, TextInput, Platform, SafeAreaView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity'
import { useCustomContext } from '../hooks/CustomeContext';
import TitleBarName from '../components/TitleBarName';
import commonStyles from '../constants/CommonStyles';
import { returnOrder } from '../services/returnOrder';
import { IconComponentCheckSquare, IconComponentSquare, } from '../constants/IconComponents';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';
import axios, { HttpStatusCode } from 'axios';
import SuccessModal from '../components/SuccessModal';
import { CommonActions } from '@react-navigation/native';
import { checkAutoLogin } from '../utils/helpers';
import NotificationAlert from '../components/NotificationAlert';


const ReturnOrder = ({ navigation, route }) => {
    const { productId, orderId } = route.params;
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isAllData, setAllData] = useState(null);
    const [isLabel, setLabel] = useState(null);
    const [isResionsList, setResionsList] = useState(null);
    const [isProductDetail, setProductDetail] = useState(null);
    const [isOrderDetail, setOrderDetail] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isAgreeCheckBox, setAgreeCheckBox] = useState(false);
    const [isNameError, setNameError] = useState(null);
    const [isLastNameError, setLastNameError] = useState(null);
    const [isEmailError, setEmailError] = useState(null);
    const [isTelephoneError, setTelephoneError] = useState(null);
    const [isOrderIdError, setOrderIdError] = useState(null);
    const [isReasonError, setReasonError] = useState(null);
    const [isAgreePolicyError, setAgreePolicyError] = useState(null);
    const [isSuccessModal, setSuccessModal] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstname: null,
        lastname: null,
        email: null,
        telephone: null,
        order_id: null,
        product_id: null,
        return_reason_id: null,
        opened: null,
        comment: null,
        date_ordered: null,
        quantity: null,
    });

    useEffect(() => {
        checkAutoLogin();
        fetchRetrunOrderText();
    }, []);

    const fetchRetrunOrderText = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.order_returnorderinfo}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData("USER");
            const sessionId = await _retrieveData('SESSION_ID');

            if (user) {
                setFormData({
                    firstname: user[0]?.firstname,
                    lastname: user[0]?.lastname,
                    email: user[0]?.email,
                    telephone: user[0]?.phoneno,
                    order_id: orderId,
                    product_id: productId,
                    opened: 0,
                    quantity: '1'
                })
            }
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user ? user[0]?.customer_id : null,
                sessionid: sessionId,
                product_id: productId,
                order_id: orderId,
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data?.text);
                setResionsList(response.data?.return_reasons);
                setProductDetail(response.data?.product);
                setOrderDetail(response.data?.order);
                setAllData(response.data);
            }

        } catch (error) {
            console.log(error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const onClickReturnOrderButton = async () => {
        try {
            setScreenLoading(true);
            const newObj = { ...formData, model: isProductDetail?.model, product: isProductDetail?.name, agree: isAgreeCheckBox ? '1' : '0' };
            const result = await returnOrder(newObj, EndPoint?.order_returnorder);
            setSuccessMgs(result?.success);
            setSuccessModal(true);
        } catch (error) {
            if (error.response.data?.error) {
                if (error.response.data?.error?.firstname) {
                    setNameError(error.response.data?.error?.firstname);
                } else {
                    setNameError(null);
                }

                if (error.response.data?.error?.lastname) {
                    setLastNameError(error.response.data?.error?.lastname);
                } else {
                    setLastNameError(null);
                }

                if (error.response.data?.error?.lastname) {
                    setLastNameError(error.response.data?.error?.lastname);
                } else {
                    setLastNameError(null);
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

                if (error.response.data?.error?.order_id) {
                    setOrderIdError(error.response.data?.error?.order_id);
                } else {
                    setOrderIdError(null);
                }

                if (error.response.data?.error?.reason) {
                    setReasonError(error.response.data?.error?.reason);
                } else {
                    setReasonError(null);
                }

                if (error.response.data?.error?.agreepolicy) {
                    setAgreePolicyError(error.response.data?.error?.agreepolicy)
                } else {
                    setAgreePolicyError(null)
                }


            } else {
                alert(GlobalText?.extrafield_somethingwrong);
            }
        } finally {
            setScreenLoading(false);
        }
    }

    const handleInputChange = (fieldName, value) => {
        setFormData((prevState) => ({
            ...prevState,
            [fieldName]: value,
        }));
    };



    return (

        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>

                        <View style={commonStyles.bodyConatiner}>
                            <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.returnorderpagename_label} />
                            <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
                                <View style={{ paddingHorizontal: 12, marginBottom: 50 }}>

                                    <View style={{ gap: 10, marginVertical: 10 }}>
                                        <Text style={commonStyles.heading}>{isLabel?.returnorderprodreturn_heading}</Text>
                                        <Text>{isLabel?.returnordercompleteform_label}</Text>
                                        <Text style={commonStyles.heading}>{isLabel?.returnorderinfo_heading}</Text>
                                        <View style={{ gap: 10 }}>
                                            <InputBox
                                                onChangeText={(value) => { handleInputChange('firstname', value); setNameError(null) }}
                                                label={isLabel?.returnorderfname_label}
                                                placeholder={isLabel?.returnorderfname_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                textVlaue={formData?.firstname}
                                                isRequired={true}
                                                borderColor={isNameError ? 'red' : null}
                                                ErrorMessage={isNameError}
                                            />


                                            <InputBox
                                                onChangeText={(value) => { handleInputChange('lastname', value); setLastNameError(null) }}
                                                label={isLabel?.returnorderlname_label}
                                                placeholder={isLabel?.returnorderlname_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                textVlaue={formData?.lastname}
                                                isRequired={true}
                                                borderColor={isLastNameError ? 'red' : null}
                                                ErrorMessage={isLastNameError}
                                            />

                                            <InputBox
                                                onChangeText={(value) => { handleInputChange('email', value); setEmailError(null) }}
                                                label={isLabel?.returnorderemail_label}
                                                placeholder={isLabel?.returnorderemail_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                InputType={'email-address'}
                                                textVlaue={formData?.email}
                                                isRequired={true}
                                                borderColor={isEmailError ? 'red' : null}
                                                ErrorMessage={isEmailError}
                                            />

                                            <InputBox
                                                onChangeText={(value) => { handleInputChange('telephone', value); setTelephoneError(null) }}
                                                label={isLabel?.returnorderphone_label}
                                                placeholder={isLabel?.returnorderphone_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                textVlaue={formData?.telephone}
                                                isRequired={true}
                                                borderColor={isTelephoneError ? 'red' : null}
                                                ErrorMessage={isTelephoneError}
                                            />

                                            <InputBox
                                                label={isLabel?.returnorderorderid_label}
                                                placeholder={isLabel?.returnorderorderid_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                textVlaue={formData?.order_id}
                                                isRequired={true}
                                                editable={false}
                                                ErrorMessage={isOrderIdError}
                                            />

                                            <InputBox
                                                label={isLabel?.returnorderorderdate_label}
                                                placeholder={isLabel?.returnorderorderdate_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                                textVlaue={isOrderDetail?.date_ordered}
                                                isRequired={true}
                                            />

                                        </View>
                                    </View>
                                    <View style={{ gap: 10 }}>
                                        <Text style={commonStyles.heading}>{isLabel?.returnorderprodinfo_heading}</Text>
                                        <InputBox
                                            onChangeText={(value) => handleInputChange('name', value)}
                                            label={isLabel?.returnorderprodname_label}
                                            placeholder={isLabel?.returnorderprodname_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            textVlaue={isProductDetail?.name}
                                            isRequired={true}
                                        />
                                        <InputBox
                                            onChangeText={(value) => handleInputChange('model', value)}
                                            label={isLabel?.returnorderprodcode_label}
                                            placeholder={isLabel?.returnorderprodcode_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            textVlaue={isProductDetail?.model}
                                            isRequired={true}
                                        />
                                        <InputBox
                                            onChangeText={(value) => handleInputChange('quantity', value)}
                                            label={isLabel?.returnorderquantity_label}
                                            placeholder={isLabel?.returnorderquantity_label}
                                            inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            textVlaue={formData?.quantity}
                                        />
                                        <Text style={commonStyles.heading}>{isLabel?.returnorderreason_label}</Text>
                                        {
                                            isResionsList?.length > 0 ? (
                                                isResionsList?.map((item, index) => (
                                                    <View key={index} style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                                        <TouchableOpacity onPress={() => { handleInputChange('return_reason_id', item?.return_reason_id); setReasonError(null) }} style={{ height: 20, width: 20, borderRadius: 10, borderWidth: 1, borderColor: isReasonError ? 'red' : 'black', backgroundColor: formData?.return_reason_id == item?.return_reason_id ? Colors?.primary : null }} />
                                                        <View>
                                                            <Text>{item?.name}</Text>
                                                        </View>
                                                    </View>
                                                ))

                                            ) : null
                                        }

                                        {
                                            isReasonError ? <Text style={{ color: 'red' }}>{isReasonError}</Text> : null
                                        }

                                        <View>
                                            <Text style={commonStyles.heading}>{isLabel?.returnorderprodopen_label}</Text>
                                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                                    <TouchableOpacity onPress={() => handleInputChange('opened', 1)} style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 10, backgroundColor: formData?.opened === 1 ? Colors?.primary : null }} />
                                                    <Text>{isLabel?.returnorderyes_label}</Text>
                                                </View>
                                                <View style={{ flexDirection: 'row', gap: 10 }}>
                                                    <TouchableOpacity onPress={() => handleInputChange('opened', 0)} style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 10, backgroundColor: formData?.opened === 0 ? Colors?.primary : null }} />
                                                    <Text>{isLabel?.returnorderno_label}</Text>
                                                </View>
                                            </View>
                                        </View>
                                        <InputBox
                                            inputStyle={{ w: '100%', h: 100, ph: 12 }}
                                            label={isLabel?.returnorderotherdetail_label}
                                            placeholder={isLabel?.returnorderotherdetail_label}
                                            inputTextAlignVertical={'top'}
                                            inputPaddingTop={12}
                                            textVlaue={formData?.comment}
                                            onChangeText={(value) => handleInputChange('comment', value)}
                                        />

                                        <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                                            <TouchableOpacity onPress={() => { setAgreeCheckBox(!isAgreeCheckBox); setAgreePolicyError(null) }}>
                                                {
                                                    isAgreeCheckBox ? <IconComponentCheckSquare /> : <IconComponentSquare />
                                                }
                                            </TouchableOpacity>
                                            <Text>{isAllData?.text_agree}</Text>
                                        </View>
                                        {
                                            isAgreePolicyError ? <Text style={{ color: 'red' }}>{isAgreePolicyError}</Text> : null
                                        }
                                        <CustomButton
                                            btnDisabled={screenLoading}
                                            buttonStyle={{
                                                w: '100%', h: 50,
                                                backgroundColor: Colors.primary
                                            }}
                                            buttonText={isLabel?.returnordersubmitbtn_label}
                                            OnClickButton={() => onClickReturnOrderButton()}
                                        />
                                    </View>
                                </View>
                            </ScrollView>

                            <SuccessModal
                                isModal={isSuccessModal}
                                isSuccessMessage={isSuccessMgs}
                                onClickClose={() => {
                                    setSuccessModal(false); setSuccessMgs(null); navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        })
                                    );
                                }}
                                handleCloseModal={() => {
                                    setSuccessModal(false); setSuccessMgs(null); navigation.dispatch(
                                        CommonActions.reset({
                                            index: 0,
                                            routes: [{ name: 'Home' }],
                                        })
                                    );
                                }}
                            />

                        </View>
                        <NotificationAlert />
                    </>
                )
            }
        </>
    )
}
export default ReturnOrder