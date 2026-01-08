import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { useCustomContext } from '../hooks/CustomeContext'

const Banner = ({ data }) => {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const { Colors } = useCustomContext();
  return (
    <TouchableOpacity onPress={() => {
      if (data[0]?.linktype?.includes('product')) {
        console.log("item type and product id", data[0]?.linktype, data[0]?.product_id)
        navigation.navigate('Product', { productId: data[0]?.product_id })
      } if (data[0]?.linktype?.includes('category')) {
        navigation.navigate('CategoryView', { subCategoryId: data[0]?.category_id });
      } else {
        console.log("item type and external");
        return;
      }
    }
    }
      style={{ width: '100%', height: isLandscape ? 450 : 200 }}>
      <Image source={{ uri: data[0].image }} style={{ width: '100%', height: '100%', resizeMode: 'cover' }} />
      {/* <View style={{ marginTop: -100, width: '30%', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ fontWeight: 'bold', fontSize: 24, color: Colors.primary, borderBottomWidth: 1, borderColor: 'white' }}>S1 PRO</Text>
        <Text style={{ fontWeight: '400', fontSize: 16, color: Colors.primary, }}>3200mah</Text>
        <TouchableOpacity style={{ backgroundColor: Colors.btnBgColor, padding: 6, borderRadius: 8, margin: 5 }}>
          <Text style={{ fontWeight: '600', fontSize: 12, color: Colors.primary, }}>Buy Now</Text>
        </TouchableOpacity>
      </View> */}
    </TouchableOpacity >
  )
}

export default Banner