import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Share, Alert, Platform, ActivityIndicator, FlatList, Image, useWindowDimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity'
import { useCustomContext } from '../hooks/CustomeContext';
import TitleBarName from '../components/TitleBarName';
import commonStyles from '../constants/CommonStyles';
import { IconComponentDownload } from '../constants/IconComponents';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';
import axios, { HttpStatusCode } from 'axios';
import { checkAutoLogin, openInChrome } from '../utils/helpers';
import NotificationAlert from '../components/NotificationAlert';
import BottomBar from '../components/BottomBar';


const Download = ({ navigation }) => {
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [loading, setLoading] = useState(false);
  const [isLabel, setLabel] = useState();
  const [isDownloadFile, setDownloadFile] = useState([]);
  const [isDownloadEmptyMessage, setDownloadEmptyMessage] = useState();

  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    checkAutoLogin();
    fetchDownloadText();
  }, [page]);

  const fetchDownloadText = async () => {
    try {
      if (page == 1) {
        setLoading(true)
      }

      setLoadingMore(true);

      const url = `${BASE_URL}${EndPoint?.download}`;
      const lang = await _retrieveData('SELECT_LANG');
      const cur = await _retrieveData('SELECT_CURRENCY');
      const user = await _retrieveData('USER');
      const sessionId = await _retrieveData('SESSION_ID');

      if (!user) {
        return navigation.replace('Login');
      }

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Key: API_KEY,
      };

      const body = {
        code: lang?.code,
        currency: cur?.code,
        customer_id: user[0]?.customer_id,
        sessionid: sessionId,
        page: page
      }

      const response = await axios.post(url, body, { headers: headers });

      if (response.status == HttpStatusCode.Ok) {
        console.log("pages", response?.data?.pages);
        setLabel(response.data?.text);
        setDownloadEmptyMessage(response.data?.emptydownload);
        setDownloadFile((prevData) => [...prevData, ...response.data?.downloads]);

        if (response.data?.downloads?.length == 0 || page >= response?.data?.pages) {
          setHasMoreData(false);
        }
      }

    } catch (error) {
      console.log('error log', error.message);
    } finally {
      setLoading(false)
      setLoadingMore(false);
    }
  }

  const onClickDownload = async (url) => {
    openInChrome(url);
    console.log(url);
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        padding: 12,
        borderColor: Colors.gray,
        borderRadius: 10
      }}>
      <View style={{ width: '80%', gap: 8 }}>
        <Text style={commonStyles.text_lg}>{isLabel?.dwnlodpagedate_label} : {item?.date_added}</Text>
        <View>
          <Text style={commonStyles.text_lg}>{isLabel?.dwnlodpagefilename_label} : {item?.name?.length > 12 ? item?.name.slice(0, 12) + '...' : item?.name}</Text>
          <Text style={commonStyles.text_lg}>{isLabel?.dwnlodpageorderid_label} : {item?.order_id}</Text>
          <Text style={commonStyles.text_lg}>{isLabel?.dwnlodpagesize_label} : {item?.size}</Text>
        </View>

      </View>

      <TouchableOpacity onPress={() => onClickDownload(item?.url)} style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
        <IconComponentDownload size={32} />
      </TouchableOpacity>

    </View>
  )

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <ActivityIndicator size="large" color={Colors.primary} />;
  };

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };


  return (
    <>
      {
        loading ? (
          <CustomActivity />
        ) : (

          <>
            <View style={commonStyles.bodyConatiner}>
              <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.dwnlodpagename_label} />

              <FlatList
                key={isLandscape}
                data={isDownloadFile}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 150, gap: 12 }}
                ListHeaderComponent={<View style={{ marginTop: 20 }}>
                  <Text style={commonStyles.heading}>{isLabel?.acntdwnld_heading}</Text>
                </View>}
                ListEmptyComponent={

                  <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 200, height: 200, alignSelf: 'center' }}>
                      <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
                    </View>
                    <Text style={commonStyles.text_lg}>{isDownloadEmptyMessage}</Text>
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

export default Download