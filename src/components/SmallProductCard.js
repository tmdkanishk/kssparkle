import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import { IconComponentImage } from '../constants/IconComponents'
import { useCustomContext } from '../hooks/CustomeContext'
import { truncateString } from '../utils/helpers'
import { useNavigation } from '@react-navigation/native'

const SmallProductCard = ({ data }) => {
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;
    const { Colors } = useCustomContext();
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => data?.subcategory_count > 0 ? navigation.navigate("AllCategoryView", { path: data?.category_id }) : navigation.navigate("CategoryView", { subCategoryId: data?.category_id, titleName: data?.name })} style={[styles.cardContainer, { backgroundColor: Colors?.surface_color, width: isLandscape ? 150 : '31%'}]}>
            <View style={[styles.imageContainer, { borderColor: Colors?.border_color, alignItems: 'center', justifyContent: 'center' }]}>
                {
                    data.thumb ? (
                        <Image source={{ uri: data.thumb }} style={{
                            borderTopRightRadius: 8,
                            borderTopLeftRadius: 8, width: '100%', height: '100%', resizeMode: 'cover'
                        }} />
                    ) : <IconComponentImage size={40} />
                }
            </View>
            <Text style={{ textAlign: 'center', }}>{truncateString(data?.name, 10)}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 8,
        opacity: 1,
        gap: 5,
        paddingBottom: 5,
        // marginBottom:10
    },
    imageContainer: {
        width: '100%',
        height: 100,
        borderTopRightRadius: 8,
        borderTopLeftRadius: 8,
        borderWidth: 1,
    }

    // cardContainer: {
    //     width: 120,
    //     height: 130,
    //     borderRadius: 8,
    //     opacity: 1,
    //     gap: 5,
    // },
    // imageContainer: {
    //     width: 120,
    //     height: 100,
    //     borderTopRightRadius: 8,
    //     borderTopLeftRadius: 8,
    //     borderWidth: 1,
    // }
})



export default SmallProductCard