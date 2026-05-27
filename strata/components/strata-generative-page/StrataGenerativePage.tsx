import React from "react";
import {Text, View, Image } from "react-native";
import { styles } from "./styles";

export function StrataGenerativePage() {
  return (
    <View style={styles.page}>
      <Image
        style={styles.image}
        resizeMode="cover"
        source={require("@/assets/images/icon.png")}
      />

      <Text style={styles.text}>Generating Trip...</Text>
    </View>
  );
}
