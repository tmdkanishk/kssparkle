import React, { memo, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import AddToCartOptionUiModal from "../AddToCartOptionUiModal";
import { useCustomContext } from "../../hooks/CustomeContext";
import { useNavigation } from "@react-navigation/native";
import { addToCartWithOptions } from "../../services/addToCartWithOptions";
import { addToCartProduct } from "../../services/addToCartProduct";
import SuccessModal from "../SuccessModal";
import { useCartCount } from "../../hooks/CartContext";
import PriceView from "./PriceView";
const ProductGlassCard = ({ item, onPress, onAddToCart }) => {

    console.log("product items", item)

    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const { updateCartCount } = useCartCount();
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [productOptionData, setProductOptionData] = useState(null);
    const [productOptionModal, setProductOptionModal] = useState(false);
    const [failedModal, setFailedModal] = useState(false);
    const [failedModalText, setFailedModalText] = useState(null);
    const [successMgs, setSuccessMgs] = useState(null);


    const onclickAddToCart = async () => {
        try {
            setLoading(true);
            const response = await addToCartProduct(item?.product_id, 1, EndPoint?.cart_add);
            console.log("on add to cart:", response);
            updateCartCount(response?.cartproductcount);
            setSuccessMgs(response?.success);

            // setSuccessMgs
        } catch (error) {
            console.log("error:", error.response.data);
        } finally {
            setLoading(false);
        }
    }


    const onClickAddToCartOption = async () => {
        try {
            setLoading(true)
            const response = await addToCartWithOptions(item?.product_id, EndPoint?.cart_ProductOptions);
            setProductOptionData(response);
            setProductOptionModal(true);
        } catch (error) {
            setFailedModalText(GlobalText?.extrafield_somethingwrong);
            setFailedModal(true);
        } finally {
            setLoading(false);
        }
    }
    return (
        <>
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.cardWrapper}
                onPress={() => onPress?.(item)}
            >
                {/* ✅ Glass background without blur - using gradient only */}
                <LinearGradient
                    colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.10)"]}
                    style={styles.glassBackground}
                >
                    {/* ✅ Foreground Content */}
                    <View style={styles.content}>
                        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                            <View style={styles.headerStrip}>
                                <Text style={styles.categoryText}>{item.category}</Text>
                            </View>
                            {/* 🛍️ Bag Icon */}
                            <TouchableOpacity
                                activeOpacity={0.8}
                                onPress={() => { item?.optionsstatus ? onClickAddToCartOption() : onclickAddToCart() }}
                            >
                                <Image
                                    source={require("../../assets/images/parcel.png")}
                                    style={styles.bagIcon}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>

                        </View>

                        {/* ✅ Product Image Center */}
                        <View style={styles.imageWrapper}>
                            <Image
                                source={{ uri: item?.thumb }}
                                style={styles.productImage}
                            />
                        </View>

                        {/* ✅ Product Info */}
                        <View style={styles.infoContainer}>
                            <Text style={styles.productName} numberOfLines={2}>{item?.name}</Text>
                            <View style={{marginLeft:10}}>
                            <PriceView
                                priceHtml={item?.price}
                                textStyle={styles.price}
                            />
                            </View>

                            {/* <Text style={styles.price}>{item?.price}</Text> */}
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>


            <AddToCartOptionUiModal
                items={productOptionData}
                closeModal={() => setProductOptionModal(false)}
                isModalVisibal={productOptionModal}
                productId={item?.product_id}
            />
            <SuccessModal
                isSuccessMessage={successMgs}
                handleCloseModal={() => setSuccessMgs(null)}
                isModal={successMgs ? true : false}
                onClickClose={() => setSuccessMgs(null)}

            />

        </>
    );
};

export default memo(ProductGlassCard);

const styles = StyleSheet.create({
    cardWrapper: {
        width: "45%",
        marginBottom: 15,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 5,
    },
    glassBackground: {
        height: 200,
        borderRadius: 20,
        overflow: "hidden",
        borderWidth: 0.6,
        borderColor: "rgba(255,255,255,0.4)",
        // backgroundColor: "rgba(255,255,255,0.1)", // Fallback
    },
    content: {
        flex: 1,
    },
    headerStrip: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#E8E8E8",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderTopLeftRadius: 18,
        borderBottomRightRadius: 18,
        width: '60%',
        borderWidth: 0.6,
        borderColor: "rgba(255,255,255,0.4)",
    },
    categoryText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#2b2b2b",
    },
    bagIcon: {
        width: 18,
        height: 18,
        marginRight: 10
    },
    imageWrapper: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 5,
    },
    productImage: {
        width: "65%",
        height: "65%",
    },
    infoContainer: {
        flexDirection: "row",
        padding: 10,
        alignItems: "flex-start",
    },
    productName: {
        fontSize: 10,
        color: "white",
        lineHeight: 12,
        marginBottom: 4,
        width: '60%',
        fontWeight: '500',
    },
    price: {
        fontSize: 11,
        fontWeight: "700",
        color: "white",
        marginLeft: 'auto', // Push to right
    },
});