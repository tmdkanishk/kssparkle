import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import React, { memo } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import PriceView from './PriceView';
import parsePriceText from '../../utils/parsePriceText';
import InlinePromoText from './InlinePromoText';
import GlassContainer from './GlassContainer';

const TextContainer = ({ navigation, tabbyHtml, tamaraHtml, price, tamaraText, tabbyText }) => {
  const { before, priceHtml, after } = parsePriceText(tamaraText);

  console.log("dknfkndkn", before, priceHtml, after)

  return (
    <GlassContainer padding={0.1}>
    <View style={styles.glowWrapper}>
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

            <InlinePromoText text={tamaraText} />
            {/* <InlinePromoText text={tabbyText} /> */}



          <Text style={styles.secondaryText}>
            No late fees, compliant with Islamic law
          </Text>

          <View style={styles.bottomRow}>
            <View style={styles.leftRow}>
              {/* <TouchableOpacity >
                <Text style={styles.knowMore}>I know more</Text>
              </TouchableOpacity> */}

              <View style={styles.brandsContainer}>
                {/* TABBY */}
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

                {/* TAMARA */}
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
              </View>


            </View>
          </View>

        </View>
      </View>
    </View>
    </GlassContainer>
  );
};


const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 15,
    height: 150,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
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
