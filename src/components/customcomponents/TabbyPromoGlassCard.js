import React, { memo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const MIN_HEIGHT = 220;

const TabbyPromoGlassCard = ({ html }) => {
  const [height, setHeight] = useState(MIN_HEIGHT);

  if (!html) return null;

  return (
    <View style={[styles.glowWrapper, { height }]}>
      <View style={styles.wrapper}>
        <WebView
          originWhitelist={['*']}
          source={{ html }}
          javaScriptEnabled
          domStorageEnabled
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          mixedContentMode="always"
          style={styles.webview}
          onMessage={(event) => {
            try {
              const data = JSON.parse(event.nativeEvent.data);
              if (data.type === 'HEIGHT' && data.height) {
                setHeight(Math.max(MIN_HEIGHT, data.height));
              }
            } catch (e) {
              // ignore invalid messages
            }
          }}
        />
      </View>
    </View>
  );
};

export default memo(TabbyPromoGlassCard);

const styles = StyleSheet.create({
  glowWrapper: {
    borderRadius: 15,
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  wrapper: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.6,
    borderColor: 'rgba(255,255,255,0.9)',
  },

  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
