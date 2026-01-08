import { View, ScrollView, Alert, Platform, ActivityIndicator, FlatList, Image, useWindowDimensions, Animated, } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BottomBar from '../components/BottomBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyles from '../constants/CommonStyles'
import TopStatusBar from '../components/TopStatusBar'
import Cart from '../components/Cart'
import TitleBarSearchComponent from '../components/TitleBarSearchComponent'
import Searchbar from '../components/Searchbar'
import CustomButton from '../components/CustomButton'
import OrderHistoryCard from '../components/OrderHistoryCard'
import { useCustomContext } from '../hooks/CustomeContext'
import { useFocusEffect } from '@react-navigation/native'
import { _clearData, _retrieveData } from '../utils/storage'
import CustomActivity from '../components/CustomActivity'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import { checkAutoLogin } from '../utils/helpers'
import { logout } from '../services/logout'
import NotificationAlert from '../components/NotificationAlert'
import { getOrderHistoryAndText } from '../services/getOrderHistoryAndText'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'


const OrderHistory = ({ navigation }) => {
    const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [isLogin, setLogin] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [orderHistoryData, setOrderHistoryData] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [page, setPage] = useState(1);
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        checkAutoLogin();
        checkUserLogin();
        fetchOrderHistoryTextAndHistory();
    }, [language, currency, page]);



    const fetchOrderHistoryTextAndHistory = async () => {
        console.log("im calling");
        try {
            if (page == 1) {
                setLoading(true);
            }
            setLoadingMore(true)
            const result = await getOrderHistoryAndText(page, EndPoint?.order_orderhistory);
            setLabel(result?.text);
            setOrderHistoryData((prevData) => {
                const existingIds = new Set(prevData.map(item => item.order_id));
                const newOrders = result?.orders?.filter(order => !existingIds.has(order.order_id));
                console.log("newOrders", newOrders);

                return [...prevData, ...newOrders];
            });

            if (page >= result?.pages) {
                setHasMoreData(false);
            }

        } catch (error) {
            console.log("error", error.response.data);
        } finally {
            setLoading(false);
            setLoadingMore(false)
        }

    }

    const handleLoadMore = () => {
        if (!loadingMore && hasMoreData) {
            setPage((prevPage) => prevPage + 1);
        }
    };

    const renderItem = ({ item }) => (
        <OrderHistoryCard
            label={isLabel}
            onclickOrderDetail={() => navigation.navigate('OrderView', { orderId: item?.order_id })}
            orderId={item?.order_id}
            customerName={item?.name}
            orderDate={item?.date_added}
            orderStatus={item?.status}
            total={item?.total}
            qty={item?.quantity}
        />
    )

    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator size="large" color={Colors?.primary} />;
    };

    const checkUserLogin = async () => {
        const data = await _retrieveData("USER");
        if (data != null) {
            setLogin(true);
        } else {
            setLogin(false);
            navigation.replace('Login');
        }
    }

    const handleOnChangeLang = (value) => {
        changeLanguage(value);
    }

    const handleOnChangeCurrency = (value) => {
        changeCurrency(value);

    }


    const handleSearch = async (query) => {
        try {
            setLoading(true);
            navigation.navigate('Search', { query: query })
        } catch (error) {
            console.log('Search results:', error.response.data);
        } finally {
            setLoading(false);
        }
    }

    const SearchbarComponent = () => {
        return (
            <Searchbar w={'100%'} h={50} onClickSearch={(query) => handleSearch(query)} />
        )
    }

    return (
        <>
            {loading ? (
                <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <CustomActivity />
                </View>

            ) : (
                <>
                    <View style={[commonStyles.bodyConatiner]}>
                        <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                            <TopStatusBar onChangeCurren={handleOnChangeCurrency} onChangeLang={handleOnChangeLang} scrollY={scrollY} />
                        </View>
                        <TitleBarSearchComponent titleName={isLabel?.orderhstrypagename_label} Component1={Cart} onClickBackIcon={() => navigation.goBack()} Component2={SearchbarComponent} />
                        <View style={{ paddingHorizontal: 12 }}>
                            <Animated.FlatList
                                onScroll={Animated.event(
                                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                    { useNativeDriver: false }
                                )}
                                key={isLandscape}
                                data={orderHistoryData}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index.toString()}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={renderFooter}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingBottom: 260, gap: 12 }}
                                ListEmptyComponent={
                                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ width: 200, height: 400, alignSelf: 'center' }}>
                                            <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                                        </View>
                                    </View>
                                }
                            />
                        </View>

                    </View>
                    <BottomBar tab={2} />
                </>

            )
            }



            <NotificationAlert />

        </>
    )
}

export default OrderHistory