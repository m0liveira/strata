import {
  KeyboardAvoidingView,
  ScrollView,
  StyleProp,
  Text,
  View,
  ViewStyle,
} from "react-native";
import { styles } from "./styles";

type FormProps = {
  classname?: StyleProp<ViewStyle>;
  elements: {
    label?: string;
    element: React.ReactNode;
  }[];
};

export function StrataForm(props: FormProps) {
  return (
    <KeyboardAvoidingView
      style={[styles.form, props.classname]}
      behavior="padding"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {props.elements.map((item, index) => (
          <View key={index}>
            {item.label && <Text style={styles.label}>{item.label}</Text>}
            <View>{item.element}</View>
          </View>
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
