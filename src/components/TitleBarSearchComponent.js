import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useCustomContext } from '../hooks/CustomeContext';
import { truncateString } from '../utils/helpers';

const TitleBarSearchComponent = ({ titleName, onClickBackIcon, Component1, Component2, onclickComponent1}) => {
    const { Colors } = useCustomContext();
    return (
        <View style={{
            backgroundColor: '#f5f5f5',
            paddingBottom: 5
        }}>
            <View style={[[styles.titleBarConatiner, {backgroundColor:Colors.headerBgColor}]]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems:'center'}}>
                    <View style={{ flexDirection: 'row', gap: 20, width: '50%' }}>
                        <TouchableOpacity onPress={onClickBackIcon}>
                            <FontAwesome6 name="arrow-left-long" size={24} color="black" />
                        </TouchableOpacity>
                        <Text style={commonStyles.smallHeading}>{titleName}</Text>
                    </View>
                    {
                        Component1 ? (
                            <View style={{ alignItems: 'flex-end' }}>

                                <TouchableOpacity onPress={onclickComponent1}>
                                    <Component1 />
                                </TouchableOpacity>

                            </View>
                        ) : null
                    }

                </View>
                {
                    Component2 ? (
                        <View >
                            <Component2/>
                        </View>
                    ) : null
                }



            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    titleBarConatiner: {
        width: '100%',
        paddingHorizontal: 12,
        paddingVertical: 16,
        gap: 10,
        borderRadius: 1,
        shadowColor: '#000',
        justifyContent: 'space-between',
        shadowOffset: {
            width: 0,
            height: 4, // Adjust this for bottom shadow
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5,
    }
})

export default TitleBarSearchComponent