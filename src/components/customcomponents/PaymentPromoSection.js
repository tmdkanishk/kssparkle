import React, { useState } from 'react';
import { View, Modal } from 'react-native';
import TextContainer from './TextContainer';
import TabbyPromoWebView from './TabbyPromoWebView';

const PaymentPromoSection = ({ tabbyHtml, tamaraHtml }) => {
  const [activePromo, setActivePromo] = useState(null); 
  // 'tabby' | 'tamara' | null

  return (
    <View>
      {/* Compact card */}
      <TextContainer
        onTabbyPress={() => setActivePromo('tabby')}
        onTamaraPress={() => setActivePromo('tamara')}
        onKnowMore={() => setActivePromo('tabby')} // optional default
      />

      {/* Promo Modal */}
      <Modal
        visible={!!activePromo}
        animationType="slide"
        onRequestClose={() => setActivePromo(null)}
      >
        <TabbyPromoWebView
          tabbyHtml={activePromo === 'tabby' ? tabbyHtml : ''}
          tamaraHtml={activePromo === 'tamara' ? tamaraHtml : ''}
        />
      </Modal>
    </View>
  );
};

export default PaymentPromoSection;
