import { Linking } from "react-native";
import { autoLogin } from "../services/autoLogin";

export const formatDate = (dateString) => {
  const [day, month, year] = dateString.split("/"); // Split the input date
  const date = new Date(`${year}-${month}-${day}`); // Create a Date object

  // Map of month names
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get formatted date
  const formattedDate = `${monthNames[date.getMonth()]} ${day} ${year}`;
  return formattedDate;
};

export const openInChrome = (url) => {
  Linking.openURL(url).catch((err) =>
    console.error("Failed to open URL:", err)
  );
};

export const convertImageToBase64 = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]); // Extract Base64 string
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to Base64:', error);
    return null;
  }
};

export const convertVideoToBase64_UNSAFE = async (uri) => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result?.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Video base64 error:', error);
    return null;
  }
};



export const toggleUnicNumber = (array, number) => {
  const index = array.indexOf(number);
  if (index !== -1) {
    // If number exists, remove it
    array.splice(index, 1);
  } else {
    // If number doesn't exist, add it
    array.push(number);
  }
  return array;
}


export function truncateString(str, maxLength) {
  return str?.length > maxLength ? str.substring(0, maxLength) + "..." : str;
}


export const checkAutoLogin = async () => {
  try {
    await autoLogin('restapi/checksession/autologin');
  } catch (error) {
    console.log('error:', error.response.data);
  }
}


export const isRTLText = (text = '') => {
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F]/;
  return rtlRegex.test(text);
};




