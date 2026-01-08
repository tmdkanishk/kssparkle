import { View,  FlatList, Image, useWindowDimensions, } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useCustomContext } from '../hooks/CustomeContext';
import TitleBarName from '../components/TitleBarName';
import commonStyles from '../constants/CommonStyles';
import WishlistCard from '../components/WishlistCard';
import { _retrieveData } from '../utils/storage';
import CustomActivity from '../components/CustomActivity';
import { addToCartProduct } from '../services/addToCartProduct';
import SuccessModal from '../components/SuccessModal';
import AddToCartOptionUiModal from '../components/AddToCartOptionUiModal';
import { addToCartWithOptions } from '../services/addToCartWithOptions';
import FailedModal from '../components/FailedModal';
import { checkAutoLogin } from '../utils/helpers';
import NotificationAlert from '../components/NotificationAlert';
import { getWishlistProduct } from '../services/getWishlistProduct';
import BottomBar from '../components/BottomBar';
import { useCartCount } from '../hooks/CartContext';
import { useWishlist } from '../hooks/WishlistContext';


const Wishlist = ({ navigation }) => {
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const { handleWishlistToggle } = useWishlist();
  const { updateCartCount } = useCartCount();
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [loading, setLoading] = useState(false);
  const [isLabel, setLabel] = useState(false);
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [isShowModal, setShowModal] = useState(false);
  const [isModalMessage, setModalMessage] = useState();
  const [isAddTOCartOptionResult, setAddTOCartOptionResult] = useState();
  const [isAddTOCartOptionModalShow, setAddTOCartOptionModalShow] = useState(false);
  const [productIdOption, setproductIdOption] = useState();
  const [isErrorModal, setErrorModal] = useState(false);
  const [isErrorMgs, setErrorMgs] = useState();
  const [itemCardLoading, setItemCardLoading] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [page, setPage] = useState(1);


  useEffect(() => {
    checkAutoLogin();
    fetchWishListProduct();
  }, [page]);


  const fetchWishListProduct = async () => {
    try {
      if (page == 1) {
        setLoading(true);
      }
      setLoadingMore(true)
      const result = await getWishlistProduct(page, EndPoint?.accountdashboard_wishlist);
      console.log("result wishlist", result);
      setLabel(result?.text);

      setWishlistProducts((prevData) => {
        const existingIds = new Set(prevData.map(item => item?.product_id));
        const newProducts = result?.products?.filter(product => !existingIds.has(product.product_id));
        return [...prevData, ...newProducts];
      });

      if (page >= result?.pages) {
        setHasMoreData(false);
      }

    } catch (error) {
      console.log("error", error.response.data);
    } finally {
      setLoadingMore(false);
      setLoading(false);
    }
  }

  const onToggleWishlist = async (productid) => {
    try {
      setItemCardLoading(productid);
      handleWishlistToggle(productid);
      const updatedData = wishlistProducts.filter(item => item.product_id !== productid);
      setWishlistProducts(updatedData);
    } catch (error) {
      console.log("error:", error);
      setErrorMgs(GlobalText?.extrafield_somethingwrong);
      setErrorModal(true);
    } finally {
      setItemCardLoading(null);
    }
  }

  const handleLoadMore = () => {
    if (!loadingMore && hasMoreData) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const onClickCartBtn = async (productId) => {
    try {
      setItemCardLoading(productId);
      const response = await addToCartProduct(productId, 1, EndPoint?.cart_add);
      if (response?.success) {
        updateCartCount(response?.cartproductcount);
        setModalMessage(response?.success);
        setShowModal(true);
        setTimeout(() => {
          closeModal();
        }, 2000)
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
      setItemCardLoading(null);
    }
  }

  const closeModal = () => {
    setShowModal(false);
    setModalMessage();
  }

  const handleAddToCartWithOption = async (productId) => {
    try {
      setItemCardLoading(productId);
      const results = await addToCartWithOptions(productId, EndPoint?.cart_ProductOptions);
      if (results) {
        setAddTOCartOptionResult(results);
        setAddTOCartOptionModalShow(true);
        setproductIdOption(productId);
      }
    } catch (error) {
      setErrorMgs(GlobalText?.extrafield_somethingwrong);
      setErrorModal(true);
    } finally {
      setItemCardLoading(null);
    }
  }

  // RenderItem
  const renderItem = ({ item }) => (
    <WishlistCard
      image={item?.thumb}
      productName={item?.name}
      discountPrice={item?.special === false ? item?.price : item?.special}
      price={item?.special !== false ? item?.price : null}
      addToCartText={isLabel?.wishlistcartbtn_label}
      onclickAddTocart={item?.optionsstatus ? () => handleAddToCartWithOption(item?.product_id) : () => onClickCartBtn(item?.product_id)}
      onClickWishList={() => onToggleWishlist(item?.product_id)}
      onClickProduct={() => navigation.navigate({
        name: 'Product',
        key: `ProductDetail-${item?.product_id}`,
        params: { productId: item?.product_id }
      })}
      isLoading={itemCardLoading === item?.product_id}
    />
  )

  const renderFooter = () => {
    if (!loadingMore) return null;
    return <CustomActivity />;
  };

  const renderEmptyList = () => (
    <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{ width: 200, height: 400, alignSelf: 'center' }}>
        <Image source={require('../assets/images/notfound.png')} style={{ width: '100%', height: '100%', resizeMode: 'contain', }} />
      </View>
    </View>
  )


  return (

    <>
      {
        loading ?
          (<View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
            <CustomActivity />
          </View>) :
          (<View style={{ width: '100%', height: '100%', backgroundColor: Colors.white, }}>
            <View style={commonStyles.bodyConatiner}>
              <TitleBarName onClickBackIcon={() => navigation.goBack()} titleName={isLabel?.wishlistpagename_label} />
              <View style={{ paddingHorizontal: 12 }}>

                <FlatList
                  key={isLandscape}
                  data={wishlistProducts}
                  renderItem={renderItem}
                  keyExtractor={(item) => item?.product_id?.toString()}
                  onEndReached={handleLoadMore}
                  onEndReachedThreshold={0.5}
                  ListFooterComponent={renderFooter}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={!loadingMore && !loading && renderEmptyList}
                  contentContainerStyle={{ paddingBottom: 200 }}
                />
              </View>
            </View >
            <BottomBar />

            <SuccessModal
              isModal={isShowModal}
              isSuccessMessage={isModalMessage}
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
              onClickClose={() => { setErrorModal(false); setErrorMgs() }}
              handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
            />

            <NotificationAlert />
          </View>)
      }

    </ >

  )
}



export default Wishlist