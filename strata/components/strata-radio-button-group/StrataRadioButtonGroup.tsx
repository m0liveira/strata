import React from "react";
import { View, StyleProp, ViewStyle } from "react-native";
import { StrataRadioButton } from "../strata-radio-button/StrataRadioButton";
import { styles } from "./styles";

type RadioButtonGroupProps = {
  options: { id: string; label: string; icon: React.ReactNode }[];
  selectedValue: string | null;
  onValueChange: (value: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
};

export function StrataRadioButtonGroup(props: RadioButtonGroupProps) {
  return (
    <View style={[styles.groupContainer, props.containerStyle]}>
      {props.options.map((option) => (
        <StrataRadioButton
          key={option.id}
          id={option.id}
          label={option.label}
          icon={option.icon}
          selected={option.id === props.selectedValue}
          onPress={props.onValueChange}
        />
      ))}
    </View>
  );
}
