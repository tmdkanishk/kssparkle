import React from 'react';
import { View, I18nManager, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const ProductDescriptionWebView = ({ html }) => {
  if (!html) return null;

  const wrappedHtml = `
    <!DOCTYPE html>
    <html dir="rtl">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            margin: 0;
            padding: 12px;
            font-size: 14px;
            line-height: 1.6;
            color: #ffffff;
            background-color: "transparent";
            font-family: -apple-system, BlinkMacSystemFont;
            direction: rtl;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
            margin: 12px auto;
          }
          p {
            margin-bottom: 12px;
            
          }
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  return (
    <View style={{ width }}>
      <WebView
        originWhitelist={['*']}
        source={{ html: wrappedHtml }}
        style={{ backgroundColor: 'transparent' }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
        javaScriptEnabled
        domStorageEnabled
      />
    </View>
  );
};

export default ProductDescriptionWebView;
