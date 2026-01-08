import { View, Text, useWindowDimensions } from 'react-native'
import React from 'react'
import CustomButton from './CustomButton'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'


const OrderHistoryCard = ({ orderId, customerName, orderStatus, orderDate, qty, total, onclickOrderDetail, label }) => {
    const { Colors } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    return (
        <View style={{ borderWidth: 1, borderColor: Colors.lightGray, height: 'auto', borderRadius: 6 }}>
            <View style={{ padding: 10, flexDirection: 'row', borderColor: Colors.lightGray, borderBottomWidth: 1, alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                    <Text style={[commonStyles.text, { color: Colors.iconColor }]}>{label?.orderhstryorderid_label}:</Text>
                    <Text style={[commonStyles.text]}>{orderId ? orderId : '456FGHJK456'}</Text>
                </View>
                <CustomButton
                    buttonStyle={{ w: isLandscape ? '20%' : '35%', h: 40, backgroundColor: Colors.primary }}
                    buttonText={label?.orderhstryorderdetailbtn_label} btnTextStyle={commonStyles.textwhite}
                    OnClickButton={onclickOrderDetail}
                />

            </View>
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ gap: 5, width: '48%' }}>
                    <Text style={commonStyles.smallTextBlackBold}>
                        {customerName ? customerName : 'Mithlesh Verma'}
                    </Text>
                    <Text style={commonStyles.text}>
                        {label?.orderhstryorderstatus_label}: {orderStatus ? orderStatus : 'Order complete'}
                    </Text>
                </View>
                <View style={{ gap: 8, alignItems: 'flex-end' }}>
                    <Text tyle={commonStyles.text}>
                        {orderDate ? orderDate : '19-Oct-2024'} | {label?.extrafield_quantity}.: {qty ? qty : '45'}
                    </Text>
                    <Text style={commonStyles.smallTextBlackBold}>
                        {label?.extrafield_total}:{total ? total : '4500'}
                    </Text>
                </View>
            </View>



        </View>
    )
}

export default OrderHistoryCard