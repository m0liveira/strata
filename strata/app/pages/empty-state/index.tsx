import React from "react";
import { Text, View, Image } from "react-native";
import { styles } from "./styles";
import { GlobeShadowSVG } from "@/components/svgs";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  buttons?: React.ReactNode[];
};

export function EmptyState(props: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <GlobeShadowSVG />

          <Image
            source={require("@/assets/images/globe.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subtitle}>{props.subtitle}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {props.buttons?.map((item, index) => (
          <View key={index}>{item}</View>
        ))}
      </View>
    </View>
  );
}
