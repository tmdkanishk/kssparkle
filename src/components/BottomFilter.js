import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import React from 'react'
import Colors from '../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { IconComponentArrowDownLong, IconComponentArrowUpLong, IconComponentFilter } from '../constants/IconComponents';
import commonStyles from '../constants/CommonStyles';

const BottomFilter = ({ onclickSort, onClickFilter, textLabel }) => {
    const navigation = useNavigation();
    return (
        <View style={[styles.bottomBtnContainer, { borderColor: Colors.darkGray }]}>
            <TouchableOpacity style={styles.bottomBtn} onPress={onclickSort}>
                <View style={{ flexDirection: 'row' }}>
                    <IconComponentArrowUpLong color={Colors.iconColor} size={20} />
                    <IconComponentArrowDownLong color={Colors.iconColor} size={20} />
                </View>
                <Text style={commonStyles.textGray_lg}>{textLabel?.sort_label}</Text>
            </TouchableOpacity>

            <View style={[styles.bottomBtn, { borderRightWidth: 1, borderColor: Colors.gray, }]} />

            <TouchableOpacity style={styles.bottomBtn} onPress={onClickFilter}>
                <IconComponentFilter color={Colors.iconColor} />
                <Text style={commonStyles.textGray_lg}>{textLabel?.filter_label}</Text>
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    bottomBtn: {
        alignItems: 'center',
        padding: 10,
        gap: 10,
        flexDirection: 'row',
    },
    bottomBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        position: 'absolute',
        bottom: Platform.OS === 'ios' ? '9%' : '9%',
        width: '100%',
        // borderColor: '#F5F5F5',
        borderWidth: 1,
        paddingVertical: 10,
        opacity: 1,
        alignSelf: 'center',
        height: '10%',
        backgroundColor: '#FFFFFF',

        shadowOffset: {
            width: 0,
            height: 4, // Adjust this for bottom shadow
        },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 20,
        shadowColor: '#000',
    }

})

export default BottomFilter