import React, { memo, useEffect, useRef, useState } from "react";
import { View, Text, Image, FlatList, StyleSheet, Platform, TouchableOpacity, Modal, Pressable } from "react-native";
import GlassContainer from "./GlassContainer";
import GlassButton from "./GlassButton";
import GlassmorphismButton from "./GlassmorphismButton";
// import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import Icon from '@expo/vector-icons/MaterialIcons';
import { Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';
import PriceView from "./PriceView";
import Video from "react-native-video";


const relatedProducts = [
    {
        id: "1",
        title:
            "Apple AirPods 4 Wireless Earbuds, Bluetooth USB-C Charging Case, Wireless Charging, H2 Chip",
        price: "₹16,990",
        image: require("../../assets/images/airpods.png"),
    },
    {
        id: "2",
        title:
            "Apple AirPods 4 Wireless Earbuds, Bluetooth USB-C Charging Case, Wireless Charging, H2 Chip",
        price: "₹16,990",
        image: require("../../assets/images/airpods.png"),
    },
    {
        id: "3",
        title:
            "Apple AirPods 4 Wireless Earbuds, Bluetooth USB-C Charging Case, Wireless Charging, H2 Chip",
        price: "₹16,990",
        image: require("../../assets/images/airpods.png"),
    },
    {
        id: "4",
        title:
            "Apple AirPods 4 Wireless Earbuds, Bluetooth USB-C Charging Case, Wireless Charging, H2 Chip",
        price: "₹16,990",
        image: require("../../assets/images/airpods.png"),
    },
];

const rating = 4;



const CustomerReviewSection = ({ scrollY,
    rating = 0,
    totalReviews = 0,
    reviews = [], relatedProducts = [] }) => {
    const [showRelatedProducts, setShowRelatedProducts] = useState(false);
    const [buttonY, setButtonY] = useState(0);
    const [playingVideo, setPlayingVideo] = useState(null);
    const [mediaModalVisible, setMediaModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('images');
    const [selectedMedia, setSelectedMedia] = useState({ images: [], videos: [] });
    const [playingIndex, setPlayingIndex] = useState(null);

    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const videoRefs = useRef({});

    const stopVideo = (videoKey) => {
        setPlayingVideo(null);

        const ref = videoRefs.current[videoKey];
        if (ref?.seek) {
            ref.seek(0); // reset video to start
        }
    };

    const [videoModalVisible, setVideoModalVisible] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState(null);





    const navigation = useNavigation();
    useEffect(() => {
        if (scrollY >= buttonY - 200 && !showRelatedProducts) {
            setShowRelatedProducts(true);
        }
    }, [scrollY]);

    const StarRating = ({ rating, size = 16 }) => (
        <View style={{ flexDirection: 'row' }}>
            {[1, 2, 3, 4, 5].map((star) => (
                <Icon
                    key={star}
                    name={star <= rating ? 'star' : 'star-border'}
                    size={size}
                    color="#fff"
                    style={{ marginRight: 2 }}
                />
            ))}
        </View>
    );

    return (
        <View style={{  }}>
            {/* ⭐ Customer Reviews */}
            <GlassContainer title="Customer Reviews">
                <View style={styles.ratingRow}>
                    <StarRating rating={rating} size={20} />
                    <Text style={styles.ratingText}>{rating} out of 5</Text>
                </View>

                <Text style={styles.subText}>
                    {totalReviews} global ratings
                </Text>
            </GlassContainer>



            {/* 🗣️ Customer Say */}
            <View style={{  }}>
                {reviews.length > 0 ? <Text style={styles.sectionHeader}>Customer Say</Text> : null}
                

                {reviews.map((item, index) => (
                    <View key={index} style={styles.reviewCard}>

                        {/* Name + Rating */}
                        <View style={styles.reviewHeader}>
                            <Text style={styles.reviewAuthor}>{item.author}</Text>
                            <StarRating rating={item.rating} size={14} />
                        </View>

                        {/* Review text */}
                        <Text style={styles.reviewParagraph}>
                            {item.text}
                        </Text>

                        {/* Date */}
                        {item.date_added && (
                            <Text style={styles.reviewDate}>
                                {item.date_added}
                            </Text>
                        )}


                        {item.images?.length > 0 && (
                            <View style={styles.mediaContainer}>
                                <View style={styles.imageRow}>
                                    {item.images.map((img, imgIndex) => (
                                        <Pressable
                                            key={imgIndex}
                                            onPress={() => {
                                                setSelectedImage(img?.thumb);
                                                setImageModalVisible(true);
                                            }}
                                        >
                                            <Image
                                                source={{ uri: img?.thumb }}
                                                style={styles.reviewImage}
                                                resizeMode="cover"
                                            />
                                        </Pressable>
                                    ))}
                                </View>
                            </View>
                        )}


                        {item.videos?.length > 0 && (
                            <View style={styles.mediaContainer}>
                                 <View style={styles.imageRow}>
                                {item.videos.map((video, videoIndex) => (
                                    <TouchableOpacity
                                        key={videoIndex}
                                        style={styles.videoThumbWrapper}
                                        onPress={() => {
                                            setActiveVideoUrl(video.url);
                                            setVideoModalVisible(true);
                                        }}
                                    >
                                        <View style={styles.videoThumb}>
                                            <Text style={styles.playIcon}>▶</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
 </View>
                            </View>
                        )}


                        {/* {(item.images?.length > 0 || item.videos?.length > 0) && (
                            <Text
                                style={styles.viewMediaText}
                                onPress={() => {
                                    setSelectedMedia({
                                        images: item.images || [],
                                        videos: item.videos || [],
                                    });
                                    setMediaModalVisible(true);
                                }}
                            >
                                View photos & videos ({(item.images?.length || 0) + (item.videos?.length || 0)})
                            </Text>
                        )} */}



                    </View>
                ))}
            </View>




            {/* 🛍️ Related Products */}
            <View style={{  }}>

                {relatedProducts.length > 0 ? <View
                    onLayout={(e) => {
                        setButtonY(e.nativeEvent.layout.y);
                    }}
                    style={{marginTop:10}}
                >
                    <GlassButton
                        title="Related Products"
                        onPress={() => setShowRelatedProducts(!showRelatedProducts)}
                    />
                </View> : null}
                


                {showRelatedProducts && (
                    <FlatList
                        data={relatedProducts}
                        keyExtractor={(item) => item.product_id.toString()}
                        renderItem={({ item }) => (
                            <GlassContainer padding={2} style={{ minHeight: 70 }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    {/* Image */}
                                    <View style={{ width: Platform.OS === "ios" ? '20%' : "16%", marginLeft: Platform.OS === "android" ? 10 : null }}>
                                        <Image
                                            source={{ uri: item.thumb }}
                                            style={{ width: "100%", height: 65, }}
                                            resizeMode="contain"
                                        />
                                    </View>

                                    {/* Text */}
                                    <View style={{ flex: 1, justifyContent: 'center', marginLeft: Platform.OS === "android" ? 10 : 10 }}>
                                        <Text style={styles.productTitle} numberOfLines={2}>
                                            {item.name}
                                        </Text>

                                        {/* <PriceView priceHtml={item.price} /> */}

                                        {item.special && (
                                            <PriceView
                                                priceHtml={item.special}
                                                textStyle={{ fontWeight: '700' }}
                                            />
                                        )}
                                        {/* <Text style={styles.price}>
                                            {item.price}
                                        </Text> */}
                                    </View>

                                </View>
                            </GlassContainer>
                        )}
                        contentContainerStyle={{ marginTop: 5 }}
                        showsVerticalScrollIndicator={false}
                    />
                )}


                <Modal
                    visible={imageModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setImageModalVisible(false)}
                >
                    <Pressable
                        style={styles.modalOverlay}
                        onPress={() => setImageModalVisible(false)}
                    >
                        <View style={styles.modalContent}>
                            <Image
                                source={{ uri: selectedImage }}
                                style={styles.modalImage}
                                resizeMode="contain"
                            />
                        </View>
                    </Pressable>
                </Modal>



                <Modal
                    visible={videoModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => {
                        setVideoModalVisible(false);
                        setActiveVideoUrl(null);
                    }}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.videoModalContainer}>
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => {
                                    setVideoModalVisible(false);
                                    setActiveVideoUrl(null);
                                }}
                            >
                                <Text style={styles.closeText}>✕</Text>
                            </TouchableOpacity>

                            {activeVideoUrl && (
                                <Video
                                    source={{ uri: activeVideoUrl }}
                                    style={styles.modalVideo}
                                    resizeMode="contain"
                                    controls
                                    paused={!videoModalVisible}
                                />
                            )}
                        </View>
                    </View>
                </Modal>




                {mediaModalVisible && (
                    <Modal visible={mediaModalVisible} transparent animationType="slide">
                        <View style={styles.modalOverlay}>

                            <View style={styles.modalContainer}>

                                {/* Header */}
                                <View style={styles.header}>
                                    <Text style={styles.headerTitle}>Customer Media</Text>
                                    <TouchableOpacity onPress={() => setMediaModalVisible(false)}>
                                        <Text style={styles.closeText}>✕</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Tabs */}
                                <View style={styles.tabs}>
                                    <TouchableOpacity
                                        style={[styles.tab, activeTab === 'images' && styles.activeTab]}
                                        onPress={() => setActiveTab('images')}
                                    >
                                        <Text style={styles.tabText}>Images</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
                                        onPress={() => setActiveTab('videos')}
                                    >
                                        <Text style={styles.tabText}>Videos</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* CONTENT */}
                                {activeTab === 'images' ? (
                                    <FlatList
                                        key="images-list"
                                        data={selectedMedia.images}
                                        numColumns={2}
                                        keyExtractor={(_, i) => `img-${i}`}
                                        contentContainerStyle={styles.grid}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.imageCard}>
                                                <Image source={{ uri: item.thumb }} style={styles.image} />
                                            </TouchableOpacity>
                                        )}
                                    />
                                ) : (
                                    <FlatList
                                        key="videos-list"
                                        data={selectedMedia.videos}
                                        keyExtractor={(_, i) => `vid-${i}`}
                                        renderItem={({ item, index }) => {
                                            const isPlaying = playingIndex === index;

                                            return (
                                                <View style={styles.videoCard}>
                                                    <TouchableOpacity
                                                        activeOpacity={0.9}
                                                        onPress={() =>
                                                            setPlayingIndex(isPlaying ? null : index)
                                                        }
                                                    >
                                                        <Video
                                                            source={{ uri: item.url }}
                                                            style={styles.video}
                                                            resizeMode="contain"
                                                            paused={!isPlaying}   // ⭐ KEY FIX
                                                            controls={isPlaying} // show controls only when playing
                                                        />

                                                        {!isPlaying && (
                                                            <View style={styles.playOverlay}>
                                                                <Text style={styles.playIcon}>▶</Text>
                                                            </View>
                                                        )}
                                                    </TouchableOpacity>
                                                </View>
                                            );
                                        }}
                                    />

                                )}


                            </View>
                        </View>
                    </Modal>

                )}



            </View>
            {/* <GlassmorphismButton onPress={()=>{navigation.navigate("ShoppingBag")}} title="Add To Cart" /> */}

        </View>
    );
};

