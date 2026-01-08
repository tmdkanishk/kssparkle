import { View, ActivityIndicator } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext';

const CustomActivity = ({ size }) => {
    const { Colors } = useCustomContext();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size={size ? size : 'large'} color={Colors?.primary} />
        </View>
    )
}

export default CustomActivity