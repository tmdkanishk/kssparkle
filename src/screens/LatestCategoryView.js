import { View, Text, ScrollView, Alert, Platform, ActivityIndicator, FlatList, useWindowDimensions, Animated } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'

import TopStatusBar from '../components/TopStatusBar'
import commonStyles from '../constants/CommonStyles'
import ProductCard from '../components/ProductCard'
import BottomBar from '../components/BottomBar'
import { useCustomContext } from '../hooks/CustomeContext'
import { _clearData, _retrieveData, _storeData } from '../utils/storage'
import CustomActivity from '../components/CustomActivity'
import { useFocusEffect } from '@react-navigation/native'
import CustomButton from '../components/CustomButton'
import FailedModal from '../components/FailedModal'
import { checkAutoLogin } from '../utils/helpers'
import NotificationAlert from '../components/NotificationAlert'
import { getLatestProducts } from '../services/getLatestProducts'
import SearchBarSection from '../components/SearchBarSection'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'


const LatestCategoryView = ({ navigation }) => {
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState();
    const [data, setData] = useState([]);
    const [isTotalPage, setTotalPage] = useState(0);
    const [isCurretPage, setCurrentPage] = useState(1);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isProductLoading, setProductLoading] = useState(false);
    const [initialCall, setInitialCall] = useState(true);
    const scrollY = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            checkAutoLogin();
            fetchLatestProduct(1);
        }, [language, currency])
    );

    const fetchLatestProduct = async (page) => {
        try {
            if (initialCall) {
                setLoading(true);
                setInitialCall(false);
            }
            setProductLoading(true);
            const result = await getLatestProducts(page, EndPoint?.latestproduct);
            setTitle(result?.pagename);
            setData((prevData) => {
                const existingIds = new Set(prevData.map(item => item?.product_id));
                const newProducts = result?.latest_product?.filter(product => !existingIds.has(product?.product_id));
                return [...prevData, ...newProducts];
            });
            setTotalPage(result?.pages);

        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setProductLoading(false);
            setLoading(false);
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
        setInitialCall(true);
        setCurrentPage(1);
        setData([]);
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
        setInitialCall(true);
        setCurrentPage(1);
        setData([]);
    }

    const onClickLoadMoreBtn = async (page) => {
        setCurrentPage(page);
        fetchLatestProduct(page);
    }

    const handleSearch = async (query) => {
        try {
            setLoading(true);
            navigation.navigate("Search", { query: query });
        } catch (error) {
            console.log("Search results:", error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={commonStyles.bodyConatiner}>
                            <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                                <TopStatusBar scrollY={scrollY} onChangeLang={handleOnChangeLang} onChangeCurren={handleOnChangeCurrency} />
                            </View>
                            <SearchBarSection onClickSearch={(query) => handleSearch(query)} />
                            <View style={{ paddingHorizontal: 12 }}>
                                <Animated.ScrollView
                                    showsVerticalScrollIndicator={false}
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                        { useNativeDriver: false }
                                    )}
                                >
                                    <ScrollView showsVerticalScrollIndicator={false}>
                                        <Text style={[commonStyles.heading, { marginVertical: 12 }]}>{title}</Text>
                                        <View style={{ paddingBottom: 200 }}>
                                            {title && loading && !isProductLoading && <Text style={commonStyles.heading}>{title}</Text>}
                                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: isLandscape ? 'flex-start' : 'space-between', gap: 12, }}>
                                                {
                                                    data?.length > 0 && (
                                                        data.map((item, index) => (
                                                            <ProductCard
                                                                key={index}
                                                                itemdetail={item}
                                                            />
                                                        ))
                                                    )
                                                }

                                                {!loading && !isProductLoading && data?.length == 0 && <Text>{GlobalText?.extrafield_noresult}!</Text>}
                                            </View>
                                            {isProductLoading && (
                                                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                    <ActivityIndicator size={'large'} color={Colors.primary} />
                                                </View>

                                            )}
                                            {
                                                isCurretPage < isTotalPage && !isProductLoading && (
                                                    <View style={{ alignItems: 'center', marginVertical: 24 }}>
                                                        <CustomButton OnClickButton={() => onClickLoadMoreBtn(isCurretPage + 1)} buttonStyle={{ w: '60%', h: 46, backgroundColor: Colors.primary, borderRadius: 6 }} buttonText={GlobalText?.extrafield_loadmorebtn_label} />
                                                    </View>
                                                )
                                            }
                                        </View>

                                    </ScrollView>
                                </Animated.ScrollView>

                            </View>
                        </View>
                        <BottomBar />

                        <FailedModal
                            isModal={isErrorModal}
                            isSuccessMessage={isErrorMgs}
                            handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
                            onClickClose={() => { setErrorModal(false); setErrorMgs() }}
                        />

                        <NotificationAlert />

                    </ >
                )
            }
        </>

    )
}

export default LatestCategoryView