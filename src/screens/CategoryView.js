import { View, Text, ScrollView, Alert, Platform, ActivityIndicator, useWindowDimensions, Pressable, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopStatusBar from '../components/TopStatusBar'
import commonStyles from '../constants/CommonStyles'
import ProductCard from '../components/ProductCard'
import BottomBar from '../components/BottomBar'
import TitleBarSearchComponent from '../components/TitleBarSearchComponent'
import Cart from '../components/Cart'
import { useCustomContext } from '../hooks/CustomeContext'
import { _clearData, _retrieveData, _storeData } from '../utils/storage'
import { addWishlistProduct } from '../services/addWishlistProduct'
import { removeWishlistProduct } from '../services/removeWishlistProduct'
import CustomActivity from '../components/CustomActivity'
import { useFocusEffect } from '@react-navigation/native'
import { addCompareProduct } from '../services/addCompareProduct'
import { gatSubCategoryOrProduct } from '../services/getSubCategoryOrProduct'
import { addToCartProduct } from '../services/addToCartProduct'
import CustomButton from '../components/CustomButton'
import SuccessModal from '../components/SuccessModal'
import AutoSlider from '../components/AutoSlider'
import SmallProductCard from '../components/SmallProductCard'
import Carousel from '../components/Carousel'
import UserStatus from '../components/UserStatus'
import { getModuleData } from '../services/getModuleData'
import AddToCartOptionUiModal from '../components/AddToCartOptionUiModal'
import { addToCartWithOptions } from '../services/addToCartWithOptions'
import ProductCardList from '../components/ProductCardList'
import FailedModal from '../components/FailedModal'
import { addToCartWithOptionCopy } from '../services/addToCartWithOptionCopy'
import { checkAutoLogin, truncateString } from '../utils/helpers'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import SearchBarSection from '../components/SearchBarSection'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import { useCartCount } from '../hooks/CartContext'
import { IconComponentCaretdown, IconComponentCaretup } from '../constants/IconComponents'
import { getSortsFilterList } from '../services/getSortsFilterList'
import { getCategoryProducts } from '../services/getCategoryProducts'

const CategoryView = ({ navigation, route }) => {
    const { subCategoryId, titleName } = route.params;
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { updateCartCount } = useCartCount();
    const [loading, setLoading] = useState(false);
    const [isLogin, setLogin] = useState(false);
    const [isModalShow, setModalShow] = useState(false);
    const [isModalMessage, setModalMessage] = useState();
    const [isModalLabel, setModalLabel] = useState();
    const [isButtonType, setButtonType] = useState();
    const [data, setData] = useState([]);
    const [isModuleData, setModuleData] = useState();
    const [isBottomModuleData, setBottomModuleData] = useState();
    const [isTotalPage, setTotalPage] = useState(0);
    const [isCurretPage, setCurrentPage] = useState(1);
    const [isAddTOCartOptionModalShow, setAddTOCartOptionModalShow] = useState(false);
    const [isAddTOCartOptionResult, setAddTOCartOptionResult] = useState();
    const [productIdOption, setproductIdOption] = useState();
    const [isCartAnimation, setCartAnimation] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isProductLoading, setProductLoading] = useState(false);
    const [itemCardLoading, setItemCardLoading] = useState(null);

    const [showSort, setShowSort] = useState(false);
    const [sortsFilter, setSortsFilter] = useState([]);
    const [isSort, setSort] = useState(null);
    const scrollY = useRef(new Animated.Value(0)).current;


    useEffect(() => {
        checkAutoLogin();
        fetchSortsItems();
    }, []);


    useFocusEffect(
        useCallback(() => {
            checkUserLogin();
            fetchProductListBySubCategory(1);
            // fetchModuleData();
            // fetchBottomModuleData();
        }, [language, currency])
    );



    const fetchProductListBySubCategory = async (page, order, sort) => {
        try {
            setProductLoading(true);
            const result = await getCategoryProducts(subCategoryId, page, order, sort, EndPoint?.newcategories);
            setData((prevItems) => [...prevItems, ...(result?.products || [])]);
            console.log("result?.products", result?.products);
            setTotalPage(result?.productpages);

        } catch (error) {
            console.log("error result?.products", error.response.data);
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setProductLoading(false);
        }
    }

    const fetchModuleData = async () => {
        try {
            setLoading(true);
            setData([]);
            const data = await getModuleData('Category', 'content_top', EndPoint?.layout);
            setModuleData(data?.modules);
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setLoading(false);
        }
    };

    const fetchBottomModuleData = async () => {
        try {
            setLoading(true);
            setData([]);
            const data = await getModuleData('Category', 'content_bottom', EndPoint?.layout);
            setBottomModuleData(data?.modules);
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setLoading(false);
        }
    };

    const checkUserLogin = async () => {
        const data = await _retrieveData("USER");
        if (data != null) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }

    const onClickWishlist = async (productId) => {
        try {
            setItemCardLoading(productId);
            if (!isLogin) {
                navigation.navigate('Login');
                return;
            }
            const results = await addWishlistProduct(productId, EndPoint?.accountdashboard_wishlistadd);
            if (results?.success) {
                setData((prevData) =>
                    prevData.map((item) =>
                        item.product_id == productId
                            ? { ...item, wishliststatus: true } // or false if removing
                            : item
                    )
                );
            }
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setItemCardLoading(null);
        }
    }

    const onClickRemoveWishList = async (productId) => {
        try {
            setItemCardLoading(productId);
            const results = await removeWishlistProduct(productId, EndPoint?.accountdashboard_wishlistremove);
            if (results?.success) {
                setData((prevData) =>
                    prevData.map((item) =>
                        item.product_id == productId
                            ? { ...item, wishliststatus: false } // or false if removing
                            : item
                    )
                );
            }
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setItemCardLoading(null);
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
        setCurrentPage(1);
        setData([]);
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
        setCurrentPage(1);
        setData([]);
    }

    const handleCompareBtn = async (productId) => {
        try {
            setItemCardLoading(productId)
            const results = await addCompareProduct(productId, EndPoint?.compare_add);
            if (results) {
                setModalMessage(results?.success);
                setModalShow(true);
                setModalLabel(results?.text);
                setButtonType('Compare');
            }

        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setItemCardLoading(null);
        }
    }

    const onClickAddToCart = async (productId) => {
        try {
            setItemCardLoading(productId);
            const results = await addToCartProduct(productId, '', EndPoint?.cart_add);
            if (results?.success) {
                updateCartCount(results?.cartproductcount);
                setModalMessage(results?.success);
                setModalShow(true)
                setModalLabel(results?.cartokbtn_label);
                setCartAnimation(true);
            }
        } catch (error) {
            if (error.response.data?.error?.quantity) {
                setErrorMgs(error.response.data?.error?.quantity);
                setErrorModal(true);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true)
            }
        } finally {
            setItemCardLoading(null);
        }
    }

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

    const onClickLoadMoreBtn = async (page) => {
        setCurrentPage(page);
        fetchProductListBySubCategory(page);
    }

    const handleAddToCartWithOption = async (productId) => {
        try {
            setItemCardLoading(productId);
            const results = await addToCartWithOptions(productId, EndPoint?.cart_ProductOptions);
            if (results) {
                setAddTOCartOptionResult(results);
                setAddTOCartOptionModalShow(true);
                setproductIdOption(productId);
            }
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setItemCardLoading(null);
        }
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
            const result = await getSortsFilterList(EndPoint?.sorts);
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
            fetchProductListBySubCategory(1);
        } else {
            setSort(sortingType);
            setData([]);
            setTotalPage(0);
            setCurrentPage(1);
            fetchProductListBySubCategory(1, sortingType?.order, sortingType?.sort);
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
                            <View style={{ paddingHorizontal: 12, }}>
                                <TopStatusBar scrollY={scrollY} onChangeLang={handleOnChangeLang} onChangeCurren={handleOnChangeCurrency} />
                            </View>
                            <SearchBarSection onClickSearch={(query) => handleSearch(query)} />
                            <Animated.ScrollView
                                showsVerticalScrollIndicator={false}
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: false }
                                )}
                            >
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <View style={{ paddingHorizontal: 12, paddingBottom: 100 }}>
                                        {/* Top module */}
                                        <View>
                                            {
                                                isModuleData?.length > 0 ? (
                                                    isModuleData?.map((item, index) => {
                                                        if (item?.type == 'categorystory') {
                                                            // console.log(item);
                                                            return (
                                                                <View style={{ marginTop: 12 }} key={index}>
                                                                    <UserStatus data={item?.data} />
                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'slider') {
                                                            return (
                                                                <View style={{ width: '100%', height: 200, marginTop: 12 }} key={index}>
                                                                    <Carousel data={item?.data} />
                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'featuredcategory') {
                                                            return (
                                                                <View style={{ gap: 12, marginTop: 12 }} key={index}>
                                                                    <Text style={[commonStyles.heading, { color: Colors.headingColor }]}>{item?.heading}</Text>
                                                                    {
                                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, }}>
                                                                            {item?.data.map((item, intex) => (
                                                                                <SmallProductCard key={intex} data={item} />
                                                                            ))
                                                                            }
                                                                        </View>

                                                                    }

                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'products') {
                                                            // console.log(item);
                                                            return (
                                                                <View style={{ gap: 12, marginTop: 12 }} key={index}>
                                                                    <Text style={[commonStyles.heading, { color: Colors.headingColor }]}>{item?.heading}</Text>

                                                                    <ProductCardList
                                                                        ContainerWidth={'100%'}
                                                                        data={item?.data}
                                                                    />

                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'banner') {
                                                            return (
                                                                <View style={{ marginTop: 12, }} key={index}>
                                                                    <AutoSlider data={item?.data} />
                                                                </View>
                                                            )
                                                        }
                                                    }
                                                    )
                                                ) : null

                                            }
                                        </View>
                                        {/* data */}
                                        <View>

                                            {/* {titleName && <Text style={commonStyles.heading}>{titleName}</Text>} */}

                                            <View>
                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                                                    {titleName && <Text style={commonStyles.heading}>{titleName}</Text>}
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
                                            <View style={{ flexDirection: 'row', marginTop: 12, flexWrap: 'wrap', justifyContent: isLandscape ? 'flex-start' : 'space-between', gap: 12, }}>
                                                {data?.length > 0 && (
                                                    data.map((item, index) => (
                                                        <ProductCard
                                                            key={index}
                                                            itemdetail={item}
                                                        />
                                                    ))
                                                )
                                                    // : (!isProductLoading && <Text>{GlobalText?.extrafield_noresult}!</Text>)
                                                }


                                                {
                                                    isProductLoading && (
                                                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                                                            <ActivityIndicator size={'large'} color={Colors.primary} />
                                                        </View>

                                                    )
                                                }
                                            </View>
                                            {
                                                isCurretPage < isTotalPage ? (
                                                    <View style={{ alignItems: 'center', marginVertical: 24 }}>
                                                        <CustomButton OnClickButton={() => onClickLoadMoreBtn(isCurretPage + 1)} buttonStyle={{ w: '60%', h: 46, backgroundColor: Colors.primary, borderRadius: 6 }} buttonText={GlobalText?.extrafield_loadmorebtn_label} />
                                                    </View>
                                                ) : null
                                            }
                                        </View>
                                        {/* footer module */}
                                        <View>
                                            {
                                                isBottomModuleData?.length > 0 ? (
                                                    isBottomModuleData?.map((item, index) => {
                                                        if (item?.type == 'categorystory') {
                                                            // console.log(item);
                                                            return (
                                                                <View style={{ marginTop: 12 }} key={index}>
                                                                    <UserStatus data={item?.data} />
                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'slider') {
                                                            return (
                                                                <View style={{ width: '100%', height: 200, marginTop: 12 }} key={index}>
                                                                    <Carousel data={item?.data} />
                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'featuredcategory') {
                                                            return (
                                                                <View style={{ gap: 12, marginTop: 12 }} key={index}>
                                                                    <Text style={[commonStyles.heading, { color: Colors.headingColor }]}>{item?.heading}</Text>
                                                                    {
                                                                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, }}>
                                                                            {item?.data.map((item, intex) => (
                                                                                <SmallProductCard key={intex} data={item} />
                                                                            ))
                                                                            }
                                                                        </View>

                                                                    }

                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'products') {
                                                            return (
                                                                <View style={{ gap: 12, marginTop: 12 }} key={index}>
                                                                    <Text style={[commonStyles.heading, { color: Colors.headingColor }]}>{item?.heading}</Text>

                                                                    <ProductCardList
                                                                        ContainerWidth={'100%'}
                                                                        data={item?.data}
                                                                    />

                                                                </View>
                                                            )
                                                        }

                                                        if (item?.type == 'banner') {
                                                            return (
                                                                <View style={{ marginTop: 12, }} key={index}>
                                                                    <AutoSlider data={item?.data} />
                                                                </View>
                                                            )
                                                        }
                                                    }
                                                    )
                                                ) : null

                                            }
                                        </View>
                                    </View>
                                </ScrollView>
                            </Animated.ScrollView>

                        </View>
                        <BottomBar />

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

                        <NotificationAlert />
                    </ >
                )
            }
        </>

    )
}

export default CategoryView