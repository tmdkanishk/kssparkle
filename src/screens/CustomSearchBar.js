import { View, Text, Pressable, Image, TextInput, FlatList, Modal, ScrollView, BackHandler, Keyboard } from 'react-native'
import React, { memo, useEffect, useRef, useState } from 'react'
import { IconComponentArrowBackSharp, IconComponentSearch } from '../constants/IconComponents';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { autoSearch } from '../services/autoSearch';
import { useCustomContext } from '../hooks/CustomeContext';
import BackgroundWrapper from '../components/customcomponents/BackgroundWrapper';


const CustomSearchBar = ({ setActiveSeachingScreen }) => {
    const navigation = useNavigation();
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [query, setQuery] = useState('');
    const [result, setResults] = useState([]);
    const debounceRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            () => {
                Keyboard.dismiss();
                setActiveSeachingScreen(false);
                return true;
            }
        );
        return () => backHandler.remove();
    }, []);


    const onSearch = () => {
        // navigation.navigate('Search', { query: query });
        // setQuery('');
    }

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        // Debounce API call
        debounceRef.current = setTimeout(() => {
            searchAPI(query);
        }, 400);

        return () => clearTimeout(debounceRef.current);
    }, [query]);


    const searchAPI = async (text) => {
        try {
            var response = await autoSearch(text, EndPoint?.autosearch);
            setResults(response?.products);
            console.log("response", response);
        } catch (error) {
            console.log('Search error', error);
        }
    };



 const renderItem = ({ item }) => (
  <Pressable
    onPress={() => {
      navigation.push('ProductDetail', { productId: item?.product_id });
      setActiveSeachingScreen(false);
    }}
    style={{
      borderBottomWidth: 1,
      borderBottomColor: '#FFFFFF', // optional: white divider
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      paddingBottom: 10,
    }}
  >
    <Image
      source={{ uri: item?.thumb }}
      style={{ width: 80, height: 80 }}
    />

    <View style={{ width: '80%' }}>
      <Text
        style={{
          flexWrap: 'wrap',
          color: '#FFFFFF', // ✅ text white
        }}
      >
        {item?.name}
      </Text>
    </View>
  </Pressable>
);





    return (
        <BackgroundWrapper>
        <View style={{ flex: 1, paddingHorizontal:12, paddingVertical:30}}>
            <View style={{ flexDirection: 'row', width: '100%', gap: 10, alignItems: 'center', marginTop:20,}}>
                <Pressable onPress={() => setActiveSeachingScreen(false)}>
                    <IconComponentArrowBackSharp />
                </Pressable>
                <View style={{ borderWidth: 1, borderRadius: 10, width: '90%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                    <TextInput
                        ref={inputRef}
                        style={[{ textAlign: 'left', width: '80%', paddingLeft: 20 , color: '#FFFFFF',  }]}
                        placeholder='Search Products...'
                        onChangeText={(text) => setQuery(text)}
                        returnKeyType="search"
                        onSubmitEditing={() => onSearch()}
                        autoFocus={true}
                        placeholderTextColor="rgba(255,255,255,0.6)" // 👈 placeholder white
                    />

                    <TouchableOpacity onPress={() => onSearch()} style={{ backgroundColor: 'transparent', width: 46, height: 46, borderRadius: 8, borderWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                        {/* <IconComponentSearch /> */}
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                data={result}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={[{ marginTop: 30, color: '#FFFFFF' }]}>{query ? 'Not Found!' : 'Empty!'}</Text>}
                contentContainerStyle={{ gap: 10, paddingBottom: 100, paddingTop: 20 }}
            />

        </View>
        </BackgroundWrapper>

    )
}

export default memo(CustomSearchBar);