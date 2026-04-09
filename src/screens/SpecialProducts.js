import { View, Text, ScrollView, Alert, Platform, ActivityIndicator, useWindowDimensions, Pressable, Image, Animated, FlatList } from 'react-native'
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
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper'
import ProductGlassCard from '../components/customcomponents/ProductGlassCard'
import CustomHeader from '../components/customcomponents/CustomHeader'
import { useLoading } from '../hooks/LoadingProvider'
import Header from '../components/customcomponents/Header'
import CustomSearchBar from './CustomSearchBar'

/* 

Output --> 

show header for search (complete)

apply infinte scrolling (complete)

fix the image not shown in the product card and the text not showin the white 



*/

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
    const { setGlobalLoading } = useLoading();
    const [activeSeachingScreen, setActiveSeachingScreen] = useState(false);


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
                setGlobalLoading(true);
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
            setGlobalLoading(false);
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

    const toggleSearch = () => {
        setActiveSeachingScreen(prev => !prev);
    };


    if (activeSeachingScreen) {
        return (
            <CustomSearchBar
                setActiveSeachingScreen={setActiveSeachingScreen}
            />
        );
    }


    return (
        <>

            <BackgroundWrapper>
                <View style={commonStyles.bodyConatiner}>
                    <View style={{ paddingHorizontal: 12, marginTop: 45 }}>

                        <FlatList
                            data={data}
                            keyExtractor={(item, index) => index.toString()}
                            numColumns={2}
                            columnWrapperStyle={{
                                justifyContent: isLandscape ? 'flex-start' : 'space-around',
                                marginVertical: 10,
                                gap: 12,
                            }}
                            showsVerticalScrollIndicator={false}

                            // 🔹 HEADER
                            ListHeaderComponent={
                                <>
                                    <View style={{ width: '100%' }}>
                                        <Header
                                            onSearchPress={toggleSearch}
                                            paddingHorizontal={20}
                                        />
                                    </View>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 0, marginBottom: 20 }}>
                                        <CustomHeader pageName={title} />
                                    </View>

                                    {showSort && (
                                        <View style={{
                                            borderTopWidth: 1,
                                            borderBottomWidth: 1,
                                            borderColor: Colors.gray,
                                            padding: 10,
                                            marginTop: 10
                                        }}>
                                            <Text style={{ fontSize: 20, fontWeight: '600' }}>
                                                {GlobalText?.sortby}
                                            </Text>

                                            <View style={{
                                                flexDirection: 'row',
                                                gap: 10,
                                                marginVertical: 12,
                                                flexWrap: 'wrap'
                                            }}>
                                                {sortsFilter?.map((item, index) => (
                                                    <Pressable
                                                        key={index}
                                                        onPress={() => {
                                                            onSortingProduct(item);
                                                            setShowSort(!showSort);
                                                        }}
                                                        style={{
                                                            borderWidth: 1,
                                                            padding: 6,
                                                            borderRadius: 6,
                                                            borderColor: Colors.gray,
                                                            backgroundColor:
                                                                isSort?.text == item?.text
                                                                    ? Colors.primary
                                                                    : Colors.white
                                                        }}
                                                    >
                                                        <Text style={{
                                                            color:
                                                                isSort?.text == item?.text
                                                                    ? Colors.white
                                                                    : Colors.black,
                                                            fontSize: 14
                                                        }}>
                                                            {item?.text}
                                                        </Text>
                                                    </Pressable>
                                                ))}
                                            </View>
                                        </View>
                                    )}
                                </>
                            }

                            // 🔹 ITEM
                            renderItem={({ item }) => (
                                <ProductGlassCard
                                    item={item}
                                    onPress={(product) =>
                                        navigation.navigate("ProductDetail", {
                                            productId: product?.product_id,
                                        })
                                    }
                                />
                            )}

                            // 🔹 EMPTY STATE
                            ListEmptyComponent={
                                !loading && !isProductLoading ? (
                                    <Image
                                        source={require('../assets/images/notfound.png')}
                                        style={{
                                            width: 200,
                                            height: 200,
                                            alignSelf: 'center',
                                            marginTop: 40
                                        }}
                                    />
                                ) : null
                            }

                            // 🔹 FOOTER
                            ListFooterComponent={
                                <>
                                    {isProductLoading && (
                                        <View style={{
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginVertical: 20
                                        }}>
                                            <ActivityIndicator size="large" color={Colors.primary} />
                                        </View>
                                    )}
{/* 
                                    {isCurretPage < isTotalPage &&
                                        !isProductLoading &&
                                        data?.length !== 0 && (
                                            <View style={{ alignItems: 'center', marginVertical: 24 }}>
                                                <CustomButton
                                                    OnClickButton={() =>
                                                        onClickLoadMoreBtn(isCurretPage + 1)
                                                    }
                                                    buttonStyle={{
                                                        w: '60%',
                                                        h: 46,
                                                        backgroundColor: Colors.primary,
                                                        borderRadius: 6
                                                    }}
                                                    buttonText={GlobalText?.extrafield_loadmorebtn_label}
                                                />
                                            </View>
                                        )} */}
                                </>
                            }

                            onEndReached={() => {
                                if (isCurretPage < isTotalPage && !isProductLoading) {
                                    onClickLoadMoreBtn(isCurretPage + 1);
                                }
                            }}
                            onEndReachedThreshold={0.5}
                        />
                    </View>
                </View>

                {/* 🔹 MODALS OUTSIDE */}
                <FailedModal
                    isModal={isErrorModal}
                    isSuccessMessage={isErrorMgs}
                    handleCloseModal={() => {
                        setErrorModal(false);
                        setErrorMgs();
                    }}
                    onClickClose={() => {
                        setErrorModal(false);
                        setErrorMgs();
                    }}
                />

                <NotificationAlert />
            </BackgroundWrapper>

        </>

    )
}

export default SpecialProducts