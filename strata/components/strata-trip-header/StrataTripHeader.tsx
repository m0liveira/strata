import React from "react";
import { Pressable, StyleProp, Text, ViewStyle, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { Trip } from "@/types/models/trip-model";
import { Colors } from "@/constants/global-styles";
import {
  ArrowIcon,
  ChatBubbleIcon,
  MoreIcon,
  StarIcon,
} from "@/components/icons";
import { router } from "expo-router";

type TripHeaderProps = {
  classname?: StyleProp<ViewStyle>;
  trip: Trip;
  origin?: string;
  creator?: string;
  members: any[];
  onPress?: () => void;
};

export function TripHeader(props: TripHeaderProps) {
  function handleGoBack(origin?: string) {
    if (origin === "discover") {
      router.navigate("/(tabs)/discover");
    } else {
      router.navigate("/(tabs)/my-trips");
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(props.trip.start_date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(props.trip.end_date);
  endDate.setHours(0, 0, 0, 0);

  const isCurrent = startDate <= today && endDate >= today;

  const isOnlineUrl = props.trip.banner && props.trip.banner.startsWith("http");

  const imageSource = isOnlineUrl
    ? { uri: props.trip.banner }
    : require("@/assets/images/default-banner.png");

  return (
    <View style={styles.header}>
      <Image source={imageSource} style={styles.image} resizeMode="cover" />

      <LinearGradient
        colors={["transparent", "rgba(0,0,0,0.85)"]}
        style={styles.gradient}
      />

      <View style={styles.tripContainer}>
        <View style={styles.iconsContainer}>
          <Pressable
            style={styles.iconBg}
            onPress={() => handleGoBack(props.origin)}
          >
            <ArrowIcon
              color={Colors.primaryDark}
              classname={{ aspectRatio: 1, width: 32 }}
            />
          </Pressable>

          <Pressable style={styles.iconBg} onPress={() => {}}>
            <MoreIcon
              color={Colors.primaryDark}
              classname={[styles.icon, { width: 18 }]}
            />
          </Pressable>
        </View>

        <View style={styles.container}>
          <View style={styles.textContainer}>
            {props.origin === "discover" ? (
              <View style={styles.rating}>
                <StarIcon
                  color={Colors.gold}
                  classname={{ aspectRatio: 1, width: 10 }}
                />

                <Text style={styles.ratingText}>
                  {Number(props.trip.rating).toFixed(1)}
                </Text>
              </View>
            ) : (
              <Text style={[styles.date, isCurrent && styles.current]}>
                {new Date(props.trip.start_date).toLocaleDateString("pt-PT")}
              </Text>
            )}

            <Text style={[styles.title]}>{props.trip.name}</Text>
          </View>

          {props.members?.length > 1 && (
            <Pressable style={styles.icon} onPress={() => {}}>
              <ChatBubbleIcon color={Colors.white} classname={styles.icon} />
            </Pressable>
          )}

          {props.origin === "discover" && (
            <Image
              source={
                props.creator?.includes("/assets/")
                  ? require("@/assets/images/default-avatar.png")
                  : { uri: props.creator }
              }
              style={styles.avatar}
              contentFit="cover"
            />
          )}
        </View>
      </View>
    </View>
  );
}
