import { View, Text } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'

const PaymentSummary = ({ label, data }) => {
    return (
        <View style={{ padding: 12, borderWidth: 1, borderColor: Colors.lightGray, borderRadius: 8 }}>
            <View style={{ height: 40, borderBottomWidth: 1, borderColor: Colors.lightGray }}>
                <Text style={commonStyles.smallHeading}>{label?.orderinfopaysumry_heading}</Text>
            </View>
            {
                data?.length > 0 ? (
                    data?.map((item, index) => (
                        <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, }}>
                            <View style={{width:'70%'}}>
                                <Text style={commonStyles.text}>{item?.title}:</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', }}>
                                <Text style={commonStyles.text}>{item?.text}</Text>
                            </View>
                        </View>
                    ))

                ) : null
            }

        </View>
    )
}

export default PaymentSummary