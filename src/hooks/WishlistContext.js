import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCustomContext } from './CustomeContext';
import { addWishlistProduct } from '../services/addWishlistProduct';
import { removeWishlistProduct } from '../services/removeWishlistProduct';
import { _retrieveData } from '../utils/storage';
import { getAllWishlistProducts } from '../services/getAllWishlistProducts';
const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {

    const { IsLogin, GlobalText, EndPoint } = useCustomContext();
    const [wishlist, setWishlist] = useState([]);
    const [wishlistloading, setWishlistLoading] = useState(null);
    const [failedModal, setFailedModal] = useState(false);
    const [failedModalText, setFailedModalText] = useState('');


    useEffect(() => {
        fetchInitialWishlist(); // runs when provider mounts
    }, [IsLogin]);

    const fetchInitialWishlist = async () => {
        try {
            const response = await getAllWishlistProducts(EndPoint?.accountdashboard_getAllWishlists);
            console.log("responce", response);
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

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                handleWishlistToggle,
                wishlistloading,
                failedModal,
                failedModalText,
                setFailedModal,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
