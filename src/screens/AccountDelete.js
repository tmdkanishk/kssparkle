import { View, Text, SafeAreaView, Platform, TouchableOpacity, ScrollView, Alert, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import TitleBarName from '../components/TitleBarName';
import { IconComponentCheckSquare, IconComponentSquare } from '../constants/IconComponents';
import { getAccountDeleteText } from '../services/getAccountDeleteText';
import CustomActivity from '../components/CustomActivity'

const AccountDelete = ({ navigation }) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors, EndPoint } = useCustomContext();
    const [isTerms, setIsTerms] = useState(false);
    const [isTermDescription, setIsTermDescription] = useState(null);
    const [isLabel, setLabel] = useState(null);
    const [isReasons, setReasons] = useState(null);
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        fetchAccountDeleteText();
    }, [])

    const fetchAccountDeleteText = async () => {
        try {
            setLoading(true);
            const result = await getAccountDeleteText(EndPoint?.deleteaccount);
            console.log('result : ', result);
            setLabel(result?.text);
            setIsTermDescription(result?.message);
            setReasons(result?.leavingreasons);
        } catch (error) {
            console.log('error : ', error.response.data);
        } finally {
            setLoading(false);
        }

    }

    const showAlert = () => {
        Alert.alert(
            isLabel?.termserrorheading,
            isLabel?.termserrorlabel,
            [
                {
                    text: isLabel?.okbtn,
                    onPress: () => console.log("OK Pressed")
                }
            ],
            { cancelable: true }
        );
    };


    return (
        <>
            {isLoading ? (<CustomActivity />) :

                (<View style={{ flex: 1, backgroundColor: 'white' }}>
                    <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.pagelabel} />

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <Text style={{ flexWrap: 'wrap', paddingHorizontal: 14 }}>
                            {isTermDescription}
                        </Text>

                        <View style={{ marginBottom: 100, marginTop: 12, flexDirection: 'row', marginHorizontal: 12, alignItems: 'center', gap: 12 }}>

                            <TouchableOpacity onPress={() => setIsTerms(!isTerms)}>
                                {isTerms ? <IconComponentCheckSquare /> : <IconComponentSquare />}
                            </TouchableOpacity>
                            <Text style={{ flexWrap: 'wrap', textTransform: 'capitalize', fontSize: 14, fontWeight: '500' }}>{isLabel?.agreelabel}</Text>

                        </View>

                    </ScrollView>

                    <View style={{ height: 70, position: 'absolute', bottom: 0, flexDirection: 'row', paddingHorizontal: 12, backgroundColor: Colors?.white }}>
                        <TouchableOpacity onPress={() => isTerms ? navigation.navigate('AccountDeleteReview', { reasons: isReasons, label: isLabel }) : showAlert()} style={{ width: '50%', height: '90%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors?.white }}>
                            <Text style={{ textTransform: 'uppercase', fontSize: 16, fontWeight: '500' }}>{isLabel?.delanywaybtn}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: '50%', height: '90%', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors?.primary }}>
                            <Text style={{ textTransform: 'uppercase', fontSize: 16, color: 'white', fontWeight: '500' }}>{isLabel?.keepacntbtn}</Text>
                        </TouchableOpacity>

                    </View>

                </View>)
            }


        </>
    )
}

export default AccountDelete