import { StyleProp, View, ViewStyle } from "react-native";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";

type FormProps = {
  classname?: StyleProp<ViewStyle>;
  elements: {
    element: React.ReactNode;
  }[];
};

export function StrataForm(props: FormProps) {
  return (
    <View style={[styles.form, props.classname]}>
      {props.elements.map((item, index) => (
        <View key={index}>{item.element}</View>
      ))}
    </View>
  );
}
