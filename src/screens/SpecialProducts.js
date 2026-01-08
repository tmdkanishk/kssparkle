import { View, Text, ScrollView, Alert, Platform, ActivityIndicator, useWindowDimensions, Pressable, Image, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
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
import { checkAutoLogin, truncateString } from '../utils/helpers'
import NotificationAlert from '../components/NotificationAlert'
import { getSpecialProducts } from '../services/getSpecialProducts'
import SearchBarSection from '../components/SearchBarSection'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import { getSortsFilterList } from '../services/getSortsFilterList'
import { IconComponentCaretdown, IconComponentCaretup } from '../constants/IconComponents'

const SpecialProducts = ({ navigation }) => {
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
    const [showSort, setShowSort] = useState(false);
    const [sortsFilter, setSortsFilter] = useState([]);
    const [isSort, setSort] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        checkAutoLogin();
        fetchSortsItems();
    }, [])

    useFocusEffect(
        useCallback(() => {
            fetchSpecialProduct(1);
        }, [language, currency])
    );


    const fetchSpecialProduct = async (page, order, sort) => {
        try {
            if (initialCall) {
                setLoading(true);
                setInitialCall(false);
            }
            setProductLoading(true);
            const result = await getSpecialProducts(page, order, sort, EndPoint?.specialproduct);
            setTitle(result?.pagename);
            setData((prevData) => {
                const existingIds = new Set(prevData.map(item => item?.product_id));
                const newProducts = result?.special_product?.filter(product => !existingIds.has(product?.product_id));
                return [...prevData, ...newProducts];
            });

            setTotalPage(result?.pages);
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setLoading(false);
            setProductLoading(false);
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
        fetchSpecialProduct(page, isSort?.order, isSort?.sort);
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

    const fetchSortsItems = async () => {
        try {
            const result = await getSortsFilterList(EndPoint?.sorts, 'special');
            setSortsFilter(result?.sorts);
        } catch (error) {
            console.log("error:", error.response.data);
        }
    }

    const onSortingProduct = (sortingType) => {
        if (isSort?.text === sortingType?.text) {
            setSort(null);
            setData([]);
            setTotalPage(0);
            setCurrentPage(1);
            fetchSpecialProduct(1);
        } else {
            setSort(sortingType);
            setData([]);
            setTotalPage(0);
            setCurrentPage(1);
            fetchSpecialProduct(1, sortingType?.order, sortingType?.sort);
        }
    }

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <SafeAreaView style={{ backgroundColor: Platform.OS === 'ios' ? Colors.primary : null }}>
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
                                        <View>
                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 }}>
                                                <Text style={commonStyles.heading}>{title}</Text>
                                                <Pressable disabled={data?.length == 0} onPress={() => setShowSort(!showSort)} style={{ borderWidth: 1, gap: 10, flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, borderColor: Colors.gray, opacity: data?.length == 0 ? 0.5 : 1 }}>
                                                    <Text>{GlobalText?.sortby}</Text>
                                                    {showSort ? <IconComponentCaretup size={18} /> : <IconComponentCaretdown size={18} />}
                                                </Pressable>
                                            </View>

                                            {showSort && <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.gray, padding: 10, marginTop: 10 }}>
                                                <Text style={{ fontSize: 20, fontWeight: '600' }}>{GlobalText?.sortby}</Text>
                                                <View style={{ flexDirection: 'row', gap: 10, marginVertical: 12, width: '100%', flexWrap: 'wrap' }}>
                                                    {sortsFilter?.map((item, index) => (
                                                        <Pressable onPress={() => { onSortingProduct(item); setShowSort(!showSort) }} key={index} style={{ borderWidth: 1, padding: 6, borderRadius: 6, borderColor: Colors.gray, backgroundColor: isSort?.text == item?.text ? Colors.primary : Colors.white }}>
                                                            <Text style={{ color: isSort?.text == item?.text ? Colors.white : Colors.black, fontWeight: '400', fontSize: 14 }}>{item?.text}</Text>
                                                        </Pressable>))
                                                    }
                                                </View>
                                            </View>}
                                        </View>

                                        <View style={{ paddingBottom: 200 }}>
                                            <View style={{ flexDirection: 'row', marginVertical: 12, flexWrap: 'wrap', justifyContent: isLandscape ? 'flex-start' : 'space-between', gap: 12, }}>
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


                                            </View>

                                            {!loading && !isProductLoading && data?.length == 0 && <Image source={require('../assets/images/notfound.png')} style={{ width: 200, height: 200, alignSelf: 'center' }} />}

                                            {
                                                isProductLoading && (
                                                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                        <ActivityIndicator size={'large'} color={Colors.primary} />
                                                    </View>

                                                )
                                            }

                                            {
                                                isCurretPage < isTotalPage && !isProductLoading && data?.length != 0 && (
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

                    </SafeAreaView >
                )
            }
        </>

    )
}

export default SpecialProducts