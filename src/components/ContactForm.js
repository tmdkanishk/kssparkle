import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import InputBox from './InputBox'
import CustomButton from './CustomButton'
import { useCustomContext } from '../hooks/CustomeContext'

const ContactForm = ({ text, onsubmit, setName, setEmail, setEnquiry, name, email, enquiry, nameError, emailError, enquiryError, setNameError, setEmailError, setEnquiryError }) => {
    const { Colors } = useCustomContext();
    return (

        <View style={{ borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 5, paddingHorizontal: 12, gap: 18, paddingVertical: 12 }}>

            <View style={{ borderBottomWidth: 1, borderColor: Colors.lightGray, paddingBottom: 12, gap: 8 }}>
                <Text style={commonStyles.heading}>{text?.contactformheading}</Text>
                <Text style={commonStyles.text}>{text?.contactqustnandfedback}</Text>
            </View>

            <InputBox
                inputStyle={{ w: '100%', h: 50, ph: 12 }}
                label={text?.contactformnamelabel}
                placeholder={text?.contactformnamelabel}
                onChangeText={(text) => { setName(text); setNameError(null) }}
                isRequired={true}
                textVlaue={name}
                borderColor={nameError ? 'red' : null}
                ErrorMessage={nameError}
            />
            <InputBox
                inputStyle={{ w: '100%', h: 50, ph: 12 }}
                label={text?.contactformemaillabel}
                placeholder={text?.contactformemaillabel}
                onChangeText={(text) => { setEmail(text); setEmailError(null) }}
                isRequired={true}
                textVlaue={email}
                borderColor={emailError ? 'red' : null}
                ErrorMessage={emailError}
            />
            <InputBox
                inputStyle={{ w: '100%', h: 100, ph: 12 }}
                label={text?.contactformenquirylabel}
                placeholder={text?.contactformenquirylabel}
                inputTextAlignVertical={'top'}
                inputPaddingTop={12}
                onChangeText={(text) => { setEnquiry(text); setEnquiryError(null) }}
                isRequired={true}
                textVlaue={enquiry}
                borderColor={enquiryError ? 'red' : null}
                ErrorMessage={enquiryError}
            />
            <CustomButton
                buttonStyle={{ w: '100%', h: 50, backgroundColor: Colors.primary }}
                buttonText={text?.contactformsubmitbtn}
                OnClickButton={() => onsubmit()}
            />

        </View>


    )
}

export default ContactForm