const styles = StyleSheet.create({
  // ⭐ Ratings & Review
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  ratingText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 6,
  },
  subText: {
    color: "#ccc",
    fontSize: 13,
  },
  sectionHeader: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  reviewParagraph: {
    color: "#fff",
    fontSize: 14,
    lineHeight: 20,
  },
  reviewCard: {
    marginBottom: 14,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  reviewAuthor: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  reviewDate: {
    color: '#aaa',
    fontSize: 11,
    marginTop: 4,
  },

  // ⭐ Product Info
  productTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "300",
  },
  price: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  // ⭐ Media Containers
  mediaContainer: {
    marginTop: 8,
  },
  imageRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 6,
  },

  // 🎥 Video Thumbnails in List
  videoThumbWrapper: {
    marginTop: 8,
  },
  videoThumb: {
    width: 82,
    height: 90,
    borderRadius: 8,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 28,
    opacity: 0.9,
  },

  // 🎥 Video Wrapper in List
  videoWrapper: {
    width: '100%',
    maxWidth: 260,
    height: 150,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: 10,
  },
  reviewVideo: {
    width: '100%',
    height: '100%',
  },

  // ⭐ Modal Overlay
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // 🖼️ Image Modal
  modalContent: {
    width: '90%',
    height: 360, // adjustable image height
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 12,
  },

  // 🎥 Video Modal
  videoModalContainer: {
    width: '90%',
    height: 250, // adjustable video height
    backgroundColor: '#000',
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalVideo: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
  },
  closeText: {
    color: '#fff',
    fontSize: 22,
  },
});

export default memo(CustomerReviewSection);
