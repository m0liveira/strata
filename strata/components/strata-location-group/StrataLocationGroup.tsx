import React from "react";
import { View, ScrollView, StyleProp, ViewStyle } from "react-native";
import { styles } from "./styles";
import { Location } from "@/types/models/location-model";
import { StrataLocationCard } from "../strata-location-card/StrataLocationCard";
import { PinIcon } from "../icons";
import { Colors } from "@/constants/global-styles";

type LocationGroupProps = {
  classname?: StyleProp<ViewStyle>;
  locations: Location[];
  origin?: string;
  onPress?: (id: string | number) => void;
};

export function StrataLocationGroup(props: LocationGroupProps) {
  const renderLocations = () =>
    props.locations.map((location) => (
      <StrataLocationCard
        key={location.location_id}
        location={location}
        origin={props.origin}
        onPress={props.onPress}
      />
    ));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={styles.page}
      contentContainerStyle={[styles.scrollContent]}
    >
      <View style={styles.iconGroup}>
        <PinIcon color={Colors.grey400} classname={styles.icon} />

        <View style={styles.bar}></View>
      </View>

      <View style={styles.container}>{renderLocations()}</View>
    </ScrollView>
  );
}
