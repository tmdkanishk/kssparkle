import {
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  Share,
  Alert,
  Platform,
  StyleSheet,
  Image,
  useWindowDimensions,
  Animated,
} from "react-native";
import React, { useCallback, useRef, useState } from "react";
import TopStatusBar from "../components/TopStatusBar";
import commonStyles from "../constants/CommonStyles";
import BottomBar from "../components/BottomBar";
import SearchBarSection from "../components/SearchBarSection";
import AntDesign from "@expo/vector-icons/AntDesign";
import ProductInfoTag from "../components/ProductInfoTag";
import ProductColorCard from "../components/ProductColorCard";
import ReviewCard from "../components/ReviewCard";
import CustomButton from "../components/CustomButton";
import CustomeButtonWithIcon from "../components/CustomeButtonWithIcon";
import Feather from "@expo/vector-icons/Feather";
import ProductCarusal from "../components/ProductCarusal";
import { useCustomContext } from "../hooks/CustomeContext";
import axios, { HttpStatusCode } from "axios";
import { API_KEY, BASE_URL } from "../utils/config";
import CustomActivity from "../components/CustomActivity";
import { checkAutoLogin, formatDate, formatDescription } from "../utils/helpers";
import { IconComponentClose, IconComponentNotification, IconComponentPlayBtn } from "../constants/IconComponents";
import { Picker } from "@react-native-picker/picker";
import { _clearData, _retrieveData, _storeData } from "../utils/storage";
import { useFocusEffect } from "@react-navigation/native";
import { shareUrl } from "../services/shareUrl";
import { addCompareProduct } from "../services/addCompareProduct";
import { addToCartProduct } from "../services/addToCartProduct";
import SuccessModal from "../components/SuccessModal";
import ProductCardList from "../components/ProductCardList";
import { getAllReview } from "../services/getAllReview";
import FailedModal from "../components/FailedModal";
import { addToCartWithOptionCopy } from "../services/addToCartWithOptionCopy";
import DropdownComponent from "../components/DropdownComponent";
import DropDownCustomComponent from "../components/DropDownCustomComponent";
import { getProductVideo } from "../services/getProductVideo";
import OpenUrlInModal from "../components/OpenUrlInModal";
import { logout } from "../services/logout";
import NotificationAlert from "../components/NotificationAlert";
import { getProductInfo } from "../services/getProductInfo";
// import HTMLView from "react-native-htmlview";
import NotifyModal from "../components/NotifyModal";
import { getNotifyText } from "../services/getNotifyText";
import { useCartCount } from "../hooks/CartContext";

