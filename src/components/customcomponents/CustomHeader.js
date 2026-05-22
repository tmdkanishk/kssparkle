import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ pageName }) => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 16,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <TouchableOpacity
        hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        style={{
          width: 44,
          height: 44,
          justifyContent: 'center',
          alignItems: 'flex-start',
        }}
        onPress={() => navigation.goBack()}
      >
        <Image
          source={require('../../assets/images/back.png')}
          style={{
            width: 18,
            height: 18,
            tintColor: '#fff',
          }}
        />
      </TouchableOpacity>

      <Text
        style={{
          color: '#fff',
          fontSize: 18,
          fontWeight: '700',
          marginLeft: 8,
          flex: 1,
        }}
        numberOfLines={1}
      >
        {pageName}
      </Text>
    </View>
  );
};

export default CustomHeader;