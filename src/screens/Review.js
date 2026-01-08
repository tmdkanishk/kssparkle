import { View, Text, Image, ScrollView, TouchableOpacity, Alert, Platform, Animated } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import TopStatusBar from '../components/TopStatusBar'
import TitleBarName from '../components/TitleBarName'
import commonStyles from '../constants/CommonStyles'
import { SafeAreaView } from 'react-native-safe-area-context'
import InputBox from '../components/InputBox'
import AntDesign from '@expo/vector-icons/AntDesign';
import CustomButton from '../components/CustomButton'
import { useCustomContext } from '../hooks/CustomeContext'
import CustomActivity from '../components/CustomActivity'
import { useFocusEffect } from '@react-navigation/native'
import { _clearData, _retrieveData } from '../utils/storage'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import { IconComponentImage } from '../constants/IconComponents'
import FailedModal from '../components/FailedModal'
import SuccessModal from '../components/SuccessModal'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'

const Review = ({ navigation, route }) => {
    const { productId } = route.params;
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLogin, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rating, setRating] = useState(0);
    const [review, setReview] = useState();
    const [reviewerName, setReviewerName] = useState();
    const [isLabel, setLabel] = useState();
    const [isError, setError] = useState();
    const [isErrorModal, setErrorModal] = useState(false);
    const [isSuccessMessage, setSuccessMessage] = useState();
    const [isSuccessModal, setSuccessModal] = useState(false);
    const [nameError, setNameError] = useState(null);
    const [reviewError, setReviewError] = useState(null);
    const [ratingError, setRatingError] = useState(null);
    const [screenLoading, setScreenLoading] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const totalRating = 5;

    useFocusEffect(
        useCallback(() => {
            checkUserLogin();
            fetchReviewLabel();
        }, [language, currency])
    );

    const checkUserLogin = async () => {
        const data = await _retrieveData("USER");
        if (data != null) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value)
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const pickRating = (rating) => {
        setRating(rating);
    }

    const fetchReviewLabel = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.productdetails_Reviewlabels}`;
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
                product_id: productId,
                sessionId: sessionId
            }
            const response = await axios.post(url, body, { headers: headers });
            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data);
            }

        } catch (error) {
            console.log("error_review", error.response.data);
        } finally {
            setLoading(false)
        }
    }

    const onClickWriteViewButton = async () => {
        try {
            setScreenLoading(true);
            const url = `${BASE_URL}${EndPoint?.productdetails_writeReview}`;
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
                sessionid: sessionId,
                product_id: productId,
                name: reviewerName,
                text: review,
                rating: rating
            }

            const response = await axios.post(url, body, { headers: headers });

            console.log("response.data review", response.data);
            if (response.status === HttpStatusCode.Ok) {
                setSuccessMessage(response.data?.success);
                setSuccessModal(true);
                setTimeout(() => {
                    closeSuccessModal();
                }, 2000);
            }
        } catch (error) {
            console.log(error.response.data);
            if (error.response.data?.error) {
                if (error.response.data?.error?.name) {
                    setNameError(error.response.data?.error?.name);
                } else {
                    setNameError(null);
                }

                if (error.response.data?.error?.text) {
                    setReviewError(error.response.data?.error?.text);
                } else {
                    setReviewError(null);
                }


                if (error.response.data?.error?.rating) {
                    setRatingError(error.response.data?.error?.rating);
                } else {
                    setRatingError(null);
                }
            } else {
                setError(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setScreenLoading(false);
        }
    }


    const closeSuccessModal = () => {
        navigation.goBack();
        setSuccessModal(false);
        setSuccessMessage()
    }

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <SafeAreaView style={{ backgroundColor: Platform.OS === 'ios' ? Colors.primary : null }}>
                        <View style={[commonStyles.bodyConatiner]}>
                            <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                                <TopStatusBar onChangeCurren={handleOnChangeCurrency} onChangeLang={handleOnChangeLang} scrollY={scrollY} />
                            </View >
                            <TitleBarName titleName={isLabel?.reviewpagename_label} onClickBackIcon={() => navigation.goBack()} />
                            <View style={{ paddingHorizontal: 12, }}>
                                <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
                                    <View style={{ marginVertical: 28 }}>
                                        <View style={{ flexDirection: 'row', gap: 10 }}>
                                            <View style={{ width: '30%', height: 100, borderWidth: 1, borderColor: Colors?.border_color, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                {
                                                    isLabel?.products[0]?.thumb ? <Image source={{ uri: isLabel?.products[0]?.thumb }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} /> :
                                                        <IconComponentImage size={28} />
                                                }
                                            </View>
                                            <View style={{ width: '46%' }}>
                                                <Text style={commonStyles.text_lg}>
                                                    {isLabel?.products[0]?.name}
                                                </Text>
                                            </View>
                                        </View>

                                    </View>
                                    <Text style={commonStyles.heading}>{isLabel?.reviewpage_writeyour_review_heading}</Text>
                                    <View style={{ marginVertical: 16 }}>
                                        <InputBox inputStyle={{ w: '100%', h: 50, ph: 20 }}
                                            placeholder={isLabel?.reviewpage_yourname_text} label={isLabel?.reviewpage_yourname_text}
                                            backgroundColor={Colors.white}
                                            borderRadius={5}
                                            onChangeText={(text) => { setReviewerName(text); setNameError(null) }}
                                            textVlaue={reviewerName}
                                            isRequired={true}
                                            borderColor={nameError ? 'red' : null}
                                        />
                                        {
                                            nameError ? <Text style={{ color: 'red' }}>{nameError}</Text> : null
                                        }
                                    </View>
                                    <View style={{ marginVertical: 16 }}>
                                        <InputBox inputStyle={{ w: '100%', h: 120, ph: 20 }}
                                            placeholder={isLabel?.reviewpage_yourreview_text} label={isLabel?.reviewpage_yourreview_text}
                                            backgroundColor={Colors.white}
                                            borderRadius={5}
                                            inputTextAlignVertical={'top'}
                                            inputPaddingTop={10}
                                            charLabel={'(Maximum 100 charcter)'}
                                            onChangeText={(text) => { setReview(text); setReviewError(null) }}
                                            multiline={true}
                                            textVlaue={review}
                                            isRequired={true}
                                            borderColor={reviewError ? 'red' : null}
                                        />
                                        {
                                            reviewError ? <Text style={{ color: 'red' }}>{reviewError}</Text> : null
                                        }
                                    </View>
                                    <View style={{ marginVertical: 12, gap: 5, flexDirection: 'row', alignItems: 'center' }}>
                                        <Text>{isLabel?.reviewpage_rateing_text} : </Text>
                                        {/* <Text>Bad</Text> */}
                                        <View style={{ flexDirection: 'row', gap: 5 }}>
                                            {Array.from({ length: totalRating }).map((_, index) => (
                                                <TouchableOpacity key={index} onPress={() => { pickRating(index + 1); setRatingError(null) }}>
                                                    <AntDesign name="star" size={24} color={index + 1 <= rating ? Colors.primary : Colors.gray} />
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                        {/* <Text>Good</Text> */}
                                    </View>

                                    {
                                        ratingError ? <Text style={{ color: 'red' }}>{ratingError}</Text> : null
                                    }


                                    <View style={{ marginTop: 12, marginBottom: 200 }}>
                                        <CustomButton btnDisabled={screenLoading} OnClickButton={() => onClickWriteViewButton()} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary, borderRadius: 8 }} buttonText={isLabel?.reviewcntbtn_label} />
                                    </View>

                                </ScrollView>
                            </View>
                        </View >

                        <FailedModal
                            isModal={isErrorModal}
                            isSuccessMessage={isError}
                            handleCloseModal={() => { setErrorModal(false); setError() }}
                            onClickClose={() => { setErrorModal(false); setError() }}
                        />
                        <SuccessModal
                            isModal={isSuccessModal}
                            isSuccessMessage={isSuccessMessage}
                            onClickClose={closeSuccessModal}
                            handleCloseModal={closeSuccessModal}
                        />
                        <NotificationAlert />
                    </SafeAreaView >
                )
            }

        </>

    )
}

export default Review