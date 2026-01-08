import { View, Text, SafeAreaView, ScrollView, Platform, TouchableOpacity, StyleSheet, Modal, FlatList, Alert, useWindowDimensions } from 'react-native'
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
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper'
import GlassContainer from '../components/customcomponents/GlassContainer'

const AddNewAddress = ({ navigation }) => {
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState(null);
    const [countryList, setCountryList] = useState([]);
    const [isDefaultCountry, setDefaultCountry] = useState(null);
    const [isCountryModal, setCountryModal] = useState(false);
    const [isDefaultState, setDefaultState] = useState(null);
    const [isStateList, setStateList] = useState([]);
    const [isStateModal, setStateModal] = useState(false);

    const [isName, setName] = useState();
    const [isLastname, setLastname] = useState();
    const [isCompany, setCompnay] = useState();
    const [isAddress1, setAddress1] = useState();
    const [isAddress2, setAddress2] = useState();
    const [isCity, setCity] = useState();
    const [isPostalCode, setPostalCode] = useState();
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
        fetchCustomFeilds();
        fetchCountry();
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
                if (response.data?.countries?.length > 0) {
                    setDefaultCountry(response.data?.countries[0]);
                }
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

                // console.log("response.data?.zones", response.data?.zones[0]);
                if (response.data?.zones.length > 0) {
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

    const onAddAdreesBtn = async () => {

        console.log("onAddAdreesBtn function works")
        try {

            const url = `${BASE_URL}${EndPoint?.address_validateAddress}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const user = await _retrieveData("CUSTOMER_ID");
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };

            const body = {
                code: lang?.code,
                currency: cur?.code,
                customer_id: user,
                firstname: isName,
                lastname: isLastname,
                company: isCompany,
                address_1: isAddress1,
                address_2: isAddress2,
                city: isCity,
                postcode: isPostalCode,
                country_id: isDefaultCountry?.country_id,
                zone_id: isDefaultState?.zone_id,
                'custom_field[address]': customFormData,
                default: isDefault ? "Yes" : "No",
            }

            console.log("adding address body:", body);

            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                console.log("response.data?.success?.addressadd", response.data);
                setSuccessMgs(response.data?.success?.addressadd);
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
                if (error.response.data?.error?.custom_field) {
                    setCustomFieldErrors(error.response.data?.error?.custom_field);
                }

            } else {
                Alert.alert("", GlobalText?.extrafield_somethingwrong, [{ text: GlobalText?.extrafield_okbtn, onPress: () => { console.log("ok pressed!") } }]);
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
                        <BackgroundWrapper>
                            <View style={commonStyles.bodyConatiner}>
                                <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.addrsadd_heading} />
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ gap: 20, width: '100%', paddingHorizontal: 12, marginVertical: 12 }}>

                                            <InputBox
                                                label={isLabel?.addrfname_label}
                                                placeholder={isLabel?.addrfname_label}
                                                inputStyle={{ w: '100%', h: 50, ph: 20, }}
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
                                            ErrorMessage={isCompanyError}
                                            borderColor={isCompanyError ? 'red' : null}
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
                                            onChangeText={(text) => { setPostalCode(text); }}
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
                                                <Text >{isDefaultCountry?.name}</Text>

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
                                                <Text>{isDefaultState?.name || 'N/A'}</Text>

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
                                                        customFieldList?.map((item, index) => {
                                                            if (item?.type === 'text' && item?.location == 'address') {
                                                                return (
                                                                    <CustomInput
                                                                        key={index}
                                                                        label={item?.name}
                                                                        placeholder={item?.name}
                                                                        required={item?.required}
                                                                        onChangeText={(text) => handleChange(item?.custom_field_id, text)}
                                                                        value={customFormData[item?.custom_field_id] || ''}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                        inputStyle={{ height: 50 }}
                                                                    />
                                                                )
                                                            }
                                                            if (item?.type === 'textarea' && item?.location == 'address') {
                                                                return (
                                                                    <CustomTextArea
                                                                        key={index}
                                                                        label={item?.name}
                                                                        placeholder={item?.name}
                                                                        required={item?.required}
                                                                        onChangeText={(text) => handleChange(item?.custom_field_id, text)}
                                                                        value={customFormData[item?.custom_field_id] || ''}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                    />
                                                                )
                                                            }

                                                            if (item?.type === 'checkbox' && item?.location == 'address') {
                                                                return (
                                                                    <CustomCheckbox
                                                                        key={index}
                                                                        data={item?.custom_field_value}
                                                                        label={item?.name}
                                                                        required={item?.required}
                                                                        onPress={(id) => handleCheckboxChange(item?.custom_field_id, id)}
                                                                        selected={customFormData[item?.custom_field_id] || []}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                    />
                                                                )
                                                            }

                                                            if (item?.type === 'radio' && item?.location == 'address') {
                                                                return (
                                                                    <CustomRadio
                                                                        key={index}
                                                                        data={item?.custom_field_value}
                                                                        label={item?.name}
                                                                        required={item?.required}
                                                                        onPress={(id) => handleChange(item?.custom_field_id, id)}
                                                                        selected={customFormData[item?.custom_field_id]}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                    />
                                                                )
                                                            }

                                                            if (item?.type === 'select' && item?.location == 'address') {
                                                                return (
                                                                    <CustomSelect
                                                                        key={index}
                                                                        label={item?.name}
                                                                        options={item?.custom_field_value}
                                                                        required={item?.required}
                                                                        onValueChange={(value) => handleChange(item?.custom_field_id, value)}
                                                                        selectedValue={customFormData[item?.custom_field_id]}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                        selectStyle={{ height: 50 }}
                                                                    />
                                                                )
                                                            }

                                                            if (item?.type === 'date' && item?.location == 'address') {
                                                                return (
                                                                    <CustomDateTime
                                                                        key={index}
                                                                        label={item?.name}
                                                                        value={customFormData[item?.custom_field_id]}
                                                                        onChange={(text) => handleChange(item?.custom_field_id, text)}
                                                                        mode="date"
                                                                        required={item?.required}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                        fieldStyle={{ height: 50 }}
                                                                    />
                                                                )
                                                            }

                                                            if (item?.type === 'time' && item?.location == 'address') {
                                                                return (
                                                                    <CustomDateTime
                                                                        key={index}
                                                                        label={item?.name}
                                                                        value={customFormData[item?.custom_field_id]}
                                                                        onChange={(text) => handleChange(item?.custom_field_id, text)}
                                                                        mode="time"
                                                                        required={item?.required}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
                                                                        fieldStyle={{ height: 50 }}
                                                                    />
                                                                )
                                                            }

                                                            if (item?.type === 'datetime' && item?.location == 'address') {
                                                                return (
                                                                    <CustomDateTime
                                                                        key={index}
                                                                        label={item?.name}
                                                                        value={customFormData[item?.custom_field_id]}
                                                                        onChange={(text) => handleChange(item?.custom_field_id, text)}
                                                                        mode="datetime"
                                                                        required={item?.required}
                                                                        showError={customFieldErrors[item?.custom_field_id]}
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

                                        <TouchableOpacity onPress={onAddAdreesBtn} style={{ width: '100%', height: 50, borderRadius: 12, alignSelf: 'center', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.primary }}>
                                            <Text style={commonStyles.textWhite_lg}>{isLabel?.addrnewaddrsbtn_label}</Text>
                                        </TouchableOpacity>

                                    </View>
                                </ScrollView>
                            </View>
                        </BackgroundWrapper>

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

export default AddNewAddress