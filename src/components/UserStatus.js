import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import commonStyles from '../constants/CommonStyles'
import { useCustomContext } from '../hooks/CustomeContext';
import { IconComponentImage } from '../constants/IconComponents';
import { truncateString } from '../utils/helpers';
import { useNavigation } from '@react-navigation/native';

const UserStatus = ({ data }) => {
    const { Colors } = useCustomContext();
    const navigation = useNavigation();
    return (
        <View style={{ width: '100%', }}>
            <FlatList
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => item?.subcategory_count > 0 ? navigation.navigate(
                        {
                            name: 'AllCategoryView',
                            key: `AllCategoryView-${item?.category_id}`,
                            params: { path: item?.category_id }
                        }

                    ) : navigation.navigate(
                        {
                            name: 'CategoryView',
                            key: `CategoryView-${item?.category_id}`,
                            params: { subCategoryId: item?.category_id, titleName: item?.name }
                        }

                    )} style={[styles.statusContainer, { marginLeft: 10 }]}>
                        <View style={[styles.statusImageContainer]}>
                            {
                                item?.thumb ? (
                                    <Image source={{ uri: item?.thumb }} style={{ width: 80, height: 80, borderRadius: 40, resizeMode: 'contain', borderWidth: 1, borderColor: Colors?.border_color }} />
                                ) : <IconComponentImage size={40} />
                            }
                        </View>
                        <Text style={commonStyles.text}>{truncateString(item?.name, 10)}</Text>

                    </TouchableOpacity>
                )

                }
                keyExtractor={item => item?.category_id}
                horizontal={true}  // Set horizontal to true for horizontal scrolling
                showsHorizontalScrollIndicator={false}  // Hides the scroll indicator
            />


        </View>
    )
}

const styles = StyleSheet.create({
    statusContainer: {
        gap: 5,
        alignItems: 'center',
    },

    statusImageContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    }


})

export default UserStatus