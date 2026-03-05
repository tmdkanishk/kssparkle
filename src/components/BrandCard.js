import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { truncateString } from '../utils/helpers';
import GlassContainer from './customcomponents/GlassContainer';

const BrandCard = ({ width, item }) => {
    const navigation = useNavigation();
    return (
        <GlassContainer padding={8}>
        <View style={{ width: width, height: item?.name ? 150 : 100, alignItems: 'center', justifyContent: 'space-between', }}>
            <TouchableOpacity onPress={() => navigation.navigate('Products', { id: item?.manufacturer_id, titleName: item?.manufacturer_name || item?.name })} style={{ width: '100%', height: item?.name ? '70%' : '100%', borderColor: '#F5F5F5', borderRadius: 10, }}>
                {item?.image && <Image source={{ uri: item?.image }} style={{ width: '100%', height: '100%', borderRadius: 10, resizeMode: 'contain' }} />}
            </TouchableOpacity>
            {item?.name && <Text style={{ fontSize: 16, fontWeight: '500', textAlign: 'center', color:'#fff' }}>{truncateString(item?.name, 20)}</Text>}
        </View>
        </GlassContainer>
    )
}

export default BrandCard