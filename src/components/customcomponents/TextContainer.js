import { View, Text, StyleSheet, TouchableOpacity, Image, I18nManager, Dimensions } from 'react-native';
import React, { memo, useRef, useState } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PriceView from './PriceView';
import parsePriceText from '../../utils/parsePriceText';
import InlinePromoText from './InlinePromoText';
import GlassContainer from './GlassContainer';
import WebView from 'react-native-webview';


/* 
Output --> tabby and tamara text should match the text insdie the webview 

steps --> 1. Either load the webveiw first hand or somehow get the text from webview and show it in the contaienr 


*/

const TextContainer = ({ navigation, tabbyHtml, tamaraHtml, price, tamaraText, tabbyText, textNoFee }) => {
  const { before, priceHtml, after } = parsePriceText(tamaraText);
  const [tabbyRenderedText, setTabbyRenderedText] = useState('');
  const [tamaraRenderedText, setTamaraRenderedText] = useState('');
  const [loaded, setLoaded] = useState(false);

  // console.log("dknfkndkn", before, priceHtml, after)
  // console.log("tamara text", tamaraText);
  console.log("Tamara Html", tamaraHtml)
  console.log("Tabby Html", tabbyHtml)

  const screenHeight = Dimensions.get('window').height;

  const PromoExtractor = ({ html, onTextExtracted }) => {
    const injectedJS = `
(function() {
  function getText() {
    let text = document.body.innerText || '';
    if (text.length > 10) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({ type: 'TEXT', data: text })
      );
    } else {
      setTimeout(getText, 700);
    }
  }

  setTimeout(getText, 2000);
})();
true;
`;

    return (
      <WebView
  source={{ html: wrapHtml(html) }}
  injectedJavaScript={injectedJS}
  onMessage={handleMessage}
  javaScriptEnabled
  domStorageEnabled
  style={{
    position: 'absolute',
    top: -9999,   // move off-screen instead of height 0
    width: 300,
    height: 100,
    opacity: 0,
  }}
/>
    );
  };

  const HiddenPromoWebView = ({ html, onExtract }) => {
  const webviewRef = useRef(null);

  const injectedJS = `
    (function() {
      function extractText() {
        try {
          let text = document.body.innerText || '';

          if (text && text.trim().length > 10) {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'TEXT', data: text })
            );
          } else {
            setTimeout(extractText, 700);
          }
        } catch (e) {
          setTimeout(extractText, 700);
        }
      }

      setTimeout(extractText, 2000);
    })();
    true;
  `;

  return (
    <WebView
      ref={webviewRef}
      originWhitelist={['*']}
      source={{ html: wrapHtml(html) }}
      javaScriptEnabled
      domStorageEnabled
      onLoadEnd={() => {
        webviewRef.current.injectJavaScript(injectedJS);
      }}
      onMessage={(event) => {
        try {
          const data = JSON.parse(event.nativeEvent.data);

          console.log(data)

          if (data.type === 'TEXT') {
            console.log("djsjf dsjf",data.data)
            onExtract(data.data);
          }
        } catch (e) {}
      }}
      style={{
        position: 'absolute',
        top: -1000,   // 👈 IMPORTANT
        width: 300,
        height: 120,
        opacity: 0,
      }}
    />
  );
};

const wrapHtml = (html = '') => `
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1" />
<style>
  body {
    margin: 0;
    padding: 10px;
    background: white;
  }
</style>
</head>
<body>
  ${html}
</body>
</html>
`;

const cleanText = (text) => {
  return text
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};



  return (
    <>
      <GlassContainer padding={0.1}>
        <View style={[styles.glowWrapper, { height: tamaraHtml ? screenHeight * 0.20 : screenHeight * 0.10 }]}>
          <View style={styles.wrapper}>
            <View style={styles.content}>
              {/* <Text style={styles.mainText}>
              <PriceView
                  priceHtml={price}
                  textStyle={{
                    fontSize: 18,
                    fontWeight: "700",
                    color: "white",
                    marginLeft: 'auto'
                  }}
                  width={20}
                  height={20}
                />{' '}
            <Text style={styles.subText}>
              Payments of 30r divide your bill by
            </Text>
          </Text> */}


              {/* <Text style={{ color: '#fff', fontSize: 15, flexWrap: 'wrap' }}>
            {before + ' '}
            <PriceView
              priceHtml={priceHtml}
              textStyle={{ fontWeight: '700', fontSize: 15, color: '#fff' }}
              width={14}
              height={14}
            />
            {' ' + after}
          </Text> */}

              <View style={{ marginTop: 40, justifyContent: 'center' }}>


                <View style={{}}>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() =>
                      navigation.navigate('PromoWebView', {
                        title: 'Tabby Payment',
                        html: tabbyHtml,
                      })
                    }

                  >
                    <View style={styles.brandPill}>
                      <Image
                        source={require('../../assets/images/tabby_logo.png')}
                        style={styles.brandLogo}
                        resizeMode="contain"
                      />
                    </View>
                  </TouchableOpacity>
                  <InlinePromoText text={tabbyRenderedText || tabbyText} />

                </View>
                {
                  tamaraHtml ? <View style={{ marginTop: 10 }}>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() =>
                        navigation.navigate('PromoWebView', {
                          title: 'Tamara Payment',
                          html: tamaraHtml,
                        })
                      }
                    >
                      <View style={styles.brandPill}>
                        <Image
                          source={require('../../assets/images/tamara_logo.png')}
                          style={{ width: 60, height: 25, }}
                          resizeMode="contain"
                        />
                      </View>
                    </TouchableOpacity>

                    <InlinePromoText text={tamaraRenderedText || tamaraText} />

                  </View> : ""
                }
              </View>



              <Text style={styles.secondaryText}>
                {textNoFee}
              </Text>

              <View style={styles.bottomRow}>
                <View style={styles.leftRow}>
                  {/* <TouchableOpacity >
                <Text style={styles.knowMore}>I know more</Text>
              </TouchableOpacity> */}

                  <View style={styles.brandsContainer}>
                    {/* TABBY */}
                    {/* <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('PromoWebView', {
                      title: 'Tabby Payment',
                      html: tabbyHtml,
                    })
                  }
                >
                  <View style={styles.brandPill}>
                    <Image
                      source={require('../../assets/images/tabby_logo.png')}
                      style={styles.brandLogo}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity> */}

                    {/* TAMARA */}
                    {/* <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('PromoWebView', {
                      title: 'Tamara Payment',
                      html: tamaraHtml,
                    })
                  }
                >
                  <View style={styles.brandPill}>
                    <Image
                      source={require('../../assets/images/tamara_logo.png')}
                      style={{ width: 60, height: 25, }}
                      resizeMode="contain"
                    />
                  </View>
                </TouchableOpacity> */}
                  </View>


                </View>
              </View>

            </View>
          </View>
        </View>
      </GlassContainer>

      {/* <PromoExtractor
  html={tabbyHtml}
  onTextExtracted={setTabbyRenderedText}
/>

{tamaraHtml && (
  <PromoExtractor
    html={tamaraHtml}
    onTextExtracted={setTamaraRenderedText}
  />
)} */}

