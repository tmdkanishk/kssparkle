import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import { IconComponentRightArrow } from '../constants/IconComponents'
import { useCustomContext } from '../hooks/CustomeContext'
import GlassContainer from './customcomponents/GlassContainer'

const DowloadInvoiceCard = ({onClickDownload, label, data}) => {
    const {Colors} = useCustomContext();
    return (
        <GlassContainer>
        <View style={{ borderColor: Colors.lightGray, borderRadius: 8, height: 'auto' ,}}>
            <View style={{ borderColor: Colors.lightGray, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap:10 }}>
                <View>
                    <Text style={commonStyles.text}>{label?.orderinfoorderid_label}: </Text>
                    <Text style={commonStyles.text}>{label?.orderinfodateadded_label}:</Text>
                </View>

                <View style={{ alignItems: 'flex-end' }}>
                    <Text style={commonStyles.text}>{data?.order_id}</Text>
                    <Text style={commonStyles.text}>{data?.date_added}</Text>
                </View>

            </View>
            {/* <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }} onPress={onClickDownload}>
                <Text style={commonStyles.smallTextBlackBold}>{label?.orderinfodwnlodinvoice_label}</Text>
                <IconComponentRightArrow size={20} />
            </TouchableOpacity> */}
        </View>
        </GlassContainer>
    )
}

export default DowloadInvoiceCard