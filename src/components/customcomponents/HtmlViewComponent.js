import React, { useMemo, useState } from 'react';
import { View, Text, Image, I18nManager } from 'react-native';
import HTMLView from 'react-native-htmlview';

const TEXT_COLOR = '#FFFFFF';
const FONT_SIZE = 17;
const LINE_HEIGHT = 30;
const COLLAPSED_LINES = 3;
const COLLAPSED_HEIGHT = LINE_HEIGHT * COLLAPSED_LINES;

const isRTL = I18nManager.isRTL;

const HtmlViewComponent = ({ descriptionData, readLessText, readMoreText }) => {
  const [expanded, setExpanded] = useState(false);
  const [showReadMore, setShowReadMore] = useState(false);
  const [htmlMeasured, setHtmlMeasured] = useState(false);

  const isHtml = useMemo(() => {
    if (!descriptionData) return false;
    return /<\/?[a-z][\s\S]*>/i.test(descriptionData);
  }, [descriptionData]);

  // ─── Plain Text Path ───────────────────────────────────────────────
if (!isHtml) {
  return (
    <View style={{ width: '100%' }}>
      
      {/* Hidden full render — only for measuring total lines */}
      <Text
        style={{
          color: TEXT_COLOR,
          fontSize: FONT_SIZE,
          lineHeight: LINE_HEIGHT,
          position: 'absolute',
          opacity: 0,
          zIndex: -1,
        }}
        onTextLayout={(e) => {
          if (e.nativeEvent.lines.length > COLLAPSED_LINES) {
            setShowReadMore(true);
          }
        }}
      >
        {descriptionData}
      </Text>

      {/* Visible render — collapsed or expanded */}
      <Text
        numberOfLines={expanded ? undefined : COLLAPSED_LINES}
        style={{
          color: TEXT_COLOR,
          fontSize: FONT_SIZE,
          lineHeight: LINE_HEIGHT,
          textAlign: isRTL ? 'right' : 'left',
          writingDirection: isRTL ? 'rtl' : 'ltr',
        }}
      >
        {descriptionData}
      </Text>

      {showReadMore && (
        <Text
          onPress={() => setExpanded(!expanded)}
          style={{ color: '#4DA6FF', marginTop: 5, fontSize: 14, fontWeight: '600' }}
        >
          {expanded ? readLessText : readMoreText}
        </Text>
      )}
    </View>
  );
}
  // ─── HTML Path ─────────────────────────────────────────────────────
  return (
    <View style={{ width: '100%' }}>
      <View
        style={{
          maxHeight: htmlMeasured && !expanded ? COLLAPSED_HEIGHT : undefined,
          overflow: 'hidden',
        }}
      >
        <View
          onLayout={(e) => {
            if (htmlMeasured) return;
            const height = e.nativeEvent.layout.height;
            if (height > COLLAPSED_HEIGHT) setShowReadMore(true);
            setHtmlMeasured(true);
          }}
        >
          <HTMLView
            value={descriptionData}
            textComponentProps={{
              style: {
                color: TEXT_COLOR,
                fontSize: FONT_SIZE,
                lineHeight: LINE_HEIGHT,
              },
            }}
            stylesheet={{
              p: {
                color: TEXT_COLOR,
                fontSize: FONT_SIZE,
                lineHeight: LINE_HEIGHT,
                marginBottom: 8,
                textAlign: isRTL ? 'right' : 'left',
                writingDirection: isRTL ? 'rtl' : 'ltr',
              },
              span: { color: TEXT_COLOR, fontSize: FONT_SIZE },
              strong: { color: TEXT_COLOR, fontWeight: '700' },
              b: { color: TEXT_COLOR, fontWeight: '700' },
              em: { color: TEXT_COLOR, fontStyle: 'italic' },
              h1: { color: TEXT_COLOR, fontSize: 25, fontWeight: '700', marginVertical: 12 },
              h2: { color: TEXT_COLOR, fontSize: 22, fontWeight: '700', marginVertical: 10 },
              h3: { color: TEXT_COLOR, fontSize: 20, fontWeight: '600', marginVertical: 8 },
              li: {
                color: TEXT_COLOR,
                fontSize: FONT_SIZE,
                lineHeight: LINE_HEIGHT,
                marginBottom: 6,
              },
              ul: { marginVertical: 8 },
              ol: { marginVertical: 8 },
              a: { color: '#4DA6FF', textDecorationLine: 'underline' },
            }}
            renderNode={(node, index) => {
              if (node.name === 'img') {
                const src = node.attribs?.src;
                if (!src) return null;
                return (
                  <View key={index} style={{ alignItems: 'center', marginVertical: 16 }}>
                    <Image
                      source={{ uri: src }}
                      style={{ width: '100%', height: 220, resizeMode: 'contain', borderRadius: 12 }}
                    />
                  </View>
                );
              }
              return undefined;
            }}
          />
        </View>
      </View>

      {showReadMore && (
        <Text
          onPress={() => setExpanded(!expanded)}
          style={{ color: '#4DA6FF', marginTop: 5, fontSize: 14, fontWeight: '600' }}
        >
          {expanded ? readLessText : readMoreText}
        </Text>
      )}
    </View>
  );
};

export default HtmlViewComponent;