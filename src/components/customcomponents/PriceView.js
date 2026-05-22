import React from 'react';
import { View, Text, Image } from 'react-native';
import { parsePriceHtml } from '../../utils/parsePriceHtml';

const PriceView = ({
  priceHtml,
  specialHtml,
  textStyle,
  width,
  height,
  isRow = true,
}) => {

  const { text: priceText, image: priceImage } =
    parsePriceHtml(priceHtml);

  const { text: specialText, image: specialImage } =
    parsePriceHtml(specialHtml);

  return (
    <View
      style={{
        flexDirection: isRow ? 'row' : 'column',
        alignItems: isRow ? 'center' : 'flex-start',
      }}
    >

      {/* Original Price */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginRight: specialHtml && isRow ? 10 : 0,
          marginBottom: specialHtml && !isRow ? 4 : 0,
        }}
      >
        <Text
          style={[
            {
              textDecorationLine: specialHtml
                ? 'line-through'
                : 'none',
              opacity: specialHtml ? 0.7 : 1,
            },
            textStyle,
          ]}
        >
          {priceText}
        </Text>

        {priceImage && (
          <Image
            source={{ uri: priceImage }}
            style={{
              width: width || 14,
              height: height || 14,
              marginLeft: 4,
              resizeMode: 'contain',
            }}
          />
        )}
      </View>

      {/* Special Price */}
      {specialHtml && (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={[
              {
                color: '#00FF95',
                fontWeight: '700',
              },
              textStyle,
            ]}
          >
            {specialText}
          </Text>

          {specialImage && (
            <Image
              source={{ uri: specialImage }}
              style={{
                width: width || 14,
                height: height || 14,
                marginLeft: 4,
                resizeMode: 'contain',
              }}
            />
          )}
        </View>
      )}
    </View>
  );
};

export default PriceView;