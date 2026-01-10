import React, { memo } from "react";
import { View, Text, Image, FlatList, StyleSheet, Dimensions } from "react-native";
import { BlurView } from "@react-native-community/blur";
import CategoryItem from "./CategoryItem";

const { width } = Dimensions.get("window");

// Example categories (replace with dynamic data)
const categories = [
    { id: "1", name: "EarBuds", image: require("../../assets/images/earbuds.png") },
    { id: "2", name: "Phone Cases", image: require("../../assets/images/phonecovers.png") },
    { id: "3", name: "Headphones and Chargers", image: require("../../assets/images/chargers.png") },
    { id: "4", name: "Car Products", image: require("../../assets/images/keychain.png") },
    { id: "5", name: "Car Products", image: require("../../assets/images/keychain.png") },
    { id: "6", name: "EarBuds", image: require("../../assets/images/earbuds.png") },
    { id: "7", name: "Phone Cases", image: require("../../assets/images/phonecovers.png") },
    { id: "8", name: "Headphones and Chargers", image: require("../../assets/images/chargers.png") },
    { id: "9", name: "Car Products", image: require("../../assets/images/keychain.png") },
    { id: "10", name: "Car Products", image: require("../../assets/images/keychain.png") },
    // ...more categories
];

// Single Category Item (memoized for performance)


const CategoriesList = ({ categories }) => {
    console.log("getting categories", categories)
    return (
        <FlatList
            data={categories}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            initialNumToRender={4}
            maxToRenderPerBatch={4}
            windowSize={5}
            getItemLayout={(data, index) => ({
                length: width / 4 + 16,
                offset: (width / 4 + 16) * index,
                index,
            })}
            renderItem={({ item }) => <CategoryItem item={item} />}
        />
    );
};


export default memo(CategoriesList);
