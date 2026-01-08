import { View, Text, SafeAreaView, Platform, ScrollView, Alert, Image, FlatList, ActivityIndicator, useWindowDimensions, Pressable, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import TopStatusBar from '../components/TopStatusBar';
import TitleBarSearchComponent from '../components/TitleBarSearchComponent';
import commonStyles from '../constants/CommonStyles';
import BottomBar from '../components/BottomBar';
import Cart from '../components/Cart';
import { addCompareProduct } from '../services/addCompareProduct';
import { addWishlistProduct } from '../services/addWishlistProduct';
import { removeWishlistProduct } from '../services/removeWishlistProduct';
import { useFocusEffect } from '@react-navigation/native';
import { checkAutoLogin, truncateString } from '../utils/helpers';
import ProductCard from '../components/ProductCard';
import { addToCartWithOptions } from '../services/addToCartWithOptions';
import { addToCartProduct } from '../services/addToCartProduct';
import SuccessModal from '../components/SuccessModal';
import AddToCartOptionUiModal from '../components/AddToCartOptionUiModal';
import FailedModal from '../components/FailedModal';
import { addToCartWithOptionCopy } from '../services/addToCartWithOptionCopy';
import { getBrandsProduct } from '../services/getBrandsProduct';
import CustomActivity from '../components/CustomActivity';
import { _retrieveData } from '../utils/storage';
import SearchBarSection from '../components/SearchBarSection';
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext';
import { getSortsFilterList } from '../services/getSortsFilterList';
import { IconComponentCaretdown, IconComponentCaretup } from '../constants/IconComponents';


const Products = ({ navigation, route }) => {
  const { id, titleName } = route.params;
  const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [loading, setLoading] = useState(false);
  const [isLogin, setLogin] = useState(false);
  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorMgs, setErrorMgs] = useState();
  const [data, setData] = useState([]);

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);
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
      checkUserLogin();
      fetchBrandProducts();
    }, [language, currency, page]))


  const fetchBrandProducts = async () => {
    try {
      setLoadingMore(true);
      const response = await getBrandsProduct(id, page, isSort?.sort, isSort?.order, EndPoint?.manufacturer_info);
      setData((prevData) => {
        const existingIds = new Set(prevData.map(item => item?.product_id));
        const newProducts = response?.products?.filter(product => !existingIds.has(product?.product_id));
        if (newProducts?.length == 0) {
          setLoadingMore(false);
          return prevData;
        }
        return [...prevData, ...newProducts];
      });

      if (page >= response?.pages) {
        setHasMoreData(false);
      }
    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoadingMore(false);
    }
  }

  const handleOnChangeLang = (value) => {
    changeLanguage(value);
    setData([]);
    setPage(1);
    setHasMoreData(true)
  }

  const handleOnChangeCurrency = (value) => {
    changeCurrency(value);
    setData([]);
    setPage(1);
    setHasMoreData(true)
  }

  const checkUserLogin = async () => {
    const data = await _retrieveData("USER");
    if (data != null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };

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

  const fetchSortsItems = async () => {
    try {
      const result = await getSortsFilterList(EndPoint?.sorts);
      setSortsFilter(result?.sorts);
    } catch (error) {
      console.log("error", error.response.data);
    }
  }

  const onSortingProduct = (sortingType) => {
    if (isSort?.text === sortingType?.text) {
      setSort(null);
    } else {
      setSort(sortingType);
    }
  }

  const renderItem = ({ item }) => (
    <ProductCard
      ContainerWidth={isLandscape ? '24%' : '48%'}
      itemdetail={item}
    />
  )

  const renderFooter = () => {
    if (!hasMoreData) return null;
    return <CustomActivity />;
  };

  const renderEmptyList = () => (
    <Image source={require('../assets/images/notfound.png')} style={{ width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center' }} />
  )

  if (loading) {
    return (
      <CustomActivity />
    );
  }

  const renderHeader = () => (
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[commonStyles.heading, { marginTop: 12 }]}>{titleName}</Text>
        <Pressable disabled={data?.length == 0} onPress={() => setShowSort(!showSort)} style={{ borderWidth: 1, gap: 10, flexDirection: 'row', alignItems: 'center', padding: 10, borderRadius: 10, marginTop: 10, borderColor: Colors.gray, opacity: data?.length == 0 ? 0.5 : 1 }}>
          <Text>{GlobalText?.sortby}</Text>
          {showSort ? <IconComponentCaretup size={18} /> : <IconComponentCaretdown size={18} />}
        </Pressable>
      </View>

      {showSort && <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.gray, padding: 10, marginTop: 10 }}>
        <Text style={{ fontSize: 20, fontWeight: '600' }}>{GlobalText?.sortby}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginVertical: 12, width: '100%', flexWrap: 'wrap' }}>
          {sortsFilter?.map((item, index) => (
            <Pressable onPress={() => { setData([]); setPage(() => 0); setHasMoreData(true); setShowSort(!showSort); onSortingProduct(item); }} key={index} style={{ borderWidth: 1, padding: 6, borderRadius: 6, borderColor: Colors.gray, backgroundColor: isSort?.text == item?.text ? Colors.primary : Colors.white }}>
              <Text style={{ color: isSort?.text == item?.text ? Colors.white : Colors.black, fontWeight: '400', fontSize: 14 }}>{item?.text}</Text>
            </Pressable>))
          }
        </View>
      </View>}
    </View>

  );

  return (
    <>
      <View style={commonStyles.bodyConatiner}>
        <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
          <TopStatusBar scrollY={scrollY} onChangeLang={handleOnChangeLang} onChangeCurren={handleOnChangeCurrency} isLogin={isLogin} />
        </View>
        <SearchBarSection onClickSearch={(query) => handleSearch(query)} />

        <View style={{ paddingHorizontal: 12 }}>
          <Animated.FlatList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            data={data}
            renderItem={renderItem}
            numColumns={isLandscape ? 4 : 2}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 200, gap: 10 }}
            columnWrapperStyle={{
              justifyContent: isLandscape ? 'flex-start' : 'space-between',
              paddingHorizontal: 8,
              gap: isLandscape ? 12 : 0
            }}
            ListHeaderComponent={renderHeader}
            ListFooterComponent={renderFooter}
            ListEmptyComponent={!loadingMore && !hasMoreData && renderEmptyList}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            key={isLandscape}
          />
        </View>

      </View>
      <BottomBar />

      <FailedModal
        isModal={isErrorModal}
        isSuccessMessage={isErrorMgs}
        handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
        onClickClose={() => { setErrorModal(false); setErrorMgs() }}
      />

    </ >
  )
}

export default Products