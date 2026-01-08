import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator, FlatList, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity';
import TitleBarName from '../components/TitleBarName';
import commonStyles from '../constants/CommonStyles';
import { IconComponentImage } from '../constants/IconComponents';
import { useCustomContext } from '../hooks/CustomeContext';
import { getNotification } from '../services/getNotification';
import CustomButton from '../components/CustomButton';
import { checkAutoLogin } from '../utils/helpers';
import NotificationAlert from '../components/NotificationAlert';
import BottomBar from '../components/BottomBar';

const Notification = ({ navigation }) => {
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState(false);
    const [isNotification, setNotification] = useState([]);
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [page, setPage] = useState(1);

    const [isLabel, setLabel] = useState({
        pagename: '',
        loadmorebutton: ''
    });

    useEffect(() => {
        checkAutoLogin();
        fetchNotificationList();
    }, [page]);


    const fetchNotificationList = async () => {
        try {
            if (page == 1) {
                setLoading(true);
            }
            setLoadingMore(true);

            const response = await getNotification(page, EndPoint?.order_ordernotification);

            console.log("notification", response?.pages);
            setLabel({ pagename: response?.acountnotifypagename_label, loadmorebutton: response?.acountnotifyloadmorebtn_label })

            setNotification((previewItems) => [...previewItems, ...response?.notificationproducts]);

            if (response?.notificationproducts?.length > 0 || page >= response?.pages || response?.pages == null || response?.pages == 0) {
                setHasMoreData(false);
            }

        } catch (error) {
            console.log("error", error.message);
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
        <TouchableOpacity onPress={() => navigation.navigate('OrderView', { orderId: item?.order_id })} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 10, borderColor: Colors?.border_color }}>
            <View style={{ width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors?.border_color, padding: 5, borderRadius: 8 }}>
                {
                    item?.image ? (
                        <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    ) : (
                        <IconComponentImage />
                    )
                }
            </View>
            <View style={{ width: '75%', gap: 5 }}>
                <Text style={{ fontWeight: '600', fontSize: 16 }}>{item?.name}</Text>
                <Text>{item?.orderplaced}</Text>
            </View>
        </TouchableOpacity>
    )

    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator size="large" color={Colors.primary} />;
    };


    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (

                    <>
                        <View style={commonStyles.bodyConatiner}>
                            <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.pagename} />

                            <FlatList
                                key={isLandscape}
                                data={isNotification}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index?.toString()}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                ListFooterComponent={renderFooter}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 150, gap: 12 }}
                                ListEmptyComponent={
                                    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                        <View style={{ width: 200, height: 400, alignSelf: 'center' }}>
                                            <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                        <BottomBar />

                        <NotificationAlert />
                    </>
                )
            }

        </>
    )
}

export default Notification