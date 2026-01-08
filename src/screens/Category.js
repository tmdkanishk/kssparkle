import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Text,
  Image
} from "react-native";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";
import Header from "../components/customcomponents/Header";
import GlassContainer from "../components/customcomponents/GlassContainer";
import GlassButton from "../components/customcomponents/GlassButton";
import { Dimensions } from "react-native";
import { gatCategoryList } from "../services/gatCategoryList";
import { useCustomContext } from "../hooks/CustomeContext";
import CategoryCard from "../components/customcomponents/CategoryCard";


const categories = [
  { id: 1, name: "Special Offers", image: require("../assets/images/specialoffer.png") },
  { id: 2, name: "Game & Entertainment", image: require("../assets/images/game.png") },
  { id: 3, name: "Phone cases", image: require("../assets/images/phonecovers.png") },
  { id: 4, name: "Smart Products", image: require("../assets/images/vr.png") },
  { id: 5, name: "Phone Accessories", image: require("../assets/images/airpods.png") },
  { id: 6, name: "Accessories", image: require("../assets/images/cap.png") },
  //   { id: 7, name: "Car products", image: require("../assets/images/car.png") },
  //   { id: 8, name: "Smart Homes", image: require("../assets/images/smarthome.png") },
  //   { id: 9, name: "Chargers & Headphones", image: require("../assets/images/charger.png") },
];

// 🔹 Single Category Card
const CategoryItem = memo(({ item, onPress, fullWidth }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={() => onPress(item)}
    style={[
      styles.cardWrapper,
      fullWidth ? styles.fullWidthCardWrapper : { flex: 1 },
    ]}
  >
    <GlassContainer
      style={[styles.card, fullWidth && styles.fullWidthCard]} padding={0.1}
    >
      <Image
        source={item.image}
        style={[styles.image, fullWidth && styles.fullWidthImage]}
      />
      <GlassButton
        title={item.name}
        textStyle={styles.cardText}
        style={[styles.button, fullWidth && styles.fullWidthButton,]}
        innerStyle={styles.innerStyle}
      />
    </GlassContainer>
  </TouchableOpacity>
));

const Category = ({ navigation }) => {
  const { Colors, EndPoint, GlobalText, SetLogin } = useCustomContext();
  const [categories, setCategories] = useState([]);
  const handleCategoryPress = useCallback(
    (item) => {
      navigation.navigate("CategoryDetails", { category: item });
    },
    [navigation]
  );

  const categoryData = useMemo(() => categories.slice(1), []);

  const renderItem = useCallback(
    ({ item }) => (
      <CategoryItem item={item} onPress={handleCategoryPress} />
    ),
    [handleCategoryPress]
  );

  const screenWidth = Dimensions.get('window').width;
  const screenHeight = Dimensions.get('window').height;

  const getCategories = async () => {
    try {
      const result = await gatCategoryList(1, EndPoint?.category);
      console.log("result getCatgories", result);
      setCategories(result?.category || []);
    } catch (error) {
      console.log("getcategires errror", error)
    }
  }

  useEffect(() => {
    getCategories();
  }, [])

  const chunkArray = (array, size) => {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  };

  const groupedCategories = chunkArray(categories, 2);


  return (
    <BackgroundWrapper>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Header title="Categories" />
        </View>
        <TouchableOpacity style={{ marginLeft: 25, marginBottom:10 }} onPress={() => navigation.goBack()}>
          <Image source={require("../assets/images/back.png")} style={{ width: 18, height: 18, tintColor: "#fff", }} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => console.log('slkdnkn')}
          style={{
            width: "100%",
            alignItems: 'center'
          }}
        >
          <GlassContainer
            style={{
              width: 350,
              height: 220,
              justifyContent: "center",
              alignItems: "center",
              padding: 0,
            }}
            padding={0.1}
          >
            {/* IMAGE CENTERED */}
            <View
              style={{
                width: "100%",
                height: "65%",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <Image
                source={require("../assets/images/specialoffer.png")}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                resizeMode="contain"
              />
            </View>

            {/* BUTTON */}
            <GlassButton
              title="Special Offers"
              textStyle={{
                fontSize: 10,
                fontWeight: "600",
              }}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 3,
              }}
              innerStyle={{
                paddingHorizontal: 80,
              }}
            />
          </GlassContainer>
        </TouchableOpacity>


        {groupedCategories.map((row, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              width: "100%",
              paddingHorizontal: 10,
            }}
          >
            {row.map((item) => (
              <CategoryCard
                key={item.category_id}
                item={item}
                onPress={(category) => {
                  console.log("Pressed category:", category);
                }}
              />
            ))}
          </View>
        ))}




        {/* 🔹 Full Width Special Offers Card */}
        {/* <CategoryItem
          item={categories[0]}
          onPress={handleCategoryPress}
          fullWidth
        /> */}

        {/* 🔹 Other Categories in 2 Columns */}
        {/* <FlatList
          data={categoryData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.columnWrapper}
        /> */}
      </ScrollView>
    </BackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 60,
    paddingHorizontal: 16,
  },
  headerContainer: {
    marginBottom: 10,
  },
  cardWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    marginHorizontal: 5,
  },
  fullWidthCardWrapper: {
    width: "100%",
    alignSelf: "center",
  },
  card: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 24,
    height: 160,
    width: "100%",
    // backgroundColor: "rgba(255,255,255,0.08)",
    // borderWidth: 0.6,
    // borderColor: "rgba(255,255,255,0.2)",
  },
  fullWidthCard: {
    height: 220,
    width: 350
  },
  image: {
    width: 100,
    height: 80,
    resizeMode: "contain",
    marginBottom: 10,
  },
  fullWidthImage: {
    width: 160,
    height: 100,
    marginBottom: 16,
  },
  button: {
    alignSelf: "center",
    marginTop: 6,
    paddingHorizontal: 14,
    borderRadius: 20
  },
  innerStyle: {
    paddingHorizontal: 40
  },
  fullWidthButton: {
    paddingVertical: 8,
    paddingHorizontal: 3
  },
  cardText: {
    fontSize: 10,
    fontWeight: "600",
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});

export default memo(Category);
