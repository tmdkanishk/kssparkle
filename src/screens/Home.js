import { View, Text, ScrollView, Modal, TouchableOpacity, Alert, Platform, useWindowDimensions, Animated, FlatList, Pressable, Image, } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BottomBar from '../components/BottomBar';
import SideBar from '../components/SideBar';
import Topbar from '../components/Topbar';
import TopStatusBar from '../components/TopStatusBar';
import Searchbar from '../components/Searchbar';
import UserStatus from '../components/UserStatus';
import Carousel from '../components/Carousel';
import commonStyles from '../constants/CommonStyles';
import SmallProductCard from '../components/SmallProductCard';
import Entypo from '@expo/vector-icons/Entypo';
import { _clearAllData, _clearData, _retrieveData, _storeData } from '../utils/storage';
import { useCustomContext } from '../hooks/CustomeContext';
import CustomActivity from '../components/CustomActivity';
import { getModuleData } from '../services/getModuleData';
import AutoSlider from '../components/AutoSlider';
import ProductCardList from '../components/ProductCardList';
import FailedModal from '../components/FailedModal';
import { checkAutoLogin } from '../utils/helpers';
import { logout } from '../services/logout';
import NotificationAlert from '../components/NotificationAlert';
import BrandCard from '../components/BrandCard';
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext';
import { useFocusEffect } from '@react-navigation/native';
import { getCartItem } from '../services/getCartItem';
import { useCartCount } from '../hooks/CartContext';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';
import Header from '../components/customcomponents/Header';
import PromoCard from '../components/customcomponents/PromoCard';
import Category from './Category';
import CategoriesList from '../components/customcomponents/CategoriesList';
import ProductGlassCard from '../components/customcomponents/ProductGlassCard';
import AlertModal from '../components/AlertModal';
import SuccessModal from '../components/SuccessModal';
import { addToCartProduct } from '../services/addToCartProduct';
import AddToCartOptionUiModal from '../components/AddToCartOptionUiModal';
import CustomSearchBar from './CustomSearchBar';
import CustomProductList from '../components/customcomponents/CustomProductList';

