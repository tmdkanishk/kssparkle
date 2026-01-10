import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCustomContext } from './CustomeContext';
import { addWishlistProduct } from '../services/addWishlistProduct';
import { removeWishlistProduct } from '../services/removeWishlistProduct';
import { _retrieveData } from '../utils/storage';
import { getAllWishlistProducts } from '../services/getAllWishlistProducts';
import { addAllWishlistProduct } from '../services/addAllWishlistProduct';
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

    const { IsLogin, GlobalText, EndPoint } = useCustomContext();
    const [wishlist, setWishlist] = useState([]);
    const [wishlistloading, setWishlistLoading] = useState(null);
    const [failedModal, setFailedModal] = useState(false);
    const [failedModalText, setFailedModalText] = useState('');
    const [success, setSuccess] = useState('');


    useEffect(() => {
        fetchInitialWishlist(); // runs when provider mounts
    }, [IsLogin]);

    const fetchInitialWishlist = async () => {
        try {
            const response = await getAllWishlistProducts(EndPoint?.accountdashboard_getAllWishlists);
            console.log("responce getAllWishlistProducts", response);
            const ids = response?.products?.map(item => item?.product_id);
            setWishlist(ids || []);
        } catch (error) {
            console.warn('Failed to load wishlist initially:', error);
        }
    };


    const handleWishlistToggle = async (productId) => {
        try {
            setWishlistLoading(productId);
            const isWishlisted = wishlist.includes(productId);

            if (!isWishlisted) {
                await addWishlistProduct(productId, EndPoint?.accountdashboard_wishlistadd);
                setWishlist((prev) => [...prev, productId]);
            } else {
                await removeWishlistProduct(productId, EndPoint?.accountdashboard_wishlistremove);
                setWishlist((prev) => prev.filter((id) => id !== productId));

            }

        } catch (error) {
            console.warn('Wishlist toggle failed:', error);
            setFailedModalText(GlobalText?.extrafield_somethingwrong);
            setFailedModal(true);
        } finally {
            setWishlistLoading(null);
        }
    };



    const handleAllWishlistToggle = async (productIds) => {
        try {
            // setWishlistLoading(productId);
            // const isWishlisted = wishlist.includes(productId);
            if (productIds?.length > 0) {
                const response = await addAllWishlistProduct(productIds, EndPoint?.accountdashboard_wishlistadd);
                console.log("addAllWishlistProduct response", response);
                setWishlist((prev) => [...prev, ...productIds]);
                setSuccess(response?.success);
            }

        } catch (error) {
            console.log('Wishlist toggle failed:', error.response.data);
            setFailedModalText(GlobalText?.extrafield_somethingwrong);
            setFailedModal(true);
        } finally {
            // setWishlistLoading(null);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                handleWishlistToggle,
                handleAllWishlistToggle,
                wishlistloading,
                failedModal,
                failedModalText,
                setFailedModal,
                success,
                setSuccess
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
