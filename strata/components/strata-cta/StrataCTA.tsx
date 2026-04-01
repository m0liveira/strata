import React from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
  Platform,
  View,
} from "react-native";
import { styles } from "./styles";

type CtaProps = {
  classname?: StyleProp<ViewStyle>;
  text: string;
  textclassname?: StyleProp<TextStyle>;
  icon?: React.ReactNode;
  isDisabled: boolean;
  onPress: () => void;
};

export function StrataCTA(props: CtaProps) {
  return (
    <Pressable
      android_ripple={{
        color: "hsla(14, 91%, 87%, 0.3)",
        foreground: true,
      }}
      style={({ pressed }) => [
        styles.button,
        props.isDisabled ? styles.disabled : null,
        props.classname,
        Platform.OS === "ios" && pressed && { opacity: 0.3 },
      ]}
      onPress={props.onPress}
      disabled={props.isDisabled}
    >
      <Text
        style={[
          styles.text,
          props.isDisabled ? styles.textDisabled : null,
          props.textclassname,
        ]}
      >
        {props.text}
      </Text>

      {props.icon && <View>{props.icon}</View>}
    </Pressable>
  );
}
