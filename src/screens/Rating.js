import { View, Text, SafeAreaView, ScrollView, Platform, ActivityIndicator, Image, useWindowDimensions, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import commonStyles from '../constants/CommonStyles';
import TitleBarName from '../components/TitleBarName';
import RatingCard from '../components/RatingCard';
import { getRatedProduct } from '../services/getRatedProduct';
import CustomActivity from '../components/CustomActivity';
import CustomButton from '../components/CustomButton';
import { checkAutoLogin } from '../utils/helpers';
import NotificationAlert from '../components/NotificationAlert';
import { FlatList } from 'react-native-gesture-handler';
import BottomBar from '../components/BottomBar';

const Rating = ({ navigation }) => {
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState();
    const [isRatedProduct, setRatedProduct] = useState([]);

    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMoreData, setHasMoreData] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        checkAutoLogin();
        fetchRatingList();
    }, [page]);


    const fetchRatingList = async () => {
        try {
            if (page == 1) {
                setLoading(true);
            }

            setLoadingMore(true);
            const result = await getRatedProduct(page, EndPoint?.productdetails_ReviewRateinglist);
            console.log("rating", result);
            setLabel(result);
            setRatedProduct((prevData) => [...prevData, ...result?.products]);

            if (page >= result?.pages) {
                setHasMoreData(false);
            }

        } catch (error) {
            alert(GlobalText?.extrafield_somethingwrong);
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
        <RatingCard
            image={item?.image}
            productName={item?.name}
            productReview={item?.name}
            totalRate={5}
            productRate={item?.rating}
        />
    )
    const renderFooter = () => {
        if (!loadingMore) return null;
        return <ActivityIndicator size="large" color={Colors.primary} />;
    };
    const renderHeader = () => (
        <View style={{ marginTop: 20 }}>
            <Text style={commonStyles.heading}>{isLabel?.allratingheading}</Text>
        </View>
    )

    const renderEmptyList = () => (
        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 200, height: 400, alignSelf: 'center' }}>
                <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
            </View>
        </View>
    )





    return (
        <>

            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={commonStyles.bodyConatiner}>
                            <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.ratingpagename} />

                            <FlatList
                                key={isLandscape}
                                data={isRatedProduct}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => index?.toString()}
                                onEndReached={handleLoadMore}
                                onEndReachedThreshold={0.5}
                                ListHeaderComponent={renderHeader}
                                ListFooterComponent={renderFooter}
                                ListEmptyComponent={renderEmptyList}
                                showsVerticalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 150 }}

                            />

                        </View>
                        <BottomBar />
                        <NotificationAlert />
                    </>)
            }

        </>

    )
}

export default Rating