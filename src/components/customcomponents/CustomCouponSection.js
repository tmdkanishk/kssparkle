import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet } from 'react-native'
import React, { memo, useState } from 'react'
import GlassContainer from './GlassContainer'
import { IconComponentDownArrow, IconComponentUpArrow } from '../../constants/IconComponents'

// http://192.168.0.135/customclient/2025/oct/sparkleksa/index.php?route=extension/restapi/coupon
// http://192.168.0.135/customclient/2025/oct/sparkleksa/index.php?route=extension/restapi/coupon/allcoupons

const CustomCouponSection = ({ title, placeholderText, error, success, onClickApply, coupons = [], heading, isValidText }) => {
    const [show, setShow] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    console.log("success", success)
    return (
        <View>
            {/* <GlassContainer>
                <Pressable onPress={() => setShow(!show)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>Use Coupon Code</Text>
                    {show ? <IconComponentUpArrow color={'#fff'} /> : <IconComponentDownArrow color={'#fff'} />}
                </Pressable>

            </GlassContainer> */}
         <View>
                {/* <Text style={styles.text}>Enter your coupon here</Text>
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
                </GlassContainer> */}

                {coupons?.length > 0 && (
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ color: '#fff', marginBottom: 8 }}>
                           {heading}
                        </Text>

                        {coupons.map((item) => (
                            <GlassContainer padding={10}>
                            <TouchableOpacity
                                key={item.coupon_id}
                                onPress={() => onClickApply(item.code)}
                                style={{
                                    // padding: 10,
                                    // borderWidth: 1,
                                    // borderColor: 'rgba(255,255,255,0.3)',
                                    // borderRadius: 8,
                                    // marginBottom: 8
                                }}
                            >
                                <Text style={{ color: '#fff', fontWeight: 'bold' }}>
                                    {item.code}
                                </Text>

                                <Text style={{ color: '#fff', fontSize: 12 }}>
                                    {item.name}
                                </Text>

                                <Text style={{ color: '#0f0', fontSize: 12 }}>
                                    {item.type === 'P'
                                        ? `${item.discount}% OFF`
                                        : `₹${item.discount} OFF`}
                                </Text>

                                <Text style={{ color: '#fff', fontSize: 11 }}>
                                    {isValidText}: {item.date_end}
                                </Text>
                            </TouchableOpacity>
                            </GlassContainer>
                        ))}
                    </View>
                )}

                {
                    success && <Text style={styles.successText}>{success}</Text>
                }


                {
                    error && <Text style={styles.errorText}>{error}</Text>
                }
            </View>
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
        color: '#0f0'
    }

})

export default memo(CustomCouponSection);