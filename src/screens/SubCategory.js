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
import { gatSubCategoryOrProduct } from "../services/getSubCategoryOrProduct";
import CustomSearchBar from "./CustomSearchBar";


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

const SubCategory = ({ navigation, route }) => {
    const { categoryId } = route?.params
    console.log("categoryId", categoryId)
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
    const [subCategories, setSubCategories] = useState([]);
    const [products, setProducts] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeSeachingScreen, setActiveSeachingScreen] = useState(false);



    const getSubCategoryProducts = async (pageNumber = 1) => {
        if (loading || pageNumber > totalPages) return;

        setLoading(true);
        try {
            const result = await gatSubCategoryOrProduct(
                categoryId,
                pageNumber,
                EndPoint?.newcategories
            );

            // ✅ Set subcategories only once
            if (pageNumber === 1) {
                setSubCategories(result?.categories || []);
            }

            const newProducts = result?.products || [];

            setProducts(prev => {
                if (pageNumber === 1) return newProducts;

                const existingIds = new Set(prev.map(p => p.product_id));
                const filtered = newProducts.filter(
                    p => !existingIds.has(p.product_id)
                );

                return [...prev, ...filtered];
            });

            setTotalPages(result?.pages || 1);
            setPage(pageNumber);
        } catch (error) {
            console.log("getSubCategoryProducts error", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        setProducts([]);
        setSubCategories([]);
        setPage(1);
        setTotalPages(1);
        getSubCategoryProducts(1);
    }, [categoryId]);



    const loadMoreProducts = () => {
        if (page < totalPages && !loading) {
            getSubCategoryProducts(page + 1);
        }
    };


    const ProductItem = memo(({ item, onPress }) => (
        <TouchableOpacity
            style={{ flex: 1, margin: 0 }}
            onPress={() => onPress(item)}
        >
            <GlassContainer style={{ padding: 12 }}>
                <Image
                    source={{
                        uri: item.thumb || "https://via.placeholder.com/150",
                    }}
                    style={{ width: "100%", height: 120 }}
                    resizeMode="contain"
                />
                <Text style={{ color: "#fff", marginTop: 8 }} numberOfLines={2}>
                    {item.name}
                </Text>
            </GlassContainer>
        </TouchableOpacity>
    ));

    const SubCategoryItem = memo(({ item, navigation }) => (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
                navigation.push("SubCategory", {
                    categoryId: item.category_id,
                    title: item.name,
                })
            }
            style={{ width: "100%", alignItems: "center", marginBottom: 12, marginTop:15 }}
        >
            <GlassContainer
                style={{
                    width: 380,
                    height: 100,
                    justifyContent: "center",
                }}
                padding={12}
            >
                {/* ROW LAYOUT */}
                <View style={styles.subRow}>
                    {/* LEFT: CIRCULAR IMAGE */}
                    <View style={styles.subImageWrapper}>
                        <Image
                            source={{
                                uri: item.image || "https://via.placeholder.com/100",
                            }}
                            style={styles.subImage}
                            resizeMode="contain"
                        />
                    </View>

                    {/* RIGHT: TEXT */}
                    <View style={{ flex: 1 }}>
                        <Text style={styles.subTitle} numberOfLines={2}>
                            {item.name}
                        </Text>
                    </View>
                </View>
            </GlassContainer>
        </TouchableOpacity>
    ));





    const chunkArray = (array, size) => {
        const result = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }
        return result;
    };

    const groupedCategories = chunkArray(categories, 2);

    const toggleSearch = () => {
        setActiveSeachingScreen(prev => !prev);
    };





    if (activeSeachingScreen) {
        return (
            <CustomSearchBar
                setActiveSeachingScreen={setActiveSeachingScreen}
            />
        );
    }



    return (
        <BackgroundWrapper>
            <FlatList
                data={products}
                keyExtractor={(item, index) => `${item.product_id}-${index}`}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 80 }}
                //   columnWrapperStyle={{
                //     justifyContent: "space-evenly",
                //     paddingHorizontal: 10,
                //   }}
                columnWrapperStyle={{ justifyContent: "space-between" }}

                /* 🔹 HEADER */
                ListHeaderComponent={
                    <>
                        {/* HEADER */}
                        <View style={styles.headerContainer}>
                            <Header
                                onSearchPress={toggleSearch}
                                paddingHorizontal={50}
                                title={route?.params?.title || "Categories"}
                            />
                        </View>

                        {/* BACK BUTTON */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
                            style={{ marginLeft: 25, marginBottom: 10 }}
                        >
                            <Image
                                source={require("../assets/images/back.png")}
                                style={{ width: 18, height: 18, tintColor: "#fff" }}
                            />

                        {subCategories.length > 0 && (
                            <Text
                                style={{
                                    color: "#fff",
                                    marginTop:15,
                                    fontSize: 16,
                                    fontWeight: "600",
                                }}
                            >
                                Sub Categories
                            </Text>
                        )}
                        </TouchableOpacity>


                        {/* 🔹 SUBCATEGORIES GRID */}
                        {subCategories.length > 0 && (
                            <FlatList
                                key="sub-category-list"   // 🔥 forces fresh render
                                data={subCategories}
                                keyExtractor={(item) => item.category_id}
                                scrollEnabled={false}
                                renderItem={({ item }) => <SubCategoryItem item={item} navigation={navigation}  />}
                            />

                        )}


                        {/* SECTION TITLE */}
                        {products.length > 0 && (
                            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600", marginLeft: 20, marginTop:10 }}>
                                Products
                            </Text>
                        )}
                    </>
                }

                /* 🔹 ITEMS */
                renderItem={({ item }) => (
                    <ProductItem
                        item={item}
                        onPress={(product) =>
                            navigation.navigate("ProductDetail", { productId: product?.product_id })
                        }
                    />
                )}

                /* 🔹 PAGINATION */
                onEndReached={loadMoreProducts}
                onEndReachedThreshold={0.3}

                /* 🔹 FOOTER */
                ListFooterComponent={
                    loading ? (
                        <Text style={{ color: "#fff", textAlign: "center", padding: 10 }}>
                            Loading...
                        </Text>
                    ) : null
                }
            />
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
        marginTop: 50
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
    subRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
    },
    subImageWrapper: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: "rgba(255,255,255,0.2)",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    subImage: {
        width: 40,
        height: 40,
    },
    subTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default memo(SubCategory);
