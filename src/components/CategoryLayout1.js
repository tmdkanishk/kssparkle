import { View, Text, Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native'
import React from 'react'
import { IconComponentDashboard, IconComponentImage } from '../constants/IconComponents'
// import Colors from '../constants/Colors'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext'

const CategoryLayout1 = ({ text, img, onClick }) => {
    const { Colors } = useCustomContext();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    return (

        <TouchableOpacity
            onPress={onClick}
            style={[styles.shadowBox, {
                paddingVertical: 16,
                paddingHorizontal: 5,
                flexDirection: 'row',
                width: isLandscape ? '32%' : '48%',
                alignItems: 'center',
                gap: 8,
                borderRadius: 8,
            }]}>
            <View style={{ width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors?.cardContainerColor, overflow: 'hidden' }}>
                {
                    img ? (
                        <Image source={{ uri: img }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    ) : (
                        <IconComponentImage />
                    )
                }
            </View>
            <View style={{ width: '60%' }}>
                <Text style={[commonStyles.text, { flexWrap: 'wrap' }]}>{text}</Text>
            </View>
        </TouchableOpacity>




    )
}


const styles = StyleSheet.create({
    shadowBox: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5, // Required for Android
    },
});

export default CategoryLayout1