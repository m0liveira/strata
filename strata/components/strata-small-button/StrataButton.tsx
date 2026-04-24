import React from "react";
import { Pressable, StyleProp, Text, ViewStyle, Platform } from "react-native";
import { styles } from "./styles";

type SmallButtonProps = {
  classname?: StyleProp<ViewStyle>;
  text: string;
  icon: React.ReactNode;
  onPress: () => void;
};

export function StrataSmallButton(props: SmallButtonProps) {
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
      {props.icon}

      <Text style={[styles.text]}>{props.text}</Text>
    </Pressable>
  );
}
