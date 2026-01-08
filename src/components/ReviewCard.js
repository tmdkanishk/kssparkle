import { View, Text } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import commonStyles from '../constants/CommonStyles';
import { useCustomContext } from '../hooks/CustomeContext';

const ReviewCard = ({ reviewHeading, reviewText, reviewDate, rating,}) => {
    const { Colors } = useCustomContext();
   const unrating = 5 - rating;
   
    return (
        <View>
            <View style={{ borderWidth: 1, borderColor: Colors.gray, borderStyle: 'dashed' }} />

            <View style={{ marginVertical: 12, gap: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 5 }}>

                        {Array.from({ length: rating }).map((_, index) => (
                            <AntDesign key={index} name="star" size={16} color={Colors.primary} />
                          
                        ))}
                        {Array.from({ length: unrating }).map((_, index) => (
                            <AntDesign key={index} name="star" size={16} color={Colors.gray} />
                          
                        ))}
                       
                    </View>

                    {/* <Text style={[commonStyles.textPrimary, {color:Colors.primary}]}>Verified Purchase</Text> */}
                </View>

                <Text style={{ color: Colors.iconColor1 }}>
                    {reviewDate ? reviewDate : "October 03, 2024"}
                </Text>
                <Text style={commonStyles.smallHeading}>{reviewHeading ? reviewHeading : "Wonderful Product For Party"} </Text>
                <Text>{reviewText ? reviewText : "it is very wonderful product, very smooth and stylish this product as per i think, good look, stylish, its design special for party wear !"}</Text>
            </View>
        </View>
    )
}

export default ReviewCard