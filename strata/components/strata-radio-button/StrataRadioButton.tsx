import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Colors } from "@/constants/global-styles";
import { styles } from "./styles";

type RadioButtonProps = {
  id: string | number;
  label: string;
  subLabel?: string;
  icon: React.ReactNode;
  selected: boolean;
  onPress: (id: string | number) => void;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  subLabelStyle?: StyleProp<TextStyle>;
};

export function StrataRadioButton(props: RadioButtonProps) {
  const textColor = props.selected ? Colors.coral900 : Colors.grey400;

  const renderIcon = () => {
    if (!props.icon) return null;

    if (React.isValidElement(props.icon)) {
      return React.cloneElement(props.icon as React.ReactElement<any>, {
        color: textColor,
      });
    }

    return props.icon;
  };

  return (
    <Pressable
      style={[
        styles.container,
        props.selected ? styles.selectedContainer : styles.unselectedContainer,
        props.containerStyle,
      ]}
      onPress={() => props.onPress(props.id)}
    >
      <View style={styles.iconContainer}>{renderIcon()}</View>

      <Text
        style={[
          styles.labelText,
          props.selected ? styles.selectedText : styles.unselectedText,
          props.labelStyle,
        ]}
      >
        {props.label}
      </Text>

      {props.subLabel ? (
        <Text
          style={[
            styles.subLabelText,
            props.selected
              ? styles.selectedSubLabel
              : styles.unselectedSubLabel,
          ]}
        >
          {props.subLabel}
        </Text>
      ) : null}
    </Pressable>
  );
}
