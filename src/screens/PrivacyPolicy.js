import { View, Text, ScrollView, StyleSheet, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import TopStatusBar from '../components/TopStatusBar'
import { SafeAreaView } from 'react-native-safe-area-context'
import commonStyles from '../constants/CommonStyles'
import TitleBarName from '../components/TitleBarName'
import BottomBar from '../components/BottomBar'
import { useCustomContext } from '../hooks/CustomeContext'
import { _retrieveData } from '../utils/storage'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import CustomActivity from '../components/CustomActivity'
import NotificationAlert from '../components/NotificationAlert'
import { checkAutoLogin } from '../utils/helpers'
import { useLanguageCurrency } from '../hooks/LanguageCurrencyContext'

const PrivacyPolicy = ({ navigation, route }) => {
  const { informationId } = route.params;
  const { language, currency, changeLanguage, changeCurrency } = useLanguageCurrency();
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const [loading, setLoading] = useState();
  const [isLabel, setLabel] = useState();
  const [isLogin, setLogin] = useState(false);

  useEffect(() => {
    checkAutoLogin();
    checkUserLogin();
    fetchPrivacyPolicyText();
  }, [language, currency]);

  const checkUserLogin = async () => {
    const data = await _retrieveData("USER");
    if (data != null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }

  const fetchPrivacyPolicyText = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}${EndPoint?.restapi_layout_informationdetails}`;
      const lang = await _retrieveData('SELECT_LANG');
      const cur = await _retrieveData('SELECT_CURRENCY');
      const sessionId = await _retrieveData('SESSION_ID');

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Key: API_KEY,
      };

      const body = {
        code: lang?.code,
        currency: cur?.code,
        sessionId: sessionId,
        information_id: informationId
      }

      const response = await axios.post(url, body, { headers: headers });

      if (response.status === HttpStatusCode.Ok) {
        setLabel(response.data);
      }

    } catch (error) {
      console.log('error', error.response.data);
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


  return (
    <>
      {
        loading ? <CustomActivity /> : (
          <>
            <View style={[commonStyles.bodyConatiner]}>
              <View style={{ paddingHorizontal: 12, backgroundColor: '#F5F5F5' }}>
                <TopStatusBar onChangeCurren={handleOnChangeCurrency} onChangeLang={handleOnChangeLang} />
              </View>
              <TitleBarName titleName={isLabel?.text?.privacypolicypagename_label} onClickBackIcon={() => navigation.goBack()} />
              <View style={{ paddingHorizontal: 12 }}>
                <ScrollView style={{ marginBottom: 200 }} showsVerticalScrollIndicator={false} >
                  <Text>
                    {isLabel?.description}
                  </Text>
                  <View style={{ height: 50 }}></View>
                </ScrollView>
              </View>
            </View>

            <BottomBar />
            <NotificationAlert />
          </>
        )
      }
    </>
  )
}

const styles = StyleSheet.create({
  helpfulBtn: {
    width: '48%',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#808080',
    height: 50,
    borderRadius: 8
  }
})

export default PrivacyPolicy