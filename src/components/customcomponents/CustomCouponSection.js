import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import React, { memo, useState } from 'react'
import GlassContainer from './GlassContainer'
import { IconComponentDownArrow, IconComponentUpArrow } from '../../constants/IconComponents'

const CustomCouponSection = ({ title, placeholderText, error, success, onClickApply }) => {
    const [show, setShow] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    return (
        <View>
            <GlassContainer>
                <Pressable onPress={() => setShow(!show)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>Use Coupon Code</Text>
                    {show ? <IconComponentUpArrow color={'#fff'} /> : <IconComponentDownArrow color={'#fff'} />}
                </Pressable>

            </GlassContainer>
            {show && <View>
                <Text style={styles.text}>Enter your coupon here</Text>
                <GlassContainer padding={6}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <TextInput
                            style={styles.textInput}
                            placeholder='Enter your coupon here'
                            placeholderTextColor={'#fff'}
                            value={couponCode}
                            onChangeText={(text) => { setCouponCode(text); }}
                        />
                        <TouchableOpacity onPress={() => onClickApply(couponCode)} style={{ padding: 10, borderWidth: 1, borderRadius: 10, alignItems: 'center', borderColor: 'rgba(255,255,255,0.8)' }}>
                            <Text style={styles.text}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </GlassContainer>

                {
                    success && <Text style={styles.successText}>{success}</Text>
                }


                {
                    error && <Text style={styles.errorText}>{error}</Text>
                }
            </View>}
        </View>
    )
}


const styles = StyleSheet.create({
    textInput: {
        color: '#fff',
        width: '70%',
    },
    text: {
        color: '#fff'
    },
    errorText: {
        color: 'red'
    },
    successText: {
        color: 'green'
    }

})

export default memo(CustomCouponSection);