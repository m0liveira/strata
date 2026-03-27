import { View, StyleProp, ViewStyle, Pressable } from "react-native";
import { styles } from "./styles";

type HeaderProps = {
  classname?: StyleProp<ViewStyle>;
  icons: {
    icon: React.ReactNode;
    classname?: StyleProp<ViewStyle>;
    onPress: () => void;
  }[];
};

export function StrataHeader(props: HeaderProps) {
  return (
    <View style={[styles.container, props.classname]}>
      {props.icons.map((item, index) => (
        <Pressable key={index} onPress={item.onPress} style={item.classname}>
          {item.icon}
        </Pressable>
      ))}
    </View>
  );
}
