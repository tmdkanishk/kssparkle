import { View, Text, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'

const DropDownCustomComponent = ({ data, handleSelectedSelectOptions, borderColor , selectedValue, setSelectedValue}) => {
    const [isActiveField, setActiveField] = useState(false);
    const [isSelectedItem, setSelectedItem] = useState(selectedValue);
    return (
        <View style={{ position: 'relative',  }}>
            <TouchableOpacity onPress={() => setActiveField(!isActiveField)} style={{ borderWidth: 1, borderColor:borderColor, borderRadius: 10, height: 50, width: '100%', justifyContent: 'center', paddingHorizontal: 10 ,}}>
                <Text>{isSelectedItem || 'Select'}</Text>
            </TouchableOpacity>

            {
                isActiveField ?
                    <View style={{ width: '100%', borderWidth: 1, borderRadius: 10, padding: 10, maxHeight: 200, marginTop: 8, marginTop: 12, zIndex: 2, backgroundColor:'white', borderColor:'gray' }}>
                        <ScrollView showsVerticalScrollIndicator={false}>

                            {
                                data.map((item, index) => (
                                    <TouchableOpacity key={index} onPress={() => {setSelectedValue(item?.name); setSelectedItem(item?.name); setActiveField(!isActiveField); handleSelectedSelectOptions(item?.product_option_value_id) }} style={{ height: 40, borderBottomWidth: 1, justifyContent: 'center', borderColor:'gray' }}>
                                        <Text>{item?.name}</Text>
                                    </TouchableOpacity>

                                ))}



                        </ScrollView>


                    </View> : null

            }
        </View>

    )
}

export default DropDownCustomComponent