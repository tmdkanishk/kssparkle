import { View, Text, TouchableOpacity, StyleSheet, Linking, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Fontisto from '@expo/vector-icons/Fontisto';
import Feather from '@expo/vector-icons/Feather';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCustomContext } from '../hooks/CustomeContext';
import { _retrieveData } from '../utils/storage';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getWhtsappInfo } from '../services/getWhtsappInfo';
import Entypo from '@expo/vector-icons/Entypo';

const BottomBar = ({ tab }) => {
    const [isLogin, setLogin] = useState(false);
    const { Colors, Footer, GlobalText, EndPoint } = useCustomContext();
    const navigation = useNavigation();


    useFocusEffect(
        useCallback(() => {
            checkUserLogin();
        }, [])
    )

    // useEffect(() => {
    //     checkUserLogin();
    // }, []);

    const checkUserLogin = async () => {
        const user = await _retrieveData('USER');
        if (user) {
            setLogin(true);
        }
        // console.log('user on bottom', user[0]);
    }

    // const [activeTab, setActiveTab] = useState(tab);

    const onClickHome = () => {
        // setActiveTab(0)
        navigation.navigate('Home')
    }
    const onClickCategory = () => {
        // setActiveTab(1)
        navigation.navigate('Category')
    }

    const onClickBrand = () => {
        // setActiveTab(1)
        navigation.navigate('Brands');
    }

    const onClickOrders = () => {
        // setActiveTab(2)
        if (isLogin === true) {
            navigation.navigate('OrderHistory')
        } else {
            navigation.navigate('Login')
        }
    }

    const openWhatsApp = async () => {
        try {

            const response = await getWhtsappInfo(EndPoint?.whtsapp);

            console.log('response whats app', response);

            const phoneNumber = response?.members[0]?.member_number; // Replace with your business number
            const message = `Hi ${response?.members[0]?.member_name}`; // Default message

            if (response?.members[0]?.online_status == 1) {
                const formattedNumber = phoneNumber.replace(/\D/g, '');
                const url = `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;

                try {
                    const supported = await Linking.canOpenURL(url);
                    if (supported) {
                        await Linking.openURL(url);
                    } else {
                        Alert.alert('Error', 'WhatsApp is not installed');
                    }
                } catch (error) {
                    Alert.alert('Error', 'Failed to open WhatsApp');
                    console.error(error);
                }
            } else {
                Alert.alert(
                    response?.module_title,
                    response?.members[0]?.time_text,
                    [
                        { text: GlobalText?.extrafield_okbtn, onPress: () => console.log('ok pressed!') }
                    ]
                );
            }


        } catch (error) {
            console.log('error whats app', error.response.data);
        }


    };


    const onClickMyCart = () => {
        // setActiveTab(3)
        navigation.navigate('CartScreen')
        // animationRef.current.play();
    }


    const renderFooterButton = (info) => {
        switch (info.name) {
            case "home":
                return (
                    <TouchableOpacity style={styles.bottomBtn} onPress={onClickHome}>
                        <FontAwesome name="home" size={24} color={tab === 0 ? Colors.footerActiveColor : Colors.footerTextColor} />
                        <Text style={{ color: tab === 0 ? Colors.footerActiveColor : Colors.footerTextColor }}>{info.label}</Text>
                    </TouchableOpacity>
                );
            case "categories":
                return (
                    <TouchableOpacity style={styles.bottomBtn} onPress={onClickCategory} key={info.name}>
                        <MaterialCommunityIcons name="view-dashboard" size={24} color={tab === 1 ? Colors.footerActiveColor : Colors.footerTextColor} />
                        <Text style={{ color: tab === 1 ? Colors.footerActiveColor : Colors.footerTextColor }}>{info.label}</Text>
                    </TouchableOpacity>
                );

            case "orders":
                return (
                    <TouchableOpacity style={styles.bottomBtn} onPress={onClickOrders} key={info.name}>
                        <Fontisto name="file-1" size={24} color={tab === 2 ? Colors.footerActiveColor : Colors.footerTextColor} />
                        <Text style={{ color: tab === 2 ? Colors.footerActiveColor : Colors.footerTextColor }}>{info.label}</Text>
                    </TouchableOpacity>
                );
            case "manufacturer":
                return (
                    <TouchableOpacity style={styles.bottomBtn} onPress={onClickBrand} key={info.name}>
                        <Entypo name="price-tag" size={24} color={tab === 3 ? Colors.footerActiveColor : Colors.footerTextColor} />
                        <Text style={{ color: tab === 3 ? Colors.footerActiveColor : Colors.footerTextColor }}>{info.label}</Text>
                    </TouchableOpacity>
                );
            case "mycart":
                return (
                    <TouchableOpacity style={[styles.bottomBtn]} onPress={onClickMyCart} key={info.name}>
                        <Feather name="shopping-cart" size={24} color={tab === 4 ? Colors.footerActiveColor : Colors.footerTextColor} />
                        <Text style={{ color: tab === 4 ? Colors.footerActiveColor : Colors.footerTextColor }}>{info.label}</Text>
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    };

    return (

        <View style={styles.container}>
            {/* Floating WhatsApp button */}
            {/* <TouchableOpacity
                style={styles.whatsappButton}
                onPress={openWhatsApp}
            >
                <FontAwesome5 name="whatsapp" size={24} color="white" />
            </TouchableOpacity> */}

            <View style={[styles.bottomBtnContainer, { backgroundColor: Colors.footerBgColor, }]}>


                {
                    Footer?.length > 0 ? (
                        Footer?.map((item, index) => (
                            <View key={index}>
                                {
                                    renderFooterButton(item)
                                }

                            </View>

                        ))
                    ) : null
                }

            </View>
        </View>
    )
}

export default BottomBar


const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    bottomBtn: {
        alignItems: 'center',
        padding: 10,
    },
    bottomBtnContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingVertical: 5,
        opacity: 1,
        alignSelf: 'center',
        // height: '10%',
        position: 'absolute',
        bottom: 0,
        shadowOffset: {
            width: 0,
            height: 4, // Adjust this for bottom shadow
        },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 20,
        shadowColor: '#000',
    },

    whatsappButton: {
        position: 'absolute',
        right: 12,
        bottom: 130,
        backgroundColor: '#25D366',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        zIndex: 10,
    }

})