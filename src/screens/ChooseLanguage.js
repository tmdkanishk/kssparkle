import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, I18nManager } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_KEY, BASE_URL } from '../utils/config';
import axios, { HttpStatusCode } from 'axios';
import CustomActivity from '../components/CustomActivity';
import commonStyles from '../constants/CommonStyles';
import { useCustomContext } from '../hooks/CustomeContext';
import { _retrieveData, _storeData } from '../utils/storage';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';
import { useLoading } from '../hooks/LoadingProvider';
import RNRestart from "react-native-restart-newarch"; // Import package from node modules


const ChooseLanguage = ({ navigation }) => {
    const { Colors, EndPoint, SetAppLanguage } = useCustomContext();
    const [isLanguageList, setlanguageList] = useState();
    const [isLabel, setLabel] = useState();
    const [loading, setloading] = useState(false);
    const [isError, setError] = useState();
    const { setGlobalLoading } = useLoading();



    useEffect(() => {
        fetchLanguageData();
    }, [])


    const fetchLanguageData = async () => {
        try {
            setGlobalLoading(true);
            const url = `${BASE_URL}${EndPoint?.languages}`; // Replace with your endpoint
            const sessionId = await _retrieveData('SESSION_ID');
            const user = await _retrieveData('USER');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                sessionid: sessionId,
                customer_id: user ? user[0]?.customer_id : null
            }
            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data?.languageselect_label);
                setlanguageList(response.data?.languages);

            }
        } catch (error) {
            setError("Something went wrong! Please try again later!");
        } finally {
            setGlobalLoading(false);
        }
    };


    const onSelectLanguage = async (item) => {
        await _storeData('SELECT_LANG', item);
        SetAppLanguage(item?.code);
        console.log(item?.code)
        navigation.replace('ChooseCurrency')
    }

    //     const onSelectLanguage = async (item) => {
    //     const selectedLanguage = item?.code;
    //     const isArabic = selectedLanguage === 'ar';

    //     // 1. Store the selection
    //     await _storeData('SELECT_LANG', item);
    //     SetAppLanguage(selectedLanguage);

    //     // 2. Check if we need to flip the RTL state
    //     // I18nManager.isRTL tells us the *current* active state
    //     if (I18nManager.isRTL !== isArabic) {
    //         I18nManager.allowRTL(isArabic);
    //         I18nManager.forceRTL(isArabic);

    //         // // 3. Restart is MANDATORY for the UI to flip
    //         // setTimeout(() => {
    //         //     RNRestart.Restart();
    //         // }, 150);
    //     } else {
    //         // If no flip is needed, just navigate normally
    //         navigation.replace('ChooseCurrency');
    //     }
    // };

    return (
        <>
            <BackgroundWrapper>

                <View style={{ width: '100%', height: '100%', paddingBottom: 50 }}>
                    {
                        isError ? (
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>{isError}</Text>
                            </View>
                        ) : (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={{ width: '90%', alignSelf: 'center', marginVertical: 20, marginTop: 60 }}>
                                    <Text style={[commonStyles.heading, { color: Colors.white }]}>{isLabel}</Text>
                                </View>

                                <View style={{ width: '90%', alignSelf: 'center', }}>
                                    {
                                        isLanguageList?.length > 0 ? (

                                            isLanguageList?.map((item, index) => (
                                                <TouchableOpacity key={index}
                                                    onPress={() => onSelectLanguage(item)}
                                                    style={{ width: '100%', borderBottomWidth: 1, borderColor: Colors?.border_color, height: 56, flexDirection: 'row', alignItems: 'center', gap: 10 }}
                                                >
                                                    <View style={{ width: 28, height: 24 }}>
                                                        <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                                                    </View>
                                                    <Text style={{ color: Colors.white }}>{item.name}</Text>
                                                </TouchableOpacity>
                                            ))


                                        ) : null
                                    }

                                </View>

                            </ScrollView>
                        )
                    }
                </View>

            </BackgroundWrapper>

        </>

    )
}

export default ChooseLanguage