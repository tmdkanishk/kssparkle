import { View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper'
import PromoCard from '../components/customcomponents/PromoCard'
import Header from '../components/customcomponents/Header'
import ProductImageCard from '../components/customcomponents/ProductImageCard'
import TextContainer from '../components/customcomponents/TextContainer'
import GlassProductCard from '../components/customcomponents/GlassProductCard'
import GlassButton from '../components/customcomponents/GlassButton'
import GlassContainer from '../components/customcomponents/GlassContainer'
import TopHighlights from '../components/customcomponents/TopHighlights'
import ReviewSections from '../components/customcomponents/ReviewSections'
import CustomerReviewSection from '../components/customcomponents/CustomerReviewSection'
import GlassmorphismButton from '../components/customcomponents/GlassmorphismButton'
import { useCustomContext } from '../hooks/CustomeContext'
import { useCartCount } from '../hooks/CartContext'
import { useFocusEffect } from '@react-navigation/native'
import { checkAutoLogin } from '../utils/helpers'
import { API_KEY, BASE_URL } from '../utils/config'
import { _retrieveData } from '../utils/storage'
import { shareUrl } from '../services/shareUrl'
import { addCompareProduct } from '../services/addCompareProduct'
import { addToCartProduct } from '../services/addToCartProduct'
import { addToCartWithOptionCopy } from '../services/addToCartWithOptionCopy'
import { getAllReview } from '../services/getAllReview'
import { getProductVideo } from '../services/getProductVideo'
import { getProductInfo } from '../services/getProductInfo'
import { getNotifyText } from '../services/getNotifyText'
import axios, { HttpStatusCode } from 'axios'
import ReviewModal from '../components/ReviewModal'
import { launchImageLibrary } from "react-native-image-picker";
import ProductColorCard from '../components/ProductColorCard'
import DropDownCustomComponent from '../components/DropDownCustomComponent'
import { Picker } from '@react-native-picker/picker'
import commonStyles from '../constants/CommonStyles'
import OptionCard from '../components/customcomponents/OptionCard'
import FailedModal from '../components/FailedModal'
import HtmlViewComponent from '../components/customcomponents/HtmlViewComponent'
import ProductDescriptionWebView from '../components/customcomponents/ProductDescriptionWebView'
import TabbyPromoWebView from '../components/customcomponents/TabbyPromoWebView';
import TabbyPromoGlassCard from '../components/customcomponents/TabbyPromoGlassCard';
import { buildTabbyHTML } from '../components/customcomponents/buildTabbyHTML';
import CustomSearchBar from './CustomSearchBar'
import PriceView from '../components/customcomponents/PriceView'

const ProductDetail = ({ navigation, route }) => {
  const [showSpecs, setShowSpecs] = useState(false);
  const [showHighlights, setShowHighlights] = useState(false);
  // const [showVideos, setShowVideos] = useState(false);
  // const [showImages, setShowImages] = useState(false);

  // const [videoList, setVideoList] = useState([
  //   require("../assets/images/headphones.png"),
  //   require("../assets/images/headphonesblack.png"),
  // ]);
  // const [imageList, setImageList] = useState([
  //   require("../assets/images/headphones.png"),
  //   require("../assets/images/headphonesblack.png"),
  // ]);



  const specifications = [
    { label: 'Headphones Jack', value: '3.5 mm Jack' },
    { label: 'Model Name', value: 'Q20i' },
    { label: 'Connectivity Technology', value: 'Wireless' },
    { label: 'Wireless Communication Technology', value: 'Bluetooth' },
    { label: 'Included Components', value: 'Cable, Q20i Headband' },
    { label: 'Age Range (Description)', value: 'Adult' },
    { label: 'Material', value: 'Plastic' },
    { label: 'Specific Uses For Product', value: 'Travel, music' },
    { label: 'Charging Time', value: '5 Minutes' },
    { label: 'Recommended Uses For Product', value: 'Entertainment' },
    { label: 'Compatible Devices', value: 'Laptop, Tablets, Smartphones' },
    { label: 'Control Type', value: 'Button Control' },
    { label: 'Cable Feature', value: 'Detachable' },
    { label: 'Item Weight', value: '259 g' },
  ];

  const { productId } = route.params;
  // console.log("productId from route.params", productId)
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
  // const [isVideoList, setVideoList] = useState(null);
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
  //   const scrollY = useRef(new Animated.Value(0)).current;
  const [reviewModal, setReviewModal] = useState(false);

  const [showVideos, setShowVideos] = useState(false);
  const [showImages, setShowImages] = useState(false);

  const [videoList, setVideoList] = useState([]);
  const [imageList, setImageList] = useState([
    require("../assets/images/headphones.png"),
    require("../assets/images/headphonesblack.png"),
  ]);
  const [scrollY, setScrollY] = useState(0);
  const optionRef = useRef(null);
  const [customerId, setCustomerId] = useState(null);
  const [attributeGroups, setAttributeGroups] = useState([]);
  const [activeSeachingScreen, setActiveSeachingScreen] = useState(false);
  const [price, setPrice] = useState('');


  useEffect(() => {
    const getCustomerId = async () => {
      const id = await _retrieveData("CUSTOMER_ID");
      console.log("customer_id", id)
      setCustomerId(id);
    };

    getCustomerId();
  }, []);

  // 📸 Pick image from gallery
  const handleAddImage = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const newImage = { uri: response.assets[0].uri };
        setImageList((prev) => [...prev, newImage]);
      }
    });
  };

  // 🎥 Pick video from gallery
  const handleAddVideo = () => {
    launchImageLibrary(
      {
        mediaType: 'video',
        videoQuality: 'high',
        selectionLimit: 1,
      },
      (response) => {
        if (response.didCancel) return;

        if (response.assets && response.assets.length > 0) {
          const asset = response.assets[0];

          if (!asset.uri) return;

          setVideoList((prev) => [
            ...prev,
            {
              uri: asset.uri,
              type: asset.type,
              fileName: asset.fileName,
            },
          ]);
        }
      }
    );
  };



  useFocusEffect(
    useCallback(() => {
      checkAutoLogin();
      fetchProductDetail();
      fetchProductVideo();
      //   fetchNotifyText();
    }, [changeCurren, changeLang])
  );

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      console.log("prduct id ", productId);
      const url = `${BASE_URL}${EndPoint?.productdetails}`;
      console.log("url productdetail", url)
      const lang = await _retrieveData("SELECT_LANG");
      const cur = await _retrieveData("SELECT_CURRENCY");
      const customerId = await _retrieveData("CUSTOMER_ID");
      const sessionId = await _retrieveData('SESSION_ID');
      const headers = {
        "Content-Type": "application/x-www-form-urlencoded",
        Key: API_KEY,
      };



      const body = {
        product_id: productId,
        code: lang?.code,
        currency: cur,
        sessionid: sessionId,
        customer_id: customerId,
      };

      console.log("fetch product detail body", body)
      const response = await axios.post(url, body, { headers: headers });
      if (response.status === HttpStatusCode.Ok) {
        console.log("product detail response", response.data);
        console.log("tebbypromo", response.data.tebbypromo);
        console.log("product detail response images", response?.data?.images);
        console.log("product detail response price", response.data?.price);
        setPrice(response.data?.price)
        setProductDetail(response.data);
        setAttributeGroups(response.data.attribute_groups)
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
      navigation.navigate("ShoppingBag")
    } catch (error) {
      console.log("error add to cart:", error.response.data);
      if (error.response.data?.error?.quantity) {
        setErrorMgs(error.response.data?.error?.quantity);
        setErrorModal(true);
      }
      else if (error.response?.data?.error?.option) {
        console.log(productId)
        const message =
          error.response.data.error?.option[String(productId)];

        console.log("option", message)

        if (message) {
          setErrorMgs(message);
          setErrorModal(true);
        }
      }
      else {
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
        console.log(" onClickBuyBtn function works!")
        navigation.navigate("ShoppingBag");
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

        navigation.navigate("ShoppingBag");
      }

    } catch (error) {

      if (error.response.data?.error?.quantity) {
        setErrorMgs(error.response.data?.error?.quantity);
        setErrorModal(true);
      } else {
        console.log("this statement is triggering");
        setSelectError(true);
        setErrorMgs("Please select all required options");
        setErrorModal(true); // 👈 this opens the modal
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
        // scrollToRef(section1Ref);
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
      //   console.log("response notify:", response?.stockalert);
      setNotifyText(response?.stockalert);
    } catch (error) {
      console.log("error", error.response.data);
    }

  }

  const toggleSearch = () => {
    setActiveSeachingScreen(prev => !prev);
  };





  if (activeSeachingScreen) {
    return (
      <CustomSearchBar
        setActiveSeachingScreen={setActiveSeachingScreen}
      />
    );
  }


  //   {"attribute_groups": [], "continue": "http://192.168.0.135/customclient/2025/oct/sparkleksa", "customer_name": "", "description": "", "discounts": [], "heading_title": " اضاءة رينق لايت 13IMN قوة 10W من RTAO", "images": [{"popup": null}, {"popup": null}], "manufacturers": "http://192.168.0.135/customclient/2025/oct/sparkleksa/index.php?route=product/manufacturer/info&amp;manufacturer_id=", "minimum": "1", "off": "", "options": [], "optionsstatus": false, "points": "0", "price": "$18.37", "prodpage_addtocartbtn_text": "Add Cart", "prodpage_buynowbtn_text": "Buy Now", "prodpage_continuebtn_text": "Continue", "prodpage_descriptiontab_text": "Description", "prodpage_inclusivetax": "Inclusive All", "prodpage_lowestprice_text": "Product Image", "prodpage_off_text": "Off ", "prodpage_productallreview_text": "All Review", "prodpage_productseeall_text": "See All", "prodpage_relatedprodt_heading": "Related Product", "prodpage_reviewtab_text": "Review", "prodpage_specificationtab_text": "Specification", "prodpage_write_a_reviewbtn_text": "Write A Review", "product_id": 708, "products": [], "productsdetail": [{"text": "Manufacturer ", "value": null}, {"text": "Model ", "value": " اضاءة رينق لايت 13IMN قوة 10W من RTAO"}, {"text": "Availablity ", "value": "In Stock"}, {"text": "Reward ", "value": null}], "quantity": "9", "rating": 0, "recurrings": [], "review_guest": false, "review_status": "1", "reviews": 0, "reviews_detail": [], "selected_options": [], "share": "http://192.168.0.135/customclient/2025/oct/sparkleksa/اضاءة-رينق-لايت-13imn-قوة-10w-من-rtao", "special": false, "tags": [{"href": "http://192.168.0.135/customclient/2025/oct/sparkleksa/index.php?route=product/search&amp;tag=اضاءة رينق لايت 13IMN قوة 10W من RTAO", "tag": "اضاءة رينق لايت 13IMN قوة 10W من RTAO"}], "tax": false, "wishliststatus": false}

  return (
    <>

      <BackgroundWrapper>

        <ScrollView contentContainerStyle={{ paddingBottom: 20, marginTop: Platform.OS === "ios" ? 40 : 0 }} onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)} scrollEventThrottle={16} >
          <View style={{ paddingHorizontal: 30 }}>
            <Header onSearchPress={toggleSearch} />
          </View>

          <TouchableOpacity style={{ marginLeft: 25, marginTop: 20 }} onPress={() => navigation.goBack()}>
            <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
          </TouchableOpacity>
          <ProductImageCard headingTitle={productDetail?.heading_title} images={productDetail?.images} />
          <View style={{ padding: 20 }}>
            {/* <TextContainer /> */}
            <TabbyPromoWebView html={productDetail?.tebbypromo} />
            {/* <TabbyPromoGlassCard
              html={buildTabbyHTML({
                price: '1980.0000',
                currency: 'SAR',
                lang: 'ar',
                installmentsCount: 4,
              })}
            /> */}

            {/* Colour label */}
            {/* <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginLeft: 10, marginTop: 20 }}>
              <Text style={{ color: 'white', fontSize: 18, }}>Colour: </Text>
              Black
            </Text> */}
            {/* <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 15 }}>
              <GlassProductCard imageSource={require("../assets/images/headphones.png")} />
              <GlassProductCard imageSource={require("../assets/images/headphonesblack.png")} />
              <GlassProductCard imageSource={require("../assets/images/headphonesblue.png")} />
            </View> */}

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

            {/* {productDetail?.options?.map((item, index) => (
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
                      ))} */}

            {productDetail?.options?.map((option) => {
              if (option?.type !== "select") return null;

              return (
                <View key={option.product_option_id} style={{ marginBottom: 16 }}>

                  {/* Option Title */}
                  <Text
                    style={[
                      commonStyles.heading,
                      { color: "white", marginBottom: 10, marginTop: 20 },
                    ]}
                  >
                    {option.name}
                  </Text>

                  {/* Option Values */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, }}>
                    {option.product_option_value.map((value) => {
                      const isSelected =
                        selectedSelectOptions[
                        `option[${option.product_option_id}]`
                        ] === value.product_option_value_id;

                      return (
                        <View ref={optionRef}>
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
                        </View>

                      );
                    })}
                  </View>

                  {/* Validation Error */}


                  {isSelectError &&
                    !selectedSelectOptions[`option[${option.product_option_id}]`] && (
                      <Text style={{ color: 'red' }}>
                        Please select {option.product_option_id}
                      </Text>
                    )}
                </View>
              );
            })}


            <View
              style={{
                marginLeft: 10,
                // backgroundColor: 'blue',
                marginBottom: 20, // ensures no bottom gap
                marginTop: 20
              }}
            >
              {/* Text section */}
              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'left',
                  lineHeight: 22,
                  fontWeight: '500',
                  flexShrink: 1,
                  // backgroundColor: 'rgba(255,0,0,0.3)', // debug color
                }}
              >
                {/* <ProductDescriptionWebView html={"<p>kanishk</p>"} /> */}
                {productDetail?.prodpage_descriptiontab_text}
              </Text>




              <Text
                style={{
                  color: '#fff',
                  fontSize: 14,
                  textAlign: 'left',
                  lineHeight: 22,
                  fontWeight: '500',
                  flexShrink: 1,
                  // backgroundColor: 'rgba(255,0,0,0.3)', // debug color
                }}
              >

                {/* <ProductDescriptionWebView html={descriptionData} /> */}
                <HtmlViewComponent descriptionData={descriptionData} />
                {/* {descriptionData} */}
              </Text>


              <View style={{ alignItems: 'flex-start' }}>
                <PriceView
                  priceHtml={productDetail?.price}
                  textStyle={{
                    fontSize: 31,
                    fontWeight: "700",
                    color: "white",
                    marginLeft: 'auto'
                  }}
                  width={25}
                  height={25}
                />

              </View>

              {/* Image directly below text */}
              {/* <Image
                source={require('../assets/images/beats.png')}
                style={{
                  width: 85,
                  height: 70,
                  resizeMode: 'contain',
                  // backgroundColor: 'green', // debug
                  marginTop: -20, // ensures image touches text
                }}
              /> */}
            </View>

            <Text style={{ color: '#fff', fontSize: 22, textAlign: 'center', lineHeight: 22, fontWeight: '500', flexShrink: 1, }}>Product Details</Text>

            <View style={{ marginTop: 10, marginHorizontal: 5, }}>

              <GlassButton
                title="Top Highlights"
                onPress={() => setShowHighlights(!showHighlights)}
              />
              {showHighlights && (
                <TopHighlights details={productDetail?.productsdetail} />
              )}
              <View style={{ marginTop: 15 }}>
                <GlassButton
                  title="Product Specification"
                  onPress={() => setShowSpecs(!showSpecs)}
                />
              </View>

              {showSpecs && (
                <View style={{ marginTop: 10, marginHorizontal: 10 }}>

                  {attributeGroups?.map((group, groupIndex) => (
                    <View key={group.attribute_group_id || groupIndex} style={{ marginBottom: 16 }}>

                      {/* Group Title */}
                      <Text
                        style={{
                          color: '#fff',
                          fontSize: 16,
                          fontWeight: '700',
                          marginBottom: 8,
                        }}
                      >
                        {group.name}
                      </Text>

                      {/* Attributes */}
                      {group.attribute.map((attr, attrIndex) => (
                        <View
                          key={attr.attribute_id || attrIndex}
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            marginBottom: 8,
                          }}
                        >
                          <Text
                            style={{
                              color: '#fff',
                              fontWeight: '600',
                              width: '48%',
                            }}
                          >
                            {attr.name}
                          </Text>

                          <Text
                            style={{
                              color: '#fff',
                              width: '48%',
                            }}
                          >
                            {attr.text}
                          </Text>
                        </View>
                      ))}
                    </View>
                  ))}

                  {/* Add Info */}
                  <TouchableOpacity>
                    <Text
                      style={{
                        color: '#fff',
                        textDecorationLine: 'underline',
                        marginTop: 8,
                        fontWeight: '600',
                      }}
                    >
                      Add Information
                    </Text>
                  </TouchableOpacity>

                </View>
              )}




              {/* <ReviewSections /> */}

              <View style={{ marginTop: 20 }} />

              { }
{/* 
              {customerId && (
                <GlassButton
                  title="Write a Review"
                  onPress={() => setReviewModal(true)}
                />
              )} */}



              <CustomerReviewSection relatedProducts={productDetail?.relatedproducts || []} scrollY={scrollY}
                rating={productDetail?.rating || 0}
                totalReviews={productDetail?.reviews || 0}
                reviews={productDetail?.reviews_detail || []}
              />

            </View>



            {/* <GlassButton title="Add To Cart" onPress={() => alert("Added!")} /> */}

          </View>

        </ScrollView>

        <View style={{ paddingHorizontal: 20, paddingBottom: 30 }}>
          <GlassmorphismButton
            onPress={productDetail?.optionsstatus
              ? () =>
                onClickBuyButtonWithOptionProductDetailCopy(
                  selectedRadioOptions,
                  selectedCheckboxOptions,
                  selectedSelectOptions
                )
              : () => onClickBuyBtn(productDetail?.product_id)}
            title={productDetail?.prodpage_addtocartbtn_text}
            showImage={true}
            image={require("../assets/images/add_to_cart.png")}
          />
        </View>


      </BackgroundWrapper>

      <ReviewModal
        visible={reviewModal}
        onClose={() => setReviewModal(false)}
        productId={productId}
        onReviewSuccess={fetchProductDetail}
      // onUploadImage={handleAddImage}
      // onUploadVideo={handleAddVideo}
      // imageList={imageList}
      // videoList={videoList}
      />


      <FailedModal
        isSuccessMessage={isErrorMgs}
        handleCloseModal={() => setErrorModal(false)}
        isModal={isErrorModal}
        onClickClose={() => setErrorModal(false)}
      />

    </>
  )
}

export default ProductDetail