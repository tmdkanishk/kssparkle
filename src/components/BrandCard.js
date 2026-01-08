import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { truncateString } from '../utils/helpers';

const BrandCard = ({ width, item }) => {
    const navigation = useNavigation();
    return (
        <View style={{ width: width, height: item?.name ? 150 : 100, alignItems: 'center', justifyContent: 'space-between', }}>
            <TouchableOpacity onPress={() => navigation.navigate('Products', { id: item?.manufacturer_id, titleName: item?.manufacturer_name || item?.name })} style={{ width: '100%', height: item?.name ? '70%' : '100%', borderWidth: 1, borderColor: '#F5F5F5', borderRadius: 10, }}>
                {item?.image && <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} />}
            </TouchableOpacity>
            {item?.name && <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center' }}>{truncateString(item?.name, 20)}</Text>}
        </View>
    )
}

export default BrandCard