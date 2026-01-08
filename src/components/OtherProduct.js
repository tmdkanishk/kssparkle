import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const OtherProduct = () => {
    return (
        <TouchableOpacity style={{ width: '24%', height: 150, borderRadius: 12, }}>
            <View style={{ borderRadius: 4, backgroundColor: Colors.palePink, width: '100%', height: 100, alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../assets/images/surf.png')} />
            </View>
            <Text style={{ textAlign: 'center', top: 5 }}>
                Cleaning &
                Household
            </Text>
        </TouchableOpacity>
    )
}

export default OtherProduct