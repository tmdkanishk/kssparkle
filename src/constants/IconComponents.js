import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import AntDesign from '@expo/vector-icons/AntDesign'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';



export const IconComponentNotification = ({ color, size }) => {
    return (
        <Ionicons name="notifications-outline" size={size ? size : 26} color={color ? color : "black"} />
    )
}


export const IconComponentSettings = ({ color, size }) => {
    return (
        <Feather name="settings" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentRupee = ({ color, size }) => {
    return (
        <FontAwesome name="rupee" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCoin = ({ color, size }) => {
    return (
        <FontAwesome5 name="coins" size={size ? size : 24} color={color ? color : "black"} />
    )
}



export const IconComponentUser = ({ color, size }) => {
    return (
        <Entypo name="user" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentHeart = ({ color, size }) => {
    return (
        <Ionicons name="heart-outline" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentAddress = ({ color, size }) => {
    return (
        <MaterialCommunityIcons name="office-building-marker-outline" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentPassword = ({ color, size }) => {
    return (
        <AntDesign name="lock1" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentDownload = ({ color, size }) => {
    return (
        <MaterialCommunityIcons name="download-outline" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentLogout = ({ color, size }) => {
    return (
        <MaterialIcons name="logout" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentHelp = ({ color, size }) => {
    return (
        <AntDesign name="questioncircleo" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentShare = ({ color, size }) => {
    return (
        <AntDesign name="sharealt" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentRate = ({ color, size }) => {
    return (
        <AntDesign name="staro" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentStar = ({ color, size }) => {
    return (
        <AntDesign name="star" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentTrash = ({ color, size }) => {
    return (
        <FontAwesome name="trash-o" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentDownArrow = ({ color, size }) => {
    return (
        <AntDesign name="down" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentUpArrow = ({ color, size }) => {
    return (
        <AntDesign name="up" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentRightArrow = ({ color, size }) => {
    return (
        <AntDesign name="right" size={size ? size : 24} color={color ? color : "black"} />
    )
}


export const IconComponentRadioBtnActive = ({ color, size }) => {
    return (
        <Fontisto name="radio-btn-active" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentRadioBtn = ({ color, size }) => {
    return (
        <Fontisto name="radio-btn-passive" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCheckSquare = ({ color, size }) => {
    return (
        <Feather name="check-square" size={size ? size : 24} color={color ? color : "black"} />
    )
}


export const IconComponentSquare = ({ color, size }) => {
    return (
        <Feather name="square" size={size ? size : 24} color={color ? color : "black"} />

    )
}


export const IconComponentLocation = ({ color, size }) => {
    return (
        <Ionicons name="location-outline" size={size ? size : 24} color={color ? color : "black"} />

    )
}

export const IconComponentClose = ({ color, size }) => {
    return (
        <AntDesign name="close" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCart = ({ color, size }) => {
    return (
        <AntDesign name="shoppingcart" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentFlipLeftArrow = ({ color, size }) => {
    return (
        <Ionicons name="arrow-undo-outline" size={size ? size : 24} color={color ? color : "black"} />

    )
}

export const IconComponentDashboard = ({ color, size }) => {
    return (
        <MaterialCommunityIcons name="view-dashboard" size={size ? size : 24} color={color ? color : "black"} />

    )
}

export const IconComponentEmail = ({ color, size }) => {
    return (
        // <MaterialCommunityIcons name="email-outline" size={24} color="black" />
        <MaterialCommunityIcons name="email-outline" size={size ? size : 24} color={color ? color : "black"} />

    )
}


export const IconComponentCallWithRing = ({ color, size }) => {
    return (
        <Feather name="phone-call" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentOfficeBuilding = ({ color, size }) => {
    return (
        <MaterialCommunityIcons name="office-building" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentArrowUpLong = ({ color, size }) => {
    return (
        <FontAwesome name="long-arrow-up" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentArrowDownLong = ({ color, size }) => {
    return (
        <FontAwesome name="long-arrow-down" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentFilter = ({ color, size }) => {
    return (
        <FontAwesome name="filter" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentHome = ({ color, size }) => {
    return (
        <FontAwesome name="home" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentProfile = ({ color, size }) => {
    return (
        <FontAwesome name="user" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentSetting = ({ color, size }) => {
    return (
        <Ionicons name="settings" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentContact = ({ color, size }) => {
    return (
        <FontAwesome5 name="phone-alt" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentQuestionMark = ({ color, size }) => {
    return (
        <FontAwesome5 name="question" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentLogin = ({ color, size }) => {
    return (
        <SimpleLineIcons name="login" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentLogOut = ({ color, size }) => {
    return (
        <SimpleLineIcons name="logout" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentEyes = ({ color, size }) => {
    return (
        <Entypo name="eye" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentEyesLine = ({ color, size }) => {
    return (
        <Entypo name="eye-with-line" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentBag = ({ color, size }) => {
    return (
        <Ionicons name="bag-handle-outline" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentImage = ({ color, size }) => {
    return (
        <Entypo name="images" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCarts = ({ color, size }) => {
    return (
        <Feather name="shopping-cart" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentHeartFill = ({ color, size }) => {
    return (
        <AntDesign name="heart" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentEdit = ({ color, size }) => {
    return (
        <Feather name="edit-2" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentUpload = ({ color, size }) => {
    return (
        <Feather name="upload" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCheck = ({ color, size }) => {
    return (
        <FontAwesome name="check-circle" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentFalse = ({ color, size }) => {
    return (
        <FontAwesome name="times-circle" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentWarning = ({ color, size }) => {
    return (
        <FontAwesome name="warning" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCalender = ({ color, size }) => {
    return (
        <AntDesign name="calendar" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentDocs = ({ color, size }) => {
    return (
        <Fontisto name="file-1" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentPlayBtn = ({ color, size }) => {
    return (
        <Entypo name="controller-play" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentTruck = ({ color, size }) => {
    return (
        <FontAwesome name="truck" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCaretdown = ({ color, size }) => {
    return (
        <AntDesign name="caretdown" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentCaretup = ({ color, size }) => {
    return (
        <AntDesign name="caretup" size={size ? size : 24} color={color ? color : "black"} />
    )
}

export const IconComponentSearch = ({ color, size }) => {
    return (

        <Feather name="search" size={size ? size : 24} color={color ? color : "black"} />
    )
}


export const IconComponentArrowBackSharp = ({ color, size }) => {
    return (

        <Ionicons name="arrow-back-outline" size={size ? size : 24} color={color ? color : "black"} />
    )
}








































































