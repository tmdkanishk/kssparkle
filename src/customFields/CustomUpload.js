import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useCustomContext } from "../hooks/CustomeContext";

const CustomUpload = ({
  label,
  uploadUrl,        // API endpoint
  required = false,
  onUploaded,        // callback after upload success
  containerStyle,
  labelStyle,
  fieldStyle,
}) => {
  const { Colors } = useCustomContext();
  const [file, setFile] = useState(null);
  const [touched, setTouched] = useState(false);
  const [uploading, setUploading] = useState(false);

  const showError = required && touched && !file;

  const handlePickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*", // allow ALL file types
        copyToCacheDirectory: true,
      });

      console.log("result", result);

      if (result.assets) {
        setTouched(true);
        setFile(result?.assets[0]);
        // await handleUpload(result?.assets[0]);
      }

    } catch (error) {
      console.log("File picking error:", error);
    }
  };

  // const handleUpload = async (pickedFile) => {
  //   try {
  //     setUploading(true);
  //     let formData = new FormData();
  //     formData.append("file", {
  //       uri: pickedFile.uri,
  //       name: pickedFile.name,
  //       type: pickedFile.mimeType || "application/octet-stream",
  //     });

  //     const response = await fetch(uploadUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "multipart/form-data",
  //       },
  //       body: formData,
  //     });

  //     const data = await response.json();
  //     setUploading(false);

  //     if (response.ok) {
  //       onUploaded && onUploaded(data);
  //     } else {
  //       console.log("Upload failed:", data);
  //     }
  //   } catch (err) {
  //     setUploading(false);
  //     console.log("Upload error:", err);
  //   }
  // };

  const isImage = file?.mimeType?.startsWith("image/");

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text
          style={[
            styles.label,
            labelStyle,
            { color: Colors?.iconColor || "#333" },
          ]}
        >
          {required && <Text style={{ color: "red" }}>*</Text>} {label}
        </Text>
      )}

      <Pressable
        style={[
          styles.field,
          {
            backgroundColor: Colors?.inputFeildColor || "#fff",
            borderColor: showError ? "red" : Colors?.iconColor || "#ccc",
          },
          fieldStyle,
        ]}
        onPress={handlePickFile}
      >
        {/* {uploading ? (
          <ActivityIndicator color={Colors?.iconColor || "#000"} />
        ) : */}


        <Text
          style={{
            color: file
              ? Colors?.iconColor || "#000"
              : Colors?.placeholderColor || "#999",
          }}
          numberOfLines={1}
        >
          {file ? file?.name : "-- Choose File --"}
        </Text>

      </Pressable>

      {/* Preview only if image */}
      {isImage && (
        <Image
          source={{ uri: file.uri }}
          style={{ width: 100, height: 100, marginTop: 10, borderRadius: 8 }}
        />
      )}

      {showError && (
        <Text style={[styles.errorText, { color: Colors?.errorColor || "red" }]}>
          {label} is required
        </Text>
      )}
    </View>
  );
};

export default CustomUpload;

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontSize: 14, marginBottom: 5, fontWeight: "400" },
  field: {
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  errorText: { marginTop: 5 },
});
