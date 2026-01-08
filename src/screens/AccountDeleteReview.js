import {
  View,
  Text,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableWithoutFeedback,
  useWindowDimensions
} from 'react-native';
import React, { useState } from 'react';
import { useCustomContext } from '../hooks/CustomeContext';
import {
  IconComponentCheckSquare,
  IconComponentShare,
  IconComponentSquare
} from '../constants/IconComponents';
import { deleteAccount } from '../services/deleteAccount';
import { _clearAllData, _clearData } from '../utils/storage';

const AccountDeleteReview = ({ navigation, route }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const { reasons, label } = route.params;
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const [isImprove, setIsIpmrove] = useState(null);
  const [isSelectedReasons, setSelectedReasons] = useState([]);

  const onClickDeleteAccountButton = async () => {
    try {
      const result = await deleteAccount(
        isSelectedReasons,
        isImprove,
        EndPoint?.deleteaccount_deleteandsaveinfo
      );
      console.log('result  on delete: ', result);
      // await _clearData('USER');
      // await _clearData('CART_PRODUCT_COUNT');
      await _clearAllData();

      navigation.navigate('Home');
    } catch (error) {
      console.log(error);
    }
  };

  const showAlert = () => {
    Alert.alert(
      label?.delacnterrorheading,
      label?.delacnterrorlabel,
      [
        {
          text: label?.cancelbtn,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel'
        },
        {
          text: label?.okbtn,
          onPress: () => onClickDeleteAccountButton()
        }
      ],
      { cancelable: true }
    );
  };

  const toggleSelection = (text) => {
    setSelectedReasons((prevSelected) =>
      prevSelected.includes(text)
        ? prevSelected.filter((item) => item !== text)
        : [...prevSelected, text]
    );
  };

  return (

    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // adjust as needed
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <View style={{ marginBottom: 70, }}>
            <ScrollView
              contentContainerStyle={{ paddingHorizontal: 12, paddingBottom: 100 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 20,
                  textTransform: 'capitalize'
                }}
              >
                {label?.whyleaveusheading}
              </Text>

              {reasons?.map((item, index) => (
                <TouchableOpacity
                  onPress={() => toggleSelection(item?.text)}
                  key={index}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    marginTop: 12
                  }}
                >
                  {isSelectedReasons.includes(item?.text) ? (
                    <IconComponentCheckSquare />
                  ) : (
                    <IconComponentSquare />
                  )}
                  <Text>{item?.text}</Text>
                </TouchableOpacity>
              ))}

              <View style={{ marginTop: 30, gap: 12 }}>
                <Text style={{ fontWeight: '500', fontSize: 16 }}>
                  {label?.howweimproveheading}
                </Text>

                <TextInput
                  placeholder={label?.addursgtionlabel}
                  style={{
                    borderWidth: 1,
                    padding: 10,
                    height: 150,
                    borderRadius: 10,
                    borderColor: Colors?.gray
                  }}
                  textAlignVertical="top"
                  multiline={true}
                  onChangeText={(text) => {
                    setIsIpmrove(text);
                  }}
                />
              </View>
            </ScrollView>
          </View>

          <TouchableOpacity
            disabled={isSelectedReasons.length === 0}
            onPress={showAlert}
            style={{
              position: 'absolute',
              bottom: 12,
              width: '90%',
              marginHorizontal: '5%',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors?.primary,
              height: 56,
              borderRadius: 10,
              opacity: isSelectedReasons.length !== 0 ? 1 : 0.5
            }}
          >
            <Text
              style={{
                fontSize: 16,
                fontWeight: '500',
                color: 'white',
                textTransform: 'uppercase'
              }}
            >
              {label?.deleteacntbtn}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>

  );
};

export default AccountDeleteReview;
