import React, { useState } from "react";
import {
  Pressable,
  StyleProp,
  Text,
  ViewStyle,
  Platform,
  View,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "./styles";
import { Colors } from "@/constants/global-styles";
import { ArrowIcon, PinIcon } from "@/components/icons";
import { Trip } from "@/types/models/trip-model";
import {
  getDayLabel,
  getMidnight,
  getTimeUntil,
} from "@/utils/generalFunctions";

type TripOverviewCardProps = {
  classname?: StyleProp<ViewStyle>;
  trip: Trip;
  locations: any[];
  onPress: () => void;
};

const getLocationDate = (loc: any, tripStartDate: string) => {
  if (loc.scheduled_time && loc.scheduled_time.includes("T")) {
    return new Date(loc.scheduled_time);
  }

  if (tripStartDate) {
    const baseDate = new Date(tripStartDate);
    baseDate.setDate(baseDate.getDate() + ((loc.day || 1) - 1));
    return baseDate;
  }

  return new Date();
};

export function StrataTripOverviewCard({
  classname,
  trip,
  locations,
  onPress,
}: TripOverviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const todayMidnight = getMidnight();
  const startDate = getMidnight(trip.start_date);
  const endDate = getMidnight(trip.end_date);
  const isCurrent = startDate <= todayMidnight && endDate >= todayMidnight;

  const imageSource = trip.banner?.startsWith("http")
    ? { uri: trip.banner }
    : require("@/assets/images/default-banner.png");

  const now = Date.now();
  const upcomingLocations = (locations || [])
    .map((loc) => ({
      ...loc,
      parsedDate: getLocationDate(loc, trip?.start_date),
    }))
    .filter((loc) => {
      if (!loc.parsedDate || isNaN(loc.parsedDate.getTime())) {
        return true;
      }

      if (loc.scheduled_time) {
        return loc.parsedDate.getTime() >= now;
      }

      const endOfDay = new Date(loc.parsedDate);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay.getTime() >= now;
    })
    .sort((a, b) => {
      if (a.day !== b.day) return (a.day || 1) - (b.day || 1);

      if (!a.scheduled_time && !b.scheduled_time) return 0;

      if (!a.scheduled_time) return 1;
      if (!b.scheduled_time) return -1;

      return a.parsedDate.getTime() - b.parsedDate.getTime();
    });

  const renderLocations = () => {
    if (!locations?.length) {
      return (
        <View style={styles.location}>
          <Text style={styles.label}>Add a spot to visit!</Text>
        </View>
      );
    }

    if (upcomingLocations.length === 0) {
      return (
        <View style={styles.location}>
          <Text style={styles.label}>All spots visited!</Text>
        </View>
      );
    }

    const locationsToRender = upcomingLocations.slice(0, isExpanded ? 10 : 3);
    
    return (
      <>
        {locationsToRender.map((loc) => (
          <View key={loc.location_id} style={styles.location}>
            <View style={styles.left}>
              <Text style={styles.label}>
                {getDayLabel(loc.parsedDate, todayMidnight)}
              </Text>
              <Text style={styles.text}>{loc.name}</Text>
            </View>

            <View style={styles.right}>
              <Text style={styles.label}>
                {loc.scheduled_time
                  ? loc.parsedDate.toLocaleTimeString("pt-PT", {
                      hour: "2-digit",
                      minute: "2-digit",
                      timeZone: "UTC",
                    })
                  : "TBD"}
              </Text>
              <Text style={styles.labelM}>
                {getTimeUntil(loc.scheduled_time)}
              </Text>
            </View>
          </View>
        ))}
      </>
    );
  };

  return (
    <View style={[styles.card, classname, isCurrent && styles.current]}>
      <Pressable
        android_ripple={{ color: "hsla(14, 91%, 100%, 0.3)", foreground: true }}
        style={({ pressed }) => [
          styles.imageContainer,
          Platform.OS === "ios" && pressed && { opacity: 0.3 },
        ]}
        onPress={onPress}
      >
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.85)"]}
          style={styles.gradient}
        />

        <View style={styles.tripContainer}>
          <View style={styles.textContainer}>
            <Text style={[styles.date, isCurrent && styles.current]}>
              {trip.start_date
                ? new Date(trip.start_date).toLocaleDateString("pt-PT")
                : isCurrent
                  ? "Ongoing"
                  : "TBD"}
            </Text>
            <Text style={styles.title}>{trip.name}</Text>
          </View>
          <ArrowIcon color={Colors.primaryDark} classname={styles.iconBg} />
        </View>
      </Pressable>

      <View style={styles.locationContainer}>
        <View style={styles.locations}>
          <View style={styles.iconGroup}>
            <PinIcon color={Colors.grey400} classname={styles.icon} />
            <View style={styles.bar}></View>
          </View>
          <View style={styles.container}>{renderLocations()}</View>
        </View>

        {upcomingLocations.length > 3 && (
          <Pressable
            android_ripple={{
              color: "hsla(14, 91%, 100%, 0.3)",
              foreground: true,
            }}
            style={({ pressed }) => [
              styles.expandable,
              Platform.OS === "ios" && pressed && { opacity: 0.3 },
            ]}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Text style={styles.expandText}>
              {isExpanded ? "See Less" : "See More"}
            </Text>
            <ArrowIcon
              color={Colors.grey300}
              classname={
                isExpanded ? styles.expandedIcon : styles.nonExpandedIcon
              }
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
