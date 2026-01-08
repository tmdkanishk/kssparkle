import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    TouchableOpacity,
    TextInput,
    Image,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useCustomContext } from '../hooks/CustomeContext';
import commonStyles from '../constants/CommonStyles';
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from "react-native-image-picker";
import { _retrieveData } from '../utils/storage';
import { API_KEY, BASE_URL } from '../utils/config';
import axios, { HttpStatusCode } from 'axios';
import FailedModal from './FailedModal';
import { convertVideoToBase64_UNSAFE } from '../utils/helpers';
import Icon from '@expo/vector-icons/MaterialIcons';






// import ReactNativeBlobUtil from 'react-native-blob-util';

const ReviewModal = ({ visible, onClose, productId, onReviewSuccess }) => {
    const [imageList, setImageList] = useState([]);
    const [videoList, setVideoList] = useState([]);
    const { Colors, EndPoint, GlobalText } = useCustomContext();
    const [reviewerName, setReviewerName] = useState();
    const [reviewerEmail, setReviewerEmail] = useState();
    const [review, setReview] = useState();
    const [nameError, setNameError] = useState(null);
    const [reviewError, setReviewError] = useState(null);
    const [ratingError, setRatingError] = useState(null);
    const [isErrorModal, setErrorModal] = useState(false);
    const [isErrorMgs, setErrorMgs] = useState();
    const [isSelectError, setSelectError] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [rating, setRating] = useState(0);



    const resetForm = () => {
        setReview('');
        setRating(0);
        setImageList([]);
        setVideoList([]);
    };

    const SelectableStarRating = ({ rating, onChange, size = 28 }) => {
        return (
            <View style={{ flexDirection: 'row' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                        key={star}
                        activeOpacity={0.7}
                        onPress={() => onChange(star)}
                    >
                        <Icon
                            name={star <= rating ? 'star' : 'star-border'}
                            size={size}
                            color="#fff"
                            style={{ marginRight: 6 }}
                        />
                    </TouchableOpacity>
                ))}
            </View>
        );
    };



    // 🖼 Image Picker
    const handleAddImage = () => {
        launchImageLibrary(
            {
                mediaType: 'photo',
                includeBase64: true,
                selectionLimit: 0, // ✅ multiple
            },
            (response) => {
                if (response.didCancel) return;

                const assets = response.assets || [];

                setImageList(prev => [
                    ...prev,
                    ...assets
                        .filter(a => a.uri && a.base64)
                        .map(a => ({
                            uri: a.uri,
                            base64: a.base64,
                            type: a.type,
                        })),
                ]);
            }
        );
    };


    const imageBase64Array = imageList
        .filter(img => img.base64)
        .map(img => ({
            image: `data:image/jpeg;base64,${img.base64}`
        }));



    const handleAddVideo = () => {
        launchImageLibrary(
            {
                mediaType: 'video',
                selectionLimit: 0, // ✅ allow multiple videos
            },
            (response) => {
                if (response.didCancel) return;

                const assets = response.assets || [];

                setVideoList(prev => [
                    ...prev,
                    ...assets
                        .filter(a => a.uri)
                        .map(a => ({
                            uri: a.uri,
                            type: a.type,
                            fileName: a.fileName,
                        })),
                ]);
            }
        );
    };




    const convertBulkVideosToBase64 = async (videos) => {
        const productVideos = [];

        for (let i = 0; i < videos.length; i++) {
            const video = videos[i];
            let videoUri = video.uri;

            // 🔽 If remote URL → fetch works directly, no download needed
            const videoBase64 = await convertVideoToBase64_UNSAFE(videoUri);

            if (videoBase64) {
                productVideos.push({
                    video: `data:video/mp4;base64,${videoBase64}`,
                });
            }
        }

        return productVideos;
    };





    const onClickWriteViewButton = async () => {
        if (isSubmitting) return;

        setIsSubmitting(true);

        try {
            const url = `${BASE_URL}${EndPoint?.productdetails_writeReview}`;
            const lang = await _retrieveData('SELECT_LANG');
            const cur = await _retrieveData('SELECT_CURRENCY');
            const sessionId = await _retrieveData('SESSION_ID');
            const user = await _retrieveData('CUSTOMER_ID');

            const formData = new FormData();

            // ✅ Normal fields
            formData.append('code', lang?.code);
            formData.append('currency', cur);
            formData.append('sessionid', sessionId);
            formData.append('product_id', productId);
            formData.append('name', reviewerName);
            formData.append('text', review);
            formData.append('customer_id', user);
            formData.append('rating', rating);

            // ✅ Images
            imageBase64Array.forEach((item, index) => {
                formData.append(`product_images[${index}][image]`, item.image);
            });

            // ✅ Videos
            const videoBase64Array = await convertBulkVideosToBase64(videoList);
            videoBase64Array.forEach((item, index) => {
                formData.append(`product_videos[${index}][video]`, item.video);
            });

            const response = await axios.post(url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Key: API_KEY,
                },
            });

            if (response.data.success) {
                onClose();       // close modal
                resetForm();     // clear form
                onReviewSuccess?.(); // refresh product details
            }

        } catch (error) {
            console.log('Error:', error?.response?.data || error);

            if (error?.response?.data?.error) {
                setNameError(error.response.data?.error?.name || null);
                setReviewError(error.response.data?.error?.text || null);
                setRatingError(error.response.data?.error?.rating || null);
            } else {
                setErrorMgs(GlobalText?.extrafield_somethingwrong);
                setErrorModal(true);
            }
        } finally {
            setIsSubmitting(false); // ✅ ALWAYS stop loading
        }
    };



    const removeImage = (index) => {
        setImageList(prev => prev.filter((_, i) => i !== index));
    };

    const removeVideo = (index) => {
        setVideoList(prev => prev.filter((_, i) => i !== index));
    };




    return (
        <>
            <Modal visible={visible} transparent animationType="slide">
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                >
                    <View style={styles.overlay}>
                        <View style={styles.container}>
                            <Text style={styles.title}>Write a Review</Text>

                            {/* Username */}
                            <TextInput
                                placeholder="Username"
                                placeholderTextColor="#aaa"
                                style={[
                                    styles.input,
                                    nameError && styles.inputError,   // 👈 red border if error
                                ]}
                                value={reviewerName}
                                onChangeText={(text) => { setReviewerName(text) }}
                            />

                            {nameError && (
                                <Text style={styles.errorText}>{nameError}</Text>
                            )}

                            {/* Email */}
                            <TextInput
                                placeholder="Email"
                                placeholderTextColor="#aaa"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                style={styles.input}
                                value={reviewerEmail}
                                onChangeText={(text) => { setReviewerEmail(text) }}
                            />

                            {/* Review Text */}
                            <TextInput
                                placeholder="Write your review..."
                                placeholderTextColor="#aaa"
                                multiline
                                numberOfLines={4}
                                textAlignVertical="top"
                                style={[
                                    styles.input,
                                    styles.textArea,
                                    reviewError && styles.inputError,
                                ]}

                                value={review}
                                onChangeText={(text) => { setReview(text) }}
                            />

                            {reviewError && (
                                <Text style={styles.errorText}>{reviewError}</Text>
                            )}



                            <View style={{margin:10, marginBottom:10}}>
                            {/* Rating */}
                            <Text style={styles.sectionTitle}>Your Rating</Text>
                            <SelectableStarRating
                                rating={rating}
                                onChange={(value) => {
                                    setRating(value);
                                    setRatingError(null);
                                }}
                            />
                            </View>


                            {ratingError && (
                                <Text style={styles.errorText}>{ratingError}</Text>
                            )}



                            {/* Upload Buttons */}
                            <View style={styles.buttonRow}>
                                <TouchableOpacity style={styles.uploadBtn} onPress={handleAddImage}>
                                    <Text style={styles.btnText}>Upload Image</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.uploadBtn} onPress={handleAddVideo}>
                                    <Text style={styles.btnText}>Upload Video</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Image Preview */}
                            {imageList.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Images</Text>
                                    <View style={styles.grid}>
                                        {imageList.map((item, index) => (
                                            <View key={index} style={styles.mediaWrapper}>
                                                <Image source={{ uri: item.uri }} style={styles.image} />
                                                <TouchableOpacity
                                                    style={styles.removeBtn}
                                                    onPress={() => removeImage(index)}
                                                >
                                                    <Text style={styles.removeText}>✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}


                            {/* Video Preview (NO Image rendering) */}
                            {videoList.length > 0 && (
                                <>
                                    <Text style={styles.sectionTitle}>Videos</Text>
                                    <View style={styles.grid}>
                                        {videoList.map((_, index) => (
                                            <View key={index} style={styles.mediaWrapper}>
                                                <LinearGradient
                                                    colors={['#505050', '#808080']}
                                                    style={styles.videoCard}
                                                >
                                                    <Text style={styles.playIcon}>▶</Text>
                                                </LinearGradient>

                                                <TouchableOpacity
                                                    style={styles.removeBtn}
                                                    onPress={() => removeVideo(index)}
                                                >
                                                    <Text style={styles.removeText}>✕</Text>
                                                </TouchableOpacity>
                                            </View>
                                        ))}
                                    </View>
                                </>
                            )}


                            <TouchableOpacity
                                onPress={onClickWriteViewButton}
                                style={[
                                    styles.closeBtn,
                                    isSubmitting && { opacity: 0.6 },
                                ]}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.btnText}>Submit</Text>
                                )}
                            </TouchableOpacity>

                            {/* Close */}
                            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                                <Text style={styles.btnText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            <FailedModal
                isSuccessMessage={isErrorMgs}
                handleCloseModal={() => { setErrorModal(false); setErrorMgs() }}
                isModal={isErrorModal}
                onClickClose={() => { setErrorModal(false); setErrorMgs() }}
            />
        </>
    );
};

export default ReviewModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
    },
    container: {
        marginHorizontal: 20,
        backgroundColor: '#1e1e1e',
        borderRadius: 12,
        padding: 16,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        marginBottom: 12,
        fontWeight: '600',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    uploadBtn: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        width: '48%',
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 14,
    },
    sectionTitle: {
        color: '#fff',
        marginTop: 12,
        marginBottom: 6,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 6,
    },
    videoCard: {
        width: 80,
        height: 80,
        borderRadius: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playIcon: {
        color: '#fff',
        fontSize: 28,
    },
    closeBtn: {
        marginTop: 14,
        backgroundColor: '#444',
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 10,
        padding: 12,
        color: '#fff',
        fontSize: 14,
        marginBottom: 10,
    },

    textArea: {
        height: 100,
    },
    inputError: {
        borderColor: '#FF4D4F', // red border
    },

    errorText: {
        color: '#FF4D4F',
        fontSize: 12,
        marginBottom: 6,
        marginTop: -6,
    },
    mediaWrapper: {
        position: 'relative',
    },

    removeBtn: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(0,0,0,0.8)',
        width: 22,
        height: 22,
        borderRadius: 11,
        justifyContent: 'center',
        alignItems: 'center',
    },

    removeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },

});