const Home = ({ navigation }) => {
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { updateCartCount } = useCartCount();
    const { Colors, EndPoint, GlobalText, SetLogin, SetAppLanguage } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [isSidebarVisible, setSidebarVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isModuleData, setModuleData] = useState();
    const [isCartAnimation, setCartAnimation] = useState(false);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const firstLoadDone = useRef(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const [isError, setError] = useState(false);
    const [isSuccessMgs, setSuccessMgs] = useState();
    const [isSuccess, setSuccess] = useState(false);
    const [loginAlertErrorMgs, setLoginAlertErrorMgs] = useState(null);
    const [loginAlertErrorModal, setLoginAlertErrorModal] = useState(false);
    const [isAddToCartModalVisible, setAddToCartModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeSeachingScreen, setActiveSeachingScreen] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const products = [
        {
            id: 1,
            category: "Accessories",
            title: "Nyc USB Type C Cable 4 A 1 m 5V-2A or 9V-2A or 11V-4A Max",
            price: 5,
            image: require("../assets/images/cable.png"),
        },
        {
            id: 2,
            category: "Laptop",
            title: "Apple MacBook Air Apple M4 - (16 GB/256 GB SSD/macOS Sequoia)",
            price: 100,
            image: require("../assets/images/mac.png"),
        },
    ];

    // useFocusEffect(
    //     useCallback(() => {
    //         fetchHomeModuleData();
    //     }, [navigation, language, currency]))

    const onChangeLanguage = async (language) => {
        console.log("onChangeLanguage function calls")
        SetAppLanguage(language?.code);
        await _storeData('SELECT_LANG', language);
    }



    useEffect(() => {
        onChangeLanguage();
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchHomeModuleData();
        }, [navigation]))

    useEffect(() => {
        checkAutoLogin();
    }, [navigation])


    const fetchHomeModuleData = async () => {
        try {
            if (!firstLoadDone.current) {
                setLoading(true);
            }
            const data = await getModuleData('home', 'content_top', EndPoint?.layout);
            console.log("fetchHomeModuleData", data?.modules)
            console.log("products on home screen", data?.modules?.products)
            setModuleData(data?.modules);
        } catch (error) {
            console.log("error_home:", error.response.data);
        } finally {
            firstLoadDone.current = true;
            setLoading(false);
        }
    };

    const handleOnChangeLang = (value) => {
        changeLanguage(value)
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);
    }

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const onClickLogout = async () => {
        Alert.alert(
            GlobalText?.extrafield_logout,
            GlobalText?.extrafield_doyouwantlogout,
            [
                { text: GlobalText?.extrafield_cancelbtn, onPress: () => console.log('cancel pressed!') },
                { text: GlobalText?.extrafield_okbtn, onPress: () => onClickOkButton() }
            ]
        );
    }

    const onClickOkButton = async () => {
        await logout(EndPoint?.logout);
        await _clearData('USER');
        SetLogin(false);
        const cartresponse = await getCartItem(EndPoint?.cart_total);
        updateCartCount(cartresponse?.cartproductcount);
        navigation.navigate('Login');
    }

    const onClickLogin = () => {
        navigation.navigate('Login');
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

    const onClickBuyBtn = async (productId) => {
        try {
            setLoading(true);
            const response = await addToCartProduct(
                productId,
                isQtySize,
                EndPoint?.cart_add
            );
            if (response?.success) {
                console.log("onClickBuyBtn function works on home btn!")
                updateCartCount(response?.cartproductcount);
                navigation.navigate("ShoppingBag");
            }
        } catch (error) {
            if (error.response.data?.error?.quantity) {
                setErrorMgs(error.response.data?.error?.quantity);
                setErrorModal(true);
            } else {
                setErrorMgs("Please select all options!");
                setErrorModal(true);
            }

        } finally {
            setLoading(false);
        }
    };

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

    const Header = () => (
        <View style={{ marginTop: Platform.OS === "ios" ? 20 : 0 }}>
            <Pressable style={{ width: Platform.OS === "ios" ? '100%' : "100%", paddingHorizontal: Platform.OS === "ios" ? 5 : 20 }}>
                <PromoCard onSearchPress={toggleSearch} />
            </Pressable>

            {
                isModuleData?.length > 0 ? (
                    isModuleData?.map((item, index) => {
                        if (item?.type === 'categorystory') {
                            return (
                                <View style={{ marginTop: 20, }} key={index}>
                                    <CategoriesList categories={item?.data} />
                                </View>

                            )
                        }
                        if (item?.type === "products") {
                            return (
                                <View key={index} style={{ width: '100%', padding:'auto', flexDirection:'row', flexWrap:'wrap', gap:12, marginHorizontal:12}}>
                                    {
                                        item?.data?.length && (
                                            item?.data?.map((item, index) => (
                                                <ProductGlassCard
                                                    key={index}
                                                    item={item}
                                                />
                                            ))
                                        )
                                    }

                                </View>
                            )
                        }
                    }
                    )
                ) : null

            }
        </View>
    )



    return (

        <>

            <BackgroundWrapper>



                {loading ? (
                    <CustomActivity />
                ) : (
                    <View style={{ paddingHorizontal: 12 }}>
                        <CustomProductList header={
                            <Header />
                        } />

                    </View>)}

            </BackgroundWrapper>

            <FailedModal
                isSuccessMessage={isErrorMgs}
                handleCloseModal={() => { setError(false); setErrorMgs() }}
                isModal={isError}
                onClickClose={() => { setError(false); setErrorMgs() }}
            />

            <SuccessModal
                isSuccessMessage={isSuccessMgs}
                isModal={isSuccess}
                onClickClose={() => onClickOkButton()}
                handleCloseModal={() => onClickOkButton()}
            />

            {/* warning */}
            <AlertModal
                isModal={loginAlertErrorModal}
                handleCloseModal={() => { setLoginAlertErrorModal(false); setLoginAlertErrorMgs(null); navigation.navigate('Home'); }}
                isSuccessMessage={loginAlertErrorMgs}
                onClickClose={() => { setLoginAlertErrorModal(false); setLoginAlertErrorMgs(null); navigation.navigate('Home'); }}
            />

            <AddToCartOptionUiModal
                isModalVisibal={isAddToCartModalVisible}
                closeModal={() => setAddToCartModalVisible(false)}
                items={selectedItem}
                productId={selectedItem?.product_id}
            />



        </>

    )

}

export default Home;


