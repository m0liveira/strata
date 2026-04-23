import React from "react";
import {
  Pressable,
  StyleProp,
  Text,
  TextStyle,
  ViewStyle,
  Platform,
  View,
  Image,
  ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { ArrowIcon, BarbellIcon, CoinIcon, WalkIcon } from "@/components/icons";
import { Trip } from "@/types/models/trip-model";

type TripCardProps = {
  classname?: StyleProp<ViewStyle>;
  trip: Trip;
  onPress: () => void;
};

export function TripCard(props: TripCardProps) {
  const tripInfo = [
    {
      icon: (
        <BarbellIcon color={Colors.secondaryDark} classname={styles.icon} />
      ),
      label: props.trip.intensity_level,
      category: "Intensity",
    },
    {
      icon: <CoinIcon color={Colors.secondaryDark} classname={styles.icon} />,
      label: props.trip.budget_level,
      category: "Budget",
    },
    {
      icon: <WalkIcon color={Colors.secondaryDark} classname={styles.icon} />,
      label: props.trip.travel_style,
      category: "Style",
    },
  ];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(props.trip.start_date);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(props.trip.end_date);
  endDate.setHours(0, 0, 0, 0);

  const isCurrent = startDate <= today && endDate >= today;

  return (
    <Pressable
      android_ripple={{
        color: "hsla(14, 91%, 100%, 0.3)",
        foreground: true,
      }}
      style={({ pressed }) => [
        styles.card,
        props.classname,
        isCurrent && styles.current,
        Platform.OS === "ios" && pressed && { opacity: 0.3 },
      ]}
      onPress={props.onPress}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: props.trip.banner }}
          style={styles.image}
          resizeMode="cover"
        />

        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        />

        <View style={styles.tripContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.date, isCurrent && styles.current]}>
              {new Date(props.trip.start_date).toLocaleDateString("pt-PT")}
            </Text>

            <Text style={[styles.title]}>{props.trip.name}</Text>
          </View>

          <ArrowIcon color={Colors.primaryDark} classname={styles.iconBg} />
        </View>
      </View>

      <View style={styles.infoContainer}>
        {tripInfo.map((info, index) => (
          <View key={index} style={styles.iconContainer}>
            {info.icon}

            <View style={styles.info}>
              <Text style={styles.label}>{info.label}</Text>
              <Text style={styles.category}>{info.category}</Text>
            </View>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
