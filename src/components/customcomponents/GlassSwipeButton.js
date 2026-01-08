import React, { forwardRef } from 'react';
import { StyleSheet, View, Text, Image } from "react-native";
import SwipeButton from "rn-swipe-button";
import LinearGradient from "react-native-linear-gradient";
// import Icon from "react-native-vector-icons/MaterialIcons";
import GlassContainer from "./GlassContainer";

const GlassSwipeButton = ({title = "Slide to Confirm",  onSwipeSuccess, onSwipeStart, onSwipeEnd, }) => {

    const Thumb = () => (
        <GlassContainer borderRadius={5} padding={6}>
            <Image
                source={require('../../assets/images/swipe_button_arrow.png')}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
            />
        </GlassContainer>
    );

    return (
        <View style={styles.wrapper}>
            {/* Gradient Track */}
            <LinearGradient
                colors={['rgba(255,255,255,1)', 'rgba(0,0,0,0.55)']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientBackground}
            />

            <SwipeButton
                height={50}
                width={"100%"}
                onSwipeSuccess={() => {
                    onSwipeEnd?.();
                    onSwipeSuccess?.();
                }}

                enableReverseSwipe={true}
                onSwipeStart={onSwipeStart}
                onSwipeFail={onSwipeEnd}


                railBackgroundColor="transparent"
                railBorderColor="rgba(255,255,255,0.4)"
                railFillBackgroundColor="transparent"
                railFillBorderColor="transparent"
                railBorderWidth={1}
                railStyles={{ borderRadius: 20 }}

                title={title}
                titleStyles={styles.text}

                // Glass Thumb
                thumbIconComponent={Thumb}
                thumbIconBackgroundColor="transparent"

                // 🔥 REMOVE GREEN BORDER
                thumbIconStyles={styles.thumbGlass}
                thumbIconBorderColor="transparent"
                thumbIconBorderWidth={0}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: "98%",
        height: 50,
        alignSelf: "center",
        borderRadius: 20,
        overflow: "hidden",
        justifyContent: "center",
    },
    gradientBackground: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: 20,
        opacity: 0.9,
    },
    text: {
        fontSize: 15,
        fontWeight: "400",
        color: "white",
    },
    thumbGlass: {
        height: 45,
        width: 45,
        borderRadius: 22.5,
        borderWidth: 0, // remove border
        justifyContent: "center",
        alignItems: "center",
        opacity: 0.9,
    },

});

export default GlassSwipeButton;
