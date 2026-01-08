import { View, Text, ScrollView, Alert, Platform, Image, useWindowDimensions, Animated, TouchableOpacity, } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopStatusBar from '../components/TopStatusBar'
import BottomBar from '../components/BottomBar'
import commonStyles from '../constants/CommonStyles'
import SearchBarSection from '../components/SearchBarSection'
import ProductCard from '../components/ProductCard'
import BottomFilter from '../components/BottomFilter'
import BottomSortFilter from '../components/BottomSortFilter'
import BottomFilterOption from '../components/BottomFilterOption'
import { useCustomContext } from '../hooks/CustomeContext'
import { searchProductsApi } from '../services/searchProductsApi'
import CustomActivity from '../components/CustomActivity'
import { _clearData, _retrieveData } from '../utils/storage'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { getSortsFilterList } from '../services/getSortsFilterList'
import { getSortFilterProduct } from '../services/getSortFilterProduct'
import { getFilterList } from '../services/getFilterList'
import { getFilterProduct } from '../services/getFilterProduct'
import FailedModal from '../components/FailedModal'
import NotificationAlert from '../components/NotificationAlert'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'
import ProductGlassCard from '../components/customcomponents/ProductGlassCard'
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper'



const Search = ({ route }) => {
  const { query } = route.params;
  const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const bttomType = ['FilterOption', 'Sort', 'Filter']
  const [subIdSelectList, setSubIdSelectList] = useState([]);
  const [activeBottom, SetActiveBottom] = useState(bttomType[0]);
  const [loading, setLoading] = useState(false);
  const [issearchResult, setSearchResult] = useState();
  const [issearchResultText, setSearchResultText] = useState();
  const [sortsFilter, setSortsFilter] = useState();
  const [filterList, setFilterList] = useState();
  const [iSQuery, setQuery] = useState(query);
  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorMgs, setErrorMgs] = useState();
  const scrollY = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchSearchResultAndText();
      fetchSortsItems();
      fetchFilterItmes();
    }, [language, currency])
  );

  const fetchSearchResultAndText = async () => {
    try {
      setLoading(true);
      const results = await searchProductsApi(query, EndPoint?.search);
      console.log("results serach", results);
      setSearchResult(results?.products);
      setSearchResultText(results?.text);
    } catch (error) {
      console.log('error:', error.response.data);
    } finally {
      setLoading(false);
    }
  }

  const fetchSortsItems = async () => {
    try {
      setLoading(true);
      const result = await getSortsFilterList(EndPoint?.sorts);
      setSortsFilter(result?.sorts);

    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoading(false);
    }
  }

  const fetchFilterItmes = async () => {
    try {
      setLoading(true);
      const result = await getFilterList(EndPoint?.filter);
      setFilterList(result?.filterinfos);

    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoading(false);
    }
  }



  const onClickSortBtn = () => {
    SetActiveBottom(bttomType[1])
  }

  const onClickSort = async (sort, order) => {
    const result = await getSortFilterProduct(query, sort, order, EndPoint?.search);
    setSearchResult(result?.products);
    setSearchResultText(result?.text);
    SetActiveBottom(bttomType[0])
  }

  const onClickClear = (selectedList) => {
    setSubIdSelectList(selectedList);
    SetActiveBottom(bttomType[0])
  }

  const onClickFilter = () => {
    SetActiveBottom(bttomType[2])
  }

  const onClickFilterBtn = async (id) => {
    console.log("on filter id ", id);
    setSubIdSelectList(id);
    try {
      setLoading(true);
      const result = await getFilterProduct(query, id, EndPoint?.search);
      setSearchResult(result?.products);
      setSearchResultText(result?.text);
      SetActiveBottom(bttomType[0])
    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoading(false);
    }

  }

  const handleOnChangeLang = (value) => {
    changeLanguage(value)
  }

  const handleOnChangeCurrency = (value) => {
    changeCurrency(value);
  }

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      setQuery(query);
      const results = await searchProductsApi(query, EndPoint?.search);
      setSearchResult(results?.products);
      setSearchResultText(results?.text);
    } catch (error) {
      console.log('error:', error.response.data);
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
          <BackgroundWrapper>
          
            <View style={commonStyles.bodyConatiner}>
              <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                <TopStatusBar scrollY={scrollY} onChangeLang={handleOnChangeLang} onChangeCurren={handleOnChangeCurrency} />
              </View>
              <SearchBarSection onClickSearch={(query) => handleSearch(query)} query={iSQuery} />

                  <TouchableOpacity style={{ marginLeft: 25, marginBottom:10 }} onPress={() => navigation.goBack()}>
                          <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
                        </TouchableOpacity>
              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: false }
                )}
              >
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View style={{ padding: 12, marginBottom: 160, }}>

                    <View style={{ marginVertical: 12, gap: 12 }}>
                      <Text style={commonStyles.heading}>{issearchResultText?.search_label}</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: isLandscape ? 'flex-start' : 'space-between', gap: 12, }}>
                        {
                          issearchResult?.length > 0 ? (
                            issearchResult?.map((item, index) => (
                              <ProductGlassCard
                                key={index}
                                item={item}
                              />
                            ))
                          ) : <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                            <View style={{ width: 200, height: 400, alignSelf: 'center' }}>
                              <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                            </View>
                          </View>
                        }
                      </View>
                    </View>

                  </View>
                </ScrollView>
              </Animated.ScrollView>
              {
                activeBottom === bttomType[0] ? (
                  <BottomFilter onclickSort={onClickSortBtn} onClickFilter={onClickFilter} textLabel={issearchResultText} />
                ) : activeBottom === bttomType[1] ? (
                  <BottomSortFilter
                    textLabel={issearchResultText}
                    onClick={(sort, order) => onClickSort(sort, order)}
                    sortsList={sortsFilter}
                    onClickRefineBtn={() => { SetActiveBottom(bttomType[0]); fetchSearchResultAndText() }}
                  />
                ) : (
                  <BottomFilterOption
                    textLabel={issearchResultText}
                    filterList={filterList}
                    onClickClearBtn={(selectedList) => onClickClear(selectedList)}
                    selectedCheckBoxList={subIdSelectList}
                    onClickFilter={(id) => onClickFilterBtn(id)}

                  />
                )
              }

            </View>

            {/* <BottomBar /> */}

            <FailedModal
              isModal={isErrorModal}
              isSuccessMessage={isErrorMgs}
              handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
              onClickClose={() => { setErrorModal(false); setErrorMgs() }}
            />
            <NotificationAlert />
          </BackgroundWrapper>

        )
      }
    </>

  )
}

export default Search