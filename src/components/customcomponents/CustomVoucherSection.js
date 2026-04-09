import { View, Text, TextInput, Pressable, TouchableOpacity, StyleSheet, I18nManager } from 'react-native'
import React, { memo, useState } from 'react'
import GlassContainer from './GlassContainer'
import { IconComponentDownArrow, IconComponentUpArrow } from '../../constants/IconComponents'

const CustomVoucherSection = ({ title, placeholderText, error, success, onVoucherApply, voucherHeading, voucherInputHeading, voucherApplyButtonLabel }) => {
    const [show, setShow] = useState(false);
    const [voucherCode, setVoucherCode] = useState('');
    return (
        <View>
            <GlassContainer>
                <Pressable onPress={() => setShow(!show)} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#fff' }}>{voucherHeading}</Text>
                    {show ? <IconComponentUpArrow color={'#fff'} /> : <IconComponentDownArrow color={'#fff'} />}
                </Pressable>

            </GlassContainer>
            {show && <View>
                <Text style={styles.text}>{voucherInputHeading}</Text>
                <GlassContainer padding={6}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }}>
                        <TextInput
                            style={styles.textInput}
                            // placeholder='certificate code'
                            placeholderTextColor={'#fff'}
                            onChange={(text) =>{ setVoucherCode(text);}}
                            value={voucherCode}
                            textAlign={I18nManager.isRTL ? 'right' : 'left'}
                            
                        />
                        <TouchableOpacity onPress={() => onVoucherApply(voucherCode)} style={{ padding: 10, borderWidth: 1, borderRadius: 10, alignItems: 'center', borderColor: 'rgba(255,255,255,0.8)', }}>
                            <Text style={styles.text}>{voucherApplyButtonLabel}</Text>
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
        paddingStart: 20,
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

export default memo(CustomVoucherSection);