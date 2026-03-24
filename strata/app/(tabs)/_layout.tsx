import { Tabs } from "expo-router";
import React from "react";
import { HapticTab } from "@/components/haptic-tab";
import { Theme } from "@/constants/global-styles";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useFonts } from "expo-font";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Manrope: require("@/assets/fonts/ManropeVariableFont.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Theme[colorScheme ?? "light"].coral500,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="house.fill" color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          // tabBarIcon: ({ color }) => (
          //   <IconSymbol size={28} name="paperplane.fill" color={color} />
          // ),
        }}
      />
    </Tabs>
  );
}
