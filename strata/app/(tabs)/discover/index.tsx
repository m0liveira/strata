import { Platform, StyleSheet, Text } from "react-native";

import { Fonts } from "@/constants/global-styles";

export default function Discover() {
  return (
    <><Text>Heloo</Text></>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
});
