import React from 'react';
import { View, StyleSheet, Pressable, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { IconComponentArrowBackSharp } from '../constants/IconComponents';

const PromoWebViewScreen = ({ route,navigation }) => {
    const { html, title } = route.params;

    if (!html) return null;

    return (
        <View style={styles.container}>
             <Pressable hitSlop={30} style={{margin:Platform.OS === "ios"? 30: 10}} onPress={() => navigation.goBack()}>
            <IconComponentArrowBackSharp size={35} color="black" />
          {/* <Ionicons name="arrow-back" size={24} color="#fff" /> */}
        </Pressable>

            <WebView
                originWhitelist={['*']}
                source={{ html: wrapHtml(html) }}
                javaScriptEnabled
                domStorageEnabled
            />
        </View>
    );
};

export default PromoWebViewScreen;

const styles = StyleSheet.create({
    container: {
        // height:400
        marginTop:10,
        flex: 1,
        // backgroundColor: '#000',
    },
});

const wrapHtml = (html = '') => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body {
    margin: 0;
    padding: 0;
    background: transparent;
  }
</style>
</head>
<body>
  ${html}
</body>
</html>
`;
