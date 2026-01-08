import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const TabbyPromoWebView = ({ html }) => {
  if (!html) return null;

  const wrappedHtml = wrapHtml(html); // wrap backend HTML dynamically

  return (
    <View style={styles.container}>
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
    </View>
  );
};

export default TabbyPromoWebView;

const styles = StyleSheet.create({
  container: {
    height: 400, // increase the overall container height
    borderRadius: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#fff',
    // backgroundColor: '#fff', // optional, looks like a card
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  webviewWrapper: {
    width: '100%',
    height: 400,
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
