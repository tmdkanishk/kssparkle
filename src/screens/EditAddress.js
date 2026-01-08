import { View, Text, SafeAreaView, ScrollView, Platform, TouchableOpacity, StyleSheet, Modal, FlatList, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity'
import TitleBarName from '../components/TitleBarName'
import { useCustomContext } from '../hooks/CustomeContext'
import commonStyles from '../constants/CommonStyles'
import InputBox from '../components/InputBox'
import { _retrieveData } from '../utils/storage'
import { API_KEY, BASE_URL } from '../utils/config'
import { IconComponentClose } from '../constants/IconComponents'
import axios, { HttpStatusCode } from 'axios'
import SuccessModal from '../components/SuccessModal'
import NotificationAlert from '../components/NotificationAlert'
import CustomInput from '../customFields/CustomInput'
import CustomTextArea from '../customFields/CustomTextArea'
import CustomCheckbox from '../customFields/CustomCheckbox'
import CustomRadio from '../customFields/CustomRadio'
import CustomSelect from '../customFields/CustomSelect'
import CustomDateTime from '../customFields/CustomDateTime'
import { getCustomFields } from '../services/getCustomFields'

const EditAddress = ({ navigation, route }) => {
    const { item } = route.params;
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState(null);
    const [countryList, setCountryList] = useState([]);
    const [isDefaultCountry, setDefaultCountry] = useState(null);
    const [isCountryModal, setCountryModal] = useState(false);
    const [isDefaultState, setDefaultState] = useState(null);
    const [isStateList, setStateList] = useState([]);
    const [isStateModal, setStateModal] = useState(false);

    const [isName, setName] = useState(item?.firstname);
    const [isLastname, setLastname] = useState(item?.lastname);
    const [isCompany, setCompnay] = useState(item?.company);
    const [isAddress1, setAddress1] = useState(item?.address_1);
    const [isAddress2, setAddress2] = useState(item?.address_2);
    const [isCity, setCity] = useState(item?.city);
    const [isPostalCode, setPostalCode] = useState(item?.postcode);
    const [isDefault, setDefault] = useState(false);

    const [isNameError, setNameError] = useState();
    const [isLastnameError, setLastnameError] = useState();
    const [isAddress1Error, setAddress1Error] = useState();
    const [isCityError, setCityError] = useState();
    const [isZoneError, setZoneError] = useState();
    const [isCountryError, setCountryError] = useState();
    const [isCompanyError, setCompanyError] = useState();

    const [isSuccessModal, setSuccessModal] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState(null);


    // custome field data
    const [customFieldList, setCustomFieldList] = useState([]);
    const [customFormData, setcustomFormData] = useState({});
    const [customFieldErrors, setCustomFieldErrors] = useState({});



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


    const fetchCustomFeilds = async () => {
        try {
            const response = await getCustomFields(EndPoint?.address_customFields);
            setCustomFieldList(response?.custom_fields)
        } catch (error) {
            console.log("error", error.response.data);
        }
    }


    useEffect(() => {
        fetchMyAddressText();
        if (item?.custom_field) {
            console.log('item?.custom_field', item);
            setcustomFormData(item.custom_field);
            fetchCustomFeilds();
        }
        fetchCountry();
        fetchState(item?.country_id);


    }, []);


    const fetchCountry = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.address_countrylist}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setCountryList(response.data?.countries);
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const fetchState = async (countryId) => {
        try {
            console.log("countryId", countryId)
            const url = `${BASE_URL}${EndPoint?.address_zonelist}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                country_id: countryId
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                if (response.data?.zones.length > 0) {
                    console.log("response.data?.zones", response.data?.zones[0]);
                    setDefaultState(response.data?.zones[0])
                } else {
                    setDefaultState(null);
                }
                setStateList(response.data?.zones);
            }

        } catch (error) {
            console.log('error:', error.response.data);
        }
    }

    const fetchMyAddressText = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.address}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData("USER");

            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user[0]?.customer_id,
            }

            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data?.text);
                console.log("response.data?.text", response.data?.text);

            }
        } catch (error) {
            console.log('error :', error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const onSelectCountry = (value) => {
        try {
            console.log("value", value);
            setDefaultCountry(value);
            setCountryModal(false);
            fetchState(value?.country_id);
            setZoneError(null);
            setCountryError(null);
        } catch (error) {

        }
    }

    const onUpdateAdress = async () => {
        try {
            const url = `${BASE_URL}${EndPoint?.address_validateAddress}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData("USER");
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user[0]?.customer_id,
                address_id: item?.address_id,
                firstname: isName,
                lastname: isLastname,
                company: isCompany,
                address_1: isAddress1,
                address_2: isAddress2,
                city: isCity,
                postcode: isPostalCode,
                country_id: isDefaultCountry?.country_id || item?.country_id,
                zone_id: isDefaultState?.zone_id || item?.zone_id,
                'custom_field[address]': customFormData,
                default: isDefault ? "Yes" : "No"
            }

            console.log("body update adrress", body);

            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                console.log("response.data", response.data?.adressedit);
                setSuccessMgs(response.data?.success?.adressedit);
                setSuccessModal(true)
            }

        } catch (error) {
            console.log('error :', error.response.data);
            if (error.response.data?.error) {
                if (error.response.data?.error?.firstname) {
                    setNameError(error.response.data?.error?.firstname);
                }
                if (error.response.data?.error?.lastname) {
                    setLastnameError(error.response.data?.error?.lastname);
                }
                if (error.response.data?.error?.address_1) {
                    setAddress1Error(error.response.data?.error?.address_1);
                }
                if (error.response.data?.error?.city) {
                    setCityError(error.response.data?.error?.city);
                }
                if (error.response.data?.error?.zone) {
                    setZoneError(error.response.data?.error?.zone);
                }
                if (error.response.data?.error?.country) {
                    setCountryError(error.response.data?.error?.country);
                }
                if (error.response.data?.error?.company) {
                    setCompanyError(error.response.data?.error?.company);
                }

            } else {
                Alert.alert(
                    "",
                    GlobalText?.extrafield_somethingwrong, // Message
                    [
                        {
                            text: GlobalText?.extrafield_okbtn,
                            onPress: () => console.log("OK Pressed")
                        }
                    ],
                    { cancelable: true } // optional
                );
            }

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
                            <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.addrsedit_heading} />
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ gap: 20, width: '100%', paddingHorizontal: 12, marginVertical: 12 }}>


                                    <InputBox
                                        label={isLabel?.addrfname_label}
                                        placeholder={isLabel?.addrfname_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'text'}
                                        onChangeText={(text) => { setName(text); setNameError(null) }}
                                        textVlaue={isName}
                                        isRequired={true}
                                        borderColor={isNameError ? 'red' : null}
                                        ErrorMessage={isNameError}
                                    />

                                    <InputBox
                                        label={isLabel?.addrlname_label}
                                        placeholder={isLabel?.addrlname_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'text'}
                                        onChangeText={(text) => { setLastname(text); setLastnameError(null) }}
                                        textVlaue={isLastname}
                                        isRequired={true}
                                        borderColor={isLastnameError ? 'red' : null}
                                        ErrorMessage={isLastnameError}
                                    />

                                    <InputBox
                                        label={isLabel?.addrcmpny_label}
                                        placeholder={isLabel?.addrcmpny_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'text'}
                                        onChangeText={(text) => { setCompnay(text); setCompanyError(null) }}
                                        textVlaue={isCompany}
                                        isRequired={true}
                                        borderColor={isCompanyError ? 'red' : null}
                                        ErrorMessage={isCompanyError}
                                    />

                                    <InputBox
                                        label={isLabel?.addraddrs1_label}
                                        placeholder={isLabel?.addraddrs1_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'text'}
                                        onChangeText={(text) => { setAddress1(text); setAddress1Error(null) }}
                                        textVlaue={isAddress1}
                                        isRequired={true}
                                        borderColor={isAddress1Error ? 'red' : null}
                                        ErrorMessage={isAddress1Error}
                                    />

                                    <InputBox
                                        label={isLabel?.addraddrs2_label}
                                        placeholder={isLabel?.addraddrs2_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'text'}
                                        onChangeText={(text) => setAddress2(text)}
                                        textVlaue={isAddress2}
                                    />

                                    <InputBox
                                        label={isLabel?.addrcity_label}
                                        placeholder={isLabel?.addrcity_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'text'}
                                        onChangeText={(text) => { setCity(text); setCityError(null) }}
                                        textVlaue={isCity}
                                        isRequired={true}
                                        borderColor={isCityError ? 'red' : null}
                                        ErrorMessage={isCityError}
                                    />

                                    <InputBox
                                        label={isLabel?.addrpostcode_label}
                                        placeholder={isLabel?.addrpostcode_label}
                                        inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                        InputType={'numeric'}
                                        onChangeText={(text) => setPostalCode(text)}
                                        textVlaue={isPostalCode}
                                    />


                                    <View style={styles.container}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={[styles.label, { color: 'red', }]}>*</Text>
                                            <Text style={[styles.label, { color: Colors.iconColor, }]}>{isLabel?.addrcntry_label}</Text>
                                        </View>

                                        <TouchableOpacity onPress={() => setCountryModal(true)} style={{
                                            borderWidth: 1,
                                            borderColor: isCountryError ? 'red' : Colors?.iconColor,
                                            height: 56,
                                            overflow: 'hidden',
                                            width: '100%',
                                            backgroundColor: Colors?.inputFeildColor,
                                            justifyContent: 'center',
                                            paddingLeft: 20

                                        }}>
                                            <Text >{isDefaultCountry?.name || item?.country}</Text>

                                        </TouchableOpacity>

                                        {isCountryError && (
                                            <Text style={{ color: 'red' }}>{isCountryError}</Text>
                                        )}

                                    </View>


                                    <View style={styles.container}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Text style={{ color: 'red' }}>*</Text>
                                            <Text style={[styles.label, { color: Colors.iconColor, }]}>{isLabel?.addrstate_label}</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => setStateModal(true)} style={{
                                            borderWidth: 1,
                                            borderColor: isZoneError ? 'red' : Colors?.iconColor,
                                            height: 56,
                                            overflow: 'hidden',
                                            width: '100%',
                                            backgroundColor: Colors?.inputFeildColor,
                                            justifyContent: 'center',
                                            paddingLeft: 20

                                        }}>
                                            {
                                                isDefaultCountry?.name ? (
                                                    isDefaultState?.name ?
                                                        <Text >{isDefaultState?.name}</Text>
                                                        :
                                                        <Text >{'N/A'}</Text>

                                                ) : <Text >{item?.zone}</Text>

                                            }
                                        </TouchableOpacity>

                                        {
                                            isZoneError && (
                                                <Text style={{ color: 'red' }}>{isZoneError}</Text>
                                            )

                                        }
                                    </View>

                                    {
                                        customFieldList?.length > 0 && (
                                            <View style={{ gap: 20, marginTop: 24 }}>
                                                {
                                                    customFieldList?.map((value, index) => {
                                                        if (value?.type === 'text' && value?.location == 'address') {
                                                            return (
                                                                <CustomInput
                                                                    key={index}
                                                                    label={value?.name}
                                                                    placeholder={value?.name}
                                                                    required={value?.required}
                                                                    onChangeText={(text) => handleChange(value?.custom_field_id, text)}
                                                                    value={customFormData[value?.custom_field_id] || ''}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                    inputStyle={{ height: 50 }}
                                                                />
                                                            )
                                                        }
                                                        if (value?.type === 'textarea' && value?.location == 'address') {
                                                            return (
                                                                <CustomTextArea
                                                                    key={index}
                                                                    label={value?.name}
                                                                    placeholder={value?.name}
                                                                    required={value?.required}
                                                                    onChangeText={(text) => handleChange(value?.custom_field_id, text)}
                                                                    value={customFormData[value?.custom_field_id] || ''}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                />
                                                            )
                                                        }

                                                        if (value?.type === 'checkbox' && value?.location == 'address') {
                                                            return (
                                                                <CustomCheckbox
                                                                    key={index}
                                                                    data={value?.custom_field_value}
                                                                    label={value?.name}
                                                                    required={value?.required}
                                                                    onPress={(id) => handleCheckboxChange(value?.custom_field_id, id)}
                                                                    selected={customFormData[value?.custom_field_id] || []}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                />
                                                            )
                                                        }

                                                        if (value?.type === 'radio' && value?.location == 'address') {
                                                            return (
                                                                <CustomRadio
                                                                    key={index}
                                                                    data={value?.custom_field_value}
                                                                    label={value?.name}
                                                                    required={value?.required}
                                                                    onPress={(id) => handleChange(value?.custom_field_id, id)}
                                                                    selected={customFormData[value?.custom_field_id]}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                />
                                                            )
                                                        }

                                                        if (value?.type === 'select' && value?.location == 'address') {
                                                            return (
                                                                <CustomSelect
                                                                    key={index}
                                                                    label={value?.name}
                                                                    options={value?.custom_field_value}
                                                                    required={value?.required}
                                                                    onValueChange={(text) => handleChange(value?.custom_field_id, text)}
                                                                    selectedValue={customFormData[value?.custom_field_id]}

                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                    selectStyle={{ height: 50 }}
                                                                />
                                                            )
                                                        }

                                                        if (value?.type === 'date' && value?.location == 'address') {
                                                            return (
                                                                <CustomDateTime
                                                                    key={index}
                                                                    label={value?.name}
                                                                    value={customFormData[value?.custom_field_id]}
                                                                    onChange={(text) => handleChange(value?.custom_field_id, text)}
                                                                    mode="date"
                                                                    required={value?.required}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                    fieldStyle={{ height: 50 }}
                                                                />
                                                            )
                                                        }

                                                        if (value?.type === 'time' && value?.location == 'address') {
                                                            return (
                                                                <CustomDateTime
                                                                    key={index}
                                                                    label={value?.name}
                                                                    value={customFormData[value?.custom_field_id]}
                                                                    onChange={(text) => handleChange(value?.custom_field_id, text)}
                                                                    mode="time"
                                                                    required={value?.required}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                    fieldStyle={{ height: 50 }}
                                                                />
                                                            )
                                                        }

                                                        if (value?.type === 'datetime' && value?.location == 'address') {
                                                            return (
                                                                <CustomDateTime
                                                                    key={index}
                                                                    label={value?.name}
                                                                    value={customFormData[value?.custom_field_id]}
                                                                    onChange={(text) => handleChange(value?.custom_field_id, text)}
                                                                    mode="datetime"
                                                                    required={value?.required}
                                                                    showError={customFieldErrors[value?.custom_field_id]}
                                                                    fieldStyle={{ height: 50 }}
                                                                />
                                                            )
                                                        }
                                                    })
                                                }

                                            </View>

                                        )
                                    }

                                    <View style={{ gap: 10 }}>
                                        <Text style={commonStyles.text_lg}>{isLabel?.addrdefaultaddrbtn_label}</Text>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <TouchableOpacity onPress={() => setDefault(true)} style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, backgroundColor: isDefault ? Colors?.primary : null }} />
                                            <Text>{GlobalText?.extrafield_yes_label}</Text>
                                            <TouchableOpacity onPress={() => setDefault(false)} style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 1, backgroundColor: !isDefault ? Colors?.primary : null }} />
                                            <Text>{GlobalText?.extrafield_no_label}</Text>
                                        </View>
                                    </View>

                                    <TouchableOpacity onPress={onUpdateAdress} style={{ width: '100%', height: 50, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
                                        <Text style={commonStyles.textWhite_lg}>{isLabel?.addreditbtn_label}</Text>
                                    </TouchableOpacity>

                                </View>

                            </ScrollView>
                        </View>


                        {/* contry list modal */}

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isCountryModal}
                            onRequestClose={() => setCountryModal(false)}
                        >
                            <View style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '90%', height: '80%', backgroundColor: 'white', padding: 12, borderRadius: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
                                        <View />
                                        <TouchableOpacity onPress={() => setCountryModal(false)}>
                                            <IconComponentClose />
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={countryList}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => onSelectCountry(item)}>
                                                <Text style={{ borderBottomWidth: 1, paddingBottom: 20 }}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </View>

                            </View>
                        </Modal >


                        {/* State list modal */}

                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={isStateModal}
                            onRequestClose={() => setStateModal(false)}
                        >
                            <View style={{ flex: 1, width: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
                                <View style={{ width: '90%', height: '80%', backgroundColor: 'white', padding: 12, borderRadius: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 12 }}>
                                        <View />
                                        <TouchableOpacity onPress={() => setStateModal(false)}>
                                            <IconComponentClose />
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        data={isStateList}
                                        showsVerticalScrollIndicator={false}
                                        keyExtractor={(item, index) => index.toString()}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity onPress={() => { setDefaultState(item); setStateModal(false) }}>
                                                <Text style={{ borderBottomWidth: 1, paddingBottom: 20 }}>
                                                    {item.name}
                                                </Text>
                                            </TouchableOpacity>
                                        )}
                                        ListEmptyComponent={<Text style={{ textAlign: 'center' }}>nema podataka</Text>}
                                    />
                                </View>

                            </View>
                        </Modal >

                        {/* success modal */}

                        <SuccessModal
                            isModal={isSuccessModal}
                            handleCloseModal={() => {
                                setSuccessModal(false);
                                navigation.goBack();
                            }}
                            isSuccessMessage={isSuccessMgs}
                            onClickClose={
                                () => {
                                    setSuccessModal(false);
                                    navigation.goBack();
                                }
                            }


                        />

                        <NotificationAlert />
                    </ >
                )
            }

        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    label: {
        fontSize: 14,
        marginBottom: 10,
    },

});

export default EditAddress