import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { WebView } from 'react-native-webview';

const TabbyPromoWebView = ({ tabbyHtml, tamaraHtml }) => {
    // const wrappedHtml = wrapHtml(tabbyHtml, tamaraHtml);
      const html = tabbyHtml || tamaraHtml;

  if (!html) return null;


  return (
    <>
      {/* <View style={styles.container}>

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

      {(tabbyHtml || tamaraHtml) && (
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
       
      </View> */}

      <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: wrapHtml(html) }}
        javaScriptEnabled
        domStorageEnabled
      />
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
    bottom: 40, // adjust this to position vertically
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
// const wrapHtml = (tabbyHtml = '', tamaraHtml = '') => `
// <!DOCTYPE html>
// <html lang="ar">
// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.05" />
//   <title>Promo</title>

//   <style>
//     body {
//       margin: 0;
//       padding: 0;
//       background: transparent;
//     }
//     .promo-container {
//       display: flex;
//       flex-direction: column;
//       gap: 40px;
//     }
//   </style>
// </head>

// <body>
//   <div class="promo-container">

//     <!-- TABBY PROMO -->
//     ${tabbyHtml || ''}

//     <!-- TAMARA PROMO -->
//     ${tamaraHtml || ''}

//   </div>
// </body>
// </html>
// `;


const wrapHtml = (html = '') => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body {
    margin: 0;
    background: transparent;
  }
</style>
</head>
<body>
  ${html}
</body>
</html>
`;
