import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext';

const MenuComponent = ({ IconComponent, menuText, onClick, textColor, borderBottomWidth }) => {
    const { Colors } = useCustomContext();
    return (
        <TouchableOpacity onPress={onClick} style={{ borderBottomWidth: borderBottomWidth ? borderBottomWidth : null, borderColor: Colors.lightGray, height: 70, width: '100%', flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20 }}>
            <View style={{ backgroundColor: Colors.menuBackground, height: 40, width: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
                <IconComponent color={Colors.menuIcon} />
            </View>
            <Text style={{ fontSize: 16, color: textColor ? textColor : Colors.menuName }}>{menuText ? menuText : 'Home'}</Text>
        </TouchableOpacity>

    )
}

export default MenuComponent