import { View, Text, Image } from 'react-native'
import React from 'react'
import { IconComponentImage, IconComponentStar } from '../constants/IconComponents'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'

const RatingCard = ({ image, productName, productReview, productRate, totalRate }) => {
    const { Colors } = useCustomContext();
    return (
        <View style={{ flexDirection: 'row', gap: 20, borderWidth: 1, borderColor: Colors.gray, borderRadius: 10, padding: 12, alignItems: 'center', marginTop: 20 }}>
            <View style={{ width: '25%', height: 100, borderWidth: 1, borderRadius: 10, borderColor: Colors?.border_color, justifyContent: 'center', alignItems: 'center' }}>
                {
                    image ? (
                        <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    ) : <IconComponentImage size={28} />
                }

            </View>
            <View style={{ gap: 5, width: '70%' }}>
                <Text style={commonStyles.heading}>{productName}</Text>
                <Text style={[commonStyles.textDescription]}>
                    {productReview}
                </Text>
                <View style={{ flexDirection: 'row', gap: 5 }}>
                    {Array.from({ length: totalRate }).map((_, index) => (
                        <IconComponentStar key={index} color={index < productRate ? 'orange' : 'gray'} />
                    ))}
                </View>
            </View>
        </View>
    )
}

export default RatingCard