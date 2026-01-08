import React, { createContext, useContext, useState, useEffect, use } from 'react';
import axios, { HttpStatusCode } from 'axios';
import { ActivityIndicator, Alert, Button, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_KEY, BASE_URL } from '../utils/config';
import { _retrieveData, _storeData } from '../utils/storage';
import { getActiveEndPoint } from '../utils/configendpoint';
import { getMessaging } from '@react-native-firebase/messaging';
import { getApp } from '@react-native-firebase/app';
// import NotificationAlert from '../components/NotificationAlert';


// Create a context
const CustomContext = createContext();

// Create a provider component
export const CustomProvider = ({ children }) => {

    const [colors, setColors] = useState(null);
    const [features, setfeatures] = useState(null);
    const [menu, setMenu] = useState(null);
    const [footer, setFooter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [istLogoChar, setLogoChar] = useState('S');
    const [isOrderStatus, setOrderStatus] = useState(null);
    const [isModal, setModal] = useState(false);
    const [isModalData, setModalData] = useState(null);
    const [isAppLanguage, setAppLanguage] = useState(null);
    const [isGlobalText, setGlobalText] = useState(null);
    const [isAdminInfo, setAdminInfo] = useState(null);
    const [isLogin, setLogin] = useState(false);

    useEffect(() => {
        checkUserLogin();
        fetchColors();
/*         getMessaging(getApp()).onMessage(async (remoteMessage) => {
            console.log("remote Message on open app", remoteMessage);
            setModalData(remoteMessage);
            setModal(true);
        }); */
    }, [isAppLanguage]);

    const checkUserLogin = async () => {
        const userdata = await _retrieveData('USER');
        if (userdata) {
            setLogin(true);
        } else {
            setLogin(false);
        }
    }




    const fetchColors = async () => {
        try {
            const url = `${BASE_URL}restapi/colorsetting`;
            const lang = await _retrieveData('SELECT_LANG');
            const currency = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');
            const headers = {
                'Content-Type': 'application/x-www-form-urlencoded',
                Key: API_KEY,

            };
            const body = {
                code: lang ? lang.code : null,
                sessionid: sessionId
            }

            console.log("body of initial api", body);


            const response = await axios.post(url, body, { headers: headers });

            if (response.status === HttpStatusCode.Ok) {
                setColors(response.data?.color);
                setfeatures(response.data?.feature);
                setMenu(response.data?.menuinfos);
                setFooter(response.data?.footerinfos);
                setLogoChar(response.data?.fevicon_text);
                setOrderStatus(response.data?.order_statuses);
                setGlobalText(response.data?.text);
                setAdminInfo(response.data?.setting);
                // setPhoneOtpLength(Number(response.data?.otplength));
                // console.log("response.data?.footerinfos:", response.data?.otplength);
                await _storeData("SELECT_CURRENCY", response?.data?.currency)
                await _storeData("SELECT_LANG", { "code": response.data?.code });
                await _storeData("SESSION_ID", response.data?.sessionid);
                await _storeData("SPLACE_WIDTH", response.data?.feature?.splash_logo_width);
                await _storeData("SPLACE_HEIGHT", response.data?.feature?.splash_logo_height);
                console.log("res of fetch colors function", response.data?.currency)
            }
        } catch (error) {
            console.log("error of fetch colors", error.response.data.error)
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    // If still loading, show a loader or default values
    if (loading) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <ActivityIndicator size={46} color={colors?.primarycolor} />
            </View>
        )
    }

    // If there is an error, show an error message
    if (error) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: 'red' }}>Something went wrong, please try later!</Text>
            </View>
        )
    }

    const Colors = {
        primary: colors?.primarycolor || '#D9232D',   // red
        secondary: '#2ecc71', // green
        background: '#F5F5F5', // light gray
        white: '#ffffff',
        black: '#000000',
        text: '#333333',      // dark gray
        error: '#e74c3c',     // red
        success: '#2ecc71',   // green
        warning: '#ffcc00',   // orange
        info: '#3498db',      // blue
        dissable: '#D6D9DC',

        grayLight: '#6E6E6E',
        grayDark: '#7f8c8d',
        iconColor: '#868686',
        borderColor: '#C9C9C9',
        placeholderColor: '#6F6F6F',
        iconColor1: "#808080",
        cardContainerColor: '#EFEFF4',
        gray: "#D6D9DC",
        darkGray: "#F0EFF4",
        inputFeildColor: '#EDEDED',
        skyblue: '#086BC9',
        lightGreen: '#C4D7C3',
        shadeGreen: '#8CC18A',
        lightHoney: '#F8DFA7',
        wheat: '#EDD494',
        salmon: '#FD8469',
        goldenrod: '#E1C602',
        babyBlue: '#84DBFF',
        jetBlack: '#131212',
        softGray: '#F0EFF4',
        lightGray: '#D9D9D9',
        steelBlue: '#229ECC',
        coralRed: '#DD5558',
        sunray: '#F9B526',
        paleSkyBlue: '#E6EDF7',
        palePink: '#F5E8EE',
        lightpink: '#FEE7FB',
        charcoalBlue: '#364856',
        dimGray: '#6A6A6A',



        // Menu Color
        menuName: colors?.menu_name_color || '#000000',
        menuBackground: colors?.menu_icon_bgcolor || '#FEE7FB',
        menuIcon: colors?.topbar_iconcolor || '#364856',

        //cart button
        cartBtnBgColor: colors?.prod_cart_bgcolor || '#086BC9',
        cartBtnText: colors?.prod_cart_txtcolor || '#FFFFFF',

        //custom button
        btnBgColor: colors?.button_bgcolor || '#086BC9',
        btnText: colors?.button_txtcolor || '#FFFFFF',

        //header
        headerBgColor: colors?.header_bgcolor || '#F0EFF4',

        //top icon
        topIcon: colors?.topbar_iconcolor || '#868686',

        //footer icon
        footerBgColor: colors?.footer_container_bgcolor || '#868686',
        footerTextColor: colors?.footer_container_txtcolor || '#868686',
        footerActiveColor: colors?.footer_container_activecolor || 'Black',

        //heading
        headingColor: colors?.heading_color || '#000000',

        //border 
        border_color: colors?.border_color || "#D9D9D9",
        surface_color: colors?.surface_color || "#f0eff4",

        //product image container 
        imgContainerBgColor: colors?.imagecontainer_bgcolor || '#FFF'

    }

    const endpoint = getActiveEndPoint(true);

    const contextValue = {
        Colors,
        Features: features,
        Menu: menu,
        Footer: footer,
        OrderStatus: isOrderStatus,
        LogoChar: istLogoChar,
        EndPoint: endpoint,
        NotificationModal: isModal,
        NotificationSetModal: setModal,
        NotificationModalData: isModalData,
        NotificationSetModalData: setModalData,
        SetAppLanguage: setAppLanguage,
        GlobalText: isGlobalText,
        AdminInfo: isAdminInfo,
        IsLogin: isLogin,
        SetLogin: setLogin
    };

    return (
        <CustomContext.Provider value={contextValue}>
            {children}
        </CustomContext.Provider>
    );
};

// Custom hook to use color context
export const useCustomContext = () => useContext(CustomContext);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBox: {
        width: 250,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center'
    },
    text: {
        marginBottom: 15,
        fontSize: 16
    },
    button: {
        backgroundColor: '#007BFF',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 6
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold'
    }
});

