import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system'; // or your current method

export const convertFileToBase64 = async (fileUri) => {
  try {
    console.log(FileSystem.EncodingType);

    return await FileSystem.readAsStringAsync(fileUri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  } catch (e) {
    console.log('Base64 convert error:', e);
    return null;
  }
};

export const downloadFileToLocal = async (url) => {
  const localPath = FileSystem.cacheDirectory + Date.now() + '.mp4';
  const { uri } = await FileSystem.downloadAsync(url, localPath);
  return uri;
};
