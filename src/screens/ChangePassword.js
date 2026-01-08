import { View, Text, SafeAreaView, ScrollView, Platform, } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomActivity from '../components/CustomActivity'
import { useCustomContext } from '../hooks/CustomeContext';
import TitleBarName from '../components/TitleBarName';
import commonStyles from '../constants/CommonStyles';
import { IconComponentEyes, IconComponentEyesLine } from '../constants/IconComponents';
import InputBox from '../components/InputBox';
import CustomButton from '../components/CustomButton';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData } from '../utils/storage';
import axios, { HttpStatusCode } from 'axios';
import { CommonActions } from '@react-navigation/native';
import FailedModal from '../components/FailedModal';
import SuccessModal from '../components/SuccessModal';
import { checkAutoLogin } from '../utils/helpers';
import NotificationAlert from '../components/NotificationAlert';


const ChangePassword = ({ navigation }) => {
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const openEyesIcon = <IconComponentEyes color={Colors.iconColor} />;
  const closeEyesIcon = <IconComponentEyesLine color={Colors.iconColor} />;
  const [loading, setLoading] = useState(false);
  const [isLabel, setLabel] = useState(false);
  const [isShowNewPassword, setShowNewPassword] = useState(true);
  const [isShowConfirmPassword, setShowConfirmPassword] = useState(true);
  const [isNewPassword, setNewPassword] = useState();
  const [isConfirmPassword, setConfirmPassword] = useState();
  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorMgs, setErrorMgs] = useState();
  const [isSuccessModal, setSuccessModal] = useState(false);
  const [isSuccessMgs, setSuccessMgs] = useState();
  const [passwordError, setPasswordError] = useState(null);
  const [cPasswordError, setCPasswordError] = useState(null);
  const [screenLoading, setScreenLoading] = useState(false);


  useEffect(() => {
    checkAutoLogin();
    fetchChangePasswordText();
  }, [])

  const fetchChangePasswordText = async () => {
    try {
      setLoading(true);
      const url = `${BASE_URL}${EndPoint?.password}`;
      const lang = await _retrieveData('SELECT_LANG');
      const cur = await _retrieveData('SELECT_CURRENCY');
      const user = await _retrieveData('USER');
      const sessionId = await _retrieveData('SESSION_ID');

      const headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
        Key: API_KEY,
      };
      const body = {
        code: lang?.code,
        currency: cur?.code,
        sessionid: sessionId,
        customer_id: user ? user[0]?.customer_id : null
      }
      const response = await axios.post(url, body, { headers: headers });
      if (response.status == HttpStatusCode.Ok) {
        setLabel(response.data?.text);
      }

    } catch (error) {
      console.log('error log', error.response.data);
    } finally {
      setLoading(false);
    }
  }

  const onClickSubmit = async () => {
    try {
      setScreenLoading(true);
      const url = `${BASE_URL}${EndPoint?.password_passwordValidation}`;
      const lang = await _retrieveData('SELECT_LANG');
      const cur = await _retrieveData('SELECT_CURRENCY');
      const user = await _retrieveData('USER');

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
        password: isNewPassword,
        confirm: isConfirmPassword,
        email: user[0]?.email
      }
      const response = await axios.post(url, body, { headers: headers });
      if (response.status == HttpStatusCode.Ok) {
        setSuccessMgs(response.data?.success?.message);
        setSuccessModal(true);
      }
    } catch (error) {
      console.log(error?.response.data);
      if (error.response.data?.error) {
        if (error?.response.data?.error?.password) {
          setPasswordError(error?.response.data?.error?.password)
        } else {
          setPasswordError(null);
        }

        if (error.response.data?.error?.confirm) {
          setCPasswordError(error?.response.data?.error?.confirm);
        } else {
          setCPasswordError(null);
        }

      } else {
        setErrorMgs(GlobalText?.extrafield_somethingwrong);
        setErrorModal(true);
      }

    } finally {
      setScreenLoading(false)
    }
  }

  const onClickSuccessModalOk = () => {
    setSuccessMgs();
    setSuccessModal(false);
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      })
    )
  }

  return (
    <>
      {
        loading ? (
          <CustomActivity />
        ) : (
          <>
            <View style={commonStyles.bodyConatiner}>
              <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.chngpsw_heading} />
              <ScrollView showsVerticalScrollIndicator={false} style={{ opacity: screenLoading ? 0.5 : 1 }}>
                <View style={{ paddingHorizontal: 12, marginBottom: 50 }}>
                  <View style={{ marginTop: 20 }}>
                    <Text style={commonStyles.heading}>{isLabel?.chngpsw_heading}</Text>
                  </View>
                  <View style={{ gap: 24, marginTop: 50 }}>

                    <InputBox
                      onChangeText={(text) => { setNewPassword(text); setPasswordError(null) }}
                      label={`${isLabel?.chngpswpsw_label} *`}
                      placeholder={isLabel?.chngpswpsw_label}
                      inputStyle={{ w: '100%', h: 50, ph: 20 }}
                      openEyesIcon={openEyesIcon}
                      closeEyesIcon={closeEyesIcon}
                      InputType={'Password'}
                      onClickEyesIcon={() => setShowNewPassword(!isShowNewPassword)}
                      isShow={isShowNewPassword}
                      textVlaue={isNewPassword}
                      isRequired={true}
                      borderColor={passwordError ? 'red' : null}
                      ErrorMessage={passwordError}
                    />

                    <InputBox
                      onChangeText={(text) => { setConfirmPassword(text); setCPasswordError(null) }}
                      label={`${isLabel?.chngpswpswconfirm_label} *`}
                      placeholder={isLabel?.chngpswpswconfirm_label}
                      inputStyle={{ w: '100%', h: 50, ph: 20 }}
                      openEyesIcon={openEyesIcon}
                      closeEyesIcon={closeEyesIcon}
                      InputType={'Password'}
                      onClickEyesIcon={() => setShowConfirmPassword(!isShowConfirmPassword)}
                      isShow={isShowConfirmPassword}
                      textVlaue={isConfirmPassword}
                      isRequired={true}
                      borderColor={cPasswordError ? 'red' : null}
                      ErrorMessage={cPasswordError}
                    />

                    <CustomButton btnDisabled={screenLoading} OnClickButton={onClickSubmit} buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary }} buttonText={isLabel?.chngpswcntbtn_label} />
                  </View>
                </View>
              </ScrollView>
            </View>
            <FailedModal
              isModal={isErrorModal}
              isSuccessMessage={isErrorMgs}
              onClickClose={() => { setErrorMgs(); setErrorModal(false) }}
              handleCloseModal={() => { setErrorMgs(); setErrorModal(false) }}
            />

            <SuccessModal
              isModal={isSuccessModal}
              isSuccessMessage={isSuccessMgs}
              onClickClose={() => onClickSuccessModalOk()}
              handleCloseModal={() => onClickSuccessModalOk()}
            />
            <NotificationAlert />
          </>
        )
      }

    </>
  )
}

export default ChangePassword