{!loaded && (
  <HiddenPromoWebView
    html={tabbyHtml}
    onExtract={(text) => {
      setTabbyRenderedText(cleanText(text));
      setLoaded(true); // ✅ stop re-render
    }}
  />
)}

{!loaded && (
  <HiddenPromoWebView
    html={tamaraHtml}
    onExtract={(text) => {
      console.log('Tamara Extracted:', text);
      setTamaraRenderedText(cleanText(text));
       setLoaded(true); // ✅ stop re-render
    }}
  />
)}
    </>
  );
};


const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 15,
    height: 180,
    // shadowColor: '#fff',
    // shadowOffset: { width: 0, height: 0 },
    // shadowOpacity: 0.4,
    // shadowRadius: 10,
  },

  borderGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 15,
  },

  wrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    // backgroundColor: 'rgba(255,255,255,0.12)',
    // borderWidth: 0.6,
    // borderColor: 'rgba(255,255,255,0.9)',
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  mainText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  subText: {
    fontWeight: '400',
    color: '#fff',
    // marginBottom:10
  },

  secondaryText: {
    marginTop: 4,
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
  },

  bottomRow: {
    marginTop: 10,
  },

  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8, // ✅ Keeps “I know more” and pills close
  },

  knowMore: {
    fontWeight: '700',
    fontSize: 14,
    color: '#fff',
    textDecorationLine: 'underline',
  },

  brandsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },

  brandPill: {
    // paddingVertical: 6,
    // paddingHorizontal: 14,
    borderRadius: 20,

    // Solid + slight glass feel
    // backgroundColor: 'rgba(0, 181, 91, 0.9)',

    // Optional glass border
    // borderWidth: 0.6,
    // borderColor: 'rgba(255,255,255,0.5)',

    // Subtle shadow
    // shadowColor: '#00B55B',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.3,
    // shadowRadius: 4,
    // elevation: 2,
    alignItems: I18nManager.isRTL ? 'flex-end' : "flex-start",
    backgroundColor: 'transparent'
  },


  brandLogo: {
    width: 50,
    height: 25,
  },


  brandText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 13,
  },
});

export default memo(TextContainer);
