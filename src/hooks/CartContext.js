import React, { createContext, useContext, useEffect, useState } from "react";
import { _retrieveData } from "../utils/storage";
import { getCartItem } from "../services/getCartItem";
import { useCustomContext } from "./CustomeContext";

// Create context
const CartContext = createContext();

// Provider component
export const CartProvider = ({ children }) => {
    const { EndPoint } = useCustomContext();
    const [cartCount, setCartCount] = useState(0);


    useEffect(() => {
        getCartDetails();
    }, [])

    const getCartDetails = async () => {
        try {
            const cartresponse = await getCartItem(EndPoint?.cart_total);
            console.log("cart total", cartresponse?.cartproductcount);
            setCartCount(cartresponse?.cartproductcount);
        } catch (error) {
            console.log("error:", error.response.data);
        }
    }

    const updateCartCount = (count) => setCartCount(count);

    return (
        <CartContext.Provider
            value={{ updateCartCount, cartCount }}
        >
            {children}
        </CartContext.Provider>
    );
};

// Custom hook to use context easily
export const useCartCount = () => useContext(CartContext);
