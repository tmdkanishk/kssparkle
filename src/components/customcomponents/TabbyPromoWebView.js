import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const TabbyPromoWebView = ({ html }) => {
  const wrappedHtml = wrapHtml(html); // wrap backend HTML dynamically

  return (
    <>
      <View style={styles.container}>

        {/* WebView */}
        {html && (
          <View style={styles.webviewWrapper}>
            <WebView
              originWhitelist={['*']}
              source={{ html: wrappedHtml }}
              javaScriptEnabled
              domStorageEnabled
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              style={styles.webview}
            />
          </View>
        )}
{/* 
        <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', marginTop}}>
        <Image
          source={require('../../assets/images/secure_payment.png')}
          style={{ height: 50, width: 50, backgroundColor:'red' }}
          resizeMode="contain"
        />

        <Image
          source={require('../../assets/images/secure_payment.png')}
          style={{ height: 50, width: 50,  backgroundColor:'red' }}
          resizeMode="contain"
        />

        <Image
          source={require('../../assets/images/secure_payment.png')}
          style={{ height: 50, width: 50,  backgroundColor:'red' }}
          resizeMode="contain"
        />
        </View> */}
       
      </View>

    </>
  );
};

export default TabbyPromoWebView;

const styles = StyleSheet.create({
  container: {
    height: 400,
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    position: 'absolute', // make it appear behind WebView
    width: '50%',
    height: '50%',
  },
  webviewWrapper: {
    width: '100%',
    height: '100%',
  },
  webview: {
    backgroundColor: 'transparent',
  },
});

// wrapHtml helper
const wrapHtml = (htmlFragment) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.05">
  <title>Tabby Promo</title>
</head>
<body style="margin:0;padding:0;">
  ${htmlFragment}
</body>
</html>
`;
