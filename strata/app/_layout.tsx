import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { useLoadFonts } from "@/hooks/useLoadFonts";

export default function RootLayout() {
  useEffect(() => {
    const setup = async () => {
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync("transparent");
      await NavigationBar.setBehaviorAsync("overlay-swipe");
    };
    setup();
  }, []);

  const colorScheme = useColorScheme();
  const fontsLoaded = useLoadFonts();

  if (!fontsLoaded) {
    return null;
  }

  const screenOptions: NativeStackNavigationOptions = {
    animation: "none",
    headerShown: false,
  };

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="pages/get-started" />
        <Stack.Screen name="pages/login" />
        <Stack.Screen name="pages/register" />
        <Stack.Screen name="pages/user-profile" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
