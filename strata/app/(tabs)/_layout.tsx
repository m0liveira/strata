import { Tabs } from "expo-router";
import React from "react";
import { Image } from "react-native";
import { HapticTab } from "@/components/haptic-tab";
import { Colors, BorderRadius, Typography } from "@/constants/global-styles";
import { useLoadFonts } from "@/hooks/useLoadFonts";
import { SquaresIcon, PlaneIcon, CompassIcon } from "@/components/icons";

export const screenOptions = {
  tabBarActiveTintColor: Colors.coral500,
  tabBarInactiveTintColor: Colors.grey400,
  headerShown: false,
  tabBarButton: HapticTab,
  tabBarStyle: {
    position: "absolute",
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.lg,
    borderTopRightRadius: BorderRadius.lg,
    borderTopWidth: 0,
    elevation: 10,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    height: 94,
    paddingTop: 20,
    paddingBottom: 36,
    paddingHorizontal: 10,
  },
  tabBarLabelStyle: {
    ...Typography.labelS,
    marginTop: 4,
  },
} as const;

export default function TabLayout() {
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs screenOptions={screenOptions}>
      <Tabs.Screen
        name="dashboard/index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => (
            <SquaresIcon color={color} classname={{ width: 22, height: 22 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="my-trips/index"
        options={{
          title: "My Trips",
          tabBarIcon: ({ color }) => (
            <PlaneIcon color={color} classname={{ width: 28, height: 28 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="discover/index"
        options={{
          title: "Discover",
          tabBarIcon: ({ color }) => (
            <CompassIcon color={color} classname={{ width: 22, height: 22 }} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Profile",
          tabBarIcon: ({ focused }) => (
            <Image
              source={require("@/assets/images/default-avatar.png")}
              style={{
                borderColor: Colors.coral500,
                borderWidth: focused ? 2 : 0,
                borderRadius: BorderRadius.full,
                aspectRatio: 1,
                width: 22,
                height: 22,
              }}
            />
          ),
        }}
      />
    </Tabs>
  );
}
