import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    Image,
    TouchableOpacity,
    StyleSheet,
    Modal
} from "react-native";
import Video from "react-native-video";
import BackgroundWrapper from "../components/customcomponents/BackgroundWrapper";

const ReviewMediaScreen = ({ route, navigation }) => {

    const { images = [], videos = [] } = route.params;

    const [activeTab, setActiveTab] = useState("images");
    const [playingIndex, setPlayingIndex] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    return (
        <BackgroundWrapper>
            <View style={styles.container}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Customer Media</Text>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.close}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Tabs */}

                <View style={styles.tabs}>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === "images" && styles.activeTab]}
                        onPress={() => setActiveTab("images")}
                    >
                        <Text style={styles.tabText}>Images</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, activeTab === "videos" && styles.activeTab]}
                        onPress={() => setActiveTab("videos")}
                    >
                        <Text style={styles.tabText}>Videos</Text>
                    </TouchableOpacity>

                </View>

                {/* Content */}

                {activeTab === "images" ? (

                    <FlatList
                        key="images"
                        data={images}
                        numColumns={2}
                        keyExtractor={(_, i) => `img-${i}`}
                        columnWrapperStyle={{
                            justifyContent: "center",
                            gap: 10
                        }}
                        contentContainerStyle={{
                            paddingHorizontal: 10
                        }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                activeOpacity={0.9}
                                onPress={() => {
                                    setSelectedImage(item.thumb);
                                    setImageModalVisible(true);
                                }}
                            >
                                <Image
                                    source={{ uri: item.thumb }}
                                    style={styles.image}
                                />
                            </TouchableOpacity>
                        )}
                    />

                ) : (

                    <FlatList
                        key="videos"
                        data={videos}
                        keyExtractor={(_, i) => `vid-${i}`}
                        renderItem={({ item, index }) => {

                            const isPlaying = playingIndex === index;

                            return (

                                <View style={styles.videoCard}>

                                    {isPlaying ? (

                                        <Video
                                            source={{ uri: item.url }}
                                            style={styles.video}
                                            controls
                                            resizeMode="contain"
                                            paused={false}
                                        />

                                    ) : (

                                        <TouchableOpacity
                                            style={styles.videoThumbnail}
                                            onPress={() => setPlayingIndex(index)}
                                        >

                                            <View style={styles.playOverlay}>
                                                <Text style={styles.playIcon}>▶</Text>
                                            </View>

                                        </TouchableOpacity>

                                    )}

                                </View>

                            );
                        }}
                    />

                )}

                <Modal
                    visible={imageModalVisible}
                    transparent={true}
                    animationType="fade"
                >

                    <View style={styles.imageModalOverlay}>

                        <TouchableOpacity
                            style={styles.closeArea}
                            onPress={() => setImageModalVisible(false)}
                        >
                            <Text style={styles.closeIcon}>✕</Text>
                        </TouchableOpacity>

                        <Image
                            source={{ uri: selectedImage }}
                            style={styles.fullImage}
                            resizeMode="contain"
                        />

                    </View>

                </Modal>

            </View>
        </BackgroundWrapper>
    );
};

const styles = StyleSheet.create({

    container: {
        flex: 1,
        // backgroundColor: "#000",
        paddingTop: 50
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        marginBottom: 20
    },

    title: {
        color: "#fff",
        fontSize: 20,
        fontWeight: "700"
    },

    close: {
        color: "#fff",
        fontSize: 24
    },

    tabs: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 20
    },

    tab: {
        paddingHorizontal: 20,
        paddingVertical: 8
    },

    activeTab: {
        borderBottomWidth: 2,
        borderBottomColor: "#fff"
    },

    tabText: {
        color: "#fff"
    },

    image: {
        flex: 1,
        height: 180,
        margin: 5,
        borderRadius: 10
    },
    videoCard: {
        height: 220,
        marginBottom: 20,
        backgroundColor: "#000",
        width: '90%',
        marginLeft: '5%'
    },

    video: {
        width: "100%",
        height: "100%"
    },

    playOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center"
    },

    playIcon: {
        color: "#fff",
        fontSize: 40
    },
    videoThumbnail: {
        height: 220,
        backgroundColor: "#111",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10
    },
    imageModalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.9)",
        justifyContent: "center",
        alignItems: "center"
    },

    fullImage: {
        width: "90%",
        height: "70%"
    },

    closeArea: {
        position: "absolute",
        top: 60,
        right: 25,
        zIndex: 10
    },

    closeIcon: {
        color: "#fff",
        fontSize: 28
    },
});

export default ReviewMediaScreen;