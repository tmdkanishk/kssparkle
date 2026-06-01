// utils/scale.js
import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (design reference - usually iPhone 14 or similar)
const BASE_WIDTH = 390;
const BASE_HEIGHT = 844;

export const scaleW = (size) => (SCREEN_WIDTH / BASE_WIDTH) * size;
export const scaleH = (size) => (SCREEN_HEIGHT / BASE_HEIGHT) * size;
export const scaleFont = (size) => {
    const scale = SCREEN_WIDTH / BASE_WIDTH;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};