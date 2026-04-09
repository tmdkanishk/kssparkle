import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet
} from "react-native";
import { WebView } from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setSessionHidePopup } from "../utils/popupSession";
import { navigate } from "../utils/navigationService";



const GlobalPopup = ({ visible, data, onClose }) => {
  const [dontShowAgain, setDontShowAgain] = useState(false);
  console.log("VISIBLE:", visible);
  console.log("DATA:", data);

  // useEffect(() => {
  //   if (visible) {
  //     const time = parseInt(data?.time || "0");

  //     if (time > 0) {
  //       const timer = setTimeout(() => {
  //         handleClose();
  //       }, time);

  //       return () => clearTimeout(timer);
  //     }
  //   }
  // }, [visible]);

  useEffect(() => {
  console.log("👁️ Popup visibility changed:", visible);
  console.log("📦 Popup data:", data);
}, [visible, data]);

  useEffect(() => {
if (!visible || !data?.time) {
    console.log("⛔ Auto close skipped (no visible/time)");
    return;
  }

   console.log("⏳ Auto close timer START:", data.time);

  const timer = setTimeout(() => {
    console.log("Auto closing popup after:", data.time);
    handleClose();
  }, Number(data.time)); // convert string → number

  return () => {
    console.log("🧹 Clearing auto close timer");
    clearTimeout(timer);
  };
}, [visible, data]);


const handleWebViewClick = (event) => {
  const clicked = event.nativeEvent.data;
 console.log("🖱️ WebView CLICKED:", clicked);
  console.log("🔗 Action type:", data?.href);


  handleClose();

  if (data?.href === "product") {
    console.log("➡️ Navigating to Home");
    navigate("Home");

  } else if (data?.href === "category") {
    console.log("➡️ Navigating to Category");
    navigate("Category");

  } else if (data?.href === "special") {
    console.log("➡️ Navigating to SpecialProducts");
    navigate("SpecialProducts");
  }
};

const handleClose = () => {
  console.log("❌ Popup close triggered");

  if (dontShowAgain) {
    console.log("🚫 User selected DON'T SHOW AGAIN");
    setSessionHidePopup(true);
  }

  onClose();
};


  // const handleClose = async () => {
  //   if (dontShowAgain) {
  //     await AsyncStorage.setItem("HIDE_GLOBAL_POPUP", "true");
  //   }
  //   onClose();
  // };

const buildHtml = () => {
  const css = data?.customcss || "";

  // ✅ If HTML exists → use it
  if (data?.contentpopup) {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin:0; padding:0; }
            ${css}
          </style>
        </head>
        <body>
          ${data.contentpopup}
        </body>
      </html>
    `;
  }

  // ✅ Else fallback to IMAGE
  if (data?.image_mobile) {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { margin:0; padding:0; display:flex; justify-content:center; align-items:center; }
            img { width:100%; height:auto; }
            ${css}
          </style>
        </head>
        <body>
         <img src="${data.image_mobile}" onclick="window.ReactNativeWebView.postMessage('image_clicked')" />
        </body>
      </html>
    `;
  }

  // fallback
  return `<html><body></body></html>`;
};

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.container}>

          {/* ✅ Title */}
          {data?.displaytitle === "1" && (
            <Text style={styles.title}>{data?.title}</Text>
          )}

          {/* 🌐 WebView */}
          <View style={{ height: 300 }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: buildHtml() }}
              javaScriptEnabled
              onMessage={(event) => handleWebViewClick(event)}
              injectedJavaScript={`
    document.addEventListener("click", function(e) {
      let target = e.target;

      while (target && target.tagName !== "A") {
        target = target.parentNode;
      }

      if (target && target.href) {
        e.preventDefault();
        window.ReactNativeWebView.postMessage(target.href);
      } else {
        window.ReactNativeWebView.postMessage("clicked");
      }
    });
    true;
  `}
            />
          </View>

          {/* ✅ Don't Show */}
          {data?.dontshow === "1" && (
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setDontShowAgain(!dontShowAgain)}
            >
              <View style={styles.checkbox}>
                {dontShowAgain && <View style={styles.checked} />}
              </View>
              <Text>{data?.dontshowtext || "Don't show again"}</Text>
            </TouchableOpacity>
          )}

          {/* ❌ Close */}
          <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
            <Text style={{ color: "#fff" }}>Close</Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

export default GlobalPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center"
  },
  checked: {
    width: 10,
    height: 10,
    backgroundColor: "black"
  },
  closeBtn: {
    marginTop: 15,
    backgroundColor: "black",
    padding: 10,
    alignItems: "center",
    borderRadius: 5
  }
});