import { View, Text, StatusBar, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import SquareIconComponent from './SquareIconComponent'
import { IconComponentCart, IconComponentFlipLeftArrow, IconComponentImage } from '../constants/IconComponents'
import { useCustomContext } from '../hooks/CustomeContext'

const OrderSummary = ({ label, data, onClickReorderBtn, onClickCancelBtn }) => {
    const { Colors } = useCustomContext();
    return (
        <View style={{ padding: 12, borderWidth: 1, borderColor: Colors?.lightGray, borderRadius: 8 }}>
            <View style={{ height: 40, }}>
                <Text style={commonStyles.smallHeading}>{label?.orderinfoordersumry_heading}</Text>
            </View>

            {
                data?.products?.length > 0 ? (
                    data?.products?.map((item, index) => (
                        <View key={index} style={{ borderTopWidth: 1, paddingVertical: 12, borderColor: Colors?.lightGray }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, }}>
                                <View style={{ width: '20%', height: 60 }}>
                                    {
                                        item?.image ? (<Image source={{ uri: item?.image }} style={{ width: '80%', height: '100%', resizeMode: 'contain' }} />) :
                                            (<IconComponentImage />)
                                    }
                                </View>

                                <View style={{ width: '80%', gap: 6 }}>
                                    <Text style={commonStyles.smallHeading}>{item?.name}</Text>
                                    <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <View style={{ gap: 5, width: '50%' }}>
                                            <Text style={commonStyles.text}>{label?.orderinfoqty_label}: </Text>
                                            <Text style={commonStyles.text}>{label?.orderinfounitprice_label}: </Text>
                                            <Text style={commonStyles.text}>{label?.orderinfototalprice_label}: </Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end', gap: 5, width: '40%' }}>
                                            <Text style={commonStyles.text}>{item?.quantity}</Text>
                                            <Text style={commonStyles.text}>{item?.price}</Text>
                                            <Text style={commonStyles.text}>{item?.total}</Text>

                                        </View>


                                    </View>

                                </View>


                            </View>
                            <View style={{ flexDirection: 'row', gap: 5, justifyContent: 'flex-end', }}>
                                <SquareIconComponent onClickIcon={() => onClickReorderBtn(item?.order_product_id)} width={40} height={40} backgroundColor={Colors.steelBlue} IconComponent={IconComponentCart} iconProps={{
                                    color: Colors.white
                                }} />
                                <SquareIconComponent onClickIcon={() => onClickCancelBtn(item?.product_id)} width={40} height={40} backgroundColor={Colors.primary} IconComponent={IconComponentFlipLeftArrow} iconProps={{
                                    color: Colors.white
                                }} />
                            </View>
                        </View>
                    ))
                ) : null
            }

        </View>
    )
}

export default OrderSummary