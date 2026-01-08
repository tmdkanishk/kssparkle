import { StyleSheet } from 'react-native';
import Colors from './Colors';

const commonStyles = StyleSheet.create(
    {
        smallText: {
            color: Colors.white,
            fontSize: 12,
        },
        smallTextBlack: {
            color: Colors.black,
            fontSize: 12,
        },
        smallTextBlackBold: {
            color: Colors.black,
            fontSize: 13,
            fontWeight: '600'
        },
        text: {
            fontSize: 13,
            fontWeight: '400',
            color: Colors.black
        },
        textwhite: {
            fontSize: 11,
            fontWeight: '400',
            color: Colors.white
        },

        textWhite_lg: {
            fontSize: 16,
            fontWeight: '400',
            color: Colors.white
        },

        textGray_lg: {
            fontSize: 16,
            fontWeight: '400',
            color: Colors.iconColor
        },

        textWhiteBold: {
            fontSize: 14,
            fontWeight: '500',
            color: Colors.white
        },

        text_lg: {
            fontSize: 14,
            fontWeight: '700',
                        color: Colors.white


        },
        textheadingDescription: {
            fontSize: 24,
            fontWeight: '700',
            color: Colors.black
        },

        textPrimary: {
            fontSize: 16,
            fontWeight: '400',
            color: Colors.primary,

        },

        textDescription: {
            color: '#6E6E6E',
            fontWeight: '400'
        },


        largeText: {},
        smallHeading: {
            fontSize: 16,
            fontWeight: '500',

        },
        heading: {
            fontSize: 18,
            fontWeight: '600',
            color:'white'
        },
        heading_lg: {
            fontSize: 24,
            fontWeight: '600',
            color:'white'
        },

        bodyConatiner: {
            // height: '100%',
            backgroundColor: "transparent",
            flex:1,
            justifyContent:"center",
            alignItems:'center'
        },
        roundConatiner: {},



    });

export default commonStyles;