import React from "react";
import { View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import { Image } from "expo-image";
import { styles } from "./styles";
import { PublicUser } from "@/types/models/user-model";

export type SocialUserProps = {
  user: PublicUser;
  isSelected?: boolean;
  onPress?: () => void;
  onIconPress?: () => void;
  rightIcon?: React.ReactNode;
  classname?: StyleProp<ViewStyle>;
};

export function StrataSocialUser(props: SocialUserProps) {
  return (
    <Pressable
      style={[
        styles.itemContainer,
        props.isSelected && styles.itemSelected,
        props.classname,
      ]}
      onPress={props.onPress}
    >
      <Image
        source={
          props.user.photo.includes("/assets/")
            ? require("@/assets/images/default-avatar.png")
            : { uri: props.user.photo }
        }
        style={styles.avatar}
        contentFit="cover"
      />

      <View style={styles.textContainer}>
        <Text style={[styles.name, props.isSelected && styles.textSelected]}>
          {props.user.name}
        </Text>
        <Text
          style={[styles.handle, props.isSelected && styles.handleSelected]}
        >
          {props.user.username}
        </Text>
      </View>

      {props.rightIcon && (
        <Pressable style={styles.actionContainer} onPress={props.onIconPress}>
          {props.rightIcon}
        </Pressable>
      )}
    </Pressable>
  );
}
