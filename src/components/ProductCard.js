import { View, Text, Image, TouchableOpacity, StyleSheet, useWindowDimensions, Pressable } from 'react-native'
import React, { useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import commonStyles from '../constants/CommonStyles';
import Feather from '@expo/vector-icons/Feather';
import Octicons from '@expo/vector-icons/Octicons';
import { useCustomContext } from '../hooks/CustomeContext';
import { IconComponentHeartFill, IconComponentImage } from '../constants/IconComponents';
import { truncateString } from '../utils/helpers';
import { addToCartProduct } from '../services/addToCartProduct';
import { useCartCount } from '../hooks/CartContext';
import SuccessModal from './SuccessModal';
import AddToCartOptionUiModal from './AddToCartOptionUiModal';
import { addToCartWithOptions } from '../services/addToCartWithOptions';
import FailedModal from './FailedModal';
import { addCompareProduct } from '../services/addCompareProduct';
import { useNavigation } from '@react-navigation/native';
import { useWishlist } from '../hooks/WishlistContext';
import { _retrieveData } from '../utils/storage';

const ProductCard = ({ itemdetail, ContainerWidth }) => {
    const navigation = useNavigation();
    const { Colors, GlobalText, EndPoint } = useCustomContext();
    const { updateCartCount } = useCartCount();
    const { width, height } = useWindowDimensions();
    const isLandscape = width > height;

    const [loading, setLoading] = useState(null);
    const [successModal, setSuccesModal] = useState(false);
    const [successModalText, setSuccessModalText] = useState(null);
    const [failedModal, setFailedModal] = useState(false);
    const [failedModalText, setFailedModalText] = useState(null);
    const [productOptionData, setProductOptionData] = useState(null);
    const [productOptionModal, setProductOptionModal] = useState(false);
    const [compareButton, setCompareButton] = useState(null);
    const { wishlist, handleWishlistToggle, wishlistloading } = useWishlist();
    const isWishlisted = wishlist.includes(itemdetail?.product_id);

    const onClickAddToCart = async (productid) => {
        try {
            setLoading(productid);
            const response = await addToCartProduct(productid, 1, EndPoint?.cart_add);
            updateCartCount(response?.cartproductcount);
            setSuccessModalText(response?.success);
            setSuccesModal(true);
            setTimeout(() => {
                closeSuccessModal(false);
            }, 2000);
        } catch (error) {
            setFailedModalText(GlobalText?.extrafield_somethingwrong);
            setFailedModal(true);
        } finally {
            setLoading(null);
        }
    }

    const onClickAddToCartOption = async (productid) => {
        try {
            setLoading(productid);
            const response = await addToCartWithOptions(productid, EndPoint?.cart_ProductOptions);
            setProductOptionData(response);
            setProductOptionModal(true);
        } catch (error) {
            setFailedModalText(GlobalText?.extrafield_somethingwrong);
            setFailedModal(true);
        } finally {
            setLoading(null);
        }
    }

    const onClickCompare = async (productid) => {
        try {
            setLoading(productid);
            const response = await addCompareProduct(productid, EndPoint?.compare_add);
            setSuccessModalText(response?.success);
            setCompareButton(response?.text?.comparecntbtn_label);
            setSuccesModal(true)

        } catch (error) {
            setFailedModalText(GlobalText?.extrafield_somethingwrong);
            setFailedModal(true);
        } finally {
            setLoading(null);
        }
    }

    const closeSuccessModal = () => {
        setSuccesModal(false);
        setSuccessModalText(null);
    }

    const closeFailedModal = () => {
        setFailedModal(false);
        setFailedModalText(null);
    }

    const onClickCompareButton = () => {
        navigation.navigate('Compare');
        setSuccesModal(false);
        setSuccessModalText(null);
        setCompareButton(null);
    }

    const onClickProduct = () => {
        navigation.navigate({
            name: 'Product',
            key: `ProductDetail-${itemdetail?.product_id}`,
            params: { productId: itemdetail?.product_id }
        })
    }

    const onToggleWishlist = async (productid) => {
        try {
            const data = await _retrieveData("USER");
            console.log("data user", data);
            if (!data) {
                return navigation.navigate('Login');
            } else {
                handleWishlistToggle(productid);
            }
        } catch (error) {
            console.log("error:", error);
        }
    }


    return (
        <View style={[styles.productContainer, { borderColor: Colors?.border_color, width: ContainerWidth ? ContainerWidth : isLandscape ? '23%' : '48%', backgroundColor: Colors?.imgContainerBgColor, opacity: loading || wishlistloading == itemdetail?.product_id ? 0.5 : 1, padding: 1 }]} >
            <View style={[styles.offerTagContainer, { zIndex: 1, height: 40, marginTop: 10, marginHorizontal: 6 }]}>

                {/* {
                    itemdetail?.wishliststatus ? (
                        <TouchableOpacity disabled={loading == itemdetail?.product_id ? true : false} onPress={() => onClickRemoveWishlist(itemdetail?.product_id)} style={[styles.wishListContainer, { borderColor: Colors?.border_color, backgroundColor: Colors?.surface_color, alignSelf: 'flex-end' }]}>
                            <IconComponentHeartFill size={24} color={Colors.primary} />
                        </TouchableOpacity>
                    ) : <TouchableOpacity disabled={loading == itemdetail?.product_id ? true : false} onPress={() => onClickWishlist(itemdetail?.product_id)}
                        style={[styles.wishListContainer, { borderColor: Colors?.border_color, backgroundColor: Colors?.surface_color, alignSelf: 'flex-end' }]}>
                        <FontAwesome name="heart-o" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                } */}


                <Pressable disabled={loading || wishlistloading == itemdetail?.product_id ? true : false} onPress={() => onToggleWishlist(itemdetail?.product_id)} style={[styles.wishListContainer, { borderColor: Colors?.border_color, backgroundColor: Colors?.surface_color, alignSelf: 'flex-end' }]}>
                    {isWishlisted ? < IconComponentHeartFill size={24} color={Colors.primary} /> : <FontAwesome name="heart-o" size={24} color={Colors.primary} />}
                </Pressable>



                {itemdetail?.discount_labels != false &&
                    <View style={{ gap: 5 }}>
                        {itemdetail?.discount_labels?.latest && <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#4A90E2', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: Colors?.white, fontSize: 10, fontWeight: '600' }}>{itemdetail?.discount_labels?.latest}</Text>
                        </View>}
                        {itemdetail?.discount_labels?.sale && <View style={{ height: 40, width: 40, borderRadius: 20, backgroundColor: '#EA2349', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: Colors?.white, fontSize: 10, fontWeight: '600' }}>{itemdetail?.discount_labels?.sale}</Text>
                        </View>}
                    </View>
                }

            </View>
            <TouchableOpacity onPress={onClickProduct} disabled={loading || wishlistloading == itemdetail?.product_id ? true : false}>
                <View style={[styles.imageContainer, { marginTop: -50, backgroundColor: Colors?.imgContainerBgColor, borderTopLeftRadius: 5, borderTopRightRadius: 5, }]}>
                    {
                        itemdetail?.thumb ? (
                            <Image source={{ uri: itemdetail?.thumb }} style={{ width: '100%', height: '100%', resizeMode: 'contain', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} />
                        ) : <IconComponentImage size={40} />
                    }
                </View>
                <View style={{ marginHorizontal: 10, marginTop: 8 }}>
                    {itemdetail?.rating !== 0 ? <Text style={commonStyles.textDescription}>{itemdetail?.rating}<Entypo name="star" size={16} color={Colors.iconColor1} /> /5 {itemdetail?.reviews !== false ? `(${itemdetail?.reviews})` : '(0)'}</Text> : <Text />}
                    <Text style={[commonStyles.textDescription, { marginTop: 5 }]}>
                        {truncateString(itemdetail?.name, 15)}
                    </Text>
                    <View style={styles.priceContainer}>
                        {/* old price  */}
                        {
                            itemdetail?.special !== false && (
                                <Text style={{ color: Colors.black, fontSize: 13, textDecorationLine: 'line-through', fontWeight: '400' }}>
                                    {itemdetail?.price}
                                </Text>
                            )
                        }
                        <Text style={{ marginTop: 5, fontSize: 13, fontWeight: '600', color: itemdetail?.special !== false ? '#DD0017' : 'black' }}>
                            {/* product price */}
                            {itemdetail?.special === false ? itemdetail?.price : itemdetail?.special}
                        </Text>

                        {/* off lavel */}
                        {
                            itemdetail?.off ? (<View style={[styles.offerText, { backgroundColor: Colors.primary }]}>
                                <Text style={[commonStyles.textwhite, { fontWeight: '600', fontSize: 10 }]}>{itemdetail.off}% Off </Text>
                            </View>) : <View />
                        }
                    </View>
                </View>
            </TouchableOpacity>
            <View style={styles.addCartContainer}>
                <TouchableOpacity disabled={loading || wishlistloading == itemdetail?.product_id ? true : false} style={[styles.recircleContainer, { backgroundColor: Colors?.surface_color, borderColor: Colors?.border_color, }]}
                    // onPress={() => onClickCompareBtn(itemdetail?.product_id)}
                    onPress={() => onClickCompare(itemdetail?.product_id)}
                >
                    <Octicons name="git-compare" size={24} color={Colors.primary} />
                </TouchableOpacity>
                <TouchableOpacity disabled={itemdetail?.quantity == 0 || (loading || wishlistloading) == itemdetail?.product_id ? true : false} style={[styles.cartBtn, { backgroundColor: Colors.primary, opacity: itemdetail?.quantity == 0 ? 0.5 : null }]}
                    // onPress={() => onclickAddToCart(itemdetail?.product_id)}
                    onPress={() => itemdetail?.optionsstatus ? onClickAddToCartOption(itemdetail?.product_id) : onClickAddToCart(itemdetail?.product_id)}
                >
                    <Feather name="shopping-cart" size={18} color={Colors.white} />
                    <Text style={commonStyles.smallText}>{GlobalText?.extrafield_cartbtn}</Text>
                </TouchableOpacity>
            </View>


            <AddToCartOptionUiModal
                items={productOptionData}
                closeModal={() => setProductOptionModal(false)}
                isModalVisibal={productOptionModal}
                productId={itemdetail?.product_id}
            />

            <SuccessModal
                isModal={successModal}
                btnName={compareButton ? compareButton : null}
                isSuccessMessage={successModalText}
                onClickClose={compareButton ? onClickCompareButton : closeSuccessModal}
                handleCloseModal={closeSuccessModal}
            />

            <FailedModal
                isModal={failedModal}
                isSuccessMessage={failedModalText}
                onClickClose={closeFailedModal}
                handleCloseModal={closeFailedModal}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    productContainer: {
        height: 'auto',
        borderWidth: 1,
        borderRadius: 8,
        // padding: 10,
    },

    offerTagContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    offerText: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        opacity: 1,
        padding: 5
    },
    wishListContainer: {
        width: 40,
        height: 40,
        borderWidth: 1,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
    },
    imageContainer: {
        justifyContent: 'center',
        width: '100%',
        height: 250,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: -1,
    },
    priceContainer: {
        flexDirection: 'row',
        gap: 5,
        alignItems: 'baseline',
        flexWrap: 'wrap'
    },
    hrLine: {
        borderTopWidth: 1,
        marginTop: -8
    },
    addCartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        marginBottom: 10,
        marginHorizontal: 10
    },

    recircleContainer: {
        borderWidth: 1,
        padding: 5,
        borderRadius: 4,
        height: '100%'
    },
    cartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '70%',
        borderRadius: 5,
        padding: 5,
        gap: 5
    }
})

export default ProductCard