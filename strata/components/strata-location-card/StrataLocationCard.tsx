import React from "react";
import {
  Pressable,
  Text,
  View,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/global-styles";
import { styles } from "./styles";
import { Location } from "@/types/models/location-model";
import { QrCodeIcon } from "../icons";

type LocationCardProps = {
  classname?: StyleProp<ViewStyle>;
  location: Location;
  onPress?: (id: string | number) => void;
};

export function StrataLocationCard(props: LocationCardProps) {
  function getLocationTime() {
    if (!props.location.scheduled_time) {
      return "TBD";
    }

    const date = new Date(props.location.scheduled_time);

    return date.toLocaleTimeString("pt-PT", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
    });
  }

  return (
    <Pressable
      style={[styles.card, props.classname]}
      onPress={() => props.onPress?.(props.location.location_id)}
    >
      <View style={styles.textContainer}>
        <Text style={styles.labelText}>{getLocationTime()}</Text>

        <Text style={styles.text}>{props.location.name}</Text>
      </View>

      {props.location.ticket_url && (
        <Pressable
          onPress={() => {
            console.log("show ticket here");
          }}
        >
          <QrCodeIcon color={Colors.primaryDark} classname={styles.icon} />
        </Pressable>
      )}
    </Pressable>
  );
}
