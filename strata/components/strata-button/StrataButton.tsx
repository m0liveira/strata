import React from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
  Platform,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { ArrowIcon } from "@/components/icons";

type CtaProps = {
  classname?: StyleProp<ViewStyle>;
  title: string;
  text: string;
  textclassname?: StyleProp<TextStyle>;
  blobclassname?: StyleProp<ViewStyle>;
  imageSource: ImageSourcePropType;
  onPress: () => void;
};

export function StrataButton(props: CtaProps) {
  return (
    <Pressable
      android_ripple={{
        color: "hsla(14, 91%, 100%, 0.3)",
        foreground: true,
      }}
      style={({ pressed }) => [
        styles.button,
        props.classname,
        Platform.OS === "ios" && pressed && { opacity: 0.3 },
      ]}
      onPress={props.onPress}
    >
      <View style={[styles.blob, props.blobclassname]} />

      <View style={styles.imageContainer}>
        <Image
          source={props.imageSource}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title]}>{props.title}</Text>
        <Text style={[styles.text, props.textclassname]}>{props.text}</Text>
      </View>

      <ArrowIcon color={Colors.primaryDark} classname={styles.iconBg} />
    </Pressable>
  );
}
