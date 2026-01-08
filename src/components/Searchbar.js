import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Modal,
  Keyboard,
  TouchableWithoutFeedback,
  Dimensions,
  ImageBackground,
} from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useCustomContext } from '../hooks/CustomeContext';
import { useNavigation } from '@react-navigation/native';
import { autoSearch } from '../services/autoSearch';
import GlassSearchBox from './customcomponents/GlassSearchBox';
import { BlurView } from '@react-native-community/blur';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Searchbar = ({ w, h, iconSize, onClickSearch, query }) => {
  const { Colors, EndPoint, GlobalText } = useCustomContext();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [filteredData, setFilteredData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const inputRef = useRef(null);
  const navigation = useNavigation();

  useEffect(() => {
    setShowAll(false); // reset showAll on new search query
    if (searchQuery.length > 0) {
      handleData(searchQuery);
    } else {
      setFilteredData([]);
    }
  }, [searchQuery]);

  const handleData = async (searchTerm) => {
    try {
      const response = await autoSearch(searchTerm, EndPoint?.autosearch);
      console.log('autosearch :-', response?.results);

      if (response?.results?.length > 0) {
        const mappedData = response?.results?.map((item) => ({
          id: item?.product_id,
          title: item?.name,
          image: item?.image || 'https://via.placeholder.com/40',
          href: item?.href || item?.url,
          price: item?.price,
          special: item?.special
        }));
        setFilteredData(mappedData);
      } else {
        setFilteredData([]);
      }
    } catch (error) {
      console.log('error', error);
      setFilteredData([]);
    }
  };

  const handleSelectItem = (item) => {
    setSearchQuery(item.title);
    setModalVisible(false);
    // navigation.navigate('Product', { productId: item.id });
    navigation.push('Product', { productId: item.id });
    // onClickSearch(item); // optionally pass full item if needed
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const openModal = () => {
    setModalVisible(true);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  // Show only first 5 items unless showAll is true
  const displayedData = showAll ? filteredData : filteredData.slice(0, 5);

  return (
    <>
      {/* Search Bar */}
      {/* <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.searchContainer,
          {
            height: h,
            width: w,
            borderColor: Colors?.border_color,
            backgroundColor: 'white',
          },
        ]}
        onPress={openModal}
      >
        <View style={{ flexDirection: 'row', gap: 16, width: '90%', alignItems: 'center' }}>
          <Feather
            name="search"
            size={iconSize || 24}
            color={Colors.placeholderColor || 'black'}
          />
          <Text style={{ color: Colors.placeholderColor }}>{GlobalText?.extrafield_searchhere}</Text>
        </View>
      </TouchableOpacity> */}

      <GlassSearchBox
        h={46}
        w="100%"
        openModal={openModal}
        Colors={Colors}
        placeholder={GlobalText?.extrafield_searchhere}
      />


      {/* Modal with suggestions */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={handleCloseModal}
      >
         <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback activeOpacity={1} onPress={handleCloseModal} style={{
                        flex: 1,
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>

                                  <ImageBackground
                                      source={require('../assets/images/backgroundimage.png')}
                                      resizeMode="cover"
                                      style={{
                                          width:"80%",   // 👈 THIS FIXES IT
                                          borderRadius: 16,
                                          overflow: 'hidden',
                                      }}
                                  >
          <View style={styles.modalOverlay}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {/* Search input in modal */}
                <View style={[styles.searchContainer, { marginBottom: 10 }]}>
                  <Feather
                    name="search"
                    size={iconSize || 24}
                    color={Colors.placeholderColor || 'black'}
                    style={{ marginRight: 10 }}
                  />
                  <TextInput
                    ref={inputRef}
                    style={[styles.searchInputBox, { color: Colors.placeholderColor }]}
                    placeholder={GlobalText?.extrafield_searchhere}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    returnKeyType="search"
                    onSubmitEditing={() => {
                      onClickSearch(searchQuery);
                      handleCloseModal();
                    }}
                  />
                </View>

                {/* Search suggestions list */}
                <FlatList
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  data={displayedData}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.suggestionItem}
                      onPress={() => handleSelectItem(item)}
                    >
                      <Image source={{ uri: item.image }} style={styles.itemImage} />
                      <View style={{ flex: 1, justifyContent: 'center' }}>
                        <Text style={styles.itemText}>{item.title}</Text>
                        {(item.special !== null) ? <>
                          <Text style={{ fontSize: 14, textDecorationLine: 'line-through' }}>{GlobalText?.extrafield_lowestprice_label}: {item.price}</Text>
                          <Text style={{ fontSize: 14, color: '#DD0017' }}>{GlobalText?.extrafield_reducedtprice_label}: {item.special}</Text>
                        </>
                          : <Text style={{ fontSize: 14, }}>{GlobalText?.extrafield_lowestprice_label}: {item.price}</Text>
                        }

                      </View>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <View style={{ padding: 20, alignItems: 'center' }}>
                      <Text style={{ fontSize: 16, color: '#888' }}>{GlobalText?.extrafield_noresult}</Text>
                    </View>
                  )}
                  ListFooterComponent={() =>
                    !showAll && filteredData.length ? (
                      <TouchableOpacity
                        style={styles.viewMoreButton}
                        onPress={() => onClickSearch(searchQuery)}
                      >
                        <Text style={styles.viewMoreText}>{GlobalText?.extrafield_viewmore}</Text>
                      </TouchableOpacity>
                    ) : null
                  }
                />
              </View>
            </TouchableWithoutFeedback>
          </View>

          </ImageBackground>    

        </TouchableWithoutFeedback>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  searchInputBox: {
    flex: 1,
    fontSize: 14,
    fontWeight: '400',
    paddingVertical: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 16,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    maxHeight: SCREEN_HEIGHT * 0.6,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    width: '100%'
  },
  itemImage: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 6,
  },
  itemText: {
    fontSize: 16,
    flexWrap: 'wrap',
  },
  viewMoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  viewMoreText: {
    color: '#007BFF',
    fontWeight: '600',
    fontSize: 16,

  },
});

export default Searchbar;