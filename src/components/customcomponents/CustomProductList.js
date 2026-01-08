import { View, Text, FlatList, useWindowDimensions, ActivityIndicator } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { getProductList } from '../../services/getProductList';
import ProductGlassCard from './ProductGlassCard';
import { useCustomContext } from '../../hooks/CustomeContext';
import { useNavigation } from '@react-navigation/native';

const CustomProductList = ({ header }) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);
    const [isTotalPage, setTotalPage] = useState(0);
    const [isCurretPage, setCurrentPage] = useState(1);
    const [hasMoreData, setHasMoreData] = useState(true);

    const navigation = useNavigation();
    const [isFooterLoading, setIsFooterLoading] = useState(false);


useEffect(() => {
    fetchProducts(isCurretPage);
}, [isCurretPage]);


    const fetchProducts = async (page) => {
        try {
             if (page > 1) {
            setIsFooterLoading(true); // 👈 show footer loader only for pagination
        }
            const response = await getProductList('restapi/layout/getallproducts', isCurretPage);
            console.log("response customProductList", response)
            if (response?.products?.length > 0) {
                setData((prevData) => {
                    const existingIds = new Set(prevData.map(item => item?.product_id));
                    const newProducts = response?.products?.filter(product => !existingIds.has(product?.product_id));
                    return [...prevData, ...newProducts];
                });
            }
            setTotalPage(response?.productpages);
            if (isCurretPage >= response?.productpages) {
                setHasMoreData(false);
            }
        } catch (error) {
            console.log("error:", error);
        }
        finally{
             setIsFooterLoading(false);
        }
    }


    // const handleLoadMore = async () => {
    //     console.log("handleLoadMore hitting")
    //     if (isCurretPage < isTotalPage && hasMoreData) {
    //         setCurrentPage(isCurretPage + 1);
    //         fetchProducts();
    //     }
    // }

    const handleLoadMore = () => {
    if (
        !isFooterLoading &&
        hasMoreData &&
        isCurretPage < isTotalPage
    ) {
        setCurrentPage(prev => prev + 1);
    }
};

const renderFooter = () => {
    if (!isFooterLoading) return null;

    return (
        <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator  color="#FFFFFF" size="large" />
        </View>
    );
};



  

    const renderItem = useCallback(({ item }) => (
        <ProductGlassCard
            item={item}
            onPress={(product) =>
                navigation.navigate("ProductDetail", {
                    productId: product?.product_id,
                })
            }
        />
    ))

    return (
        <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            ListHeaderComponent={header}
            key={isLandscape}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-evenly' }}
            contentContainerStyle={{ paddingBottom: 200, gap: 12 }}
            onEndReached={handleLoadMore}
            scrollEventThrottle={16}
            onEndReachedThreshold={0.2}
            bounces={false}
            ListFooterComponent={renderFooter}
        />
    )
}

export default CustomProductList