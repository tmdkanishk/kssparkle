import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { FlatList, ScrollView } from 'react-native-gesture-handler'
import ProductCard from './ProductCard'
import { useNavigation } from '@react-navigation/native'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'

const ProductListItem = ({ data}) => {
    const navigation = useNavigation();
    return (
        <FlatList
            data={data}
            renderItem={({ item }) =>
            (
                <View style={{ marginRight: 10 }}>
                    <ProductCard
                        itemdetail={item}
                    />

                </View>
            )
            }
            // keyExtractor={item => item?.product_id}
            keyExtractor={(item, index) => index}
            horizontal={true}  // Set horizontal to true for horizontal scrolling
            showsHorizontalScrollIndicator={false}  // Hides the scroll indicator
        />


    )
}




export default ProductListItem