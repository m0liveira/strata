import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Pressable,
  Text,
  StyleProp,
  ViewStyle,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { UploadIcon, XCircleIcon } from "../icons";
import { useFocusEffect } from "expo-router";

export type PreparedFile = {
  uri: string;
  fileName: string;
  mimeType: string;
};

type FileUploaderProps = {
  file?: string | null;
  onFilePrepared: (file: PreparedFile | null) => void;
  classname?: {
    container?: StyleProp<ViewStyle>;
  };
};

export function StrataFileUploader(props: FileUploaderProps) {
  const [fileName, setFileName] = useState<string | null>(null);
  const [isPreparing, setIsPreparing] = useState(false);

  const renderFile = () => {
    if (props.file) {
      const rawFileName = props.file.split("/").pop() || "file";
      const fileName = decodeURIComponent(rawFileName);
      setFileName(fileName);
    } else {
      setFileName(null);
      props.onFilePrepared(null);
    }
  };

  useEffect(() => {
    renderFile();
  }, [props.file]);

  const pickAndPrepareFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      setIsPreparing(true);
      const file = result.assets[0];

      setFileName(file.name);

      props.onFilePrepared({
        uri: file.uri,
        fileName: file.name,
        mimeType: file.mimeType || "application/octet-stream",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to prepare the file.");
      props.onFilePrepared(null);
    } finally {
      setIsPreparing(false);
    }
  };

  const removeFile = () => {
    setFileName(null);
    props.onFilePrepared(null);
  };

  return (
    <View style={[styles.container, props.classname?.container]}>
      {isPreparing ? (
        <View style={[styles.input, { justifyContent: "center" }]}>
          <ActivityIndicator color={Colors.coral500} />
          <Text style={{ marginTop: 8, color: Colors.grey600 }}>
            Processing...
          </Text>
        </View>
      ) : fileName ? (
        <View style={styles.inputContainer}>
          <Pressable
            style={[
              styles.input,
              { borderEndEndRadius: 0, borderStartEndRadius: 0 },
            ]}
            onPress={pickAndPrepareFile}
          >
            <UploadIcon classname={styles.icon} color={Colors.grey600} />

            <Text style={styles.inputText}>Upload ticket</Text>
          </Pressable>

          <View style={[styles.file]}>
            <Text numberOfLines={1} style={styles.fileText}>
              {fileName}
            </Text>

            <Pressable style={styles.removeIcon} onPress={removeFile}>
              <XCircleIcon
                classname={styles.removeIcon}
                color={Colors.primaryDark}
              />
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable style={[styles.input]} onPress={pickAndPrepareFile}>
          <UploadIcon classname={styles.icon} color={Colors.grey600} />

          <Text style={styles.inputText}>Upload ticket</Text>
        </Pressable>
      )}
    </View>
  );
}
