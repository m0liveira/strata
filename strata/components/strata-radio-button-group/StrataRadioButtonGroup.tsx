import React from "react";
import {
  View,
  ScrollView,
  StyleProp,
  ViewStyle,
  TextStyle,
} from "react-native";
import { StrataRadioButton } from "../strata-radio-button/StrataRadioButton";
import { styles } from "./styles";

type RadioButtonGroupProps = {
  options: {
    id: string | number;
    label: string;
    subLabel?: string;
    icon: React.ReactNode;
  }[];
  selectedValue: string | number | null;
  onValueChange: (value: string | number) => void;
  isScrollable?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
  radioButtonStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
};

export function StrataRadioButtonGroup({
  options,
  selectedValue,
  onValueChange,
  isScrollable = false,
  containerStyle,
  contentContainerStyle,
  radioButtonStyle,
  labelStyle,
}: RadioButtonGroupProps) {
  const renderButtons = () =>
    options.map((option) => (
      <StrataRadioButton
        key={option.id}
        id={option.id}
        label={option.label}
        labelStyle={labelStyle}
        subLabel={option.subLabel}
        containerStyle={radioButtonStyle}
        icon={option.icon}
        selected={option.id === selectedValue}
        onPress={onValueChange}
      />
    ));

  if (isScrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={containerStyle}
        contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
      >
        {renderButtons()}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.groupContainer, containerStyle]}>
      {renderButtons()}
    </View>
  );
}
