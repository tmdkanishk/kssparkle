import React from 'react';
import { View, Text, Image } from 'react-native';
import { parsePriceHtml } from '../../utils/parsePriceHtml';

const PriceView = ({ priceHtml, textStyle, width, height }) => {
  const { text, image } = parsePriceHtml(priceHtml);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={[{ color: '#fff', fontSize: 16 }, textStyle]}>
        {text}
      </Text>

      {image && (
        <Image
          source={{ uri: image }}
          style={{
            width: width || 14,
            height: height || 14,
            marginLeft: 4,
            resizeMode: 'contain',
          }}
        />
      )}
    </View>
  );
};

export default PriceView;
