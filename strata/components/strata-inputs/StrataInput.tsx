import {
  Pressable,
  StyleProp,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";

type InputProps = {
  classname?: {
    container?: StyleProp<ViewStyle>;
    input?: StyleProp<TextStyle>;
  };
  icon?: {
    icon: React.ReactNode;
    onPress?: () => any;
    classname?: StyleProp<ViewStyle>;
  };
  properties: {
    autoCapitalize?: "none" | "sentences" | "words" | "characters";
    inputMode?:
      | "decimal"
      | "email"
      | "none"
      | "numeric"
      | "search"
      | "tel"
      | "text"
      | "url";
    keyboardType?:
      | "default"
      | "number-pad"
      | "decimal-pad"
      | "numeric"
      | "email-address"
      | "phone-pad"
      | "url";
    maxLength?: number;
    placeholder: string;
    secureTextEntry?: boolean;
    value: string;
    onChangeText: any;
  };
};

export default function StrataInput(props: InputProps) {
  return (
    <View style={[styles.container, props.classname?.container]}>
      <TextInput
        style={[styles.input, props.classname?.input]}
        placeholderTextColor={Colors.grey400}
        {...props.properties}
      ></TextInput>

      {props.icon && (
        <Pressable
          style={[styles.icon, props.icon.classname]}
          onPress={props.icon.onPress}
        >
          {props.icon.icon}
        </Pressable>
      )}
    </View>
  );
}
