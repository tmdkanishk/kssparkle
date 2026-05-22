import React from 'react';
import { Text, View } from 'react-native';
import PriceView from './PriceView';
import parsePriceText from '../../utils/parsePriceText';

const InlinePromoText = ({ text }) => {
    if (!text) return null;

    const { before, priceHtml, after } = parsePriceText(text);

    return (
        <Text style={{ color: '#fff', fontSize: 15, flexWrap: 'wrap' }}>
            {before + ' '}
            {priceHtml && (
                <View style={{marginTop:20}}>
                    <PriceView
                        priceHtml={priceHtml}
                        textStyle={{
                            fontWeight: '700',
                            fontSize: 15,
                            color: '#fff',
                            // marginBottom:10
                        }}
                        width={14}
                        height={14}
                    />
                </View>
            )}
            {' ' + after}
        </Text>
    );
};

export default InlinePromoText;
