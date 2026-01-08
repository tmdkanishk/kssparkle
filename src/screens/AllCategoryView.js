import { View, ScrollView, Alert, Platform, FlatList, ActivityIndicator, Image, Text, useWindowDimensions, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopStatusBar from '../components/TopStatusBar'
import SearchBarSection from '../components/SearchBarSection'
import BottomBar from '../components/BottomBar'
import commonStyles from '../constants/CommonStyles'
import AllCategoryViewCard from '../components/AllCategoryViewCard'
import { useCustomContext } from '../hooks/CustomeContext'
import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { _clearData, _retrieveData } from '../utils/storage'
import { gatSubCategoryOrProduct } from '../services/getSubCategoryOrProduct'
import CustomActivity from '../components/CustomActivity'
import { checkAutoLogin } from '../utils/helpers'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import ProductCard from '../components/ProductCard'
import { addWishlistProduct } from '../services/addWishlistProduct'
import { removeWishlistProduct } from '../services/removeWishlistProduct'
import FailedModal from '../components/FailedModal'
import AddToCartOptionUiModal from '../components/AddToCartOptionUiModal'
import SuccessModal from '../components/SuccessModal'
import { addCompareProduct } from '../services/addCompareProduct'
import { addToCartProduct } from '../services/addToCartProduct'
import { addToCartWithOptions } from '../services/addToCartWithOptions'
import { addToCartWithOptionCopy } from '../services/addToCartWithOptionCopy'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import { useCartCount } from '../hooks/CartContext'

const AllCategoryView = ({ navigation, route }) => {
    const { path } = route.params;
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLogin, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [page, setPage] = useState(1);
    const [productData, setProductData] = useState([]);
    const [isModalShow, setModalShow] = useState(false);
    const [isModalMessage, setModalMessage] = useState();
    const [isModalLabel, setModalLabel] = useState();
    const [isButtonType, setButtonType] = useState();
    const [isAddTOCartOptionModalShow, setAddTOCartOptionModalShow] = useState(false);
    const [isAddTOCartOptionResult, setAddTOCartOptionResult] = useState();
    const [productIdOption, setproductIdOption] = useState();
    const [isCartAnimation, setCartAnimation] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isToggleCardId, setToggleCardId] = useState(null);
    const [isTitle, setTitle] = useState(null);
    const [itemCardLoading, setItemCardLoading] = useState(null);
    const { updateCartCount } = useCartCount();
    const scrollY = useRef(new Animated.Value(0)).current;

    useFocusEffect(
        useCallback(() => {
            checkUserLogin();
            checkAutoLogin();
            fetchSubCategory();
        }, [language, currency, page])
    );

    const fetchSubCategory = async () => {
        try {
            if (page == 1) {
                setLoading(true);
            }
            setLoadingMore(true);
            const result = await gatSubCategoryOrProduct(path, page, EndPoint?.newcategories);
            setTitle(result?.heading_title);
            if (result?.categories?.length) {
                setData((prevData) => {
                    const existingIds = new Set(prevData.map(item => item.category_id));
                    const newSubcat = result?.categories?.filter(categories => !existingIds.has(categories?.category_id));
                    return [...prevData, ...newSubcat];
                });
            }

            if (result?.products?.length) {
                setProductData((prevData) => {
                    const existingIds = new Set(prevData.map(item => item.product_id));
                    const newProducts = result?.products?.filter(product => !existingIds.has(product?.product_id));
                    return [...prevData, ...newProducts];
                });
            }

            if (page >= result?.pages) {
                setHasMoreData(false);
            }

        } catch (error) {
            console.log("error:", error.response.data);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    const handleLoadMore = () => {
        if (!loadingMore && hasMoreData) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderItem = ({ item }) => (
        <AllCategoryViewCard
            onClickCard={() => navigation.navigate({
                name: 'CategoryView',
                key: `CategoryView-${item?.category_id}`,
                params: { subCategoryId: item?.category_id, titleName: item?.name }
            })}
            img={item?.image}
            name={item?.name}
            childSubList={item?.children}
            id={item?.category_id}
            isToggleCardId={isToggleCardId}
            setToggleCardId={setToggleCardId}


        />
    )

    const onClickContinueBtn = () => {
        navigation.navigate('Compare');
        setModalShow(false);
        setModalMessage();
        setModalLabel();
        setButtonType();
    }

    const onClickCloseModal = () => {
        setModalShow(false);
        setModalMessage();
        setModalLabel();
        setButtonType();
        setCartAnimation(false);
    }

    const checkUserLogin = async () => {
        const data = await _retrieveData("USER");
        if (data != null) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
        setData([]);
        setProductData([]);
        setPage(1);
        setHasMoreData(true)
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
        setData([]);
        setProductData([]);
        setPage(1);
        setHasMoreData(true)
    }


    const handleSearch = async (query) => {
        try {
            setLoading(true);
            navigation.navigate('Search', { query: query })
        } catch (error) {
            console.log('Search results:', error.message);
        } finally {
            setLoading(false);
        }
    }



    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={[commonStyles.bodyConatiner, { backgroundColor: '#F0F4F7' }]}>
                            <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                                <TopStatusBar scrollY={scrollY} onChangeLang={handleOnChangeLang} onChangeCurren={handleOnChangeCurrency} />
                            </View>
                            <SearchBarSection onClickSearch={(query) => handleSearch(query)} isCartAnimation={isCartAnimation} />

                            <View style={{ paddingHorizontal: isLandscape ? 30 : 12, paddingTop: 12, paddingBottom: loadingMore && 50 }}>
                                <Animated.FlatList
                                    onScroll={Animated.event(
                                        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                        { useNativeDriver: false }
                                    )}
                                    key={isLandscape}
                                    data={data}
                                    renderItem={renderItem}
                                    keyExtractor={(item, index) => index.toString()}
                                    onEndReached={handleLoadMore}
                                    onEndReachedThreshold={0.3}
                                    ListHeaderComponent={<Text style={{ fontSize: 18, fontWeight: '600', marginVertical: 10 }}>{isTitle}</Text>}
                                    ListFooterComponent={() => (
                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: productData?.length < 4 && isLandscape ? 'flex-start' : "space-between" }}>
                                            {productData.map((item, index) => (
                                                <View key={index} style={{ width: isLandscape ? '24%' : '48%' }}>
                                                    <ProductCard
                                                        ContainerWidth={'100%'}
                                                        itemdetail={item}
                                                    />
                                                </View>
                                            ))}
                                        </View>)}
                                    showsVerticalScrollIndicator={false}
                                    contentContainerStyle={{ gap: 12, paddingBottom: 200 }}
                                    ListEmptyComponent={
                                        !loadingMore && <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                            <View style={{ width: 200, height: 400, alignSelf: 'center' }}>
                                                <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                                            </View>
                                        </View>
                                    }
                                />

                                {
                                    loadingMore && <ActivityIndicator size="large" color={Colors.primary} />
                                }
                            </View>
                        </View>
                        <BottomBar />
                        <NotificationAlert />


                        <SuccessModal
                            isModal={isModalShow}
                            btnName={isModalLabel?.comparecntbtn_label || isModalLabel}
                            isSuccessMessage={isModalMessage}
                            onClickClose={isButtonType === 'Compare' ? onClickContinueBtn : onClickCloseModal}
                            handleCloseModal={onClickCloseModal}
                        />

                        <AddToCartOptionUiModal
                            items={isAddTOCartOptionResult}
                            closeModal={() => setAddTOCartOptionModalShow(false)}
                            isModalVisibal={isAddTOCartOptionModalShow}
                            productId={productIdOption}
                        />

                        <FailedModal
                            isModal={isErrorModal}
                            isSuccessMessage={isErrorMgs}
                            handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
                            onClickClose={() => { setErrorModal(false); setErrorMgs() }}
                        />
                    </>
                )
            }
        </>

    )
}

export default AllCategoryView