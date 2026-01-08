import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Platform, } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity';
import { API_KEY, BASE_URL } from '../utils/config';
import axios, { HttpStatusCode } from 'axios';
import { useCustomContext } from '../hooks/CustomeContext';
import commonStyles from '../constants/CommonStyles';
import { _retrieveData, _storeData } from '../utils/storage';

const ChooseCurrency = ({ navigation }) => {
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isCurrencyList, setCurrencyList] = useState();
    const [isLabel, setLabel] = useState();
    const [loading, setloading] = useState(false);
    const [isError, setError] = useState();


    useEffect(() => {
        fetchCurrencyData();
    }, [])


    const fetchCurrencyData = async () => {
        try {
            setloading(true);
            const url = `${BASE_URL}${EndPoint?.currency}`; // Replace with your endpoint
            const sessionId = await _retrieveData('SESSION_ID');
            const user = await _retrieveData('USER');
            const lang = await _retrieveData('SELECT_LANG');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY
            };
            const body = {
                code: lang?.code,
                sessionid: sessionId,
                customer_id: user ? user[0]?.customer_id : null,

            }
            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data?.currencyselect_label);
                setCurrencyList(response.data.currencies);

            }
        } catch (error) {
            setError(GlobalText?.extrafield_somethingwrong);
        } finally {
            setloading(false);
        }
    };

    const onSelectCurrency = async (item) => {
        await _storeData('SELECT_CURRENCY', item);
        navigation.replace('Home');
    }

    return (
        <>
            {loading ? (
                <CustomActivity />
            ) :

                <View style={{ width: '100%', height: '100%', backgroundColor: Colors?.white, paddingBottom: 50 }}>
                    {
                        isError ? (
                            <View style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 18, color: 'red', textAlign: 'center' }}>{isError}</Text>
                            </View>
                        ) : (<ScrollView showsVerticalScrollIndicator={false}>
                            <View style={{ width: '90%', alignSelf: 'center', marginVertical: 20 }}>
                                <Text style={[commonStyles.heading, { color: Colors.primary }]}>{isLabel}</Text>
                            </View>

                            <View style={{ width: '90%', alignSelf: 'center', }}>
                                {
                                    isCurrencyList?.length > 0 ? (
                                        isCurrencyList?.map((item, index) => (
                                            <TouchableOpacity
                                                onPress={() => onSelectCurrency(item)}
                                                key={index}
                                                style={{ width: '100%', borderBottomWidth: 1, borderColor: Colors?.border_color, height: 56, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                                                <View style={{ width: 28, height: 30 }}>
                                                    <Text style={{ fontSize: 24 }}>{item?.symbol_left || item?.symbol_right}</Text>
                                                </View>
                                                <Text>{item.title}</Text>
                                            </TouchableOpacity>
                                        ))
                                    ) : null
                                }

                            </View>

                        </ScrollView>)
                    }
                </View>



            }
        </>
    )
}

export default ChooseCurrency