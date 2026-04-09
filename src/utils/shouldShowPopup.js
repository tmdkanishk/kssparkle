import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSessionHidePopup } from './popupSession';


export const shouldShowPopup = async (data) => {
  try {
    console.log("POPUP DATA:", data);

    if (data?.status !== "1") {
      console.log("❌ BLOCKED: status");
      return false;
    }

    if (!(data?.display_user === "both" || data?.display_user === "mobile")) {
      console.log("❌ BLOCKED: user type");
      return false;
    }

    // ✅ SESSION CHECK
    if (getSessionHidePopup()) {
      console.log("❌ BLOCKED: session hide");
      return false;
    }

    return true;


    // const hide = await AsyncStorage.getItem("HIDE_GLOBAL_POPUP");

    // if (hide === "true") {
    //   console.log("❌ BLOCKED: user opted out");
    //   return false;
    // }

    // return true;

  } catch (e) {
    console.log("POPUP ERROR:", e);
    return false;
  }
};