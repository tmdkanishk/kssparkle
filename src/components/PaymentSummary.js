import { View, Text } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import Colors from '../constants/Colors'
import GlassContainer from './customcomponents/GlassContainer'
import PriceView from './customcomponents/PriceView'

const PaymentSummary = ({ label, data }) => {
    return (
        <GlassContainer>
            <View style={{ padding: 12, borderColor: Colors.lightGray, borderRadius: 8 }}>
                <View style={{ height: 40, borderBottomWidth: 1, borderColor: Colors.lightGray }}>
                    <Text style={commonStyles.smallHeading}>{label?.orderinfopaysumry_heading}</Text>
                </View>
                {
                    data?.length > 0 ? (
                        data?.map((item, index) => (
                            <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, }}>
                                <View style={{ width: '70%' }}>
                                    <Text style={commonStyles.text}>{item?.title}:</Text>
                                </View>
                                <View style={{ alignItems: 'flex-end', }}>
                                    {item?.text && <PriceView
                                        priceHtml={item?.text}
                                        textStyle={commonStyles.text}
                                    />}
                                    {/* <Text style={commonStyles.text}>{item?.text}</Text> */}
                                </View>
                            </View>
                        ))

                    ) : null
                }

            </View>
        </GlassContainer>
    )
}

export default PaymentSummary