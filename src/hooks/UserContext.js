import React, { createContext, useContext, useEffect, useState } from "react";
import { _retrieveData } from "../utils/storage";
import { useCustomContext } from "./CustomeContext";
import { getUserInfo } from "../services/getUserInfo";

// Create context
const UserContext = createContext();

// Provider component
export const UserProvider = ({ children }) => {
    const { EndPoint } = useCustomContext();
    const [login, setLogin] = useState(false);
    const [userData, setUserData] = useState(null);
    const [profileImg, setProfileImg] = useState(null);
    const [address, setAddress] = useState(null);

    useEffect(() => {
        if (EndPoint?.accountdashboard_userdetailsedit) {
            getUserDetails();
        }
    }, [EndPoint]);



    const getUserDetails = async () => {
        console.log("refresh calls")
        try {
            const user = await _retrieveData('CUSTOMER_ID');

            if (user) {
                console.log("user", user);
                setLogin(true);
                setUserData(user);
            }

            const result = await getUserInfo(EndPoint?.accountdashboard_userdetailsedit);
            if (result?.customer_info?.[0]?.image) {
                setProfileImg(result?.customer_info?.[0]?.image);
            }

            console.log("result user data dashboard reeep", result);

        } catch (error) {
            console.log("error :", error.response.data);
        }
    }


    const updateUserState = (state) => setLogin(state);

    return (
        <UserContext.Provider
            value={{ updateUserState, login, userData, setUserData, profileImg, setProfileImg, address, setAddress, refreshUser: getUserDetails, }}
        >
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to use context easily
export const useUser = () => useContext(UserContext);