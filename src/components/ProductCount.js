import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import AntDesign from '@expo/vector-icons/AntDesign';
import { useCustomContext } from '../hooks/CustomeContext';

const ProductCount = ({containerWidth, borderWidth, borderRadius, borderColor, height, width , iconSize, iconColor, fontSize, contvalue, onClickMin, onClickPlus}) => {
    const { Colors } = useCustomContext();
    return (
        <View style={[styles.mainContainer, {width:containerWidth}]}>

            <TouchableOpacity style={{
                 borderWidth: borderWidth?borderWidth: 2, 
                 borderRadius:borderRadius?borderRadius: 4, 
                 borderColor: borderColor?borderColor:Colors.primary, 
                 height: height?height:40, 
                 alignItems:'center',
                 justifyContent:'center'
                }} onPress={onClickMin}>
                <AntDesign name="minus" size={iconSize?iconSize:32} color={iconColor?iconColor:Colors.black} />
            </TouchableOpacity>
            <View style={{
                borderWidth: borderWidth?borderWidth: 2, 
                borderRadius:borderRadius?borderRadius: 4, 
                borderColor: borderColor?borderColor:Colors.primary, 
                height: height?height:40, 
                width: width?width:'36%', 
                alignItems: 'center', 
                justifyContent: 'center' 
                }}>
                <Text style={{ fontWeight: '300', fontSize: fontSize?fontSize:24, color:Colors.primary}}>{contvalue?contvalue:'0'}</Text>
            </View>
            <TouchableOpacity style={{
                borderWidth: borderWidth?borderWidth: 2, 
                borderRadius:borderRadius?borderRadius: 4, 
                borderColor: borderColor?borderColor:Colors.primary, 
                height: height?height:40, 
                 alignItems:'center',
                 justifyContent:'center'
            }} onPress={onClickPlus}>
                <AntDesign name="plus" size={iconSize?iconSize:32} color={iconColor?iconColor:Colors.black} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({

    mainContainer:{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-around' 
    },
})

export default ProductCount