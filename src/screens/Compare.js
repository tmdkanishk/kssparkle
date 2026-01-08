import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import commonStyles from '../constants/CommonStyles'
import TitleBarName from '../components/TitleBarName'
import { useCustomContext } from '../hooks/CustomeContext'
import CustomActivity from '../components/CustomActivity'
import CustomButton from '../components/CustomButton'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData } from '../utils/storage'
import axios, { HttpStatusCode } from 'axios'
import { IconComponentImage } from '../constants/IconComponents'
import SuccessModal from '../components/SuccessModal'
import { addToCartProduct } from '../services/addToCartProduct'
import { addToCartWithOptions } from '../services/addToCartWithOptions'
import AddToCartOptionUiModal from '../components/AddToCartOptionUiModal'
import FailedModal from '../components/FailedModal'
import { addToCartWithOptionCopy } from '../services/addToCartWithOptionCopy'
import NotificationAlert from '../components/NotificationAlert'

const Compare = ({ navigation }) => {
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [loading, setLoading] = useState(false);
    const [isLabel, setLabel] = useState(false);
    const [isCommanModal, setCommanModal] = useState(false);
    const [isSuccessMessage, setSuccessMessage] = useState();
    const [isModalBtn, setModalBtn] = useState();
    const [isEnableProductDetail, setEnableProductDetail] = useState([]);
    const [isCompareList, setCompareList] = useState([]);
    const [isAddTOCartOptionModalShow, setAddTOCartOptionModalShow] = useState(false);
    const [isAddTOCartOptionResult, setAddTOCartOptionResult] = useState();
    const [productIdOption, setproductIdOption] = useState();
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [screenLoading, setScreenLoading] = useState(false);

    useEffect(() => {
        fetchCompareProductListAndText();
    }, []);

    const fetchCompareProductListAndText = async () => {
        try {
            setLoading(true);
            const url = `${BASE_URL}${EndPoint?.compare}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');
            const user = await _retrieveData("USER");
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId,
                customer_id: user ? user[0]?.customer_id : null
            }



            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setLabel(response.data?.text);
                const products = response.data?.products;
                const productArray = Object.entries(products);
                console.log("productArray", productArray);
                setCompareList(productArray);
            }

        } catch (error) {
            console.log("error compare fatch detail :", error.message);

        } finally {
            setLoading(false);
        }
    }

    const onClickShowDetail = (productId) => {
        setEnableProductDetail((prevDetails) => [...prevDetails, productId]);
    }

    const onClickHideDetail = (productId) => {
        setEnableProductDetail((prevDetails) => prevDetails.filter((id) => id !== productId));
    }

    const removeProductFromCompare = async (productId) => {
        try {
            setScreenLoading(true);
            const url = `${BASE_URL}${EndPoint?.compare_Remove}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');


            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,
            };
            const body = {
                code: lang?.code,
                currency: cur?.code,
                sessionid: sessionId,
                product_id: productId
            }

            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                console.log(response.data);
                setCompareList((prevProducts) =>
                    prevProducts.filter(([, item]) => item?.product_id !== productId)
                );

            }

        } catch (error) {
            console.log("error remove product compare :", error.message);

        } finally {
            setScreenLoading(false);
        }
    }

    const AddToCartProductFromCompare = async (productid) => {
        try {
            setScreenLoading(true);
            const result = await addToCartProduct(productid, 1, EndPoint?.cart_add);
            if (result?.success) {
                setSuccessMessage(result?.success);
                setCommanModal(true);
                setModalBtn(result?.cartokbtn_label);
            }
        } catch (error) {
            if (error.response.data?.error?.quantity) {
                setErrorMgs(error.response.data?.error?.quantity);
                setErrorModal(true);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true)
            }

        } finally {
            setScreenLoading(false);
        }
    }

    const handleAddToCartWithOption = async (productId) => {
        try {
            setScreenLoading(true);
            const results = await addToCartWithOptions(productId, EndPoint?.cart_ProductOptions);
            if (results) {
                setAddTOCartOptionResult(results);
                setAddTOCartOptionModalShow(true);
                setproductIdOption(productId);
            }
        } catch (error) {
            setErrorMgs(GlobalText?.extrafield_somethingwrong);
            setErrorModal(true)
        } finally {
            setScreenLoading(false);
        }
    }

    const closeModal = () => {
        setSuccessMessage();
        setCommanModal(false);
        setModalBtn();
    }

    return (
        <>
            {
                loading ? (
                    <CustomActivity />
                ) : (
                    <>
                        <View style={[commonStyles.bodyConatiner]}>
                            <TitleBarName titleName={isLabel?.comparisonpagename_label} onClickBackIcon={() => navigation.goBack()} />
                            <View style={{ paddingHorizontal: 12 }}>
                                <ScrollView style={{ marginBottom: 100, opacity: screenLoading ? 0.5 : 1 }} showsVerticalScrollIndicator={false} >
                                    <View style={{ marginVertical: 24, gap: 12 }}>
                                        <Text style={commonStyles.heading}>{isLabel?.comparison_heading}</Text>
                                        {
                                            isCompareList?.length > 0 ? (
                                                isCompareList?.map(([id, product]) => (
                                                    <View key={id} style={{ gap: 10, marginTop: 12, borderWidth: 1, padding: 10, borderRadius: 10, borderColor: Colors?.gray }}>
                                                        <TouchableOpacity disabled={screenLoading} onPress={() => navigation.navigate("Product", { productId: product?.product_id })} style={{ width: 120, height: 120, alignItems: 'center', justifyContent: 'center', alignSelf: 'center' }}>
                                                            {
                                                                product?.thumb ? (<Image source={{ uri: product?.thumb }} style={{ width: '100%', height: '100%' }} />) : (
                                                                    <IconComponentImage />
                                                                )
                                                            }

                                                        </TouchableOpacity>
                                                        <View style={{ gap: 12, }}>
                                                            <TouchableOpacity disabled={screenLoading} onPress={() => navigation.navigate("Product", { productId: product?.product_id })} style={{ flexDirection: 'row', width: '100%', borderTopWidth: 1, borderColor: Colors?.gray, paddingVertical: 5 }}>
                                                                <Text style={[commonStyles.smallHeading, { width: '25%' }]}>{isLabel?.comparelistproduct_label} :</Text>
                                                                <Text style={[commonStyles.smallHeading, { width: '75%' }]}>{product?.name}</Text>
                                                            </TouchableOpacity>
                                                            <View style={{ flexDirection: 'row', width: '100%', borderTopWidth: 1, borderColor: Colors?.gray, paddingVertical: 5 }}>
                                                                <Text style={[commonStyles.text_lg, { width: '25%' }]}>{isLabel?.comparelistprice_label} :</Text>
                                                                <Text style={[commonStyles.text_lg, { width: '75%' }]}>{product?.price}</Text>
                                                            </View>
                                                            {
                                                                isEnableProductDetail.includes(id) ? (
                                                                    <>
                                                                        {
                                                                            product?.productsdetail?.length > 0 ? (
                                                                                product?.productsdetail?.map((item, index) => (
                                                                                    item?.value && item?.text != 'Attribute' ? (
                                                                                        <View key={index} style={{ flexDirection: 'row', width: '100%', borderTopWidth: 1, borderColor: Colors?.gray, paddingVertical: 5, justifyContent: 'space-between', }}>
                                                                                            <Text style={[commonStyles.text_lg, { width: '49%' }]}>{item?.text} :</Text>
                                                                                            <Text style={[commonStyles.text_lg, { width: '49%' }]}>{item?.value}</Text>
                                                                                        </View>
                                                                                    ) : null
                                                                                ))
                                                                            ) : null
                                                                        }

                                                                        <TouchableOpacity disabled={screenLoading} onPress={() => onClickHideDetail(id)} style={{ width: '100%', backgroundColor: Colors?.btnBgColor, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                                            <Text style={{ color: Colors?.btnText }}>{isLabel?.comparehidedetailbtn_label}</Text>
                                                                        </TouchableOpacity>

                                                                    </>
                                                                ) : (<TouchableOpacity disabled={screenLoading} onPress={() => onClickShowDetail(id)} style={{ width: '100%', backgroundColor: Colors?.btnBgColor, height: 46, borderRadius: 10, justifyContent: 'center', alignItems: 'center' }}>
                                                                    <Text style={{ color: Colors?.btnText }}>{isLabel?.compareshowdetailbtn_label}</Text>
                                                                </TouchableOpacity>)
                                                            }

                                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 12 }}>
                                                                <CustomButton
                                                                    btnDisabled={screenLoading}
                                                                    OnClickButton={() => removeProductFromCompare(product?.product_id)}
                                                                    buttonText={isLabel?.compareremovebtn_label}
                                                                    btnTextStyle={{ color: Colors?.btnText, fontSize: 16 }}
                                                                    buttonStyle={{ w: '48%', h: 46, backgroundColor: 'red', borderRadius: 10, }}
                                                                />
                                                                <CustomButton
                                                                    btnDisabled={screenLoading}
                                                                    OnClickButton={() => product?.optionsstatus ? handleAddToCartWithOption(product?.product_id) : AddToCartProductFromCompare(product?.product_id)}
                                                                    buttonText={isLabel?.compareaddtocartbtn_label}
                                                                    btnTextStyle={{ color: Colors?.btnText, fontSize: 16 }}
                                                                    buttonStyle={{ w: '48%', h: 46, backgroundColor: Colors?.primary, borderRadius: 10, }}
                                                                />
                                                            </View>
                                                            <View>
                                                            </View>
                                                        </View>
                                                    </View>
                                                ))
                                            ) : (
                                                <Image source={require('../assets/images/notfound.png')} style={{ width: 200, height: 200, resizeMode: 'contain', alignSelf: 'center' }} />
                                            )
                                        }
                                    </View>
                                </ScrollView>
                            </View>
                        </View>

                        <SuccessModal
                            btnName={isModalBtn}
                            isModal={isCommanModal}
                            isSuccessMessage={isSuccessMessage}
                            onClickClose={closeModal}
                            handleCloseModal={closeModal}
                        />

                        <AddToCartOptionUiModal
                            items={isAddTOCartOptionResult}
                            closeModal={() => setAddTOCartOptionModalShow(false)}
                            isModalVisibal={isAddTOCartOptionModalShow}
                            productId={productIdOption}
                        />

                        <FailedModal
                            isModal={isErrorModal}
                            isSuccessMessage={isErrorMgs}
                            handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
                            onClickClose={() => { setErrorModal(false); setErrorMgs() }}
                        />
                        <NotificationAlert />
                    </>
                )
            }

        </>

    )
}

export default Compare