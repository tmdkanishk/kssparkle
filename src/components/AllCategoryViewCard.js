import { View, Text, Image, Touchable, TouchableOpacity } from 'react-native'
import React, { use, useState } from 'react'
import commonStyles from '../constants/CommonStyles'
import { IconComponentDownArrow, IconComponentImage, IconComponentUpArrow } from '../constants/IconComponents'
import { truncateString } from '../utils/helpers'
import { useNavigation } from '@react-navigation/native'

const AllCategoryViewCard = ({ onClickCard, img, name, childSubList, isToggleCardId, setToggleCardId, id }) => {
    const navigation = useNavigation();
    return (
        <View style={{ backgroundColor: '#ffffff' }}>
            {
                childSubList?.length > 0 ? (
                    <TouchableOpacity onPress={() => { setToggleCardId((prevId) => (prevId === id ? null : id)) }} style={{ flexDirection: 'row', alignItems: 'center', padding: 12, justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{truncateString(name, 32)}</Text>
                        {
                            isToggleCardId == id ? <IconComponentUpArrow size={22} /> : <IconComponentDownArrow size={22} />
                        }
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity onPress={onClickCard} style={{ padding: 12, }}>
                        <Text style={{ fontSize: 16, fontWeight: '600' }}>{truncateString(name, 32)}</Text>
                    </TouchableOpacity>)
            }


            {
                isToggleCardId == id && <View style={{ gap: 10, padding: 10 }}>
                    {
                        childSubList?.length > 0 && (
                            childSubList?.map((item, index) => (
                                <TouchableOpacity onPress={() => navigation.navigate(
                                    {
                                        name: 'CategoryView',
                                        key: `CategoryView-${item?.category_id}`,
                                        params: { subCategoryId: item?.category_id, titleName: item?.name }
                                    }

                                )} key={index} style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, padding: 12, borderColor: '#F0F4F7', justifyContent: 'space-between', backgroundColor: '#F0F4F7' }}>
                                    <Text style={{ fontSize: 16, fontWeight: '400' }}>{truncateString(item?.name, 32)}</Text>
                                </TouchableOpacity>
                            ))

                        )
                    }
                </View>
            }

        </View>
    )
}

export default AllCategoryViewCard