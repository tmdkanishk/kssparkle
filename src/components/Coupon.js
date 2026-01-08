import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import React, { useState } from 'react'
import { IconComponentDownArrow } from '../constants/IconComponents'
import commonStyles from '../constants/CommonStyles'
import DropDownHeading from './DropDownHeading'
import { useCustomContext } from '../hooks/CustomeContext'

const Coupon = ({ headingText, placeholder, btnText, onApplyDiscountCoupon, onClickIcon, isShowData, errorMessage, setErrorMessage, dissabled }) => {
    const { Colors } = useCustomContext();
    const [inputValue, setInputValue] = useState('');
    return (
        <View>
            <DropDownHeading headingText={headingText} onClickIcon={() => onClickIcon()} isShowIcon={isShowData} />
            {
                isShowData ? (
                    <View style={{ marginVertical: 21 }}>
                        <View style={{ flexDirection: 'row', height: 50, }}>
                            <View style={{ width: '65%', justifyContent: 'center' }}>
                                <TextInput style={{ paddingHorizontal: 15, borderWidth: 1, height: '100%', borderBottomLeftRadius: 8, borderTopLeftRadius: 8, borderColor: errorMessage ? Colors?.error : Colors.iconColor }}
                                    placeholder={placeholder ? placeholder : 'Enter your Coupon Here'}
                                    onChangeText={(text) => { setInputValue(text); setErrorMessage(null) }}
                                />
                            </View>
                            <TouchableOpacity disabled={dissabled} onPress={() => onApplyDiscountCoupon(inputValue)} style={{ width: '35%', height: '100%', borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderColor: Colors.primary, borderBottomRightRadius: 8, borderTopRightRadius: 8 }}>
                                <Text style={[commonStyles.textWhite_lg]}>{btnText ? btnText : 'Apply Coupon'}</Text>
                            </TouchableOpacity>
                        </View>
                        {/* error Message */}
                        {errorMessage && <Text style={{ color: Colors.error }}>{errorMessage}</Text>}
                    </View>
                ) : null
            }

        </View>
    )
}

export default Coupon