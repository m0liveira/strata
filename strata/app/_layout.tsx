import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";

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
  const [fontsLoaded] = useFonts({
    Manrope: require("@/assets/fonts/ManropeVariableFont.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  const screenOptions: NativeStackNavigationOptions = {
    animation: "slide_from_right",
    headerShown: false,
  };

  return (
    <ThemeProvider value={colorScheme === "light" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={screenOptions}>
        <Stack.Screen name="index" />
        <Stack.Screen name="pages/get-started" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
