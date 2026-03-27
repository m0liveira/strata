import { Image } from "expo-image";
import { Platform, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { WaveSVG } from "@/components/svgs";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Theme } from "@/constants/global-styles";

export default function Dashboard() {
  const colorScheme = useColorScheme();

  return (
    <>
      <WaveSVG
        colors={{
          primary: Theme[colorScheme ?? "light"].coral500,
          secondary: Theme[colorScheme ?? "light"].coral100,
          tertiary: Theme[colorScheme ?? "light"].coral900,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
