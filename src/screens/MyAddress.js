import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Modal, Alert, StyleSheet, Platform, FlatList } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import commonStyles from '../constants/CommonStyles'
import TitleBarName from '../components/TitleBarName'
import { _retrieveData } from '../utils/storage'
import { IconComponentClose, IconComponentRightArrow } from '../constants/IconComponents'
import { useCustomContext } from '../hooks/CustomeContext'
import InputBox from '../components/InputBox'
import { API_KEY, BASE_URL } from '../utils/config'
import axios, { HttpStatusCode } from 'axios'
import CustomActivity from '../components/CustomActivity'
import { Picker } from '@react-native-picker/picker';
import { checkAutoLogin } from '../utils/helpers'
import { useFocusEffect } from '@react-navigation/native'
import NotificationAlert from '../components/NotificationAlert'

const MyAddress = ({ navigation }) => {
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const [addressList, setAddressList] = useState([]);
  const [isLabel, setLabel] = useState();
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      checkAutoLogin();
      fetchMyAddressText();
    }, [])
  );

  const fetchMyAddressText = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}${EndPoint?.address}`;
      const lang = await _retrieveData('SELECT_LANG');
      const cur = await _retrieveData('SELECT_CURRENCY');
      const user = await _retrieveData("USER");

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Key: API_KEY,
      };

      const body = {
        code: lang?.code,
        currency: cur?.code,
        customer_id: user[0]?.customer_id,
      }

      const response = await axios.post(url, body, { headers: headers });
      if (response.status === HttpStatusCode.Ok) {
        console.log("while add", response.data?.response[0]?.custom_field);
        setLabel(response.data?.text);
        const sortedAddresses = [
          ...response.data?.response.filter(item => item.defaultaddrstatus === true),
          ...response.data?.response.filter(item => item.defaultaddrstatus !== true),
        ];

        setAddressList(sortedAddresses);
        console.log(response.data?.response);
      }
    } catch (error) {

    } finally {
      setLoading(false);
    }
  }
  const onClickDeleteAddress = async (addressId) => {
    try {
      setScreenLoading(true);
      const url = `${BASE_URL}${EndPoint?.address_validateAddressDelete}`;
      const lang = await _retrieveData('SELECT_LANG');
      const cur = await _retrieveData('SELECT_CURRENCY');
      const user = await _retrieveData("USER");
      const sessionId = await _retrieveData('SESSION_ID');

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Key: API_KEY,
      };

      const body = {
        code: lang?.code,
        currency: cur?.code,
        customer_id: user[0]?.customer_id,
        sessionid: sessionId,
        address_id: addressId
      }

      const response = await axios.post(url, body, { headers: headers });

      if (response.status === HttpStatusCode.Ok) {
        setAddressList(prev => prev.filter(item => item.address_id !== addressId));
      }
    } catch (error) {
      console.log("error delete address:", error.message);
    } finally {
      setScreenLoading(false);
    }

  }

  const deleteConfirmationAlert = (addressId) => {
    Alert.alert(
      GlobalText?.text_chkout_delete_address, // Title
      GlobalText?.text_chkout_doyou_delete, // Message
      [
        {
          text: GlobalText?.extrafield_cancelbtn,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: GlobalText?.extrafield_okbtn,
          onPress: () => onClickDeleteAddress(addressId),
        },
      ]
    );
  };


  return (
    <>
      {
        loading ? (
          <CustomActivity />
        ) : (
          <>
            <View style={commonStyles.bodyConatiner}>
              <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.addrsadd_heading} />
              <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
                <View style={{ paddingHorizontal: 12, marginBottom: 100 }}>
                  <View style={{ marginVertical: 20 }}>
                    <Text style={commonStyles.heading}>{isLabel?.addrsadd_heading}</Text>
                  </View>
                  <TouchableOpacity
                    disabled={screenLoading}
                    onPress={() => navigation.navigate('AddNewAddress')}
                    style={{
                      flexDirection: 'row',
                      borderWidth: 1,
                      borderColor: Colors.gray,
                      justifyContent: 'space-between', height: 50, alignItems: 'center', borderRadius: 10, paddingHorizontal: 20
                    }}>
                    <Text>{isLabel?.addrnewaddrsbtn_label}</Text>
                    <IconComponentRightArrow />
                  </TouchableOpacity>
                  <View style={{ marginVertical: 20, gap: 20 }}>

                    <Text style={commonStyles.heading}>{isLabel?.addrsprsnladdrs_label}</Text>
                    {
                      addressList?.length > 0 ? (
                        addressList.map((item, index) => (
                          <View key={index} style={{ width: '100%', borderWidth: 1, borderColor: Colors.gray, borderRadius: 10, gap: 10, padding: 12 }}>
                            {
                              item?.defaultaddrstatus ? (
                                <View style={{ borderBottomWidth: 1, height: 30, borderColor: Colors.gray }}>
                                  <Text style={commonStyles.smallHeading}>{isLabel?.addrdefaultaddr_label}</Text>
                                </View>
                              ) : null
                            }

                            <View style={{ gap: 3 }}>
                              <Text style={commonStyles.smallHeading}>{item?.firstname} {item?.lastname}</Text>
                              {item?.company && <Text>{item?.company}</Text>}
                              {item?.oib && <Text>{item?.oib}</Text>}
                              {item?.address_1 && <Text>{item?.address_1}</Text>}
                              {item?.address_2 && <Text>{item?.address_2}</Text>}
                              {(item?.city || item?.zone || item?.postcode) && <Text>{item?.city}, {item?.zone}, {item?.postcode}</Text>}
                              {item?.country && <Text>{item?.country}</Text>}
                            </View>
                            <View style={{ flexDirection: 'row', gap: 20 }}>
                              <TouchableOpacity disabled={screenLoading} onPress={() => navigation.navigate('EditAddress', { item: item })} style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}>
                                <Text>{isLabel?.addreditbtn_label}</Text>
                              </TouchableOpacity >
                              {
                                !item?.defaultaddrstatus ? (
                                  <>
                                    <TouchableOpacity disabled={screenLoading} onPress={() => deleteConfirmationAlert(item?.address_id)} style={{ borderWidth: 1, borderRadius: 10, padding: 10 }}>
                                      <Text>{isLabel?.addrdltbtn_label}</Text>
                                    </TouchableOpacity>
                                  </>
                                ) : null

                              }

                            </View>
                          </View>
                        ))
                      ) : null
                    }
                  </View>
                </View>
              </ScrollView>
            </View>
            <NotificationAlert />
          </ >
        )
      }

    </>

  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  label: {
    fontSize: 14,
    marginBottom: 10,
  },

});

export default MyAddress