import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import Entypo from '@expo/vector-icons/Entypo';
import { IconComponentCarts, IconComponentHeartFill, IconComponentImage, IconComponentTrash } from '../constants/IconComponents';
import commonStyles from '../constants/CommonStyles';

const WishlistCard = ({ image, productName, price, discountPrice, onClickWishList, onclickAddTocart, addToCartText, onClickProduct, isLoading }) => {
    const { Colors } = useCustomContext();
    return (
        <View style={{ marginTop: 20, flexDirection: 'row', paddingVertical: 10, borderWidth: 1, borderColor: Colors.gray, borderRadius: 10, justifyContent: 'space-between', alignItems: 'center', opacity: isLoading ? 0.5 : 1 }}>
            <TouchableOpacity onPress={() => onClickProduct()} style={{ width: '30%', height: 120, padding: 10, alignItems: 'center', justifyContent: 'center' }}>
                {
                    image ? (
                        <Image source={{ uri: image }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                    ) : (
                        <IconComponentImage size={40} />
                    )
                }

            </TouchableOpacity>
            <View style={{ width: '60%', }}>
                <View style={{ gap: 5 }}>
                    <TouchableOpacity onPress={() => onClickProduct()}>
                        <Text style={commonStyles.text_lg}>
                            {productName}
                        </Text>
                    </TouchableOpacity>

                    <Text style={commonStyles.textDescription}>{1}<Entypo name="star" size={16} color={Colors.iconColor1} /> /5 {'(0)'}</Text>
                    <View style={styles.priceContainer}>
                        <Text style={commonStyles.text_lg}>
                            {/* product price */}
                            {discountPrice ? discountPrice : price}
                        </Text>

                        {/* old price  */}
                        {
                            discountPrice ? <View>
                                <Text style={{ color: Colors.grayLight }}>
                                    {price}
                                </Text>
                                {
                                    price ? <View style={[styles.hrLine, { borderColor: Colors.grayLight, }]} /> : null
                                }

                            </View> : null
                        }


                    </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 20, marginTop: 10, alignItems: 'center' }}>
                    <TouchableOpacity onPress={onClickWishList}>
                        <IconComponentTrash size={32} color={Colors?.error} />
                    </TouchableOpacity>

                    <TouchableOpacity disabled={isLoading} style={[styles.cartBtn, { backgroundColor: Colors.primary, }]} onPress={onclickAddTocart}>
                        <IconComponentCarts color={Colors.white} size={21} />
                        <Text style={commonStyles.textwhite}>{addToCartText}</Text>
                    </TouchableOpacity>

                </View>
                <View>


                </View>

            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    priceContainer: {
        flexDirection: 'row',
        gap: 10,
        alignItems: 'baseline',
    },
    hrLine: {
        borderTopWidth: 1,
        marginTop: -10
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        padding: 10,
        gap: 10,

    }

})

export default WishlistCard