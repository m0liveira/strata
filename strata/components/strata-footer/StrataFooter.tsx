import { View, Text, Image } from "react-native";
import { styles } from "./styles";

export default function StrataFooter() {
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/icon.png")}
        resizeMode="contain"
        style={styles.image}
      />

      <Text style={styles.p}>Strata</Text>
    </View>
  );
}
