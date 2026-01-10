import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const TabbyPromoWebView = ({ html }) => {
  const wrappedHtml = wrapHtml(html); // wrap backend HTML dynamically

  return (
    <>
      <View style={styles.container}>

        {/* Images positioned behind WebView */}
        <View style={styles.imagesContainer}>
          <Image
            source={require('../../assets/images/secure_payment.webp')}
            style={styles.image}
            resizeMode="contain"
          />

          <Image
            source={require('../../assets/images/original_products.webp')}
            style={styles.image}
            resizeMode="contain"
          />

          <Image
            source={require('../../assets/images/fast_shipping.png')}
            style={styles.image}
            resizeMode="contain"
            
          />
        </View> 

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
    position: 'relative', // important for absolute positioning of children
  },
  imagesContainer: {
    position: 'absolute',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 130, // adjust this to position vertically
    left: 0,
    right: 0,
    zIndex: 0, // ensure it's behind the WebView
  },
  image: {
    height: 100,
    width: 100,
    marginHorizontal: 5, // spacing between images
  },
  webviewWrapper: {
    width: '100%',
    height: '100%',
    zIndex: 1, // ensure WebView is in front
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
<body style="margin:0;padding:0;background:transparent;">
  ${htmlFragment}
</body>
</html>
`;