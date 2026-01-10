import { View, Text, TouchableOpacity, ScrollView, Modal, Platform, ImageBackground, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import commonStyles from '../constants/CommonStyles'
import { IconComponentCheckSquare, IconComponentClose, IconComponentSquare } from '../constants/IconComponents'
import ProductColorCard from './ProductColorCard'
import { Picker } from '@react-native-picker/picker'
import { useCustomContext } from '../hooks/CustomeContext'
import DropDownCustomComponent from './DropDownCustomComponent'
import { addToCartWithOptionCopy } from '../services/addToCartWithOptionCopy'
import { useCartCount } from '../hooks/CartContext'
import OptionCard from './customcomponents/OptionCard'
import { getProductInfo } from '../services/getProductInfo'
import { BlurView } from '@react-native-community/blur'

const AddToCartOptionUiModal = ({ isModalVisibal, closeModal, items, productId }) => {
    // console.log("items AddToCartOptionUiModal", items)
    const { updateCartCount } = useCartCount();
    const { Colors, GlobalText, EndPoint } = useCustomContext();
    const [isSelectError, setSelectError] = useState(false);
    const [selectedRadioOptions, setSelectedRadioOptions] = useState({});
    const [selectedCheckboxOptions, setselectedCheckboxOptions] = useState({});
    const [selectedSelectOptions, setselectedSelectOptions] = useState({});
    const [selectedValue, setSelectedValue] = useState(null);
    const [isSuccessMessage, setSuccessMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [upadtedPrice, setUpdatedPrice] = useState(null);
    const [upadtedSpecialPrice, setUpadtedSpecialPrice] = useState(null);
    const [upadtedProductInfo, setUpadtedProductInfo] = useState(null);
    const { width } = Dimensions.get('window');

    const handleSelectedRadioOptions = (productOptionId, productOptionValueId) => {
        console.log("productOptionId, productOptionValueId", productOptionId, productOptionValueId);
        setSelectedRadioOptions((prev) => ({
            ...prev,
            [`option[${productOptionId}]`]: productOptionValueId,
        }));
    }

    const handleSelectedCheckBoxOptions = (productOptionId, productOptionValueId) => {
        console.log("productOptionId, productOptionValueId", productOptionId, productOptionValueId);
        setselectedCheckboxOptions((prev) => {
            const currentSelections = prev[`option[${productOptionId}][]`] || [];
            if (currentSelections.includes(productOptionValueId)) {
                // Remove if already selected
                return {
                    ...prev,
                    [`option[${productOptionId}][]`]: currentSelections.filter((id) => id !== productOptionValueId),
                };
            } else {
                // Add if not selected
                return {
                    ...prev,
                    [`option[${productOptionId}][]`]: [...currentSelections, productOptionValueId],
                };
            }
        }
        )
    }

    const handleSelectedSelectOptions = (productOptionId, productOptionValueId) => {
        console.log("productOptionId, productOptionValueId", productOptionId, productOptionValueId);
        setselectedSelectOptions((prev) => ({
            ...prev,
            [`option[${productOptionId}]`]: productOptionValueId,
        }));
    }


    const onClickAddToCartButtonWithOption = async (selectedRadioOptions, selectedCheckboxOptions, selectedSelectOptions) => {
        try {
            setLoading(true);
            const results = await addToCartWithOptionCopy(productId, 1, selectedRadioOptions, selectedCheckboxOptions, selectedSelectOptions, EndPoint?.cart_add);
            if (results?.success) {
                console.log("results", results?.success);
                updateCartCount(results?.cartproductcount);
                setSuccessMessage(results?.success);
                // setCartAnimation(true);
                setSelectError(false);
                setTimeout(() => {
                    closeModal();
                    setSuccessMessage(null);
                }, 2000);
            }
        } catch (error) {
            setSelectError(true);
        } finally {
            setLoading(false);
        }
    }

    const fetchProductInfo = async (key, value) => {
        try {
            const response = await getProductInfo(productId, isQtySize, key, value, EndPoint?.productdetails_loadprice);
            setUpdatedPrice(response?.price);
            setUpadtedSpecialPrice(response?.special);
            setUpadtedProductInfo(response?.productsdetail);
        } catch (error) {
            console.log("error", error.response.data);
        }
    }

    return (
        <Modal
            animationType="fade"
            transparent
            visible={isModalVisibal}
            onRequestClose={() => {
                closeModal();
                setSelectError(false);
                setSuccessMessage(null);
            }}
        >
            <View style={{ flex: 1 }}>
                {/* OVERLAY */}
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => {
                        closeModal();
                        setSelectError(false);
                        setSuccessMessage(null);
                    }}
                    style={{
                        flex: 1,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    {/* BLUR */}
                    <BlurView
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                        }}
                        blurType="dark"
                        blurAmount={15}
                        reducedTransparencyFallbackColor="rgba(0,0,0,0.6)"
                    />

                    {/* STOP CLOSE ON CARD CLICK */}
                    <TouchableOpacity activeOpacity={1}>
                        <ImageBackground
                            source={require("../assets/images/backgroundimage.png")}
                            resizeMode="cover"
                            style={{
                                width: width * 0.80,   // 👈 THIS FIXES IT
                                borderRadius: 16,
                                overflow: 'hidden',
                            }}
                        >
                            {/* GLASS OVERLAY */}
                            <View
                                style={{
                                    backgroundColor: "rgba(0,0,0,0.35)",
                                    padding: 20,
                                }}
                            >
                                {/* CLOSE ICON */}
                                {/* <View style={{ alignItems: "flex-end" }}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            closeModal();
                                            setSelectError(false);
                                            setSuccessMessage(null);
                                        }}
                                    >
                                        <IconComponentClose color="#fff" />
                                    </TouchableOpacity>
                                </View> */}

                                {/* CONTENT */}
                                <ScrollView
                                    showsVerticalScrollIndicator={false}
                                    style={{ opacity: loading ? 0.5 : 1 }}
                                >
                                    <View style={{ alignItems: 'flex-end', width: '100%' }}>
                                        <TouchableOpacity onPress={() => { closeModal(); setSelectError(false); setSuccessMessage(null); }}>
                                            <IconComponentClose />
                                        </TouchableOpacity>
                                    </View>



                                    <View>
                                        {
                                            items?.options?.map((item, index) => (
                                                <View key={index}>
                                                    {
                                                        item?.type === "radio" ? (
                                                            item?.product_option_value?.length > 0 ? (
                                                                <>
                                                                    <View style={{ marginTop: 12 }}>
                                                                        <Text style={[commonStyles.heading, { color: Colors.headingColor }]}>{item?.name}</Text>
                                                                    </View>

                                                                    <View style={{ flexDirection: 'row', marginVertical: 12, gap: 10 }}>
                                                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                                            {
                                                                                item?.product_option_value?.map((option, index) => (

                                                                                    option?.image ?
                                                                                        (

                                                                                            <View key={index} style={{ alignItems: 'center', gap: 5, }} >
                                                                                                <ProductColorCard
                                                                                                    img={option.image}
                                                                                                    onClick={() => handleSelectedRadioOptions(item?.product_option_id, option?.product_option_value_id)}
                                                                                                    item={option?.product_option_value_id}
                                                                                                    borderColor={selectedRadioOptions[`option[${item?.product_option_id}]`] === option?.product_option_value_id ? Colors.primary : isSelectError && !selectedRadioOptions[`option[${item?.product_option_id}]`] ? "red" : Colors?.gray}
                                                                                                />
                                                                                                <Text>{option.name}</Text>
                                                                                            </View>

                                                                                        ) :
                                                                                        (
                                                                                            <TouchableOpacity
                                                                                                key={index}
                                                                                                onPress={() => handleSelectedRadioOptions(item?.product_option_id, option?.product_option_value_id)}
                                                                                                style={{
                                                                                                    width: 60, height: 60, borderRadius: 8, borderWidth: 1, justifyContent: 'center', alignItems: 'center', marginLeft: index == 0 ? 0 : 10,
                                                                                                    borderColor: selectedRadioOptions[
                                                                                                        `option[${item?.product_option_id}]`
                                                                                                    ] ===
                                                                                                        option?.product_option_value_id
                                                                                                        ? Colors.primary
                                                                                                        : isSelectError && !selectedRadioOptions[`option[${item?.product_option_id}]`] ? "red" : Colors?.gray
                                                                                                }}
                                                                                            >
                                                                                                <Text>{option.name}</Text>
                                                                                            </TouchableOpacity>

                                                                                        )
                                                                                ))
                                                                            }
                                                                        </ScrollView>
                                                                    </View>
                                                                </>

                                                            ) : null
                                                        ) : null
                                                    }
                                                </View>
                                            ))
                                        }

                                        {
                                            items?.options?.map((item, index) => (
                                                <View key={index}>
                                                    {
                                                        item?.type === "checkbox" ? (
                                                            item?.product_option_value?.length > 0 ? (

                                                                <>
                                                                    <View style={{ marginTop: 12 }}>
                                                                        <Text style={[commonStyles.heading, { color: Colors.headingColor }]}>{item?.name}</Text>
                                                                    </View>

                                                                    <View style={{ marginVertical: 12 }}>
                                                                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                                                            {
                                                                                item?.product_option_value?.map((option, index) => (
                                                                                    <View key={index} style={{ alignItems: 'center', gap: 5 }}>
                                                                                        <ProductColorCard
                                                                                            img={option?.image}
                                                                                            onClick={() => handleSelectedCheckBoxOptions(item?.product_option_id, option?.product_option_value_id)}
                                                                                            // borderColor={Object.values(selectedCheckboxOptions).some(arr => arr.includes(option?.product_option_value_id)) ? Colors.primary : null}
                                                                                            borderColor={isSelectError &&
                                                                                                (!selectedCheckboxOptions[
                                                                                                    `option[${item?.product_option_id}][]`
                                                                                                ] ||
                                                                                                    selectedCheckboxOptions[
                                                                                                        `option[${item?.product_option_id}][]`
                                                                                                    ]?.length == 0)
                                                                                                ? "red"
                                                                                                : Object.values(
                                                                                                    selectedCheckboxOptions
                                                                                                ).some((arr) =>
                                                                                                    arr.includes(
                                                                                                        option?.product_option_value_id
                                                                                                    )
                                                                                                )
                                                                                                    ? Colors.primary
                                                                                                    : null}
                                                                                        />

                                                                                    </View>
                                                                                ))
                                                                            }
                                                                        </ScrollView>
                                                                    </View >
                                                                </>


                                                            ) : null

                                                        ) : null
                                                    }
                                                </View>
                                            ))
                                        }


                                        {items?.options?.map((option) => {
                                            if (option?.type !== "select") return null;

                                            return (
                                                <View
                                                    key={option.product_option_id}
                                                    style={{ marginBottom: 16 }}
                                                >
                                                    {/* Option Title */}
                                                    <Text
                                                        style={[
                                                            commonStyles.heading,
                                                            { color: Colors.headingColor, marginBottom: 10, marginTop: 12 },
                                                        ]}
                                                    >
                                                        {option.name}
                                                    </Text>

                                                    {/* Option Values */}
                                                    <View
                                                        style={{
                                                            flexDirection: "row",
                                                            flexWrap: "wrap",
                                                            gap: 12,
                                                        }}
                                                    >
                                                        {option?.product_option_value?.map((value) => {
                                                            const isSelected =
                                                                selectedSelectOptions[
                                                                `option[${option.product_option_id}]`
                                                                ] === value.product_option_value_id;

                                                            return (
                                                                <OptionCard
                                                                    key={value.product_option_value_id}
                                                                    item={value}
                                                                    selected={isSelected}
                                                                    onPress={() => {
                                                                        handleSelectedSelectOptions(
                                                                            option.product_option_id,
                                                                            value.product_option_value_id
                                                                        );
                                                                        fetchProductInfo(
                                                                            option.product_option_id,
                                                                            value.product_option_value_id
                                                                        );
                                                                    }}
                                                                />
                                                            );
                                                        })}
                                                    </View>

                                                    {/* Validation Error */}
                                                    {isSelectError &&
                                                        !selectedSelectOptions[`option[${option.product_option_id}]`] && (
                                                            <Text style={{ color: "red", marginTop: 8 }}>
                                                                Please select {option.name}
                                                            </Text>
                                                        )}
                                                </View>
                                            );
                                        })}

                                    </View>
                                    <TouchableOpacity
                                        disabled={loading}
                                        onPress={() =>
                                            onClickAddToCartButtonWithOption(
                                                selectedRadioOptions,
                                                selectedCheckboxOptions,
                                                selectedSelectOptions
                                            )
                                        }
                                        style={{
                                            alignSelf: "center",
                                            borderRadius: 20,
                                            backgroundColor: Colors.primary,
                                            paddingHorizontal: 40,
                                            paddingVertical: 12,
                                            marginTop: 20,
                                        }}
                                    >
                                        <Text style={[commonStyles.textWhite_lg, Colors?.btnText]}>
                                            {GlobalText?.extrafield_cartbtn}
                                        </Text>
                                    </TouchableOpacity>

                                    {/* SUCCESS MESSAGE */}
                                    {isSuccessMessage && (
                                        <Text
                                            style={{
                                                fontSize: 18,
                                                fontWeight: "600",
                                                color: Colors.success,
                                                textAlign: "center",
                                                marginTop: 16,
                                            }}
                                        >
                                            {isSuccessMessage}
                                        </Text>
                                    )}
                                </ScrollView>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                </TouchableOpacity>
            </View>
        </Modal>
    )
}

export default AddToCartOptionUiModal