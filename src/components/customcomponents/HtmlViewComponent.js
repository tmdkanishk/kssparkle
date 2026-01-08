import React from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import HTMLView from 'react-native-htmlview';

const TEXT_COLOR = '#FFFFFF';
const FONT_SIZE = 19;
const LINE_HEIGHT = 26;


const HtmlViewComponent = ({ descriptionData }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <HTMLView
        value={descriptionData || ''}

        /* Force font globally */
        textComponentProps={{
          style: {
            color: TEXT_COLOR,
            fontSize: FONT_SIZE,
            lineHeight: LINE_HEIGHT,
          },
        }}

        onLinkPress={(url) => {
          console.log('Link clicked:', url);
        }}

        /* Main place to control fonts */
        stylesheet={{
          p: {
            color: TEXT_COLOR,
            fontSize: FONT_SIZE,
            lineHeight: LINE_HEIGHT,
            marginBottom: 8,
          },

          h1: {
            color: TEXT_COLOR,
            fontSize: 25,
            fontWeight: '700',
            marginVertical: 12,
          },
          h2: {
            color: TEXT_COLOR,
            fontSize: 25,
            fontWeight: '700',
            marginVertical: 10,
          },
          h3: {
            color: TEXT_COLOR,
            fontSize: 25,
            fontWeight: '600',
            marginVertical: 8,
          },
          h4: {
            color: TEXT_COLOR,
            fontSize: 25,
            fontWeight: '600',
            marginVertical: 6,
          },

          span: {
            color: TEXT_COLOR,
            fontSize: FONT_SIZE,
          },

          strong: {
            color: TEXT_COLOR,
            fontWeight: '700',
          },

          b: {
            color: TEXT_COLOR,
            fontWeight: '700',
          },

          em: {
            color: TEXT_COLOR,
          },

          li: {
            color: TEXT_COLOR,
            fontSize: FONT_SIZE,
            lineHeight: LINE_HEIGHT,
            marginBottom: 6,
          },

          ul: {
            marginVertical: 8,
          },

          ol: {
            marginVertical: 8,
          },

          a: {
            color: '#4DA6FF',
            fontSize: FONT_SIZE,
            textDecorationLine: 'underline',
          },
        }}

        /* Use renderNode ONLY for images */
        renderNode={(node, index) => {
          if (node.name === 'img') {
            const src = node.attribs?.src;
            if (!src) return null;

            return (
              <View
                key={index}
                style={{
                  alignItems: 'center',
                  marginVertical: 16,
                }}
              >
                <Image
                  source={{ uri: src }}
                  style={{
                    width: '100%',
                    height: 220,
                    resizeMode: 'contain',
                    borderRadius: 12,
                  }}
                />
              </View>
            );
          }

          return undefined;
        }}
      />
    </ScrollView>
  );
};

export default HtmlViewComponent;
