import React, { useState } from "react";
import {
  View,
  Pressable,
  Image,
  StyleProp,
  ViewStyle,
  ImageStyle,
  Platform,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { UploadIcon, XCircleIcon } from "../icons";

type ImagePickerProps = {
  onImagePicked: (uri: string | null) => void;
  classname?: {
    container?: StyleProp<ViewStyle>;
    image?: StyleProp<ImageStyle>;
  };
};

export function StrataImagePicker(props: ImagePickerProps) {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    if (Platform.OS !== "web") {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        // #TODO: Change alert by a StrataToast or something more elegant...
        Alert.alert(
          "Permission denied",
          "Sorry, we need camera/gallery permissions to make this work!",
        );
        return;
      }
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [16, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImageUri(uri);
      props.onImagePicked(uri);
    }
  };

  const removeImage = () => {
    setImageUri(null);
    props.onImagePicked(null);
  };

  return (
    <View style={[styles.container, props.classname?.container]}>
      {imageUri ? (
        <Pressable style={[styles.input]} onPress={pickImage}>
          <Image
            source={{ uri: imageUri }}
            style={[styles.image, props.classname?.image]}
            resizeMode="cover"
          />

          <Pressable style={styles.iconBg} onPress={removeImage}>
            <XCircleIcon classname={styles.removeIcon} color={Colors.white} />
          </Pressable>
        </Pressable>
      ) : (
        <Pressable style={[styles.input]} onPress={pickImage}>
          <UploadIcon classname={styles.icon} color={Colors.grey600} />
        </Pressable>
      )}
    </View>
  );
}