const Product = ({ navigation, route }) => {
  const { productId } = route.params;
  const { updateCartCount } = useCartCount();
  // const { width } = useWindowDimensions();
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const [isDescriptionVisible, setDescriptionVisible] = useState(true);
  const [isSpecificationVisible, setSpecificationVisible] = useState([]);
  const [isSeeMoreBtn, setSeeMoreBtn] = useState(false);
  const [isReviewVisible, setReviewVisible] = useState(false);
  const [productDetail, setProductDetail] = useState();
  const [loading, setLoading] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [changeLang, setChangeLang] = useState();
  const [changeCurren, setChangeCurrency] = useState();
  const [isShowModal, setShowModal] = useState(false);
  const [isModalMessage, setModalMessage] = useState();
  const [isComapreNavigate, setComapreNavigate] = useState(false);
  const [isQtySize, setQtySize] = useState("1");
  const [productReviewList, setProductReviewList] = useState([]);
  const [isProductReviewModalLoader, setProductReviewModalLoader] = useState(false);
  const [isProductReviewCurrentPage, setProductReviewCurrentPage] = useState(1);
  const [isCartAnimation, setCartAnimation] = useState(false);
  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorMgs, setErrorMgs] = useState();
  const [isSelectError, setSelectError] = useState(false);
  const [selectedRadioOptions, setSelectedRadioOptions] = useState({});
  const [selectedCheckboxOptions, setselectedCheckboxOptions] = useState({});
  const [selectedSelectOptions, setselectedSelectOptions] = useState({});
  const [selectedValue, setSelectedValue] = useState(null);
  const [isVideoList, setVideoList] = useState(null);
  const [isOpenUrlModal, setOpenUrlModal] = useState(false);
  const [isVideoUrl, setVideoUrl] = useState(null);
  const [isSpecificationShow, setSpecificationShow] = useState(false);
  const scrollViewRef = useRef(null);
  const section1Ref = useRef(null);
  const [upadtedPrice, setUpdatedPrice] = useState(null);
  const [upadtedSpecialPrice, setUpadtedSpecialPrice] = useState(null);
  const [upadtedProductInfo, setUpadtedProductInfo] = useState(null);
  const [descriptionData, setDescriptionData] = useState(null);
  const [notifyVisible, setNotifyVisible] = useState(false);
  const [notifyText, setNotifyText] = useState(null);
  const [itemCardLoading, setItemCardLoading] = useState(null);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const scrollY = useRef(new Animated.Value(0)).current;


  useFocusEffect(
    useCallback(() => {
      checkAutoLogin();
      fetchProductDetail();
      fetchProductVideo();
      fetchNotifyText();
    }, [changeCurren, changeLang])
  );

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      console.log("prduct id ", productId);
      const url = `${BASE_URL}${EndPoint?.productdetails}`;
      const lang = await _retrieveData("SELECT_LANG");
      const cur = await _retrieveData("SELECT_CURRENCY");
      const user = await _retrieveData("USER");
      const sessionId = await _retrieveData('SESSION_ID');
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Key: API_KEY,
      };

      const body = {
        product_id: productId,
        code: lang?.code,
        currency: cur?.code,
        sessionid: sessionId,
        customer_id: user ? user[0]?.customer_id : null,
      };


      const response = await axios.post(url, body, { headers: headers });
      if (response.status === HttpStatusCode.Ok) {
        setProductDetail(response.data);
        setDescriptionData(response.data?.description);
        setRelatedProduct(response.data?.products);
      }
    } catch (error) {
      setErrorMgs(GlobalText?.extrafield_somethingwrong);
      setErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOnChangeLang = (value) => {
    setChangeLang(value);
  };

  const handleOnChangeCurrency = (value) => {
    setChangeCurrency(value);
  };



  const onDescriptionToggle = () => {
    // if (isDescriptionVisible == false) {
    //   getProductDescriptionData();
    // }

    setDescriptionVisible(!isDescriptionVisible);
    setSeeMoreBtn(false);
  };

  const onSpecificationToggle = (indexValue) => {
    setSpecificationVisible((prevNumbers) =>
      prevNumbers.includes(indexValue)
        ? prevNumbers.filter((n) => n !== indexValue)
        : [...prevNumbers, indexValue]
    );
  };

  const onReviewToggle = () => {
    setReviewVisible(!isReviewVisible);
  };

  const cartIconComponent = () => {
    return (
      <Feather name="shopping-cart" size={24} color={Colors.cartBtnText} />
    );
  };

  const shareProductDetail = async () => {
    try {
      const reponse = await shareUrl(productId, EndPoint?.share);
      if (reponse) {
        const result = await Share.share({
          message: reponse?.response,
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            console.log("Shared with activity type:", result.activityType);
          } else {
            console.log("Shared successfully!");
          }
        } else if (result.action === Share.dismissedAction) {
          console.log("Share dismissed.");
        }
      }
    } catch (error) {
      Alert.alert("", GlobalText?.extrafield_somethingwrong, [{ text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }]);

    }
  };

  const onClickComnpareBtn = async (productId) => {
    try {
      setItemCardLoading(productId);
      const retult = await addCompareProduct(productId, EndPoint?.compare_add);
      setModalMessage(retult);
      setComapreNavigate(true);
      setShowModal(true);
    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setItemCardLoading(null);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setComapreNavigate(false);
    setModalMessage();
    setCartAnimation(false);
  };

  const onclickModalBtn = () => {
    setShowModal(false);
    setComapreNavigate(false);
    setModalMessage();
    navigation.navigate("Compare");
  };

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      navigation.navigate("Search", { query: query });
    } catch (error) {
      console.log("Search results:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onClickCartBtn = async (productId) => {
    try {
      const response = await addToCartProduct(productId, isQtySize, EndPoint?.cart_add);
      console.log("response", response);
      if (response?.success) {
        updateCartCount(response?.cartproductcount)
        setModalMessage(response);
        setShowModal(true);
        setCartAnimation(true);
        setTimeout(() => {
          closeModal();
        }, 2000)
      }
    } catch (error) {
      console.log("error add to cart:", error.response.data);
      if (error.response.data?.error?.quantity) {
        setErrorMgs(error.response.data?.error?.quantity);
        setErrorModal(true);
      } else {
        setErrorMgs(GlobalText?.extrafield_somethingwrong);
        setErrorModal(true);
      }

    }
  };

  const onClickBuyBtn = async (productId) => {
    try {
      setLoading(true);
      const response = await addToCartProduct(
        productId,
        isQtySize,
        EndPoint?.cart_add
      );
      if (response?.success) {
        updateCartCount(response?.cartproductcount);
        navigation.navigate("Checkout");
      }
    } catch (error) {
      if (error.response.data?.error?.quantity) {
        setErrorMgs(error.response.data?.error?.quantity);
        setErrorModal(true);
      } else {
        setErrorMgs(GlobalText?.extrafield_somethingwrong);
        setErrorModal(true);
      }

    } finally {
      setLoading(false);
    }
  };

  const onClickBuyButtonWithOptionProductDetailCopy = async (
    selectedRadioOptions,
    selectedCheckboxOptions,
    selectedSelectOptions
  ) => {
    try {
      setItemCardLoading(productId);
      const results = await addToCartWithOptionCopy(
        productId,
        isQtySize,
        selectedRadioOptions,
        selectedCheckboxOptions,
        selectedSelectOptions,
        EndPoint?.cart_add
      );
      if (results?.success) {
        updateCartCount(results?.cartproductcount);
        navigation.navigate("Checkout");
      }
    } catch (error) {

      if (error.response.data?.error?.quantity) {
        setErrorMgs(error.response.data?.error?.quantity);
        setErrorModal(true);
      } else {
        setSelectError(true);
        setErrorMgs(GlobalText?.extrafield_somethingwrong);
        setErrorModal(true);
        scrollToRef(section1Ref);
      }
    } finally {
      setItemCardLoading(null);
    }
  };

  const onClickAddToCartButtonWithOptionProductDetailCopy = async (
    selectedRadioOptions,
    selectedCheckboxOptions,
    selectedSelectOptions
  ) => {
    try {
      setItemCardLoading(productId);
      const results = await addToCartWithOptionCopy(
        productId,
        isQtySize,
        selectedRadioOptions,
        selectedCheckboxOptions,
        selectedSelectOptions,
        EndPoint?.cart_add
      );
      console.log(results);
      if (results?.success) {
        updateCartCount(results?.cartproductcount);
        setModalMessage(results);
        setShowModal(true);
        setCartAnimation(true);
        setTimeout(() => {
          closeModal();
        }, 2000)

      }
    } catch (error) {
      if (error.response.data?.error?.quantity) {
        setErrorMgs(error.response.data?.error?.quantity);
        setErrorModal(true);
      } else {
        console.log("error", error.response.data);
        scrollToRef(section1Ref);
        setSelectError(true);
        setErrorModal(true);
        setErrorMgs(GlobalText?.extrafield_somethingwrong);
      }

    } finally {
      setItemCardLoading(null);
    }


  };

  const handleSelectedRadioOptions = (
    productOptionId,
    productOptionValueId
  ) => {
    console.log(
      "productOptionId, productOptionValueId",
      productOptionId,
      productOptionValueId
    );
    setSelectedRadioOptions((prev) => ({
      ...prev,
      [`option[${productOptionId}]`]: productOptionValueId,
    }));
  };

  const handleSelectedCheckBoxOptions = (
    productOptionId,
    productOptionValueId
  ) => {
    console.log(
      "productOptionId, productOptionValueId",
      productOptionId,
      productOptionValueId
    );
    setselectedCheckboxOptions((prev) => {
      const currentSelections = prev[`option[${productOptionId}][]`] || [];
      if (currentSelections.includes(productOptionValueId)) {
        // Remove if already selected
        return {
          ...prev,
          [`option[${productOptionId}][]`]: currentSelections.filter(
            (id) => id !== productOptionValueId
          ),
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          [`option[${productOptionId}][]`]: [
            ...currentSelections,
            productOptionValueId,
          ],
        };
      }
    });
  };

  const handleSelectedSelectOptions = (
    productOptionId,
    productOptionValueId
  ) => {
    console.log(
      "productOptionId, productOptionValueId",
      productOptionId,
      productOptionValueId
    );
    setselectedSelectOptions((prev) => ({
      ...prev,
      [`option[${productOptionId}]`]: productOptionValueId,
    }));
  };



  const fetchAllProductReview = async (productId, page) => {
    try {
      setProductReviewModalLoader(true);
      const result = await getAllReview(
        productId,
        page,
        EndPoint?.productdetails_ProductMoreReviewlist
      );
      setProductReviewList((preview) => [
        ...preview,
        ...result?.reviews_detail,
      ]);
    } catch (error) {
      setErrorMgs(GlobalText?.extrafield_somethingwrong);
      setErrorModal(true);
    } finally {
      setProductReviewModalLoader(false);
    }
  };

  const onClickLoadMore = (productId, page) => {
    fetchAllProductReview(productId, page);
    setProductReviewCurrentPage(page);
  };

  const onCloseReviewModal = () => {
    setProductReviewList([]);
    setProductReviewCurrentPage(1);
    setReviewModalVisible(false);
  };

  const fetchProductVideo = async () => {
    try {
      const response = await getProductVideo(
        productId,
        EndPoint?.tmdproductvideo
      );
      setVideoList(response?.videos);
    } catch (error) {
      // console.log("error :", error.response.data)
    }
  };


  const onPlayVideo = (videoUrl) => {
    console.log("videoUrl", videoUrl);
    setVideoUrl(videoUrl);
    setOpenUrlModal(true);
  };


  const scrollToRef = (ref) => {

    ref.current.measureLayout(
      scrollViewRef.current,
      (x, y) => {
        scrollViewRef.current.scrollTo({ y, animated: true });

      },
      (error) => {
        console.log('Measure error:', error);
      }
    );
  };

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


  const fetchNotifyText = async () => {
    try {
      const response = await getNotifyText(productId, EndPoint?.awis);
      console.log("response notify:", response?.stockalert);
      setNotifyText(response?.stockalert);
    } catch (error) {
      console.log("error", error.response.data);
    }

  }



  return (
    <>
      {
        loading ? (
          <CustomActivity />
        ) :
          (
            <>
              <View style={[commonStyles.bodyConatiner]}>
                <View style={{ paddingHorizontal: 12, backgroundColor: "#F5F5F5" }}>
                  <TopStatusBar
                    onChangeCurren={handleOnChangeCurrency}
                    onChangeLang={handleOnChangeLang}
                    scrollY={scrollY}
                  />
                </View>
                <SearchBarSection
                  onClickSearch={(query) => handleSearch(query)}
                  isCartAnimation={isCartAnimation}
                />
                <Animated.ScrollView
                  showsVerticalScrollIndicator={false}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                  )}
                  ref={scrollViewRef}
                >
                  <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewRef} style={{ opacity: itemCardLoading === productId ? 0.5 : 1 }}>
                    <View>
                      {productDetail?.images?.length > 0 ? (
                        <ProductCarusal
                          productid={productId}
                          isLoading={itemCardLoading}
                          data={productDetail?.images}
                          lowestTag={productDetail?.off >= 50 ? productDetail?.prodpage_lowestprice_text : ""}
                          handleShareBtn={shareProductDetail}
                          handleCompareBtn={() => onClickComnpareBtn(productDetail?.product_id)}
                          totalRating={productDetail?.rating}
                          totalReview={productDetail?.reviews}
                          itemdetail={productDetail}
                        />
                      ) : null}
                    </View>

                    <View style={{ marginBottom: 180, paddingHorizontal: 12 }}>
                      {productDetail?.quantity == 0 && <TouchableOpacity onPress={() => setNotifyVisible(true)} style={{ padding: 10, backgroundColor: Colors.lightGray, flexDirection: 'row', gap: 10 }}>
                        <IconComponentNotification size={20} color={Colors.primary} />
                        <Text style={{ fontWeight: '500' }}>{notifyText?.awis_alert_msg}</Text>
                      </TouchableOpacity>}
                      <Text
                        style={[
                          commonStyles.heading_lg,
                          { marginTop: 12, color: Colors.headingColor },
                        ]}
                      >
                        {productDetail?.heading_title}
                      </Text>

                      {/* {
                      productDetail?.discounts?.length > 0 && (
                        <View style={{ marginTop: 12, gap: 5 }}>
                          {
                            productDetail?.discounts?.map((item, index) => (
                              <Text key={index} style={{ fontSize: 16, fontWeight: '600', color: 'green' }}>{item?.quantity} {item?.text1} {item?.price}{item?.text2}</Text>
                            ))
                          }

                          {
                            productDetail?.discount3_text && <Text style={{ fontSize: 16, fontWeight: '400' }}>{productDetail?.discount3_text}</Text>
                          }
                        </View>
                      )
                    } */}

                      {/* price and Qnty  */}

                      <View
                        style={{
                          width: "100%",
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View
                          style={{
                            width: "49%",
                            flexDirection: "row",
                            flexWrap: "wrap",
                          }}
                        >
                          <View>
                            <Text>{'Cijena'}</Text>
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 8,
                                alignItems: "baseline",
                                flexWrap: 'wrap'
                              }}
                            >

                              {(upadtedSpecialPrice != false && upadtedSpecialPrice != null) || productDetail?.special !== false ? (
                                <Text style={[commonStyles.smallHeading, { fontWeight: "400", color: '#000000', textDecorationLine: 'line-through' }]}>
                                  {upadtedPrice || productDetail?.price}
                                </Text>
                              ) : null}

                              <Text style={[commonStyles.heading_lg, { color: productDetail?.special === false ? '#000000' : '#DD0017', fontSize: 20 }]}>
                                {upadtedSpecialPrice === false || productDetail?.special === false
                                  ? upadtedPrice || productDetail?.price
                                  : upadtedSpecialPrice || productDetail?.special}
                              </Text>




                            </View>
                            <Text style={commonStyles.text}>
                              ({productDetail?.prodpage_inclusivetax})
                            </Text>
                          </View>

                        </View>

                        {productDetail?.options ? (
                          <View style={{ width: "35%" }}>
                            {
                              // Platform.OS === "ios" ? 
                              (
                                <DropdownComponent
                                  setQtySize={setQtySize}
                                  isQtySize={isQtySize}
                                />
                              )
                            }
                          </View>
                        ) : null}
                      </View>
                      {/* price and Qnty  */}


                      {/* options dropdown  */}

                      {productDetail?.options?.map((item, index) => (
                        <View ref={section1Ref} key={index} >
                          {item?.type === "radio" ? (
                            item?.product_option_value?.length > 0 ? (
                              <>
                                <View style={{ marginTop: 12 }}>
                                  <Text
                                    style={[
                                      commonStyles.heading,
                                      { color: Colors.headingColor },
                                    ]}
                                  >
                                    {item?.name}
                                  </Text>
                                </View>

                                <View
                                  style={{
                                    flexDirection: "row",
                                    marginVertical: 12,
                                    gap: 10,
                                  }}
                                >
                                  <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                  >
                                    {item?.product_option_value?.map(
                                      (option, index) => (
                                        <View
                                          key={index}
                                          style={{ alignItems: "center", marginLeft: index === 0 ? 0 : 10, }}
                                        >
                                          {option?.image ? (
                                            <>
                                              <ProductColorCard
                                                img={option.image}
                                                onClick={() =>
                                                  handleSelectedRadioOptions(
                                                    item?.product_option_id,
                                                    option?.product_option_value_id
                                                  )
                                                }
                                                item={option?.product_option_value_id}
                                                borderColor={
                                                  selectedRadioOptions[
                                                    `option[${item?.product_option_id}]`
                                                  ] ===
                                                    option?.product_option_value_id
                                                    ? Colors.primary
                                                    : null || isSelectError &&
                                                      !selectedRadioOptions[
                                                      `option[${item?.product_option_id}]`
                                                      ]
                                                      ? "red"
                                                      : null
                                                }
                                              />
                                              <Text
                                                style={{
                                                  // color:
                                                  //   isSelectError &&
                                                  //   !selectedRadioOptions[
                                                  //     `option[${item?.product_option_id}]`
                                                  //   ]
                                                  //     ? "red"
                                                  //     : null 
                                                }}
                                              >
                                                {option?.name}
                                              </Text>
                                            </>
                                          ) : (
                                            <TouchableOpacity
                                              onPress={() =>
                                                handleSelectedRadioOptions(
                                                  item?.product_option_id,
                                                  option?.product_option_value_id
                                                )
                                              }
                                              style={{
                                                padding: 2,
                                                width: 60,
                                                height: 60,
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                justifyContent: "center",
                                                alignItems: "center",
                                                marginLeft: index == 0 ? 0 : 10,
                                                borderColor:
                                                  selectedRadioOptions[
                                                    `option[${item?.product_option_id}]`
                                                  ] ===
                                                    option?.product_option_value_id
                                                    ? Colors.primary
                                                    : isSelectError && !selectedRadioOptions[`option[${item?.product_option_id}]`] ? "red" : Colors?.gray
                                              }}
                                            >
                                              <Text
                                                style={{
                                                  textAlign: 'center',
                                                }}
                                              >
                                                {option?.name}
                                              </Text>
                                            </TouchableOpacity>
                                          )}
                                        </View>
                                      )
                                    )}
                                  </ScrollView>
                                </View>
                              </>
                            ) : null
                          ) : null}
                        </View>
                      ))}

                      {productDetail?.options?.map((item, index) => (
                        <View key={index}>
                          {item?.type === "checkbox" ? (
                            item?.product_option_value?.length > 0 ? (
                              <>
                                <View style={{ marginTop: 12 }}>
                                  <Text
                                    style={[
                                      commonStyles.heading,
                                      { color: Colors.headingColor },
                                    ]}
                                  >
                                    {item?.name}
                                  </Text>
                                </View>

                                <View style={{ marginVertical: 12 }}>
                                  <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                  >
                                    {item?.product_option_value?.map(
                                      (option, index) => (
                                        <View
                                          key={index}
                                          style={{ alignItems: "center", gap: 5 }}
                                        >
                                          <ProductColorCard
                                            img={option?.image}
                                            onClick={() =>
                                              handleSelectedCheckBoxOptions(
                                                item?.product_option_id,
                                                option?.product_option_value_id
                                              )
                                            }
                                            borderColor={
                                              isSelectError &&
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
                                                  : null
                                            }
                                          />
                                        </View>
                                      )
                                    )}
                                  </ScrollView>
                                </View>
                              </>
                            ) : null
                          ) : null}
                        </View>
                      ))}

                      {productDetail?.options?.map((item, index) => (
                        <View key={index}>
                          {item?.type === "select" ? (
                            item?.product_option_value?.length > 0 ? (
                              <>
                                <View style={{ marginVertical: 12 }}>
                                  <Text
                                    style={[
                                      commonStyles.heading,
                                      { color: Colors.headingColor },
                                    ]}
                                  >
                                    {item?.name}
                                  </Text>
                                </View>

                                {Platform.OS == "ios" ? (
                                  <DropDownCustomComponent
                                    selectedValue={selectedValue}
                                    setSelectedValue={setSelectedValue}
                                    data={item?.product_option_value}
                                    handleSelectedSelectOptions={(itemvalue) => { handleSelectedSelectOptions(item?.product_option_id, itemvalue); fetchProductInfo(item?.product_option_id, itemvalue) }}
                                    borderColor={
                                      isSelectError &&
                                        (selectedSelectOptions[
                                          `option[${item?.product_option_id}]`
                                        ] == 0 ||
                                          !selectedSelectOptions[
                                          `option[${item?.product_option_id}]`
                                          ])
                                        ? "red" : Object.keys(selectedSelectOptions).length === 0 ? Colors?.gray : Colors?.primary
                                    }
                                  />
                                ) : (
                                  <View
                                    style={{
                                      marginVertical: 12,
                                      borderWidth: 1,
                                      padding: 5,
                                      borderRadius: 10,
                                      borderColor:
                                        isSelectError &&
                                          (selectedSelectOptions[
                                            `option[${item?.product_option_id}]`
                                          ] == 0 ||
                                            !selectedSelectOptions[
                                            `option[${item?.product_option_id}]`
                                            ])
                                          ? "red" : Object.keys(selectedSelectOptions).length === 0 ? Colors?.gray : Colors?.primary

                                    }}
                                  >
                                    <Picker
                                      style={{
                                        height: 50,
                                        width: "100%",
                                      }}
                                      onValueChange={(itemvalue) => { handleSelectedSelectOptions(item?.product_option_id, itemvalue); fetchProductInfo(item?.product_option_id, itemvalue) }
                                      }
                                      selectedValue={
                                        selectedSelectOptions[
                                        `option[${item?.product_option_id}]`
                                        ]
                                      }
                                    >
                                      <Picker.Item
                                        label={`-- ${item?.name} --`}
                                        value={"0"}
                                      />
                                      {item?.product_option_value.map(
                                        (data, index) => (
                                          <Picker.Item
                                            key={index.toString()}
                                            label={data?.name}
                                            value={data?.product_option_value_id}
                                          />
                                        )
                                      )}
                                    </Picker>
                                  </View>
                                )}
                              </>
                            ) : null
                          ) : null}
                        </View>
                      ))}

                      {/* options dropdown  */}




                      <View style={{ gap: 10, marginVertical: 24 }}>
                        {
                          upadtedProductInfo ? (
                            upadtedProductInfo?.length > 0 &&
                            upadtedProductInfo?.map((item, index) => item?.value && (
                              <ProductInfoTag
                                key={index}
                                heading={item?.text}
                                value={item?.value}
                                valueColor={Colors.primary}
                              />
                            ))) : (

                            productDetail?.productsdetail?.length > 0 && (
                              productDetail?.productsdetail?.map((item, index) => item?.value && (
                                <ProductInfoTag
                                  key={index}
                                  heading={item?.text}
                                  value={item?.value}
                                  valueColor={Colors.primary}
                                />
                              ))
                            ))
                        }

                      </View>




                      <View
                        style={{
                          borderTopWidth: 5,
                          borderColor: Colors.gray,
                          marginTop: 12,

                        }}
                      />

                      {isVideoList?.length > 0 && <View
                        style={{
                          marginVertical: 12,
                          width: "100%",
                          height: 120,
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",

                        }}
                      >
                        <ScrollView
                          horizontal={true}
                          showsHorizontalScrollIndicator={false}
                          contentContainerStyle={{ gap: 12 }}
                        >
                          {isVideoList?.length > 0
                            ? isVideoList?.map((item, index) => (
                              <TouchableOpacity

                                onPress={() => onPlayVideo(item?.src_uploaded || item?.src_vimeo || item?.src_youtube)}
                                key={index}
                                style={{ position: 'relative', borderRadius: 10, width: 100, height: 100, borderWidth: 1, justifyContent: 'center', alignItems: 'center', borderColor: Colors?.gray, elevation: 2, backgroundColor: 'white', padding: 2 }}
                              >


                                <Image
                                  source={{ uri: item?.popup }}
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    resizeMode: "cover",
                                    borderRadius: 10
                                  }}
                                />

                                <View style={{ position: 'absolute', }}>
                                  <IconComponentPlayBtn size={42} color={Colors?.cartBtnBgColor} />
                                </View>
                              </TouchableOpacity>
                            ))
                            : null}
                        </ScrollView>
                      </View>}

                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: Colors.gray,
                          zIndex: -1,
                          paddingBottom: isDescriptionVisible ? 10 : 0
                        }}
                      >
                        {productDetail?.description && productDetail?.prodpage_descriptiontab_text && <TouchableOpacity
                          onPress={onDescriptionToggle}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 16,
                          }}
                        >
                          <Text
                            style={[
                              commonStyles.heading,
                              { color: Colors.headingColor },
                            ]}
                          >
                            {productDetail?.prodpage_descriptiontab_text}
                          </Text>
                          {!isDescriptionVisible ? (
                            <AntDesign name="down" size={24} color="black" />
                          ) : (
                            <AntDesign name="up" size={24} color="black" />
                          )}
                        </TouchableOpacity>}

                        {isDescriptionVisible ? (

                          <ScrollView>
                            {/* <HTMLView
                              value={descriptionData || ''}
                              onLinkPress={(url) => {
                                console.log('Link clicked:', url);
                              }}

                              renderNode={(node, index, siblings, parent, defaultRenderer) => {
                                if (node.name === 'p') {
                                  return (
                                    <Text key={index} style={{ margin: 0, padding: 10, lineHeight: 18 }}>
                                      {defaultRenderer(node.children, parent)}
                                    </Text>
                                  );
                                }

                                if (node.name === 'h1' || node.name === 'h2') {
                                  return (
                                    <Text key={index} style={{ margin: 0, padding: 10, lineHeight: 36 }}>
                                      {defaultRenderer(node.children, parent)}
                                    </Text>
                                  );
                                }

                                if (node.name === 'h3' || node.name === 'h4') {
                                  return (
                                    <Text key={index} style={{ margin: 0, padding: 10, lineHeight: 30 }}>
                                      {defaultRenderer(node.children, parent)}
                                    </Text>
                                  );
                                }

                                if (node.name === 'h5' || node.name === 'h6') {
                                  return (
                                    <Text key={index} style={{ margin: 0, padding: 10, lineHeight: 26 }}>
                                      {defaultRenderer(node.children, parent)}
                                    </Text>
                                  );
                                }

                                // Images
                                if (node.name === 'img') {
                                  const src = node.attribs?.src;
                                  if (src) {
                                    return (
                                      <View key={index} style={{ alignItems: 'center', marginVertical: 16 }}>
                                        <Image
                                          key={index}
                                          source={{ uri: src }}
                                          style={{ width: 120, height: 100, marginVertical: 16, marginBottom: 12, resizeMode: 'contain', }}
                                        />
                                      </View>
                                    );
                                  }
                                }
                                return undefined; // fall back to default
                              }}
                            /> */}

                          </ScrollView>
                        ) : null}
                      </View>

                      {productDetail?.prodpage_specificationtab_text && productDetail?.attribute_groups?.length > 0 && <TouchableOpacity onPress={() => setSpecificationShow(!isSpecificationShow)}
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingVertical: 16,
                          borderBottomWidth: 1,
                          borderColor: Colors.gray,
                          zIndex: -1,
                        }}>
                        <Text style={[
                          commonStyles.heading,
                          { color: Colors.headingColor },
                        ]}>{productDetail?.prodpage_specificationtab_text}</Text>
                        <AntDesign name={isSpecificationShow ? "up" : "down"} size={24} color="black" />

                      </TouchableOpacity>}

                      {
                        isSpecificationShow && <View style={{ marginVertical: 12 }}>
                          {
                            productDetail?.attribute_groups?.length > 0
                              ? productDetail?.attribute_groups?.map((item, index) => (
                                <View
                                  key={index}
                                  style={{
                                    width: '100%',
                                  }}
                                >
                                  <Text
                                    style={[
                                      commonStyles.heading,
                                      { color: Colors.headingColor },
                                    ]}
                                  >
                                    {item?.name}
                                  </Text>
                                  <View
                                    style={{
                                      width: "100%",
                                      borderColor: Colors.gray,
                                      borderWidth: 1,
                                      marginVertical: 16,

                                    }}
                                  >
                                    {item?.attribute?.length > 0
                                      ? item?.attribute?.map((attItem, index) => (
                                        <View
                                          key={index}
                                          style={{
                                            width: "100%",
                                            flexDirection: "row",
                                          }}
                                        >
                                          <View
                                            style={{
                                              borderRightWidth: 1,
                                              borderColor: Colors.gray,
                                              width: "50%",
                                            }}
                                          >
                                            <View
                                              style={{
                                                flex: 1,
                                                borderColor: Colors.gray,
                                                borderBottomWidth:
                                                  item?.attribute?.length - 1 ===
                                                    index
                                                    ? 0
                                                    : 1,
                                                justifyContent: "center",
                                                paddingLeft: 12,
                                              }}
                                            >
                                              <Text
                                                style={commonStyles.smallHeading}
                                              >
                                                {attItem?.name}
                                              </Text>
                                            </View>
                                          </View>
                                          <View style={{ width: "50%" }}>
                                            <View
                                              style={{
                                                flex: 1,
                                                borderColor: Colors.gray,
                                                borderBottomWidth:
                                                  item?.attribute?.length - 1 ===
                                                    index
                                                    ? 0
                                                    : 1,
                                                justifyContent: "center",
                                                paddingLeft: 12,
                                                paddingVertical: 10
                                              }}
                                            >
                                              <Text
                                                style={[
                                                  commonStyles.textPrimary,
                                                  { color: Colors.primary, },
                                                ]}
                                              >
                                                {attItem?.text}
                                              </Text>
                                            </View>
                                          </View>
                                        </View>
                                      ))
                                      : null}
                                  </View>

                                </View>
                              )) : null
                          }
                        </View>

                      }

                      <View
                        style={{
                          borderBottomWidth: 1,
                          borderColor: Colors.gray,
                          zIndex: -1,
                        }}
                      >
                        <TouchableOpacity
                          onPress={onReviewToggle}
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            paddingVertical: 16,
                          }}
                        >
                          <Text
                            style={[
                              commonStyles.heading,
                              { color: Colors.headingColor },
                            ]}
                          >
                            {productDetail?.prodpage_reviewtab_text}
                          </Text>
                          {!isReviewVisible ? (
                            <AntDesign name="down" size={24} color="black" />
                          ) : (
                            <AntDesign name="up" size={24} color="black" />
                          )}
                        </TouchableOpacity>
                        {isReviewVisible ? (
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              marginVertical: 16,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                gap: 10,
                                alignItems: "center",
                              }}
                            >
                              <View style={{ flexDirection: "row", gap: 5 }}>
                                <AntDesign
                                  name="star"
                                  size={22}
                                  color={Colors.primary}
                                />
                                <AntDesign
                                  name="star"
                                  size={22}
                                  color={Colors.primary}
                                />
                                <AntDesign
                                  name="star"
                                  size={22}
                                  color={Colors.primary}
                                />
                                <AntDesign
                                  name="star"
                                  size={22}
                                  color={Colors.primary}
                                />
                                <AntDesign
                                  name="star"
                                  size={22}
                                  color={Colors.primary}
                                />
                              </View>
                              <Text style={commonStyles.smallHeading}>
                                {productDetail?.reviews || 0}{" "}
                                {productDetail?.prodpage_reviewtab_text}
                              </Text>
                            </View>
                            <TouchableOpacity
                              style={{
                                padding: 10,
                                backgroundColor: Colors.primary,
                                borderRadius: 8,
                              }}
                              onPress={() =>
                                navigation.navigate("Review", { productId: productId })
                              }
                            >
                              <Text
                                style={[
                                  commonStyles.textPrimary,
                                  { fontSize: 12, color: Colors.white },
                                ]}
                              >
                                {productDetail?.prodpage_write_a_reviewbtn_text}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : null}

                        <View>
                          {isReviewVisible
                            ? productDetail?.reviews_detail?.length > 0
                              ? productDetail?.reviews_detail
                                ?.slice(0, 5)
                                ?.map((item, index) => (
                                  <ReviewCard
                                    key={index}
                                    rating={item?.rating}
                                    reviewHeading={item?.author}
                                    reviewText={item?.text}
                                    reviewDate={item?.date_added}
                                  // formatDate(item?.date_added)
                                  />
                                ))
                              : null
                            : null}

                          {isReviewVisible && productDetail?.reviews > 5 ? (
                            <TouchableOpacity
                              onPress={() => {
                                setReviewModalVisible(true),
                                  fetchAllProductReview(productId, 1);
                              }}
                              style={{
                                backgroundColor: Colors?.primary,
                                width: "30%",
                                alignItems: "center",
                                justifyContent: "center",
                                height: 40,
                                borderRadius: 10,
                                marginVertical: 10,
                              }}
                            >
                              <Text style={commonStyles.textWhite_lg}>
                                {productDetail?.prodpage_productseeall_text}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>

                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={reviewModalVisible}
                        onRequestClose={() => onCloseReviewModal()}
                      >
                        <View
                          style={{
                            flex: 1,
                            width: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          <View
                            style={{
                              width: "90%",
                              height: "90%",
                              backgroundColor: "white",
                              borderRadius: 10,
                              padding: 20,
                              alignSelf: "center",
                              marginTop: 40,
                              gap: 20,
                            }}
                          >
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <View>
                                <Text style={commonStyles.heading}>
                                  {productDetail?.prodpage_productallreview_text}
                                </Text>
                              </View>

                              <TouchableOpacity onPress={() => onCloseReviewModal()}>
                                <IconComponentClose />
                              </TouchableOpacity>
                            </View>

                            <View style={{ marginBottom: 40 }}>
                              <ScrollView
                                showsVerticalScrollIndicator={false}
                                onScroll={() =>
                                  onClickLoadMore(
                                    productId,
                                    isProductReviewCurrentPage + 1
                                  )
                                }
                                scrollEventThrottle={10}
                              >
                                {productReviewList?.length > 0
                                  ? productReviewList?.map((item, index) => (
                                    <ReviewCard
                                      key={index}
                                      rating={item?.rating}
                                      reviewHeading={item?.author}
                                      reviewText={item?.text}
                                      reviewDate={formatDate(item?.date_added)}
                                    />
                                  ))
                                  : null}

                                {isProductReviewModalLoader ? (
                                  <CustomActivity />
                                ) : null}
                              </ScrollView>
                            </View>
                          </View>
                        </View>
                      </Modal>

                      {/* related product list */}

                      {relatedProduct?.length > 0 ? (
                        <View style={{ gap: 24, marginTop: 24 }}>
                          <Text
                            style={[
                              commonStyles.heading,
                              { color: Colors.headingColor },
                            ]}
                          >
                            {productDetail?.prodpage_relatedprodt_heading}
                          </Text>

                          <ProductCardList
                            ContainerWidth={"100%"}
                            data={relatedProduct}
                          />
                        </View>
                      ) : null}
                    </View>
                  </ScrollView>
                </Animated.ScrollView>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  position: "absolute",
                  bottom: 0,
                  paddingBottom: 80,
                  backgroundColor: Colors?.white,
                  paddingHorizontal: 12,
                  width: "100%",
                }}
              >
                <CustomeButtonWithIcon
                  onClick={
                    productDetail?.optionsstatus
                      ? () =>
                        onClickAddToCartButtonWithOptionProductDetailCopy(
                          selectedRadioOptions,
                          selectedCheckboxOptions,
                          selectedSelectOptions
                        )
                      : () => onClickCartBtn(productDetail?.product_id)
                  }
                  IconComponent={cartIconComponent}
                  buttonText={productDetail?.prodpage_addtocartbtn_text}
                  bgColor={Colors?.cartBtnBgColor}
                  textColor={Colors?.cartBtnText}
                  btnDisabled={productDetail?.quantity == 0}
                  opacity={productDetail?.quantity == 0 ? 0.5 : 1}
                />
                <CustomButton
                  opacity={productDetail?.quantity == 0 ? 0.5 : 1}
                  btnDisabled={productDetail?.quantity == 0}
                  buttonStyle={{
                    w: "48%",
                    h: 46,
                    backgroundColor: Colors?.primary,
                    borderRadius: 8,
                  }}
                  buttonText={productDetail?.prodpage_buynowbtn_text}
                  OnClickButton={
                    productDetail?.optionsstatus
                      ? () =>
                        onClickBuyButtonWithOptionProductDetailCopy(
                          selectedRadioOptions,
                          selectedCheckboxOptions,
                          selectedSelectOptions
                        )
                      : () => onClickBuyBtn(productDetail?.product_id)
                  }
                />
              </View>
              <BottomBar />
              <SuccessModal
                isModal={isShowModal}
                btnName={isModalMessage?.text?.comparecntbtn_label || isModalMessage?.cartokbtn_label}
                isSuccessMessage={isModalMessage?.success}
                onClickClose={isComapreNavigate ? onclickModalBtn : closeModal}
                handleCloseModal={closeModal}
              />

              <FailedModal
                isModal={isErrorModal}
                isSuccessMessage={isErrorMgs}
                onClickClose={() => {
                  setErrorModal(false);
                  setErrorMgs();
                }}
                handleCloseModal={() => {
                  setErrorModal(false);
                  setErrorMgs();
                }}
              />

              <NotifyModal visible={notifyVisible} onClose={() => setNotifyVisible(false)} textLabel={notifyText} productId={productId} />
              <OpenUrlInModal url={isVideoUrl} modalVisible={isOpenUrlModal} setModalVisible={setOpenUrlModal} />
              <NotificationAlert />
            </ >
          )}
    </>
  );
};



export default Product;
