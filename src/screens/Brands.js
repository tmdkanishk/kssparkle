import { View, Text, SafeAreaView, Platform, FlatList, Alert, useWindowDimensions, Animated } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import BrandCardList from '../components/BrandCardList';
import BottomBar from '../components/BottomBar';
import NotificationAlert from '../components/NotificationAlert';
import commonStyles from '../constants/CommonStyles';
import Searchbar from '../components/Searchbar';
import TopStatusBar from '../components/TopStatusBar';
import { _clearData, _retrieveData } from '../utils/storage';
import { logout } from '../services/logout';
import Cart from '../components/Cart';
import { getAllBrands } from '../services/getAllBrands';
import CustomActivity from '../components/CustomActivity';
import { useFocusEffect } from '@react-navigation/native';
import { checkAutoLogin } from '../utils/helpers';
import SearchBarSection from '../components/SearchBarSection';
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext';

const Brands = ({ navigation }) => {
  const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const [loading, setLoading] = useState(false);
  const [isBrandList, setBrandList] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    checkAutoLogin();
    fetchAllBrands();
  }, [language, currency])


  const fetchAllBrands = async () => {
    try {
      setLoading(true);
      const response = await getAllBrands(EndPoint?.manufacturer);
      setBrandList(response?.manufacturers);
      console.log("response :", response);
    } catch (error) {
      console.log("error :", error.response.data);
    } finally {
      setLoading(false);
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

  const renderItem = ({ item }) => (
    <View style={{ paddingHorizontal: 12, gap: 10 }}>
      <Text style={{ fontWeight: '600', fontSize: 20 }}>{item.headingName}</Text>
      <BrandCardList data={item?.data} />
    </View>
  )

  return (

    loading ? (
      <CustomActivity />
    ) : <>
      <View style={[commonStyles.bodyConatiner]}>
        <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
          <TopStatusBar scrollY={scrollY} onChangeCurren={handleOnChangeCurrency} onChangeLang={handleOnChangeLang} />
        </View>
        <SearchBarSection onClickSearch={(query) => handleSearch(query)} />
        <View style={{ paddingHorizontal: 12 }}>
          <Animated.FlatList
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { y: scrollY } } }],
              { useNativeDriver: false }
            )}
            key={isLandscape}
            data={isBrandList}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingBottom: 250 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={<Text style={[commonStyles.heading, { marginTop: 12 }]}>{GlobalText?.extrafield_brand_label}</Text>}
          />

        </View>
      </View>
      <BottomBar tab={3} />
      <NotificationAlert />
    </>


  )
}

export default Brands